import JSZip from "jszip";
import { z, ZodError } from "zod";
import type { ClassStats, DeletedNativeSpellRow, Spell, SpellSyncMapping } from "../types";
import { CLASS_FILES, CLASSES } from "./dataService";

export const SPELL_DUMP_FORMAT = "gladiatrool-spells";
export const SPELL_DUMP_VERSION = 1;
export const SPELL_AUDIT_SCHEMA_VERSION = 2;
export const MAX_IMPORT_BYTES = 25 * 1024 * 1024;

export type DumpScope = "spell" | "class" | "common";
export type SpellOrigin = "native" | "personnalise";

export interface DumpIcon {
  fichier: string | null;
  format: "svg" | "png" | "jpg" | "webp" | null;
  typeMime: string | null;
}

export interface DumpSpell {
  id: number;
  position?: number;
  origine: SpellOrigin;
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
  commun: boolean;
  effets: Spell["effets"];
  classe: string;
  icone: DumpIcon;
  [key: string]: unknown;
}

export interface SpellDumpDocument {
  format: typeof SPELL_DUMP_FORMAT;
  formatVersion: typeof SPELL_DUMP_VERSION;
  scope: DumpScope;
  exporteLe: string;
  classe: {
    nom: string;
    morphId: number | null;
    caracteristiques: ClassStats | null;
  };
  sorts: DumpSpell[];
}

export interface TransferSnapshot {
  spells: Spell[];
  commonSpells: Spell[];
  morphStats: Record<string, ClassStats>;
  customSpellKeys: Set<string>;
  deletedNativeSpells: DeletedNativeSpellRow[];
  spellSyncMappings: SpellSyncMapping[];
}

export interface SpellAuditV2Document {
  format: "gladiatrool-spell-audit";
  schemaVersion: typeof SPELL_AUDIT_SCHEMA_VERSION;
  exportedAt: string;
  contentHash: string;
  effectsComparison: "informational_text_only";
  classes: unknown[];
}

export interface ImportSpellPayload {
  id: number;
  className: string;
  native: boolean;
  spell: Record<string, unknown>;
  baseline: Record<string, unknown> | null;
}

export interface ImportClassPayload {
  className: string;
  stats: ClassStats | null;
  baselineStats: ClassStats | null;
  spells: ImportSpellPayload[];
}

export interface ImportPayload {
  formatVersion: number;
  classes: ImportClassPayload[];
}

const MIME_BY_FORMAT: Record<NonNullable<DumpIcon["format"]>, string> = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
};

const formatByMime: Record<string, NonNullable<DumpIcon["format"]>> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const effectSchema = z.object({ onglet: z.enum(["normaux", "critiques"]), texte: z.string() });
const iconSchema = z.object({
  fichier: z.string().nullable(),
  format: z.enum(["svg", "png", "jpg", "webp"]).nullable(),
  typeMime: z.string().nullable(),
});
const dumpSpellSchema = z.object({
  id: z.number().int().positive(),
  position: z.number().int().positive().optional(),
  origine: z.enum(["native", "personnalise"]),
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
  commun: z.boolean(),
  effets: z.array(effectSchema),
  classe: z.string().min(1),
  icone: iconSchema,
}).passthrough();
const documentSchema = z.object({
  format: z.literal(SPELL_DUMP_FORMAT),
  formatVersion: z.literal(SPELL_DUMP_VERSION),
  scope: z.enum(["spell", "class", "common"]),
  exporteLe: z.string(),
  classe: z.object({
    nom: z.string().min(1),
    morphId: z.number().int().nullable(),
    caracteristiques: z.record(z.string(), z.number()).nullable(),
  }),
  sorts: z.array(dumpSpellSchema).min(1),
});

function slug(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "export";
}

function iconFormat(url: string): DumpIcon["format"] {
  const clean = url.split(/[?#]/)[0].toLowerCase();
  if (clean.endsWith(".svg")) return "svg";
  if (clean.endsWith(".png")) return "png";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "jpg";
  if (clean.endsWith(".webp")) return "webp";
  return null;
}

function customKey(spell: Spell): string {
  return `${spell.classe}\u0000${spell.id}`;
}

function classMorphId(className: string): number | null {
  return CLASS_FILES.find((entry) => entry.name === className)?.morphId ?? null;
}

function withoutRuntimeFields(spell: Spell): Record<string, unknown> {
  const copy = { ...spell } as Record<string, unknown>;
  delete copy.icone;
  delete copy.morphId;
  return copy;
}

async function addSpellIcon(zip: JSZip, folder: string, spell: Spell): Promise<DumpIcon> {
  if (!spell.icone) return { fichier: null, format: null, typeMime: null };
  const response = await fetch(spell.icone);
  if (!response.ok) throw new Error(`Impossible d’exporter l’icône du sort #${spell.id} (${response.status}).`);
  const blob = await response.blob();
  let format = formatByMime[blob.type.toLowerCase()] ?? iconFormat(spell.icone);
  if (!format) throw new Error(`Format d’icône inconnu pour le sort #${spell.id}.`);
  const typeMime = MIME_BY_FORMAT[format];
  const file = `${folder}icones/${spell.id}-${slug(spell.nom)}.${format}`;
  zip.file(file, blob);
  return { fichier: file.slice(folder.length), format, typeMime };
}

async function buildDocument(
  zip: JSZip,
  folder: string,
  scope: DumpScope,
  className: string,
  spells: Spell[],
  snapshot: TransferSnapshot,
): Promise<SpellDumpDocument> {
  const ordered = [...spells].sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER));
  const dumped = await Promise.all(ordered.map(async (spell): Promise<DumpSpell> => ({
    ...withoutRuntimeFields(spell),
    origine: snapshot.customSpellKeys.has(customKey(spell)) ? "personnalise" : "native",
    icone: await addSpellIcon(zip, folder, spell),
  } as unknown as DumpSpell)));
  const document: SpellDumpDocument = {
    format: SPELL_DUMP_FORMAT,
    formatVersion: SPELL_DUMP_VERSION,
    scope,
    exporteLe: new Date().toISOString(),
    classe: {
      nom: className,
      morphId: classMorphId(className),
      caracteristiques: className === "Sorts communs" ? null : snapshot.morphStats[className] ?? null,
    },
    sorts: dumped,
  };
  zip.file(`${folder}config.json`, JSON.stringify(document, null, 2));
  return document;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
}

async function contentHash(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(canonicalize(value)));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function auditMapping(className: string, spellId: number, mappings: SpellSyncMapping[]): SpellSyncMapping {
  return mappings.find((item) => item.class_name === className && item.catalogue_spell_id === spellId) ?? {
    class_name: className,
    catalogue_spell_id: spellId,
    server_spell_id: null,
    replaces_server_spell_id: null,
    origine: "non_configuree",
    scope: "morph",
    monster_template_id: null,
    shortcut_position: null,
  };
}

function auditSpell(spell: Spell, snapshot: TransferSnapshot) {
  const mapping = auditMapping(spell.classe, spell.id, snapshot.spellSyncMappings);
  return {
    catalogueSpellId: spell.id,
    serverSpellId: mapping.server_spell_id,
    replacesServerSpellId: mapping.replaces_server_spell_id,
    origine: mapping.origine,
    scope: mapping.scope,
    monsterTemplateId: mapping.monster_template_id,
    shortcutPosition: mapping.shortcut_position,
    cataloguePosition: spell.position ?? null,
    nom: spell.nom,
    pa: spell.pa,
    po: spell.po,
    porteeModifiable: spell.porteeModifiable,
    lancerEnLigne: spell.lancerEnLigne,
    ligneDeVue: spell.ligneDeVue,
    cc: spell.cc,
    ec: spell.ec,
    relance: spell.relance,
    parTour: spell.parTour,
    parCible: spell.parCible,
    commun: spell.commun,
    effets: spell.effets,
  };
}

/** Effective, read-only audit contract. Effects deliberately remain descriptive text. */
export async function buildGlobalAuditV2(snapshot: TransferSnapshot): Promise<SpellAuditV2Document> {
  const classes = [
    ...CLASS_FILES.map((entry) => ({
      classId: entry.morphId - 100,
      className: entry.name,
      morphId: entry.morphId,
      gradeId: 6,
      spells: snapshot.spells.filter((spell) => spell.classe === entry.name)
        .map((spell) => auditSpell(spell, snapshot)),
      suppressedSpells: snapshot.deletedNativeSpells.filter((row) => row.class_name === entry.name).map((row) => {
        const mapping = auditMapping(entry.name, row.spell_id, snapshot.spellSyncMappings);
        return {
          catalogueSpellId: row.spell_id,
          serverSpellId: mapping.server_spell_id,
          replacesServerSpellId: mapping.replaces_server_spell_id,
          origine: mapping.origine,
          scope: mapping.scope,
          monsterTemplateId: mapping.monster_template_id,
          shortcutPosition: mapping.shortcut_position,
        };
      }),
    })),
    {
      classId: null,
      className: "Sorts communs",
      morphId: null,
      gradeId: null,
      spells: snapshot.commonSpells.map((spell) => auditSpell(spell, snapshot)),
      suppressedSpells: snapshot.deletedNativeSpells.filter((row) => row.class_name === "Sorts communs").map((row) => {
        const mapping = auditMapping("Sorts communs", row.spell_id, snapshot.spellSyncMappings);
        return { catalogueSpellId: row.spell_id, serverSpellId: mapping.server_spell_id, replacesServerSpellId: mapping.replaces_server_spell_id, origine: mapping.origine, scope: mapping.scope, monsterTemplateId: mapping.monster_template_id, shortcutPosition: mapping.shortcut_position };
      }),
    },
  ];
  const hashed = { format: "gladiatrool-spell-audit" as const, schemaVersion: SPELL_AUDIT_SCHEMA_VERSION as 2, effectsComparison: "informational_text_only" as const, classes };
  return { ...hashed, exportedAt: new Date().toISOString(), contentHash: await contentHash(hashed) };
}

export async function exportGlobalAuditV2(snapshot: TransferSnapshot): Promise<void> {
  const document = await buildGlobalAuditV2(snapshot);
  download(new Blob([JSON.stringify(document, null, 2)], { type: "application/json" }), "gladiatrool-audit-v2.json");
}

async function finishZip(zip: JSZip, filename: string): Promise<void> {
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  download(blob, filename);
}

export async function exportSpell(spell: Spell, snapshot: TransferSnapshot): Promise<void> {
  const zip = new JSZip();
  await buildDocument(zip, "", "spell", spell.classe, [spell], snapshot);
  await finishZip(zip, `sort-${spell.id}-${slug(spell.nom)}.zip`);
}

export async function exportClass(className: string, snapshot: TransferSnapshot): Promise<void> {
  const spells = className === "Sorts communs"
    ? snapshot.commonSpells
    : snapshot.spells.filter((spell) => spell.classe === className);
  if (!spells.length) throw new Error(`Aucun sort à exporter pour ${className}.`);
  const zip = new JSZip();
  await buildDocument(zip, "", className === "Sorts communs" ? "common" : "class", className, spells, snapshot);
  await finishZip(zip, `${slug(className)}-sorts.zip`);
}

export async function exportGlobal(snapshot: TransferSnapshot): Promise<void> {
  const zip = new JSZip();
  const entries: Array<{ classe: string; config: string; nombreSorts: number }> = [];
  for (const className of CLASSES) {
    const spells = snapshot.spells.filter((spell) => spell.classe === className);
    const folder = `classes/${slug(className)}/`;
    await buildDocument(zip, folder, "class", className, spells, snapshot);
    entries.push({ classe: className, config: `${folder}config.json`, nombreSorts: spells.length });
  }
  const commonFolder = "sorts-communs/";
  await buildDocument(zip, commonFolder, "common", "Sorts communs", snapshot.commonSpells, snapshot);
  entries.push({ classe: "Sorts communs", config: `${commonFolder}config.json`, nombreSorts: snapshot.commonSpells.length });
  zip.file("manifest.json", JSON.stringify({
    format: SPELL_DUMP_FORMAT,
    formatVersion: SPELL_DUMP_VERSION,
    scope: "global",
    exporteLe: new Date().toISOString(),
    classes: entries,
  }, null, 2));
  await finishZip(zip, "gladiatrool-export-global.zip");
}

function parseDocument(value: unknown, source: string): SpellDumpDocument {
  try {
    return documentSchema.parse(value) as SpellDumpDocument;
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      throw new Error(`${source} invalide : ${issue.path.join(".") || "racine"} — ${issue.message}`);
    }
    throw error;
  }
}

async function documentsFromFile(file: File): Promise<SpellDumpDocument[]> {
  if (!file.size) throw new Error("Le fichier d’import est vide.");
  if (file.size > MAX_IMPORT_BYTES) throw new Error("Le fichier d’import dépasse la limite de 25 Mo.");
  if (file.name.toLowerCase().endsWith(".json")) {
    return [parseDocument(JSON.parse(await file.text()), file.name)];
  }
  if (!file.name.toLowerCase().endsWith(".zip")) throw new Error("Utilisez un export JSON ou ZIP Gladiatrool.");
  const zip = await JSZip.loadAsync(file);
  const configs = Object.values(zip.files).filter((entry) => !entry.dir && /(^|\/)config\.json$/i.test(entry.name));
  if (!configs.length) throw new Error("L’archive ne contient aucun fichier config.json.");
  return Promise.all(configs.map(async (entry) => parseDocument(JSON.parse(await entry.async("text")), entry.name)));
}

function importSpellData(spell: DumpSpell): Record<string, unknown> {
  const data = { ...spell } as Record<string, unknown>;
  delete data.origine;
  delete data.icone;
  delete data.classe;
  return data;
}

export async function buildImportPayload(
  file: File,
  baselineSpells: Spell[],
  baselineStats: Record<string, ClassStats>,
): Promise<ImportPayload> {
  const documents = await documentsFromFile(file);
  const seenClasses = new Set<string>();
  const classes = documents.map((document): ImportClassPayload => {
    const className = document.classe.nom;
    if (![...CLASSES, "Sorts communs"].includes(className)) throw new Error(`Classe inconnue : ${className}.`);
    if (seenClasses.has(className)) throw new Error(`La classe ${className} apparaît plusieurs fois dans l’import.`);
    seenClasses.add(className);
    const ids = new Set<number>();
    const spells = document.sorts.map((spell): ImportSpellPayload => {
      if (spell.classe !== className) throw new Error(`Le sort #${spell.id} n’appartient pas à ${className}.`);
      if (ids.has(spell.id)) throw new Error(`Le sort #${spell.id} apparaît plusieurs fois dans ${className}.`);
      ids.add(spell.id);
      const baseline = baselineSpells.find((item) => item.id === spell.id && item.classe === className);
      const native = Boolean(baseline);
      if (!native && spell.id < 1_000_000) {
        throw new Error(`Le sort absent #${spell.id} ne peut pas être créé : les identifiants personnalisés commencent à 1000000.`);
      }
      return {
        id: spell.id,
        className,
        native,
        spell: importSpellData(spell),
        baseline: baseline ? withoutRuntimeFields(baseline) : null,
      };
    });
    return {
      className,
      stats: className === "Sorts communs" ? null : document.classe.caracteristiques,
      baselineStats: className === "Sorts communs" ? null : baselineStats[className] ?? null,
      spells,
    };
  });
  return { formatVersion: SPELL_DUMP_VERSION, classes };
}

export function transferSnapshot(input: {
  spells: Spell[];
  commonSpells: Spell[];
  morphStats: Record<string, ClassStats>;
  createdSpells: Array<{ id: number; class_name: string }>;
  deletedNativeSpells?: DeletedNativeSpellRow[];
  spellSyncMappings?: SpellSyncMapping[];
}): TransferSnapshot {
  return {
    spells: input.spells,
    commonSpells: input.commonSpells,
    morphStats: input.morphStats,
    customSpellKeys: new Set(input.createdSpells.map((row) => `${row.class_name}\u0000${row.id}`)),
    deletedNativeSpells: input.deletedNativeSpells ?? [],
    spellSyncMappings: input.spellSyncMappings ?? [],
  };
}
