import type { ReactNode } from "react";
import { create } from "zustand";

interface ModalState {
  title: string;
  wide: boolean;
  content: ReactNode | null;
  open: (title: string, content: ReactNode, options?: { wide?: boolean }) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  title: "",
  wide: false,
  content: null,

  open(title, content, options = {}) {
    set({ title, content, wide: Boolean(options.wide) });
  },

  close() {
    set({ title: "", wide: false, content: null });
  },
}));
