import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRewards } from "@/apis";
import { useSyncStore } from "@/components/me/syncStore";
import { authClient } from "@/libs/auth-client";

function useRewards() {
  const { syncTimestamp } = useSyncStore();
  const { data: session } = authClient.useSession();
  const { data, isPending, refetch } = useQuery({
    queryKey: ["me", "rewards", syncTimestamp],
    queryFn: () => {
      return getRewards();
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(session?.user),
  });

  return { data, isPending, refetch };
}

export default useRewards;
