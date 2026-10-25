import { cn } from "@/libs/utils";
import Dialog, { type BaseDialogProps } from "../shared/Dialog";
import { getRewards, type Reward } from "@/apis";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import formatDate from "@/libs/formatDate";
import { Fragment } from "react/jsx-runtime";
import BaseButton from "@/components/BaseButton";
import { useEffect } from "react";
import { imgUri } from "@/libs/uris";

type Props = BaseDialogProps & {
  openClaimDialog: (nextReward: Reward) => void;
};

function Item(props: {
  reward: Reward;
  openClaimDialog: (nextReward: Reward) => void;
}) {
  const { openClaimDialog, reward } = props;
  const { name, claimedAt } = reward;
  const buttonClassName = cn(
    "aspect-[161/52] h-[1.25em]",
    "bg-[url('/rewards/claim-button.png')] bg-cover",
  );

  return (
    <div className={cn("text-[#fff9e5] px-[0.5625em]", "text-[28px]")}>
      <div className="pt-[0.2em]">
        <div className="text-[0.4375em] md:text-[0.5626em]">
          {claimedAt && formatDate(claimedAt)}
        </div>
      </div>
      <div className="my-[0.4em] flex justify-between items-center">
        <div className="text-[0.5625em]">{name}</div>
        <BaseButton
          className={buttonClassName}
          onClick={() => openClaimDialog(reward)}
        >
          <div className="text-[#030718] font-[700] text-[0.5625em]">
            {reward.isMerch ? "專人處理中" : "前往兌換"}
          </div>
        </BaseButton>
      </div>
    </div>
  );
}

function DrawRecordDialog(props: Props) {
  const { open, openClaimDialog, ...otherProps } = props;
  const { data, refetch, isPending } = useQuery({
    queryKey: ["me", "rewards", "free"],
    queryFn: () => getRewards("free"),
    placeholderData: keepPreviousData,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;

    refetch();
  }, [open, refetch]);

  const renderContent = () => {
    if (isPending) return null;

    const items = data?.rewards || [];

    if (items.length === 0) {
      return (
        <div className="text-[#fff9e5] text-center text-[1em] md:text-[2.2em]">
          還沒有中獎紀錄
          <br />
          下一抽說不定就是你
        </div>
      );
    }

    return items.map((item, index) => {
      return (
        <Fragment key={index}>
          {index !== 0 && <div className="h-[1px] bg-[#fff9e5] my-[0.2em]" />}
          <Item reward={item} openClaimDialog={openClaimDialog} />
        </Fragment>
      );
    });
  };
  return (
    <Dialog
      open={open}
      {...otherProps}
      title="中獎結果"
      description="中獎結果彈窗"
    >
      <div className="h-full flex flex-col px-[1.125em]">
        <div className="flex flex-col items-center mt-[1.875em] md:mt-[3.1875em]">
          <img
            src={imgUri("/rewards/record-title.png")}
            className="aspect-[165/40] h-[1.0625em] md:h-[2.5em]"
          />
        </div>
        <div
          className={cn(
            "overflow-y-auto h-0 grow-1",
            "mt-[2.0625em] md:mt-[4.625em] mb-[2em] md:mb-[6.625em]",
            "md:mx-auto md:w-full md:max-w-[36em]",
          )}
        >
          {renderContent()}
        </div>
      </div>
    </Dialog>
  );
}

export default DrawRecordDialog;
