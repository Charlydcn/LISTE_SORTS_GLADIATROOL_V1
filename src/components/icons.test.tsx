import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ElementIcon, TonicEffectIcon } from "./icons";

describe("icônes des effets", () => {
  it("détecte les éléments quelle que soit la casse", () => {
    render(<ElementIcon text="Dommages : 5 à 10 (neutre)" />);
    expect(screen.getByRole("img", { name: "Neutre" })).toHaveAttribute(
      "src",
      "assets/img/icons/NeutralDamage.svg",
    );
  });

  it("applique aussi l’insensibilité à la casse aux effets de toniques", () => {
    render(<TonicEffectIcon text="+100 vitalité" />);
    expect(screen.getByRole("img", { name: "Vitalité" })).toHaveAttribute(
      "src",
      "assets/img/icons/Vita.svg",
    );
  });
});
