import { useRef, useState, type ChangeEvent } from "react";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import {
  buildImportPayload,
  exportClass,
  exportGlobalAuditV2,
  exportGlobal,
  exportSpell,
  transferSnapshot,
} from "../lib/spellTransfer";

function snapshot() {
  return transferSnapshot(useDataStore.getState());
}

export function ExportGlobalButton() {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      await exportGlobal(snapshot());
      useToastStore.getState().showToast("Export global téléchargé.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" className="toolbar-button" disabled={busy} onClick={() => void run()}>{busy ? "Export…" : "Exporter tout"}</button>;
}

export function ExportAuditV2Button() {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      await exportGlobalAuditV2(snapshot());
      useToastStore.getState().showToast("Export d’audit v2 téléchargé.", "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" className="toolbar-button" disabled={busy} onClick={() => void run()}>{busy ? "Export…" : "Export audit v2"}</button>;
}

export function ExportClassButton({ className }: { className: string }) {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      await exportClass(className, snapshot());
      useToastStore.getState().showToast(`Export de ${className} téléchargé.`, "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" className="transfer-button" disabled={busy} onClick={() => void run()}>{busy ? "Export…" : "Exporter"}</button>;
}

export function ExportSpellButton({ spell }: { spell: Spell }) {
  const [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      await exportSpell(spell, snapshot());
      useToastStore.getState().showToast(`Export du sort #${spell.id} téléchargé.`, "success");
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }
  return <button type="button" className="transfer-button" disabled={busy} onClick={() => void run()}>{busy ? "Export…" : "Exporter ce sort"}</button>;
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
