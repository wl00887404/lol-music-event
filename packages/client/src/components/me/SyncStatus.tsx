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

function SyncStatus() {
  const { refetch } = authClient.useSession();
  const { isSyncing, sync } = useSyncStore();
  const { data } = useSoloMissions();

  const team = useTeam();
  const syncedAt = data?.syncedAt || undefined;

  const getButtonTextColor = () => {
    if (team === Team.heartSteel) {
      return "#f6efe1";
    }

    return "#0b1527";
  };

  const buttonTextColor = getButtonTextColor();

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-[14px]">
        {syncedAt && (
          <div className="text-[28px] leading-[1] text-[#f5ebe4]">
            上次同步時間：{format(syncedAt)}
          </div>
        )}
        <BaseButton
          className={cn(
            "w-[144px] h-[51px]",
            "text-[28px] leading-[1] font-[500] text-align-center",
            "disabled:opacity-45",
          )}
          disabled={isSyncing}
          loading={isSyncing}
          loadingColor={buttonTextColor}
          onClick={() => sync(refetch)}
          style={{
            backgroundImage: `url('/icons/${team}/sync-button.png')`,
            color: buttonTextColor,
          }}
        >
          同步
        </BaseButton>
      </div>
    </div>
  );
}

export default SyncStatus;
