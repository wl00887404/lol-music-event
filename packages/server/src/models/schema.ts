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
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema.ts";
import { sql } from "drizzle-orm";

export const match = pgTable("match", {
  id: text("id").notNull().primaryKey(),
  queueId: text("queue_id").notNull(),
  gameStartTime: timestamp("game_start_time").notNull(),
});

export const playerMatchHistory = pgTable(
  "player_match_history",
  {
    puuid: text("puuid").notNull(),
    matchId: text("match_id").notNull(),
    characterId: text("character_id"),
    isWon: boolean("is_won"),
  },
  (table) => [
    primaryKey({ columns: [table.puuid, table.matchId] }),
    index("idx_player_match_history_puuid").on(table.puuid),
  ],
);

export const matchDetail = pgTable("match_detail", {
  id: text("id")
    .notNull()
    .primaryKey()
    .references(() => match.id),
  rawData: jsonb("raw_data").notNull(),
});

export const soloMission = pgTable("solo_mission", {
  userId: text("user_id").notNull().primaryKey(),
  index: integer("index").notNull(),
  phrase: integer("phrase").notNull(),
  args: jsonb("args").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  syncedAt: timestamp("synced_at").notNull().defaultNow(),
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
