-- La migration 009 écrit les changements d'ordre dans l'historique.
begin;

alter table public.change_history
  drop constraint change_history_entity_type_check,
  add constraint change_history_entity_type_check
    check (entity_type in ('spell', 'spell_position', 'class_stat'));

commit;
