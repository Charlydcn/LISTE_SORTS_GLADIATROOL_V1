import { create } from "zustand";
import type { CreatedTonicRow, DeletedNativeTonicRow, OverrideRow, Tonic } from "../types";
import { cloneData } from "./dataService";
import { useSessionStore } from "./sessionStore";
import { supabase } from "./supabase";
import { errorMessage } from "./utils";
import { parseApplyOverrideResult, parseCreatedTonicRows, parseDeletedNativeTonicRows, parseOverrideRows, parseTonicData } from "./validation";

function key(entityKey: string, fieldKey: string) {
  return `${entityKey}\u0000${fieldKey}`;
}

function applyField(tonics: Tonic[], entityKey: string, fieldKey: string, value: unknown) {
  const tonic = tonics.find((item) => String(item.id) === entityKey);
  if (tonic) (tonic as unknown as Record<string, unknown>)[fieldKey] = cloneData(value);
}

interface TonicState {
  baseTonics: Tonic[];
  tonics: Tonic[];
  createdTonics: CreatedTonicRow[];
  deletedNativeTonics: DeletedNativeTonicRow[];
  overrides: Record<string, OverrideRow>;
  initialize: () => Promise<void>;
  save: (id: number, field: "title" | "effects" | "spellId", value: unknown) => Promise<void>;
  reset: (tonic: Tonic) => Promise<void>;
  createTonic: (tonic: Omit<Tonic, "id">) => Promise<Tonic>;
  deleteTonic: (tonic: Tonic) => Promise<void>;
  restoreNative: (tonic: Tonic) => Promise<void>;
  getEffectiveValue: (id: number | string, field: string) => unknown;
  getBaselineValue: (id: number | string, field: string) => unknown;
  getOverride: (id: number | string, field: string) => OverrideRow | undefined;
}

export const useTonicStore = create<TonicState>((set, get) => ({
  baseTonics: [], tonics: [], createdTonics: [], deletedNativeTonics: [], overrides: {},

  async initialize() {
    let baseline: Tonic[] = [];
    try {
      const response = await fetch("data/toniques.json");
      if (!response.ok) throw new Error("Impossible de charger toniques.json");
      const baseTonics = parseTonicData(await response.json(), "toniques.json");
      baseline = baseTonics;
      if (!supabase) { set({ baseTonics, tonics: cloneData(baseTonics) }); return; }
      const isAdmin = useSessionStore.getState().isAdmin();
      const overrideTable = isAdmin ? "entity_overrides" : "public_entity_overrides";
      const overrideSelect = "id,entity_type,entity_key,field_key,value,previous_value,updated_at" + (isAdmin ? ",updated_by,updated_by_label" : "");
      const [overrideResult, createdResult, deletedResult] = await Promise.all([
        supabase.from(overrideTable).select(overrideSelect).eq("entity_type", "tonic"),
        supabase.from("public_created_tonics").select("id,tonic,created_at"),
        supabase.from("public_deleted_native_tonics").select("tonic_id,deleted_at"),
      ]);
      if (overrideResult.error) throw overrideResult.error;
      if (createdResult.error) throw createdResult.error;
      if (deletedResult.error) throw deletedResult.error;
      const createdTonics = parseCreatedTonicRows(createdResult.data ?? [], "public_created_tonics");
      const deletedNativeTonics = parseDeletedNativeTonicRows(deletedResult.data ?? [], "public_deleted_native_tonics");
      const hidden = new Set(deletedNativeTonics.map((row) => row.tonic_id));
      const tonics = cloneData(baseTonics).filter((item) => !hidden.has(item.id));
      createdTonics.forEach((row) => tonics.push({ ...cloneData(row.tonic), id: row.id }));
      const overrides: Record<string, OverrideRow> = {};
      parseOverrideRows(overrideResult.data ?? [], overrideTable).forEach((row) => {
        overrides[key(row.entity_key, row.field_key)] = row;
        applyField(tonics, row.entity_key, row.field_key, row.value);
      });
      set({ baseTonics, tonics, createdTonics, deletedNativeTonics, overrides });
    } catch (error) {
      console.error(errorMessage(error));
      set({ baseTonics: baseline, tonics: cloneData(baseline), createdTonics: [], deletedNativeTonics: [], overrides: {} });
    }
  },

  async save(id, field, value) {
    if (!useSessionStore.getState().isAdmin() || !supabase) throw new Error("Connexion requise.");
    const baseline = get().getBaselineValue(id, field) ?? null;
    const previous = get().getEffectiveValue(id, field) ?? null;
    const { data, error } = await supabase.rpc("apply_override", { p_entity_type: "tonic", p_entity_key: String(id), p_field_key: field, p_new_value: value, p_baseline_value: baseline });
    if (error) throw error;
    const result = parseApplyOverrideResult(Array.isArray(data) ? data[0] : data);
    if (!result.was_changed || !result.override_id) return;
    const row: OverrideRow = { id: result.override_id, entity_type: "tonic", entity_key: String(id), field_key: field, value, previous_value: previous, updated_at: result.saved_at, updated_by_label: result.author_label };
    const tonics = cloneData(get().tonics); applyField(tonics, String(id), field, value);
    set({ tonics, overrides: { ...get().overrides, [key(String(id), field)]: row } });
  },

  async reset(tonic) {
    if (!useSessionStore.getState().isAdmin() || !supabase) throw new Error("Connexion requise.");
    const baseline = get().baseTonics.find((item) => item.id === tonic.id)
      ?? (() => { const row = get().createdTonics.find((item) => item.id === tonic.id); return row ? { ...row.tonic, id: row.id } : undefined; })();
    if (!baseline) return;
    const { error } = await supabase.rpc("reset_tonic", { p_tonic_id: tonic.id, p_baseline: baseline });
    if (error) throw error;
    await get().initialize();
  },

  async createTonic(tonic) {
    if (!useSessionStore.getState().isAdmin() || !supabase) throw new Error("Connexion requise.");
    const { data, error } = await supabase.rpc("create_tonic", { p_tonic: tonic });
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    if (!result || !Number.isInteger(result.tonic_id)) throw new Error("Identifiant de création absent.");
    await get().initialize();
    const created = get().tonics.find((item) => item.id === result.tonic_id);
    if (!created) throw new Error("Le nouvel élément n'a pas pu être chargé.");
    return created;
  },

  async deleteTonic(tonic) {
    if (!useSessionStore.getState().isAdmin() || !supabase) throw new Error("Connexion requise.");
    const { error } = await supabase.rpc("delete_tonic", { p_tonic_id: tonic.id });
    if (error) throw error;
    await get().initialize();
  },

  async restoreNative(tonic) {
    if (!useSessionStore.getState().isAdmin() || !supabase) throw new Error("Connexion requise.");
    const { error } = await supabase.rpc("restore_native_tonic", { p_tonic_id: tonic.id });
    if (error) throw error;
    await get().initialize();
  },

  getEffectiveValue(id, field) {
    const tonic = get().tonics.find((item) => String(item.id) === String(id));
    return tonic ? cloneData((tonic as unknown as Record<string, unknown>)[field]) : undefined;
  },
  getBaselineValue(id, field) {
    const tonic = get().baseTonics.find((item) => String(item.id) === String(id))
      ?? get().createdTonics.find((item) => String(item.id) === String(id))?.tonic;
    return tonic ? cloneData((tonic as unknown as Record<string, unknown>)[field]) : undefined;
  },
  getOverride(id, field) { return get().overrides[key(String(id), field)]; },
}));
