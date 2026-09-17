import { describe, expect, it } from "vitest";
import { weaponNameForType } from "./weaponUtils";

describe("noms des armes", () => {
  it("remplace le type en conservant le suffixe de classe", () => {
    expect(weaponNameForType("Dagues Sacrieur", "Dagues", "Marteau")).toBe("Marteau Sacrieur");
    expect(weaponNameForType("Bâton de Feca", "Bâton", "Hache")).toBe("Hache de Feca");
  });

  it("gère le préfixe Epée sans accent dans le nom source", () => {
    expect(weaponNameForType("Epée Ecaflip", "Épée", "Arc")).toBe("Arc Ecaflip");
  });
});
