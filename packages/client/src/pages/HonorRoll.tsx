import { getHonorRoll, type HonorRollItem } from "@/apis";
import HeroCarousel from "@/components/home/HeroCarousel";
import { SpacedText } from "@/components/SpacedText";
import { authClient } from "@/libs/auth-client";
import getPlaceholderString from "@/libs/getPlaceholderString";
import { cn } from "@/libs/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const WIDTH = 521;
const HEIGHT = 389;
const SVG_CLASS_NAME = "overflow-hidden max-w-full" as const;

type Props = {
  item: HonorRollItem;
  loading?: boolean;
};

function LeaderboardItem(props: Props) {
  const { loading } = props;
  const { riotId, image, name } = props.item;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={SVG_CLASS_NAME}
      width={WIDTH}
    >
      <defs>
        <clipPath id="honor-roll-profile">
          <circle cx="260" cy="133" r="60" fill="black" />
        </clipPath>
      </defs>
      <image
        href={`/icons/honor-roll-item-bg-3.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      <image
        href={`/icons/honor-roll-item-bg-2.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ mixBlendMode: "color-dodge" }}
      />
      <image
        href={`/icons/honor-roll-item-bg-1.png`}
        x="0"
        y="0"
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
      />
      {loading ? null : (
        <image
          href={`https://ddragon.leagueoflegends.com/cdn/16.19.1/img/profileicon/${image}.png`}
          x="200"
          y="73"
          width="120"
          height="120"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#honor-roll-profile)"
        />
      )}
      <SpacedText
        x={260.5}
        y={263}
        fontFamily="BeaufortforLOL, Noto Sans TC, sans-serif"
        textAnchor="middle"
        fontSize="51"
        fontWeight="700"
        fill="#fff9e5"
        letterSpacing={1.5}
      >
        {riotId}
      </SpacedText>
      <SpacedText
        x={260.5}
        y={352.5}
        fontFamily="BeaufortforLOL, Noto Sans TC, sans-serif"
        textAnchor="middle"
        fontSize="26.5"
        fontWeight="700"
        fill="#0b1527"
        letterSpacing={2}
      >
        {name}
      </SpacedText>
    </svg>
  );
}

const mockItems: HonorRollItem[] = Array(12)
  .fill(0)
  .map((_, index) => {
    return {
      id: `mock-honor-roll-${index}`,
      riotId: getPlaceholderString(11),
      name: getPlaceholderString(6),
      image: "29",
    };
  });

function HonorRoll() {
  const { data: session } = authClient.useSession();
  const { data, isFetching } = useQuery({
    queryKey: [
      "honorRoll",
      // 沒登入拿不到完整的 riotId 與 image
      Boolean(session?.user),
    ],
    queryFn: async () => {
      return getHonorRoll();
    },
    placeholderData: keepPreviousData,
  });

  const items = data || mockItems;

  return (
    <div className="relative px-[1.125em]">
      <HeroCarousel />
      <div className="flex flex-col items-center mt-[7.5625em] mb-[7.5625em]">
        <img
          src="/icons/honor-roll-title.png"
          className="w-[16.875em] h-[4em] block"
        />
        <div
          className={cn(
            "mt-[7.125em] px-[1.125em] grid",
            "grid-cols-[repeat(2,1fr)] md:grid-cols-[repeat(3,1fr)] gap-[1.125em] md:gap-[3.75em_100/16em]",
          )}
        >
          {items.map((item) => {
            return (
              <LeaderboardItem key={item.id} item={item} loading={isFetching} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HonorRoll;
