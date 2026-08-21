/* Session binaire : tout compte Supabase authentifié est admin, sinon mode invité explicite. */
(function createSessionManager() {
  const GUEST_KEY = "gladiatrool_guest";
  const session = { mode: "loading", user: null };

  async function initialize() {
    if (!window.AppSupabase.client) {
      session.mode = sessionStorage.getItem(GUEST_KEY) === "1" ? "guest" : "login";
      return;
    }
    const { data, error } = await window.AppSupabase.client.auth.getSession();
    if (error) throw error;
    if (data.session?.user) {
      session.mode = "admin";
      session.user = data.session.user;
      sessionStorage.removeItem(GUEST_KEY);
    } else {
      session.mode = sessionStorage.getItem(GUEST_KEY) === "1" ? "guest" : "login";
      session.user = null;
    }
  }

  async function signIn(email, password) {
    if (!window.AppSupabase.client) throw window.AppSupabase.initializationError;
    const { data, error } = await window.AppSupabase.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    session.mode = "admin";
    session.user = data.user;
    sessionStorage.removeItem(GUEST_KEY);
  }

  function enterGuest() {
    sessionStorage.setItem(GUEST_KEY, "1");
    session.mode = "guest";
    session.user = null;
  }

  async function leave() {
    sessionStorage.removeItem(GUEST_KEY);
    if (session.mode === "admin" && window.AppSupabase.client) {
      const { error } = await window.AppSupabase.client.auth.signOut();
      if (error) throw error;
    }
    session.mode = "login";
    session.user = null;
  }

  window.AppSession = {
    get mode() { return session.mode; },
    get user() { return session.user; },
    initialize,
    signIn,
    enterGuest,
    leave,
    isAdmin: () => session.mode === "admin",
    isGuest: () => session.mode === "guest",
  };
})();
