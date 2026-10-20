import formatNumber from "@/libs/formatNumber";
import Title from "./Title";
import type { PlayerLeaderboardItem } from "@/apis";
import { SpacedText } from "@/components/SpacedText";
import getProfileUrl from "@/libs/getProfileUrl";
import { useViewport } from "@/components/viewportStore";

const DESKTOP_WIDTH = 1598;
const DESKTOP_HEIGHT = 108;
const MOBILE_WIDTH = 672;
const MOBILE_HEIGHT = 160;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

type Props = {
  item: PlayerLeaderboardItem;
  loading?: boolean;
};

function LeaderboardItem(props: Props) {
  const { loading } = props;
  const { totalRank, riotId, image, score, titles } = props.item;
  const title = titles[0];

  const viewport = useViewport();
  const prefix = viewport === "mobile" ? "m-" : "";

  const getBackgroundHref = () => {
    if (totalRank === 1) {
      return `/icons/${prefix}player-leaderboard-first-bg.png`;
    }

    if (totalRank === 2) {
      return `/icons/${prefix}player-leaderboard-second-bg.png`;
    }

    if (totalRank === 3) {
      return `/icons/${prefix}player-leaderboard-third-bg.png`;
    }

    return `/icons/${prefix}player-leaderboard-fourth-bg.png`;
  };

  if (viewport === "mobile") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${MOBILE_WIDTH} ${MOBILE_HEIGHT}`}
        className={SVG_CLASS_NAME}
      >
        <image
          href={getBackgroundHref()}
          x="0"
          y="0"
          width={MOBILE_WIDTH}
          height={MOBILE_HEIGHT}
          preserveAspectRatio="xMidYMid slice"
        />
        <text
          x="18"
          y="38"
          fontSize="35"
          fill="#fff9e5"
          fontFamily="BeaufortforLOL"
          letterSpacing="2"
        >
          {loading ? "" : totalRank}
        </text>
        <SpacedText
          x={656}
          y="45"
          fontSize="45"
          fill="#fff9e5"
          textAnchor="end"
          fontFamily="BeaufortforLOL"
          letterSpacing={2}
        >
          {loading ? "" : formatNumber(score)}
        </SpacedText>
        <text
          x="18"
          y="138"
          fontSize="30"
          fill="#fff9e5"
          fontFamily="Noto Sans TC"
          fontWeight="700"
          letterSpacing="1.6"
        >
          {riotId}
        </text>
        {title && <Title x={18} y={57} title={title} />}
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${DESKTOP_WIDTH} ${DESKTOP_HEIGHT}`}
      className={SVG_CLASS_NAME}
    >
      <defs>
        <clipPath id="player-leaderboard-profile">
          <circle cx="225.5" cy="53.5" r="31.5" fill="black" />
        </clipPath>
      </defs>
      <image
        href={getBackgroundHref()}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/player-leaderboard-bg.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <text
        x="45"
        y="69"
        fontSize="45"
        fill="#fff9e5"
        fontFamily="BeaufortforLOL"
        letterSpacing="2"
      >
        {loading ? "" : totalRank}
      </text>
      {loading ? null : (
        <image
          href={getProfileUrl(image)}
          x="194"
          y="22"
          width="63"
          height="63"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#player-leaderboard-profile)"
        />
      )}
      <text
        x="285"
        y="65"
        fontSize="33"
        fill="#fff9e5"
        fontFamily="Noto Sans TC"
        fontWeight="700"
        letterSpacing="1.6"
      >
        {riotId}
      </text>
      {title && <Title x={1012} y={26} title={title} />}
      <SpacedText
        x={1561}
        y="66"
        fontSize="45"
        fill="#fff9e5"
        textAnchor="end"
        fontFamily="BeaufortforLOL"
        letterSpacing={2}
      >
        {loading ? "" : formatNumber(score)}
      </SpacedText>
    </svg>
  );
}

export default LeaderboardItem;
