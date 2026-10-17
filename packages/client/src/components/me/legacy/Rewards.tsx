import Card from "@/components/me/legacy/Card";
import { authClient } from "@/libs/auth-client";
import { cn } from "@/libs/utils";
import { Button } from "../../ui/button";
import useRewards from "@/hooks/useRewards";
import type { Reward } from "@/apis";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { useState } from "react";
import ClaimDialog from "../../dialogs/ClaimDialog";

type ItemProps = {
  reward: Reward;
  refetch: () => void;
};

function RewardItem(props: ItemProps) {
  const { reward, refetch } = props;
  const [open, setOpen] = useState(false);
  const { finishedCount, totalCount } = reward;

  const renderIcon = () => {
    if (!reward.icon) {
      return (
        <div className="bg-[#e93f62] w-[48px] h-[48px] grid place-items-center">
          <img src="/icons/logo-red.svg" className="w-[32px]" />
        </div>
      );
    }

    return <img src={reward.icon} className="w-full h-full" />;
  };

  return (
    <>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <div className="flex flex-col items-center mb-[28px] relative">
                <div
                  className={cn(
                    "bg-gradient-to-t from-[#e93f62] to-[#a54554]",
                    "w-[72px] h-[72px] grid place-items-center",
                    "border-[#fff9e5] border-[4px]",
                    "z-1 relative",
                  )}
                >
                  {renderIcon()}
                </div>
                <div className="w-[80px] h-[36px] bg-[#999999] mt-[-32px] rounded-t-[8px]" />

                <div
                  className={cn(
                    "bg-[#0F1923] text-[14px] text-[#fff9e5] rounded-[16px]",
                    "py-[2px] px-[12px] font-[500] border-2 border-[#999999]",
                    "absolute bottom-[-16px] left-[50%] translate-x-[-50%] whitespace-nowrap z-2",
                  )}
                >
                  {Math.min(finishedCount, totalCount)} / {totalCount}
                </div>
              </div>
              <Button
                className={cn(
                  "bg-[#FF4655] text-[#fff9e5] !h-auto border-none rounded-[5px]",
                  "px-[12px] md:px-[17px] py-[8px]",
                  "text-[14px] leading-[1.2] font-[500] tracking-[10%]",
                  "disabled:opacity-100 disabled:bg-[#999999]",
                )}
                onClick={() => setOpen(true)}
              >
                查看詳情
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reward.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <ClaimDialog
        open={open}
        onOpenChange={setOpen}
        reward={reward}
        refetch={refetch}
      />
    </>
  );
}

const mockRewards: Reward[] = Array(3)
  .fill(0)
  .map((_, index) => {
    return {
      name: "",
      description: "",
      type: `mock-reward-${index}`,
      image: "",
      icon: "",
      code: null,
      finishedCount: 0,
      totalCount: 300,
    };
  });

function Rewards() {
  const { data: session } = authClient.useSession();
  const { data, refetch } = useRewards();

  const items = data || mockRewards;

  return (
    <Card>
      <div className="font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#fff9e5]">
        積分進度條
      </div>
      <div className="font-[900] text-[14px] md:text-[20px] !leading-[1.2] text-[#FFA836] mt-[12px]">
        榮譽積分：{session?.user.score}
      </div>
      <div className="flex justify-between md:justify-evenly mt-[32px]">
        {items.map((item) => {
          return <RewardItem key={item.type} reward={item} refetch={refetch} />;
        })}
      </div>
    </Card>
  );
}

export default Rewards;
