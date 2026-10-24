/* eslint-disable react-hooks/set-state-in-effect */
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { type SoloMission } from "@/apis";
import useTeam from "@/hooks/useTeam";
import { cn } from "@/libs/utils";
import { Team } from "@/types";
import BaseButton from "@/components/BaseButton";
import { useEffect, useState } from "react";
import { useViewport } from "@/components/viewportStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type GetTheme = () => {
  desktopMissionColor: string;
  desktopScoreColor: string;
  mobileMissionColor: string;
  mobileScoreColor: string;
  finishedMissionColor: string;
  inProgressMissionColor: string;
  lockedMissionColor: string;
};

const useTheme: GetTheme = () => {
  const team = useTeam();

  if (team == Team.heartSteel) {
    return {
      desktopMissionColor: "#262b1b",
      desktopScoreColor: "#262b1b",
      mobileMissionColor: "#262b1b",
      mobileScoreColor: "#262b1b",
      finishedMissionColor: "#262b1b",
      inProgressMissionColor: "#262b1b",
      lockedMissionColor: "#f6efe1",
    };
  }

  if (team == Team.trueDamage) {
    return {
      desktopMissionColor: "#f5ebe4",
      desktopScoreColor: "#1c1c1e",
      mobileMissionColor: "#ffffff",
      mobileScoreColor: "#deef00",
      finishedMissionColor: "#1c1c1e",
      inProgressMissionColor: "#1c1c1e",
      lockedMissionColor: "#ffffff",
    };
  }

  return {
    desktopMissionColor: "#f5ebe4",
    desktopScoreColor: "#0b1527",
    mobileMissionColor: "#f5ebe4",
    mobileScoreColor: "#f5ebe4",
    finishedMissionColor: "#f5ebe4",
    inProgressMissionColor: "#f5ebe4",
    lockedMissionColor: "#0b1527",
  };
};

type ItemProps = {
  item: SoloMission;
  index: number;
};

/**
 * mission label 是 80 * 70
 * 擷取自
 *    y = 399, 469
 *   x1 = 293.50, 373.50
 *   x2 = 761, 841
 *   x3 =1227, 1307
 */

function Item(props: ItemProps) {
  const { item, index } = props;
  const team = useTeam();
  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  // 桌機版背景圖是超出去的
  const imgClassName = cn(
    "w-[19.9375em] md:w-[29.25em] h-[4.4375em] md:h-[15.3125em] max-w-[none]",
    "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
    "pointer-events-none",
  );

  const lineClassName =
    "absolute top-[0] w-[50%] h-full bg-repeat-x bg-[length:auto_100%]";

  const {
    desktopMissionColor,
    desktopScoreColor,
    mobileMissionColor,
    mobileScoreColor,
    finishedMissionColor,
    inProgressMissionColor,
    lockedMissionColor,
  } = useTheme();

  const getLabelProps = () => {
    if (item.status === "finished") {
      return {
        leftLineFileName: "mission-finished-line.png",
        rightLineFileName: "mission-finished-line.png",
        labelFileName: "mission-label-finished.png",
        labelColor: finishedMissionColor,
      };
    }
    if (item.status === "inProgress") {
      return {
        leftLineFileName: "mission-finished-line.png",
        rightLineFileName: "mission-locked-line.png",
        labelFileName: "mission-label-in-progress.png",
        labelColor: inProgressMissionColor,
      };
    }

    return {
      leftLineFileName: "mission-locked-line.png",
      rightLineFileName: "mission-locked-line.png",
      labelFileName: "mission-label-locked.png",
      labelColor: lockedMissionColor,
    };
  };
  const { leftLineFileName, rightLineFileName, labelFileName, labelColor } =
    getLabelProps();

  const renderContent = () => {
    if (viewport === "mobile") {
      const getGlow = () => {
        if (team !== Team.kda) return undefined;

        const glowColor = "rgba(255, 0, 97, 0.4)";
        return `drop-shadow(0 0 4px ${glowColor}) drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor})`;
      };

      return (
        <div className="relative flex items-center px-[0.9375em] h-full gap-[1.5em]">
          <div
            className="w-0 grow-1 text-[0.75em] leading-[1.6] font-[700]"
            style={{ color: mobileMissionColor }}
          >
            {item.name}
          </div>
          <div
            className="font-[BeaufortforLOL] text-[1.875em]"
            style={{ color: mobileScoreColor, filter: getGlow() }}
          >
            +{item.score}
          </div>
        </div>
      );
    }

    return (
      <>
        <div
          className={cn(
            "relative h-full flex justify-center items-center text-center",
            "font-[700] text-[1.5em] leading-[1.6]",
          )}
          style={{ color: desktopMissionColor }}
        >
          {item.name}
        </div>
        <div
          className="absolute top-[1.625em] left-[20.8125em]"
          style={{ color: desktopScoreColor }}
        >
          <span className="font-[BeaufortforLOL] text-[1.875em]">
            +{item.score}
          </span>
        </div>
      </>
    );
  };

  const content = (
    <div>
      <div className="relative w-full h-[4.4375em] md:h-[15.3125em] max-w-[20.0625em] mx-auto">
        <img
          src={`/icons/${team}/${prefix}mission-item-bg.png`}
          className={imgClassName}
        />
        {renderContent()}
        {item.status === "finished" && (
          <img
            src={`/icons/${team}/${prefix}mission-item-finished.png`}
            className={imgClassName}
            style={{ opacity: 0.45, mixBlendMode: "multiply" }}
          />
        )}
      </div>
      <div
        className={cn(
          "relative mt-[-1.25em] justify-center -mx-2",
          // 底下的線標線，桌機才有
          "hidden md:flex",
        )}
      >
        <div
          className={lineClassName}
          style={{
            left: 0,
            backgroundImage: `url("/icons/${team}/${leftLineFileName}")`,
          }}
        />
        <div
          className={lineClassName}
          style={{
            right: 0,
            backgroundImage: `url("/icons/${team}/${rightLineFileName}")`,
          }}
        />
        <div
          className={cn(
            "w-[5em] h-[4.375em] bg-cover relative",
            "flex justify-center items-center",
          )}
          style={{
            backgroundImage: `url("/icons/${team}/${labelFileName}")`,
            color: labelColor,
          }}
        >
          <span className="font-[BeaufortforLOL] text-[1.75em]">
            {index + 1}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent
        side="bottom"
        sideOffset={-8}
        className="bg-[rgba(0,0,0,0.72)]"
      >
        <p className="text-[1.2em] font-[500] text-[#f0ca70] ">
          {item.description}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

type SiblingButtonProps = {
  dir: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
};

function SiblingButton(props: SiblingButtonProps) {
  const { dir, onClick, disabled } = props;
  const team = useTeam();
  const viewport = useViewport();

  if (viewport === "mobile") {
    const fileName = dir === "prev" ? "chevron-up.png" : "chevron-down.png";

    return (
      <div className="flex justify-center">
        <BaseButton
          onClick={onClick}
          disabled={disabled}
          className={cn(
            // 144 92
            "w-[4.5em] h-[2.875em] bg-cover",
            "disabled:opacity-0",
          )}
          style={{ backgroundImage: `url("/icons/${team}/${fileName}")` }}
        />
      </div>
    );
  } else {
    const fileName = dir === "prev" ? "chevron-left.png" : "chevron-right.png";
    const px = "1.75em";
    const leftOrRight = dir === "prev" ? { left: px } : { right: px };

    return (
      <BaseButton
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-[4.25em] h-[5.875em] absolute top-[4.75em] bg-cover z-1",
          "disabled:hidden",
        )}
        style={{
          backgroundImage: `url("/icons/${team}/${fileName}")`,
          ...leftOrRight,
        }}
      />
    );
  }
}

type MissionListProps = {
  items: SoloMission[] | undefined;
};

function MissionList(props: MissionListProps) {
  const { items } = props;
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const viewport = useViewport();

  useEffect(() => {
    if (!api || !items) return;

    const currentMissionIndex = items.findIndex(
      (item) => item.status === "inProgress",
    );

    setCanPrev(currentMissionIndex >= 1);
    setCanNext(currentMissionIndex <= items.length - 3);
    api.scrollTo(Math.max(currentMissionIndex - 1, 0));

    api.on("select", () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    });
  }, [api, items]);

  const onPrev = () => {
    if (api) api.scrollPrev();
  };

  const onNext = () => {
    if (api) api.scrollNext();
  };

  if (!items) return null;

  return (
    <div className="relative mt-[1.09375em] md:mt-[2.6875em] md:px-[4.25em]">
      <SiblingButton dir="prev" disabled={!canPrev} onClick={onPrev} />
      <div className="py-[0.8125em] md:py-0">
        <Carousel
          orientation={viewport === "mobile" ? "vertical" : "horizontal"}
          setApi={setApi}
        >
          <CarouselContent className=" h-[17em] md:h-auto">
            {items.map((item, index) => {
              return (
                <CarouselItem key={index} className="basis-1/3">
                  <Item index={index} item={item} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
      <SiblingButton dir="next" disabled={!canNext} onClick={onNext} />
    </div>
  );
}

export default MissionList;
