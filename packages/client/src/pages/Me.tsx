import MyStats from "@/components/me/MyStats";
import MyProfile from "@/components/me/MyProfile";
import SoloMissions from "@/components/me/SoloMissions";

import { authClient } from "@/libs/auth-client";
import { useEffect } from "react";
import { useSyncStore } from "@/components/me/syncStore";
import Rewards from "@/components/me/Rewards";
import SyncStatus from "@/components/me/SyncStatus";
import MyInviteCode from "@/components/me/MyInviteCode";
import { useNavigate } from "react-router";
import { useDialogStore } from "@/components/dialogs/dialogStore";
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
  // useSync();
  // useCheckLogin();

  return (
    <div>
      <HeroImage />
      <SyncStatus />
      <SoloMissions />
      <div className="grid md:grid-cols-[486px_1fr] gap-[10px] md:gap-[36px] mt-[10px] md:mt-[36px]">
        <div className="flex flex-col gap-[10px] md:gap-[36px] md:row-start-1 md:col-start-1">
          {/* <MyProfile /> */}
          {/* <Rewards /> */}
          {/* <MyInviteCode /> */}
        </div>
        <div className="flex flex-col md:row-start-1 md:col-start-2">
          {/* <MyStats /> */}
        </div>
      </div>
    </div>
  );
}

export default Me;
