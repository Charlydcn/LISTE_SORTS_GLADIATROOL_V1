begin;
select plan(70);

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
select ok(not has_function_privilege('anon', 'public.reset_spell_class(text,bigint[],jsonb)', 'execute'), 'anon ne réinitialise pas une classe');
select ok(not has_function_privilege('anon', 'public.import_spell_dump(jsonb)', 'execute'), 'anon ne peut pas importer un dump');

select ok(has_table_privilege('authenticated', 'public.entity_overrides', 'select'), 'authenticated lit les overrides privés');
select ok(has_table_privilege('authenticated', 'public.change_history', 'delete'), 'authenticated peut supprimer l historique');
select ok(has_table_privilege('authenticated', 'public.spell_comments', 'select,insert,update,delete'), 'authenticated gère les commentaires');
select ok(has_function_privilege('authenticated', 'public.apply_override(text,text,text,jsonb,jsonb)', 'execute'), 'authenticated peut appeler apply_override');
select ok(has_function_privilege('authenticated', 'public.reset_overrides(jsonb)', 'execute'), 'authenticated peut appeler reset_overrides');
select ok(has_function_privilege('authenticated', 'public.apply_spell_icon_override(text,text,jsonb)', 'execute'), 'authenticated modifie les icones');
select ok(has_function_privilege('authenticated', 'public.reset_spell_class(text,bigint[],jsonb)', 'execute'), 'authenticated réinitialise une classe');
select ok(has_function_privilege('authenticated', 'public.import_spell_dump(jsonb)', 'execute'), 'authenticated peut importer un dump');

set local role authenticated;
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select set_config('request.jwt.claim.email', 'admin@example.test', true);
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@example.test","role":"authenticated"}', true);

select ok(
  (select spell_id >= 1000000 from public.create_spell('Feca', '{
    "nom":"Sort personnalisé", "pa":4, "po":"1 à 6", "cc":"1/50", "ec":"1/100", "relance":"0",
    "porteeModifiable":true, "lancerEnLigne":false, "ligneDeVue":true,
    "parTour":null, "parCible":null, "icone":null, "commun":false,
    "effets":[{"onglet":"normaux","texte":"Effet"}]
  }'::jsonb)),
  'Les nouveaux sorts utilisent la plage d identifiants personnalisés'
);
select lives_ok(
  $$select public.delete_spell(1, 'Feca')$$,
  'Un sort natif peut être masqué avant la réinitialisation de classe'
);
select lives_ok(
  $$select * from public.apply_override('spell_position', 'Feca/1', 'position', '8'::jsonb, '1'::jsonb)$$,
  'Une position peut être préparée avant la réinitialisation de classe'
);
select lives_ok(
  $$select * from public.apply_override('class_stat', 'Feca', 'vie', '900'::jsonb, '850'::jsonb)$$,
  'Une statistique peut être préparée avant la réinitialisation de classe'
);
create temporary table class_reset_result as
select * from public.reset_spell_class('Feca', array[1]::bigint[], '[]'::jsonb);
select is(
  (select (deleted_custom_count::text || '/' || restored_native_count::text) from class_reset_result),
  '1/1', 'Le reset supprime les sorts personnalisés et restaure les sorts natifs'
);
select is((select count(*) from public.created_spells where class_name = 'Feca'), 0::bigint, 'Le catalogue personnalisé de la classe est vide');
select is((select count(*) from public.deleted_native_spells where class_name = 'Feca'), 0::bigint, 'Tous les sorts natifs de la classe sont restaurés');
select is((select count(*) from public.entity_overrides where entity_type = 'spell_position' and entity_key like 'Feca/%'), 0::bigint, 'Toutes les positions de la classe sont supprimées');
select is((select count(*) from public.entity_overrides where entity_type = 'class_stat' and entity_key = 'Feca'), 0::bigint, 'Toutes les statistiques personnalisées de la classe sont supprimées');

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

select throws_ok(
  $$select * from public.import_spell_dump('{"formatVersion":1,"classes":[{"className":"Iop","stats":null,"baselineStats":null,"spells":[{"id":999,"className":"Iop","native":false,"baseline":null,"spell":{"nom":"Collision","pa":2,"po":"1","porteeModifiable":false,"lancerEnLigne":false,"ligneDeVue":true,"cc":"-","ec":"-","relance":"-","parTour":null,"parCible":null,"commun":false,"effets":[{"onglet":"normaux","texte":"Effet"}],"position":1}}]}]}'::jsonb)$$,
  '22023', 'Custom spell ID must be at least 1000000',
  'L import refuse un identifiant personnalisé dans la plage native'
);
select is((select count(*) from public.created_spells where id = 999), 0::bigint, 'Un import invalide ne laisse aucune écriture');

create temporary table spell_import_result as
select * from public.import_spell_dump('{"formatVersion":1,"classes":[{"className":"Iop","stats":null,"baselineStats":null,"spells":[{"id":390,"className":"Iop","native":true,"baseline":{"nom":"Natif","pa":4,"po":"1","porteeModifiable":false,"lancerEnLigne":false,"ligneDeVue":true,"cc":"-","ec":"-","relance":"-","parTour":null,"parCible":null,"effets":[{"onglet":"normaux","texte":"Base"}],"position":1},"spell":{"nom":"Natif importé","pa":5,"po":"1","porteeModifiable":false,"lancerEnLigne":false,"ligneDeVue":true,"cc":"-","ec":"-","relance":"-","parTour":null,"parCible":null,"commun":false,"effets":[{"onglet":"normaux","texte":"Import"}],"position":2}},{"id":1000500,"className":"Iop","native":false,"baseline":null,"spell":{"nom":"Custom importé","pa":3,"po":"1–4","porteeModifiable":true,"lancerEnLigne":false,"ligneDeVue":true,"cc":"1/50","ec":"1/100","relance":"-","parTour":null,"parCible":null,"commun":false,"effets":[{"onglet":"normaux","texte":"Effet"}],"position":3}}]}]}'::jsonb);
select is((select created_count::text || '/' || updated_count::text from spell_import_result), '1/1', 'L import récapitule les sorts créés et modifiés');
select is((select count(*) from public.created_spells where id = 1000500 and class_name = 'Iop'), 1::bigint, 'Le sort personnalisé conserve son identifiant exporté');
select is((select value from public.entity_overrides where entity_type = 'spell' and entity_key = '390' and field_key = 'pa'), '5'::jsonb, 'Les valeurs finales du sort natif sont importées');
select is((select value from public.entity_overrides where entity_type = 'spell_position' and entity_key = 'Iop/1000500'), '3'::jsonb, 'La position du sort personnalisé est importée');
select is((select count(*) from public.change_history where entity_type = 'import'), 1::bigint, 'Un import complet ne crée qu une ligne d historique');
select is((select new_value -> 'classes' -> 'Iop' ->> 'sortsCrees' from public.change_history where entity_type = 'import'), '1', 'L historique contient le résumé par classe');

select has_table('public', 'created_tonics', 'La table des toniques personnalisés existe');
select has_table('public', 'deleted_native_tonics', 'La table des toniques natifs supprimés existe');
select has_table('public', 'tonic_comments', 'La table des commentaires de toniques existe');
select has_view('public', 'public_created_tonics', 'La vue publique des toniques personnalisés existe');
select has_view('public', 'public_deleted_native_tonics', 'La vue publique des toniques natifs supprimés existe');
select lives_ok(
  $$select * from public.create_tonic('{"kind":"tonique","category":"palier1","className":null,"title":"Tonique test","effects":["+1 PA"],"spellId":null}'::jsonb)$$,
  'Un tonique personnalisé peut être créé'
);
select ok((select min(id) >= 1000000 from public.created_tonics), 'Les identifiants personnalisés commencent à 1000000');
select lives_ok(
  $$select * from public.apply_override('tonic', (select min(id)::text from public.created_tonics), 'title', '"Tonique modifié"'::jsonb, '"Tonique test"'::jsonb)$$,
  'Le titre d un tonique peut être modifié'
);
select is((select value #>> '{}' from public.entity_overrides where entity_type='tonic' and field_key='title' order by updated_at desc limit 1), 'Tonique modifié', 'La modification du tonique est enregistrée');

select * from finish();
rollback;
