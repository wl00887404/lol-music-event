import { useViewport } from "@/components/viewportStore";
import { type Tab as TabType, Tab } from "./types";
import { cn } from "@/libs/utils";
import BaseButton from "@/components/BaseButton";
import { imgUri } from "@/libs/uris";

const DESKTOP_WIDTH = 1193;
const DESKTOP_HEIGHT = 82;
const MOBILE_WIDTH = 672;
const MOBILE_HEIGHT = 202;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

type Props = {
  currentTab: TabType;
  onChange: (nextTab: TabType) => void;
};

function TeamFilter(props: Props) {
  const { currentTab, onChange } = props;
  const viewport = useViewport();
  const width = viewport === "mobile" ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const height = viewport === "mobile" ? MOBILE_HEIGHT : DESKTOP_HEIGHT;
  const prefix = viewport === "mobile" ? "m-" : "";
  const buttonClassName =
    viewport === "mobile"
      ? "absolute opacity-0 w-[50%] h-[50%]"
      : "absolute opacity-0 w-[25%] h-full";

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        className={SVG_CLASS_NAME}
      >
        <image
          href={imgUri(`/icons/${prefix}team-filter-bg-2.png`)}
          x="0"
          y="0"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
        <image
          href={imgUri(`/icons/${prefix}team-filter-bg-${currentTab}.png`)}
          x="0"
          y="0"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
        <image
          href={imgUri(`/icons/${prefix}team-filter-bg-1.png`)}
          x="0"
          y="0"
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
      <BaseButton
        className={cn(buttonClassName, "top-[0] left-[0]")}
        onClick={() => onChange(Tab.all)}
      />
      <BaseButton
        className={cn(buttonClassName, "top-[0] left-[50%]", "md:left-[25%]")}
        onClick={() => onChange(Tab.kda)}
      />
      <BaseButton
        className={cn(
          buttonClassName,
          "top-[50%] left-[0]",
          "md:top-[0] md:left-[50%]",
        )}
        onClick={() => onChange(Tab.heartSteel)}
      />
      <BaseButton
        className={cn(
          buttonClassName,
          "top-[50%] left-[50%]",
          "md:top-[0] md:left-[75%]",
        )}
        onClick={() => onChange(Tab.trueDamage)}
      />
    </div>
  );
}

export default TeamFilter;
