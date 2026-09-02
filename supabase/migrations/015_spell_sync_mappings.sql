-- Mapping serveur séparé des fiches catalogue et de leur historique.
create table public.spell_sync_mappings (
  class_name text not null check (length(btrim(class_name)) > 0),
  catalogue_spell_id bigint not null check (catalogue_spell_id > 0),
  server_spell_id bigint,
  replaces_server_spell_id bigint,
  origine text not null check (origine in ('native_inchange', 'native_modifie', 'personnalise', 'non_configuree')),
  shortcut_position integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (class_name, catalogue_spell_id),
  constraint spell_sync_server_id_requires_configuration check (
    (server_spell_id is null and origine = 'non_configuree')
    or (server_spell_id is not null and origine <> 'non_configuree')
  ),
  constraint spell_sync_shortcut_position_nonnegative check (shortcut_position is null or shortcut_position >= 0)
);

alter table public.spell_sync_mappings enable row level security;
revoke all on table public.spell_sync_mappings from public, anon, authenticated;
grant select, insert, update on table public.spell_sync_mappings to authenticated;

create policy spell_sync_mappings_authenticated_read
  on public.spell_sync_mappings for select to authenticated
  using ((select auth.uid()) is not null);
create policy spell_sync_mappings_authenticated_insert
  on public.spell_sync_mappings for insert to authenticated
  with check ((select auth.uid()) is not null);
create policy spell_sync_mappings_authenticated_update
  on public.spell_sync_mappings for update to authenticated
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Lecture publique sans identité ; les fiches non configurées ne sont pas déduites.
create view public.public_spell_sync_mappings
with (security_barrier = true)
as
select class_name, catalogue_spell_id, server_spell_id, replaces_server_spell_id, origine, shortcut_position
from public.spell_sync_mappings;

revoke all on table public.public_spell_sync_mappings from public, anon, authenticated;
grant select on table public.public_spell_sync_mappings to anon, authenticated;

comment on table public.spell_sync_mappings is 'Mapping persistant catalogue-vers-serveur, sans impact sur les fiches ni leur historique.';
comment on column public.spell_sync_mappings.shortcut_position is 'Position de raccourci full_morphs.spells, convertie de l hexadecimal en entier decimal.';
