import express from "express";
import { db } from "../db.ts";
import { ilike, asc, and, count, isNotNull, eq } from "drizzle-orm";
import { head } from "../libs/lodash.ts";
import { leaderboardService } from "../services/leaderboard.ts";
import { ApiError } from "../middlewares/errorHandler.ts";
import {
  playerLeaderboardView,
  teamLeaderboardView,
} from "../models/materialized-view.ts";
import type { PlayerLeaderboardItem, HonorRollItem } from "../types.ts";

const URL = "/api/leaderboard";
const leaderboardRouter = express.Router();

const MAX_LIMIT = 12 as const;
const DEFAULT_LIMIT = 12 as const;

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

leaderboardRouter.get(`${URL}/player`, async (req, res) => {
  const hasSession = Boolean(req.session);
  const { offset, limit } = parsePagination(req.query);
  const keyword = parseQueryField(req.query, "keyword");
  const team = parseQueryField(req.query, "team") || "all";

  const conditions = [
    isNotNull(playerLeaderboardView.riotId),
    isNotNull(playerLeaderboardView.team),
  ];

  if (team !== "all") {
    conditions.push(eq(playerLeaderboardView.team, team));
  }

  if (keyword) {
    conditions.push(ilike(playerLeaderboardView.riotId, `%${keyword}%`));
  }

  const whereClause = conditions.length !== 0 ? and(...conditions) : undefined;

  const [data, total] = await Promise.all([
    db
      .select({
        id: playerLeaderboardView.userId,
        riotId: playerLeaderboardView.riotId,
        team: playerLeaderboardView.team,
        score: playerLeaderboardView.score,
        image: playerLeaderboardView.image,
        totalRank: playerLeaderboardView.totalRank,
        // teamRank: playerLeaderboardView.teamRank,
      })
      .from(playerLeaderboardView)
      .where(whereClause)
      .orderBy(
        asc(playerLeaderboardView.totalRank),
        asc(playerLeaderboardView.userId),
      )
      .offset(offset)
      .limit(limit),
    db
      .select({ count: count() })
      .from(playerLeaderboardView)
      .where(whereClause)
      .then(head),
  ]);

  const dataWithTitle: PlayerLeaderboardItem[] = data.map((player) => {
    return {
      ...player,
      riotId: hasSession ? player.riotId! : maskRiotId(player.riotId),
      image: hasSession ? player.image! : "29",
      score: player.score || 0,
      titles: leaderboardService.getPlayerTitles(player.id),
    };
  });

  return res.send({ data: dataWithTitle, total: total.count });
});

leaderboardRouter.get(`${URL}/team`, async (req, res) => {
  const teams = await db.select().from(teamLeaderboardView);
  const result: Record<string, number> = {};

  teams.forEach((team) => {
    if (!team.team) return;

    result[team.team] = team.score;
  });

  return res.send(result);
});

leaderboardRouter.get(`${URL}/honor-roll`, async (req, res) => {
  const hasSession = Boolean(req.session);

  const data: HonorRollItem[] = leaderboardService.titles.flatMap((title) => {
    return title.users.map((user) => {
      return {
        id: `${title.name}-${user.id}`,
        name: title.name,
        riotId: hasSession ? user.riotId! : maskRiotId(user.riotId),
        image: hasSession ? user.image! : "29",
        description: title.description,
      };
    });
  });

  return res.send(data);
});

export default leaderboardRouter;
