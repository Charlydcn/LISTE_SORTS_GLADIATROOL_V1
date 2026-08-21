-- L'historique est un journal d'audit immuable : aucun client ne peut en supprimer des lignes.
drop policy if exists change_history_authenticated_delete on public.change_history;
revoke delete on table public.change_history from authenticated;

comment on table public.change_history is
  'Journal d’audit immuable. Les nouvelles lignes sont créées uniquement par les RPC métier.';
