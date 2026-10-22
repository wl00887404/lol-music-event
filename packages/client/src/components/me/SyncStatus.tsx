import { cn } from "@/libs/utils";
import { useSyncStore } from "./syncStore";
import { authClient } from "@/libs/auth-client";
import useSoloMissions from "@/hooks/useSoloMissions";
import BaseButton from "../BaseButton";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import formatDate from "@/libs/formatDate";

type GetTheme = () => {
  textColor: string;
  buttonColor: string;
};

function SyncStatus() {
  const { refetch } = authClient.useSession();
  const { isSyncing, sync } = useSyncStore();
  const { data } = useSoloMissions();

  const team = useTeam();
  const syncedAt = data?.syncedAt || undefined;

  const getTheme: GetTheme = () => {
    if (team === Team.heartSteel) {
      return { textColor: "#262b1b", buttonColor: "#f6efe1" };
    }

    return { textColor: "#f5ebe4", buttonColor: "#0b1527" };
  };

  const { textColor, buttonColor } = getTheme();

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-[0.875em] mr-[1em]">
        {syncedAt && (
          <div className="text-[1.75em]" style={{ color: textColor }}>
            上次同步時間：{formatDate(syncedAt)}
          </div>
        )}

        {/**
         * y = 1859, 1945
         * x = 1604, 1760
         */}
        <BaseButton
          className={cn(
            "w-[9.75em] h-[3.75em] bg-cover",
            "disabled:opacity-45",
          )}
          disabled={isSyncing}
          loading={isSyncing}
          loadingColor={buttonColor}
          onClick={() => sync(refetch)}
          style={{
            backgroundImage: `url('/icons/${team}/sync-button.png')`,
            color: buttonColor,
          }}
        >
          <span className="text-[1.75em] font-[500]">同步</span>
        </BaseButton>
      </div>
    </div>
  );
}

export default SyncStatus;
