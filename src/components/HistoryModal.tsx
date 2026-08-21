import { useEffect, useRef, useState } from "react";
import type { HistoryRow } from "../types";
import { useHistoryStore } from "../lib/historyStore";
import { useSessionStore } from "../lib/sessionStore";
import { useDataStore } from "../lib/dataStore";
import { useToastStore } from "../lib/toastStore";
import { CLASSES } from "../lib/dataService";
import { errorMessage, fieldLabel, formatDate, valueText } from "../lib/utils";

function DeleteHistoryButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      await useHistoryStore.getState().remove(id);
      useToastStore.getState().showToast("Ligne d’historique supprimée.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
      setBusy(false);
      setConfirming(false);
    }
  }

  function handleClick() {
    if (confirming) {
      void remove();
      return;
    }
    setConfirming(true);
    window.setTimeout(() => setConfirming(false), 4000);
  }

  return (
    <button
      type="button"
      className={`danger-link ${confirming ? "confirming" : ""}`}
      aria-label="Supprimer cette ligne d'historique"
      onClick={handleClick}
      disabled={busy}
    >
      {busy ? "Suppression…" : confirming ? "Vraiment ?" : "Supprimer"}
    </button>
  );
}

export function HistoryModal() {
  const rows = useHistoryStore((s) => s.rows);
  const hasMore = useHistoryStore((s) => s.hasMore);
  const filters = useHistoryStore((s) => s.filters);
  const classFilter = useHistoryStore((s) => s.classFilter);
  const search = useHistoryStore((s) => s.search);
  const loading = useHistoryStore((s) => s.loading);
  const error = useHistoryStore((s) => s.error);
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      void useHistoryStore.getState().reload();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  async function handleLoadMore() {
    try {
      await useHistoryStore.getState().loadMore();
    } catch (err) {
      useToastStore.getState().showToast(errorMessage(err), "error");
    }
  }

  function contextLabel(row: HistoryRow): string {
    return useHistoryStore.getState().contextLabel(row);
  }

  function renderRows() {
    if (!rows.length) {
      const overrideStillExists =
        filters &&
        useDataStore
          .getState()
          .hasOverride(filters.entityType, filters.entityKey, filters.fieldKey);
      if (overrideStillExists) {
        return (
          <p className="history-notice">
            Cette valeur est modifiée, mais son historique ne contient plus aucune ligne. Les
            lignes associées ont pu être supprimées.
          </p>
        );
      }
      return <p className="empty-state">Aucune modification enregistrée.</p>;
    }
    return (
      <div className="history-list">
        {rows.map((row) => (
          <article className="history-entry" key={row.id}>
            <div className="history-entry-head">
              <div>
                <strong>{contextLabel(row)}</strong>
                <span>{fieldLabel(row.field_key)}</span>
              </div>
              {isAdmin ? <DeleteHistoryButton id={row.id} /> : null}
            </div>
            <div className="history-values">
              <div>
                <small>Ancienne valeur</small>
                <pre>{valueText(row.old_value)}</pre>
              </div>
              <span className="history-arrow" aria-hidden="true">
                →
              </span>
              <div>
                <small>Nouvelle valeur</small>
                <pre>{valueText(row.new_value)}</pre>
              </div>
            </div>
            <p className="history-meta">
              {formatDate(row.changed_at)}
              {isAdmin ? ` · ${row.changed_by_label || "Auteur inconnu"}` : ""}
            </p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <>
      {!filters ? (
        <div className="history-controls">
          <div className="history-filter">
            <label htmlFor="history-class-filter">Classe</label>
            <select
              id="history-class-filter"
              value={classFilter}
              onChange={(event) => useHistoryStore.getState().setClassFilter(event.target.value)}
            >
              {["", ...CLASSES, "Sorts communs"].map((className) => (
                <option key={className} value={className}>
                  {className || "Toutes les classes"}
                </option>
              ))}
            </select>
          </div>
          <div className="history-search">
            <label className="sr-only" htmlFor="history-search">
              Rechercher dans l’historique
            </label>
            <input
              id="history-search"
              type="search"
              value={search}
              placeholder="Rechercher un sort, une classe, une propriété…"
              autoComplete="off"
              onChange={(event) => useHistoryStore.getState().setSearch(event.target.value)}
            />
          </div>
        </div>
      ) : null}
      {loading && rows.length === 0 ? (
        <p className="loading-state">Chargement de l’historique…</p>
      ) : error ? (
        <p className="error-box">{error}</p>
      ) : (
        <>
          {renderRows()}
          {hasMore ? (
            <button
              type="button"
              className="secondary-button load-more"
              disabled={loading}
              onClick={() => void handleLoadMore()}
            >
              {loading ? "Chargement…" : "Charger plus"}
            </button>
          ) : null}
        </>
      )}
    </>
  );
}
