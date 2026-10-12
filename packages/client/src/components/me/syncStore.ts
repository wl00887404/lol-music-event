import { create } from "zustand";
import { checkUpdating, requestSync } from "@/apis";
import toast from "@/components/toast";

interface SyncStore {
  syncTimestamp: number;
  isTriggered: boolean;
  isSyncing: boolean;
  setIsTriggered: (nextValue: boolean) => void;
  sync: (refetchSession: () => void) => void;
  autoSync: (refetchSession: () => void) => void;
}

export const useSyncStore = create<SyncStore>((set, getState) => ({
  syncTimestamp: 0,
  isSyncFinished: false,
  isSyncing: false,
  isTriggered: false,
  setIsTriggered: (nextValue) => set({ isTriggered: nextValue }),
  sync: (refetchSession: () => void) => {
    if (getState().isSyncing) return;

    set({ isSyncing: true });
    requestSync();
    const id = toast.info("正在同步資料 ...");

    const check = () => {
      setTimeout(async () => {
        const { isUpdating } = await checkUpdating();

        if (isUpdating) {
          check();
        } else {
          set({ syncTimestamp: Date.now(), isSyncing: false });

          toast.dismiss(id);
          toast.success("同步完成");
          refetchSession();
        }
      }, 2_000);
    };

    check();
  },
  autoSync: (refetchSession: () => void) => {
    const state = getState();
    if (state.isTriggered) return;
    set({ isTriggered: true });
    state.sync(refetchSession);
  },
}));
