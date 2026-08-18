/* ==========================================================================
   CHARGEMENT DES DONNÉES DES SORTS — Gladiatrool (Dofus Retro)
   ==========================================================================
   Les données sont réparties dans 13 fichiers JSON :
     - 12 fichiers de classe (feca.json, osamodas.json, ... pandawa.json)
     - 1 fichier de sorts communs (sortsCommuns.json)

   Ce module les charge via fetch, puis expose :
     - CLASSES        : noms des 12 classes (ordre d'affichage)
     - CLASS_ICONS    : URL d'icône par classe
     - SPELLS         : tous les sorts des 12 classes (avec champ `classe`)
     - COMMON_SPELLS  : les 8 sorts communs à toutes les classes
   et promet l'état prêt via window.DATA_READY.
   ========================================================================== */

const CLASS_ICONS = {
  "Feca": "assets/img/classes/1M.svg",
  "Osamodas": "assets/img/classes/2M.svg",
  "Enutrof": "assets/img/classes/3M.svg",
  "Sram": "assets/img/classes/4M.svg",
  "Xelor": "assets/img/classes/5M.svg",
  "Ecaflip": "assets/img/classes/6M.svg",
  "Eniripsa": "assets/img/classes/7M.svg",
  "Iop": "assets/img/classes/8M.svg",
  "Crâ": "assets/img/classes/9M.svg",
  "Sadida": "assets/img/classes/10M.svg",
  "Sacrieur": "assets/img/classes/11M.svg",
  "Pandawa": "assets/img/classes/12M.svg"
};

const CLASS_FILES = [
  { name: "Feca",     file: "feca.json",     morphId: 101 },
  { name: "Osamodas", file: "osamodas.json", morphId: 102 },
  { name: "Enutrof",  file: "enutrof.json",  morphId: 103 },
  { name: "Sram",     file: "sram.json",     morphId: 104 },
  { name: "Xelor",    file: "xelor.json",    morphId: 105 },
  { name: "Ecaflip",  file: "ecaflip.json",  morphId: 106 },
  { name: "Eniripsa", file: "eniripsa.json", morphId: 107 },
  { name: "Iop",      file: "iop.json",      morphId: 108 },
  { name: "Crâ",      file: "cra.json",      morphId: 109 },
  { name: "Sadida",   file: "sadida.json",   morphId: 110 },
  { name: "Sacrieur", file: "sacrieur.json", morphId: 111 },
  { name: "Pandawa",  file: "pandawa.json",  morphId: 112 }
];

const CLASSES = CLASS_FILES.map((c) => c.name);

let SPELLS = [];
let COMMON_SPELLS = [];

async function loadSpells() {
  const classDatas = await Promise.all(CLASS_FILES.map(async (c) => {
    const res = await fetch(`data/${c.file}`);
    if (!res.ok) throw new Error(`Impossible de charger ${c.file}`);
    const data = await res.json();
    return { classe: data.classe, morphId: data.morphId, sorts: data.sorts };
  }));

  SPELLS = classDatas.flatMap((cd) =>
    cd.sorts.map((s) => ({ ...s, classe: cd.classe, morphId: cd.morphId }))
  );

  const res = await fetch("data/sortsCommuns.json");
  if (!res.ok) throw new Error("Impossible de charger sortsCommuns.json");
  const common = await res.json();
  COMMON_SPELLS = common.sorts.map((s) => ({ ...s, classe: "Sorts communs" }));
}

window.DATA_READY = loadSpells();
