import { getTeamLeaderboard } from "@/apis";
import formatNumber from "@/libs/formatNumber";
import { Team } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SpacedText } from "../SpacedText";

type ItemProps = {
  team: Team;
  score: number;
  loading?: boolean;
};

const WIDTH = 1615;
const HEIGHT = 163;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

function Item(props: ItemProps) {
  const { team, score, loading } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={SVG_CLASS_NAME}
    >
      <defs>
        <defs>
          <linearGradient id="g" x1="-0.05" y1="0.12" x2="-0.05" y2="1.12">
            <stop offset="0" stopColor="#f0ca70" />
            <stop offset="1" stopColor="#eeddb4" />
          </linearGradient>
        </defs>
      </defs>
      <image
        href={`/icons/${team}-leaderboard-bg-3.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/${team}-leaderboard-bg-2.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <image
        href={`/icons/${team}-leaderboard-bg-1.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <SpacedText
        x={1556}
        y="114"
        textAnchor="end"
        fontFamily="BeaufortforLOL, sans-serif"
        fontSize="90"
        letterSpacing={4}
        fill="url(#g)"
      >
        {loading ? "" : formatNumber(score)}
      </SpacedText>
    </svg>
  );
}

function TeamLeaderboard() {
  const { data, isFetching } = useQuery({
    queryKey: ["teamLeaderboard"],
    queryFn: async () => {
      return getTeamLeaderboard();
    },
    placeholderData: keepPreviousData,
  });

  return (
    // 18 + 1615 + 18
    <div className="max-w-[1651px] px-[18px] mx-auto">
      <div className="flex justify-center">
        <img
          src="/icons/team-leaderboard-title.png"
          className="w-[226px] h-[56px] block"
        />
      </div>
      <div className="mt-[47px]">
        <Item team="kda" score={data?.[Team.kda] || 0} loading={isFetching} />
      </div>
      <div className="mt-[71px]">
        <Item
          team="heart-steel"
          score={data?.[Team.heartSteel] || 0}
          loading={isFetching}
        />
      </div>
      <div className="mt-[71px]">
        <Item
          team="true-damage"
          score={data?.[Team.trueDamage] || 0}
          loading={isFetching}
        />
      </div>
    </div>
  );
}

export default TeamLeaderboard;
