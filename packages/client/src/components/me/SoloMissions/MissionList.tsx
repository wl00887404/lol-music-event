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

type ItemProps = {
  item: SoloMission;
  index: number;
  missionColor: string;
  scoreColor: string;
  finishedMissionColor: string;
  inProgressMissionColor: string;
  lockedMissionColor: string;
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
  const {
    item,
    index,
    missionColor,
    scoreColor,
    finishedMissionColor,
    inProgressMissionColor,
    lockedMissionColor,
  } = props;
  const team = useTeam();

  const imgClassName = cn(
    "w-[29.25em] h-[15.3125em] max-w-[none]",
    "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
    "pointer-events-none",
  );
  const lineClassName =
    "absolute top-[0] w-[50%] h-full bg-repeat-x bg-[length:auto_100%]";

  const getLabelTheme = () => {
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
    getLabelTheme();
  return (
    <div>
      <div className="relative w-full h-[15.3125em] max-w-[20.0625em] mx-auto">
        <img
          src={`/icons/${team}/mission-item-bg.png`}
          className={imgClassName}
        />
        <div
          className={cn(
            "relative h-full flex justify-center items-center text-center",
            "font-[700] text-[1.5em]",
          )}
          style={{ color: missionColor }}
        >
          {item.name}
        </div>
        <div
          className={cn("absolute top-[1.625em] left-[20.8125em]")}
          style={{ color: scoreColor }}
        >
          <span className="font-[BeaufortforLOL] text-[1.875em]">
            +{item.score}
          </span>
        </div>
        {item.status === "finished" && (
          <img
            src={`/icons/${team}/mission-item-finished.png`}
            className={imgClassName}
            style={{ opacity: 0.45, mixBlendMode: "multiply" }}
          />
        )}
      </div>
      <div className="relative mt-[-1.25em] flex justify-center -mx-2">
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
}

type SiblingButtonProps = {
  dir: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
};

function SiblingButton(props: SiblingButtonProps) {
  const { dir, onClick, disabled } = props;
  const team = useTeam();
  const padding = "1.75em";

  const fileName = dir === "prev" ? "chevron-left.png" : "chevron-right.png";
  const leftOrRight = dir === "prev" ? { left: padding } : { right: padding };

  return (
    <BaseButton
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-[4.25em] h-[5.875em] absolute top-[4.75em] bg-cover",
        "disabled:hidden",
      )}
      style={{
        backgroundImage: `url("/icons/${team}/${fileName}")`,
        ...leftOrRight,
      }}
    />
  );
}

type GetTheme = () => {
  missionColor: string;
  scoreColor: string;
  finishedMissionColor: string;
  inProgressMissionColor: string;
  lockedMissionColor: string;
};

type MissionListProps = {
  items: SoloMission[] | undefined;
};

function MissionList(props: MissionListProps) {
  const { items } = props;
  const team = useTeam();
  const [api, setApi] = useState<CarouselApi>();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

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

  const getTheme: GetTheme = () => {
    if (team == Team.heartSteel) {
      return {
        missionColor: "#262b1b",
        scoreColor: "#262b1b",
        finishedMissionColor: "#262b1b",
        inProgressMissionColor: "#262b1b",
        lockedMissionColor: "#f6efe1",
      };
    }

    if (team == Team.trueDamage) {
      return {
        missionColor: "#f5ebe4",
        scoreColor: "#1c1c1e",
        finishedMissionColor: "#1c1c1e",
        inProgressMissionColor: "#1c1c1e",
        lockedMissionColor: "#ffffff",
      };
    }

    return {
      missionColor: "#f5ebe4",
      scoreColor: "#0b1527",
      finishedMissionColor: "#f5ebe4",
      inProgressMissionColor: "#f5ebe4",
      lockedMissionColor: "#0b1527",
    };
  };

  const onPrev = () => {
    if (api) api.scrollPrev();
  };

  const onNext = () => {
    if (api) api.scrollNext();
  };

  const {
    missionColor,
    scoreColor,
    finishedMissionColor,
    inProgressMissionColor,
    lockedMissionColor,
  } = getTheme();

  if (!items) return null;

  return (
    <div className="relative mt-[2.6875em] px-[4.25em]">
      <Carousel opts={{ align: "start" }} setApi={setApi}>
        <CarouselContent>
          {items.map((item, index) => {
            return (
              <CarouselItem key={index} className="basis-1/3">
                <Item
                  index={index}
                  item={item}
                  missionColor={missionColor}
                  scoreColor={scoreColor}
                  finishedMissionColor={finishedMissionColor}
                  inProgressMissionColor={inProgressMissionColor}
                  lockedMissionColor={lockedMissionColor}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
      <SiblingButton dir="prev" disabled={!canPrev} onClick={onPrev} />
      <SiblingButton dir="next" disabled={!canNext} onClick={onNext} />
    </div>
  );
}

export default MissionList;
