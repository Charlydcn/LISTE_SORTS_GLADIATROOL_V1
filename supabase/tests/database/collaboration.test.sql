begin;
select plan(40);

-- Les migrations sont rejouées par `supabase test db` dans une base locale neuve.
select has_table('public', 'entity_overrides', 'La table des overrides existe après les migrations');
select has_table('public', 'change_history', 'La table d historique existe après les migrations');
select has_table('public', 'spell_comments', 'La table des commentaires existe après les migrations');
select has_view('public', 'public_entity_overrides', 'La vue publique des overrides existe');
select has_view('public', 'public_change_history', 'La vue publique de l historique existe');
select is(
  (select public from storage.buckets where id = 'spell-images'),
  true,
  'Le bucket des icones est public en lecture'
);
select is(
  (select file_size_limit from storage.buckets where id = 'spell-images'),
  2097152::bigint,
  'Le bucket limite les images a 2 Mo'
);

select ok(has_table_privilege('anon', 'public.public_entity_overrides', 'select'), 'anon lit la vue publique des overrides');
select ok(has_table_privilege('anon', 'public.public_change_history', 'select'), 'anon lit la vue publique de l historique');
select ok(not has_table_privilege('anon', 'public.entity_overrides', 'select'), 'anon ne lit pas la table privée overrides');
select ok(not has_table_privilege('anon', 'public.change_history', 'select'), 'anon ne lit pas la table privée historique');
select ok(not has_function_privilege('anon', 'public.apply_override(text,text,text,jsonb,jsonb)', 'execute'), 'anon ne peut pas appeler apply_override');
select ok(not has_function_privilege('anon', 'public.reset_overrides(jsonb)', 'execute'), 'anon ne peut pas appeler reset_overrides');
select ok(not has_function_privilege('anon', 'public.apply_spell_icon_override(text,text,jsonb)', 'execute'), 'anon ne modifie pas les icones');

select ok(has_table_privilege('authenticated', 'public.entity_overrides', 'select'), 'authenticated lit les overrides privés');
select ok(has_table_privilege('authenticated', 'public.change_history', 'delete'), 'authenticated peut supprimer l historique');
select ok(has_table_privilege('authenticated', 'public.spell_comments', 'select,insert,update,delete'), 'authenticated gère les commentaires');
select ok(has_function_privilege('authenticated', 'public.apply_override(text,text,text,jsonb,jsonb)', 'execute'), 'authenticated peut appeler apply_override');
select ok(has_function_privilege('authenticated', 'public.reset_overrides(jsonb)', 'execute'), 'authenticated peut appeler reset_overrides');
select ok(has_function_privilege('authenticated', 'public.apply_spell_icon_override(text,text,jsonb)', 'execute'), 'authenticated modifie les icones');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select set_config('request.jwt.claim.email', 'admin@example.test', true);
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@example.test","role":"authenticated"}', true);

select throws_ok(
  $$select * from public.apply_override('spell', '390', 'pa', '"six"'::jsonb, '4'::jsonb)$$,
  '22023', 'PA must be a number', 'apply_override valide le type des champs'
);

select is(
  (select was_changed from public.apply_override('spell', '390', 'pa', '6'::jsonb, '4'::jsonb)),
  true, 'Une nouvelle valeur crée un override'
);
select is(
  (select count(*) from public.change_history where entity_type = 'spell' and entity_key = '390' and field_key = 'pa'),
  1::bigint, 'Une modification crée une ligne d historique'
);

select is(
  (select was_changed from public.apply_override('spell_position', 'Feca/390', 'position', '8'::jsonb, '1'::jsonb)),
  true, 'La position d un sort est persistée'
);
select is(
  (select value from public.entity_overrides where entity_type = 'spell_position' and entity_key = 'Feca/390' and field_key = 'position'),
  '8'::jsonb, 'La position est indépendante de l identifiant global du sort'
);
select is(
  public.reset_overrides('[
    {"entity_type":"spell_position","entity_key":"Feca/390","field_key":"position","baseline_value":1}
  ]'::jsonb),
  1, 'Le reset accepte une position de sort'
);
select is(
  (select count(*) from public.entity_overrides where entity_type = 'spell_position' and entity_key = 'Feca/390' and field_key = 'position'),
  0::bigint, 'Le reset supprime l override de position'
);
select is(
  (select count(*) from public.change_history where entity_type = 'spell_position' and entity_key = 'Feca/390' and field_key = 'position'),
  2::bigint, 'Le reset de position est historisé'
);
select is(
  (select was_changed from public.apply_override('spell', '390', 'pa', '6'::jsonb, '4'::jsonb)),
  false, 'Une valeur identique est ignorée'
);
select is(
  (select count(*) from public.change_history where entity_type = 'spell' and entity_key = '390' and field_key = 'pa'),
  1::bigint, 'Une valeur identique ne crée pas d historique'
);

select is(
  (select was_changed from public.apply_spell_icon_override(
    '390',
    'http://127.0.0.1:54321/storage/v1/object/public/spell-images/390/test.svg',
    '"assets/img/spells/390.svg"'::jsonb
  )),
  true,
  'Une icone cree un override dedie'
);
select is(
  (select count(*) from public.change_history where entity_type = 'spell' and entity_key = '390' and field_key = 'icone'),
  0::bigint,
  'Une modification d icone ne cree pas d historique'
);
select is(
  public.reset_overrides('[
    {"entity_type":"spell","entity_key":"390","field_key":"icone","baseline_value":"assets/img/spells/390.svg"}
  ]'::jsonb),
  1,
  'Le reset generique supprime l override d icone'
);
select is(
  (select count(*) from public.change_history where entity_type = 'spell' and entity_key = '390' and field_key = 'icone'),
  0::bigint,
  'Le reset d icone ne cree pas d historique'
);

select lives_ok(
  $$select * from public.apply_override('spell', '391', 'pa', '7'::jsonb, '4'::jsonb)$$,
  'Une seconde cible peut être préparée avant un reset atomique'
);
select is(
  public.reset_overrides('[
    {"entity_type":"spell","entity_key":"390","field_key":"pa","baseline_value":4},
    {"entity_type":"spell","entity_key":"391","field_key":"pa","baseline_value":4}
  ]'::jsonb),
  2, 'reset_overrides réinitialise atomiquement le groupe de cibles'
);
select is(
  (select count(*) from public.entity_overrides where entity_type = 'spell' and entity_key in ('390', '391') and field_key = 'pa'),
  0::bigint, 'Le reset supprime les overrides du groupe'
);
select lives_ok(
  $$delete from public.change_history where id = (
    select id from public.change_history where entity_type = 'spell' and entity_key = '390' limit 1
  )$$,
  'authenticated peut supprimer une ligne d historique'
);
select lives_ok(
  $$insert into public.spell_comments (spell_id, body, created_by, created_by_label, updated_by, updated_by_label)
    values ('390', '  Commentaire JWT  ', '00000000-0000-0000-0000-000000000000', 'faux', '00000000-0000-0000-0000-000000000000', 'faux')$$,
  'Les champs système des commentaires sont renseignés côté PostgreSQL'
);
select is(
  (select created_by_label from public.spell_comments where spell_id = '390'),
  'admin@example.test', 'Le libellé du commentaire provient du JWT'
);

select * from finish();
rollback;
