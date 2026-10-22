import { cn } from "@/libs/utils";
import Dialog, { type BaseDialogProps } from "../shared/Dialog";
import OkButton from "../shared/OkButton";
import { getIconSrc, getTitleSrc } from "./helper";
import { claimReward, type Reward } from "@/apis";

import RiotCode from "./RiotCode";
import MyCardCode from "./MyCardCode";
import { useState } from "react";
import ConfirmDialog from "../shared/ConfirmDialog";
import { useMutation } from "@tanstack/react-query";

type Props = BaseDialogProps & {
  reward: Reward;
};

function Code(props: { reward: Reward }) {
  const { key, code } = props.reward;

  if (key.includes("my-card")) {
    return <MyCardCode code={code || ""} />;
  }

  return <RiotCode code={code || ""} />;
}

function ClaimButton(props: { reward: Reward }) {
  const { reward } = props;
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return claimReward(reward.key, reward.price);
    },
    onSuccess: (res) => {
      if ("error" in res) return;
      // refetch();
    },
  });

  return (
    <>
      <ConfirmDialog
        title={`確定兌換「${reward.name}」`}
        description={
          <>
            即將消耗 <span className="text-[#FFA836]">{reward.price} 點</span>
            兌換「 {reward.name}」<br />
            兌換後無法退回，請慎考慮
          </>
        }
        confirmText="跳過任務"
        onConfirm={() => {
          mutate();
        }}
        cancelText="取消"
        onCancel={() => {
          setOpen(false);
        }}
        open={open}
        confirmButtonLoading={isPending}
      />
      <OkButton onClick={() => setOpen(true)} disabled={!reward.available}>
        確定兌換
      </OkButton>
    </>
  );
}

function ClaimDialog(props: Props) {
  const { reward, onOpenChange, ...otherProps } = props;
  const { key } = reward;
  const titleSrc = getTitleSrc(key);
  const iconSrc = getIconSrc(key);

  const isTallTile = [
    "paid-idol-card",
    "paid-idol-box",
    "kda-cdc-blades",
    "free-idol-card",
    "free-idol-box",
  ].includes(reward.key);

  const renderDescription = () => {
    // 已經兌換完成的虛寶，需要空間顯示虛寶碼
    // 就不顯示完整的 description 了
    if (reward.code && !reward.isMerch) {
      return "虛寶序號為一次性使用，兌換成功後即失效";
    }

    return reward.description;
  };

  const renderButton = () => {
    // 尚未進行兌換，一率顯示兌換按鈕
    if (!reward.code) {
      return <ClaimButton reward={reward} />;
    }

    // 兌換好的實體，等通知
    if (reward.isMerch) {
      return (
        <OkButton
          onClick={() => {
            if (onOpenChange) onOpenChange(false);
          }}
        >
          知道了
        </OkButton>
      );
    }

    return <Code reward={reward} />;
  };

  return (
    <Dialog
      onOpenChange={onOpenChange}
      {...otherProps}
      title="獎勵兌換"
      description="獎勵兌換彈窗"
    >
      <div className="flex flex-col items-center mt-[2.4em] px-[1.125em]">
        <img src={titleSrc} className="max-w-full max-w-full md:max-w-[36em]" />
        <img
          src={iconSrc}
          className={cn(
            "my-[0] md:my-[0.2em] max-w-full",
            isTallTile ? "md:max-w-[22em]" : "md:max-w-[26em]",
          )}
        />
        <div
          className={cn(
            "whitespace-pre text-center text-[#ffffff]",
            "text-[0.5625em] md:text-[1.25em] leading-[1.6]",
          )}
        >
          {renderDescription()}
        </div>
        <div
          className={cn(
            "absolute left-0 w-full",
            "flex justify-center",
            "bottom-[2.4em] md:bottom-[3.0625em]",
          )}
        >
          {renderButton()}
        </div>
      </div>
    </Dialog>
  );
}

export default ClaimDialog;
