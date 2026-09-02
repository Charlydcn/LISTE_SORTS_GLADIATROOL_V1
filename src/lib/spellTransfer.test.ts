import { afterEach, describe, expect, it, vi } from "vitest";
import JSZip from "jszip";
import type { Spell } from "../types";
import { buildGlobalAuditV2, buildImportPayload, exportClass, transferSnapshot } from "./spellTransfer";

const native: Spell = {
  id: 141, position: 1, nom: "Pression", pa: 2, po: "1–2",
  porteeModifiable: false, lancerEnLigne: false, ligneDeVue: true,
  cc: "1/40", ec: "1/100", relance: "-", parTour: 0, parCible: 0,
  icone: "assets/img/spells/141.svg", commun: false,
  effets: [{ onglet: "normaux", texte: "Dommages" }], classe: "Iop", morphId: 108,
};

function document(spells: unknown[]) {
  return {
    format: "gladiatrool-spells", formatVersion: 1, scope: "class",
    exporteLe: "2026-08-22T00:00:00.000Z",
    classe: { nom: "Iop", morphId: 108, caracteristiques: { vie: 850 } },
    sorts: spells,
  };
}

function dumpedSpell(id: number, origine: "native" | "personnalise" = "native") {
  return {
    ...native, id, origine, icone: { fichier: `icones/${id}.svg`, format: "svg", typeMime: "image/svg+xml" },
  };
}

afterEach(() => vi.restoreAllMocks());

describe("import des exports de sorts", () => {
  it("reconnaît un natif et conserve un identifiant personnalisé", async () => {
    const file = new File(
      [JSON.stringify(document([dumpedSpell(141), dumpedSpell(1_000_003, "personnalise")]))],
      "config.json",
      { type: "application/json" },
    );
    const payload = await buildImportPayload(file, [native], { Iop: { vie: 850 } });
    expect(payload.classes[0].spells.map((spell) => [spell.id, spell.native])).toEqual([
      [141, true], [1_000_003, false],
    ]);
    expect(payload.classes[0].spells[0].spell).not.toHaveProperty("icone");
  });

  it("refuse de créer un identifiant absent dans la plage native", async () => {
    const file = new File([JSON.stringify(document([dumpedSpell(600)]))], "config.json");
    await expect(buildImportPayload(file, [native], { Iop: { vie: 850 } }))
      .rejects.toThrow("identifiants personnalisés commencent à 1000000");
  });

  it("lit directement le config.json contenu dans un ZIP", async () => {
    const zip = new JSZip();
    zip.file("classes/iop/config.json", JSON.stringify(document([dumpedSpell(141)])));
    const blob = await zip.generateAsync({ type: "blob" });
    const file = new File([blob], "global.zip", { type: "application/zip" });
    const payload = await buildImportPayload(file, [native], { Iop: { vie: 850 } });
    expect(payload.classes[0].className).toBe("Iop");
  });
});

describe("export ZIP", () => {
  it("produit un config séparé et conserve le fichier image SVG", async () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(svg, {
      status: 200, headers: { "content-type": "image/svg+xml" },
    })));
    let downloaded: Blob | null = null;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      if (blob instanceof Blob) downloaded = blob;
      return "blob:test";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);

    await exportClass("Iop", transferSnapshot({
      spells: [native], commonSpells: [], morphStats: { Iop: { vie: 850 } }, createdSpells: [],
    }));

    expect(downloaded).not.toBeNull();
    const zip = await JSZip.loadAsync(downloaded!);
    const config = JSON.parse(await zip.file("config.json")!.async("text"));
    expect(config.classe.caracteristiques).toEqual({ vie: 850 });
    expect(config.sorts[0]).toMatchObject({ id: 141, origine: "native", icone: { format: "svg" } });
    expect(await zip.file("icones/141-pression.svg")!.async("text")).toBe(svg);
  });
});

describe("export d’audit v2", () => {
  it("garde l’identité catalogue et signale un mapping absent sans le déduire", async () => {
    const document = await buildGlobalAuditV2(transferSnapshot({
      spells: [native], commonSpells: [], morphStats: { Iop: { vie: 850 } }, createdSpells: [],
    }));
    const iop = document.classes.find((item: any) => item.className === "Iop") as any;
    expect(document).toMatchObject({ format: "gladiatrool-spell-audit", schemaVersion: 2, effectsComparison: "informational_text_only" });
    expect(document.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(iop.spells[0]).toMatchObject({
      catalogueSpellId: 141, serverSpellId: null, origine: "non_configuree", shortcutPosition: null,
    });
  });
});
