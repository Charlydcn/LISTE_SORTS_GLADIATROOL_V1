import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Spell } from "../types";

const supabaseMock = vi.hoisted(() => ({ rpc: vi.fn() }));

vi.mock("./supabase", () => ({ supabase: supabaseMock }));

import { useDataStore } from "./dataStore";
import { useSessionStore } from "./sessionStore";

function makeSpell(id: number, classe: string): Spell {
  return {
    id,
    classe,
    morphId: 101,
    nom: `Sort ${id}`,
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

function installBaseline() {
  const spells = [390, 391, 393, 395].flatMap((id) => [makeSpell(id, "Feca"), makeSpell(id, "Osamodas")]);
  useDataStore.setState({
    status: "ready",
    baseSpells: spells,
    baseCommonSpells: [],
    baseMorphStats: {},
    spells: structuredClone(spells),
    commonSpells: [],
    morphStats: {},
    overrides: {},
    createdSpells: [],
    deletedNativeSpells: [],
    loadError: "",
    collaborationWarning: "",
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  installBaseline();
  useSessionStore.setState({ mode: "admin", user: { id: "user-1", email: "admin@example.test" } as never });
});

describe("overrides effectifs", () => {
  it("applique et réinitialise chaque sort partagé dans ses deux occurrences", () => {
    const rows = [390, 391, 393, 395].map((id) => ({
      id: `override-${id}`,
      entity_type: "spell",
      entity_key: String(id),
      field_key: "pa",
      value: 7,
      previous_value: 4,
      updated_at: "2026-08-21T10:00:00.000Z",
    }));

    useDataStore.getState().applyRows(rows);
    for (const id of [390, 391, 393, 395]) {
      expect(useDataStore.getState().spells.filter((spell) => spell.id === id).map((spell) => spell.pa)).toEqual([7, 7]);
      expect(useDataStore.getState().hasOverride("spell", String(id), "pa")).toBe(true);
    }

    useDataStore.getState().resetEffective();
    for (const id of [390, 391, 393, 395]) {
      expect(useDataStore.getState().spells.filter((spell) => spell.id === id).map((spell) => spell.pa)).toEqual([4, 4]);
    }
  });

  it("applique une position indépendamment pour chaque classe", () => {
    useDataStore.getState().applyRows([{
      id: "position-feca-390",
      entity_type: "spell_position",
      entity_key: "Feca/390",
      field_key: "position",
      value: 8,
      previous_value: 1,
      updated_at: "2026-08-21T10:00:00.000Z",
    }]);

    expect(useDataStore.getState().spells.find((spell) => spell.classe === "Feca" && spell.id === 390)?.position).toBe(8);
    expect(useDataStore.getState().spells.find((spell) => spell.classe === "Osamodas" && spell.id === 390)?.position).toBeUndefined();
  });

  it("réordonne uniquement les positions sans appeler la sauvegarde d icône", async () => {
    supabaseMock.rpc.mockResolvedValue({
      data: [{
        override_id: "position-override",
        history_id: "position-history",
        saved_at: "2026-08-21T10:00:00.000Z",
        author_label: "admin@example.test",
        was_changed: true,
      }],
      error: null,
    });
    const fecaSpells = useDataStore.getState().spells.filter((spell) => spell.classe === "Feca");

    await useDataStore.getState().reorderSpells("Feca", [...fecaSpells].reverse());

    expect(supabaseMock.rpc).not.toHaveBeenCalledWith("apply_spell_icon_override", expect.anything());
    for (const call of supabaseMock.rpc.mock.calls) {
      expect(call[0]).toBe("apply_override");
      expect(call[1]).toMatchObject({ p_entity_type: "spell_position", p_field_key: "position" });
    }
  });

  it("enregistre un override après avoir validé la réponse apply_override", async () => {
    supabaseMock.rpc.mockResolvedValue({
      data: [{
        override_id: "override-390",
        history_id: "history-390",
        saved_at: "2026-08-21T10:00:00.000Z",
        author_label: "admin@example.test",
        was_changed: true,
      }],
      error: null,
    });

    await expect(useDataStore.getState().save("spell", "390", "pa", 6)).resolves.toMatchObject({
      changed: true,
      historyId: "history-390",
    });
    expect(supabaseMock.rpc).toHaveBeenCalledWith("apply_override", expect.objectContaining({ p_baseline_value: 4 }));
    expect(useDataStore.getState().spells.filter((spell) => spell.id === 390).map((spell) => spell.pa)).toEqual([6, 6]);
  });

  it("rejette une réponse RPC invalide sans modifier les données", async () => {
    supabaseMock.rpc.mockResolvedValue({ data: [{ was_changed: true }], error: null });
    await expect(useDataStore.getState().save("spell", "390", "pa", 6)).rejects.toThrow("la réponse de apply_override");
    expect(useDataStore.getState().spells.filter((spell) => spell.id === 390).map((spell) => spell.pa)).toEqual([4, 4]);
  });

  it("enregistre une icône sans passer par la RPC historisée", async () => {
    supabaseMock.rpc.mockResolvedValue({
      data: [{
        override_id: "override-icon-390",
        history_id: null,
        saved_at: "2026-08-21T10:00:00.000Z",
        author_label: "admin@example.test",
        was_changed: true,
      }],
      error: null,
    });

    const url = "https://example.supabase.co/storage/v1/object/public/spell-images/390/icon.svg";
    await useDataStore.getState().save("spell", "390", "icone", url);

    expect(supabaseMock.rpc).toHaveBeenCalledWith("apply_spell_icon_override", {
      p_entity_key: "390",
      p_new_value: url,
      p_baseline_value: null,
    });
    expect(useDataStore.getState().spells.filter((spell) => spell.id === 390).map((spell) => spell.icone)).toEqual([
      url,
      url,
    ]);
  });

  it("réinitialise les valeurs locales seulement après une réponse reset_overrides valide", async () => {
    const row = {
      id: "override-390",
      entity_type: "spell",
      entity_key: "390",
      field_key: "pa",
      value: 6,
      previous_value: 4,
      updated_at: "2026-08-21T10:00:00.000Z",
    };
    useDataStore.getState().applyRows([row]);
    supabaseMock.rpc.mockResolvedValue({ data: 1, error: null });

    await expect(useDataStore.getState().reset([row])).resolves.toBe(1);
    expect(supabaseMock.rpc).toHaveBeenCalledWith("reset_overrides", expect.any(Object));
    expect(useDataStore.getState().spells.filter((spell) => spell.id === 390).map((spell) => spell.pa)).toEqual([4, 4]);
  });

  it("réinitialise une classe complète et retire son catalogue personnalisé", async () => {
    const custom = makeSpell(1_000_000, "Feca");
    const { id: _id, classe: _classe, morphId: _morphId, ...customData } = custom;
    useDataStore.setState({
      createdSpells: [{ id: custom.id, class_name: "Feca", spell: customData, created_at: "2026-08-21T10:00:00.000Z" }],
      deletedNativeSpells: [{ class_name: "Feca", spell_id: 390, deleted_at: "2026-08-21T10:00:00.000Z" }],
    });
    useDataStore.getState().applyRows([{
      id: "position-custom",
      entity_type: "spell_position",
      entity_key: "Feca/1000000",
      field_key: "position",
      value: 1,
      previous_value: null,
      updated_at: "2026-08-21T10:00:00.000Z",
    }]);
    supabaseMock.rpc.mockResolvedValue({
      data: [{ reset_count: 1, deleted_custom_count: 1, restored_native_count: 1 }],
      error: null,
    });

    await expect(useDataStore.getState().resetClass("Feca")).resolves.toBe(3);

    expect(supabaseMock.rpc).toHaveBeenCalledWith("reset_spell_class", expect.objectContaining({
      p_class_name: "Feca",
      p_native_spell_ids: [390, 391, 393, 395],
    }));
    expect(useDataStore.getState().createdSpells).toEqual([]);
    expect(useDataStore.getState().deletedNativeSpells).toEqual([]);
    expect(useDataStore.getState().spells.filter((spell) => spell.classe === "Feca").map((spell) => spell.id)).toEqual([390, 391, 393, 395]);
    expect(Object.values(useDataStore.getState().overrides).some((row) => row.entity_type === "spell_position" && row.entity_key.startsWith("Feca/"))).toBe(false);
  });
});
