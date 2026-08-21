-- Sorts créés collaborativement et masquage réversible des sorts JSON.
create table public.created_spells (
  id bigint generated always as identity primary key,
  class_name text not null check (length(btrim(class_name)) > 0),
  spell jsonb not null,
  created_at timestamptz not null default now(),
  created_by uuid not null,
  created_by_label text not null
);

create table public.deleted_native_spells (
  class_name text not null,
  spell_id bigint not null,
  deleted_at timestamptz not null default now(),
  deleted_by uuid not null,
  deleted_by_label text not null,
  primary key (class_name, spell_id)
);

alter table public.created_spells enable row level security;
alter table public.deleted_native_spells enable row level security;
revoke all on table public.created_spells, public.deleted_native_spells from public, anon, authenticated;

create view public.public_created_spells with (security_barrier = true) as
select id, class_name, spell, created_at from public.created_spells;
create view public.public_deleted_native_spells with (security_barrier = true) as
select class_name, spell_id, deleted_at from public.deleted_native_spells;
revoke all on table public.public_created_spells, public.public_deleted_native_spells from public, anon, authenticated;
grant select on table public.public_created_spells, public.public_deleted_native_spells to anon, authenticated;

create or replace function public.create_spell(p_class_name text, p_spell jsonb)
returns table (spell_id bigint, spell jsonb, created_at timestamptz, author_label text)
language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user_id uuid := auth.uid(); v_label text; v_id bigint; v_now timestamptz := clock_timestamp();
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  if nullif(btrim(p_class_name), '') is null or jsonb_typeof(p_spell) <> 'object' then raise exception 'Invalid spell' using errcode = '22023'; end if;
  if coalesce(nullif(btrim(p_spell ->> 'nom'), ''), '') = '' then raise exception 'Spell name is required' using errcode = '22023'; end if;
  if jsonb_typeof(p_spell -> 'pa') <> 'number' or jsonb_typeof(p_spell -> 'po') <> 'string'
     or jsonb_typeof(p_spell -> 'cc') <> 'string' or jsonb_typeof(p_spell -> 'ec') <> 'string'
     or jsonb_typeof(p_spell -> 'relance') <> 'string'
     or jsonb_typeof(p_spell -> 'porteeModifiable') <> 'boolean' or jsonb_typeof(p_spell -> 'lancerEnLigne') <> 'boolean'
     or jsonb_typeof(p_spell -> 'ligneDeVue') <> 'boolean' or jsonb_typeof(p_spell -> 'effets') <> 'array' then
    raise exception 'Invalid spell fields' using errcode = '22023';
  end if;
  if not exists (select 1 from jsonb_array_elements(p_spell -> 'effets') item where item ->> 'onglet' = 'normaux' and nullif(btrim(item ->> 'texte'), '') is not null) then
    raise exception 'At least one normal effect is required' using errcode = '22023';
  end if;
  v_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  insert into public.created_spells(class_name, spell, created_at, created_by, created_by_label)
  values (btrim(p_class_name), p_spell - 'id' - 'classe' - 'morphId', v_now, v_user_id, v_label) returning id into v_id;
  insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
  values ('spell', v_id::text, '__created__', 'null', p_spell, v_now, v_user_id, v_label);
  return query select v_id, p_spell, v_now, v_label;
end; $$;

create or replace function public.delete_spell(p_spell_id bigint, p_class_name text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user_id uuid := auth.uid(); v_label text; v_custom public.created_spells%rowtype; v_now timestamptz := clock_timestamp();
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  v_label := coalesce(nullif(auth.jwt() ->> 'email', ''), v_user_id::text);
  select * into v_custom from public.created_spells where id = p_spell_id and class_name = p_class_name for update;
  if found then
    delete from public.entity_overrides where entity_type = 'spell' and entity_key = p_spell_id::text;
    delete from public.created_spells where id = p_spell_id;
    insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
    values ('spell', p_spell_id::text, '__deleted__', v_custom.spell, 'null', v_now, v_user_id, v_label);
  else
    insert into public.deleted_native_spells(class_name, spell_id, deleted_at, deleted_by, deleted_by_label)
    values (p_class_name, p_spell_id, v_now, v_user_id, v_label)
    on conflict (class_name, spell_id) do nothing;
    insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
    values ('spell', p_spell_id::text, '__deleted__', jsonb_build_object('class', p_class_name), 'null', v_now, v_user_id, v_label);
  end if;
end; $$;

create or replace function public.restore_native_spell(p_spell_id bigint, p_class_name text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
declare v_user_id uuid := auth.uid(); v_label text := coalesce(nullif(auth.jwt() ->> 'email', ''), auth.uid()::text); v_now timestamptz := clock_timestamp();
begin
  if v_user_id is null then raise exception 'Authentication required' using errcode = '42501'; end if;
  delete from public.deleted_native_spells where class_name = p_class_name and spell_id = p_spell_id;
  insert into public.change_history(entity_type, entity_key, field_key, old_value, new_value, changed_at, changed_by, changed_by_label)
  values ('spell', p_spell_id::text, '__restored__', 'null', jsonb_build_object('class', p_class_name), v_now, v_user_id, v_label);
end; $$;

revoke all on function public.create_spell(text, jsonb), public.delete_spell(bigint, text), public.restore_native_spell(bigint, text) from public, anon;
grant execute on function public.create_spell(text, jsonb), public.delete_spell(bigint, text), public.restore_native_spell(bigint, text) to authenticated;
