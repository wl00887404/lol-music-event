import { authClient } from "@/libs/auth-client";
import { Team } from "@/types";

function useTeam() {
  const { data: session } = authClient.useSession();

  if (session) {
    return session.user.team as Team;
  }

  return Team.kda;
}

export default useTeam;
