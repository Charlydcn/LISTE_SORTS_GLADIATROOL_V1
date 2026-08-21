-- Annule la migration 007 et retire entièrement la description des sorts.
begin;

delete from public.change_history
where entity_type = 'spell' and field_key = 'description';

delete from public.entity_overrides
where entity_type = 'spell' and field_key = 'description';

update public.created_spells
set spell = spell - 'description'
where spell ? 'description';

drop function public.apply_override(text, text, text, jsonb, jsonb);

alter function public.apply_override_without_description(text, text, text, jsonb, jsonb)
  rename to apply_override;

revoke all on function public.apply_override(text, text, text, jsonb, jsonb)
  from public, anon;
grant execute on function public.apply_override(text, text, text, jsonb, jsonb)
  to authenticated;

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

commit;
