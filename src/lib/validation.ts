import { z, ZodError } from "zod";
import type { CommentRow, CreatedSpellRow, CreatedTonicRow, DeletedNativeSpellRow, DeletedNativeTonicRow, HistoryRow, OverrideRow, Spell, Tonic } from "../types";

const effectSchema = z.object({
  onglet: z.enum(["normaux", "critiques"]),
  texte: z.string(),
});

const baselineSpellSchema = z
  .object({
    id: z.number().int(),
    position: z.number().int().optional(),
    nom: z.string().min(1),
    pa: z.union([z.number(), z.string()]),
    po: z.string(),
    porteeModifiable: z.boolean(),
    lancerEnLigne: z.boolean(),
    ligneDeVue: z.boolean(),
    cc: z.string(),
    ec: z.string(),
    relance: z.string(),
    parTour: z.number().nullable(),
    parCible: z.number().nullable(),
    icone: z.string().nullable(),
    commun: z.boolean(),
    effets: z.array(effectSchema),
  })
  .passthrough();

const classDataSchema = z.object({
  classe: z.string().min(1),
  morphId: z.number().int(),
  sorts: z.array(baselineSpellSchema),
});

const commonDataSchema = z.object({
  classe: z.string().min(1),
  sorts: z.array(baselineSpellSchema),
});

const tonicSchema = z.object({
  id: z.number().int(),
  kind: z.enum(["tonique", "mutation"]),
  category: z.enum(["palier1", "palier2", "rarus", "mutation"]),
  className: z.string().min(1).nullable(),
  title: z.string().min(1),
  effects: z.array(z.string()),
  spellId: z.number().int().nullable(),
});

const tonicDataSchema = z.object({
  format: z.literal("gladiatrool-tonics"),
  formatVersion: z.literal(1),
  items: z.array(tonicSchema),
});

const overrideRowSchema = z.object({
  id: z.string().min(1),
  entity_type: z.enum(["spell", "spell_position", "class_stat", "tonic"]),
  entity_key: z.string().min(1),
  field_key: z.string().min(1),
  value: z.unknown(),
  previous_value: z.unknown(),
  updated_at: z.string().min(1),
  updated_by: z.string().optional(),
  updated_by_label: z.string().optional(),
});

const historyRowSchema = z.object({
  id: z.string().min(1),
  entity_type: z.enum(["spell", "spell_position", "class_stat", "tonic", "import"]),
  entity_key: z.string().min(1),
  field_key: z.string().min(1),
  old_value: z.unknown(),
  new_value: z.unknown(),
  changed_at: z.string().min(1),
  changed_by: z.string().optional(),
  changed_by_label: z.string().optional(),
});

const commentRowSchema = z.object({
  id: z.string().min(1),
  spell_id: z.string().min(1).optional(),
  tonic_id: z.string().min(1).optional(),
  body: z.string(),
  created_at: z.string().min(1),
  updated_at: z.string().min(1),
  created_by_label: z.string().nullable(),
  updated_by_label: z.string().nullable(),
});

const createdSpellRowSchema = z.object({ id: z.number().int(), class_name: z.string().min(1), spell: baselineSpellSchema.omit({ id: true }), created_at: z.string().min(1) });
const deletedNativeSpellRowSchema = z.object({ class_name: z.string().min(1), spell_id: z.number().int(), deleted_at: z.string().min(1) });
const createdTonicRowSchema = z.object({ id: z.number().int(), tonic: tonicSchema.omit({ id: true }), created_at: z.string().min(1) });
const deletedNativeTonicRowSchema = z.object({ tonic_id: z.number().int(), deleted_at: z.string().min(1) });

const applyOverrideResultSchema = z.object({
  override_id: z.string().nullable(),
  history_id: z.string().nullable(),
  saved_at: z.string().min(1),
  author_label: z.string(),
  was_changed: z.boolean(),
});

const resetClassResultSchema = z.object({
  reset_count: z.number().int().nonnegative(),
  deleted_custom_count: z.number().int().nonnegative(),
  restored_native_count: z.number().int().nonnegative(),
});

function validationError(source: string, error: unknown): Error {
  if (!(error instanceof ZodError)) {
    return new Error(`Impossible de valider ${source}.`);
  }
  const details = error.issues
    .slice(0, 3)
    .map((issue) => `${issue.path.join(".") || "racine"} : ${issue.message}`)
    .join(" ; ");
  return new Error(`Données invalides dans ${source} - ${details}`);
}

function parseWithSource<T>(schema: z.ZodType<T>, value: unknown, source: string): T {
  try {
    return schema.parse(value);
  } catch (error) {
    throw validationError(source, error);
  }
}

export function parseClassData(
  value: unknown,
  source: string,
  expectedClass: string,
  expectedMorphId: number,
): { classe: string; morphId: number; sorts: Omit<Spell, "classe" | "morphId">[] } {
  const parsed = parseWithSource(classDataSchema, value, source);
  if (parsed.classe !== expectedClass || parsed.morphId !== expectedMorphId) {
    throw new Error(
      `Données invalides dans ${source} - classe ou morphId inattendu ` +
        `(attendu : ${expectedClass}/${expectedMorphId}).`,
    );
  }
  return parsed as { classe: string; morphId: number; sorts: Omit<Spell, "classe" | "morphId">[] };
}

export function parseCommonData(
  value: unknown,
  source: string,
): { classe: string; sorts: Omit<Spell, "classe" | "morphId">[] } {
  const parsed = parseWithSource(commonDataSchema, value, source);
  if (parsed.classe !== "Sorts communs") {
    throw new Error(
      `Données invalides dans ${source} - classe inattendue (attendu : Sorts communs).`,
    );
  }
  return parsed as {
    classe: string;
    sorts: Omit<Spell, "classe" | "morphId">[];
  };
}

export function parseTonicData(value: unknown, source: string): Tonic[] {
  return parseWithSource(tonicDataSchema, value, source).items as Tonic[];
}

export function parseOverrideRows(value: unknown, source: string): OverrideRow[] {
  return parseWithSource(z.array(overrideRowSchema), value, source) as OverrideRow[];
}

export function parseHistoryRows(value: unknown, source: string): HistoryRow[] {
  return parseWithSource(z.array(historyRowSchema), value, source) as HistoryRow[];
}

export function parseCommentRows(value: unknown, source: string): CommentRow[] {
  return parseWithSource(z.array(commentRowSchema), value, source) as CommentRow[];
}

export function parseCreatedSpellRows(value: unknown, source: string): CreatedSpellRow[] {
  return parseWithSource(z.array(createdSpellRowSchema), value, source) as CreatedSpellRow[];
}

export function parseDeletedNativeSpellRows(value: unknown, source: string): DeletedNativeSpellRow[] {
  return parseWithSource(z.array(deletedNativeSpellRowSchema), value, source) as DeletedNativeSpellRow[];
}

export function parseCreatedTonicRows(value: unknown, source: string): CreatedTonicRow[] {
  return parseWithSource(z.array(createdTonicRowSchema), value, source) as CreatedTonicRow[];
}

export function parseDeletedNativeTonicRows(value: unknown, source: string): DeletedNativeTonicRow[] {
  return parseWithSource(z.array(deletedNativeTonicRowSchema), value, source) as DeletedNativeTonicRow[];
}

export function parseApplyOverrideResult(value: unknown): {
  override_id: string | null;
  history_id: string | null;
  saved_at: string;
  author_label: string;
  was_changed: boolean;
} {
  return parseWithSource(applyOverrideResultSchema, value, "la réponse de apply_override");
}

export function parseResetCount(value: unknown): number {
  return parseWithSource(z.number().int().nonnegative(), value, "la réponse de reset_overrides");
}

export function parseResetClassResult(value: unknown): {
  reset_count: number;
  deleted_custom_count: number;
  restored_native_count: number;
} {
  const row = Array.isArray(value) ? value[0] : value;
  return parseWithSource(resetClassResultSchema, row, "la réponse de reset_spell_class");
}
