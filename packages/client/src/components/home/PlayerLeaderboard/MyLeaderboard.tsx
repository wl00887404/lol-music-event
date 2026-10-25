import formatNumber from "@/libs/formatNumber";
import Title from "./Title";
import useMyLeaderboard from "@/hooks/useMyLeaderboard";
import getPlaceholderString from "@/libs/getPlaceholderString";
import type { PlayerLeaderboardItem } from "@/apis";
import { SpacedText } from "@/components/SpacedText";
import getProfileUrl from "@/libs/getProfileUrl";
import { useViewport } from "@/components/viewportStore";
import { imgUri } from "@/libs/uris";

const DESKTOP_WIDTH = 1592;
const DESKTOP_HEIGHT = 139;
const MOBILE_WIDTH = 672;
const MOBILE_HEIGHT = 160;
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
  const viewport = useViewport();

  if (viewport === "mobile") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${MOBILE_WIDTH} ${MOBILE_HEIGHT}`}
        className={SVG_CLASS_NAME}
      >
        <image
          href={`/icons/m-my-leaderboard-bg.png`}
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
        <clipPath id="my-leaderboard-profile">
          <circle cx="221.5" cy="68.5" r="31.5" fill="black" />
        </clipPath>
      </defs>
      <image
        href={`/icons/my-leaderboard-bg-2.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/my-leaderboard-bg-1.png`}
        x="0"
        y="0"
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <text
        x="44"
        y="85"
        fontSize="45"
        fill="#fff9e5"
        fontFamily="BeaufortforLOL"
        letterSpacing="2"
      >
        {loading ? "" : totalRank}
      </text>
      <image
        href={getProfileUrl(image)}
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
        fontFamily="Noto Sans TC"
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
        fontFamily="BeaufortforLOL"
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
      <div className="mt-[0.9375em] md:mt-[2.875em]">
        <img
          src={imgUri("/icons/player-leaderboard-divider.png")}
          className="h-[4px] object-cover"
        />
      </div>
    </>
  );
}
export default MyLeaderboard;
