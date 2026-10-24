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
import {
  assertNoNulls,
  type NonNullableFields,
} from "../libs/assertNoNulls.ts";
import { ApiError } from "../middlewares/errorHandler.ts";

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

export default formatNumber;

export const INVITER_SCORE = 5;
export const INVITEE_SCORE = 3;

type SoloMission = {
  evaluate: (
    matchHistory: NonNullableFields<
      InferSelectModel<typeof playerMatchHistoryTable>
    >,
    match: NonNullableFields<InferSelectModel<typeof matchTable>>,
  ) => boolean;
  toJson: () => { name: string; description: string; score: number };
};

const assists = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.assists >= value;
    },
    toJson: () => {
      const dv = formatNumber(value);
      return {
        name: `單場大混戰獲得 ${dv} 次助攻`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得 ${dv} 次助攻`,
        score,
      };
    },
  };
};

const win = (score: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win;
    },
    toJson: () => {
      return {
        name: `贏得 1 場大混戰`,
        description: `在隨機單中：大混戰模式中，贏得 1 場遊戲`,
        score,
      };
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
      const dv = formatNumber(value);
      return {
        name: `單場大混戰對英雄造成傷害達到 ${dv}`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並對英雄造成傷害達到 ${dv}`,
        score,
      };
    },
  };
};

const kills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.kills >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰獲得擊殺 ${value} 次`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得 ${value} 次擊殺`,
        score,
      };
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
      return {
        name: `單場大混戰施放 ${value} 次技能`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並施放 ${value} 次技能`,
        score,
      };
    },
  };
};

const spell123CastsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      const result =
        matchHistory.spell1Casts +
        matchHistory.spell2Casts +
        matchHistory.spell3Casts;

      return matchHistory.win && result >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰施放 ${value} 次非大絕技能並贏得勝利`,
        description: `在單場隨機單中：大混戰模式中，贏得遊戲勝利並施放非大絕技能 ${value} 次`,
        score,
      };
    },
  };
};

const spell4CastsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win && matchHistory.spell4Casts >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰施放 ${value} 次大絕技能並贏得勝利`,
        description: `在單場隨機單中：大混戰模式中，贏得遊戲勝利並施放大絕技能 ${value} 次`,
        score,
      };
    },
  };
};

const gameDuration = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory, match) => {
      return matchHistory.win && match.gameDuration <= value * 60;
    },
    toJson: () => {
      return {
        name: `單場大混戰在 ${value} 分鐘內獲得勝利`,
        description: `在隨機單中：大混戰模式中於 ${value} 分鐘內贏得 1 場遊戲`,
        score,
      };
    },
  };
};

const totalMinionsKilled = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.totalMinionsKilled >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰中獲得擊殺士兵 ${value} 次`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得擊殺士兵 ${value} 次`,
        score,
      };
    },
  };
};

const totalKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory, match) => {
      return matchHistory.win && match.totalKills >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰雙方總擊殺數超過 ${value} 的情況下獲得勝利`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並在雙方總擊殺數超過 ${value} 的情況下贏得 1 場遊戲`,
        score,
      };
    },
  };
};

const snowballsHit = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.snowballsHit >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰使用雪球擊中對手超過 ${value} 次`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並使用雪球（標記）召喚師技能命中敵方英雄超過 ${value} 次`,
        score,
      };
    },
  };
};

const skillshotsHit = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.skillshotsHit >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰使用指向技能命中敵方英雄 ${value} 次`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並使用指向技能命中敵方英雄 ${value} 次`,
        score,
      };
    },
  };
};

const deaths = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.deaths <= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰死亡次數少於或等於 ${value} 次`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並死亡次數少於或等於 ${value} 次`,
        score,
      };
    },
  };
};

const deathsAndWin = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.win && matchHistory.deaths <= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰死亡次數少於或等於 ${value} 次並勝利`,
        description: `在單場隨機單中：大混戰模式中，贏得遊戲勝利並死亡次數少於或等於 ${value} 次`,
        score,
      };
    },
  };
};

const damageDealtToTurrets = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.damageDealtToTurrets >= value;
    },
    toJson: () => {
      const dv = formatNumber(value);
      return {
        name: `單場大混戰對防禦塔造成傷害達到 ${dv}`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並對防禦塔造成傷害達到 ${dv}`,
        score,
      };
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
      const dv = formatNumber(value);
      return {
        name: `單場大混戰對英雄造成物理傷害達到 ${dv}`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並對英雄造成物理傷害達到 ${dv}`,
        score,
      };
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
      const dv = formatNumber(value);
      return {
        name: `單場大混戰對英雄造成魔法傷害達到 ${dv}`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並對英雄造成魔法傷害達到 ${dv}`,
        score,
      };
    },
  };
};

const killParticipation = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.killParticipation * 100 >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰參團率超過 ${value}%`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得（自己的擊殺數 + 助攻數）超過己方隊伍的總擊殺數 ${value}%`,
        score,
      };
    },
  };
};

const doubleKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      const result =
        matchHistory.doubleKills +
        matchHistory.tripleKills +
        matchHistory.quadraKills +
        matchHistory.pentaKills;

      return result >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰獲得 ${value} 次雙殺`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得 ${value} 次雙殺`,
        score,
      };
    },
  };
};

const tripleKills = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      const result =
        matchHistory.tripleKills +
        matchHistory.quadraKills +
        matchHistory.pentaKills;

      return result >= value;
    },
    toJson: () => {
      return {
        name: `單場大混戰獲得 ${value} 次三連殺`,
        description: `在單場隨機單中：大混戰模式中，完成遊戲並獲得 ${value} 次三連殺`,
        score,
      };
    },
  };
};

const winStreak = (score: number, value: number): SoloMission => {
  return {
    evaluate: (matchHistory) => {
      return matchHistory.winStreak >= value;
    },
    toJson: () => {
      return {
        name: `獲得 ${value} 場大混戰連續勝利`,
        description: `在隨機單中：大混戰模式中，連續贏得 ${value} 場遊戲`,
        score,
      };
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
    gameDuration(2, 20), // 單場大混戰在 20 分鐘內獲得勝利
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
    kills(5, 15), // 單場大混戰獲得擊殺 15 次
    spell123CastsAndWin(5, 150), // 單場大混戰使用 150 次非大絕技能並贏得勝利
    spell4CastsAndWin(5, 10), // 單場使用 10 次大絕技能並贏得勝利
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
    // console.log(`${me.riotId} 開始解任務`);
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
    let { index, phase, updatedAt } = state;
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

    // console.log(`${riotId} 有 ${results.length} 筆可使用的對戰紀錄`);
    for (const result of results) {
      try {
        const matchHistory = assertNoNulls(result.player_match_history);
        const match = assertNoNulls(result.match);

        // 贏了 +2，輸了 +1
        if (matchHistory.win) {
          nextScore += 2;
        } else {
          nextScore += 1;
        }

        const isSuccess = soloMissions[index][phase].evaluate(
          matchHistory,
          match,
        );
        if (isSuccess) {
          const { name: missionName, score: missionScore } =
            soloMissions[index][phase].toJson();

          await logService.insert(
            `${me.riotId} 完成任務`,
            `matchId: ${match.id}`,
            `mission: ${missionName}`,
          );

          if (!isInviteCompleted && me.inviterId) {
            isInviteCompleted = true;
            await soloMissionService.processInvite(
              me.inviterId,
              me.id,
              me.riotId!,
            );
          }

          nextScore += missionScore;
          // 成功了就下一個階段
          phase++;
          if (phase === soloMissions[index].length) {
            // 這個任務完成了，重新領任務
            index = (index + 1) % soloMissions.length;
            phase = 0;
          }
        } else {
          // 失敗了就繼續比下一場
        }
      } catch (err) {
        // 應該是不可能有這個錯誤
        console.error(err, result.match.id);
        throw new ApiError(500, {
          code: "DATABASE_OBJECT_ERROR",
          message: "資料庫物件異常，請稍後再試",
        });
      }
    }

    if (score != nextScore) {
      await logService.insert(`${riotId} 積分從 ${score} 加分到 ${nextScore}`);
    }

    const lastMatch = results[results.length - 1];
    await db
      .update(userTable)
      .set({ score: nextScore, isInviteCompleted })
      .where(eq(userTable.id, me.id));
    await db
      .update(soloMissionTable)
      .set({
        index,
        phase,
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
    if (!state) return null;

    const { index, phase, skipChance, syncedAt } = state;

    return {
      missions: soloMissions[index].map((currentPhase, phaseIndex) => {
        const getStatus = () => {
          if (phase === phaseIndex) return "inProgress";
          if (phase > phaseIndex) return "finished";
          return "notFinished";
        };
        return {
          ...currentPhase.toJson(),
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
      return console.error("查無邀請者", inviterId);
    }

    const score = inviter.score || 0;
    const nextScore = score + INVITER_SCORE;

    await logService.insert(
      `${inviter.riotId} 獲得 ${INVITER_SCORE} 分，從 ${score} 加分到 ${nextScore}，藉由 ${inviteeRiotId} 完成首次任務`,
    );

    await db
      .update(userTable)
      .set({ score: nextScore })
      .where(eq(userTable.id, inviterId));
  },
  skip: async (me: InferSelectModel<typeof userTable>) => {
    const state = await db
      .select()
      .from(soloMissionTable)
      .where(eq(soloMissionTable.userId, me.id))
      .limit(1)
      .then(head);
    if (!state) {
      return console.error(me.riotId, "沒有 solo 任務紀錄");
    }
    if (state.skipChance === 0) {
      console.error(me.riotId, "跳過機會已耗盡");
      throw new Error("跳過機會已耗盡");
    }
    let { index, phase } = state;
    await logService.insert(
      `${me.riotId} 使用跳過機會`,
      `mission: ${soloMissions[index][phase].toJson().name}`,
    );
    phase++;
    if (phase === soloMissions[index].length) {
      // 這個任務完成了，重新領任務
      index = (index + 1) % soloMissions.length;
      phase = 0;
    }
    await db
      .update(soloMissionTable)
      .set({ index, phase, skipChance: state.skipChance - 1 })
      .where(eq(soloMissionTable.userId, me.id));
    return true;
  },
  resetSkipChance: async (count = 1) => {
    await db.update(soloMissionTable).set({ skipChance: count });
  },
};
