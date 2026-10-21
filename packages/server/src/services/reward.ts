import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { reward as rewardTable } from "../models/schema.ts";
import { and, count, eq, gt, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import { head } from "../libs/lodash.ts";
import { randomInt } from "node:crypto";
import { ApiError } from "../middlewares/errorHandler.ts";
import { tz } from "@date-fns/tz";
import { startOfDay, addDays, getDay } from "date-fns";

type ClaimedReward = { id: string; key: string; name: string };
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type RewardSetting = {
  key: string;
  name: string;
  price: number;
  limit: number; // 玩家兌換上限

  // 每日抽獎的屬性
  dailyLimit: number; // 每日兌換上限
  normalChance: number;
  saturdayChance: number;
};

const NoPrizeCode = {
  reachDailyLimit: "CLAIM_COUNT_REACH_DAILY_LIMIT",
  outOfStock: "REWARD_OUT_OF_STOCK",
} as const;
const NO_PRIZE_CODES: string[] = Object.values(NoPrizeCode);

const TAIPEI = tz("Asia/Taipei");

export function getTodayRange(now: Date = new Date()) {
  const start = startOfDay(now, { in: TAIPEI });
  const end = addDays(start, 1, { in: TAIPEI });
  return { start: new Date(start.getTime()), end: new Date(end.getTime()) };
}

export const mkPaidRs = (
  key: string,
  name: string,
  price: number,
  limit: number,
) => {
  const rs: RewardSetting = {
    key,
    name,
    limit,
    price,
    dailyLimit: Infinity,
    normalChance: 0,
    saturdayChance: 0,
  };

  return rs;
};

export const mkFreeRs = (
  key: string,
  name: string,
  dailyLimit: number,
  normalChance: number,
  saturdayChance: number,
) => {
  const rs: RewardSetting = {
    key,
    name,
    dailyLimit,
    normalChance,
    saturdayChance,
    limit: Infinity,
    price: 0,
  };

  return rs;
};

const paidRewardSettings: RewardSetting[] = [
  mkPaidRs("paid-box", "海克斯科技鑰匙 & 寶箱", 30, 2),
  mkPaidRs("paid-ball", "世界大賽晶球", 125, 1),
  mkPaidRs("ezreal-skin-2023", "2023 心鋼之聲 伊澤瑞爾 造型", 240, 1),
  mkPaidRs("yone-skin-2023", "2023 心鋼之聲 犽凝 造型", 240, 1),
  mkPaidRs("ksante-skin-2023", "2023 心鋼之聲 卡桑帝 造型", 240, 1),
  mkPaidRs("sett-skin-2023", "2023 心鋼之聲 賽特 造型", 240, 1),
  mkPaidRs("aphelios-skin-2023", "2023 心鋼之聲 亞菲利歐 造型", 240, 1),
  mkPaidRs("ahri-skin-2018", "2018 K/DA 阿璃 造型", 240, 1),
  mkPaidRs("akali-skin-2018", "2018 K/DA 阿卡莉 造型", 240, 1),
  mkPaidRs("evelynn-skin-2018", "2018 K/DA 伊芙琳 造型", 240, 1),
  mkPaidRs("kaisa-skin-2018", "2018 K/DA 凱莎 造型", 240, 1),
  mkPaidRs("yasuo-skin-2019", "2019 True Damage 犽宿 造型", 240, 1),
  mkPaidRs("senna-skin-2019", "2019 True Damage 姍娜 造型", 240, 1),
  mkPaidRs("akali-skin-2019", "2019 True Damage 阿卡莉 造型", 240, 1),
  mkPaidRs("qiyana-skin-2019", "2019 True Damage 姬亞娜 造型", 240, 1),
  mkPaidRs("paid-my-card-150", "MyCard 150 點（英雄聯盟專用點數）", 150, 1),
  mkPaidRs("paid-my-card-300", "MyCard 300 點（英雄聯盟專用點數）", 300, 1),
  mkPaidRs("paid-idol-box", "大混戰音樂季 典藏箱", 1000, 1),
  mkPaidRs("paid-idol-card", "限量偶像卡牌包", 250, 2),
  mkPaidRs("heart-steel-poster", "心鋼之聲 海報掛軸", 350, 1),
  mkPaidRs("true-damage-poster", "True Damage 海報掛軸", 350, 1),
  mkPaidRs("kda-poster", "K/DA 海報掛軸", 350, 1),
  mkPaidRs("true-damage-vinyl", "True Damage 黑膠唱片", 800, 1),
  mkPaidRs("heart-steel-usb", "心鋼之聲 滑板造型 USB", 1000, 1),
  mkPaidRs("worlds-2026-collector-box", "2026 世界大賽 典藏版禮盒", 2500, 1),
  mkPaidRs("dj-sona-figure", "DJ 索娜 公仔", 1000, 1),
  mkPaidRs("teemo-hat", "提摩帽", 500, 1),
  mkPaidRs("tibbers-plush", "泰貝爾 娃娃", 800, 1),
  mkPaidRs("tibbers-blind-box", "泰貝爾吊飾 盲盒", 400, 1),
  mkPaidRs(
    "caps-hall-of-legends-bundle",
    "傳奇殿堂 Caps 帽子 + 滑鼠墊",
    450,
    1,
  ),
  mkPaidRs("lottery-ticket", "抽獎券", 20, Infinity),
  mkPaidRs("classic-mode-bundle", "經典模式綜合禮包", 300, 1),
];

const freeRewardSettings: RewardSetting[] = [
  mkFreeRs("free-box", "海克斯科技鑰匙 & 寶箱", 100, 1_000_000, 1_000_000),
  mkFreeRs("free-ball", "世界大賽晶球", 40, 400_000, 400_000),
  mkFreeRs(
    "free-my-card-150",
    "MyCard 150 點（英雄聯盟專用點數）",
    1,
    0,
    6_667,
  ),
  mkFreeRs(
    "free-my-card-300",
    "MyCard 300 點（英雄聯盟專用點數）",
    1,
    0,
    6_667,
  ),
  mkFreeRs("free-idol-box", "大混戰音樂季 典藏箱", 1, 0, 6_667),
  mkFreeRs("free-idol-card", "限量偶像卡牌包", 1, 8_571, 0),
];

export const claimRewardInTx = async (
  tx: Tx,
  userId: string,
  targetReward: RewardSetting,
): Promise<ClaimedReward> => {
  const { start, end } = getTodayRange();

  // 1. 鎖住該玩家：同一玩家的請求序列化（保護「點數」與「個人上限」）
  const me = await tx
    .select({ score: userTable.score })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .for("update")
    .then(head);

  if (!me) {
    throw new ApiError(404, {
      code: "USER_NOT_FOUND",
      message: "查無此使用者",
    });
  }

  // 2. 鎖住該獎勵：所有玩家的請求序列化（保護「每日上限」）
  if (Number.isFinite(targetReward.dailyLimit)) {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtext(${"claim-reward:" + targetReward.key}))`,
    );

    const { count: todayCount } = await tx
      .select({ count: count() })
      .from(rewardTable)
      .where(
        and(
          eq(rewardTable.key, targetReward.key),
          gte(rewardTable.claimedAt, start),
          lt(rewardTable.claimedAt, end),
        ),
      )
      .then((rows) => rows[0]);

    if (todayCount >= targetReward.dailyLimit) {
      throw new ApiError(403, {
        code: NoPrizeCode.reachDailyLimit,
        message: "兌換數量已達當日上限",
      });
    }
  }

  // 3. 個人點數與兌換上限
  const myRewards = await tx
    .select({ key: rewardTable.key, price: rewardTable.price })
    .from(rewardTable)
    .where(eq(rewardTable.claimerId, userId));

  if (targetReward.price > 0) {
    const spentScore = myRewards.reduce((a, r) => a + r.price, 0);
    if ((me.score || 0) < spentScore + targetReward.price) {
      throw new ApiError(403, {
        code: "SCORE_NOT_ENOUGH",
        message: "點數不足",
      });
    }
  }

  const claimedCount = myRewards.filter(
    (r) => r.key === targetReward.key,
  ).length;
  if (claimedCount >= targetReward.limit) {
    throw new ApiError(403, {
      code: "CLAIM_COUNT_REACH_USER_LIMIT",
      message: "兌換數量已達使用者上限",
    });
  }

  // 4. 原子地搶一件庫存
  const candidate = tx
    .select({ id: rewardTable.id })
    .from(rewardTable)
    .where(
      and(isNull(rewardTable.claimerId), eq(rewardTable.key, targetReward.key)),
    )
    .limit(1)
    .for("update", { skipLocked: true });

  const [claimed] = await tx
    .update(rewardTable)
    .set({
      claimerId: userId,
      claimedAt: new Date(),
      price: targetReward.price,
    })
    .where(
      and(inArray(rewardTable.id, candidate), isNull(rewardTable.claimerId)),
    )
    .returning({ id: rewardTable.id });

  if (!claimed) {
    throw new ApiError(409, {
      code: NoPrizeCode.outOfStock,
      message: "領取失敗，該獎勵已兌換完畢",
    });
  }

  return { id: claimed.id, key: targetReward.key, name: targetReward.name };
};

const claimPaidReward = async (
  userId: string,
  targetKey: string,
  targetPrice: number,
) => {
  const targetReward = paidRewardSettings.find((rs) => rs.key === targetKey);
  if (!targetReward) {
    throw new ApiError(404, {
      code: "REWARD_NOT_FOUND",
      message: "查無此獎勵",
    });
  }

  if (targetReward.price !== targetPrice) {
    throw new ApiError(400, {
      code: "PRICE_NOT_MATCH",
      message: "獎勵價格不符，請重新整理畫面",
    });
  }

  return db.transaction((tx) => claimRewardInTx(tx, userId, targetReward));
};

const MAX_DICE = 100_000_000;

const randomFreeReward = () => {
  const isSaturday = getDay(new Date(), { in: TAIPEI }) === 6;

  let dice = randomInt(1, MAX_DICE + 1); // 1 ~ MAX_DICE，上界 exclusive

  for (const rs of freeRewardSettings) {
    dice -= isSaturday ? rs.saturdayChance : rs.normalChance;
    if (dice <= 0) return rs;
  }

  return null;
};

type FreeRewardResult =
  | { won: false; chancesLeft: number }
  | { won: true; chancesLeft: number; reward: ClaimedReward };

const claimFreeReward = async (
  userId: string,
  // 測試用：undefined = 正常隨機抽；null = 強制銘謝惠顧；RewardSetting = 強制抽中該獎
  pickReward?: RewardSetting | null,
): Promise<FreeRewardResult> => {
  return db.transaction(async (tx) => {
    // 1. 扣一次抽獎次數：單語句原子操作，WHERE 保證不會扣成負數
    const [spent] = await tx
      .update(userTable)
      .set({ freeDrawChances: sql`${userTable.freeDrawChances} - 1` })
      .where(and(eq(userTable.id, userId), gt(userTable.freeDrawChances, 0)))
      .returning({ chancesLeft: userTable.freeDrawChances });

    if (!spent) {
      throw new ApiError(403, {
        code: "DRAW_CHANCE_NOT_ENOUGH",
        message: "抽獎次數不足",
      });
    }

    const chancesLeft = spent.chancesLeft || 0;
    // 2. 擲骰
    const targetReward =
      pickReward === undefined ? randomFreeReward() : pickReward;
    if (targetReward === null) {
      return { won: false, chancesLeft, reward: null }; // 銘謝惠顧
    }

    // 3. 領獎：放在 save point 內，領獎失敗只會回滾這一段，不會連帶回滾步驟 1 的扣次數
    try {
      const reward = await tx.transaction((sp) => {
        return claimRewardInTx(sp, userId, targetReward);
      });
      return { won: true, reward, chancesLeft };
    } catch (err) {
      if (err instanceof ApiError && NO_PRIZE_CODES.includes(err.body?.code)) {
        return { won: false, reward: null, chancesLeft }; // 抽到但今日發完 / 沒庫存
      }
      throw err; // 非預期錯誤：整個 transaction 回滾，次數會退回
    }
  });
};

const validRewardSettings = () => {
  const keySet = new Set<string>();

  for (const { key } of [...paidRewardSettings, ...freeRewardSettings]) {
    if (keySet.has(key)) {
      throw new Error(`${key} 衝突`);
    } else {
      keySet.add(key);
    }
  }

  for (const key of ["normalChance", "saturdayChance"] as const) {
    const sum = freeRewardSettings.reduce((s, r) => s + r[key], 0);
    if (sum > MAX_DICE) {
      throw new Error(`${key} 總和超過 MAX_DICE`);
    }
  }
};

export const rewardService = {
  claimPaidReward,
  claimFreeReward,
  validRewardSettings,
  resetFreeDrawChance: async (count = 1) => {
    await db.update(userTable).set({ freeDrawChances: count });
  },
};
