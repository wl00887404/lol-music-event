import formatNumber from "@/libs/formatNumber";
import Title from "./Title";
import useMyLeaderboard from "@/hooks/useMyLeaderboard";
import getPlaceholderString from "@/libs/getPlaceholderString";
import type { PlayerLeaderboardItem } from "@/apis";
import { SpacedText } from "@/components/SpacedText";

const WIDTH = 1592;
const HEIGHT = 139;
const SVG_CLASS_NAME = "overflow-hidden max-w-full w-full" as const;

const mockItem: PlayerLeaderboardItem = {
  id: `mock-player-0`,
  riotId: getPlaceholderString(9),
  titles: [],
  score: 0,
  image: "29",
  totalRank: 0,
};

type Props = { item: PlayerLeaderboardItem; loading?: boolean };

function MyLeaderboardItem(props: Props) {
  const { loading } = props;
  const { totalRank, riotId, image, score, titles } = props.item;

  const title = titles[0];

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
        {loading ? "" : totalRank}
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
      <SpacedText
        x={1558}
        y="82"
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

function MyLeaderboard() {
  const myLeaderboard = useMyLeaderboard();

  if (!myLeaderboard.enabled) return null;

  const item = myLeaderboard.isPending ? mockItem : myLeaderboard.data?.player;
  if (!item) return null;

  return (
    <>
      <MyLeaderboardItem item={item} loading={myLeaderboard.isPending} />
      <div className="mt-[2.875em]">
        <img src="/icons/player-leaderboard-divider.png" />
      </div>
    </>
  );
}
export default MyLeaderboard;
