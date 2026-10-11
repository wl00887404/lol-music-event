import { create } from "zustand";

interface DialogStore {
  rsoOpen: boolean;
  setRsoOpen: (open: boolean) => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  rsoOpen: true,
  setRsoOpen: (open) => set({ rsoOpen: open }),
}));
