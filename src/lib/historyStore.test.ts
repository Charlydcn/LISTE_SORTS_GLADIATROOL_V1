import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("./supabase", () => ({ supabase: supabaseMock }));

import { useHistoryStore } from "./historyStore";
import { useSessionStore } from "./sessionStore";

const historyRow = {
  id: "history-1",
  entity_type: "spell",
  entity_key: "390",
  field_key: "pa",
  old_value: 4,
  new_value: 6,
  changed_at: "2026-08-21T10:00:00.000Z",
  changed_by: "user-1",
  changed_by_label: "admin@example.test",
};

function installQuery(response: { data: unknown; error: unknown }) {
  const query = {
    eq: vi.fn(() => query),
    in: vi.fn(() => query),
    or: vi.fn(() => query),
    order: vi.fn(() => query),
    range: vi.fn(async () => response),
  };
  supabaseMock.from.mockReturnValue({
    select: vi.fn(() => query),
    delete: vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) })),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  useHistoryStore.getState().close();
  useSessionStore.setState({ mode: "guest", user: null });
});

describe("historique", () => {
  it("lit la vue publique en invité et affiche des lignes valides", async () => {
    installQuery({ data: [historyRow], error: null });
    await useHistoryStore.getState().reload();
    expect(supabaseMock.from).toHaveBeenCalledWith("public_change_history");
    expect(useHistoryStore.getState().rows).toEqual([historyRow]);
  });

  it("conserve une erreur exploitable pour une réponse invalide ou en erreur", async () => {
    installQuery({ data: [{ id: "incomplet" }], error: null });
    await useHistoryStore.getState().reload();
    expect(useHistoryStore.getState().error).toContain("Données invalides dans la table public_change_history");

    installQuery({ data: null, error: { message: "Lecture refusée" } });
    await useHistoryStore.getState().reload();
    expect(useHistoryStore.getState().error).toBe("Lecture refusée");
  });

  it("charge la page suivante et autorise la suppression pour un administrateur", async () => {
    const firstPage = Array.from({ length: 50 }, (_, index) => ({ ...historyRow, id: `history-${index}` }));
    const nextPage = [{ ...historyRow, id: "history-50" }];
    const query = {
      eq: vi.fn(() => query),
      in: vi.fn(() => query),
      or: vi.fn(() => query),
      order: vi.fn(() => query),
      range: vi.fn()
        .mockResolvedValueOnce({ data: firstPage, error: null })
        .mockResolvedValueOnce({ data: nextPage, error: null }),
    };
    const remove = vi.fn(async () => ({ error: null }));
    supabaseMock.from.mockReturnValue({ select: vi.fn(() => query), delete: vi.fn(() => ({ eq: remove })) });
    useSessionStore.setState({ mode: "admin", user: { id: "user-1" } as never });

    await useHistoryStore.getState().reload();
    expect(supabaseMock.from).toHaveBeenCalledWith("change_history");
    expect(useHistoryStore.getState().hasMore).toBe(true);
    await useHistoryStore.getState().loadMore();
    expect(useHistoryStore.getState().rows).toHaveLength(51);

    await useHistoryStore.getState().remove("history-50");
    expect(remove).toHaveBeenCalledWith("id", "history-50");
    expect(useHistoryStore.getState().rows).toHaveLength(50);
  });

  it("recherche aussi les auteurs dans l'historique global", async () => {
    const query = {
      eq: vi.fn(() => query),
      in: vi.fn(() => query),
      or: vi.fn(() => query),
      order: vi.fn(() => query),
      range: vi.fn(async () => ({ data: [historyRow], error: null })),
    };
    supabaseMock.from.mockReturnValue({ select: vi.fn(() => query) });
    useSessionStore.setState({ mode: "admin", user: { id: "user-1" } as never });
    useHistoryStore.getState().setSearch("admin@example.test");

    await useHistoryStore.getState().reload();

    expect(query.or).toHaveBeenCalledWith(expect.stringContaining("changed_by_label.ilike.%admin@example.test%"));
  });
});
