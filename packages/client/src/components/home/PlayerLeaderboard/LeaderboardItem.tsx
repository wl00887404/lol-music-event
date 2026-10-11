import formatNumber from "@/libs/formatNumber";
import Title from "./Title";
import type { PlayerLeaderBoardItem } from ".";

const WIDTH = 1598;
const HEIGHT = 108;
const SVG_CLASS_NAME = "overflow-hidden max-w-full" as const;

type Props = {
  item: PlayerLeaderBoardItem;
};

function LeaderboardItem(props: Props) {
  const { rank, riotId, image, score, title } = props.item;
  const letterSpace = 2;

  const getBackgroundHref = () => {
    if (rank === 1) {
      return "/icons/player-leaderboard-first-bg.png";
    }

    if (rank === 2) {
      return "/icons/player-leaderboard-second-bg.png";
    }

    if (rank === 3) {
      return "/icons/player-leaderboard-third-bg.png";
    }

    return "/icons/player-leaderboard-fourth-bg.png";
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
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
        {rank}
      </text>
      <image
        href={`https://ddragon.leagueoflegends.com/cdn/16.19.1/img/profileicon/${image}.png`}
        x="194"
        y="22"
        width="63"
        preserveAspectRatio="xMidYMid slice"
        clip-path="url(#player-leaderboard-profile)"
      />
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
      <text
        x={1561 + letterSpace}
        y="66"
        fontSize="45"
        fill="#fff9e5"
        textAnchor="end"
        fontFamily="BeaufortforLOL, sans-serif"
        letterSpacing={letterSpace}
      >
        {formatNumber(score)}
      </text>
    </svg>
  );
}

export default LeaderboardItem;
