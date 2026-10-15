import { cn } from "@/libs/utils";
import { useSyncStore } from "./syncStore";
import { authClient } from "@/libs/auth-client";
import useSoloMissions from "@/hooks/useSoloMissions";
import BaseButton from "../BaseButton";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";

function format(dateString: string): string {
  const date = new Date(dateString);
  const pad = (n: number) => String(n).padStart(2, "0");

  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return `${YYYY}/${MM}/${DD} ${hh}:${mm}:${ss}`;
}

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
      <div className="flex items-center gap-[14px] mr-[16px]">
        {syncedAt && (
          <div className="text-[28px] leading-[1]" style={{ color: textColor }}>
            上次同步時間：{format(syncedAt)}
          </div>
        )}

        {/**
         * y = 1859, 1945
         * x = 1604, 1760
         */}
        <BaseButton
          className={cn(
            "w-[156px] h-[60px]",
            "text-[28px] leading-[1] font-[500]",
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
          同步
        </BaseButton>
      </div>
    </div>
  );
}

export default SyncStatus;
