import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getSoloMissions } from "@/apis";
import { useSyncStore } from "@/components/me/syncStore";
import { authClient } from "@/libs/auth-client";

function useSoloMissions() {
  const { syncTimestamp } = useSyncStore();
  const { data: session } = authClient.useSession();
  const { data, refetch, isPending } = useQuery({
    queryKey: ["me", "soloMissions", syncTimestamp],
    queryFn: () => {
      return getSoloMissions();
    },
    placeholderData: keepPreviousData,
    enabled: Boolean(session?.user),
  });

  return { data, refetch, isPending };
}

export default useSoloMissions;
