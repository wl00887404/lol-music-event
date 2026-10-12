import { Button } from "../../ui/button";
import type { Tab } from "./types";
const WIDTH = 1193;
const HEIGHT = 82;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

type Props = {
  currentTab: Tab;
  onChange: (nextTab: Tab) => void;
};

function TeamFilter(props: Props) {
  const { currentTab, onChange } = props;
  const tabs: Tab[] = ["all", "kda", "heart-steel", "true-damage"];

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={SVG_CLASS_NAME}
      >
        <image
          href={`/icons/team-filter-bg-2.png`}
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
        <image
          href={`/icons/team-filter-bg-${currentTab}.png`}
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
        <image
          href={`/icons/team-filter-bg-1.png`}
          x="0"
          y="0"
          width={WIDTH}
          height={HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
      </svg>
      {tabs.map((tab, index) => {
        return (
          <Button
            key={tab}
            className="absolute w-[25%] h-full top-0 p-0 rounded-none border-none opacity-0"
            style={{ left: index * 25 + "%" }}
            onClick={() => onChange(tab)}
          />
        );
      })}
    </div>
  );
}

export default TeamFilter;
