/* Chargement de la baseline JSON. Supabase n'altère jamais ces objets source. */
const CLASS_ICONS = Object.freeze({
  Feca: "assets/img/classes/1M.svg",
  Osamodas: "assets/img/classes/2M.svg",
  Enutrof: "assets/img/classes/3M.svg",
  Sram: "assets/img/classes/4M.svg",
  Xelor: "assets/img/classes/5M.svg",
  Ecaflip: "assets/img/classes/6M.svg",
  Eniripsa: "assets/img/classes/7M.svg",
  Iop: "assets/img/classes/8M.svg",
  "Crâ": "assets/img/classes/9M.svg",
  Sadida: "assets/img/classes/10M.svg",
  Sacrieur: "assets/img/classes/11M.svg",
  Pandawa: "assets/img/classes/12M.svg",
});

const CLASS_FILES = Object.freeze([
  { name: "Feca", file: "feca.json", morphId: 101 },
  { name: "Osamodas", file: "osamodas.json", morphId: 102 },
  { name: "Enutrof", file: "enutrof.json", morphId: 103 },
  { name: "Sram", file: "sram.json", morphId: 104 },
  { name: "Xelor", file: "xelor.json", morphId: 105 },
  { name: "Ecaflip", file: "ecaflip.json", morphId: 106 },
  { name: "Eniripsa", file: "eniripsa.json", morphId: 107 },
  { name: "Iop", file: "iop.json", morphId: 108 },
  { name: "Crâ", file: "cra.json", morphId: 109 },
  { name: "Sadida", file: "sadida.json", morphId: 110 },
  { name: "Sacrieur", file: "sacrieur.json", morphId: 111 },
  { name: "Pandawa", file: "pandawa.json", morphId: 112 },
]);

const CLASSES = CLASS_FILES.map((entry) => entry.name);

const BASE_MORPH_STATS = Object.freeze({
  Feca: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 200, intelligence: 300, chance: 60, agilite: 60, initiative: 497 },
  Osamodas: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 150, intelligence: 300, chance: 300, agilite: 60, initiative: 500 },
  Enutrof: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 250, intelligence: 100, chance: 200, agilite: 60, initiative: 500 },
  Sram: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 300, intelligence: 150, chance: 60, agilite: 300, initiative: 500 },
  Xelor: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 150, intelligence: 300, chance: 60, agilite: 60, initiative: 500 },
  Ecaflip: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 300, intelligence: 60, chance: 60, agilite: 200, initiative: 500 },
  Eniripsa: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 200, intelligence: 300, chance: 60, agilite: 60, initiative: 500 },
  Iop: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 300, intelligence: 60, chance: 60, agilite: 60, initiative: 500 },
  "Crâ": { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 250, intelligence: 250, chance: 60, agilite: 150, initiative: 500 },
  Sadida: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 300, intelligence: 300, chance: 300, agilite: 75, initiative: 500 },
  Sacrieur: { vie: 1250, pa: 8, pm: 4, vitalite: 1250, sagesse: 150, force: 150, intelligence: 150, chance: 150, agilite: 150, initiative: 500 },
  Pandawa: { vie: 850, pa: 8, pm: 4, vitalite: 850, sagesse: 150, force: 250, intelligence: 250, chance: 250, agilite: 250, initiative: 500 },
});

let BASE_SPELLS = [];
let BASE_COMMON_SPELLS = [];
let SPELLS = [];
let COMMON_SPELLS = [];
let MORPH_STATS = {};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

async function loadBaselineData() {
  const classData = await Promise.all(CLASS_FILES.map(async (entry) => {
    const response = await fetch(`data/${entry.file}`);
    if (!response.ok) throw new Error(`Impossible de charger ${entry.file}`);
    return response.json();
  }));

  const commonResponse = await fetch("data/sortsCommuns.json");
  if (!commonResponse.ok) throw new Error("Impossible de charger sortsCommuns.json");
  const commonData = await commonResponse.json();

  BASE_SPELLS = classData.flatMap((data) => data.sorts.map((spell) => ({
    ...spell,
    classe: data.classe,
    morphId: data.morphId,
  })));
  BASE_COMMON_SPELLS = commonData.sorts.map((spell) => ({ ...spell, classe: "Sorts communs" }));
  SPELLS = cloneData(BASE_SPELLS);
  COMMON_SPELLS = cloneData(BASE_COMMON_SPELLS);
  MORPH_STATS = cloneData(BASE_MORPH_STATS);
}

window.AppData = {
  loadBaselineData,
  cloneData,
  resetEffective() {
    SPELLS = cloneData(BASE_SPELLS);
    COMMON_SPELLS = cloneData(BASE_COMMON_SPELLS);
    MORPH_STATS = cloneData(BASE_MORPH_STATS);
  },
  getBaselineSpells: () => [...BASE_SPELLS, ...BASE_COMMON_SPELLS],
};
