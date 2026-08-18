/* ==========================================================================
   Génération des JSON de sorts à partir de GLADIATROOL_REBALANCING.md
   Usage : node tools/generate.js
   ========================================================================== */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MD_PATH = path.join(ROOT, "docs", "GLADIATROOL_REBALANCING.md");
const DATA_DIR = path.join(ROOT, "data");

const CLASS_MAP = [
  { md: "Feca",     file: "feca.json",     name: "Feca",     morph: 101 },
  { md: "Osamodas", file: "osamodas.json", name: "Osamodas", morph: 102 },
  { md: "Enutrof",  file: "enutrof.json",  name: "Enutrof",  morph: 103 },
  { md: "Sram",     file: "sram.json",     name: "Sram",     morph: 104 },
  { md: "Xel",      file: "xelor.json",    name: "Xelor",    morph: 105 },
  { md: "Eca",      file: "ecaflip.json",  name: "Ecaflip",  morph: 106 },
  { md: "Eni",      file: "eniripsa.json", name: "Eniripsa", morph: 107 },
  { md: "Iop",      file: "iop.json",      name: "Iop",      morph: 108 },
  { md: "Cra",      file: "cra.json",      name: "Crâ",      morph: 109 },
  { md: "Sadi",     file: "sadida.json",   name: "Sadida",   morph: 110 },
  { md: "Sacri",    file: "sacrieur.json", name: "Sacrieur", morph: 111 },
  { md: "Panda",    file: "pandawa.json",  name: "Pandawa",  morph: 112 },
];

const COMMON_IDS = new Set([350, 364, 366, 367, 368, 369, 370, 373]);

const DASH = "—";

function normalizeDash(v) {
  const t = (v || "").trim();
  if (t === DASH || t === "-" || t === "–" || t === "") return "-";
  return t;
}

function parseBool(v) {
  const t = (v || "").trim().toLowerCase();
  if (t === "oui") return true;
  if (t === "non") return false;
  return null;
}

const ZONE_RE = /^(Point|Cercle|Croix|Ligne|Rectangle|Damier|Autour de la cible|Ligne en T|Croix relative \(lanceur\))\s*\(taille\s*(\d+)\)$/;

function isZone(t) {
  return ZONE_RE.test(t.trim());
}

function normalizeZone(z) {
  const m = z.trim().match(ZONE_RE);
  if (!m) return " (" + z.trim() + ")";
  const shape = m[1];
  const size = parseInt(m[2], 10);
  if (shape === "Point") return " (Point)";
  return ` (${shape} ${size})`;
}

function fixPlaceholders(s) {
  return s.replace(/\bX\b/g, "TODO").replace(/\bY\b/g, "TODO");
}

function reformatEffect(part) {
  const raw = part.trim();
  if (!raw) return null;
  const idx = raw.indexOf("[");
  if (idx === -1) return fixPlaceholders(raw) || null;
  const end = raw.lastIndexOf("]");
  const name = raw.slice(0, idx).trim();
  const inner = end > idx ? raw.slice(idx + 1, end) : "";
  const tokens = inner.split(/,\s*/).filter((t) => t.length > 0);
  let zone = null;
  const rest = [];
  for (const t of tokens) {
    if (isZone(t)) zone = t;
    else rest.push(t);
  }
  const value = rest.join(", ");
  const zoneText = zone ? normalizeZone(zone) : "";
  const cleanName = fixPlaceholders(name);

  // Les pièges et glyphes n'ont pas leurs détails (dégâts, durée précise…) dans le MD.
  let suffix = "";
  if (/^Crée un piège$/i.test(cleanName) || /^Crée une glyphe$/i.test(cleanName)) {
    suffix = " TODO";
  }

  if (value) return `${cleanName} : ${value}${zoneText}${suffix}`;
  return `${cleanName}${zoneText}${suffix}`;
}

function parseEffects(raw) {
  const effets = [];
  const segments = raw.split(/<br\s*\/?>/i);
  for (const seg of segments) {
    const m = seg.trim().match(/^(Norm|CC)\s*:\s*(.*)$/);
    if (!m) continue;
    const onglet = m[1] === "Norm" ? "normaux" : "critiques";
    const body = m[2].trim();
    const parts = body.split(/\s*;\s*/).filter((p) => p.length > 0);
    for (const part of parts) {
      const texte = reformatEffect(part);
      if (texte) effets.push({ onglet, texte });
    }
  }
  return effets;
}

function parseSpellRow(line) {
  const cells = line.split("|").map((c) => c.trim());
  if (cells.length !== 16) {
    console.warn("Ligne avec nb cellules inattendu :", cells.length, "->", line.slice(0, 80));
  }

  const pos = parseInt(cells[1], 10);
  const id = parseInt(cells[2], 10);
  const nom = cells[3];
  const pa = parseInt(cells[4], 10);
  const po = cells[5];
  const porteeModifiable = parseBool(cells[6]);
  const lancerEnLigne = parseBool(cells[7]);
  const ligneDeVue = parseBool(cells[8]);
  const cc = normalizeDash(cells[9]);
  const ec = normalizeDash(cells[10]);
  const relance = normalizeDash(cells[11]);
  const parTourRaw = normalizeDash(cells[12]);
  const parCibleRaw = normalizeDash(cells[13]);
  const effets = parseEffects(cells[14]);

  const commun = COMMON_IDS.has(id);

  return {
    id,
    position: pos,
    nom,
    pa,
    po,
    porteeModifiable,
    lancerEnLigne,
    ligneDeVue,
    cc,
    ec,
    relance,
    parTour: parTourRaw === "-" ? null : parseInt(parTourRaw, 10),
    parCible: parCibleRaw === "-" ? null : parseInt(parCibleRaw, 10),
    icone: commun ? null : `assets/img/spells/${id}.svg`,
    commun,
    effets,
  };
}

function main() {
  const md = fs.readFileSync(MD_PATH, "utf8");
  const lines = md.split(/\r?\n/);

  const sections = [];
  let current = null;
  for (const line of lines) {
    if (/^##\s/.test(line) || /^---\s*$/.test(line)) {
      current = null;
      continue;
    }
    const h = line.match(/^####\s+\d+\.\s*(.+?)\s*\(morph #(\d+)\)/);
    if (h) {
      current = { mdName: h[1].trim(), morph: parseInt(h[2], 10), rows: [] };
      sections.push(current);
      continue;
    }
    if (current && /^\|\s*\d+\s*\|/.test(line)) {
      current.rows.push(line);
    }
  }

  console.log("Sections de classes trouvées :", sections.length);

  // Fichiers de classe (sans les 8 sorts communs)
  for (const cls of CLASS_MAP) {
    const sec = sections.find((s) => s.mdName === cls.md);
    if (!sec) {
      console.error("Section introuvable :", cls.md);
      continue;
    }
    const sorts = sec.rows.map(parseSpellRow).filter((s) => !s.commun);
    const data = { classe: cls.name, morphId: cls.morph, sorts };
    fs.writeFileSync(path.join(DATA_DIR, cls.file), JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`${cls.file.padEnd(18)} -> ${sorts.length} sorts`);
  }

  // Sorts communs (extraits de la première classe, Feca)
  const firstSec = sections.find((s) => s.mdName === "Feca");
  const commonSpells = firstSec.rows.map(parseSpellRow).filter((s) => s.commun);
  fs.writeFileSync(
    path.join(DATA_DIR, "sortsCommuns.json"),
    JSON.stringify({ classe: "Sorts communs", sorts: commonSpells }, null, 2) + "\n",
    "utf8"
  );
  console.log(`sortsCommuns.json    -> ${commonSpells.length} sorts`);
}

main();
