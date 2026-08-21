-- Icônes personnalisées des sorts : bucket public, écritures authentifiées et override sans historique.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'spell-images',
  'spell-images',
  true,
  2097152,
  array['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy spell_images_authenticated_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'spell-images' and (select auth.uid()) is not null);

create policy spell_images_authenticated_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'spell-images' and (select auth.uid()) is not null);

alter table public.entity_overrides
  drop constraint entity_overrides_allowed_field;

alter table public.entity_overrides
  add constraint entity_overrides_allowed_field check (
    (entity_type = 'spell' and field_key in (
      'nom', 'pa', 'po', 'porteeModifiable', 'lancerEnLigne', 'ligneDeVue',
      'cc', 'ec', 'relance', 'parTour', 'parCible', 'icone',
      'effets.normaux', 'effets.critiques'
    ))
    or
    (entity_type = 'class_stat' and field_key in (
      'vie', 'pa', 'pm', 'vitalite', 'sagesse', 'force', 'intelligence',
      'chance', 'agilite', 'initiative'
    ))
  );

create or replace function public.apply_spell_icon_override(
  p_entity_key text,
  p_new_value text,
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
  v_new_value jsonb := to_jsonb(p_new_value);
  v_baseline_value jsonb := coalesce(p_baseline_value, 'null'::jsonb);
  v_override_id uuid;
  v_saved_at timestamptz := clock_timestamp();
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  if nullif(p_entity_key, '') is null or nullif(p_new_value, '') is null then
    raise exception 'Invalid spell image' using errcode = '22023';
  end if;

  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  perform pg_advisory_xact_lock(hashtextextended(concat_ws(chr(31), 'spell', p_entity_key, 'icone'), 0));

  select * into v_existing
  from public.entity_overrides
  where entity_type = 'spell' and entity_key = p_entity_key and field_key = 'icone'
  for update;
  v_exists := found;
  v_old_value := case when v_exists then v_existing.value else v_baseline_value end;

  if v_old_value = v_new_value then
    return query select
      case when v_exists then v_existing.id else null::uuid end,
      null::uuid,
      case when v_exists then v_existing.updated_at else v_saved_at end,
      v_author_label,
      false;
    return;
  end if;

  if v_exists then
    update public.entity_overrides
    set value = v_new_value,
        previous_value = v_old_value,
        updated_at = v_saved_at,
        updated_by = v_user_id,
        updated_by_label = v_author_label
    where id = v_existing.id
    returning id into v_override_id;
  else
    insert into public.entity_overrides (
      entity_type, entity_key, field_key, value, previous_value,
      updated_at, updated_by, updated_by_label
    ) values (
      'spell', p_entity_key, 'icone', v_new_value, v_old_value,
      v_saved_at, v_user_id, v_author_label
    ) returning id into v_override_id;
  end if;

  return query select v_override_id, null::uuid, v_saved_at, v_author_label, true;
end;
$$;

revoke all on function public.apply_spell_icon_override(text, text, jsonb) from public, anon;
grant execute on function public.apply_spell_icon_override(text, text, jsonb) to authenticated;

-- Le reset générique tente d'insérer une ligne d'historique : on ignore uniquement celles des icônes.
create or replace function public.skip_spell_icon_history()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if new.entity_type = 'spell' and new.field_key = 'icone' then
    return null;
  end if;
  return new;
end;
$$;

create trigger skip_spell_icon_history
before insert on public.change_history
for each row execute function public.skip_spell_icon_history();

comment on function public.apply_spell_icon_override(text, text, jsonb) is
  'Remplace l icône effective d un sort sans créer d historique.';
