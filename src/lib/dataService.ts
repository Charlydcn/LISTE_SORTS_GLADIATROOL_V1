import type { ClassStats, Spell } from "../types";

export interface ClassFile {
  name: string;
  file: string;
  morphId: number;
}

export const CLASS_ICONS: Record<string, string> = {
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
};

export const CLASS_FILES: ClassFile[] = [
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
];

export const CLASSES: string[] = CLASS_FILES.map((entry) => entry.name);

export const BASE_MORPH_STATS: Record<string, ClassStats> = {
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
};

export function cloneData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

interface ClassDataJson {
  classe: string;
  morphId: number;
  sorts: Omit<Spell, "classe" | "morphId">[];
}

interface CommonDataJson {
  classe: string;
  sorts: Omit<Spell, "classe" | "morphId">[];
}

export interface BaselineData {
  baseSpells: Spell[];
  baseCommonSpells: Spell[];
  baseMorphStats: Record<string, ClassStats>;
}

export async function loadBaselineData(): Promise<BaselineData> {
  const classData = await Promise.all(
    CLASS_FILES.map(async (entry) => {
      const response = await fetch(`data/${entry.file}`);
      if (!response.ok) throw new Error(`Impossible de charger ${entry.file}`);
      return (await response.json()) as ClassDataJson;
    }),
  );

  const commonResponse = await fetch("data/sortsCommuns.json");
  if (!commonResponse.ok) throw new Error("Impossible de charger sortsCommuns.json");
  const commonData = (await commonResponse.json()) as CommonDataJson;

  const baseSpells: Spell[] = classData.flatMap((data) =>
    data.sorts.map((spell) => ({
      ...spell,
      classe: data.classe,
      morphId: data.morphId,
    }) as Spell),
  );

  const baseCommonSpells: Spell[] = commonData.sorts.map((spell) => ({
    ...spell,
    classe: "Sorts communs",
  }) as Spell);

  const baseMorphStats = cloneData(BASE_MORPH_STATS);

  return { baseSpells, baseCommonSpells, baseMorphStats };
}
