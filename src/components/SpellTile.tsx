import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { DragHandleIcon, SpellIcon, TrashIcon } from "./icons";
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(spell.id),
    disabled: !isAdmin,
  });

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
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`spell-tile ${selected ? "selected" : ""} ${hasActiveOverride ? "is-overridden" : ""} ${isDragging ? "is-dragging" : ""}`}
      onClick={onSelect}
    >
      <div className="spell-tile-icon">
        <SpellIcon spell={spell} />
      </div>
      <span className="spell-tile-name">{spell.nom}</span>
      {isAdmin ? <><button type="button" className="spell-drag-handle" aria-label={`Déplacer ${spell.nom}`} title="Glisser-déposer pour déplacer" onClick={(event) => event.stopPropagation()} {...attributes} {...listeners}><DragHandleIcon /></button><button type="button" className="spell-delete" aria-label={confirming ? `Confirmer la suppression de ${spell.nom}` : `Supprimer ${spell.nom}`} title={confirming ? "Confirmer la suppression" : "Supprimer"} disabled={busy} onClick={(event) => void remove(event)}>{confirming ? "✓" : <TrashIcon />}</button></> : null}
    </div>
  );
}
