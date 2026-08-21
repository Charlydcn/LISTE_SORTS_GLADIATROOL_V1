import { useState } from "react";
import type { OverrideRow } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useSessionStore } from "../lib/sessionStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import { removeStoredSpellImages } from "../lib/spellImageService";

interface ResetButtonProps {
  scope: string;
  resetKey: string | number;
}

export function ResetButton({ scope, resetKey }: ResetButtonProps) {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const overrides = useDataStore((s) => s.overrides);
  const spells = useDataStore((s) => s.spells);
  const commonSpells = useDataStore((s) => s.commonSpells);
  const baseSpells = useDataStore((s) => s.baseSpells);
  const baseCommonSpells = useDataStore((s) => s.baseCommonSpells);
  const createdSpells = useDataStore((s) => s.createdSpells);
  const deletedNativeSpells = useDataStore((s) => s.deletedNativeSpells);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;

  let rows: OverrideRow[] = [];
  if (scope === "spell") {
    rows = Object.values(overrides).filter(
      (row) => row.entity_type === "spell" && String(row.entity_key) === String(resetKey),
    );
  } else if (scope === "class-spells") {
    const ids = [...spells, ...commonSpells, ...baseSpells, ...baseCommonSpells]
      .filter((spell) => spell.classe === resetKey)
      .map((spell) => String(spell.id));
    rows = Object.values(overrides).filter(
      (row) => (row.entity_type === "spell" && ids.includes(String(row.entity_key)))
        || (row.entity_type === "spell_position" && row.entity_key.startsWith(`${String(resetKey)}/`))
        || (row.entity_type === "class_stat" && row.entity_key === String(resetKey)),
    );
  } else if (scope === "class-stats") {
    rows = Object.values(overrides).filter(
      (row) => row.entity_type === "class_stat" && String(row.entity_key) === String(resetKey),
    );
  }

  const customRows = scope === "class-spells"
    ? createdSpells.filter((row) => row.class_name === String(resetKey))
    : [];
  const restoredCount = scope === "class-spells"
    ? deletedNativeSpells.filter((row) => row.class_name === String(resetKey)).length
    : 0;
  const resetCount = rows.length + customRows.length + restoredCount;

  async function performReset() {
    setBusy(true);
    setConfirming(false);
    try {
      const count = scope === "class-spells"
        ? await useDataStore.getState().resetClass(String(resetKey))
        : await useDataStore.getState().reset(rows);
      const imageUrls = [
        ...rows.filter((row) => row.field_key === "icone").map((row) => row.value),
        ...customRows.map((row) => row.spell.icone),
      ];
      try {
        await removeStoredSpellImages(imageUrls);
      } catch (cleanupError) {
        console.error("Impossible de supprimer une icône réinitialisée :", cleanupError);
        useToastStore.getState().showToast(
          "Réinitialisation effectuée, mais un ancien fichier image n’a pas pu être supprimé.",
          "error",
        );
        return;
      }
      useToastStore
        .getState()
        .showToast(
          `${count} valeur${count > 1 ? "s" : ""} réinitialisée${count > 1 ? "s" : ""}.`,
          "success",
        );
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  function handleClick() {
    if (confirming) {
      void performReset();
      return;
    }
    setConfirming(true);
    window.setTimeout(() => setConfirming(false), 4000);
  }

  return (
    <button
      type="button"
      className={`reset-button ${confirming ? "confirming" : ""}`}
      disabled={resetCount === 0 || busy}
      onClick={handleClick}
    >
      {busy ? "Réinitialisation…" : confirming ? "Vraiment ?" : "Réinitialiser"}
    </button>
  );
}
