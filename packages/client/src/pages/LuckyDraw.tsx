import BaseButton from "@/components/BaseButton";
import HeroCarousel from "@/components/home/HeroCarousel";
import { cn } from "@/libs/utils";
import { useRef, useState } from "react";

const freeRewards = [
  { key: "free-box", name: "海克斯科技鑰匙 & 寶箱" },
  { key: "free-ball", name: "世界大賽晶球" },
  { key: "free-my-card-150", name: "MyCard 15－0 點（英雄聯盟專用點數）" },
  { key: "free-my-card-300", name: "MyCard 300 點（英雄聯盟專用點數）" },
  { key: "free-idol-box", name: "大混戰音樂季 典藏箱" },
  { key: "free-idol-card", name: "限量偶像卡牌包" },
];

const transitionDuration = 5;

function Wheel() {
  const onceRef = useRef(false);
  const [deg, setDeg] = useState(0);
  const imgClass = "block aspect-[1/1] w-[45.625em] max-w-[88vw]";

  const onClick = () => {
    if (onceRef.current) return;

    const max = freeRewards.length + 1;
    // 銘謝惠顧是 index 6
    const index = Math.floor(Math.random() * max);
    const shiftDeg = Math.random() * 12 - 6;

    onceRef.current = true;
    const nextDeg = 3600 - (index * 360) / 7 + shiftDeg;

    setDeg(nextDeg);
  };

  return (
    <div className="relative">
      <img
        className={imgClass}
        src="/rewards/wheel.png"
        style={{
          transition: `transform ${transitionDuration}s cubic-bezier(0.12, 0.8, 0.1, 1)`,
          transform: `rotate(${deg}deg)`,
        }}
      />
      <BaseButton
        className={cn(
          imgClass,
          "absolute top-[0] left-[0]",
          "bg-[url('/rewards/pointer.png')] bg-cover",
        )}
        onClick={onClick}
      />
    </div>
  );
}

function LuckyDraw() {
  return (
    <div className="relative">
      <HeroCarousel />
      <div
        className={cn(
          "mt-[8.875em] md:mt-[6.875em]",
          "flex flex-col items-center px-[1.125em]",
        )}
      >
        <img
          src="/icons/lucky-draw-title.png"
          className="aspect-[490/69] h-[1.75em] md:h-[4.3125em] block"
        />
        <div className="mt-[1.375em] md:mt-[2.6875em]">
          <Wheel />
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
    </div>
  );
}

export default LuckyDraw;
