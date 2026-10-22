import type { Reward } from "@/apis";
import BaseButton from "@/components/BaseButton";
import DrawResultDialog from "@/components/dialogs/reward/DrawResultDialog";
import HeroCarousel from "@/components/home/HeroCarousel";
import { SCROLL_TO_HERE_ID } from "@/components/ScrollToTop";
import { cn } from "@/libs/utils";
import { useRef, useState } from "react";
import toast from "@/components/toast";
// import ClaimDialog from "@/components/dialogs/ClaimDialog";

const duration = 5;

function Wheel({ deg, draw }: { deg: number; draw: () => void }) {
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
      />
    </div>
  );
}

function LuckyDraw() {
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  // const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);

  const onceRef = useRef(false);
  const [deg, setDeg] = useState(0);

  const draw = () => {
    if (onceRef.current) {
      return toast.info("今天已經抽過獎了，明天再來吧");
    }

    // const max = freeRewards.length + 1;
    // // 銘謝惠顧是 index 6
    // const index = Math.floor(Math.random() * max);
    // const shiftDeg = Math.random() * 12 - 6;

    // onceRef.current = true;
    // const nextDeg = 3600 - (index * 360) / 7 + shiftDeg;

    // setDeg(nextDeg);
    // setReward(freeRewards[index] || null);

    setTimeout(() => {
      setResultDialogOpen(true);
    }, duration * 1000);
  };

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
          <Wheel deg={deg} draw={draw} />
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
