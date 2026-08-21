import { describe, expect, it } from "vitest";
import {
  parseApplyOverrideResult,
  parseClassData,
  parseCommentRows,
  parseOverrideRows,
  parseResetClassResult,
  parseResetCount,
} from "./validation";

const spell = {
  id: 390,
  nom: "Sort partagé",
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

describe("validation des données externes", () => {
  it("accepte un fichier de classe valide", () => {
    expect(parseClassData({ classe: "Feca", morphId: 101, sorts: [spell] }, "feca.json", "Feca", 101)).toEqual({
      classe: "Feca",
      morphId: 101,
      sorts: [spell],
    });
  });

  it("indique le fichier et le chemin du champ invalide", () => {
    const invalid = { ...spell, nom: "" };
    expect(() => parseClassData({ classe: "Feca", morphId: 101, sorts: [invalid] }, "feca.json", "Feca", 101)).toThrow(
      "Données invalides dans feca.json - sorts.0.nom",
    );
  });

  it("rejette une réponse Supabase invalide", () => {
    expect(() => parseOverrideRows([{ id: "x" }], "la table entity_overrides")).toThrow(
      "Données invalides dans la table entity_overrides",
    );
    expect(() => parseCommentRows([{ id: "x" }], "la table spell_comments")).toThrow(
      "Données invalides dans la table spell_comments",
    );
  });

  it("parse strictement les réponses des RPC", () => {
    const result = {
      override_id: "override-1",
      history_id: "history-1",
      saved_at: "2026-08-21T10:00:00.000Z",
      author_label: "admin@example.test",
      was_changed: true,
    };
    expect(parseApplyOverrideResult(result)).toEqual(result);
    expect(parseResetCount(2)).toBe(2);
    expect(parseResetClassResult([{
      reset_count: 2,
      deleted_custom_count: 1,
      restored_native_count: 3,
    }])).toEqual({ reset_count: 2, deleted_custom_count: 1, restored_native_count: 3 });
    expect(() => parseApplyOverrideResult({ ...result, was_changed: "yes" })).toThrow(
      "la réponse de apply_override",
    );
    expect(() => parseResetCount(-1)).toThrow("la réponse de reset_overrides");
    expect(() => parseResetClassResult([])).toThrow("la réponse de reset_spell_class");
  });
});
