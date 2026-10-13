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
  missionColor: string;
  scoreColor: string;
};

function Item(props: ItemProps) {
  const { item, missionColor, scoreColor } = props;
  const team = useTeam();

  const imgClassName = cn(
    "w-[468px] h-[245px] max-w-[none]",
    "absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]",
    "pointer-events-none",
  );

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[245px] max-w-[321px]">
        <img
          src={`/icons/${team}/mission-item-bg.png`}
          className={imgClassName}
        />
        <div
          className={cn(
            "relative h-full flex justify-center items-center text-center",
            "font-[700] text-[24px]",
          )}
          style={{ color: missionColor }}
        >
          {item.name}
        </div>
        <div
          className={cn(
            "absolute top-[26px] left-[333px]",
            "font-[BeaufortforLOL] text-[30px] leading-[1]",
          )}
          style={{ color: scoreColor }}
        >
          +{item.score}
        </div>
        {item.status === "finished" && (
          <img
            src={`/icons/${team}/mission-item-finished.png`}
            className={imgClassName}
            style={{ opacity: 0.45, mixBlendMode: "multiply" }}
          />
        )}
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
  const padding = "28px";

  const fileName = dir === "prev" ? "chevron-left.png" : "chevron-right.png";
  const style = dir === "prev" ? { left: padding } : { right: padding };

  return (
    <BaseButton
      className="disabled:hidden"
      onClick={onClick}
      disabled={disabled}
    >
      <img
        src={`/icons/${team}/${fileName}`}
        className="w-[68px] h-[94px] absolute top-[76px]"
        style={style}
      />
    </BaseButton>
  );
}

type GetTheme = () => {
  missionColor: string;
  scoreColor: string;
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
      return { missionColor: "#262b1b", scoreColor: "#262b1b" };
    }

    if (team == Team.trueDamage) {
      return { missionColor: "#f5ebe4", scoreColor: "#1c1c1e" };
    }

    return { missionColor: "#f5ebe4", scoreColor: "#0b1527" };
  };

  const onPrev = () => {
    if (api) api.scrollPrev();
  };

  const onNext = () => {
    if (api) api.scrollNext();
  };

  const { missionColor, scoreColor } = getTheme();

  if (!items) return null;

  return (
    <div className="relative mt-[43px] px-[68px]">
      <Carousel opts={{ align: "start" }} setApi={setApi}>
        <CarouselContent>
          {items.map((item, index) => {
            return (
              <CarouselItem key={index} className="basis-1/3">
                <Item
                  item={item}
                  missionColor={missionColor}
                  scoreColor={scoreColor}
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
