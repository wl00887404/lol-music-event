import { luckyDraw, type Reward } from "@/apis";
import BaseButton from "@/components/BaseButton";
import DrawResultDialog from "@/components/dialogs/reward/DrawResultDialog";
import HeroCarousel from "@/components/home/HeroCarousel";
import { SCROLL_TO_HERE_ID } from "@/components/ScrollToTop";
import toast from "@/components/toast";
import { authClient } from "@/libs/auth-client";
import { cn } from "@/libs/utils";
import { useEffect, useRef, useState } from "react";
// import ClaimDialog from "@/components/dialogs/ClaimDialog";

const rewardOrders = [
  "free-box",
  "free-ball",
  "free-my-card-150",
  "free-my-card-300",
  "free-idol-box",
  "free-idol-card",
];

const duration = 5;

function Wheel({
  deg,
  draw,
  disabled,
}: {
  deg: number;
  draw: () => void;
  disabled: boolean;
}) {
  const imgClass = "block aspect-[1/1] w-[45.625em] max-w-[88vw]";

  return (
    <div className="relative">
      <img
        className={imgClass}
        src="/rewards/wheel.png"
        style={{
          transition: `transform ${duration}s cubic-bezier(0.12, 0.8, 0.1, 1)`,
          transform: `rotate(${deg}deg)`,
        }}
      />
      <BaseButton
        className={cn(
          imgClass,
          "absolute top-[0] left-[0]",
          "bg-[url('/rewards/pointer.png')] bg-cover",
        )}
        onClick={draw}
        disabled={disabled}
      />
    </div>
  );
}

// TODO: 支援多次抽獎？
function LuckyDraw() {
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  // const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);
  const { data: session } = authClient.useSession();

  const drawChances = useRef(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [deg, setDeg] = useState(0);

  const getDeg = (reward: Reward | null) => {
    const shiftDeg = Math.random() * 12 - 6;
    const index = rewardOrders.findIndex((key) => key === reward?.key);

    if (index === -1) {
      // 銘謝惠顧是 index 6
      return 3600 - (6 * 360) / 7 + shiftDeg;
    } else {
      return 3600 - (index * 360) / 7 + shiftDeg;
    }
  };

  const draw = async () => {
    if (drawChances.current === 0) {
      return toast.info("今天已經抽過獎了，明天再來吧");
    }

    setIsDrawing(true);
    const res = await luckyDraw();

    if ("reward" in res) {
      drawChances.current--;
      const nextDeg = getDeg(res.reward);
      setDeg(deg + nextDeg - (deg % 360));
      setReward(res.reward);

      setTimeout(() => {
        setResultDialogOpen(true);
        setIsDrawing(false);
      }, duration * 1000);
    } else {
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    drawChances.current = session?.user.freeDrawChances || 0;
  }, [session?.user]);

  return (
    <div className="relative">
      <HeroCarousel />
      <div
        className={cn(
          "mt-[8.875em] md:mt-[6.875em]",
          "flex flex-col items-center px-[1.125em]",
        )}
      >
        <div id={SCROLL_TO_HERE_ID} />
        <img
          src="/icons/lucky-draw-title.png"
          className="aspect-[490/69] h-[1.75em] md:h-[4.3125em] block"
        />
        <div className="mt-[1.375em] md:mt-[2.6875em]">
          <Wheel deg={deg} draw={draw} disabled={isDrawing} />
        </div>

        <div className="mt-[1.21875em] md:mt-[3.5em] mb-[8.90625em] md:mb-[6.125em]">
          <BaseButton
            className={cn(
              "aspect-[459/83] h-[2.1875em] md:h-[5.1875em]",
              "bg-[url('/rewards/record-button.png')] bg-cover",
            )}
          >
            <div className="font-[700] text-[1.09375em] md:text-[2.625em] text-[#0b1527]">
              中獎紀錄
            </div>
          </BaseButton>
        </div>
      </div>
      <DrawResultDialog
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        reward={reward}
        onOK={() => {
          setResultDialogOpen(false);
        }}
      />
      {/* {reward && (
        <ClaimDialog
          open={claimDialogOpen}
          onOpenChange={setClaimDialogOpen}
          reward={reward}
        />
      )} */}
    </div>
  );
}

export default LuckyDraw;
