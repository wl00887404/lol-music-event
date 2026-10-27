import { cn } from "@/libs/utils";
import { useSyncStore } from "./syncStore";
import { authClient } from "@/libs/auth-client";
import useSoloMissions from "@/hooks/useSoloMissions";
import BaseButton from "../BaseButton";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import formatDate from "@/libs/formatDate";
import { useViewport } from "../viewportStore";
import { imgUri } from "@/libs/uris";

type GetTheme = () => {
  desktopTextColor: string;
  desktopButtonColor: string;
  mobileTextColor: string;
  mobileButtonColor: string;
};

function SyncStatus() {
  const { refetch } = authClient.useSession();
  const { isSyncing, sync } = useSyncStore();
  const { data } = useSoloMissions();

  const viewport = useViewport();
  const team = useTeam();
  const syncedAt = data?.syncedAt || undefined;

  const getTheme: GetTheme = () => {
    if (team === Team.heartSteel) {
      return {
        desktopTextColor: "#262b1b",
        desktopButtonColor: "#f6efe1",
        mobileTextColor: "#262b1b",
        mobileButtonColor: "#f5ebe4",
      };
    }

    if (team === Team.trueDamage) {
      return {
        desktopTextColor: "#f5ebe4",
        desktopButtonColor: "#0b1527",
        mobileTextColor: "#0b1527",
        mobileButtonColor: "#deef00",
      };
    }

    return {
      desktopTextColor: "#f5ebe4",
      desktopButtonColor: "#0b1527",
      mobileTextColor: "#f5ebe4",
      mobileButtonColor: "#0b1527",
    };
  };

  const prefix = useViewport() === "mobile" ? "m-" : "";
  const theme = getTheme();

  const textColor =
    viewport === "mobile" ? theme.mobileTextColor : theme.desktopTextColor;
  const buttonColor =
    viewport === "mobile" ? theme.mobileButtonColor : theme.desktopButtonColor;

  const uri = imgUri(`/icons/${team}/${prefix}sync-button.png`);
  const style = { backgroundImage: `url('${uri}')` };

  return (
    <div
      className={cn(
        "flex justify-end relative",
        // Mobile 排版神秘位移
        "mt-[-2.8125em] md:mt-0",
        "mb-[1.125em] md:mb-0",
      )}
    >
      <div className="flex items-center gap-[0.875em] mr-[1.21875em] md:mr-[1em]">
        {syncedAt && (
          <div
            className="text-[0.875em] md:text-[1.75em]"
            style={{ color: textColor }}
          >
            上次同步時間：{formatDate(syncedAt)}
          </div>
        )}

        {/**
         * Desktop 按鈕位置
         * y = 1859, 1945
         * x = 1604, 1760
         */}
        <BaseButton
          className={cn(
            "w-[4.5em] md:w-[9.75em] h-[1.6875em] md:h-[3.75em] bg-cover",
            "disabled:opacity-45",
          )}
          disabled={isSyncing}
          loading={isSyncing}
          loadingColor={buttonColor}
          onClick={() => sync(refetch)}
          style={{ ...style, color: buttonColor }}
        >
          <span className="text-[0.78125em] md:text-[1.75em] font-[500]">
            同步
          </span>
        </BaseButton>
      </div>
    </div>
  );
}

export default SyncStatus;
