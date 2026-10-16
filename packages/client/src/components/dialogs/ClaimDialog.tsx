import Dialog from "./shared/Dialog";
import { Dialog as BaseDialog } from "@/components/ui/dialog";
import { useState, type ComponentPropsWithoutRef } from "react";
import { claimReward, type Reward } from "@/apis";
import { Button } from "../ui/button";
import { cn } from "@/libs/utils";
import copy from "copy-to-clipboard";
import toast from "../toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Eye, EyeClosed } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

function RewardCode({ code }: { code: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "bg-[#fff9e5] px-[24px] md:px-[32px] py-[8px] md:py-[10px] flex items-center gap-[16px]",
          "rounded-t-[5px] md:rounded-t-[10px]",
        )}
      >
        <div className="grow-1 font-[monospace] font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#111111] max-w-[200px] md:max-w-full break-all md:break-normal">
          {visible ? code : "*".repeat(code.length)}
        </div>
        <Button
          className="p-0 !h-auto border-none bg-[transparent]"
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <Eye className="!w-[16px] !h-auto md:!w-[24px] text-[#111111]" />
          ) : (
            <EyeClosed className="!w-[16px] !h-auto md:!w-[24px] text-[#111111]" />
          )}
        </Button>
      </div>
      <Button
        className={cn(
          "bg-[#FF4655] !h-auto border-none",
          "py-[8px] md:py-[10px]",
          "font-[900] tracking-[10%] !leading-[1.2] text-[16px] md:text-[20px] text-[#fff9e5]",
          "rounded-t-[0] rounded-b-[5px] md:rounded-b-[10px]",
        )}
        onClick={() => {
          copy(code);
          toast.success("複製成功");
          setTimeout(() => {
            window.open("https://shop.riotgames.com/zh-tw/redeem/", "_blank");
          }, 750);
        }}
      >
        複製虛寶碼並前往兌換
      </Button>
    </div>
  );
}

type Props = ComponentPropsWithoutRef<typeof BaseDialog> & {
  reward: Reward;
  refetch: () => void;
};

function ClaimDialog(props: Props) {
  const { reward, refetch, ...otherProps } = props;
  const { finishedCount, totalCount } = reward;
  const claimable = finishedCount >= totalCount;
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return claimReward(reward.type);
    },
    onSuccess: (res) => {
      if ("error" in res) {
        console.log(res.error);
        return toast.error(res.error.message);
      }

      refetch();
    },
  });

  const renderButton = () => {
    if (reward.code) {
      return <RewardCode code={reward.code} />;
    }

    const button = (
      <Button
        className={cn(
          "bg-[#FF4655] md:shadow-[0px_0px_40px_0px_#FF4655]",
          "h-auto border-none",
          "px-[24px] md:px-[67px] py-[10.5px] md:py-[20px] rounded-[10px] md:rounded-[15px]",
          "font-[900] tracking-[10%] !leading-[1.2] text-[16px] md:text-[20px] text-[#fff9e5]",
          "disabled:opacity-100 disabled:bg-[#999999] disabled:shadow-none",
        )}
        onClick={() => {
          if (!claimable) return;
          mutate();
        }}
        loading={isPending}
        disabled={!claimable}
      >
        {claimable ? "領取" : "尚未達成領取條件"}
      </Button>
    );

    if (finishedCount < totalCount) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>{button}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reward.description}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };
  return (
    <Dialog {...otherProps} title="領取好禮" description="領取好禮彈窗">
      <div
        className={cn(
          "max-w-[318px] mx-auto mt-[12px]",
          "flex flex-col items-center text-[#fff9e5] !leading-[1.2] gap-[12px]",
        )}
      >
        <div className="text-[14px] md:text-[20px]">{reward.name}</div>
        <div className="w-[200px] md:w-[300px] h-[200px] md:h-[300px] grid place-items-center">
          <img
            src={reward.image}
            className="aspect-[1/1] max-w-[100%] object-cover"
          />
        </div>
      </div>
      <div className="absolute left-0 bottom-[63.33px] md:bottom-[20px] w-full flex flex-col items-center">
        <div className="text-[#fff9e5] !leading-[1.2] text-[14px] md:text-[16] font-[500] mb-[24px]">
          虛寶序號為一次性使用，兌換成功後即失效
        </div>
        {renderButton()}
      </div>
    </Dialog>
  );
}

export default ClaimDialog;
