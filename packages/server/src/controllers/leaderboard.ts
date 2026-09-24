import express from "express";
import { db } from "../db.ts";
import {
  or,
  ilike,
  inArray,
  asc,
  and,
  count,
  isNotNull,
  eq,
} from "drizzle-orm";
import { head } from "../libs/lodash.ts";
import { leaderboardService } from "../services/leaderboard.ts";
import { ApiError } from "../middlewares/errorHandler.ts";

const URL = "/api/leaderboard";
const leaderboardRouter = express.Router();

const MAX_LIMIT = 12 as const;
const DEFAULT_LIMIT = 12 as const;

type HonorRollItem = {
  id: string;
  name: string;
  image: string | null;
  school: string;
  title: string | null;
};

function maskRiotId(riotId: string | null) {
  if (!riotId) return "";

  return riotId.slice(0, 2) + "*******";
}

function parsePagination(query: any) {
  const offset = Number(query.offset) || 0;
  const limit = Math.min(Number(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

  if (!Number.isInteger(offset) || offset < 0) {
    throw new ApiError(400, {
      code: "INVALID_OFFSET",
      message: "offset 參數錯誤",
    });
  }

  return { offset, limit };
}

function parseQueryField(query: any, field: string) {
  if (field in query) {
    return String(query[field]);
  }

  return "";
}

// leaderboardRouter.get(`${URL}/player`, async (req, res) => {
//   const hasSession = Boolean(req.session);
//   const { offset, limit } = parsePagination(req.query);
//   const keyword = parseQueryField(req.query, "keyword");
//   const school = parseQueryField(req.query, "school") || "all";

//   const conditions = [
//     isNotNull(playerLeaderboardView.riotId),
//     isNotNull(playerLeaderboardView.school),
//   ];

//   // if (school !== "all") {
//   //   conditions.push(eq(playerLeaderboardView.school, school));
//   // } else {
//   //   if (schoolArea !== "all") {
//   //     conditions.push(eq(playerLeaderboardView.schoolArea, schoolArea));
//   //   }
//   //   if (schoolType !== "all") {
//   //     conditions.push(eq(playerLeaderboardView.schoolType, schoolType));
//   //   }
//   // }

//   if (keyword) {
//     conditions.push(ilike(playerLeaderboardView.riotId, `%${keyword}%`));
//   }

//   const whereClause = conditions.length !== 0 ? and(...conditions) : undefined;

//   const [data, total] = await Promise.all([
//     db
//       .select({
//         id: playerLeaderboardView.userId,
//         riotId: playerLeaderboardView.riotId,
//         school: playerLeaderboardView.school,
//         score: playerLeaderboardView.score,
//         tier: playerLeaderboardView.tier,
//         image: playerLeaderboardView.image,
//         totalRank: playerLeaderboardView.totalRank,
//         schoolRank: playerLeaderboardView.schoolRank,
//       })
//       .from(playerLeaderboardView)
//       .where(whereClause)
//       .orderBy(
//         asc(playerLeaderboardView.totalRank),
//         asc(playerLeaderboardView.userId),
//       )
//       .offset(offset)
//       .limit(limit),
//     db
//       .select({ count: count() })
//       .from(playerLeaderboardView)
//       .where(whereClause)
//       .then(head),
//   ]);

//   const agentLeaderboards = await db
//     .select()
//     .from(agentLeaderboardView)
//     .where(
//       inArray(
//         agentLeaderboardView.riotId,
//         data.map((player) => player.riotId!),
//       ),
//     );

//   const dataWithTitle = data.map((player) => {
//     const totalRank = Number(player.totalRank);

//     return {
//       ...player,
//       riotId: hasSession ? player.riotId : maskRiotId(player.riotId),
//       image: hasSession ? player.image : null,
//       tier: hasSession ? player.tier || 0 : 0,
//       totalRank,
//       titles: "",
//     };
//   });

//   return res.send({ data: dataWithTitle, total: total.count });
// });

// leaderboardRouter.get(`${URL}/honor-roll/school`, async (req, res) => {
//   const hasSession = Boolean(req.session);
//   const { offset, limit } = parsePagination(req.query);
//   const keyword = parseQueryField(req.query, "keyword");

//   const conditions = [
//     isNotNull(playerLeaderboardView.riotId),
//     isNotNull(playerLeaderboardView.school),
//     eq(playerLeaderboardView.schoolRank, 1),
//   ];
//   if (keyword) {
//     conditions.push(
//       or(
//         ilike(playerLeaderboardView.riotId, `%${keyword}%`),
//         ilike(playerLeaderboardView.school, `%${keyword}%`),
//       )!,
//     );
//   }
//   const whereClause = conditions.length !== 0 ? and(...conditions) : undefined;

//   const [data, total] = await Promise.all([
//     db
//       .select({
//         id: playerLeaderboardView.userId,
//         riotId: playerLeaderboardView.riotId,
//         school: playerLeaderboardView.school,
//         image: playerLeaderboardView.image,
//         schoolRank: playerLeaderboardView.schoolRank,
//       })
//       .from(playerLeaderboardView)
//       .where(whereClause)
//       .orderBy(asc(playerLeaderboardView.userId))
//       .offset(offset)
//       .limit(limit),
//     db
//       .select({ count: count() })
//       .from(playerLeaderboardView)
//       .where(whereClause)
//       .then(head),
//   ]);

//   const dataWithTitle: HonorRollItem[] = data.map((player) => {
//     const schoolRank = Number(player.schoolRank);
//     return {
//       id: player.id,
//       school: player.school!,
//       name: hasSession ? player.riotId! : maskRiotId(player.riotId),
//       image: hasSession ? player.image : null,
//       title: leaderboardService.getSchoolTitle(player.school!, schoolRank),
//     };
//   });

//   return res.send({ data: dataWithTitle, total: total.count });
// });

function hasCommonChar(a: string, b: string): boolean {
  const set = new Set(a);
  for (const ch of b) {
    if (set.has(ch)) return true;
  }
  return false;
}

export default leaderboardRouter;
