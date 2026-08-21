import { create } from "zustand";

export function editorKey(entityType: string, entityKey: string | number, fieldKey: string): string {
  return `${entityType}\u0000${String(entityKey)}\u0000${fieldKey}`;
}

interface EditingState {
  activeKey: string | null;
  open: (key: string) => void;
  close: (key?: string) => void;
}

export const useEditingStore = create<EditingState>((set, get) => ({
  activeKey: null,
  open(key) {
    set({ activeKey: key });
  },
  close(key) {
    if (key && get().activeKey !== key) return;
    set({ activeKey: null });
  },
}));
