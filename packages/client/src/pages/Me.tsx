import { useEffect } from "react";
import { useNavigate } from "react-router";

import { authClient } from "@/libs/auth-client";
import { useSyncStore } from "@/components/me/syncStore";

import SoloMissions from "@/components/me/SoloMissions";
import { useDialogStore } from "@/components/dialogs/dialogStore";

import SyncStatus from "@/components/me/SyncStatus";
import toast from "@/components/toast";

import HeroImage from "@/components/home/HeroImage";
import Profile from "@/components/me/Profile";
import ScorePr from "@/components/me/ScorePr";
import InviteCode from "@/components/me/InviteCode";
import Stats from "@/components/me/Stats";
import Rewards from "@/components/me/Rewards";
import { cn } from "@/libs/utils";

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
    <div className="relative">
      <HeroImage />
      <div className="mt-[2em] max-w-[22.125em] md:mt-[5.5625em] md:max-w-[102em] mx-auto">
        {/* y = 1239 ~ 1799 */}
        <SoloMissions />
        {/* y = 1799 ~ 1859 */}
        <SyncStatus />
        {/* y = 1945 ~ 2796 */}
        <div className="flex justify-between flex-col md:flex-row">
          <div
            className={cn(
              "flex flex-col justify-between",
              // mobile 調整間距
              "mt-[1.5625em] gap-[1.5625em] mb-[1.5625em]",
              "md:my-0 md:gap-0",
            )}
          >
            <Profile />
            <InviteCode />
          </div>
          <ScorePr />
        </div>
        <div className="mt-[1.5625em] md:mt-[1.25em]">
          <Stats />
        </div>
        <div className="my-[1.5625em] md:mt-[4.625em] md:mb-[6em]">
          <Rewards />
        </div>
      </div>
      {/* <img
        src="/kda-demo.png"
        style={{
          width: 390,
          position: "absolute",
          top: -35,
          left: 0,
          opacity: 0.4,
        }}
      /> */}
    </div>
  );
}

export default Me;
