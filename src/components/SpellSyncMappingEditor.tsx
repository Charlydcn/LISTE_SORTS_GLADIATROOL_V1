import { useEffect, useState } from "react";
import type { Spell, SpellSyncMapping, SpellSyncOrigin } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";

const origins: Array<{ value: SpellSyncOrigin; label: string }> = [
  { value: "non_configuree", label: "Non configurée" },
  { value: "native_inchange", label: "Native inchangée" },
  { value: "native_modifie", label: "Native modifiée" },
  { value: "personnalise", label: "Personnalisée" },
];

function nullableInteger(value: string, label: string): number | null {
  if (!value.trim()) return null;
  if (!/^\d+$/.test(value.trim())) throw new Error(`${label} doit être un entier positif ou nul.`);
  return Number(value);
}

export function SpellSyncMappingEditor({ spell }: { spell: Spell }) {
  const existing = useDataStore((state) => state.spellSyncMappings.find(
    (item) => item.class_name === spell.classe && item.catalogue_spell_id === spell.id,
  ));
  const [origin, setOrigin] = useState<SpellSyncOrigin>(existing?.origine ?? "non_configuree");
  const [serverId, setServerId] = useState(existing?.server_spell_id?.toString() ?? "");
  const [replacesId, setReplacesId] = useState(existing?.replaces_server_spell_id?.toString() ?? "");
  const [shortcutPosition, setShortcutPosition] = useState(existing?.shortcut_position?.toString() ?? "");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOrigin(existing?.origine ?? "non_configuree");
    setServerId(existing?.server_spell_id?.toString() ?? "");
    setReplacesId(existing?.replaces_server_spell_id?.toString() ?? "");
    setShortcutPosition(existing?.shortcut_position?.toString() ?? "");
  }, [existing]);

  async function save() {
    setBusy(true);
    try {
      const serverSpellId = origin === "non_configuree" ? null : nullableInteger(serverId, "ID serveur");
      if (origin !== "non_configuree" && serverSpellId === null) throw new Error("Un ID serveur est requis.");
      const mapping: SpellSyncMapping = {
        class_name: spell.classe,
        catalogue_spell_id: spell.id,
        server_spell_id: serverSpellId,
        replaces_server_spell_id: nullableInteger(replacesId, "ID remplacé"),
        origine: origin,
        shortcut_position: nullableInteger(shortcutPosition, "Position de raccourci"),
      };
      await useDataStore.getState().saveSpellSyncMapping(mapping);
      useToastStore.getState().showToast("Mapping serveur enregistré.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <details className="spell-sync-mapping">
      <summary>Synchronisation serveur</summary>
      <p>Identité catalogue : #{spell.id}. La position est le raccourci serveur converti depuis l’hexadécimal, pas le rang visuel.</p>
      <div className="spell-sync-grid">
        <label>Nature<select value={origin} onChange={(event) => setOrigin(event.target.value as SpellSyncOrigin)}>{origins.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label>ID sort serveur<input disabled={origin === "non_configuree"} value={serverId} inputMode="numeric" onChange={(event) => setServerId(event.target.value)} /></label>
        <label>ID serveur remplacé<input value={replacesId} inputMode="numeric" onChange={(event) => setReplacesId(event.target.value)} /></label>
        <label>Position raccourci<input value={shortcutPosition} inputMode="numeric" onChange={(event) => setShortcutPosition(event.target.value)} /></label>
      </div>
      <button className="secondary-button" type="button" disabled={busy} onClick={() => void save()}>{busy ? "Enregistrement…" : "Enregistrer le mapping"}</button>
    </details>
  );
}
