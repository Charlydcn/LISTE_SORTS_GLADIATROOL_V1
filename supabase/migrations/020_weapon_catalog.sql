-- Catalogue collaboratif des armes au corps à corps par classe.
begin;

alter table public.entity_overrides
  drop constraint entity_overrides_entity_type_check,
  add constraint entity_overrides_entity_type_check check (entity_type in ('spell', 'spell_position', 'class_stat', 'tonic', 'weapon')),
  drop constraint entity_overrides_allowed_field,
  add constraint entity_overrides_allowed_field check (
    (entity_type = 'spell' and field_key in (
      'nom', 'pa', 'po', 'porteeModifiable', 'lancerEnLigne', 'ligneDeVue',
      'cc', 'ec', 'relance', 'parTour', 'parCible', 'icone', 'effets.normaux', 'effets.critiques'
    ))
    or (entity_type = 'spell_position' and field_key = 'position')
    or (entity_type = 'class_stat' and field_key in (
      'vie', 'pa', 'pm', 'vitalite', 'sagesse', 'force', 'intelligence', 'chance', 'agilite', 'initiative'
    ))
    or (entity_type = 'tonic' and field_key in ('title', 'effects', 'spellId'))
    or (entity_type = 'weapon' and field_key in ('pa', 'cc', 'bonusCc', 'typeArme', 'effets'))
  );

alter table public.change_history
  drop constraint change_history_entity_type_check,
  add constraint change_history_entity_type_check
    check (entity_type in ('spell', 'spell_position', 'class_stat', 'tonic', 'weapon', 'import'));

create or replace function public.apply_override(
  p_entity_type text,
  p_entity_key text,
  p_field_key text,
  p_new_value jsonb,
  p_baseline_value jsonb
)
returns table (override_id uuid, history_id uuid, saved_at timestamptz, author_label text, was_changed boolean)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_label text;
  v_existing public.entity_overrides%rowtype;
  v_old jsonb;
  v_new jsonb := coalesce(p_new_value, 'null'::jsonb);
  v_baseline jsonb := coalesce(p_baseline_value, 'null'::jsonb);
  v_history uuid;
  v_override uuid;
  v_now timestamptz := clock_timestamp();
  v_exists boolean;
begin
  if p_entity_type not in ('tonic', 'weapon') then
    return query select * from public.apply_override_without_tonic(p_entity_type, p_entity_key, p_field_key, p_new_value, p_baseline_value);
    return;
  end if;
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if nullif(p_entity_key, '') is null then raise exception 'Invalid entity' using errcode = '22023'; end if;

  if p_entity_type = 'tonic' then
    if p_field_key not in ('title', 'effects', 'spellId') then raise exception 'Invalid tonic field' using errcode = '22023'; end if;
    if p_field_key = 'title' and (jsonb_typeof(v_new) <> 'string' or nullif(btrim(v_new #>> '{}'), '') is null) then raise exception 'Title is required' using errcode = '22023'; end if;
    if p_field_key = 'effects' and (jsonb_typeof(v_new) <> 'array' or exists (select 1 from jsonb_array_elements(v_new) e where jsonb_typeof(e.value) <> 'string')) then raise exception 'Effects must be text lines' using errcode = '22023'; end if;
    if p_field_key = 'spellId' and jsonb_typeof(v_new) not in ('number', 'null') then raise exception 'Spell ID must be a number or null' using errcode = '22023'; end if;
  else
    if p_field_key not in ('pa', 'cc', 'bonusCc', 'typeArme', 'effets') then raise exception 'Invalid weapon field' using errcode = '22023'; end if;
    if p_field_key = 'pa' and (jsonb_typeof(v_new) <> 'number' or (v_new #>> '{}')::numeric < 0) then raise exception 'PA must be a non-negative number' using errcode = '22023'; end if;
    if p_field_key in ('cc', 'bonusCc') and jsonb_typeof(v_new) <> 'string' then raise exception 'Weapon values must be text' using errcode = '22023'; end if;
    if p_field_key = 'typeArme' and v_new #>> '{}' not in ('Arc', 'Baguette', 'Bâton', 'Dagues', 'Épée', 'Hache', 'Marteau', 'Pelle') then raise exception 'Unknown weapon type' using errcode = '22023'; end if;
    if p_field_key = 'effets' and (jsonb_typeof(v_new) <> 'array' or exists (select 1 from jsonb_array_elements(v_new) e where jsonb_typeof(e.value) <> 'string')) then raise exception 'Weapon effects must be text lines' using errcode = '22023'; end if;
  end if;

  v_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  perform pg_advisory_xact_lock(hashtextextended(concat_ws(chr(31), p_entity_type, p_entity_key, p_field_key), 0));
  select * into v_existing from public.entity_overrides
    where entity_type = p_entity_type and entity_key = p_entity_key and field_key = p_field_key for update;
  v_exists := found;
  v_old := case when v_exists then v_existing.value else v_baseline end;
  if v_old = v_new then
    return query select case when v_exists then v_existing.id else null::uuid end, null::uuid, v_now, v_label, false;
    return;
  end if;

  insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
  values (p_entity_type, p_entity_key, p_field_key, v_old, v_new, v_now, v_user_id, v_label)
  returning id into v_history;
  insert into public.entity_overrides(entity_type, entity_key, field_key, value, previous_value, updated_at, updated_by, updated_by_label)
  values (p_entity_type, p_entity_key, p_field_key, v_new, v_old, v_now, v_user_id, v_label)
  on conflict (entity_type, entity_key, field_key) do update set value = excluded.value, previous_value = excluded.previous_value, updated_at = excluded.updated_at, updated_by = excluded.updated_by, updated_by_label = excluded.updated_by_label
  returning id into v_override;
  return query select v_override, v_history, v_now, v_label, true;
end; $$;

create or replace function public.reset_overrides(p_targets jsonb)
returns integer
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_author_label text;
  v_target jsonb;
  v_entity_type text;
  v_entity_key text;
  v_field_key text;
  v_baseline_value jsonb;
  v_existing public.entity_overrides%rowtype;
  v_reset_count integer := 0;
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if jsonb_typeof(p_targets) <> 'array' then raise exception 'Targets must be an array' using errcode = '22023'; end if;
  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  for v_target in select item.value from jsonb_array_elements(p_targets) as item(value) order by item.value ->> 'entity_type', item.value ->> 'entity_key', item.value ->> 'field_key' loop
    v_entity_type := v_target ->> 'entity_type';
    v_entity_key := v_target ->> 'entity_key';
    v_field_key := v_target ->> 'field_key';
    v_baseline_value := coalesce(v_target -> 'baseline_value', 'null'::jsonb);
    if v_entity_type not in ('spell', 'spell_position', 'class_stat', 'weapon') or nullif(v_entity_key, '') is null or nullif(v_field_key, '') is null then
      raise exception 'Invalid reset target' using errcode = '22023';
    end if;
    perform pg_advisory_xact_lock(hashtextextended(concat_ws(chr(31), v_entity_type, v_entity_key, v_field_key), 0));
    select * into v_existing from public.entity_overrides where entity_type = v_entity_type and entity_key = v_entity_key and field_key = v_field_key for update;
    if not found then continue; end if;
    if v_existing.value <> v_baseline_value then
      insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
      values (v_entity_type, v_entity_key, v_field_key, v_existing.value, v_baseline_value, clock_timestamp(), v_user_id, v_author_label);
    end if;
    delete from public.entity_overrides where id = v_existing.id;
    v_reset_count := v_reset_count + 1;
  end loop;
  return v_reset_count;
end; $$;

create or replace function public.reset_spell_class(
  p_class_name text,
  p_native_spell_ids bigint[],
  p_targets jsonb
)
returns table (reset_count integer, deleted_custom_count integer, restored_native_count integer)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_user_id uuid := auth.uid();
  v_custom_ids text[];
  v_native_ids text[];
  v_all_spell_ids text[];
  v_reset_count integer;
  v_deleted_custom_count integer;
  v_restored_native_count integer;
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if nullif(btrim(p_class_name), '') is null or p_native_spell_ids is null or jsonb_typeof(p_targets) <> 'array' then raise exception 'Invalid class reset' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended('reset_spell_class:' || p_class_name, 0));
  select coalesce(array_agg(id::text order by id), '{}'::text[]) into v_custom_ids from public.created_spells where class_name = p_class_name;
  select coalesce(array_agg(id::text order by id), '{}'::text[]) into v_native_ids from unnest(p_native_spell_ids) id;
  v_all_spell_ids := v_native_ids || v_custom_ids;
  select public.reset_overrides(p_targets) into v_reset_count;
  select count(*)::integer into v_deleted_custom_count from public.created_spells where class_name = p_class_name;
  select count(*)::integer into v_restored_native_count from public.deleted_native_spells where class_name = p_class_name;
  delete from public.entity_overrides
  where (entity_type = 'spell' and entity_key = any(v_all_spell_ids))
     or (entity_type = 'spell_position' and left(entity_key, length(p_class_name) + 1) = p_class_name || '/')
     or (entity_type = 'class_stat' and entity_key = p_class_name)
     or (entity_type = 'weapon' and entity_key = p_class_name);
  delete from public.spell_comments where spell_id = any(v_custom_ids);
  delete from public.created_spells where class_name = p_class_name;
  delete from public.deleted_native_spells where class_name = p_class_name;
  return query select v_reset_count, v_deleted_custom_count, v_restored_native_count;
end; $$;

revoke all on function public.apply_override(text, text, text, jsonb, jsonb), public.reset_overrides(jsonb), public.reset_spell_class(text, bigint[], jsonb) from public, anon;
grant execute on function public.apply_override(text, text, text, jsonb, jsonb), public.reset_overrides(jsonb), public.reset_spell_class(text, bigint[], jsonb) to authenticated;

commit;
