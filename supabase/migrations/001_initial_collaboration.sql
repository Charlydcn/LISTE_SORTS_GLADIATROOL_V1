-- Collaboration Gladiatrool : overrides, historique, commentaires et sécurité RLS.
create extension if not exists pgcrypto;

create table public.entity_overrides (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('spell', 'class_stat')),
  entity_key text not null check (length(entity_key) > 0),
  field_key text not null check (length(field_key) > 0),
  value jsonb not null,
  previous_value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid not null,
  updated_by_label text not null,
  constraint entity_overrides_entity_field_unique unique (entity_type, entity_key, field_key),
  constraint entity_overrides_allowed_field check (
    (entity_type = 'spell' and field_key in (
      'nom', 'pa', 'po', 'porteeModifiable', 'lancerEnLigne', 'ligneDeVue',
      'cc', 'ec', 'relance', 'parTour', 'parCible', 'effets.normaux', 'effets.critiques'
    ))
    or
    (entity_type = 'class_stat' and field_key in (
      'vie', 'pa', 'pm', 'vitalite', 'sagesse', 'force', 'intelligence',
      'chance', 'agilite', 'initiative'
    ))
  )
);

create table public.change_history (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('spell', 'class_stat')),
  entity_key text not null check (length(entity_key) > 0),
  field_key text not null check (length(field_key) > 0),
  old_value jsonb not null,
  new_value jsonb not null,
  changed_at timestamptz not null default now(),
  changed_by uuid not null,
  changed_by_label text not null
);

create table public.spell_comments (
  id uuid primary key default gen_random_uuid(),
  spell_id text not null check (length(spell_id) > 0),
  body text not null check (length(btrim(body)) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null,
  created_by_label text not null,
  updated_by uuid not null,
  updated_by_label text not null
);

create index change_history_entity_field_changed_idx
  on public.change_history (entity_type, entity_key, field_key, changed_at desc);
create index change_history_changed_at_idx on public.change_history (changed_at desc);
create index spell_comments_spell_created_idx on public.spell_comments (spell_id, created_at desc);

alter table public.entity_overrides enable row level security;
alter table public.change_history enable row level security;
alter table public.spell_comments enable row level security;

-- Les invités n'ont aucun droit sur les tables contenant les identités.
revoke all on table public.entity_overrides from public, anon, authenticated;
revoke all on table public.change_history from public, anon, authenticated;
revoke all on table public.spell_comments from public, anon, authenticated;

grant select on table public.entity_overrides to authenticated;
grant select, delete on table public.change_history to authenticated;
grant select, insert, update, delete on table public.spell_comments to authenticated;

create policy entity_overrides_authenticated_read
  on public.entity_overrides for select to authenticated
  using ((select auth.uid()) is not null);

create policy change_history_authenticated_read
  on public.change_history for select to authenticated
  using ((select auth.uid()) is not null);

create policy change_history_authenticated_delete
  on public.change_history for delete to authenticated
  using ((select auth.uid()) is not null);

create policy spell_comments_authenticated_read
  on public.spell_comments for select to authenticated
  using ((select auth.uid()) is not null);

create policy spell_comments_authenticated_insert
  on public.spell_comments for insert to authenticated
  with check ((select auth.uid()) is not null);

create policy spell_comments_authenticated_update
  on public.spell_comments for update to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

create policy spell_comments_authenticated_delete
  on public.spell_comments for delete to authenticated
  using ((select auth.uid()) is not null);

-- Vues volontairement limitées aux colonnes non identifiantes pour le rôle anon.
-- Elles s'exécutent avec les droits de leur propriétaire afin d'offrir la lecture publique
-- sans accorder le moindre SELECT sur les tables sources.
create view public.public_entity_overrides
with (security_barrier = true)
as
select id, entity_type, entity_key, field_key, value, previous_value, updated_at
from public.entity_overrides;

create view public.public_change_history
with (security_barrier = true)
as
select id, entity_type, entity_key, field_key, old_value, new_value, changed_at
from public.change_history;

revoke all on table public.public_entity_overrides from public, anon, authenticated;
revoke all on table public.public_change_history from public, anon, authenticated;
grant select on table public.public_entity_overrides to anon, authenticated;
grant select on table public.public_change_history to anon, authenticated;

create or replace function public.apply_override(
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
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);

  if p_entity_type not in ('spell', 'class_stat') or nullif(p_entity_key, '') is null then
    raise exception 'Invalid entity' using errcode = '22023';
  end if;

  if not (
    (p_entity_type = 'spell' and p_field_key in (
      'nom', 'pa', 'po', 'porteeModifiable', 'lancerEnLigne', 'ligneDeVue',
      'cc', 'ec', 'relance', 'parTour', 'parCible', 'effets.normaux', 'effets.critiques'
    ))
    or
    (p_entity_type = 'class_stat' and p_field_key in (
      'vie', 'pa', 'pm', 'vitalite', 'sagesse', 'force', 'intelligence',
      'chance', 'agilite', 'initiative'
    ))
  ) then
    raise exception 'Field is not editable' using errcode = '22023';
  end if;

  if p_entity_type = 'class_stat' and jsonb_typeof(v_new_value) <> 'number' then
    raise exception 'Class statistics must be numbers' using errcode = '22023';
  elsif p_entity_type = 'spell' and p_field_key = 'pa' and jsonb_typeof(v_new_value) <> 'number' then
    raise exception 'PA must be a number' using errcode = '22023';
  elsif p_entity_type = 'spell' and p_field_key in ('parTour', 'parCible')
    and jsonb_typeof(v_new_value) not in ('number', 'null') then
    raise exception 'Usage limits must be numbers or null' using errcode = '22023';
  elsif p_entity_type = 'spell' and p_field_key in ('porteeModifiable', 'lancerEnLigne', 'ligneDeVue')
    and jsonb_typeof(v_new_value) <> 'boolean' then
    raise exception 'This field must be boolean' using errcode = '22023';
  elsif p_entity_type = 'spell' and p_field_key in ('nom', 'po', 'cc', 'ec', 'relance')
    and jsonb_typeof(v_new_value) <> 'string' then
    raise exception 'This field must be text' using errcode = '22023';
  elsif p_entity_type = 'spell' and p_field_key in ('effets.normaux', 'effets.critiques') then
    if jsonb_typeof(v_new_value) <> 'array' then
      raise exception 'Effects must be an array' using errcode = '22023';
    end if;
    if exists (
      select 1 from jsonb_array_elements(v_new_value) as effect(value)
      where jsonb_typeof(effect.value) <> 'string'
    ) then
      raise exception 'Every effect must be text' using errcode = '22023';
    end if;
  end if;

  -- Sérialise uniquement les écritures visant exactement la même propriété.
  perform pg_advisory_xact_lock(hashtextextended(concat_ws(chr(31), p_entity_type, p_entity_key, p_field_key), 0));

  select * into v_existing
  from public.entity_overrides
  where entity_type = p_entity_type
    and entity_key = p_entity_key
    and field_key = p_field_key
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

  insert into public.change_history (
    entity_type, entity_key, field_key, old_value, new_value,
    changed_at, changed_by, changed_by_label
  ) values (
    p_entity_type, p_entity_key, p_field_key, v_old_value, v_new_value,
    v_saved_at, v_user_id, v_author_label
  ) returning id into v_history_id;

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
      p_entity_type, p_entity_key, p_field_key, v_new_value, v_old_value,
      v_saved_at, v_user_id, v_author_label
    ) returning id into v_override_id;
  end if;

  return query select v_override_id, v_history_id, v_saved_at, v_author_label, true;
end;
$$;

revoke all on function public.apply_override(text, text, text, jsonb, jsonb) from public, anon;
grant execute on function public.apply_override(text, text, text, jsonb, jsonb) to authenticated;

create or replace function public.set_spell_comment_system_fields()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_author_label text;
  v_now timestamptz := clock_timestamp();
begin
  if v_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  v_author_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  new.body := btrim(new.body);

  if tg_op = 'INSERT' then
    new.created_at := v_now;
    new.created_by := v_user_id;
    new.created_by_label := v_author_label;
  else
    new.spell_id := old.spell_id;
    new.created_at := old.created_at;
    new.created_by := old.created_by;
    new.created_by_label := old.created_by_label;
  end if;

  new.updated_at := v_now;
  new.updated_by := v_user_id;
  new.updated_by_label := v_author_label;
  return new;
end;
$$;

create trigger spell_comments_system_fields
before insert or update on public.spell_comments
for each row execute function public.set_spell_comment_system_fields();

comment on view public.public_entity_overrides is 'Vue anon sans UUID/email des auteurs.';
comment on view public.public_change_history is 'Historique anon sans UUID/email des auteurs.';
comment on function public.apply_override(text, text, text, jsonb, jsonb) is 'Écriture atomique last-write-wins : historique puis override dans la même transaction.';
