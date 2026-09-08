import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useModalStore } from "../lib/modalStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import {
  buildImportPayload,
  exportClass,
  exportGlobalAuditV2,
  exportCharacteristics,
  exportSpell,
  transferSnapshot,
} from "../lib/spellTransfer";

function snapshot() {
  return transferSnapshot(useDataStore.getState());
}

function ExportOptions({ onExport }: { onExport: (includeImages: boolean) => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  async function choose(includeImages: boolean) {
    setBusy(true);
    useModalStore.getState().close();
    try {
      await onExport(includeImages);
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="export-options">
      <p>Choisis le format de téléchargement.</p>
      <div className="export-options-actions">
        <button type="button" className="transfer-button" disabled={busy} onClick={() => void choose(false)}>
          Sans image
          <small>JSON brut uniquement</small>
        </button>
        <button type="button" className="primary-button" disabled={busy} onClick={() => void choose(true)}>
          Avec image
          <small>Comportement actuel (ZIP)</small>
        </button>
      </div>
    </div>
  );
}

function openExportOptions(title: string, onExport: (includeImages: boolean) => Promise<void>) {
  useModalStore.getState().open(title, <ExportOptions onExport={onExport} />);
}

function ExportButton({ className, label, onExport }: { className: string; label: ReactNode; onExport: (includeImages: boolean) => Promise<void> }) {
  return <button type="button" className={className} onClick={() => openExportOptions("Options d’export", onExport)}>{label}</button>;
}

export function ExportCharacteristicsButton() {
  return <ExportButton className="toolbar-button" label="Exporter JSON" onExport={async () => { await exportCharacteristics(snapshot()); useToastStore.getState().showToast("Export des caractéristiques téléchargé.", "success"); }} />;
}

export function ExportAuditV2Button() {
  return <ExportButton className="toolbar-button" label="Full export" onExport={async () => { await exportGlobalAuditV2(snapshot()); useToastStore.getState().showToast("Export d’audit v2 téléchargé.", "success"); }} />;
}

export function ExportClassButton({ className }: { className: string }) {
  return <ExportButton className="transfer-button" label="Exporter" onExport={async (includeImages) => { await exportClass(className, snapshot(), includeImages); useToastStore.getState().showToast(`Export de ${className} téléchargé.`, "success"); }} />;
}

export function ExportSpellButton({ spell }: { spell: Spell }) {
  return <ExportButton className="transfer-button" label="Exporter ce sort" onExport={async (includeImages) => { await exportSpell(spell, snapshot(), includeImages); useToastStore.getState().showToast(`Export du sort #${spell.id} téléchargé.`, "success"); }} />;
}

export function ImportButton() {
  const input = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);

  async function selected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const state = useDataStore.getState();
      const payload = await buildImportPayload(
        file,
        [...state.baseSpells, ...state.baseCommonSpells],
        state.baseMorphStats,
      );
      const summary = await state.importDump(payload);
      useToastStore.getState().showToast(
        `Import terminé : ${summary.created} sort(s) créé(s), ${summary.updated} modifié(s).`,
        "success",
      );
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <input ref={input} className="sr-only" type="file" accept=".json,.zip,application/json,application/zip" onChange={(event) => void selected(event)} />
      <button type="button" className="toolbar-button" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Import…" : "Importer"}</button>
    </>
  );
}
