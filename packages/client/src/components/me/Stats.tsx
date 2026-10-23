import useMyStats from "@/hooks/useMyStats";
import useTeam from "@/hooks/useTeam";
import { Team } from "@/types";
import { SpacedText } from "../SpacedText";
import formatNumber from "@/libs/formatNumber";
import { useViewport } from "../viewportStore";

const DESKTOP_WIDTH = 1632;
const DESKTOP_HEIGHT = 480;

const MOBILE_WIDTH = 708;
const MOBILE_HEIGHT = 700;

const imageProps = {
  x: 0,
  y: 0,
  width: DESKTOP_WIDTH,
  height: DESKTOP_HEIGHT,
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

const useTheme = () => {
  const team = useTeam();

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

function MobileStats() {
  const team = useTeam();
  const stats = useMyStats();
  const { color } = useTheme();

  const textProps = {
    fill: color,
    fontSize: 74,
    fontFamily: "BeaufortforLOL",
    textAnchor: "middle",
    letterSpacing: 3.6,
  } as const;

  const x1 = 197;
  const x2 = 511;
  const y1 = 283;
  const y2 = 511;
  const y3 = 632;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${MOBILE_WIDTH} ${MOBILE_HEIGHT}`}
      className="overflow-hidden w-full"
    >
      <image
        x="0"
        y="0"
        width={MOBILE_WIDTH}
        height={MOBILE_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        href={`/icons/${team}/m-stats-bg.png`}
      />
      <SpacedText {...textProps} x={x1} y={y1}>
        {formatNumber(stats.totalCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x2} y={y1}>
        {formatNumber(stats.winCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x1} y={y2}>
        {formatNumber(stats.totalCount - stats.winCount)}
      </SpacedText>
      <SpacedText {...textProps} x={x2} y={y2}>
        {stats.averageKda}
      </SpacedText>

      <SpacedText
        x={MOBILE_WIDTH / 2}
        y={y3}
        textAnchor="middle"
        fontSize="17"
        fontWeight={500}
        fill={color}
      >
        此數據為 26.21 版本更新後，遊玩「隨機單中：大混戰」模式之統計數據
      </SpacedText>
      <SpacedText
        x={MOBILE_WIDTH / 2}
        y={y3 + 24}
        textAnchor="middle"
        fontSize="17"
        fontWeight={500}
        fill={color}
      >
        實際獲得分數僅自您註冊後開始計算
      </SpacedText>
    </svg>
  );
}

function Stats() {
  const team = useTeam();
  const stats = useMyStats();

  const { color } = useTheme();
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

  const viewport = useViewport();

  if (viewport === "mobile") {
    return <MobileStats />;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${DESKTOP_WIDTH} ${DESKTOP_HEIGHT}`}
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
      <SpacedText
        x={DESKTOP_WIDTH / 2}
        y="442"
        textAnchor="middle"
        fontSize="17"
        fontWeight={500}
        fill={color}
      >
        此數據為 26.21
        版本更新後，遊玩「隨機單中：大混戰」模式之統計數據，實際獲得分數僅自您註冊後開始計算。
      </SpacedText>
    </svg>
  );
}

export default Stats;
