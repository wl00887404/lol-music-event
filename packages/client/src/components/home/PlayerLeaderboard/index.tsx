import { useCallback, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import type { Tab } from "./types";
import TeamFilter from "./TeamFilter";
import SearchBar from "./SearchBar";
import LeaderboardItem from "./LeaderboardItem";
import Pagination from "@/components/Pagination";
import { HOME_PAGE_SIZE } from "@/const";
import { getPlayerLeaderboard, type PlayerLeaderboardItem } from "@/apis";
import { authClient } from "@/libs/auth-client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import getPlaceholderString from "@/libs/getPlaceholderString";
import useRestoreScroll from "@/hooks/useRestoreScroll";
import MyLeaderboard from "./MyLeaderboard";
import Empty from "../Empty";
import { cn } from "@/libs/utils";

const mockItems: PlayerLeaderboardItem[] = Array(HOME_PAGE_SIZE)
  .fill(0)
  .map((_, index) => {
    return {
      id: `mock-player-${index}`,
      riotId: getPlaceholderString(9),
      titles: [],
      score: 0,
      image: "29",
      totalRank: 0,
    };
  });

function PlayerLeaderboard() {
  const [currentTab, setCurrentTab] = useState<Tab>("all");
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setImmediateKeyword] = useDebounce(keyword, 670);
  const [currentPage, setCurrentPage] = useState(1);
  const { scrollRef, restoreScroll } = useRestoreScroll();

  const { data: session } = authClient.useSession();
  const { data, isFetching } = useQuery({
    queryKey: [
      "playerLeaderboard",
      debouncedKeyword,
      currentTab,
      currentPage,
      HOME_PAGE_SIZE,
      // 沒登入拿不到完整的 riotId 與 image
      Boolean(session?.user),
    ],
    queryFn: async () => {
      return getPlayerLeaderboard({
        keyword,
        team: currentTab,
        offset: (currentPage - 1) * HOME_PAGE_SIZE,
        limit: HOME_PAGE_SIZE,
      });
    },
    placeholderData: keepPreviousData,
  });

  const getItems = () => {
    if (isFetching) return mockItems;
    if (!data?.data) return mockItems;

    return data.data;
  };

  const items = getItems();
  const maxPage = Math.ceil((data?.total || 1) / HOME_PAGE_SIZE);

  const onPageChange = useCallback(
    (nextPage: number) => {
      setCurrentPage(nextPage);
      restoreScroll();
    },
    [setCurrentPage, restoreScroll],
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
    <div className="px-[1.125em]">
      <div ref={scrollRef} className="scroll-mt-[var(--scroll-margin-top)]" />
      <div className="flex justify-center">
        <img
          src="/icons/player-leaderboard-title.png"
          className="w-[14.1875em] h-[3.4375em] block"
        />
      </div>

      {/* 1193 */}
      <div className="mt-[3.25em] max-w-[74.5625em] mx-auto">
        <TeamFilter currentTab={currentTab} onChange={onTabChange} />
      </div>

      {/* 1592 */}
      <div className="mt-[3.25rem] max-w-[99.5em] mx-auto">
        <SearchBar keyword={keyword} onSearch={onSearch} />
        <div className="mt-[3em]">
          <MyLeaderboard />
        </div>
      </div>

      {/* 1598 */}
      <div
        className={cn(
          "mt-[3.125em] max-w-[99.875em] mx-auto",
          "flex flex-col gap-[2.0625em]",
        )}
      >
        {items.length === 0 && <Empty />}
        {items.map((item) => {
          return (
            <LeaderboardItem key={item.id} item={item} loading={isFetching} />
          );
        })}
      </div>
      <div className="mt-[5.125em]">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={onPageChange}
          maxPage={maxPage}
        />
      </div>
    </div>
  );
}

export default PlayerLeaderboard;
