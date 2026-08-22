-- Import atomique des exports versionnés, sans import d'images et avec un seul événement d'historique.
begin;

alter table public.change_history
  drop constraint change_history_entity_type_check,
  add constraint change_history_entity_type_check
    check (entity_type in ('spell', 'spell_position', 'class_stat', 'import'));

create function public.import_spell_dump(p_dump jsonb)
returns table (created_count integer, updated_count integer, summary jsonb)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_label text;
  v_now timestamptz := clock_timestamp();
  v_class jsonb;
  v_spell_entry jsonb;
  v_class_name text;
  v_id bigint;
  v_native boolean;
  v_spell jsonb;
  v_baseline jsonb;
  v_existing public.created_spells%rowtype;
  v_field text;
  v_new jsonb;
  v_base jsonb;
  v_current jsonb;
  v_position jsonb;
  v_base_position jsonb;
  v_class_created integer;
  v_class_updated integer;
  v_class_stats_updated integer;
  v_spell_changed boolean;
  v_spell_created boolean;
  v_summary jsonb := '{}'::jsonb;
  v_created integer := 0;
  v_updated integer := 0;
  v_stats jsonb;
  v_base_stats jsonb;
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(p_dump) <> 'object'
     or p_dump ->> 'formatVersion' <> '1'
     or jsonb_typeof(p_dump -> 'classes') <> 'array'
     or jsonb_array_length(p_dump -> 'classes') = 0 then
    raise exception 'Invalid dump format' using errcode = '22023';
  end if;

  v_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  perform pg_advisory_xact_lock(hashtextextended('import_spell_dump', 0));

  for v_class in select value from jsonb_array_elements(p_dump -> 'classes') loop
    v_class_name := btrim(v_class ->> 'className');
    if v_class_name not in ('Feca','Osamodas','Enutrof','Sram','Xelor','Ecaflip','Eniripsa','Iop','Crâ','Sadida','Sacrieur','Pandawa','Sorts communs')
       or jsonb_typeof(v_class -> 'spells') <> 'array' then
      raise exception 'Invalid imported class' using errcode = '22023';
    end if;
    v_class_created := 0;
    v_class_updated := 0;
    v_class_stats_updated := 0;

    for v_spell_entry in select value from jsonb_array_elements(v_class -> 'spells') loop
      if jsonb_typeof(v_spell_entry -> 'id') <> 'number'
         or (v_spell_entry ->> 'id') !~ '^[1-9][0-9]*$'
         or jsonb_typeof(v_spell_entry -> 'native') <> 'boolean'
         or jsonb_typeof(v_spell_entry -> 'spell') <> 'object' then
        raise exception 'Invalid imported spell' using errcode = '22023';
      end if;
      v_id := (v_spell_entry ->> 'id')::bigint;
      v_native := (v_spell_entry ->> 'native')::boolean;
      v_spell := v_spell_entry -> 'spell';
      v_baseline := v_spell_entry -> 'baseline';
      v_position := v_spell -> 'position';

      if nullif(btrim(v_spell ->> 'nom'), '') is null
         or jsonb_typeof(v_spell -> 'pa') not in ('number', 'string')
         or jsonb_typeof(v_spell -> 'po') <> 'string'
         or jsonb_typeof(v_spell -> 'porteeModifiable') <> 'boolean'
         or jsonb_typeof(v_spell -> 'lancerEnLigne') <> 'boolean'
         or jsonb_typeof(v_spell -> 'ligneDeVue') <> 'boolean'
         or jsonb_typeof(v_spell -> 'cc') <> 'string'
         or jsonb_typeof(v_spell -> 'ec') <> 'string'
         or jsonb_typeof(v_spell -> 'relance') <> 'string'
         or jsonb_typeof(v_spell -> 'effets') <> 'array'
         or (v_position is not null and (jsonb_typeof(v_position) <> 'number' or (v_position #>> '{}') !~ '^[1-9][0-9]*$')) then
        raise exception 'Invalid imported spell fields for #% ', v_id using errcode = '22023';
      end if;

      v_spell_changed := false;
      v_spell_created := false;
      if v_native then
        if jsonb_typeof(v_baseline) <> 'object' then raise exception 'Missing native baseline for #% ', v_id using errcode = '22023'; end if;
        if exists (select 1 from public.created_spells where id = v_id) then
          raise exception 'Native ID conflicts with a custom spell: %', v_id using errcode = '22023';
        end if;
        delete from public.deleted_native_spells where class_name = v_class_name and spell_id = v_id;
        if found then v_spell_changed := true; end if;

        foreach v_field in array array['nom','pa','po','porteeModifiable','lancerEnLigne','ligneDeVue','cc','ec','relance','parTour','parCible','effets.normaux','effets.critiques'] loop
          if v_field = 'effets.normaux' then
            select coalesce(jsonb_agg(item -> 'texte' order by ord), '[]'::jsonb) into v_new
            from jsonb_array_elements(v_spell -> 'effets') with ordinality effect(item, ord) where item ->> 'onglet' = 'normaux';
            select coalesce(jsonb_agg(item -> 'texte' order by ord), '[]'::jsonb) into v_base
            from jsonb_array_elements(v_baseline -> 'effets') with ordinality effect(item, ord) where item ->> 'onglet' = 'normaux';
          elsif v_field = 'effets.critiques' then
            select coalesce(jsonb_agg(item -> 'texte' order by ord), '[]'::jsonb) into v_new
            from jsonb_array_elements(v_spell -> 'effets') with ordinality effect(item, ord) where item ->> 'onglet' = 'critiques';
            select coalesce(jsonb_agg(item -> 'texte' order by ord), '[]'::jsonb) into v_base
            from jsonb_array_elements(v_baseline -> 'effets') with ordinality effect(item, ord) where item ->> 'onglet' = 'critiques';
          else
            v_new := coalesce(v_spell -> v_field, 'null'::jsonb);
            v_base := coalesce(v_baseline -> v_field, 'null'::jsonb);
          end if;
          select value into v_current from public.entity_overrides
            where entity_type = 'spell' and entity_key = v_id::text and field_key = v_field;
          if not found then v_current := v_base; end if;
          if v_current is distinct from v_new then v_spell_changed := true; end if;
          if v_new = v_base then
            delete from public.entity_overrides where entity_type = 'spell' and entity_key = v_id::text and field_key = v_field;
          else
            insert into public.entity_overrides(entity_type, entity_key, field_key, value, previous_value, updated_at, updated_by, updated_by_label)
            values ('spell', v_id::text, v_field, v_new, v_current, v_now, v_user_id, v_label)
            on conflict (entity_type, entity_key, field_key) do update set
              value = excluded.value, previous_value = excluded.previous_value, updated_at = excluded.updated_at,
              updated_by = excluded.updated_by, updated_by_label = excluded.updated_by_label;
          end if;
        end loop;
        v_base_position := v_baseline -> 'position';
      else
        if v_id < 1000000 then raise exception 'Custom spell ID must be at least 1000000' using errcode = '22023'; end if;
        select * into v_existing from public.created_spells where id = v_id for update;
        if found then
          if v_existing.class_name <> v_class_name then raise exception 'Custom spell ID % already belongs to %', v_id, v_existing.class_name using errcode = '22023'; end if;
          v_spell := (v_spell - 'position' - 'icone') || jsonb_build_object('icone', coalesce(v_existing.spell -> 'icone', 'null'::jsonb));
          if v_existing.spell is distinct from v_spell then v_spell_changed := true; end if;
          update public.created_spells set spell = v_spell where id = v_id;
          delete from public.entity_overrides where entity_type = 'spell' and entity_key = v_id::text and field_key <> 'icone';
          v_base_position := v_existing.spell -> 'position';
        else
          v_spell := (v_spell - 'position' - 'icone') || jsonb_build_object('icone', null);
          insert into public.created_spells(id, class_name, spell, created_at, created_by, created_by_label)
            overriding system value values (v_id, v_class_name, v_spell, v_now, v_user_id, v_label);
          v_class_created := v_class_created + 1;
          v_created := v_created + 1;
          v_spell_created := true;
          v_base_position := null;
        end if;
      end if;

      if v_position is not null then
        select value into v_current from public.entity_overrides
          where entity_type = 'spell_position' and entity_key = v_class_name || '/' || v_id::text and field_key = 'position';
        if not found then v_current := v_base_position; end if;
        if v_current is distinct from v_position then v_spell_changed := true; end if;
        if v_native and v_position = v_base_position then
          delete from public.entity_overrides where entity_type = 'spell_position' and entity_key = v_class_name || '/' || v_id::text and field_key = 'position';
        else
          insert into public.entity_overrides(entity_type, entity_key, field_key, value, previous_value, updated_at, updated_by, updated_by_label)
          values ('spell_position', v_class_name || '/' || v_id::text, 'position', v_position, coalesce(v_current, 'null'::jsonb), v_now, v_user_id, v_label)
          on conflict (entity_type, entity_key, field_key) do update set
            value = excluded.value, previous_value = excluded.previous_value, updated_at = excluded.updated_at,
            updated_by = excluded.updated_by, updated_by_label = excluded.updated_by_label;
        end if;
      end if;
      if v_spell_changed and not v_spell_created then
        v_class_updated := v_class_updated + 1;
        v_updated := v_updated + 1;
      end if;
    end loop;

    v_stats := v_class -> 'stats';
    v_base_stats := v_class -> 'baselineStats';
    if v_class_name <> 'Sorts communs' and jsonb_typeof(v_stats) = 'object' and jsonb_typeof(v_base_stats) = 'object' then
      foreach v_field in array array['vie','pa','pm','vitalite','sagesse','force','intelligence','chance','agilite','initiative'] loop
        v_new := v_stats -> v_field;
        v_base := v_base_stats -> v_field;
        if jsonb_typeof(v_new) <> 'number' or jsonb_typeof(v_base) <> 'number' then raise exception 'Invalid class stats for %', v_class_name using errcode = '22023'; end if;
        select value into v_current from public.entity_overrides where entity_type = 'class_stat' and entity_key = v_class_name and field_key = v_field;
        if not found then v_current := v_base; end if;
        if v_current is distinct from v_new then
          v_class_stats_updated := v_class_stats_updated + 1;
        end if;
        if v_new = v_base then
          delete from public.entity_overrides where entity_type = 'class_stat' and entity_key = v_class_name and field_key = v_field;
        else
          insert into public.entity_overrides(entity_type, entity_key, field_key, value, previous_value, updated_at, updated_by, updated_by_label)
          values ('class_stat', v_class_name, v_field, v_new, v_current, v_now, v_user_id, v_label)
          on conflict (entity_type, entity_key, field_key) do update set value = excluded.value, previous_value = excluded.previous_value,
            updated_at = excluded.updated_at, updated_by = excluded.updated_by, updated_by_label = excluded.updated_by_label;
        end if;
      end loop;
    end if;

    if v_class_created > 0 or v_class_updated > 0 or v_class_stats_updated > 0 then
      v_summary := v_summary || jsonb_build_object(v_class_name, jsonb_build_object(
        'sortsCrees', v_class_created,
        'sortsModifies', v_class_updated,
        'caracteristiquesModifiees', v_class_stats_updated
      ));
    end if;
  end loop;

  perform setval(pg_get_serial_sequence('public.created_spells', 'id'),
    greatest(
      999999::bigint,
      coalesce((select max(id) from public.created_spells), 999999::bigint),
      (select last_value from public.created_spells_id_seq)
    ), true);

  if v_summary <> '{}'::jsonb then
    insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
    values ('import', gen_random_uuid()::text, '__import__', 'null'::jsonb,
      jsonb_build_object('utilisateur', v_label, 'classes', v_summary), v_now, v_user_id, v_label);
  end if;
  return query select v_created, v_updated, v_summary;
end;
$$;

revoke all on function public.import_spell_dump(jsonb) from public, anon;
grant execute on function public.import_spell_dump(jsonb) to authenticated;

comment on function public.import_spell_dump(jsonb) is
  'Import transactionnel des donnees finales d un export Gladiatrool; les images sont ignorees.';

commit;
