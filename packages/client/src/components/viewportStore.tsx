import { create } from "zustand";

const Viewport = {
  mobile: "mobile",
  desktop: "desktop",
} as const;

export type Viewport = (typeof Viewport)[keyof typeof Viewport];

interface ViewportStore {
  viewport: Viewport;
  setViewport: (nextViewport: Viewport) => void;
}

const mediaQuery = window.matchMedia("(min-width: 48rem)");

export const useDialogStore = create<ViewportStore>((set) => ({
  viewport: mediaQuery.matches ? Viewport.desktop : Viewport.mobile,
  setViewport: (nextViewport) => set({ viewport: nextViewport }),
}));

mediaQuery.addEventListener("type", () => {
  const { setViewport } = useDialogStore();
  setViewport(mediaQuery.matches ? Viewport.desktop : Viewport.mobile);
});
