import "dotenv/config";
import { db } from "../db.ts";
import {
  match as matchTable,
  matchDetail as matchDetailTable,
  playerMatchHistory as playerMatchHistoryTable,
  soloMission,
} from "../models/schema.ts";
import {
  eq,
  desc,
  and,
  isNotNull,
  asc,
  type InferSelectModel,
  sql,
  isNull,
} from "drizzle-orm";
import { user as userTable } from "../models/auth-schema.ts";
import { soloMissionService } from "./soloMission.ts";
import { head, sum } from "../libs/lodash.ts";
import riotGet from "../libs/riotGet.ts";
import axios from "axios";
import { RSO_USER_INFO_URL } from "../const.ts";
import { type Puuid, type MatchDetail } from "../types.ts";
import { add } from "date-fns";

// FIXME: 預設日期要修改
const { START_DATE = "2026-09-01T00:00:00+08:00" } = process.env;

export type fetchUserInfoData = {
  sub: string;
  jti: string;
};

async function fetchUserInfo(accessToken: string) {
  const authorization = `Bearer ${accessToken}`;

  // fetchUserInfo 不能帶 api_key，所以不能用 riotGet
  const { data } = await axios.get<fetchUserInfoData>(RSO_USER_INFO_URL, {
    headers: { Authorization: authorization },
  });

  return data;
}

export type FetchUserData = {
  puuid: Puuid;
  gameName: string;
  tagLine: string;
};

async function fetchMe(accessToken: string) {
  const baseUrl = "https://asia.api.riotgames.com" as const;
  const url = `${baseUrl}/riot/account/v1/accounts/me`;
  const authorization = `Bearer ${accessToken}`;

  // fetchMe 不能帶 api_key，所以不能用 riotGet
  const { data } = await axios.get<FetchUserData>(url, {
    headers: { Authorization: authorization },
  });

  return data;
}

async function fetchMeByRiotId(riotId: string) {
  const spilt = riotId.split("#");
  if (spilt.length !== 2) throw new Error("riot id 錯誤");

  const gameName = encodeURIComponent(spilt[0]);
  const tagLine = encodeURIComponent(spilt[1]);
  const baseUrl = "https://asia.api.riotgames.com" as const;
  const url = `${baseUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`;
  const { data } = await riotGet<FetchUserData>(url);

  return data;
}

async function fetchMeByPuuid(puuid: string) {
  const encodedPuuid = encodeURIComponent(puuid);
  const baseUrl = "https://asia.api.riotgames.com" as const;
  const url = `${baseUrl}/riot/account/v1/accounts/by-puuid/${encodedPuuid}`;
  const { data } = await riotGet<FetchUserData>(url);

  return data;
}

async function fetchMatchList(puuid: Puuid, startTime?: Date) {
  if (!puuid) throw new Error("puuid 錯誤");

  const COUNT = 3 as const;
  const result: string[] = [];

  try {
    while (true) {
      const baseUrl = "https://sea.api.riotgames.com" as const;
      const searchParams = new URLSearchParams();

      searchParams.append("queue", "2400");
      searchParams.append("count", COUNT.toString());
      if (startTime) {
        const startTimeString = String(Math.floor(startTime.getTime() / 1000));
        searchParams.append("startTime", startTimeString);
      }
      searchParams.append("start", result.length.toString());

      const url = `${baseUrl}/lol/match-all-modes/v1/matches/by-puuid/${puuid}/ids?${searchParams}`;

      const { data } = await riotGet<string[]>(url);
      result.push(...data);

      if (data.length < COUNT) break;
    }

    return result;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(
        "fetchMatchlist failed:",
        JSON.stringify({
          code: err.code,
          message: err.message,
          puuid,
        }),
      );
    }
    return [];
  }
}

async function fetchMatchDetail(matchId: string) {
  const baseUrl = "https://sea.api.riotgames.com" as const;
  const url = `${baseUrl}/lol/match-all-modes/v1/matches/${matchId}`;
  const { data } = await riotGet<MatchDetail>(url);

  return data;
}

async function getMatchDetail(matchId: string) {
  const result = await db
    .select()
    .from(matchDetailTable)
    .where(eq(matchDetailTable.id, matchId))
    .limit(1)
    .then(head);

  if (result) {
    return result.rawData as MatchDetail;
  }

  const rawData = await fetchMatchDetail(matchId);

  await db
    .insert(matchDetailTable)
    .values({ id: matchId, rawData })
    .onConflictDoNothing();

  return rawData;
}

async function getUserProfile(puuid: Puuid): Promise<string | null> {
  const latestMatch = await db
    .select({ matchId: playerMatchHistoryTable.matchId })
    .from(playerMatchHistoryTable)
    .innerJoin(matchTable, eq(playerMatchHistoryTable.matchId, matchTable.id))
    .where(eq(playerMatchHistoryTable.puuid, puuid))
    .orderBy(desc(matchTable.gameStartTime))
    .limit(1)
    .then(head);

  const matchDetail = await getMatchDetail(latestMatch.matchId);
  const player = matchDetail.info.participants.find(
    (player) => player.puuid === puuid,
  );

  if (!player) {
    // 應該是不可能有這個錯誤
    console.error("找不到 player", matchDetail.metadata.matchId, puuid);
    return null;
  }

  return player.profileIcon.toString();
}

async function syncPlayerMatchHistory(
  user: InferSelectModel<typeof userTable>,
) {
  if (!user.puuid) return console.error("user 沒有 puuid", user.id);
  const { puuid } = user;

  const latestMatch = await db
    .select({
      gameStartTime: matchTable.gameStartTime,
      gameDuration: matchTable.gameDuration,
    })
    .from(playerMatchHistoryTable)
    .innerJoin(matchTable, eq(playerMatchHistoryTable.matchId, matchTable.id))
    .where(
      and(
        eq(playerMatchHistoryTable.puuid, puuid),
        isNotNull(matchTable.gameStartTime),
        isNotNull(matchTable.gameDuration),
      ),
    )
    .orderBy(desc(matchTable.gameStartTime))
    .limit(1)
    .then(head);

  const getLatestGameEndTime = () => {
    if (!latestMatch) return new Date(START_DATE);

    const gameStartTime = latestMatch?.gameStartTime!;
    const gameDuration = latestMatch?.gameDuration!;
    return add(gameStartTime, { seconds: gameDuration + 2 });
  };

  const history = await fetchMatchList(puuid, getLatestGameEndTime());

  if (history.length === 0) return;

  await db
    .insert(playerMatchHistoryTable)
    .values(
      history.map((matchId) => {
        return { puuid, matchId };
      }),
    )
    .onConflictDoNothing();

  await db
    .insert(matchTable)
    .values(
      history.map((matchId) => {
        return { id: matchId };
      }),
    )
    .onConflictDoNothing();

  const uncompletedMatches = await db
    .select({ matchId: playerMatchHistoryTable.matchId })
    .from(playerMatchHistoryTable)
    .where(eq(playerMatchHistoryTable.isCompleted, false));

  for (const match of uncompletedMatches) {
    const matchDetail = await getMatchDetail(match.matchId);
    const player = matchDetail.info.participants.find(
      (player) => player.puuid === puuid,
    );
    const totalKills = sum(
      matchDetail.info.participants.map((player) => player.kills),
    );

    await db
      .update(matchTable)
      .set({
        gameStartTime: new Date(matchDetail.info.gameStartTimestamp),
        gameDuration: matchDetail.info.gameDuration,
        totalKills,
      })
      .where(eq(matchTable.id, match.matchId));

    if (!player) {
      // 應該是不可能有這個錯誤
      console.error("找不到 player", matchDetail.metadata.matchId, puuid);
      continue;
    }

    if (player.gameEndedInEarlySurrender) {
      await db
        .update(playerMatchHistoryTable)
        .set({
          gameEndedInEarlySurrender: player.gameEndedInEarlySurrender,
          isCompleted: true,
        })
        .where(
          and(
            eq(playerMatchHistoryTable.puuid, puuid),
            eq(playerMatchHistoryTable.matchId, match.matchId),
          ),
        );
    }

    await db
      .update(playerMatchHistoryTable)
      .set({
        kills: player.kills,
        deaths: player.deaths,
        assists: player.assists,
        win: player.win,
        physicalDamageDealtToChampions: player.physicalDamageDealtToChampions,
        magicDamageDealtToChampions: player.magicDamageDealtToChampions,
        trueDamageDealtToChampions: player.trueDamageDealtToChampions,
        damageDealtToTurrets: player.damageDealtToTurrets,
        physicalDamageDealt: player.physicalDamageDealt,
        magicDamageDealt: player.magicDamageDealt,
        trueDamageDealt: player.trueDamageDealt,
        totalDamageTaken: player.totalDamageTaken,
        totalDamageShieldedOnTeammates: player.totalDamageShieldedOnTeammates,
        totalHealsOnTeammates: player.totalHealsOnTeammates,
        championId: player.championId,
        skillshotsHit: player.challenges.skillshotsHit,
        snowballsHit: player.challenges.snowballsHit,
        totalMinionsKilled: player.totalMinionsKilled,
        spell1Casts: player.spell1Casts,
        spell2Casts: player.spell2Casts,
        spell3Casts: player.spell3Casts,
        spell4Casts: player.spell4Casts,
        goldEarned: player.goldEarned,
        timeCCingOthers: player.timeCCingOthers,
        doubleKills: player.doubleKills,
        tripleKills: player.tripleKills,
        quadraKills: player.quadraKills,
        pentaKills: player.pentaKills,
        damagePerMinute: player.challenges.damagePerMinute,
        killParticipation: player.challenges.killParticipation,
        gameEndedInEarlySurrender: player.gameEndedInEarlySurrender,
        isCompleted: true,
      })
      .where(
        and(
          eq(playerMatchHistoryTable.puuid, puuid),
          eq(playerMatchHistoryTable.matchId, match.matchId),
        ),
      );
  }

  const allMatches = await db
    .select({
      matchId: playerMatchHistoryTable.matchId,
      win: playerMatchHistoryTable.win,
      winStreak: playerMatchHistoryTable.winStreak,
    })
    .from(playerMatchHistoryTable)
    .innerJoin(matchTable, eq(playerMatchHistoryTable.matchId, matchTable.id))
    .where(
      and(
        eq(playerMatchHistoryTable.puuid, puuid),
        eq(playerMatchHistoryTable.gameEndedInEarlySurrender, false),
        eq(playerMatchHistoryTable.isCompleted, true),
      ),
    )
    .orderBy(matchTable.gameStartTime);

  let winStreak = 0;
  for (const match of allMatches) {
    if (match.win) {
      winStreak += 1;
    } else {
      winStreak = 0;
    }

    if (match.winStreak === winStreak) continue;

    await db
      .update(playerMatchHistoryTable)
      .set({ winStreak })
      .where(
        and(
          eq(playerMatchHistoryTable.puuid, puuid),
          eq(playerMatchHistoryTable.matchId, match.matchId),
        ),
      );
  }
}

export const lockTimestampMap = new Map<string, number>();

async function syncUserData(user: InferSelectModel<typeof userTable>) {
  if (!user.puuid) return console.error("user 沒有 puuid", user.id);

  // Atomically acquire per-user sync lock
  const lockResult = await db
    .update(userTable)
    .set({ isUpdating: true })
    .where(and(eq(userTable.id, user.id), eq(userTable.isUpdating, false)))
    .returning({ id: userTable.id });

  if (lockResult.length === 0) {
    console.log(`${user.riotId} 正在等待更新完成`);
    return false;
  }

  lockTimestampMap.set(user.id, Date.now());

  await syncPlayerMatchHistory(user);
  await soloMissionService.evaluate(user);

  const image = await getUserProfile(user.puuid);

  await db
    .update(userTable)
    .set({ image, isUpdating: false })
    .where(eq(userTable.id, user.id));

  lockTimestampMap.delete(user.id);
}

async function syncRiotId(user: InferSelectModel<typeof userTable>) {
  if (!user.puuid) {
    return console.error("user 沒有 puuid", user.id);
  }

  const { gameName, tagLine } = await fetchMeByPuuid(user.puuid);
  const nextRiotId = gameName + "#" + tagLine;
  if (user.riotId === nextRiotId) return;

  await db
    .update(userTable)
    .set({ riotId: nextRiotId })
    .where(eq(userTable.id, user.id));

  console.log(user.riotId, " => ", nextRiotId);
}
async function resyncUser(userId: string) {
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1)
    .then(head);

  await db
    .update(userTable)
    .set({ isUpdating: false })
    .where(eq(userTable.id, user.id));

  await syncUserData(user);
}

async function syncAllUser(offset = 0) {
  const limit = 10;
  const users = await db
    .select()
    .from(userTable)
    .where(and(eq(userTable.isCompleted, true), isNotNull(userTable.riotId)))
    .limit(limit)
    .offset(offset)
    .orderBy(asc(userTable.createdAt));

  if (users.length === 0) return;

  for (const user of users) {
    await syncRiotId(user);
    await syncUserData(user);
  }

  // 休息一下再繼續
  setTimeout(() => {
    syncAllUser(offset + limit);
  }, 250);
}

async function truncateMatchDetail() {
  await db.execute(sql`TRUNCATE TABLE match_detail`);
}

// async function completePlayerMatchHistory() {
//   const histories = await db
//     .select()
//     .from(playerMatchHistoryTable)
//     .where(isNull(playerMatchHistoryTable.characterId));

//   console.log(histories.length);
//   if (histories.length == 0) return;

//   for (const history of histories.slice(0, 100)) {
//     await getMatchDetail(history.matchId);
//   }

//   setTimeout(() => {
//     completePlayerMatchHistory();
//   }, 250);
// }

export const riotService = {
  fetchUserInfo,
  fetchMe,
  fetchMeByRiotId,
  fetchMeByPuuid,
  fetchMatchList,
  fetchMatchDetail,
  syncUserData,
  syncAllUser,
  getMatchDetail,
  truncateMatchDetail,
  syncRiotId,
  resyncUser,
  // completePlayerMatchHistory,
};
