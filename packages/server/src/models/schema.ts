import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  boolean,
  index,
  jsonb,
  uniqueIndex,
  serial,
  real,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { sql } from "drizzle-orm";

export const match = pgTable("match", {
  id: text("id").notNull().primaryKey(),
  gameStartTime: timestamp("game_start_time"), // 開始時間
  gameDuration: integer("game_duration"), // 遊戲時長
  totalKills: integer("total_kills"), // 全部玩家的擊殺數
});

export const playerMatchHistory = pgTable(
  "player_match_history",
  {
    puuid: text("puuid").notNull(),
    matchId: text("match_id").notNull(),
    kills: integer("kills"),
    deaths: integer("deaths"),
    assists: integer("assists"),
    win: boolean("win"),
    physicalDamageDealtToChampions: integer(
      "physical_damage_dealt_to_champions",
    ), // 對英雄物理傷害
    magicDamageDealtToChampions: integer("magic_damage_dealt_to_champions"), // 對英雄魔法傷害
    trueDamageDealtToChampions: integer("true_damage_dealt_to_champions"), // 對英雄真實傷害
    damageDealtToTurrets: integer("damageDealt_to_turrets"), // 對防禦塔傷害
    physicalDamageDealt: integer("physical_damage_dealt"), // 物理傷害
    magicDamageDealt: integer("magic_damage_dealt"), // 魔法傷害
    trueDamageDealt: integer("true_damage_dealt"), // 真實傷害
    totalDamageTaken: integer("total_damage_taken"), // 承受傷害
    totalDamageShieldedOnTeammates: integer(
      "total_damage_shielded_on_teammates",
    ), // 給予隊友護盾
    totalHealsOnTeammates: integer("total_heals_on_teammates"), // 治療隊友
    championId: integer("champion_id"), // 英雄 Id
    skillshotsHit: integer("skillshots_hit"), // 指向技命中次數
    snowballsHit: integer("snowballs_hit"), // 雪球擊中次數
    totalMinionsKilled: integer("total_minions_killed"), // 吃兵數量
    spell1Casts: integer("spell1_casts"), // Q 的使用次數
    spell2Casts: integer("spell2_casts"), // W 的使用次數
    spell3Casts: integer("spell3_casts"), // E 的使用次數
    spell4Casts: integer("spell4_casts"), // R 的使用次數
    goldEarned: integer("gold_earned"), // 獲得金錢
    timeCCingOthers: integer("time_ccing_others"), // 控場時間
    doubleKills: integer("double_kills"), // 雙殺
    tripleKills: integer("triple_kills"), // 三殺
    quadraKills: integer("quadra_kills"), // 四殺
    pentaKills: integer("penta_kills"), // 五殺
    damagePerMinute: real("damage_per_minute"), // 每分鐘傷害
    killParticipation: real("kill_participation"), // 參團率
    gameEndedInEarlySurrender: boolean("game_ended_in_early_surrender"), // remake 局
    winStreak: integer("win_streak"), // 連勝次數
    isCompleted: boolean("is_completed").default(false).notNull(),
  },
  (table) => [primaryKey({ columns: [table.puuid, table.matchId] })],
);

export const matchDetail = pgTable("match_detail", {
  id: text("id").notNull().primaryKey(),
  rawData: jsonb("raw_data").notNull(),
});

export const soloMission = pgTable("solo_mission", {
  userId: text("user_id").notNull().primaryKey(),
  index: integer("index").notNull().default(0),
  phrase: integer("phrase").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow(), // 上次解任務時間戳
  syncedAt: timestamp("synced_at").notNull().defaultNow(), // 上次要求同步時間戳
  skipChance: integer("skip_chance").notNull().default(1),
});

export const reward = pgTable(
  "reward",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID())
      .notNull(),
    type: text("type").notNull(),
    code: text("code").notNull(),
    claimedAt: timestamp("claimed_at"),
    price: integer("price"),
    claimerId: text("claimer_id").references(() => user.id),
  },
  (table) => [
    uniqueIndex("reward_code_unique_idx").on(table.code),
    index("reward_claimer_id_idx").on(table.claimerId),
    uniqueIndex("reward_type_claimer_unique_idx")
      .on(table.type, table.claimerId)
      .where(sql`${table.claimerId} IS NOT NULL`),
  ],
);

export const log = pgTable("log", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  date: timestamp().notNull().defaultNow(),
});
