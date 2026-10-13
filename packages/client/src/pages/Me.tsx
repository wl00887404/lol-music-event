import { useEffect } from "react";
import { useNavigate } from "react-router";

import { authClient } from "@/libs/auth-client";
import { useSyncStore } from "@/components/me/syncStore";

import SoloMissions from "@/components/me/SoloMissions";
import { useDialogStore } from "@/components/dialogs/dialogStore";

import SyncStatus from "@/components/me/SyncStatus";
import toast from "@/components/toast";

import HeroImage from "@/components/home/HeroImage";

function useSync() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const { autoSync } = useSyncStore();

  useEffect(() => {
    if (isPending || !session) return;
    autoSync(refetch);
  }, [session, isPending, refetch, autoSync]);
}

function useCheckLogin() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();
  const dialogStore = useDialogStore();
  const setRsoOpen = dialogStore.setRsoOpen;

  useEffect(() => {
    if (isPending) return;
    if (session?.user) return;

    navigate("/");
    setRsoOpen(true);
    toast.error("你的驗證已經過期。請重新登入以繼續");
  }, [session, isPending, navigate, setRsoOpen]);
}

function Me() {
  useSync();
  useCheckLogin();

  return (
    <div>
      <HeroImage />
      <div className="mt-[88px]">
        <SoloMissions />
      </div>
      {/* 18 + 1591 + 18 */}
      <div className="max-w-[1627px] px-[18px] mx-auto">
        <div className="mt-[10px]">
          <SyncStatus />
        </div>
        <div className="mt-[105px]"></div>
      </div>
    </div>
  );
}

export default Me;
