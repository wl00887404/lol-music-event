import useTeam from "@/hooks/useTeam";
import { cn } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { skipSoloMission, type SoloMission } from "@/apis";
import toast from "../../toast";
import ConfirmDialog from "../../dialogs/shared/ConfirmDialog";
import { useState } from "react";
import BaseButton from "../../BaseButton";

type SkipButtonProps = {
  skipChange: number;
  refetch: () => void;
  currentMission: SoloMission | undefined;
  buttonColor: string;
};

function SkipButton(props: SkipButtonProps) {
  const { skipChange, refetch, currentMission, buttonColor } = props;
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
  const team = useTeam();

  return (
    <>
      <BaseButton
        className={cn(
          "mt-[38px] w-[237px] h-[67px] bg-cover",
          "font-[700] text-[23px] leading-[1]",
          "disabled:opacity-45",
        )}
        style={{
          color: buttonColor,
          backgroundImage: `url('/icons/${team}/skip-button.png')`,
        }}
        loadingColor={buttonColor}
        disabled={skipChange === 0 || !currentMission}
        onClick={() => setConfirmDialogOpen(true)}
      >
        跳過當前任務
      </BaseButton>
      <ConfirmDialog
        title="跳過當前任務"
        description={
          currentMission && (
            <>
              <span>確後將跳過「{currentMission.name}」</span>
              <br />
              <span className="text-[#FFA836]">略過任務不會獲得積分</span>
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

export default SkipButton;
