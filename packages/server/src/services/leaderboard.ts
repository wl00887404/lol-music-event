import { db } from "../db.ts";
import { user } from "../models/auth-schema.ts";
import { playerLeaderboardView } from "../models/materialized-view.ts";
import {
  and,
  count,
  eq,
  gte,
  inArray,
  isNotNull,
  max,
  sql,
  SQL,
} from "drizzle-orm";
import { playerMatchHistory } from "../models/schema.ts";
import { type Team } from "../types.ts";

const singleGameQuery = (
  columnName:
    | "kills"
    | "totalDamageTaken"
    | "assists"
    | "totalMinionsKilled"
    | "totalHealsOnTeammates"
    | "totalDamageShieldedOnTeammates"
    | "timeCCingOthers"
    | "winStreak"
    | "skillshotsHit"
    | "snowballsHit"
    | "goldEarned"
    | "damagePerMinute"
    | "trueDamageDealt"
    | "magicDamageDealt"
    | "physicalDamageDealt",
) => {
  return async () => {
    const column = playerMatchHistory[columnName];

    const maximum = db
      .select({ value: max(column) })
      .from(playerMatchHistory)
      .innerJoin(user, eq(playerMatchHistory.puuid, user.puuid))
      .where(
        and(
          eq(playerMatchHistory.gameEndedInEarlySurrender, false),
          eq(user.isCompleted, true),
        ),
      );

    const results = await db
      .selectDistinct({ id: user.id, riotId: user.riotId, image: user.image })
      .from(playerMatchHistory)
      .innerJoin(user, eq(playerMatchHistory.puuid, user.puuid))
      .where(
        and(
          eq(column, maximum),
          eq(playerMatchHistory.gameEndedInEarlySurrender, false),
          eq(user.isCompleted, true),
        ),
      );

    return results;
  };
};

const countGamesQuery = (condition: SQL) => {
  return async () => {
    const counts = db.$with("counts").as(
      db
        .select({
          id: user.id,
          riotId: user.riotId,
          image: user.image,
          gameCount: count().as("game_count"),
        })
        .from(playerMatchHistory)
        .innerJoin(user, eq(playerMatchHistory.puuid, user.puuid))
        .where(
          and(
            condition,
            eq(playerMatchHistory.gameEndedInEarlySurrender, false),
            eq(user.isCompleted, true),
          ),
        )
        .groupBy(user.id),
    );

    return db
      .with(counts)
      .select({ id: counts.id, riotId: counts.riotId, image: counts.image })
      .from(counts)
      .where(
        eq(
          counts.gameCount,
          db.select({ value: max(counts.gameCount) }).from(counts),
        ),
      );
  };
};

const topUserQuery = (team: Team) => {
  return async () => {
    const conditions = [eq(user.team, team), eq(user.isCompleted, true)];

    const maximum = db
      .select({ value: max(user.score) })
      .from(user)
      .where(and(...conditions));

    return db
      .select({ id: user.id, riotId: user.riotId, image: user.image })
      .from(user)
      .where(and(...conditions, eq(user.score, maximum)));
  };
};

type LeaderboardUser = {
  id: string;
  riotId: string | null;
  image: string | null;
};

const titleFactory = (
  name: string,
  description: string,
  updater: () => Promise<LeaderboardUser[]>,
) => {
  const users: LeaderboardUser[] = [];

  const update = async () => {
    const nextUserIds = await updater();
    users.splice(0);
    users.push(...nextUserIds);
  };

  return { name, description, users, update };
};

const idTitleMap: Map<string, string[]> = new Map();

const titles = [
  titleFactory("人氣王", "活動期間邀請最多玩家加入挑戰的玩家", async () => {
    const counts = db.$with("counts").as(
      db
        .select({
          inviterId: user.inviterId,
          inviteCount: count().as("invite_count"),
        })
        .from(user)
        .where(and(eq(user.isInviteCompleted, true), isNotNull(user.inviterId)))
        .groupBy(user.inviterId),
    );

    const results = await db
      .with(counts)
      .select({ id: user.id, riotId: user.riotId, image: user.image })
      .from(counts)
      .innerJoin(user, eq(counts.inviterId, user.id))
      .where(
        eq(
          counts.inviteCount,
          db.select({ value: max(counts.inviteCount) }).from(counts),
        ),
      );

    return results;
  }),
  titleFactory(
    "擊殺之王",
    "在單場大混戰中獲得最高的擊殺數的玩家",
    singleGameQuery("kills"),
  ),
  titleFactory(
    "由我來扛",
    "在單場大混戰中獲得最高承受傷害的玩家",
    singleGameQuery("totalDamageTaken"),
  ),
  titleFactory(
    "最強助攻",
    "在單場大混戰中獲得最高的助攻數的玩家",
    singleGameQuery("assists"),
  ),
  titleFactory(
    "殺戮成性",
    "活動期間達成單場擊殺數超過 10 次的場次最高的玩家",
    countGamesQuery(gte(playerMatchHistory.kills, 10)),
  ),
  titleFactory(
    "最佳隊友",
    "活動期間達成單場助攻數超過 25 次的場次最高的玩家",
    countGamesQuery(gte(playerMatchHistory.assists, 25)),
  ),
  titleFactory(
    "貪婪的吃兵高手",
    "活動期間單場擊殺士兵次數最高的玩家",
    singleGameQuery("totalMinionsKilled"),
  ),
  titleFactory(
    "緊急救護車",
    "活動期間單場對隊友治療最高的玩家",
    singleGameQuery("totalHealsOnTeammates"),
  ),
  titleFactory(
    "擋住一切",
    "活動期間單場對隊友護盾提供最高的玩家",
    singleGameQuery("totalDamageShieldedOnTeammates"),
  ),
  titleFactory(
    "不許動",
    "活動期間單場對對手控場時間最高的玩家",
    singleGameQuery("timeCCingOthers"),
  ),
  titleFactory("不敗傳說", "連勝次數最高的玩家", singleGameQuery("winStreak")),
  titleFactory(
    "心鋼之聲後援會會長",
    "心鋼之聲陣營分數最高的玩家",
    topUserQuery("heart-steel"),
  ),
  titleFactory(
    "True Damage 頭號粉絲",
    "True Damage 陣營分數最高的玩家",
    topUserQuery("true-damage"),
  ),
  titleFactory("K/DA 十年老粉", "K/DA 陣營分數最高的玩家", topUserQuery("kda")),
  titleFactory(
    "百發百中",
    "活動期間單場指向技能命中次數最高的玩家",
    singleGameQuery("skillshotsHit"),
  ),
  titleFactory(
    "雪球狙擊手",
    "活動期間使用雪球命中次數最高的玩家",
    singleGameQuery("snowballsHit"),
  ),
  titleFactory(
    "聯盟銀行",
    "活動期間單場獲得金錢最高的玩家",
    singleGameQuery("goldEarned"),
  ),
  titleFactory(
    "輸出拉滿",
    "活動期間單場每分鐘傷害最高的玩家",
    singleGameQuery("damagePerMinute"),
  ),
  titleFactory(
    "滾輪高手",
    // 我覺得 AI 寫的註解比較好：
    //   在單場大混戰中施放 Q、W、E 技能總次數最高的玩家
    "活動期間單場使用非大絕次數最高的玩家 (Q+W+E)",
    async () => {
      const counts = db.$with("counts").as(
        db
          .select({
            id: user.id,
            riotId: user.riotId,
            image: user.image,
            totalCasts:
              sql<number>`coalesce(${playerMatchHistory.spell1Casts}, 0)
                + coalesce(${playerMatchHistory.spell2Casts}, 0)
                + coalesce(${playerMatchHistory.spell3Casts}, 0)`.as(
                "total_casts",
              ),
          })
          .from(playerMatchHistory)
          .innerJoin(user, eq(playerMatchHistory.puuid, user.puuid))
          .where(
            and(
              eq(playerMatchHistory.gameEndedInEarlySurrender, false),
              eq(user.isCompleted, true),
            ),
          ),
      );

      return db
        .with(counts)
        .selectDistinct({
          id: counts.id,
          riotId: counts.riotId,
          image: counts.image,
        })
        .from(counts)
        .where(
          eq(
            counts.totalCasts,
            db.select({ value: max(counts.totalCasts) }).from(counts),
          ),
        );
    },
  ),
  titleFactory(
    "我就是 心鋼之聲",
    "使用心鋼之聲的成員完成大混戰遊戲次數最多的玩家",
    //
    countGamesQuery(
      inArray(playerMatchHistory.championId, [
        81, // 伊澤瑞爾
        141, // 慨影
        523, // 亞菲利歐
        777, // 犽凝
        897, // 卡桑帝
        875, // 賽特
      ]),
    ),
  ),
  titleFactory(
    "我就是 True Damage",
    "使用 True Damage 的成員完成大混戰遊戲次數最多的玩家",
    //
    countGamesQuery(
      inArray(playerMatchHistory.championId, [
        246, // 姬亞娜
        235, // 姍娜
        84, // 阿卡莉
        245, // 艾克
        157, // 犽宿
      ]),
    ),
  ),
  titleFactory(
    "我就是 K/DA",
    "使用 K/DA 的成員完成大混戰遊戲次數最多的玩家",
    //
    countGamesQuery(
      inArray(playerMatchHistory.championId, [
        103, // 阿璃
        84, // 阿卡莉
        28, // 伊芙琳
        145, // 凱莎
      ]),
    ),
  ),
  // FIXME: 要確認是要真傷最高，還是對玩家真傷最高
  titleFactory(
    "真傷達人",
    "活動期間造成單場最高真實傷害最高的玩家",
    singleGameQuery("trueDamageDealt"),
  ),
  // FIXME: 要確認是要魔法傷害最高，還是對玩家魔法傷害最高
  titleFactory(
    "魔力超載",
    "活動期間造成單場最高魔法傷害最高的玩家",
    singleGameQuery("magicDamageDealt"),
  ),
  titleFactory(
    "致命火力",
    "活動期間造成單場最高物理傷害最高的玩家",
    singleGameQuery("physicalDamageDealt"),
  ),
  // {
  //   name: "銀色子彈",
  //   description: "活動期間使用最多次銀色增幅裝置的玩家",
  // },
  // {
  //   name: "金色閃光",
  //   description: "活動期間使用最多次金色增幅裝置的玩家",
  // },
  // {
  //   name: "稜鏡之王",
  //   description: "活動期間使用最多次稜鏡增幅裝置的玩家",
  // },
  // {
  //   name: "命運操盤手",
  //   description: '活動期間使用"質變"增幅裝置的次數最高的玩家',
  // },
  // {
  //   name: "銀色掌控者",
  //   description: "使用銀色增幅裝置並獲得勝利次數最高的玩家",
  // },
  // {
  //   name: "金色掌控者",
  //   description: "使用金色增幅裝置並獲得勝利次數最高的玩家",
  // },
  // {
  //   name: "稜鏡掌控者",
  //   description: "使用稜鏡增幅裝置並獲得勝利次數最高的玩家",
  // },
];

const getPlayerTitles = (userId: string) => {
  return idTitleMap.get(userId) || [];
};

const initTitles = async () => {
  idTitleMap.clear();

  for (const title of titles) {
    await title.update();

    for (const user of title.users) {
      if (!idTitleMap.has(user.id)) {
        idTitleMap.set(user.id, []);
      }

      idTitleMap.get(user.id)!.push(title.name);
    }
  }
};

const updateMaterialView = async (concurrently?: boolean) => {
  const mvs = [playerLeaderboardView];
  for (const mv of mvs) {
    if (!concurrently) {
      await db.refreshMaterializedView(mv);
    } else {
      await db.refreshMaterializedView(mv).concurrently();
    }
  }

  await initTitles();
};

export const leaderboardService = {
  initTitles,
  updateMaterialView,
  titles,
  getPlayerTitles,
};
