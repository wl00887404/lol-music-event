import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { and, asc, eq, gt, type InferSelectModel } from "drizzle-orm";
import {
  match as matchTable,
  playerMatchHistory as playerMatchHistoryTable,
  soloMission as soloMissionTable,
} from "../models/schema.ts";
import { head } from "../libs/lodash.ts";
import { logService } from "./log.ts";
import { assertNoNulls, NonNullableFields } from "../libs/assertNoNulls.ts";
import { ApiError } from "../middlewares/errorHandler.ts";

export const INVITER_SCORE = 5;
export const INVITEE_SCORE = 3;

type SoloMission = {
  evaluate: (
    matchHistory: NonNullableFields<
      InferSelectModel<typeof playerMatchHistoryTable>
    >,
    match: NonNullableFields<InferSelectModel<typeof matchTable>>,
  ) => boolean;
  toJson: () => { name: string; score: number };
};

const assists = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.assists >= value;
    },
    toJson: () => {
      return { name: `單場大混戰獲得 ${value} 次助攻`, score };
    },
  };
};

const win = (score: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win;
    },
    toJson: () => {
      return { name: `贏得 1 場大混戰`, score };
    },
  };
};

const damageDealtToChampions = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      const result =
        matchHistory.physicalDamageDealtToChampions +
        matchHistory.magicDamageDealtToChampions +
        matchHistory.trueDamageDealtToChampions;

      return result >= value;
    },
    toJson: () => {
      return { name: `單場大混戰對英雄造成傷害達到 ${value}`, score };
    },
  };
};

const kills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.kills >= value;
    },
    toJson: () => {
      return { name: `單場大混戰獲得擊殺 ${value} 次`, score };
    },
  };
};

const spellCasts = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return (
        matchHistory.spell1Casts +
          matchHistory.spell2Casts +
          matchHistory.spell3Casts +
          matchHistory.spell4Casts >=
        value
      );
    },
    toJson: () => {
      return { name: `單場大混戰使用 ${value} 次技能`, score };
    },
  };
};

const spell123CastsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return (
        matchHistory.win &&
        matchHistory.spell1Casts +
          matchHistory.spell2Casts +
          matchHistory.spell3Casts >=
          value
      );
    },
    toJson: () => {
      return { name: `單場大混戰使用 ${value} 次技能`, score };
    },
  };
};

const spell4CastsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win && matchHistory.spell4Casts >= value;
    },
    toJson: () => {
      return { name: `單場大混戰施放 ${value} 次大絕技能並贏得勝利`, score };
    },
  };
};

const gameDuration = (score: number, value: number): SoloMission => {
  return {
    evaluate: (_matchHistory, match) => {
      return match.gameDuration <= value;
    },
    toJson: () => {
      return { name: `單場大混戰在 ${value} 分鐘內獲得勝利`, score };
    },
  };
};

const totalMinionsKilled = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.totalMinionsKilled >= value;
    },
    toJson: () => {
      return { name: `單場大混戰中獲得擊殺士兵 ${value} 次`, score };
    },
  };
};

const totalKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (_matchHistory, match) => {
      return match.totalKills >= value;
    },
    toJson: () => {
      return { name: `單場雙方總擊殺數超過 ${value} 的情況下獲得勝利`, score };
    },
  };
};

const snowballsHit = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.snowballsHit >= value;
    },
    toJson: () => {
      return { name: `單場使用雪球擊中對手超過 ${value} 次`, score };
    },
  };
};

const skillshotsHit = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.skillshotsHit >= value;
    },
    toJson: () => {
      return { name: `單場大混戰使用指向技能命中 ${value} 次`, score };
    },
  };
};

const deaths = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.deaths <= value;
    },
    toJson: () => {
      return { name: `單場大混戰死亡次數少於或等於 ${value} 次`, score };
    },
  };
};

const deathsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win && matchHistory.deaths <= value;
    },
    toJson: () => {
      return { name: `單場大混戰死亡次數少於或等於 ${value} 次並勝利`, score };
    },
  };
};

const damageDealtToTurrets = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.damageDealtToTurrets >= value;
    },
    toJson: () => {
      return { name: `單場大混戰對防禦塔造成傷害達到 ${value}`, score };
    },
  };
};

const physicalDamageDealtToChampions = (
  score: number,
  value: number,
): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.physicalDamageDealtToChampions >= value;
    },
    toJson: () => {
      return { name: `單場大混戰對英雄造成物理傷害達到 ${value}`, score };
    },
  };
};

const magicDamageDealtToChampions = (
  score: number,
  value: number,
): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.magicDamageDealtToChampions >= value;
    },
    toJson: () => {
      return { name: `單場大混戰對英雄造成魔法傷害達到 ${value}`, score };
    },
  };
};

const killParticipation = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.killParticipation * 100 >= value;
    },
    toJson: () => {
      return { name: `單場參團率超過 ${value}%`, score };
    },
  };
};

const doubleKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.doubleKills >= value;
    },
    toJson: () => {
      return { name: `單場大混戰獲得 ${value} 次雙殺`, score };
    },
  };
};

const tripleKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.tripleKills >= value;
    },
    toJson: () => {
      return { name: `單場大混戰獲得 ${value} 次三連殺`, score };
    },
  };
};

const winStreak = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.winStreak >= value;
    },
    toJson: () => {
      return { name: `獲得 ${value} 場大混戰連續勝利`, score };
    },
  };
};

export const soloMissions = [
  [
    assists(2, 10), // 單場大混戰獲得 10 次助攻
    win(2), // 贏得 1 場大混戰
    damageDealtToChampions(2, 20000), // 單場大混戰對英雄造成傷害達到 20000
    kills(2, 5), //單場大混戰獲得擊殺 5 次
    spellCasts(2, 80), // 單場大混戰使用 80 次技能
    gameDuration(2, 20 * 60_1000), // 單場大混戰在 20 分鐘內獲得勝利
    damageDealtToChampions(2, 30000), // 單場大混戰對英雄造成傷害達到 30000
    totalMinionsKilled(2, 30), // 單場大混戰中獲得擊殺士兵 30 次
    totalKills(2, 50), // 單場雙方總擊殺數超過 50 的情況下獲得勝利
    snowballsHit(2, 5), // 單場使用雪球擊中對手超過 5 次
  ],
  [
    skillshotsHit(3, 15), // 單場大混戰使用指向技能命中 15 次或以上
    deaths(3, 10), // 單場大混戰死亡次數少於或等於 10 次
    spellCasts(3, 100), // 單場大混戰使用 100 次技能
    assists(3, 20), // 單場大混戰獲得助攻 20 次
    damageDealtToTurrets(3, 2000), // 單場大混戰對防禦塔造成傷害達到 2000
    skillshotsHit(3, 20), // 單場大混戰中使用指向技能命中 20 次
    kills(3, 10), // 單場大混戰獲得擊殺 10 次
    killParticipation(3, 75), // 單場參團率超過 75%
    doubleKills(3, 1), // 單場大混戰獲得 1 次雙殺
    magicDamageDealtToChampions(3, 25000), // 單場大混戰對英雄造成魔法傷害達到 25000
  ],
  [
    damageDealtToChampions(5, 40000), // 單場大混戰中對英雄造成傷害達到 40000
    assists(5, 30), // 單場大混戰中獲得助攻 30 次
    deathsAndWin(5, 8), // 單場大混戰死亡次數少於或等於 8 次並勝利
    kills(5, 15), // 單場大混戰中獲得擊殺 15 次
    spell123CastsAndWin(5, 150), // 單場大混戰施放 150 次非大絕技能並贏得勝利
    spell4CastsAndWin(5, 10), // 單場施放 10 次大絕技能並贏得勝利
    snowballsHit(5, 10), // 單場使用雪球擊中對手超過 10 次
    physicalDamageDealtToChampions(5, 30000), // 單場大混戰對英雄造成物理傷害達到 30000
    winStreak(5, 2), // 獲得 2 場大混戰連續勝利
    tripleKills(5, 1), // 單場大混戰獲得 1 次三連殺
  ],
];

export const soloMissionService = {
  assign: async (userId: string) => {
    await db.insert(soloMissionTable).values({ userId }).onConflictDoNothing();
  },
  evaluate: async (me: InferSelectModel<typeof userTable>) => {
    console.log(`${me.riotId} 開始解任務`);
    const { puuid, score, riotId } = me;
    if (!puuid) {
      return console.error("沒有 puuid", me.id);
    }
    const state = await db
      .select()
      .from(soloMissionTable)
      .where(eq(soloMissionTable.userId, me.id))
      .limit(1)
      .then(head);
    if (!state) {
      return console.error("沒有 solo 任務紀錄", me.id);
    }

    let isInviteCompleted = me.isInviteCompleted;
    let { index, phrase, updatedAt } = state;
    let nextScore = score || 0;

    const results = await db
      .select()
      .from(playerMatchHistoryTable)
      .innerJoin(matchTable, eq(playerMatchHistoryTable.matchId, matchTable.id))
      .where(
        and(
          eq(playerMatchHistoryTable.puuid, puuid),
          gt(matchTable.gameStartTime, updatedAt),
          eq(playerMatchHistoryTable.isCompleted, true),
          eq(playerMatchHistoryTable.gameEndedInEarlySurrender, false),
        ),
      )
      .orderBy(asc(matchTable.gameStartTime));

    console.log(`${riotId} 有 ${results.length} 筆可使用的對戰紀錄`);
    for (const result of results) {
      try {
        const matchHistory = assertNoNulls(result.player_match_history);
        const match = assertNoNulls(result.match);

        // 贏了 +2，輸了 +1
        if (matchHistory.win) {
          nextScore += 2;
        } else {
          nextScore + 1;
        }

        const isSuccess = soloMissions[index][phrase].evaluate(
          matchHistory,
          match,
        );
        if (isSuccess) {
          if (!isInviteCompleted && me.inviterId) {
            logService.insert(`${riotId} 首次完成任務，幫推薦者加分`, match.id);
            isInviteCompleted = true;
            await soloMissionService.processInvite(
              me.inviterId,
              me.id,
              me.riotId!,
            );
          }

          const { name: missionName, score: missionScore } =
            soloMissions[index][phrase].toJson();
          logService.insert(
            `${me.riotId} 完成任務`,
            `matchId: ${match.id}`,
            `mission: ${missionName}`,
          );
          nextScore += missionScore;
          // 成功了就下一個階段
          phrase++;
          if (phrase === soloMissions[index].length) {
            // 這個任務完成了，重新領任務
            index = (index + 1) % soloMissions.length;
            phrase = 0;
          }
        } else {
          // 失敗了就繼續比下一場
        }
      } catch (err) {
        console.error("");
        throw new ApiError(500, {
          code: "DATABASE_OBJECT_ERROR",
          message: "資料庫物件異常，請稍後再試",
        });
      }
    }

    logService.insert(`${riotId} 積分從 ${score} 加分到 ${nextScore}`);

    const lastMatch = results[results.length - 1];
    await db
      .update(userTable)
      .set({ score: nextScore, isInviteCompleted })
      .where(eq(userTable.id, me.id));
    await db
      .update(soloMissionTable)
      .set({
        index,
        phrase,
        updatedAt: lastMatch?.match.gameStartTime || state.updatedAt,
        syncedAt: new Date(),
      })
      .where(eq(soloMissionTable.userId, me.id));
  },
  toJson: async (me: InferSelectModel<typeof userTable>) => {
    const state = await db
      .select()
      .from(soloMissionTable)
      .where(eq(soloMissionTable.userId, me.id))
      .limit(1)
      .then(head);
    if (!state) return [];
    const { index, phrase, skipChance, syncedAt } = state;

    return {
      missions: soloMissions[index].map((currentPhrase, phraseIndex) => {
        const getStatus = () => {
          if (phrase === phraseIndex) return "inProgress";
          if (phrase > phraseIndex) return "finished";
          return "notFinished";
        };
        return {
          ...currentPhrase.toJson(),
          status: getStatus(),
        };
      }),
      skipChance,
      syncedAt,
    };
  },
  processInvite: async (
    inviterId: string,
    inviteeId: string,
    inviteeRiotId: string,
  ) => {
    if (inviterId === inviteeId) {
      return console.error("異常自我推薦者", inviteeId);
    }
    const inviter = await db
      .select({ riotId: userTable.riotId, score: userTable.score })
      .from(userTable)
      .where(eq(userTable.id, inviterId))
      .limit(1)
      .then(head);
    if (!inviter) {
      return console.log("查無邀請者", inviterId);
    }

    const score = inviter.score || 0;
    const nextScore = score + INVITER_SCORE;

    logService.insert(
      `${inviter.riotId} 藉由 ${inviteeRiotId} 推薦任務加分，從 ${score} 加分到 ${nextScore}`,
    );
    await db
      .update(userTable)
      .set({ score: nextScore })
      .where(eq(userTable.id, inviterId));
  },
  skip: async (me: InferSelectModel<typeof userTable>) => {
    // const state = await db
    //   .select()
    //   .from(soloMissionTable)
    //   .where(eq(soloMissionTable.userId, me.id))
    //   .limit(1)
    //   .then(head);
    // if (!state) {
    //   return console.error(me.riotId, "沒有 solo 任務紀錄");
    // }
    // if (state.skipChance === 0) {
    //   console.error(me.riotId, "跳過機會已耗盡");
    //   throw new Error("跳過機會已耗盡");
    // }
    // let { index, phrase } = state;
    // let args = state.args as any[];
    // logService.insert(
    //   `${me.riotId} 使用跳過機會`,
    //   `mission: ${soloMissions[index][phrase].toJson(args[phrase]).name}`,
    // );
    // phrase++;
    // if (phrase === soloMissions[index].length) {
    //   // 這個任務完成了，重新領任務
    //   index = (index + 1) % soloMissions.length;
    //   phrase = 0;
    //   args = soloMissions[index].map((mission) => mission.assign());
    // }
    // await db
    //   .update(soloMissionTable)
    //   .set({ index, phrase, args, skipChance: state.skipChance - 1 })
    //   .where(eq(soloMissionTable.userId, me.id));
    // return true;
  },
  resetSkipChance: async (count = 1) => {
    // await db.update(soloMissionTable).set({ skipChance: count });
  },
};
