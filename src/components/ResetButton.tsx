import { useState } from "react";
import type { OverrideRow } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useSessionStore } from "../lib/sessionStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";

interface ResetButtonProps {
  scope: string;
  resetKey: string | number;
}

export function ResetButton({ scope, resetKey }: ResetButtonProps) {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const overrides = useDataStore((s) => s.overrides);
  const spells = useDataStore((s) => s.spells);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!isAdmin) return null;

  let rows: OverrideRow[] = [];
  if (scope === "spell") {
    rows = Object.values(overrides).filter(
      (row) => row.entity_type === "spell" && String(row.entity_key) === String(resetKey),
    );
  } else if (scope === "class-spells") {
    const ids = spells
      .filter((spell) => spell.classe === resetKey)
      .map((spell) => String(spell.id));
    rows = Object.values(overrides).filter(
      (row) => row.entity_type === "spell" && ids.includes(String(row.entity_key)),
    );
  } else if (scope === "class-stats") {
    rows = Object.values(overrides).filter(
      (row) => row.entity_type === "class_stat" && String(row.entity_key) === String(resetKey),
    );
  }

  const overrideCount = rows.length;

  async function performReset() {
    setBusy(true);
    setConfirming(false);
    try {
      const count = await useDataStore.getState().reset(rows);
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
      disabled={overrideCount === 0 || busy}
      onClick={handleClick}
    >
      {busy ? "Réinitialisation…" : confirming ? "Vraiment ?" : "Réinitialiser"}
    </button>
  );
}
