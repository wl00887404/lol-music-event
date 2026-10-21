import BaseButton from "@/components/BaseButton";
import HeroCarousel from "@/components/home/HeroCarousel";
import { cn } from "@/libs/utils";

function Wheel() {
  const imgClass = "block aspect-ratio[1/1] w-[45.625em] max-w-[88vw]";

  return (
    <div className="relative">
      <img className={imgClass} src="/rewards/wheel.png" />
      <img
        className={cn(imgClass, "absolute top-[0] left-[0]")}
        src="/rewards/pointer.png"
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
          <BaseButton className="aspect-[459/83] h-[2.1875em] md:h-[5.1875em] bg-[url('/rewards/record-button.png')] bg-cover">
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
