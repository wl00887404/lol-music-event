import { cn } from "@/libs/utils";
import Dialog, { type BaseDialogProps } from "../shared/Dialog";
import OkButton from "../shared/OkButton";
import { getIconSrc, getTitleSrc } from "./helper";
import { claimReward, getMyLotteryTicketCount, type Reward } from "@/apis";

import RiotCode from "./RiotCode";
import MyCardCode from "./MyCardCode";
import { useState } from "react";
import ConfirmDialog from "../shared/ConfirmDialog";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import useMyBalance from "@/hooks/useMyBalance";
import useRewards from "@/hooks/useRewards";
import toast from "@/components/toast";
import { authClient } from "@/libs/auth-client";

const LOTTERY_TICKET_KEY = "lottery-ticket";

function useMyLotteryTicketCount(rewardKey: string) {
  const { data: session } = authClient.useSession();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["me", "lotteryTicketCount"],
    queryFn: () => {
      return getMyLotteryTicketCount();
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(session?.user) && rewardKey === LOTTERY_TICKET_KEY,
  });

  return { data, isPending, refetch };
}

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

function ClaimButton(props: {
  reward: Reward;
  setClaimedReward: (claimed: Reward) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const { reward, onOpenChange, setClaimedReward } = props;
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: balanceData, refetch: refetchBalance } = useMyBalance();
  const { refetch: refetchRewards } = useRewards();
  const {
    data: myLotteryTicketCountData,
    refetch: refetchMLotteryTicketCount,
  } = useMyLotteryTicketCount(reward.key);

  const balance = balanceData?.balance || 0;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return claimReward(reward.key, reward.price);
    },
    onSuccess: (res) => {
      if ("error" in res) return;

      setClaimedReward(res.reward);
      refetchRewards();
      refetchBalance();
      toast.success("兌換成功！");
      setConfirmOpen(false);
      refetchMLotteryTicketCount();
    },
  });

  const closeDialog = () => {
    if (onOpenChange) onOpenChange(false);
  };

  const renderButton = () => {
    if (!reward.available) {
      return <OkButton onClick={closeDialog}>已兌換完畢</OkButton>;
    }
    if (balance < reward.price) {
      return (
        <OkButton
          onClick={() => {
            if (onOpenChange) onOpenChange(false);
          }}
        >
          持有點數不足
        </OkButton>
      );
    }

    return <OkButton onClick={() => setConfirmOpen(true)}>確定兌換</OkButton>;
  };

  const nextBalance = balance - reward.price;

  const getName = () => {
    if (reward.key == LOTTERY_TICKET_KEY) {
      const count = myLotteryTicketCountData?.count || 0;
      return `${reward.name} ${count + 1}`;
    }

    return reward.name;
  };

  const name = getName();

  return (
    <>
      <ConfirmDialog
        title={`確定兌換「${name}」`}
        description={
          <>
            即將消耗 <span className="text-[#FFA836]">{reward.price} 點</span>
            ，剩餘 <span className="text-[#FFA836]">{nextBalance} 點</span>
            <br />
            兌換後無法退回，請慎考慮
          </>
        }
        confirmText="確定兌換"
        onConfirm={() => {
          mutate();
        }}
        cancelText="取消"
        onCancel={() => {
          setConfirmOpen(false);
        }}
        open={confirmOpen}
        confirmButtonLoading={isPending}
      />
      {renderButton()}
    </>
  );
}

function ClaimDialog(props: Props) {
  const { onOpenChange, ...otherProps } = props;
  const [claimedReward, setClaimedReward] = useState<Reward | null>(null);

  // 兌換後的 reward 可能不在這個位置
  // 為了正常顯示，只能先存起來
  const reward = claimedReward || props.reward;

  const { key } = reward;
  const { src: titleSrc, aspectRatio } = getTitleSrc(key);
  const iconSrc = getIconSrc(key);

  // FIXME: 現在有 aspectRatio，應該不用手動儲存這些資料
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
      return (
        <ClaimButton
          reward={reward}
          onOpenChange={onOpenChange}
          setClaimedReward={setClaimedReward}
        />
      );
    }

    // 兌換好的實體，等通知
    if (reward.isMerch) {
      return (
        <OkButton
          onClick={() => {
            if (onOpenChange) onOpenChange(false);
          }}
        >
          專人處理中
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
        <img
          src={titleSrc}
          style={{ aspectRatio }}
          className="max-w-full max-w-full md:max-w-[34em]"
        />
        <img
          src={iconSrc}
          className={cn(
            "my-[0] md:my-[0.1em] max-w-full",
            isTallTile ? "md:max-w-[22em]" : "md:max-w-[26em]",
          )}
        />
        <div
          className={cn(
            "absolute left-0 w-full",
            "flex flex-col items-center gap-[1.5em]",
            "bottom-[2.4em] md:bottom-[3.0625em]",
          )}
        >
          <div
            className={cn(
              "whitespace-pre text-center text-[#ffffff]",
              "text-[0.5625em] md:text-[1.25em] leading-[1.4]",
            )}
          >
            {renderDescription()}
          </div>
          {renderButton()}
        </div>
      </div>
    </Dialog>
  );
}

export default ClaimDialog;
