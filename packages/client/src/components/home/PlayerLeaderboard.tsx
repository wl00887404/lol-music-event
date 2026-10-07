import type { Team } from "@/types";
import { Button } from "../ui/button";
import { useState } from "react";

const WIDTH = 1193;
const HEIGHT = 82;
const SVG_CLASS_NAME = "overflow-hidden max-w-full" as const;

type AllAndTeam = "all" | Team;

type TeamFilterProps = {
  active: AllAndTeam;
  onChange: (nextTeam: AllAndTeam) => void;
};

function TeamFilter(props: TeamFilterProps) {
  const { active, onChange } = props;
  const options: AllAndTeam[] = ["all", "kda", "heart-steel", "true-damage"];

  return (
    <div className="max-w-[1229px] mx-auto relative">
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
          href={`/icons/team-filter-bg-${active}.png`}
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
      {options.map((option, index) => {
        return (
          <Button
            key={option}
            className="absolute w-[25%] h-full top-0 p-0 rounded-none border-none opacity-0"
            style={{ left: index * 25 + "%" }}
            onClick={() => onChange(option)}
          />
        );
      })}
    </div>
  );
}

function PlayerLeaderboard() {
  const [currentTeam, setCurrentTeam] = useState<AllAndTeam>("all");

  return (
    <div className=" px-[18px] mx-auto">
      <div className="flex justify-center">
        <img
          src="/icons/player-leaderboard-title.png"
          className="w-[227px] h-[55px]"
        />
      </div>
      <div className="mt-[52px]">
        <TeamFilter active={currentTeam} onChange={setCurrentTeam} />
      </div>
    </div>
  );
}

export default PlayerLeaderboard;
