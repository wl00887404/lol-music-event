import useTeam from "@/hooks/useTeam";
import { cn } from "@/libs/utils";
import { useMutation } from "@tanstack/react-query";
import { skipSoloMission, type SoloMission } from "@/apis";
import toast from "../../toast";
import ConfirmDialog from "../../dialogs/shared/ConfirmDialog";
import { useState } from "react";
import BaseButton from "../../BaseButton";
import { useViewport } from "@/components/viewportStore";
import { imgUri } from "@/libs/uris";

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
  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  const uri = imgUri(`/icons/${team}/${prefix}skip-button.png`);
  const style = { backgroundImage: `url('${uri}')` };

  return (
    <>
      {/* 195 55 */}
      {/* 237 67 */}
      <BaseButton
        className={cn(
          // TODO: 可能要放大
          "w-[6.09375em] md:w-[14.8125em] h-[1.71875em] md:h-[4.1875em]",
          "disabled:opacity-45 bg-cover",
        )}
        style={{
          ...style,
          color: buttonColor,
        }}
        loadingColor={buttonColor}
        disabled={skipChange === 0 || !currentMission}
        onClick={() => setConfirmDialogOpen(true)}
      >
        <span className="font-[700] text-[0.625em] md:text-[1.4375em]">
          跳過當前任務
        </span>
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
