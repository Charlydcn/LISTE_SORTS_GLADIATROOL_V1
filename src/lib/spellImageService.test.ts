import { describe, expect, it } from "vitest";
import {
  MAX_SPELL_IMAGE_BYTES,
  storedSpellImagePath,
  validateSpellImage,
} from "./spellImageService";

describe("images de sorts", () => {
  it("accepte un SVG valide", async () => {
    const file = new File(["<svg xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M0 0\"/></svg>"], "icone.svg", {
      type: "image/svg+xml",
    });
    await expect(validateSpellImage(file)).resolves.toBe("svg");
  });

  it("refuse les GIF et les fichiers trop volumineux", async () => {
    await expect(validateSpellImage(new File(["GIF89a"], "icone.gif", { type: "image/gif" }))).rejects.toThrow(
      "Format refusé",
    );
    const oversized = new File([new Uint8Array(MAX_SPELL_IMAGE_BYTES + 1)], "icone.svg", {
      type: "image/svg+xml",
    });
    await expect(validateSpellImage(oversized)).rejects.toThrow("2 Mo");
  });

  it("extrait uniquement les chemins du bucket dédié", () => {
    expect(
      storedSpellImagePath(
        "https://example.supabase.co/storage/v1/object/public/spell-images/390/icone.svg",
      ),
    ).toBe("390/icone.svg");
    expect(storedSpellImagePath("assets/img/spells/390.svg")).toBeNull();
  });
});
