import formatNumber from "@/libs/formatNumber";
import Title from "./Title";

const WIDTH = 1592;
const HEIGHT = 139;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

function MyLeaderboardItem() {
  const rank = 325;
  const riotId = "06年拒絕職業邀約原因是不打自訂#QAQTT";
  const image = 6923;
  const score = 99999;
  const letterSpace = 2;
  const title = "我就是 True Damage";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={SVG_CLASS_NAME}
    >
      <defs>
        <clipPath id="my-leaderboard-profile">
          <circle cx="221.5" cy="68.5" r="31.5" fill="black" />
        </clipPath>
      </defs>
      <image
        href={`/icons/my-leaderboard-bg-2.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/my-leaderboard-bg-1.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <text
        x="44"
        y="85"
        fontSize="45"
        fill="#fff9e5"
        fontFamily="BeaufortforLOL, sans-serif"
        letterSpacing="2"
      >
        {rank}
      </text>
      <image
        href={`https://ddragon.leagueoflegends.com/cdn/16.19.1/img/profileicon/${image}.png`}
        x="190"
        y="37"
        width="63"
        height="63"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#my-leaderboard-profile)"
      />
      <text
        x="282"
        y="82"
        fontSize="33"
        fill="#fff9e5"
        fontFamily="Noto Sans TC, sans-serif"
        fontWeight="700"
        letterSpacing="1.6"
      >
        {riotId}
      </text>
      {title && <Title x={1009} y={41} title={title} />}
      <text
        x={1558 + letterSpace}
        y="82"
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

export default MyLeaderboardItem;
