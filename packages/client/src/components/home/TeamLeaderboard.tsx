import { getTeamLeaderboard } from "@/apis";
import formatNumber from "@/libs/formatNumber";
import { Team } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SpacedText } from "../SpacedText";
import { useViewport } from "../viewportStore";

type ItemProps = {
  team: Team;
  score: number;
  loading?: boolean;
};

const DESKTOP_WIDTH = 1615;
const DESKTOP_HEIGHT = 163;
const MOBILE_WIDTH = 672;
const MOBILE_HEIGHT = 112;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

function Item(props: ItemProps) {
  const { team, score, loading } = props;
  const viewport = useViewport();

  const defs = (
    <defs>
      <linearGradient id="g" x1="-0.05" y1="0.12" x2="-0.05" y2="1.12">
        <stop offset="0" stopColor="#f0ca70" />
        <stop offset="1" stopColor="#eeddb4" />
      </linearGradient>
    </defs>
  );

  if (viewport === "mobile") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${MOBILE_WIDTH} ${MOBILE_HEIGHT}`}
        className={SVG_CLASS_NAME}
      >
        {defs}
        <image
          href={`/icons/m-${team}-leaderboard-bg.png`}
          x="0"
          y="0"
          width={MOBILE_WIDTH}
          height={MOBILE_HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
        <SpacedText
          x={644}
          y="74"
          textAnchor="end"
          fontFamily="BeaufortforLOL"
          fontSize="55"
          letterSpacing={3}
          fill="url(#g)"
        >
          {loading ? "" : formatNumber(score)}
        </SpacedText>
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${DESKTOP_WIDTH} ${DESKTOP_HEIGHT}`}
      className={SVG_CLASS_NAME}
    >
      {defs}
      <image
        href={`/icons/${team}-leaderboard-bg-3.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/${team}-leaderboard-bg-2.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <image
        href={`/icons/${team}-leaderboard-bg-1.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <SpacedText
        x={1556}
        y="114"
        textAnchor="end"
        fontFamily="BeaufortforLOL"
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
    <div className="px-[1.125em]">
      {/* 672 1615 */}
      <div className="max-w-[42em] md:max-w-[100.9375em] mx-auto">
        <div className="flex justify-center">
          <img
            src="/icons/team-leaderboard-title.png"
            className="aspect-ratio-[226/56] h-[1.75em] md:h-[3.5em] block"
          />
        </div>
        <div className="mt-[2.53125em] md:mt-[2.9375em]">
          <Item team="kda" score={data?.[Team.kda] || 0} loading={isFetching} />
        </div>
        <div className="mt-[0.6875em] md:mt-[4.4375em]">
          <Item
            team="heart-steel"
            score={data?.[Team.heartSteel] || 0}
            loading={isFetching}
          />
        </div>
        <div className="mt-[0.6875em] md:mt-[4.4375em]">
          <Item
            team="true-damage"
            score={data?.[Team.trueDamage] || 0}
            loading={isFetching}
          />
        </div>
      </div>
    </div>
  );
}

export default TeamLeaderboard;
