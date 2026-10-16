import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyStats } from "@/apis";
import { useSyncStore } from "@/components/me/syncStore";
// import floor from "@/libs/floor";
import { authClient } from "@/libs/auth-client";

const getScorePr = (totalRank = 0, playerCount = 0) => {
  if (totalRank === 0 || playerCount === 0) return 0;

  return Math.ceil(((playerCount - totalRank) / playerCount) * 100);
};

// const getWinRate = (winCount = 0, totalCount = 0) => {
//   if (totalCount === 0) return 0;

//   return floor((winCount / totalCount) * 100, 1);
// };

const useMyStats = () => {
  const { data: session } = authClient.useSession();
  const { syncTimestamp } = useSyncStore();
  const { data } = useQuery({
    queryKey: ["me", "stats", syncTimestamp],
    queryFn: () => {
      return getMyStats();
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(session?.user),
  });

  const scorePr = getScorePr(data?.totalRank, data?.playerCount);
  const totalCount = data?.totalCount || 0;
  const winCount = data?.winCount || 0;
  const averageKda = data?.averageKda || 0;

  return {
    scorePr,
    averageKda,
    winCount,
    totalCount,
  };
};

export default useMyStats;
