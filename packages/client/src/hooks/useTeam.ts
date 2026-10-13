import { authClient } from "@/libs/auth-client";
import type { Team } from "@/types";

function useTeam() {
  const { data: session } = authClient.useSession();

  if (session) {
    return session.user.team as Team;
  }

  return null;
}

export default useTeam;
