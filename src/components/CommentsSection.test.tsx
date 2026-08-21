import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const supabaseMock = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("../lib/supabase", () => ({ supabase: supabaseMock }));

import { CommentsSection } from "./CommentsSection";
import { useToastStore } from "../lib/toastStore";

const initialComment = {
  id: "comment-1",
  spell_id: "390",
  body: "Première version",
  created_at: "2026-08-21T10:00:00.000Z",
  updated_at: "2026-08-21T10:00:00.000Z",
  created_by_label: "admin@example.test",
  updated_by_label: "admin@example.test",
};

function installQueries(options: {
  lists: Array<{ data: unknown; error: unknown }>;
  insert?: { error: unknown };
  update?: { error: unknown };
  remove?: { error: unknown };
}) {
  supabaseMock.from.mockImplementation(() => {
    const listQuery = {
      eq: vi.fn(() => listQuery),
      order: vi.fn(async () => options.lists.shift() ?? { data: [], error: null }),
    };
    return {
      select: vi.fn(() => listQuery),
      insert: vi.fn(async () => options.insert ?? { error: null }),
      update: vi.fn(() => ({ eq: vi.fn(async () => options.update ?? { error: null }) })),
      delete: vi.fn(() => ({ eq: vi.fn(async () => options.remove ?? { error: null }) })),
    };
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  useToastStore.setState({ toasts: [] });
});

describe("commentaires", () => {
  it("affiche une erreur explicite si le chargement échoue ou renvoie des données invalides", async () => {
    installQueries({ lists: [{ data: null, error: { message: "Connexion refusée" } }] });
    const { rerender } = render(<CommentsSection spellId={390} />);
    expect(await screen.findByText("Connexion refusée")).toBeInTheDocument();

    installQueries({ lists: [{ data: [{ id: "incomplet" }], error: null }] });
    rerender(<CommentsSection spellId={391} />);
    expect(await screen.findByText(/Données invalides dans la table spell_comments/)).toBeInTheDocument();
  });

  it("crée, modifie et supprime un commentaire en affichant les succès", async () => {
    installQueries({
      lists: [
        { data: [], error: null },
        { data: [initialComment], error: null },
        { data: [{ ...initialComment, body: "Après modification" }], error: null },
        { data: [], error: null },
      ],
    });
    const user = userEvent.setup();
    render(<CommentsSection spellId={390} />);

    const create = await screen.findByRole("textbox", { name: "Ajouter un commentaire" });
    await user.type(create, "Première version");
    await user.click(screen.getByRole("button", { name: "Publier" }));
    expect(await screen.findByText("Première version")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    const edit = screen.getByRole("textbox", { name: "Modifier le commentaire" });
    await user.clear(edit);
    await user.type(edit, "Après modification");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));
    expect(await screen.findByText("Après modification")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    await user.click(screen.getByRole("button", { name: "Vraiment ?" }));
    expect(await screen.findByText("Aucun commentaire.")).toBeInTheDocument();
    await waitFor(() => expect(useToastStore.getState().toasts.map((toast) => toast.message)).toEqual(
      expect.arrayContaining(["Commentaire ajouté.", "Commentaire modifié.", "Commentaire supprimé."]),
    ));
  });

  it("signale une erreur d’écriture sans masquer le commentaire", async () => {
    installQueries({
      lists: [{ data: [initialComment], error: null }],
      update: { error: { message: "Écriture refusée" } },
    });
    const user = userEvent.setup();
    render(<CommentsSection spellId={390} />);
    expect(await screen.findByText("Première version")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Modifier" }));
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(useToastStore.getState().toasts.map((toast) => toast.message)).toContain("Écriture refusée"));
    expect(screen.getByRole("textbox", { name: "Modifier le commentaire" })).toBeInTheDocument();
  });
});
