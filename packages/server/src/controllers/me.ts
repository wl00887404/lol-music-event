import express from "express";
import { requireAuth } from "../auth.ts";
import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
// import { playerMatchHistory as playerMatchHistoryTable } from "../models/schema.ts";
import { count, eq, isNotNull, sql, and, not } from "drizzle-orm";
import { INVITEE_SCORE, soloMissionService } from "../services/soloMission.ts";
import { riotService } from "../services/riot.ts";
import { head } from "../libs/lodash.ts";
// import { leaderboardService } from "../services/leaderboard.ts";
import { rewardService } from "../services/reward.ts";
import { ApiError } from "../middlewares/errorHandler.ts";
import { logService } from "../services/log.ts";
import { Team } from "../types.ts";

const URL = "/api/me";

const meRouter = express.Router();

meRouter.use(URL, requireAuth);

meRouter.get(URL, async (req, res) => {
  return res.send(req.user);
});

meRouter.get(`${URL}/solo-missions`, async (req, res) => {
  const result = await soloMissionService.toJson(req.user);
  return res.send(result);
});

meRouter.post(`${URL}/skip-solo-mission`, async (req, res) => {
  try {
    await soloMissionService.skip(req.user);
  } catch (error) {
    throw new ApiError(429, {
      code: "MISSION_SKIP_LIMIT_EXCEEDED",
      message: "跳過任務機會已耗盡",
    });
  }

  return res.send({ success: true });
});

meRouter.post(`${URL}/sync`, async (req, res) => {
  riotService.syncUserData(req.user);

  return res.send({ success: true });
});

meRouter.post(`${URL}/complete-user-data`, async (req, res) => {
  const me = req.user!;

  if (me.isCompleted) {
    throw new ApiError(409, {
      code: "USER_DATA_ALREADY_COMPLETED",
      message: "已完成註冊資料填寫，請勿重複提交",
    });
  }

  const body = req.body as unknown as {
    email?: string;
    team?: string;
    phone?: string;
    inviteCode?: string;
    isTermsAndPrivacyAccepted?: boolean;
    isOver15?: boolean;
    consentVersion?: string;
  };

  const consentVersion =
    typeof body.consentVersion === "string" ? body.consentVersion.trim() : "";
  if (!body.email || !body.team || !body.phone) {
    throw new ApiError(400, {
      code: "MISSING_REQUIRED_FIELDS",
      message: "缺少必要資料",
      body,
    });
  }

  if (!body.isOver15) {
    throw new ApiError(430, {
      code: "TOO_YOUNG",
      message: "請確認您已年滿 15 歲",
    });
  }

  if (!body.isTermsAndPrivacyAccepted) {
    throw new ApiError(430, {
      code: "CONSENT_REQUIRED",
      message: "你必須同意服務條款與隱私政策",
    });
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(body.email)) {
    throw new ApiError(400, {
      code: "INVALID_EMAIL_FORMAT",
      message: "電子信箱格式錯誤",
      email: body.email,
    });
  }

  const PHONE_REGEX = /^\d{10}$/;
  if (!PHONE_REGEX.test(body.phone)) {
    throw new ApiError(400, {
      code: "INVALID_PHONE_FORMAT",
      message: "手機號碼格式錯誤",
      phone: body.phone,
    });
  }

  if (
    body.team !== Team.kda &&
    body.team !== Team.heartSteel &&
    body.team !== Team.trueDamage
  ) {
    throw new ApiError(422, {
      code: "TEAM_NOT_FOUND",
      message: "查無此樂團",
      team: body.team,
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
      email: body.email,
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
      phone: body.phone,
    });
  }

  let score = 0;
  let inviter = null;

  if (body.inviteCode) {
    if (body.inviteCode === me.inviteCode) {
      throw new ApiError(400, {
        code: "CANNOT_USE_OWN_INVITE_CODE",
        message: "不可使用自己的邀請碼",
      });
    }

    inviter = await db
      .select({ id: userTable.id, riotId: userTable.riotId })
      .from(userTable)
      .where(eq(userTable.inviteCode, body.inviteCode))
      .limit(1)
      .then(head);

    if (!inviter) {
      throw new ApiError(422, {
        code: "INVALID_INVITE_CODE",
        message: "邀請碼無效或不存在",
      });
    }

    score += INVITEE_SCORE;
    logService.insert(
      `${inviter.riotId} 邀請了 ${me.riotId} 自己獲得受邀分數 ${score}`,
    );
  }

  await soloMissionService.assign(me.id);

  const now = new Date();
  const updatedRows = await db
    .update(userTable)
    .set({
      email: body.email,
      phone: body.phone,
      score,
      isCompleted: true,
      inviterId: inviter?.id,
      isInviteCompleted: !Boolean(inviter?.id),
      consentVersion,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      ageConfirmedAt: now,
    })
    .where(and(eq(userTable.id, me.id), eq(userTable.isCompleted, false)))
    .returning({ id: userTable.id });

  // 防止 Race Condition
  if (updatedRows.length === 0) {
    throw new ApiError(409, {
      code: "USER_DATA_ALREADY_COMPLETED",
      message: "已完成註冊資料填寫，請勿重複提交",
    });
  }

  return res.send({ success: true });
});

meRouter.get(`${URL}/check-updating`, async (req, res) => {
  const me = req.user!;

  return res.send({ isUpdating: me.isUpdating });
});

// meRouter.get(`${URL}/stats`, async (req, res) => {
//   const me = req.user!;

//   const [stats] = await db
//     .select({
//       totalCount: count(),
//       wonCount: sql<number>`count(*) filter (where ${playerMatchHistoryTable.isWon} = true)`,
//     })
//     .from(playerMatchHistoryTable)
//     .where(eq(playerMatchHistoryTable.puuid, me.puuid!));

//   const characters = await db
//     .select({
//       id: playerMatchHistoryTable.characterId,
//       totalCount: count(),
//       wonCount: sql<number>`count(*) filter (where ${playerMatchHistoryTable.isWon} = true)`,
//     })
//     .from(playerMatchHistoryTable)
//     .where(
//       and(
//         eq(playerMatchHistoryTable.puuid, me.puuid!),
//         isNotNull(playerMatchHistoryTable.characterId),
//       ),
//     )
//     .groupBy(playerMatchHistoryTable.characterId)
//     .orderBy(sql`count(*) desc`)
//     .limit(3);

//   const playerStat = await db
//     .select({
//       count: count(playerLeaderboardView),
//     })
//     .from(playerLeaderboardView)
//     .then(head);

//   const rankStat = await db
//     .select({
//       totalRank: playerLeaderboardView.totalRank,
//     })
//     .from(playerLeaderboardView)
//     .where(eq(playerLeaderboardView.userId, me.id))
//     .then(head);

//   return res.send({
//     totalRank: Number(rankStat?.totalRank || 0),
//     playerCount: playerStat.count,
//     totalCount: stats.totalCount,
//     wonCount: Number(stats.wonCount),
//     characters: characters.map((c) => {
//       return {
//         id: c.id,
//         totalCount: c.totalCount,
//         wonCount: Number(c.wonCount),
//       };
//     }),
//   });
// });

// meRouter.get(`${URL}/leaderboard`, async (req, res) => {
//   const playerLeaderboard = await db
//     .select({
//       id: playerLeaderboardView.userId,
//       riotId: playerLeaderboardView.riotId,
//       school: playerLeaderboardView.school,
//       score: playerLeaderboardView.score,
//       tier: playerLeaderboardView.tier,
//       image: playerLeaderboardView.image,
//       totalRank: playerLeaderboardView.totalRank,
//       schoolRank: playerLeaderboardView.schoolRank,
//     })
//     .from(userTable)
//     .innerJoin(
//       playerLeaderboardView,
//       eq(userTable.id, playerLeaderboardView.userId),
//     )
//     .where(eq(userTable.id, req.session!.userId))
//     .limit(1)
//     .then(head);

//   const teamLeaderboard = await db
//     .select({
//       id: teamLeaderboardView.teamId,
//       name: teamLeaderboardView.teamName,
//       school: teamLeaderboardView.school,
//       score: teamLeaderboardView.totalScore,
//       totalRank: teamLeaderboardView.totalRank,
//       schoolRank: teamLeaderboardView.schoolRank,
//     })
//     .from(userTable)
//     .innerJoin(
//       teamLeaderboardView,
//       eq(userTable.teamId, teamLeaderboardView.teamId),
//     )
//     .where(eq(userTable.id, req.session!.userId))
//     .limit(1)
//     .then(head);

//   const schoolLeaderboard = await db
//     .select({
//       school: schoolLeaderboardView.school,
//       score: schoolLeaderboardView.totalScore,
//       totalRank: schoolLeaderboardView.schoolRank,
//     })
//     .from(userTable)
//     .innerJoin(
//       schoolLeaderboardView,
//       eq(userTable.school, schoolLeaderboardView.school),
//     )
//     .where(eq(userTable.id, req.session!.userId))
//     .limit(1)
//     .then(head);

//   const getPlayer = async () => {
//     if (!playerLeaderboard) return null;

//     const playerSchoolRank = Number(playerLeaderboard.schoolRank);
//     const agentLeaderboards = await db
//       .select()
//       .from(agentLeaderboardView)
//       .where(eq(agentLeaderboardView.riotId, playerLeaderboard.riotId!));

//     return {
//       ...playerLeaderboard,
//       totalRank: Number(playerLeaderboard.totalRank),
//       schoolRank: playerSchoolRank,
//       titles: leaderboardService.getPlayerTitles(
//         playerLeaderboard.school!,
//         playerSchoolRank,
//         playerLeaderboard.riotId!,
//         agentLeaderboards,
//       ),
//     };
//   };

//   const getTeam = () => {
//     if (!teamLeaderboard) return null;

//     const teamSchoolRank = Number(teamLeaderboard.schoolRank);
//     return {
//       ...teamLeaderboard,
//       score: Number(teamLeaderboard.score),
//       totalRank: Number(teamLeaderboard.totalRank),
//       schoolRank: teamSchoolRank,
//       title: leaderboardService.getTeamTitle(
//         teamLeaderboard.school,
//         teamSchoolRank,
//       ),
//     };
//   };

//   const getSchool = () => {
//     if (!schoolLeaderboard) return null;

//     return {
//       ...schoolLeaderboard,
//       score: Number(schoolLeaderboard.score),
//       totalRank: Number(schoolLeaderboard.totalRank),
//     };
//   };

//   return res.send({
//     player: await getPlayer(),
//     team: getTeam(),
//     school: getSchool(),
//   });
// });

meRouter.get(`${URL}/rewards`, async (req, res) => {
  const rewards = await rewardService.toJson(req.session!.userId);

  return res.send(rewards);
});

meRouter.get(`${URL}/invitees`, async (req, res) => {
  const invitees = await db
    .select({ id: userTable.id })
    .from(userTable)
    .where(eq(userTable.inviterId, req.session!.userId));

  return res.send(invitees.map((invitee) => invitee.id));
});

export default meRouter;
