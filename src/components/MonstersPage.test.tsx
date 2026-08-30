import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MonstersPage } from "./MonstersPage";

describe("MonstersPage", () => {
  it("affiche les monstres avec un lien Solomonk dans un nouvel onglet", () => {
    render(<MonstersPage />);
    const link = screen.getByRole("link", { name: "Chafemal le Bagarreur" });
    expect(link).toHaveAttribute("href", "https://solomonk.fr/fr/monstre/2319");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("trie les monstres par niveau", async () => {
    const user = userEvent.setup();
    render(<MonstersPage />);
    await user.click(screen.getByRole("button", { name: "Trier par Niveau" }));
    const levels = screen.getAllByRole("cell").filter((cell) => /^\d+$/.test(cell.textContent ?? ""));
    expect(Number(levels[0].textContent)).toBeLessThanOrEqual(Number(levels[1].textContent));
  });
});
