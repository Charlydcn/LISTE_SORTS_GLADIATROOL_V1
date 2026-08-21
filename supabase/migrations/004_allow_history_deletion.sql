-- Les administrateurs peuvent supprimer une ligne d'historique depuis l'interface.
grant delete on table public.change_history to authenticated;

create policy change_history_authenticated_delete
  on public.change_history for delete to authenticated
  using ((select auth.uid()) is not null);

comment on table public.change_history is
  'Journal d’audit. Les nouvelles lignes sont créées uniquement par les RPC métier; les administrateurs peuvent supprimer une ligne depuis l’interface.';
