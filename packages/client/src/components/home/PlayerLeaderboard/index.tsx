import { useCallback, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import type { Tab } from "./types";
import TeamFilter from "./TeamFilter";
import SearchBar from "./SearchBar";
import MyLeaderboardItem from "./MyLeaderboardItem";
import LeaderboardItem from "./LeaderboardItem";

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
          className="w-[227px] h-[55px]"
        />
      </div>
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
            {/* TODO: 排行榜 */}
            <LeaderboardItem />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerLeaderboard;
