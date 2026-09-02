drop view public.public_spell_sync_mappings;

create view public.public_spell_sync_mappings
with (security_barrier = true)
as
select class_name, catalogue_spell_id, server_spell_id, replaces_server_spell_id, origine, scope, monster_template_id, shortcut_position
from public.spell_sync_mappings;

revoke all on table public.public_spell_sync_mappings from public, anon, authenticated;
grant select on table public.public_spell_sync_mappings to anon, authenticated;
