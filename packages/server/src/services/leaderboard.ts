import { db } from "../db.ts";

// TODO: 新的排行榜機制

const updateMaterialView = async (concurrently?: boolean) => {
  // const mvs = [
  //   playerLeaderboardView,
  //   teamLeaderboardView,
  //   schoolLeaderboardView,
  //   agentLeaderboardView,
  // ];
  // for (const mv of mvs) {
  //   if (!concurrently) {
  //     await db.refreshMaterializedView(mv);
  //   } else {
  //     await db.refreshMaterializedView(mv).concurrently();
  //   }
  // }
};

export const leaderboardService = {
  updateMaterialView,
};
