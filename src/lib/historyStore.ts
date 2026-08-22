import { create } from "zustand";
import type { HistoryRow } from "../types";
import { useDataStore } from "./dataStore";
import { CLASSES } from "./dataService";
import { useSessionStore } from "./sessionStore";
import { supabase } from "./supabase";
import { HISTORY_PAGE_SIZE } from "./config";
import { CLASS_STAT_FIELDS, fieldLabel, SPELL_FIELDS, valueText } from "./utils";
import { parseHistoryRows } from "./validation";

export type HistoryFilters = {
  entityType: string;
  entityKey: string;
  fieldKey: string;
} | null;

interface SearchEntity {
  key: string;
  context: string;
  fields: string[];
}

interface HistoryState {
  rows: HistoryRow[];
  offset: number;
  hasMore: boolean;
  filters: HistoryFilters;
  classFilter: string;
  search: string;
  loading: boolean;
  error: string | null;
  open: (filters?: HistoryFilters, options?: { classFilter?: string }) => void;
  close: () => void;
  setClassFilter: (value: string) => void;
  setSearch: (value: string) => void;
  reload: () => Promise<void>;
  loadMore: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  contextLabel: (row: HistoryRow) => string;
  valueText: (value: unknown) => string;
  fieldLabel: (field: string) => string;
}

function normalizeSearch(value: string): string {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr");
}

function includesSearchToken(haystack: string, token: string): boolean {
  if (token.length > 2) return haystack.includes(token);
  return haystack.split(/[^a-z0-9]+/).includes(token);
}

function sourceTable(): string {
  return useSessionStore.getState().isAdmin() ? "change_history" : "public_change_history";
}

function classEntityKeys(classFilter: string): string[] | null {
  if (!classFilter) return null;
  const { spells, commonSpells } = useDataStore.getState();
  const pool =
    classFilter === "Sorts communs" ? commonSpells : spells.filter((spell) => spell.classe === classFilter);
  const keys = [...new Set(pool.map((spell) => String(spell.id)))];
  if (classFilter !== "Sorts communs") keys.push(classFilter);
  return keys;
}

function searchFilters(search: string, classFilter: string): { entityKeys: string[]; fieldKeys: string[] } | null {
  const tokens = normalizeSearch(search).split(/\s+/).filter(Boolean);
  if (!tokens.length) return null;
  const { spells, commonSpells } = useDataStore.getState();
  const spellPool =
    classFilter === "Sorts communs"
      ? commonSpells
      : classFilter
        ? spells.filter((spell) => spell.classe === classFilter)
        : [...spells, ...commonSpells];

  const entities: SearchEntity[] = spellPool.map((spell) => ({
    key: String(spell.id),
    context: `${spell.nom} ${spell.classe} sort ${spell.id}`,
    fields: SPELL_FIELDS,
  }));

  const statClasses: string[] = classFilter === "Sorts communs" ? [] : classFilter ? [classFilter] : CLASSES;
  statClasses.forEach((className: string) =>
    entities.push({
      key: className,
      context: `${className} caractéristiques statistiques classe`,
      fields: CLASS_STAT_FIELDS,
    }),
  );

  const entityKeys = new Set<string>();
  const fieldKeys = new Set<string>();
  entities.forEach((entity: SearchEntity) =>
    entity.fields.forEach((fieldKey: string) => {
      const haystack = normalizeSearch(`${entity.context} ${fieldKey} ${fieldLabel(fieldKey)}`);
      if (!tokens.every((token: string) => includesSearchToken(haystack, token))) return;
      entityKeys.add(entity.key);
      fieldKeys.add(fieldKey);
    }),
  );
  return { entityKeys: [...entityKeys], fieldKeys: [...fieldKeys] };
}

function escapeOrValue(value: string): string {
  return value.replace(/[(),]/g, "\\\\$&");
}

async function fetchPage(
  filters: HistoryFilters,
  offset: number,
  classFilter: string,
  search: string,
): Promise<HistoryRow[]> {
  const client = supabase;
  if (!client) throw new Error("Supabase JS n'a pas pu être chargé.");
  const isAdmin = useSessionStore.getState().isAdmin();
  const size = HISTORY_PAGE_SIZE;
  const select =
    "id,entity_type,entity_key,field_key,old_value,new_value,changed_at" +
    (isAdmin ? ",changed_by,changed_by_label" : "");
  let query = client.from(sourceTable()).select(select);

  if (filters) {
    query = query
      .eq("entity_type", filters.entityType)
      .eq("entity_key", String(filters.entityKey))
      .eq("field_key", filters.fieldKey);
  } else if (search) {
    const found = searchFilters(search, classFilter);
    const entityMatch =
      found && found.entityKeys.length && found.fieldKeys.length
        ? `and(entity_key.in.(${found.entityKeys.map(escapeOrValue).join(",")}),field_key.in.(${found.fieldKeys.map(escapeOrValue).join(",")}))`
        : "";
    const authorMatch = isAdmin ? `changed_by_label.ilike.%${escapeOrValue(search.trim())}%` : "";
    const matches = [entityMatch, authorMatch].filter(Boolean);
    if (!matches.length) return [];
    query = query.or(matches.join(","));
  } else if (classFilter) {
    query = query.in("entity_key", classEntityKeys(classFilter) ?? []);
  }

  query = query.order("changed_at", { ascending: false }).range(offset, offset + size - 1);
  const { data, error } = await query;
  if (error) throw error;
  return parseHistoryRows(data ?? [], `la table ${sourceTable()}`);
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  rows: [],
  offset: 0,
  hasMore: false,
  filters: null,
  classFilter: "",
  search: "",
  loading: false,
  error: null,

  open(filters = null, options = {}) {
    set({
      filters,
      classFilter: filters ? "" : options.classFilter || "",
      search: "",
      rows: [],
      offset: 0,
      hasMore: false,
      error: null,
    });
    void get().reload();
  },

  close() {
    set({ rows: [], offset: 0, hasMore: false, filters: null, classFilter: "", search: "", error: null });
  },

  setClassFilter(value) {
    set({ classFilter: value });
    void get().reload();
  },

  setSearch(value) {
    set({ search: value });
  },

  async reload() {
    const { filters, classFilter, search } = get();
    set({ loading: true, error: null, rows: [], offset: 0, hasMore: false });

    try {
      const rows = await fetchPage(filters, 0, classFilter, search);
      if (get().filters !== filters || get().classFilter !== classFilter || get().search !== search) return;
      set({
        rows,
        offset: rows.length,
        hasMore: rows.length === HISTORY_PAGE_SIZE,
        loading: false,
      });
    } catch (error) {
      set({
        error: (error as Error).message || String(error),
        loading: false,
      });
    }
  },

  async loadMore() {
    const { filters, classFilter, search, offset, loading, hasMore } = get();
    if (loading || !hasMore) return;
    set({ loading: true });
    try {
      const rows = await fetchPage(filters, offset, classFilter, search);
      set((state) => ({
        rows: [...state.rows, ...rows],
        offset: state.offset + rows.length,
        hasMore: rows.length === HISTORY_PAGE_SIZE,
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  async remove(id) {
    if (!useSessionStore.getState().isAdmin() || !supabase) return;
    const { error } = await supabase.from("change_history").delete().eq("id", id);
    if (error) throw error;
    set((state) => ({ rows: state.rows.filter((row) => row.id !== id) }));
  },

  contextLabel(row) {
    const { spells, commonSpells } = useDataStore.getState();
    if (row.entity_type === "import") return `Import de ${row.changed_by_label || "l’utilisateur"}`;
    if (row.entity_type === "class_stat") return row.entity_key;
    const matches = [...spells, ...commonSpells].filter(
      (spell) => String(spell.id) === String(row.entity_key),
    );
    const spell = matches[0];
    if (!spell) return `Sort #${row.entity_key}`;
    const classes = [...new Set(matches.map((item) => item.classe))].join(" / ");
    return `${classes} · ${spell.nom}`;
  },

  valueText,
  fieldLabel,
}));
