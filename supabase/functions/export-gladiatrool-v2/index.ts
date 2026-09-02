import { createClient } from "npm:@supabase/supabase-js@2";

const classes = [
  [1, "Feca", "feca.json", 101], [2, "Osamodas", "osamodas.json", 102], [3, "Enutrof", "enutrof.json", 103],
  [4, "Sram", "sram.json", 104], [5, "Xelor", "xelor.json", 105], [6, "Ecaflip", "ecaflip.json", 106],
  [7, "Eniripsa", "eniripsa.json", 107], [8, "Iop", "iop.json", 108], [9, "Crâ", "cra.json", 109],
  [10, "Sadida", "sadida.json", 110], [11, "Sacrieur", "sacrieur.json", 111], [12, "Pandawa", "pandawa.json", 112],
] as const;
const baseUrl = (Deno.env.get("CATALOGUE_BASE_URL") ?? "https://raw.githubusercontent.com/Charlydcn/LISTE_SORTS_GLADIATROOL_V1/main/public").replace(/\/$/, "");
const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=utf-8" };

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  return value;
}

async function sha256(value: unknown): Promise<string> {
  const input = new TextEncoder().encode(JSON.stringify(canonicalize(value)));
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
}

function mappingFor(mappings: any[], className: string, catalogueSpellId: number) {
  return mappings.find((item) => item.class_name === className && item.catalogue_spell_id === catalogueSpellId) ?? {
    server_spell_id: null, replaces_server_spell_id: null, origine: "non_configuree", scope: "morph", monster_template_id: null, shortcut_position: null,
  };
}

function exportSpell(spell: any, mappings: any[]) {
  const mapping = mappingFor(mappings, spell.classe, spell.id);
  return {
    catalogueSpellId: spell.id, serverSpellId: mapping.server_spell_id,
    replacesServerSpellId: mapping.replaces_server_spell_id, origine: mapping.origine,
    scope: mapping.scope, monsterTemplateId: mapping.monster_template_id,
    shortcutPosition: mapping.shortcut_position, cataloguePosition: spell.position ?? null,
    nom: spell.nom, pa: spell.pa, po: spell.po, porteeModifiable: spell.porteeModifiable,
    lancerEnLigne: spell.lancerEnLigne, ligneDeVue: spell.ligneDeVue, cc: spell.cc,
    ec: spell.ec, relance: spell.relance, parTour: spell.parTour, parCible: spell.parCible,
    commun: spell.commun, effets: spell.effets,
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "GET") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: cors });
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase function environment is incomplete.");
    const client = createClient(supabaseUrl, serviceRoleKey);
    const [overridesResult, createdResult, deletedResult, mappingsResult, ...baselineResults] = await Promise.all([
      client.from("public_entity_overrides").select("entity_type,entity_key,field_key,value"),
      client.from("public_created_spells").select("id,class_name,spell"),
      client.from("public_deleted_native_spells").select("class_name,spell_id"),
      client.from("public_spell_sync_mappings").select("class_name,catalogue_spell_id,server_spell_id,replaces_server_spell_id,origine,scope,monster_template_id,shortcut_position"),
      ...classes.map(async ([, , file]) => {
        const response = await fetch(`${baseUrl}/data/${file}`);
        if (!response.ok) throw new Error(`Baseline unavailable: ${file}`);
        return response.json();
      }),
      (async () => {
        const response = await fetch(`${baseUrl}/data/sortsCommuns.json`);
        if (!response.ok) throw new Error("Baseline unavailable: sortsCommuns.json");
        return response.json();
      })(),
    ]);
    for (const result of [overridesResult, createdResult, deletedResult, mappingsResult]) if (result.error) throw result.error;
    const overrides = overridesResult.data ?? [];
    const created = createdResult.data ?? [];
    const deleted = deletedResult.data ?? [];
    const mappings = mappingsResult.data ?? [];
    const baselineByClass = new Map<string, any>();
    baselineResults.slice(0, classes.length).forEach((data, index) => baselineByClass.set(classes[index][1], data));
    baselineByClass.set("Sorts communs", baselineResults[classes.length]);

    const exportClass = (classId: number | null, className: string, morphId: number | null, gradeId: number | null) => {
      const baseline = baselineByClass.get(className);
      const hidden = new Set(deleted.filter((row: any) => row.class_name === className).map((row: any) => String(row.spell_id)));
      const spells = (baseline.sorts as any[]).filter((spell) => !hidden.has(String(spell.id))).map((spell) => ({ ...spell, classe: className }));
      created.filter((row: any) => row.class_name === className).forEach((row: any) => spells.push({ ...row.spell, id: row.id, classe: className }));
      overrides.forEach((row: any) => {
        if (row.entity_type === "spell") spells.filter((spell) => String(spell.id) === String(row.entity_key)).forEach((spell) => {
          if (row.field_key === "effets.normaux" || row.field_key === "effets.critiques") {
            const onglet = row.field_key.split(".")[1];
            const other = spell.effets.filter((effect: any) => effect.onglet !== onglet);
            const replacement = (Array.isArray(row.value) ? row.value : []).map((texte) => ({ onglet, texte: String(texte) }));
            spell.effets = onglet === "normaux" ? [...replacement, ...other] : [...other, ...replacement];
          } else spell[row.field_key] = row.value;
        });
        if (row.entity_type === "spell_position" && String(row.entity_key).startsWith(`${className}/`)) {
          const id = String(row.entity_key).slice(className.length + 1);
          spells.filter((spell) => String(spell.id) === id).forEach((spell) => { spell.position = row.value; });
        }
      });
      return {
        classId, className, morphId, gradeId,
        spells: spells.sort((a, b) => (a.position ?? Number.MAX_SAFE_INTEGER) - (b.position ?? Number.MAX_SAFE_INTEGER)).map((spell) => exportSpell(spell, mappings)),
        suppressedSpells: deleted.filter((row: any) => row.class_name === className).map((row: any) => {
          const mapping = mappingFor(mappings, className, row.spell_id);
          return { catalogueSpellId: row.spell_id, serverSpellId: mapping.server_spell_id, replacesServerSpellId: mapping.replaces_server_spell_id, origine: mapping.origine, scope: mapping.scope, monsterTemplateId: mapping.monster_template_id, shortcutPosition: mapping.shortcut_position };
        }),
      };
    };
    const resultClasses = classes.map(([classId, className, , morphId]) => exportClass(classId, className, morphId, 6));
    resultClasses.push(exportClass(null, "Sorts communs", null, null));
    const payload = { format: "gladiatrool-spell-audit", schemaVersion: 2, effectsComparison: "informational_text_only", classes: resultClasses };
    return new Response(JSON.stringify({ ...payload, exportedAt: new Date().toISOString(), contentHash: await sha256(payload) }), { headers: cors });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Export failed" }), { status: 500, headers: cors });
  }
});
