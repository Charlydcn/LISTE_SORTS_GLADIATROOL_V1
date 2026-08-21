import { describe, expect, it } from "vitest";
import { displayValue, errorMessage, escapeAttribute, escapeHtml, fieldLabel, formatDate, valueText } from "./utils";

describe("utilitaires de présentation", () => {
  it("échappe le HTML et les attributs", () => {
    expect(escapeHtml(`<tag attr='x'>&`)).toBe("&lt;tag attr=&#039;x&#039;&gt;&amp;");
    expect(escapeAttribute("`\"<")).toBe("&#096;&quot;&lt;");
  });

  it("normalise les messages et les valeurs affichées", () => {
    expect(errorMessage(undefined)).toBe("Une erreur inattendue est survenue.");
    expect(errorMessage(new Error("Invalid login credentials"))).toBe("Email ou mot de passe incorrect.");
    expect(displayValue(null)).toBe("-");
    expect(displayValue(0)).toBe("0");
    expect(valueText(true)).toBe("Oui");
    expect(valueText([])).toBe("(aucun effet)");
    expect(valueText(["a", "b"])).toBe("a\nb");
    expect(fieldLabel("pa")).toBe("PA");
    expect(fieldLabel("inconnu")).toBe("inconnu");
  });

  it("gère les dates absentes et invalides", () => {
    expect(formatDate(undefined)).toBe("date inconnue");
    expect(formatDate("invalide")).toBe("date inconnue");
    expect(formatDate("2026-08-21T10:30:00.000Z")).toMatch(/21\/08\/2026/);
  });
});
