import { create } from "zustand";
import type { ClassStats, CreatedSpellRow, DeletedNativeSpellRow, OverrideRow, Spell } from "../types";
import { cloneData, loadBaselineData, type BaselineData } from "./dataService";
import { useSessionStore } from "./sessionStore";
import { supabase } from "./supabase";
import { errorMessage } from "./utils";
import {
  parseApplyOverrideResult,
  parseCreatedSpellRows,
  parseDeletedNativeSpellRows,
  parseOverrideRows,
  parseResetCount,
} from "./validation";

export function mapKey(entityType: string, entityKey: string, fieldKey: string): string {
  return `${entityType}\u0000${entityKey}\u0000${fieldKey}`;
}

function positionEntityKey(className: string, spellId: string): string {
  return `${className}/${spellId}`;
}

function parsePositionEntityKey(entityKey: string): { className: string; spellId: string } | null {
  const separator = entityKey.lastIndexOf("/");
  if (separator < 1 || separator === entityKey.length - 1) return null;
  return { className: entityKey.slice(0, separator), spellId: entityKey.slice(separator + 1) };
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
  if (entityType === "spell_position") {
    const target = parsePositionEntityKey(entityKey);
    if (!target) return;
    [...spells, ...commonSpells]
      .filter((spell) => spell.classe === target.className && String(spell.id) === target.spellId)
      .forEach((spell) => { spell.position = value as number; });
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
  status: "idle" | "loading" | "ready" | "error";
  loadError: string;
  collaborationWarning: string;
  baseSpells: Spell[];
  baseCommonSpells: Spell[];
  baseMorphStats: Record<string, ClassStats>;
  spells: Spell[];
  commonSpells: Spell[];
  morphStats: Record<string, ClassStats>;
  overrides: Record<string, OverrideRow>;
  createdSpells: CreatedSpellRow[];
  deletedNativeSpells: DeletedNativeSpellRow[];
  loadBaseline: () => Promise<BaselineData>;
  resetEffective: () => void;
  applyRows: (rows: OverrideRow[]) => void;
  initialize: () => Promise<void>;
  createSpell: (className: string, spell: Omit<Spell, "id" | "classe" | "morphId">) => Promise<Spell>;
  deleteSpell: (spell: Spell) => Promise<void>;
  restoreNativeSpell: (spell: Spell) => Promise<void>;
  save: (
    entityType: string,
    entityKey: string,
    fieldKey: string,
    newValue: unknown,
  ) => Promise<SaveResult>;
  reorderSpells: (className: string, orderedSpells: Spell[]) => Promise<void>;
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
  loadError: "",
  collaborationWarning: "",
  baseSpells: [],
  baseCommonSpells: [],
  baseMorphStats: {},
  spells: [],
  commonSpells: [],
  morphStats: {},
  overrides: {},
  createdSpells: [],
  deletedNativeSpells: [],

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
    const deleted = get().deletedNativeSpells;
    const hidden = new Set(deleted.map((row) => `${row.class_name}\u0000${row.spell_id}`));
    const spells = cloneData(get().baseSpells).filter((spell) => !hidden.has(`${spell.classe}\u0000${spell.id}`));
    const commonSpells = cloneData(get().baseCommonSpells).filter((spell) => !hidden.has(`${spell.classe}\u0000${spell.id}`));
    get().createdSpells.forEach((row) => {
      const spell = { ...cloneData(row.spell), id: row.id, classe: row.class_name } as Spell;
      if (spell.commun) commonSpells.push(spell); else spells.push(spell);
    });
    const morphStats = cloneData(get().baseMorphStats);
    const overrides: Record<string, OverrideRow> = {};
    rows.forEach((row) => {
      overrides[mapKey(row.entity_type, row.entity_key, row.field_key)] = row;
      setEffectiveValue(spells, commonSpells, morphStats, row.entity_type, row.entity_key, row.field_key, row.value);
    });
    set({
      spells,
      commonSpells,
      morphStats,
      overrides,
      status: "ready",
      loadError: "",
      collaborationWarning: "",
    });
  },

  async initialize() {
    set({ status: "loading", loadError: "", collaborationWarning: "" });
    try {
      await get().loadBaseline();
    } catch (error) {
      console.error(error);
      set({
        status: "error",
        loadError: `Impossible de charger les données JSON : ${errorMessage(error)}`,
      });
      return;
    }
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
      const isAdmin = useSessionStore.getState().isAdmin();
      const table = isAdmin ? "entity_overrides" : "public_entity_overrides";
      const select = "id,entity_type,entity_key,field_key,value,previous_value,updated_at"
        + (useSessionStore.getState().isAdmin() ? ",updated_by,updated_by_label" : "");
      const { data, error } = await client.from(table).select(select);
      if (error) throw error;
      // Ces vues ne contiennent aucune identité et sont volontairement lisibles
      // aussi bien par les visiteurs que par les utilisateurs connectés.
      const createdTable = "public_created_spells";
      const deletedTable = "public_deleted_native_spells";
      const [createdResult, deletedResult] = await Promise.all([
        client.from(createdTable).select("id,class_name,spell,created_at"),
        client.from(deletedTable).select("class_name,spell_id,deleted_at"),
      ]);
      if (createdResult.error) throw createdResult.error;
      if (deletedResult.error) throw deletedResult.error;
      set({
        createdSpells: parseCreatedSpellRows(createdResult.data ?? [], `la table ${createdTable}`),
        deletedNativeSpells: parseDeletedNativeSpellRows(deletedResult.data ?? [], `la table ${deletedTable}`),
      });
      get().applyRows(parseOverrideRows(data ?? [], `la table ${table}`));
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

  async createSpell(className, spell) {
    if (!useSessionStore.getState().isAdmin()) throw new Error("Cette action est réservée aux utilisateurs connectés.");
    if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
    const { data, error } = await supabase.rpc("create_spell", { p_class_name: className, p_spell: spell });
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    if (!result || !Number.isInteger(result.spell_id)) throw new Error("La création du sort n'a retourné aucun identifiant.");
    const created: CreatedSpellRow = { id: result.spell_id, class_name: className, spell, created_at: result.created_at };
    set({ createdSpells: [...get().createdSpells, created] });
    get().applyRows(Object.values(get().overrides));
    return get().getSpellById(created.id)!;
  },

  async deleteSpell(spell) {
    if (!useSessionStore.getState().isAdmin()) throw new Error("Cette action est réservée aux utilisateurs connectés.");
    if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
    const { error } = await supabase.rpc("delete_spell", { p_spell_id: spell.id, p_class_name: spell.classe });
    if (error) throw error;
    const custom = get().createdSpells.some((row) => row.id === spell.id && row.class_name === spell.classe);
    set(custom
      ? { createdSpells: get().createdSpells.filter((row) => row.id !== spell.id || row.class_name !== spell.classe) }
      : { deletedNativeSpells: [...get().deletedNativeSpells, { class_name: spell.classe, spell_id: spell.id, deleted_at: new Date().toISOString() }] });
    get().applyRows(Object.values(get().overrides));
  },

  async restoreNativeSpell(spell) {
    if (!useSessionStore.getState().isAdmin()) throw new Error("Cette action est réservée aux utilisateurs connectés.");
    if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
    const { error } = await supabase.rpc("restore_native_spell", { p_spell_id: spell.id, p_class_name: spell.classe });
    if (error) throw error;
    set({ deletedNativeSpells: get().deletedNativeSpells.filter((row) => row.class_name !== spell.classe || row.spell_id !== spell.id) });
    get().applyRows(Object.values(get().overrides));
  },

  async save(entityType, entityKey, fieldKey, newValue) {
    if (!useSessionStore.getState().isAdmin()) {
      throw new Error("Cette action est réservée aux administrateurs.");
    }
    const client = supabase;
    if (!client) throw new Error("Supabase JS n'a pas pu être chargé.");
    const oldValue = get().getEffectiveValue(entityType, entityKey, fieldKey);
    const baselineValue = get().getBaselineValue(entityType, entityKey, fieldKey);
    const isSpellIcon = entityType === "spell" && fieldKey === "icone";
    const { data, error } = isSpellIcon
      ? await client.rpc("apply_spell_icon_override", {
          p_entity_key: String(entityKey),
          p_new_value: newValue,
          p_baseline_value: baselineValue,
        })
      : await client.rpc("apply_override", {
          p_entity_type: entityType,
          p_entity_key: String(entityKey),
          p_field_key: fieldKey,
          p_new_value: newValue,
          p_baseline_value: baselineValue,
        });
    if (error) throw error;
    const rawResult = Array.isArray(data) ? data[0] : data;
    if (!rawResult) throw new Error("La sauvegarde n'a retourné aucun résultat.");
    const result = parseApplyOverrideResult(rawResult);
    if (!result.was_changed) return { changed: false };
    if (!result.override_id) throw new Error("La sauvegarde n'a retourné aucun identifiant d'override.");

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
    return parseResetCount(data);
  },

  async reorderSpells(className, orderedSpells) {
    const changes = orderedSpells.filter((spell, index) => spell.position !== index + 1);
    if (!changes.length) return;
    await Promise.all(changes.map((spell) => get().save(
      "spell_position",
      positionEntityKey(className, String(spell.id)),
      "position",
      orderedSpells.indexOf(spell) + 1,
    )));
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
    if (entityType === "spell_position") {
      const target = parsePositionEntityKey(entityKey);
      if (!target) return undefined;
      const spell = [...get().spells, ...get().commonSpells].find(
        (item) => item.classe === target.className && String(item.id) === target.spellId,
      );
      return spell?.position;
    }
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
    if (entityType === "spell_position") {
      const target = parsePositionEntityKey(entityKey);
      if (!target) return undefined;
      const spell = [...get().baseSpells, ...get().baseCommonSpells].find(
        (item) => item.classe === target.className && String(item.id) === target.spellId,
      );
      return spell?.position;
    }
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
    return [
      ...get().baseSpells,
      ...get().baseCommonSpells,
      ...get().createdSpells.map((row) => ({ ...cloneData(row.spell), id: row.id, classe: row.class_name }) as Spell),
    ];
  },

  getOverride(entityType, entityKey, fieldKey) {
    return get().overrides[mapKey(entityType, String(entityKey), fieldKey)];
  },

  hasOverride(entityType, entityKey, fieldKey) {
    return mapKey(entityType, String(entityKey), fieldKey) in get().overrides;
  },
}));
