import type { User } from "@supabase/supabase-js";

export type EffectTab = "normaux" | "critiques";

export interface Effect {
  onglet: EffectTab;
  texte: string;
}

export type ClassStats = Record<string, number>;

export interface Spell {
  id: number;
  position?: number;
  nom: string;
  pa: number | string;
  po: string;
  porteeModifiable: boolean;
  lancerEnLigne: boolean;
  ligneDeVue: boolean;
  cc: string;
  ec: string;
  relance: string;
  parTour: number | null;
  parCible: number | null;
  icone: string | null;
  commun: boolean;
  effets: Effect[];
  classe: string;
  morphId?: number;
  [key: string]: unknown;
}

export interface OverrideRow {
  id: string;
  entity_type: string;
  entity_key: string;
  field_key: string;
  value: unknown;
  previous_value: unknown;
  updated_at: string;
  updated_by?: string;
  updated_by_label?: string;
}

export type TonicKind = "tonique" | "mutation";
export type TonicCategory = "palier1" | "palier2" | "rarus" | "mutation";

export interface Tonic {
  id: number;
  kind: TonicKind;
  category: TonicCategory;
  className: string | null;
  title: string;
  effects: string[];
  spellId: number | null;
}

export interface CreatedTonicRow {
  id: number;
  tonic: Omit<Tonic, "id">;
  created_at: string;
}

export interface DeletedNativeTonicRow {
  tonic_id: number;
  deleted_at: string;
}

export interface CreatedSpellRow {
  id: number;
  class_name: string;
  spell: Omit<Spell, "id" | "classe" | "morphId">;
  created_at: string;
}

export interface DeletedNativeSpellRow {
  class_name: string;
  spell_id: number;
  deleted_at: string;
}

export type SpellSyncOrigin = "native_inchange" | "native_modifie" | "personnalise" | "non_configuree";

/** Mapping deliberately kept outside spell sheets and their edit history. */
export interface SpellSyncMapping {
  class_name: string;
  catalogue_spell_id: number;
  server_spell_id: number | null;
  replaces_server_spell_id: number | null;
  origine: SpellSyncOrigin;
  shortcut_position: number | null;
}

export interface HistoryRow {
  id: string;
  entity_type: string;
  entity_key: string;
  field_key: string;
  old_value: unknown;
  new_value: unknown;
  changed_at: string;
  changed_by?: string;
  changed_by_label?: string;
}

export interface CommentRow {
  id: string;
  spell_id?: string;
  tonic_id?: string;
  body: string;
  created_at: string;
  updated_at: string;
  created_by_label: string | null;
  updated_by_label: string | null;
}

export type SessionMode = "loading" | "login" | "guest" | "admin";
export type SessionUser = User;

export type ToastType = "info" | "success" | "error";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
