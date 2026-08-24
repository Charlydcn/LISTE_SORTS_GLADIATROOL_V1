import { describe, expect, it } from "vitest";
import catalog from "../../public/data/toniques.json";
import { parseTonicData } from "./validation";

describe("catalogue natif des toniques", () => {
  const items = parseTonicData(catalog, "toniques.json");

  it("contient les 25 toniques attendus", () => {
    const tonics = items.filter((item) => item.kind === "tonique");
    expect(tonics.filter((item) => item.category === "palier1")).toHaveLength(11);
    expect(tonics.filter((item) => item.category === "palier2")).toHaveLength(11);
    expect(tonics.filter((item) => item.category === "rarus")).toHaveLength(3);
  });

  it("contient 20 mutations pour chacune des 12 classes", () => {
    const mutations = items.filter((item) => item.kind === "mutation");
    expect(mutations).toHaveLength(240);
    const counts = mutations.reduce<Record<string, number>>((result, item) => {
      const className = item.className ?? "";
      result[className] = (result[className] ?? 0) + 1;
      return result;
    }, {});
    expect(Object.values(counts)).toEqual(Array(12).fill(20));
  });
});
