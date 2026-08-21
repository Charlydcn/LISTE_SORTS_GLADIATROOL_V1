import { create } from "zustand";
import type { SessionMode, SessionUser } from "../types";
import { supabase } from "./supabase";

const GUEST_KEY = "gladiatrool_guest";

interface SessionState {
  mode: SessionMode;
  user: SessionUser | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  enterGuest: () => void;
  leave: () => Promise<void>;
  isAdmin: () => boolean;
  isGuest: () => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  mode: "loading",
  user: null,

  async initialize() {
    if (!supabase) {
      set({ mode: sessionStorage.getItem(GUEST_KEY) === "1" ? "guest" : "login", user: null });
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (data.session?.user) {
      sessionStorage.removeItem(GUEST_KEY);
      set({ mode: "admin", user: data.session.user });
    } else {
      set({
        mode: sessionStorage.getItem(GUEST_KEY) === "1" ? "guest" : "login",
        user: null,
      });
    }
  },

  async signIn(email, password) {
    if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    sessionStorage.removeItem(GUEST_KEY);
    set({ mode: "admin", user: data.user });
  },

  enterGuest() {
    sessionStorage.setItem(GUEST_KEY, "1");
    set({ mode: "guest", user: null });
  },

  async leave() {
    sessionStorage.removeItem(GUEST_KEY);
    if (get().mode === "admin" && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    set({ mode: "login", user: null });
  },

  isAdmin: () => get().mode === "admin",
  isGuest: () => get().mode === "guest",
}));
