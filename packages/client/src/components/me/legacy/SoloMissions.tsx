import { cn } from "@/libs/utils";
import Card from "./Card";
import { Fragment } from "react/jsx-runtime";
import { useMutation } from "@tanstack/react-query";
import { skipSoloMission, type SoloMission } from "@/apis";
import { Button } from "../../ui/button";
import toast from "../../toast";
import MissionItem, { IN_PROGRESS_CLASS_NAME } from "./MissionItem";
import useScrollInProgress from "@/hooks/useScrollInProgress";
import useSoloMissions from "@/hooks/useSoloMissions";
import ConfirmDialog from "../../dialogs/shared/ConfirmDialog";
import { useState } from "react";

type SkipButtonProps = {
  skipChange: number;
  refetch: () => void;
  currentMission: SoloMission | undefined;
};

function SkipButton(props: SkipButtonProps) {
  const { skipChange, refetch, currentMission } = props;
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return skipSoloMission();
    },
    onSuccess: (res) => {
      if ("error" in res) {
        return toast.error(res.error.message);
      }

      setConfirmDialogOpen(false);
      refetch();
    },
  });

  return (
    <>
      <div className="flex flex-col items-end gap-[4px] md:gap-[8px]">
        <Button
          className={cn(
            "rounded-[5px] px-[17px] py-[8px] text-[13px] tracking-[10%]",
            "bg-[#FF4655] !h-auto border-none md:px-[32px] md:py-[20px] md:text-[14px]",
            "!leading-[1.2] font-[500] text-[#FFFFFF] tracking-[10%] md:rounded-[15px]",
            "disabled:opacity-100 disabled:bg-[#999999]",
          )}
          disabled={skipChange === 0 || !currentMission}
          onClick={() => setConfirmDialogOpen(true)}
        >
          跳過當前任務
        </Button>
        <div className="font-[500] text-[10px] md:text-[14px] !leading-[1.2] text-[#fff9e5] flex flex-col md:flex-row">
          <span>跳過剩餘次數：{skipChange}</span>
          <span>（每週一 08:00 重置）</span>
        </div>
      </div>
      <ConfirmDialog
        title="跳過當前任務"
        description={
          currentMission && (
            <>
              <div>確後將跳過「{currentMission.description}」</div>
              <div className="text-[#FFA836]">略過任務不會獲得積分</div>
            </>
          )
        }
        confirmText="跳過任務"
        onConfirm={() => {
          mutate();
        }}
        cancelText="取消"
        onCancel={() => {
          setConfirmDialogOpen(false);
        }}
        open={confirmDialogOpen}
        confirmButtonLoading={isPending}
      />
    </>
  );
}

const mockMissions: SoloMission[] = [
  { name: "", description: "", score: 0, status: "locked" },
  { name: "", description: "", score: 0, status: "locked" },
  { name: "", description: "", score: 0, status: "locked" },
  { name: "", description: "", score: 0, status: "locked" },
  { name: "", description: "", score: 0, status: "locked" },
];

function SoloMissions() {
  const { data, refetch, isPending } = useSoloMissions();

  const getItems = () => {
    if (isPending) return mockMissions;
    if (!data?.missions) return mockMissions;

    return data.missions;
  };

  const missions = getItems();

  const skipChange = data?.skipChance;
  const currentMission = missions.find(
    (mission) => mission.status === "inProgress",
  );

  const { containerRef, containerClassName } = useScrollInProgress(
    data?.missions,
    IN_PROGRESS_CLASS_NAME,
  );

  return (
    <Card>
      <div className="flex mb-[18.5px] md:mb-[24px]">
        <div className="grow-1">
          <div className="font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#fff9e5]">
            <span>循環任務</span>
          </div>
          <div className="font-[500] text-[10px] md:text-[14px] !leading-[1.2] text-[#fff9e5]">
            完成任務解鎖更高階榮譽獎勵
          </div>
        </div>
        <div className={skipChange === undefined ? "opacity-0" : ""}>
          <SkipButton
            skipChange={skipChange || 0}
            refetch={refetch}
            currentMission={currentMission}
          />
        </div>
      </div>
      <div
        ref={containerRef}
        className={cn(
          "flex gap-[6px] md:gap-[15px] flex-col md:flex-row md:py-[20px] md:overflow-x-auto",
          "my-scrollbar", // 寫在 index.css 的 scrollbar 樣式
          containerClassName,
        )}
      >
        {missions.map((mission, index) => {
          return (
            <Fragment key={index}>
              {index !== 0 && (
                <div className="w-[1px] bg-[#999999] h-[40px] shrink-0 self-center hidden md:block" />
              )}
              <MissionItem mission={mission} loading={isPending} />
            </Fragment>
          );
        })}
      </div>
    </Card>
  );
}

export default SoloMissions;
