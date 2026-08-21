import { afterEach, describe, expect, it, vi } from "vitest";
import { CLASS_FILES, loadBaselineData } from "./dataService";

function spell(id: number, nom = `Sort ${id}`) {
  return {
    id,
    nom,
    pa: 4,
    po: "1 à 6",
    porteeModifiable: true,
    lancerEnLigne: false,
    ligneDeVue: true,
    cc: "1/50",
    ec: "1/100",
    relance: "0",
    parTour: null,
    parCible: null,
    icone: null,
    commun: false,
    effets: [{ onglet: "normaux", texte: "Effet" }],
  };
}

afterEach(() => vi.unstubAllGlobals());

describe("chargement de la baseline", () => {
  it("détecte deux définitions divergentes pour un identifiant partagé", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => {
        const file = url.replace("data/", "");
        if (file === "sortsCommuns.json") {
          return { ok: true, json: async () => ({ classe: "Sorts communs", sorts: [] }) };
        }
        const entry = CLASS_FILES.find((item) => item.file === file)!;
        const duplicate = entry.name === "Feca" ? spell(390, "Même sort") : entry.name === "Osamodas" ? spell(390, "Autre définition") : spell(entry.morphId);
        return { ok: true, json: async () => ({ classe: entry.name, morphId: entry.morphId, sorts: [duplicate] }) };
      }),
    );

    await expect(loadBaselineData()).rejects.toThrow("Le sort partagé #390 possède des définitions JSON différentes.");
  });
});
