-- Ordre de présentation indépendant par classe, y compris pour les sorts partagés.
begin;

alter table public.entity_overrides
  drop constraint entity_overrides_entity_type_check,
  add constraint entity_overrides_entity_type_check check (entity_type in ('spell', 'spell_position', 'class_stat'));

alter table public.entity_overrides
  drop constraint entity_overrides_allowed_field,
  add constraint entity_overrides_allowed_field check (
    (entity_type = 'spell' and field_key in (
      'nom', 'pa', 'po', 'porteeModifiable', 'lancerEnLigne', 'ligneDeVue',
      'cc', 'ec', 'relance', 'parTour', 'parCible', 'icone',
      'effets.normaux', 'effets.critiques'
    ))
    or (entity_type = 'spell_position' and field_key = 'position')
    or (entity_type = 'class_stat' and field_key in (
      'vie', 'pa', 'pm', 'vitalite', 'sagesse', 'force', 'intelligence',
      'chance', 'agilite', 'initiative'
    ))
  );

alter function public.apply_override(text, text, text, jsonb, jsonb)
  rename to apply_override_without_position;

create function public.apply_override(
  p_entity_type text,
  p_entity_key text,
  p_field_key text,
  p_new_value jsonb,
  p_baseline_value jsonb
)
returns table (
  override_id uuid,
  history_id uuid,
  saved_at timestamptz,
  author_label text,
  was_changed boolean
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_author_label text;
  v_existing public.entity_overrides%rowtype;
  v_exists boolean;
  v_old_value jsonb;
  v_new_value jsonb := coalesce(p_new_value, 'null'::jsonb);
  v_baseline_value jsonb := coalesce(p_baseline_value, 'null'::jsonb);
  v_history_id uuid;
  v_override_id uuid;
  v_saved_at timestamptz := clock_timestamp();
begin
  if p_entity_type <> 'spell_position' then
    return query select * from public.apply_override_without_position(
      p_entity_type, p_entity_key, p_field_key, p_new_value, p_baseline_value
    );
    return;
  end if;

  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if nullif(p_entity_key, '') is null or p_entity_key !~ '^.+/[0-9]+$' or p_field_key <> 'position' then
    raise exception 'Invalid spell position' using errcode = '22023';
  end if;
  if jsonb_typeof(v_new_value) <> 'number' or (v_new_value #>> '{}') !~ '^[1-9][0-9]*$' then
    raise exception 'Position must be a positive integer' using errcode = '22023';
  end if;

  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  perform pg_advisory_xact_lock(hashtextextended(concat_ws(chr(31), p_entity_type, p_entity_key, p_field_key), 0));
  select * into v_existing from public.entity_overrides
  where entity_type = p_entity_type and entity_key = p_entity_key and field_key = p_field_key for update;
  v_exists := found;
  v_old_value := case when v_exists then v_existing.value else v_baseline_value end;
  if v_old_value = v_new_value then
    return query select case when v_exists then v_existing.id else null::uuid end, null::uuid,
      case when v_exists then v_existing.updated_at else v_saved_at end, v_author_label, false;
    return;
  end if;

  insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
  values (p_entity_type, p_entity_key, p_field_key, v_old_value, v_new_value, v_saved_at, v_user_id, v_author_label)
  returning id into v_history_id;
  if v_exists then
    update public.entity_overrides set value = v_new_value, previous_value = v_old_value, updated_at = v_saved_at,
      updated_by = v_user_id, updated_by_label = v_author_label where id = v_existing.id returning id into v_override_id;
  else
    insert into public.entity_overrides(entity_type, entity_key, field_key, value, previous_value, updated_at, updated_by, updated_by_label)
    values (p_entity_type, p_entity_key, p_field_key, v_new_value, v_old_value, v_saved_at, v_user_id, v_author_label)
    returning id into v_override_id;
  end if;
  return query select v_override_id, v_history_id, v_saved_at, v_author_label, true;
end;
$$;

revoke all on function public.apply_override_without_position(text, text, text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.apply_override(text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.apply_override(text, text, text, jsonb, jsonb) to authenticated;

commit;
