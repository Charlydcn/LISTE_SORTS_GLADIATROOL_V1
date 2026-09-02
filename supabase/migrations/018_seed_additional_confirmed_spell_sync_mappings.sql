insert into public.spell_sync_mappings (
  class_name, catalogue_spell_id, server_spell_id, replaces_server_spell_id, origine, scope, monster_template_id, shortcut_position
) values
  ('Xelor', 1000017, 10003, null, 'personnalise', 'morph', null, null),
  ('Xelor', 1000018, 10004, null, 'personnalise', 'morph', null, null),
  ('Iop', 1000020, 10019, null, 'personnalise', 'morph', null, 10),
  ('Iop', 1000023, 10022, null, 'personnalise', 'morph', null, 21),
  ('Enutrof', 1000016, 10011, null, 'personnalise', 'invocation', 238, null)
on conflict (class_name, catalogue_spell_id) do update set
  server_spell_id = excluded.server_spell_id,
  replaces_server_spell_id = excluded.replaces_server_spell_id,
  origine = excluded.origine,
  scope = excluded.scope,
  monster_template_id = excluded.monster_template_id,
  shortcut_position = excluded.shortcut_position,
  updated_at = now();
