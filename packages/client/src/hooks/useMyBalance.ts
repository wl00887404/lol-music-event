import { authClient } from "@/libs/auth-client";
import { useQuery } from "@tanstack/react-query";
import { getMyBalance } from "@/apis";
import { useSyncStore } from "@/components/me/syncStore";

const useMyBalance = () => {
  const { data: session } = authClient.useSession();
  const { syncTimestamp } = useSyncStore();

  const { data, refetch } = useQuery({
    queryKey: ["me", "balance", syncTimestamp],
    queryFn: () => getMyBalance(),
    enabled: Boolean(session?.user),
  });

  return { data, refetch };
};

export default useMyBalance;
