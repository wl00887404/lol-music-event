import useMyStats from "@/hooks/useMyStats";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import { SpacedText } from "../SpacedText";
import formatNumber from "@/libs/formatNumber";

const WIDTH = 1632;
const HEIGHT = 480;

const imageProps = {
  x: 0,
  y: 0,
  width: WIDTH,
  height: HEIGHT,
  preserveAspectRatio: "xMidYMid slice",
};

function KdaBackground() {
  return (
    <>
      <image href="/icons/kda/stats-bg-3.png" {...imageProps} />
      <image
        href="/icons/kda/stats-bg-2.png"
        {...imageProps}
        style={{ mixBlendMode: "color-dodge" }}
      />
      <image href="/icons/kda/stats-bg-1.png" {...imageProps} />
    </>
  );
}

function HeartSteelBackground() {
  return <image href="/icons/heart-steel/stats-bg.png" {...imageProps} />;
}

function TrueDamageBackground() {
  return (
    <>
      <image href="/icons/true-damage/stats-bg-3.png" {...imageProps} />
      <image
        href="/icons/true-damage/stats-bg-2.png"
        {...imageProps}
        style={{ mixBlendMode: "soft-light" }}
      />
      <image href="/icons/true-damage/stats-bg-1.png" {...imageProps} />
    </>
  );
}

function Stats() {
  const team = useTeam();
  const stats = useMyStats();
  
  const getTheme = () => {
    if (team === Team.heartSteel) {
      return {
        color: "#262b1b",
      };
    }

    if (team === Team.trueDamage) {
      return {
        color: "#1c1c1e",
      };
    }

    return {
      color: "#fff9e5",
    };
  };

  const { color } = getTheme();
  const x = 242;
  const space = 380;

  const textProps = {
    y: 348,
    fill: color,
    fontSize: 87,
    fontFamily: "BeaufortforLOL",
    textAnchor: "middle",
    letterSpacing: 3,
  } as const;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="overflow-hidden w-full"
    >
      {team === Team.kda && <KdaBackground />}
      {team === Team.heartSteel && <HeartSteelBackground />}
      {team === Team.trueDamage && <TrueDamageBackground />}
      <SpacedText {...textProps} x={x}>
        {formatNumber(stats.totalCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x + space}>
        {formatNumber(stats.winCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x + space * 2}>
        {formatNumber(stats.totalCount - stats.winCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x + space * 3}>
        {stats.averageKda}
      </SpacedText>
    </svg>
  );
}

export default Stats;
