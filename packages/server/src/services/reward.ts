import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { reward as rewardTable } from "../models/schema.ts";
import {
  and,
  count,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  sql,
  desc,
} from "drizzle-orm";
import { head } from "../libs/lodash.ts";
import { randomInt } from "node:crypto";
import { ApiError } from "../middlewares/errorHandler.ts";
import { tz } from "@date-fns/tz";
import { startOfDay, addDays, getDay } from "date-fns";
import paidRewards from "../data/paidRewards.ts";
import { logService } from "./log.ts";

export type RewardSetting = {
  key: string;
  name: string;
  price: number;
  limit: number; // 玩家兌換上限
  description: string;
  isMerch: boolean; // 實體商品
  unlimitedSupply: boolean; // 無限兌換

  // 每日抽獎的屬性
  dailyLimit: number; // 每日兌換上限
  weekdayChance: number;
  weekendChance: number;
};

type ClaimedReward = {
  id: string;
  code: string;
  claimedAt: Date | null;
  key: string;
};
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

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
  description: string,
  price: number,
  limit: number,
  isMerch: boolean,
  unlimitedSupply: boolean,
) => {
  const rs: RewardSetting = {
    key,
    name,
    description,
    limit,
    price,
    dailyLimit: Infinity,
    weekdayChance: 0,
    weekendChance: 0,
    isMerch,
    unlimitedSupply,
  };

  return rs;
};

export const mkFreeRs = (
  key: string,
  name: string,
  description: string,
  dailyLimit: number,
  weekdayChance: number,
  weekendChance: number,
  isMerch: boolean,
  unlimitedSupply: boolean,
) => {
  const rs: RewardSetting = {
    key,
    name,
    description,
    dailyLimit,
    weekdayChance,
    weekendChance,
    limit: Infinity,
    price: 0,
    isMerch,
    unlimitedSupply,
  };

  return rs;
};

export const paidRewardSettings: RewardSetting[] = paidRewards.map((pr) => {
  return mkPaidRs(
    pr.key,
    pr.name,
    pr.description,
    pr.price || 99999,
    pr.unlimitedSupply ? Infinity : pr.limit,
    pr.isMerch,
    pr.unlimitedSupply,
  );
});

export const freeRewardSettings = [
  {
    from: "paid-box",
    to: "free-box",
    dailyLimit: 1000,
    weekdayChance: 10_000_000,
    weekendChance: 10_000_000,
  },
  {
    from: "paid-ball",
    to: "free-ball",
    dailyLimit: 40,
    weekdayChance: 400_000,
    weekendChance: 400_000,
  },
  {
    from: "paid-my-card-150",
    to: "free-my-card-150",
    dailyLimit: 1,
    weekdayChance: 0,
    weekendChance: 6_667,
  },
  {
    from: "paid-my-card-300",
    to: "free-my-card-300",
    dailyLimit: 1,
    weekdayChance: 0,
    weekendChance: 6_667,
  },
  {
    from: "paid-idol-box",
    to: "free-idol-box",
    dailyLimit: 1,
    weekdayChance: 0,
    weekendChance: 6_667,
  },
  {
    from: "paid-idol-card",
    to: "free-idol-card",
    dailyLimit: 1,
    weekdayChance: 8_571,
    weekendChance: 0,
  },
].map((s) => {
  const origin = paidRewards.find((pr) => pr.key === s.from);
  if (!origin) {
    throw new Error("抽獎商品缺漏");
  }

  return mkFreeRs(
    s.to,
    origin.name,
    origin.description,
    s.dailyLimit,
    s.weekdayChance,
    s.weekendChance,
    origin.isMerch,
    origin.unlimitedSupply,
  );
});

export const lotteryRewardSettings = [
  ...freeRewardSettings,
  ...paidRewardSettings,
].filter((rs) => {
  return rs.unlimitedSupply;
});

const stockMap: Map<string, number> = new Map();

const loadStock = async () => {
  const results = await db
    .select({ key: rewardTable.key, count: count() })
    .from(rewardTable)
    .where(isNull(rewardTable.claimerId))
    .groupBy(rewardTable.key);

  const allSettings = [...paidRewardSettings, ...freeRewardSettings];

  for (const s of allSettings) {
    if (s.unlimitedSupply) {
      stockMap.set(s.key, Infinity);
    } else {
      const count = results.find((r) => r.key === s.key)?.count || 0;
      stockMap.set(s.key, count);
    }
  }
};

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
    const spentScore = myRewards.reduce((a, r) => a + (r.price || 0), 0);
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

  const doClaim = async () => {
    // 4. 無限購買商品，插入一筆購買紀錄
    if (targetReward.unlimitedSupply) {
      const id = crypto.randomUUID();
      const [claimed] = await tx
        .insert(rewardTable)
        .values({
          id,
          key: targetReward.key,
          code: `${targetReward.key}-${id}`,
          claimerId: userId,
          claimedAt: new Date(),
          price: targetReward.price,
        })
        .returning({
          id: rewardTable.id,
          code: rewardTable.code,
          claimedAt: rewardTable.claimedAt,
        });

      return claimed;
    } else {
      // 4. 原子地搶一件庫存
      const candidate = tx
        .select({ id: rewardTable.id })
        .from(rewardTable)
        .where(
          and(
            isNull(rewardTable.claimerId),
            eq(rewardTable.key, targetReward.key),
          ),
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
          and(
            inArray(rewardTable.id, candidate),
            isNull(rewardTable.claimerId),
          ),
        )
        .returning({
          id: rewardTable.id,
          code: rewardTable.code,
          claimedAt: rewardTable.claimedAt,
        });

      return claimed;
    }
  };

  const claimed = await doClaim();

  if (!claimed) {
    throw new ApiError(409, {
      code: NoPrizeCode.outOfStock,
      message: "領取失敗，該獎勵已兌換完畢",
    });
  }

  const stockCount = stockMap.get(targetReward.key) || 1;
  stockMap.set(targetReward.key, stockCount - 1);

  return {
    id: claimed.id,
    code: claimed.code,
    claimedAt: claimed.claimedAt,
    key: targetReward.key,
  };
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
  const day = getDay(new Date(), { in: TAIPEI });
  const isWeekend = day === 6 || day === 0;

  let dice = randomInt(1, MAX_DICE + 1); // 1 ~ MAX_DICE，上界 exclusive

  for (const rs of freeRewardSettings) {
    dice -= isWeekend ? rs.weekendChance : rs.weekdayChance;
    if (dice <= 0) return rs;
  }

  return null;
};

type FreeRewardResult = {
  win: boolean;
  chancesLeft: number;
  reward: ClaimedReward | null;
};

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
      return { win: false, chancesLeft, reward: null }; // 銘謝惠顧
    }

    // 3. 領獎：放在 save point 內，領獎失敗只會回滾這一段，不會連帶回滾步驟 1 的扣次數
    try {
      const reward = await tx.transaction((sp) => {
        return claimRewardInTx(sp, userId, targetReward);
      });
      return { win: true, reward, chancesLeft };
    } catch (err) {
      if (err instanceof ApiError && NO_PRIZE_CODES.includes(err.body?.code)) {
        return { win: false, reward: null, chancesLeft }; // 抽到但今日發完 / 沒庫存
      }
      throw err; // 非預期錯誤：整個 transaction 回滾，次數會退回
    }
  });
};

const rewardSettingMap: Map<string, RewardSetting> = new Map();

const validRewardSettings = () => {
  // 付費商品：非無限供應者必須有明確的個人上限（非負整數）
  for (const rs of paidRewardSettings) {
    if (!rs.unlimitedSupply && !(Number.isInteger(rs.limit) && rs.limit >= 0)) {
      throw new Error(`${rs.key} 的 limit 必須是非負整數`);
    }
  }

  const rsList = [...paidRewardSettings, ...freeRewardSettings];

  for (const rs of rsList) {
    if (rewardSettingMap.has(rs.key)) {
      throw new Error(`${rs.key} 衝突`);
    } else {
      rewardSettingMap.set(rs.key, rs);
    }
  }

  for (const key of ["weekdayChance", "weekendChance"] as const) {
    const sum = freeRewardSettings.reduce((s, r) => s + r[key], 0);
    if (sum > MAX_DICE) {
      throw new Error(`${key} 總和超過 MAX_DICE`);
    }
  }
};

validRewardSettings();

const getRewardSetting = (key: string) => {
  const setting = rewardService.rewardSettingMap.get(key);

  if (setting) return setting;

  const unknownSetting: RewardSetting = {
    key: key,
    name: "unknown reward",
    description: "",
    price: 65535,
    limit: 0,
    isMerch: false,
    dailyLimit: 0,
    weekdayChance: 0,
    weekendChance: 0,
    unlimitedSupply: false,
  };

  return unknownSetting;
};

const getMyRewards = async (userId: string, type: "free" | "paid") => {
  const settings = type === "free" ? freeRewardSettings : paidRewardSettings;
  const keys = settings.map((s) => s.key);

  const results = await db
    .select()
    .from(rewardTable)
    .where(
      and(inArray(rewardTable.key, keys), eq(rewardTable.claimerId, userId)),
    )
    .orderBy(desc(rewardTable.claimedAt));

  return results;
};

export const rewardService = {
  claimPaidReward,
  claimFreeReward,
  resetFreeDrawChance: async (nextCount = 1) => {
    const result = await db
      .select({ count: count() })
      .from(userTable)
      .where(eq(userTable.freeDrawChances, 0))
      .then(head);

    const prev = result?.count || 0;
    const message = `昨日抽獎人數：${prev}`;
    await logService.insert(message);
    console.log(message);

    await db.update(userTable).set({ freeDrawChances: nextCount });
  },
  stockMap,
  loadStock,
  rewardSettingMap,
  getRewardSetting,
  paidRewardSettings,
  getMyRewards,
};
