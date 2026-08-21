import { useState } from "react";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { SpellIcon } from "./icons";
import { TrashIcon } from "./icons";
import { useSessionStore } from "../lib/sessionStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";

interface SpellTileProps {
  spell: Spell;
  selected: boolean;
  onSelect: () => void;
}

export function SpellTile({ spell, selected, onSelect }: SpellTileProps) {
  const overrides = useDataStore((s) => s.overrides);
  const hasActiveOverride = Object.values(overrides).some(
    (row) => row.entity_type === "spell" && String(row.entity_key) === String(spell.id),
  );
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function remove(event: React.MouseEvent) {
    event.stopPropagation();
    if (!confirming) { setConfirming(true); return; }
    setBusy(true);
    try { await useDataStore.getState().deleteSpell(spell); useToastStore.getState().showToast("Sort supprimé.", "success"); }
    catch (error) { useToastStore.getState().showToast(errorMessage(error), "error"); setConfirming(false); }
    finally { setBusy(false); }
  }

  return (
    <div
      className={`spell-tile ${selected ? "selected" : ""} ${hasActiveOverride ? "is-overridden" : ""}`}
      onClick={onSelect}
    >
      <div className="spell-tile-icon">
        <SpellIcon spell={spell} />
      </div>
      <span className="spell-tile-name">{spell.nom}</span>
      {isAdmin ? <button type="button" className="spell-delete" aria-label={confirming ? `Confirmer la suppression de ${spell.nom}` : `Supprimer ${spell.nom}`} title={confirming ? "Confirmer la suppression" : "Supprimer"} disabled={busy} onClick={(event) => void remove(event)}>{confirming ? "✓" : <TrashIcon />}</button> : null}
    </div>
  );
}
