alter table public.spell_sync_mappings
  add column scope text not null default 'morph' check (scope in ('morph', 'invocation')),
  add column monster_template_id bigint;

alter table public.spell_sync_mappings
  add constraint spell_sync_scope_context check (
    (scope = 'morph' and monster_template_id is null)
    or (scope = 'invocation' and monster_template_id is not null and shortcut_position is null and replaces_server_spell_id is null)
  );

comment on column public.spell_sync_mappings.scope is 'morph pour un sort actif de full_morphs, invocation pour un sort porté par un template monstre.';
comment on column public.spell_sync_mappings.monster_template_id is 'Template monstre porteur pour un mapping scope=invocation.';
