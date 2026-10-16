import { pgMaterializedView } from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { and, sql, eq, asc, count, isNotNull } from "drizzle-orm";

// 玩家排行 MV
export const playerLeaderboardView = pgMaterializedView(
  "player_leaderboard_view",
).as((qb) => {
  const userScores = qb
    .select({
      userId: user.id,
      riotId: user.riotId,
      team: user.team,
      score: user.score,
      image: user.image,
      totalRank: sql<number>`RANK() OVER (ORDER BY ${user.score} DESC)`
        .mapWith(Number)
        .as("total_rank"),
      // 應該不會用到這個欄位
      teamRank:
        sql<number>`RANK() OVER (PARTITION BY ${user.team} ORDER BY ${user.score} DESC)`
          .mapWith(Number)
          .as("team_rank"),
    })
    .from(user)
    .where(eq(user.isCompleted, true))

    .as("user_scores");

  return qb
    .select()
    .from(userScores)
    .orderBy(asc(userScores.totalRank), asc(userScores.userId));
});

export const teamLeaderboardView = pgMaterializedView(
  "team_leaderboard_view",
).as((qb) => {
  return qb
    .select({
      team: user.team,
      score: sql<number>`coalesce(sum(${user.score}), 0)`
        .mapWith(Number)
        .as("score"),
      memberCount: count().as("member_count"),
    })
    .from(user)
    .where(and(isNotNull(user.team), eq(user.isCompleted, true)))
    .groupBy(user.team);
});
