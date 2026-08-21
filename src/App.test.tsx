import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { useDataStore } from "./lib/dataStore";
import { useSessionStore } from "./lib/sessionStore";

beforeEach(() => {
  useSessionStore.setState({ mode: "guest", user: null, initialize: vi.fn() });
  useDataStore.setState({
    status: "error",
    loadError: "JSON feca.json indisponible",
    initialize: vi.fn(),
  });
});

describe("états visibles de l’application", () => {
  it("affiche l’erreur de chargement et relance le chargement", async () => {
    const retry = useDataStore.getState().initialize as ReturnType<typeof vi.fn>;
    const user = userEvent.setup();
    render(<App />);
    expect(screen.getByRole("alert")).toHaveTextContent("JSON feca.json indisponible");
    retry.mockClear();
    await user.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(retry).toHaveBeenCalledOnce();
  });
});
