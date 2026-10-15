import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getMyLeaderboard } from "@/apis";
import { authClient } from "@/libs/auth-client";

function useMyLeaderboard() {
  const { data: session } = authClient.useSession();
  const enabled = Boolean(session?.user);
  const { data, isPending } = useQuery({
    queryKey: ["me", "leaderboard"],
    queryFn: () => {
      return getMyLeaderboard();
    },
    placeholderData: keepPreviousData,
    enabled,
  });

  return { data, isPending, enabled };
}

export default useMyLeaderboard;
