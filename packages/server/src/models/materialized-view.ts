import { pgMaterializedView } from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { sql, eq, and, gte, asc } from "drizzle-orm";
import { match, playerMatchHistory } from "./schema.ts";

// // 玩家排行 MV
// export const playerLeaderboardView = pgMaterializedView(
//   "player_leaderboard_view",
// ).as((qb) => {
//   const userScores = qb
//     .select({
//       userId: user.id,
//       riotId: user.riotId,
//       school: user.school,
//       score: user.score,
//       tier: user.tier,
//       image: user.image,
//       totalRank: sql<number>`RANK() OVER (ORDER BY ${user.score} DESC)`.as(
//         "total_rank",
//       ),
//       schoolRank:
//         sql<number>`RANK() OVER (PARTITION BY ${user.school} ORDER BY ${user.score} DESC)`.as(
//           "school_rank",
//         ),
//     })
//     .from(user)
//     .where(eq(user.isCompleted, true))
//     .as("user_scores");

//   return qb
//     .select({
//       userId: userScores.userId,
//       riotId: userScores.riotId,
//       school: userScores.school,
//       score: userScores.score,
//       tier: userScores.tier,
//       image: userScores.image,
//       totalRank: userScores.totalRank,
//       schoolRank: userScores.schoolRank,
//       schoolArea: schoolArea.area,
//       schoolType: schoolArea.type,
//     })
//     .from(userScores)
//     .orderBy(
//       asc(userScores.totalRank),
//       asc(userScores.schoolRank),
//       asc(userScores.userId),
//     )
//     .innerJoin(schoolArea, eq(userScores.school, schoolArea.school));
// });

// // 學校排行 MV
// export const schoolLeaderboardView = pgMaterializedView(
//   "school_leaderboard_view",
// ).as((qb) => {
//   const schoolScores = qb
//     .select({
//       school: user.school,
//       totalScore: sql<number>`SUM(${user.score})`.as("total_score"),
//       playerCount: sql<number>`COUNT(*)`.as("player_count"),
//       schoolRank:
//         sql<number>`RANK() OVER (ORDER BY SUM(${user.score}) DESC)`.as(
//           "school_rank",
//         ),
//     })
//     .from(user)
//     .where(eq(user.isCompleted, true))
//     .groupBy(user.school)
//     .as("school_scores");

//   return qb
//     .select({
//       school: schoolScores.school,
//       totalScore: schoolScores.totalScore,
//       playerCount: schoolScores.playerCount,
//       schoolRank: schoolScores.schoolRank,

//       schoolArea: schoolArea.area,
//       schoolType: schoolArea.type,
//     })
//     .from(schoolScores)
//     .orderBy(asc(schoolScores.schoolRank), asc(schoolScores.school))
//     .innerJoin(schoolArea, eq(schoolScores.school, schoolArea.school));
// });

// // 隊伍排行 MV
// export const teamLeaderboardView = pgMaterializedView(
//   "team_leaderboard_view",
// ).as((qb) => {
//   const teamScores = qb
//     .select({
//       teamId: team.id,
//       teamName: team.name,
//       school: team.school,
//       totalScore: sql<number>`SUM(${user.score})`.as("total_score"),
//       totalRank: sql<number>`RANK() OVER (ORDER BY SUM(${user.score}) DESC)`.as(
//         "total_rank",
//       ),
//       schoolRank:
//         sql<number>`RANK() OVER (PARTITION BY ${team.school} ORDER BY SUM(${user.score}) DESC)`.as(
//           "school_rank",
//         ),
//     })
//     .from(user)
//     .innerJoin(team, eq(user.teamId, team.id))
//     .groupBy(team.id)
//     .as("team_scores");

//   return qb
//     .select({
//       teamId: teamScores.teamId,
//       teamName: teamScores.teamName,
//       school: teamScores.school,
//       totalScore: teamScores.totalScore,
//       totalRank: teamScores.totalRank,
//       schoolRank: teamScores.schoolRank,

//       schoolArea: schoolArea.area,
//       schoolType: schoolArea.type,
//     })
//     .from(teamScores)
//     .orderBy(
//       asc(teamScores.totalRank),
//       asc(teamScores.schoolRank),
//       asc(teamScores.teamName),
//     )
//     .innerJoin(schoolArea, eq(teamScores.school, schoolArea.school));
// });

// /**
//  * 各分區最強角色排行榜（Materialized View）
//  *
//  * 邏輯：
//  * 1. wins_stats：計算每個玩家在每個分區使用各角色的勝場數
//  *    - 只計算玩家「註冊後」的對局
//  *    - 只計算勝場
//  * 2. ranked：在每個分區內，依勝場數對 (puuid, characterId) 排名
//  * 3. 最終只取各分區、各角色，排名第一的紀錄（同分會並列）
//  *
//  * 使用 REFRESH MATERIALIZED VIEW agent_leaderboard_view 更新資料
//  */
// export const agentLeaderboardView = pgMaterializedView(
//   "agent_leaderboard_view",
// ).as((qb) => {
//   const winsStats = qb.$with("wins_stats").as(
//     qb
//       .select({
//         puuid: playerMatchHistory.puuid,
//         characterId: playerMatchHistory.characterId,
//         area: schoolArea.area,
//         wins: sql<number>`count(*)`.as("wins"),
//       })
//       .from(playerMatchHistory)
//       .innerJoin(user, eq(playerMatchHistory.puuid, user.puuid))
//       .innerJoin(match, eq(playerMatchHistory.matchId, match.id))
//       .innerJoin(schoolArea, eq(user.school, schoolArea.school))
//       .where(
//         and(
//           gte(match.gameStartTime, user.createdAt),
//           eq(playerMatchHistory.isWon, true),
//         ),
//       )
//       .groupBy(
//         playerMatchHistory.puuid,
//         playerMatchHistory.characterId,
//         schoolArea.area,
//       ),
//   );

//   const ranked = qb.$with("ranked").as(
//     qb
//       .with(winsStats)
//       .select({
//         puuid: winsStats.puuid,
//         characterId: winsStats.characterId,
//         area: winsStats.area,
//         wins: winsStats.wins,
//         rank: sql<number>`rank() over (partition by ${winsStats.area}, ${winsStats.characterId} order by ${winsStats.wins} desc)`.as(
//           "rank",
//         ),
//       })
//       .from(winsStats),
//   );

//   return qb
//     .with(winsStats, ranked)
//     .select({
//       riotId: user.riotId,
//       image: user.image,
//       school: user.school,
//       characterId: ranked.characterId,
//       area: ranked.area,
//       wins: ranked.wins,
//     })
//     .from(ranked)
//     .innerJoin(user, eq(user.puuid, ranked.puuid))
//     .where(eq(ranked.rank, 1));
// });
