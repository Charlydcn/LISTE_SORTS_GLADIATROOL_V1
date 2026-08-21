-- Les réinitialisations de classe comprennent les positions personnalisées des sorts.
-- `spell_position` est accepté par apply_override depuis la migration 009, mais
-- la procédure de reset initiale ne l'autorisait pas encore.
create or replace function public.reset_overrides(p_targets jsonb)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
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
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if jsonb_typeof(p_targets) <> 'array' then
    raise exception 'Targets must be an array' using errcode = '22023';
  end if;

  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);

  for v_target in
    select item.value
    from jsonb_array_elements(p_targets) as item(value)
    order by item.value ->> 'entity_type', item.value ->> 'entity_key', item.value ->> 'field_key'
  loop
    v_entity_type := v_target ->> 'entity_type';
    v_entity_key := v_target ->> 'entity_key';
    v_field_key := v_target ->> 'field_key';
    v_baseline_value := coalesce(v_target -> 'baseline_value', 'null'::jsonb);

    if v_entity_type not in ('spell', 'spell_position', 'class_stat')
      or nullif(v_entity_key, '') is null
      or nullif(v_field_key, '') is null then
      raise exception 'Invalid reset target' using errcode = '22023';
    end if;

    perform pg_advisory_xact_lock(
      hashtextextended(concat_ws(chr(31), v_entity_type, v_entity_key, v_field_key), 0)
    );

    select * into v_existing
    from public.entity_overrides
    where entity_type = v_entity_type
      and entity_key = v_entity_key
      and field_key = v_field_key
    for update;

    if not found then
      continue;
    end if;

    if v_existing.value <> v_baseline_value then
      insert into public.change_history (
        entity_type, entity_key, field_key, old_value, new_value,
        changed_at, changed_by, changed_by_label
      ) values (
        v_entity_type, v_entity_key, v_field_key,
        v_existing.value, v_baseline_value,
        clock_timestamp(), v_user_id, v_author_label
      );
    end if;

    delete from public.entity_overrides where id = v_existing.id;
    v_reset_count := v_reset_count + 1;
  end loop;

  return v_reset_count;
end;
$$;

revoke all on function public.reset_overrides(jsonb) from public, anon;
grant execute on function public.reset_overrides(jsonb) to authenticated;
