import formatNumber from "@/libs/formatNumber";
import Title from "./Title";
import type { PlayerLeaderboardItem } from "@/apis";
import { SpacedText } from "@/components/SpacedText";
import getProfileUrl from "@/libs/getProfileUrl";

const WIDTH = 1598;
const HEIGHT = 108;

type Props = {
  item: PlayerLeaderboardItem;
  loading?: boolean;
};

function LeaderboardItem(props: Props) {
  const { loading } = props;
  const { totalRank, riotId, image, score, titles } = props.item;
  const title = titles[0];

  const getBackgroundHref = () => {
    if (totalRank === 1) {
      return "/icons/player-leaderboard-first-bg.png";
    }

    if (totalRank === 2) {
      return "/icons/player-leaderboard-second-bg.png";
    }

    if (totalRank === 3) {
      return "/icons/player-leaderboard-third-bg.png";
    }

    return "/icons/player-leaderboard-fourth-bg.png";
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="overflow-hidden max-w-full w-full"
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
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/player-leaderboard-bg.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <text
        x="45"
        y="69"
        fontSize="45"
        fill="#fff9e5"
        fontFamily="BeaufortforLOL, sans-serif"
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
        fontFamily="Noto Sans TC, sans-serif"
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
        fontFamily="BeaufortforLOL, sans-serif"
        letterSpacing={2}
      >
        {loading ? "" : formatNumber(score)}
      </SpacedText>
    </svg>
  );
}

export default LeaderboardItem;
