import express, { type RequestHandler } from "express";

import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { ApiError } from "../middlewares/errorHandler.ts";
import {
  count,
  eq,
  desc,
  ilike,
  and,
  not,
  isNull,
  sql,
  inArray,
  isNotNull,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { head } from "../libs/lodash.ts";
import { reward as rewardTable } from "../models/schema.ts";
import path from "path";
import { leaderboardService } from "../services/leaderboard.ts";
import { riotService } from "../services/riot.ts";
import { lotteryRewardSettings, rewardService } from "../services/reward.ts";
import { Team } from "../types.ts";

export const staticPath = path.join(import.meta.dirname, "../../../admin/dist");

const URL = "/api/admin";
const DEFAULT_LIMIT = 100 as const;
const MAX_LIMIT = DEFAULT_LIMIT;

const teamNameMap: Record<string, string> = {
  [Team.kda]: "K/DA",
  [Team.heartSteel]: "心鋼之聲 HEARTSTEEL",
  [Team.trueDamage]: "True Damage",
};

const adminUserIds = (process.env.ADMIN_USER_ID || "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => Boolean(id));

export const requireAdmin: RequestHandler = async (req, _res, next) => {
  if (!req.session) {
    throw new ApiError(400, {
      code: "UNAUTHORIZED",
      message: "你的驗證已經過期。請重新登入以繼續",
      path: req.path,
    });
  }

  if (!adminUserIds.includes(req.session.userId)) {
    throw new ApiError(400, {
      code: "UNAUTHORIZED",
      message: "權限不足",
      path: req.path,
    });
  }

  next();
};

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

function parseUserSort(query: any) {
  if (query.sort === "score") {
    return [desc(userTable.score), desc(userTable.createdAt)];
  }

  return [desc(userTable.createdAt)];
}

const adminRouter = express.Router();

adminRouter.use(URL, requireAdmin);

adminRouter.get(`${URL}/users`, async (req, res) => {
  const { offset, limit } = parsePagination(req.query);
  const isCompleted = parseQueryField(req.query, "isCompleted") || "all";
  const team = parseQueryField(req.query, "team") || "all";
  const riotId = parseQueryField(req.query, "riotId") || "";
  const inviterRiotId = parseQueryField(req.query, "inviterRiotId") || "";

  const inviterTable = alias(userTable, "inviter");

  const conditions = [];

  if (isCompleted !== "all") {
    conditions.push(eq(userTable.isCompleted, isCompleted === "true"));
  }

  if (team !== "all") {
    conditions.push(eq(userTable.team, team));
  }

  if (riotId) {
    conditions.push(ilike(userTable.riotId, `%${riotId}%`));
  }

  if (inviterRiotId) {
    conditions.push(ilike(inviterTable.riotId, `%${inviterRiotId}%`));
  }

  const whereClause = conditions.length !== 0 ? and(...conditions) : undefined;
  const orderByClause = parseUserSort(req.query);

  const [users, total] = await Promise.all([
    db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        emailVerified: userTable.emailVerified,
        image: userTable.image,
        createdAt: userTable.createdAt,
        updatedAt: userTable.updatedAt,
        phone: userTable.phone,
        score: userTable.score,
        inviteCode: userTable.inviteCode,
        riotId: userTable.riotId,
        puuid: userTable.puuid,
        isUpdating: userTable.isUpdating,
        isCompleted: userTable.isCompleted,
        inviterId: userTable.inviterId,
        isInviteCompleted: userTable.isInviteCompleted,
        consentVersion: userTable.consentVersion,
        termsAcceptedAt: userTable.termsAcceptedAt,
        privacyAcceptedAt: userTable.privacyAcceptedAt,
        ageConfirmedAt: userTable.ageConfirmedAt,
        inviterRiotId: inviterTable.riotId,
        team: userTable.team,
      })
      .from(userTable)
      .leftJoin(inviterTable, eq(userTable.inviterId, inviterTable.id))
      .where(whereClause)
      .orderBy(...orderByClause)
      .offset(offset)
      .limit(limit),
    db
      .select({ count: count() })
      .from(userTable)
      .leftJoin(inviterTable, eq(userTable.inviterId, inviterTable.id))
      .where(whereClause)
      .then(head),
  ]);

  return res.send({
    data: users.map((user) => {
      return {
        ...user,
        email: user.email.includes("@placeholder.com") ? null : user.email,
        teamName: user.team ? teamNameMap[user.team] : null,
      };
    }),
    total: total.count,
  });
});

adminRouter.get(`${URL}/users/updating-count`, async (req, res) => {
  const result = await db
    .select({ count: count() })
    .from(userTable)
    .where(eq(userTable.isUpdating, true))
    .then(head);

  return res.send({ count: result.count });
});

adminRouter.post(`${URL}/users/:id`, async (req, res) => {
  const id = req.params.id;
  const body = req.body as unknown as {
    email?: string;
    phone?: string;
  };

  if (!body.email || !body.phone || !id) {
    throw new ApiError(400, {
      code: "MISSING_REQUIRED_FIELDS",
      message: "缺少必要資料",
    });
  }

  const me = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, id))
    .then(head);

  if (!me) {
    throw new ApiError(404, {
      code: "USER_NOT_FOUND",
      message: "查無此使用者",
    });
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(body.email)) {
    throw new ApiError(400, {
      code: "INVALID_EMAIL_FORMAT",
      message: "電子信箱格式錯誤",
    });
  }

  const PHONE_REGEX = /^\d{10}$/;
  if (!PHONE_REGEX.test(body.phone)) {
    throw new ApiError(400, {
      code: "INVALID_PHONE_FORMAT",
      message: "手機號碼格式錯誤",
    });
  }

  const hasEmail = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(and(not(eq(userTable.id, me.id)), eq(userTable.email, body.email)))
    .limit(1)
    .then(head);

  if (hasEmail) {
    throw new ApiError(409, {
      code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
      message: "此電子信箱已被註冊",
    });
  }

  const hasPhone = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(and(not(eq(userTable.id, me.id)), eq(userTable.phone, body.phone)))
    .limit(1)
    .then(head);

  if (hasPhone) {
    throw new ApiError(409, {
      code: "USER_ALREADY_EXISTS_USE_ANOTHER_PHONE",
      message: "此手機號碼已被註冊",
    });
  }

  await db
    .update(userTable)
    .set({ email: body.email, phone: body.phone })
    .where(eq(userTable.id, me.id));

  return res.send({ success: true });
});

// adminRouter.get(`${URL}/statistics/score-count`, async (req, res) => {
//   const results = await db
//     .select({ score: userTable.score, count: count() })
//     .from(userTable)
//     .where(eq(userTable.isCompleted, true))
//     .groupBy(userTable.score);

//   return res.send(results);
// });

// adminRouter.get(`${URL}/statistics/user-source`, async (req, res) => {
//   const results = await db
//     .select({
//       createdAt: userTable.createdAt,
//       isCompleted: userTable.isCompleted,
//       inviterId: userTable.inviterId,
//     })
//     .from(userTable);

//   return res.send(results);
// });

adminRouter.post(`${URL}/rewards`, async (req, res) => {
  const { offset, limit } = parsePagination(req.body);
  const rewardKeys = Array.isArray(req.body.rewardKeys)
    ? req.body.rewardKeys
    : [];
  const claimerRiotId = req.body.claimerRiotId || "";

  const conditions = [inArray(rewardTable.key, rewardKeys)];

  if (claimerRiotId) {
    conditions.push(ilike(userTable.riotId, `%${claimerRiotId}%`));
  }

  const whereClause = conditions.length !== 0 ? and(...conditions) : undefined;

  const [rewards, total] = await Promise.all([
    db
      .select({
        id: rewardTable.id,
        key: rewardTable.key,
        claimerRiotId: userTable.riotId,
        claimedAt: rewardTable.claimedAt,
        claimerEmail: userTable.email,
        claimerPhone: userTable.phone,
      })
      .from(rewardTable)
      .innerJoin(userTable, eq(rewardTable.claimerId, userTable.id))
      .where(whereClause)
      .orderBy(desc(rewardTable.claimedAt), desc(rewardTable.id))
      .offset(offset)
      .limit(limit),
    db
      .select({ count: count() })
      .from(rewardTable)
      .innerJoin(userTable, eq(rewardTable.claimerId, userTable.id))
      .where(whereClause)
      .then(head),
  ]);

  return res.send({
    data: rewards,
    total: total.count,
  });
});

adminRouter.get(`${URL}/rewards/stock`, async (_req, res) => {
  const results = await db
    .select({
      key: rewardTable.key,
      claimedCount: count(rewardTable.claimerId), // claimerId IS NOT NULL
      unclaimedCount:
        sql<number>`count(*) - count(${rewardTable.claimerId})`.mapWith(Number), // IS NULL
    })
    .from(rewardTable)
    .groupBy(rewardTable.key);

  return res.send(results);
});

adminRouter.get(`${URL}/rewards/lottery`, async (req, res) => {
  const { offset, limit } = parsePagination(req.query);
  const condition = eq(rewardTable.key, "lottery-ticket");
  console.log({ offset, limit });
  // const condition = inArray(
  //   rewardTable.key,
  //   lotteryRewardSettings.map((rs) => rs.key),
  // );

  const [results, total] = await Promise.all([
    db
      .select({
        key: rewardTable.key,
        claimerRiotId: userTable.riotId,
        claimerEmail: userTable.email,
        claimerPhone: userTable.phone,
        count: count(),
      })
      .from(rewardTable)
      .innerJoin(userTable, eq(rewardTable.claimerId, userTable.id))
      .where(condition)
      .groupBy(userTable.id, rewardTable.key)
      .offset(offset)
      .limit(limit),
    db.select({ count: count() }).from(rewardTable).where(condition).then(head),
  ]);

  return res.send({
    data: results,
    total: total.count,
  });
});

adminRouter.get(`${URL}/db-size`, async (_req, res) => {
  const result = await db.execute(sql`
  SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS total_size,
    pg_size_pretty(pg_relation_size(relid)) AS table_only,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) AS index_size
  FROM
    pg_catalog.pg_statio_user_tables;
`);

  const rows = result.rows.map((row) => {
    return {
      tableName: row.table_name as string,
      totalSize: row.total_size as string,
      tableOnly: row.table_only as string,
      indexSize: row.index_size as string,
    };
  });

  return res.send(rows);
});

adminRouter.post(`${URL}/update-leaderboard`, async (_req, res) => {
  await leaderboardService.updateMaterialView();

  return res.send({ success: true });
});

adminRouter.post(`${URL}/truncate-match-detail`, async (_req, res) => {
  await riotService.truncateMatchDetail();

  return res.send({ success: true });
});

adminRouter.post(`${URL}/reload-stock-map`, async (_req, res) => {
  await rewardService.loadStock();

  return res.send({ success: true });
});

adminRouter.use(
  "/admin",
  (req, res, next) => {
    let message = "";

    if (!req.session) {
      message = "no session";
    } else if (req.session.userId !== process.env.ADMIN_USER_ID) {
      message = "not admin";
    }

    if (!req.session || !adminUserIds.includes(req.session.userId)) {
      return res
        .status(404)
        .send(
          `<h1>404 Not Found</h1><div style="display:none;">${message}</div>`,
        );
    }

    return next();
  },
  express.static(staticPath, { extensions: ["html"] }),
);

export default adminRouter;
