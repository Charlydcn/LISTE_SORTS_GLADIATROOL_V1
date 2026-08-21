import { create } from "zustand";
import type { ClassStats, OverrideRow, Spell } from "../types";
import { cloneData, loadBaselineData, type BaselineData } from "./dataService";
import { useSessionStore } from "./sessionStore";
import { supabase } from "./supabase";

export function mapKey(entityType: string, entityKey: string, fieldKey: string): string {
  return `${entityType}\u0000${entityKey}\u0000${fieldKey}`;
}

function effectLines(spell: Spell, tab: "normaux" | "critiques"): string[] {
  return spell.effets.filter((effect) => effect.onglet === tab).map((effect) => effect.texte);
}

function assignSpellField(spell: Spell, fieldKey: string, value: unknown): void {
  if (fieldKey === "effets.normaux" || fieldKey === "effets.critiques") {
    const tab = fieldKey.split(".")[1] as "normaux" | "critiques";
    const replacement = (Array.isArray(value) ? value : []).map((texte) => ({
      onglet: tab,
      texte: String(texte),
    }));
    const other = spell.effets.filter((effect) => effect.onglet !== tab);
    spell.effets = tab === "normaux" ? [...replacement, ...other] : [...other, ...replacement];
    return;
  }
  (spell as Record<string, unknown>)[fieldKey] = value;
}

function setEffectiveValue(
  spells: Spell[],
  commonSpells: Spell[],
  morphStats: Record<string, ClassStats>,
  entityType: string,
  entityKey: string,
  fieldKey: string,
  value: unknown,
): void {
  if (entityType === "spell") {
    [...spells, ...commonSpells]
      .filter((spell) => String(spell.id) === String(entityKey))
      .forEach((spell) => assignSpellField(spell, fieldKey, value));
    return;
  }
  if (entityType === "class_stat" && morphStats[entityKey]) {
    morphStats[entityKey][fieldKey] = value as number;
  }
}

export interface SaveResult {
  changed: boolean;
  row?: OverrideRow;
  historyId?: string;
}

interface DataState {
  status: "idle" | "loading" | "ready";
  collaborationWarning: string;
  baseSpells: Spell[];
  baseCommonSpells: Spell[];
  baseMorphStats: Record<string, ClassStats>;
  spells: Spell[];
  commonSpells: Spell[];
  morphStats: Record<string, ClassStats>;
  overrides: Record<string, OverrideRow>;
  loadBaseline: () => Promise<BaselineData>;
  resetEffective: () => void;
  applyRows: (rows: OverrideRow[]) => void;
  initialize: () => Promise<void>;
  save: (
    entityType: string,
    entityKey: string,
    fieldKey: string,
    newValue: unknown,
  ) => Promise<SaveResult>;
  reset: (rows: OverrideRow[]) => Promise<number>;
  listOverrides: (opts?: { entityType?: string; entityKeys?: unknown[] }) => OverrideRow[];
  getSpellById: (id: unknown) => Spell | undefined;
  getEffectiveValue: (entityType: string, entityKey: string, fieldKey: string) => unknown;
  getBaselineValue: (entityType: string, entityKey: string, fieldKey: string) => unknown;
  getBaselineSpells: () => Spell[];
  getOverride: (entityType: string, entityKey: string, fieldKey: string) => OverrideRow | undefined;
  hasOverride: (entityType: string, entityKey: string, fieldKey: string) => boolean;
}

export const useDataStore = create<DataState>((set, get) => ({
  status: "idle",
  collaborationWarning: "",
  baseSpells: [],
  baseCommonSpells: [],
  baseMorphStats: {},
  spells: [],
  commonSpells: [],
  morphStats: {},
  overrides: {},

  async loadBaseline() {
    const baseline = await loadBaselineData();
    set({
      baseSpells: baseline.baseSpells,
      baseCommonSpells: baseline.baseCommonSpells,
      baseMorphStats: baseline.baseMorphStats,
    });
    return baseline;
  },

  resetEffective() {
    set({
      spells: cloneData(get().baseSpells),
      commonSpells: cloneData(get().baseCommonSpells),
      morphStats: cloneData(get().baseMorphStats),
    });
  },

  applyRows(rows) {
    const spells = cloneData(get().baseSpells);
    const commonSpells = cloneData(get().baseCommonSpells);
    const morphStats = cloneData(get().baseMorphStats);
    const overrides: Record<string, OverrideRow> = {};
    rows.forEach((row) => {
      overrides[mapKey(row.entity_type, row.entity_key, row.field_key)] = row;
      setEffectiveValue(spells, commonSpells, morphStats, row.entity_type, row.entity_key, row.field_key, row.value);
    });
    set({ spells, commonSpells, morphStats, overrides, status: "ready", collaborationWarning: "" });
  },

  async initialize() {
    set({ status: "loading" });
    await get().loadBaseline();
    const client = supabase;
    if (!client) {
      get().resetEffective();
      set({
        status: "ready",
        collaborationWarning:
          "Supabase est indisponible : les valeurs JSON sont affichées, mais elles peuvent ne pas représenter l’état collaboratif actuel.",
      });
      return;
    }
    try {
      const table = useSessionStore.getState().isAdmin() ? "entity_overrides" : "public_entity_overrides";
      const select = "id,entity_type,entity_key,field_key,value,previous_value,updated_at"
        + (useSessionStore.getState().isAdmin() ? ",updated_by,updated_by_label" : "");
      const { data, error } = await client.from(table).select(select);
      if (error) throw error;
      get().applyRows(data ? (data as unknown as OverrideRow[]) : []);
    } catch (error) {
      get().resetEffective();
      console.error(error);
      set({
        status: "ready",
        collaborationWarning:
          "Supabase est indisponible : les valeurs JSON sont affichées, mais elles peuvent ne pas représenter l’état collaboratif actuel.",
      });
    }
  },

  async save(entityType, entityKey, fieldKey, newValue) {
    if (!useSessionStore.getState().isAdmin()) {
      throw new Error("Cette action est réservée aux administrateurs.");
    }
    const client = supabase;
    if (!client) throw new Error("Supabase JS n'a pas pu être chargé.");
    const oldValue = get().getEffectiveValue(entityType, entityKey, fieldKey);
    const baselineValue = get().getBaselineValue(entityType, entityKey, fieldKey);
    const { data, error } = await client.rpc("apply_override", {
      p_entity_type: entityType,
      p_entity_key: String(entityKey),
      p_field_key: fieldKey,
      p_new_value: newValue,
      p_baseline_value: baselineValue,
    });
    if (error) throw error;
    const result = (Array.isArray(data) ? data[0] : data) as
      | {
          override_id: string;
          history_id: string | null;
          saved_at: string;
          author_label: string;
          was_changed: boolean;
        }
      | undefined;
    if (!result) throw new Error("La sauvegarde n'a retourné aucun résultat.");
    if (!result.was_changed) return { changed: false };

    const row: OverrideRow = {
      id: result.override_id,
      entity_type: entityType,
      entity_key: String(entityKey),
      field_key: fieldKey,
      value: newValue,
      previous_value: oldValue,
      updated_at: result.saved_at,
      updated_by: useSessionStore.getState().user?.id,
      updated_by_label: result.author_label,
    };

    const overrides = { ...get().overrides };
    overrides[mapKey(entityType, String(entityKey), fieldKey)] = row;
    const spells = cloneData(get().spells);
    const commonSpells = cloneData(get().commonSpells);
    const morphStats = cloneData(get().morphStats);
    setEffectiveValue(spells, commonSpells, morphStats, entityType, String(entityKey), fieldKey, newValue);
    set({ spells, commonSpells, morphStats, overrides });

    return { changed: true, row, historyId: result.history_id ?? undefined };
  },

  async reset(rows) {
    if (!useSessionStore.getState().isAdmin()) {
      throw new Error("Cette action est réservée aux administrateurs.");
    }
    if (!rows.length) return 0;
    const client = supabase;
    if (!client) throw new Error("Supabase JS n'a pas pu être chargé.");
    const targets = rows.map((row) => ({
      entity_type: row.entity_type,
      entity_key: String(row.entity_key),
      field_key: row.field_key,
      baseline_value: get().getBaselineValue(row.entity_type, row.entity_key, row.field_key),
    }));
    const { data, error } = await client.rpc("reset_overrides", { p_targets: targets });
    if (error) throw error;

    const overrides = { ...get().overrides };
    const spells = cloneData(get().spells);
    const commonSpells = cloneData(get().commonSpells);
    const morphStats = cloneData(get().morphStats);
    rows.forEach((row) => {
      const baseline = get().getBaselineValue(row.entity_type, row.entity_key, row.field_key);
      delete overrides[mapKey(row.entity_type, String(row.entity_key), row.field_key)];
      setEffectiveValue(spells, commonSpells, morphStats, row.entity_type, String(row.entity_key), row.field_key, baseline);
    });
    set({ spells, commonSpells, morphStats, overrides });
    return Number(data || 0);
  },

  listOverrides(opts) {
    const keySet = opts?.entityKeys ? new Set(opts.entityKeys.map(String)) : null;
    return Object.values(get().overrides).filter(
      (row) =>
        (!opts?.entityType || row.entity_type === opts.entityType) &&
        (!keySet || keySet.has(String(row.entity_key))),
    );
  },

  getSpellById(id) {
    return (
      get().spells.find((spell) => String(spell.id) === String(id)) ||
      get().commonSpells.find((spell) => String(spell.id) === String(id))
    );
  },

  getEffectiveValue(entityType, entityKey, fieldKey) {
    if (entityType === "spell") {
      const spell = get().getSpellById(entityKey);
      if (!spell) return undefined;
      if (fieldKey === "effets.normaux") return effectLines(spell, "normaux");
      if (fieldKey === "effets.critiques") return effectLines(spell, "critiques");
      return cloneData((spell as Record<string, unknown>)[fieldKey]);
    }
    return cloneData(get().morphStats[entityKey]?.[fieldKey]);
  },

  getBaselineValue(entityType, entityKey, fieldKey) {
    if (entityType === "spell") {
      const spell = get()
        .getBaselineSpells()
        .find((item) => String(item.id) === String(entityKey));
      if (!spell) return undefined;
      if (fieldKey === "effets.normaux") return effectLines(spell, "normaux");
      if (fieldKey === "effets.critiques") return effectLines(spell, "critiques");
      return cloneData((spell as Record<string, unknown>)[fieldKey]);
    }
    return cloneData(get().baseMorphStats[entityKey]?.[fieldKey]);
  },

  getBaselineSpells() {
    return [...get().baseSpells, ...get().baseCommonSpells];
  },

  getOverride(entityType, entityKey, fieldKey) {
    return get().overrides[mapKey(entityType, String(entityKey), fieldKey)];
  },

  hasOverride(entityType, entityKey, fieldKey) {
    return mapKey(entityType, String(entityKey), fieldKey) in get().overrides;
  },
}));
