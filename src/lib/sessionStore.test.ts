import { beforeEach, describe, expect, it, vi } from "vitest";

const authMock = vi.hoisted(() => ({
  onAuthStateChange: vi.fn(),
  getSession: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("./supabase", () => ({ supabase: { auth: authMock } }));

let useSessionStore: typeof import("./sessionStore").useSessionStore;
let authEvent: ((event: string, session: { user?: unknown } | null) => void) | undefined;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  authEvent = undefined;
  authMock.onAuthStateChange.mockImplementation((callback) => {
    authEvent = callback;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  authMock.getSession.mockResolvedValue({ data: { session: null }, error: null });
  ({ useSessionStore } = await import("./sessionStore"));
});

describe("session Supabase", () => {
  it("active le mode invité sans client distant", async () => {
    useSessionStore.getState().enterGuest();
    expect(useSessionStore.getState().mode).toBe("guest");
    expect(sessionStorage.getItem("gladiatrool_guest")).toBe("1");
  });

  it("connecte tout utilisateur authentifié comme administrateur", async () => {
    authMock.signInWithPassword.mockResolvedValue({
      data: { user: { id: "user-1", email: "admin@example.test" } },
      error: null,
    });
    await useSessionStore.getState().signIn("admin@example.test", "secret");
    expect(authMock.signInWithPassword).toHaveBeenCalledWith({ email: "admin@example.test", password: "secret" });
    expect(useSessionStore.getState().mode).toBe("admin");
    expect(useSessionStore.getState().isAdmin()).toBe(true);
  });

  it("synchronise SIGNED_IN et SIGNED_OUT, y compris une déconnexion d’un autre onglet", async () => {
    await useSessionStore.getState().initialize();
    authEvent?.("SIGNED_IN", { user: { id: "user-1", email: "admin@example.test" } });
    expect(useSessionStore.getState().mode).toBe("admin");

    authEvent?.("SIGNED_OUT", null);
    expect(useSessionStore.getState()).toMatchObject({ mode: "login", user: null });
  });

  it("revient au mode invité lors de l’expiration d’une session si l’invité avait été choisi", async () => {
    useSessionStore.getState().enterGuest();
    await useSessionStore.getState().initialize();
    authEvent?.("TOKEN_REFRESHED", null);
    expect(useSessionStore.getState()).toMatchObject({ mode: "guest", user: null });
  });
});
