import { useCallback, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import type { Tab } from "./types";
import TeamFilter from "./TeamFilter";
import SearchBar from "./SearchBar";
import MyLeaderboardItem from "./MyLeaderboardItem";
import LeaderboardItem from "./LeaderboardItem";
import Pagination from "@/components/Pagination";

export type PlayerLeaderBoardItem = {
  id: string;
  rank: number;
  riotId: string;
  score: number;
  title: string;
  image: number;
};

const mockItems: PlayerLeaderBoardItem[] = [
  {
    id: "mock-id-0",
    rank: 1,
    riotId: "一生摯愛金采源#TW2",
    image: 6923,
    score: 99999,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-1",
    rank: 2,
    riotId: "饅饅來#5824",
    image: 4574,
    score: 88888,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-2",
    rank: 3,
    riotId: "情緒發言大可不必#3788",
    image: 7088,
    score: 77777,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-3",
    rank: 4,
    riotId: "最可愛#Qest",
    image: 1630,
    score: 66666,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-4",
    rank: 5,
    riotId: "飄逸小江#tw2",
    image: 7091,
    score: 55555,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-5",
    rank: 6,
    riotId: "就剩一滴血#9453",
    image: 5455,
    score: 44444,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-6",
    rank: 7,
    riotId: "阿掐卡#tw2",
    image: 1391,
    score: 33333,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-7",
    rank: 8,
    riotId: "源Yuan#0618",
    image: 1425,
    score: 22222,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-8",
    rank: 9,
    riotId: "告密剋星勒頸魔#1017",
    image: 3790,
    score: 11111,
    title: "我就是 True Damage",
  },
  {
    id: "mock-id-9",
    rank: 10,
    riotId: "宏0jghhir耶#tw2",
    image: 6913,
    score: 0,
    title: "我就是 True Damage",
  },
];

function PlayerLeaderboard() {
  const [currentTab, setCurrentTab] = useState<Tab>("all");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setImmediateKeyword] = useDebounce(keyword, 670);
  const [currentPage, setCurrentPage] = useState(1);

  const onPageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
      // restoreScroll();
    },
    [setCurrentPage],
    // [setCurrentPage, restoreScroll],
  );

  const onSearch = (nextKeyword: string) => {
    setCurrentTab("all");
    setKeyword(nextKeyword);
    onPageChange(1);
  };

  const onTabChange = (nextTab: Tab) => {
    setKeyword("");
    setImmediateKeyword("");
    onPageChange(1);
    setCurrentTab(nextTab);
  };

  return (
    <div className=" px-[18px] mx-auto">
      <div className="flex justify-center">
        <img
          src="/icons/player-leaderboard-title.png"
          className="w-[227px] h-[55px] block"
        />
      </div>

      {/* 18 + 1193 + 18 */}
      <div className="mt-[52px] max-w-[1229px] mx-auto">
        <TeamFilter currentTab={currentTab} onChange={onTabChange} />
      </div>
      <div className="mt-[52px] max-w-[1628px] mx-auto">
        <SearchBar keyword={keyword} onSearch={onSearch} />
        <div className="mt-[48px]">
          <MyLeaderboardItem />
          <div className="mt-[46px]">
            <img src="/icons/player-leaderboard-divider.png" />
          </div>
          <div className="mt-[50px] flex flex-col gap-[33px]">
            {mockItems.map((item) => {
              return <LeaderboardItem key={item.id} item={item} />;
            })}
          </div>
          <div className="mt-[82px]">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={onPageChange}
              maxPage={99}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerLeaderboard;
