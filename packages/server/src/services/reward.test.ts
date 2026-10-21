// 直接打資料庫的整合測試。
// 檔名與 import 路徑請依實際位置調整（這裡假設與 service 同一層）。
import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it, vi } from "vitest";
import { and, eq, isNotNull, like, or } from "drizzle-orm";
import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { reward as rewardTable } from "../models/schema.ts";
import { ApiError } from "../middlewares/errorHandler.ts";
import {
  claimRewardInTx,
  getTodayRange,
  mkFreeRs,
  mkPaidRs,
  rewardService,
  type RewardSetting,
} from "./reward.ts";

vi.setConfig({ testTimeout: 30_000 });

// ─────────────────────────────────────────────────────────────
// Fixture：所有測試資料都帶同一個 PREFIX，結束時整批刪除
// ─────────────────────────────────────────────────────────────

const PREFIX = `test-reward-${randomUUID().slice(0, 8)}`;
let seq = 0;

// afterAll 不論測試成功或失敗都會執行。
// 順序：先刪 reward（FK 指向 user），再刪 user。
afterAll(async () => {
  await db
    .delete(rewardTable)
    .where(
      or(
        like(rewardTable.key, `${PREFIX}%`),
        like(rewardTable.claimerId, `${PREFIX}%`),
      ),
    );
  await db.delete(userTable).where(like(userTable.id, `${PREFIX}%`));
});

type UserInit = { score?: number; freeDrawChances?: number };

const createUser = async ({
  score = 0,
  freeDrawChances = 0,
}: UserInit = {}) => {
  const id = `${PREFIX}-u${seq++}`;
  await db.insert(userTable).values({
    id,
    name: id,
    email: `${id}@test.invalid`,
    score,
    freeDrawChances,
  });
  return id;
};

const createUsers = (n: number, init: UserInit = {}) =>
  Promise.all(Array.from({ length: n }, () => createUser(init)));

// 用「測試專屬的 key」建立獎勵設定，完全不碰真實庫存
const paidSetting = (o: { price?: number; limit?: number } = {}) => {
  const key = `${PREFIX}-k${seq++}`;
  return mkPaidRs(key, key, o.price ?? 10, o.limit ?? Infinity);
};

const freeSetting = (o: { dailyLimit?: number } = {}) => {
  const key = `${PREFIX}-k${seq++}`;
  return mkFreeRs(key, key, o.dailyLimit ?? Infinity, 0, 0);
};

const addStock = async (setting: RewardSetting, n: number) => {
  if (n === 0) return;
  await db.insert(rewardTable).values(
    Array.from({ length: n }, (_, i) => ({
      key: setting.key,
      code: `${setting.key}-c${i}`,
      price: 0, // 庫存列的佔位價格，領取時會被覆寫為兌換價
    })),
  );
};

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────

const claim = (userId: string, setting: RewardSetting) =>
  db.transaction((tx) => claimRewardInTx(tx, userId, setting));

const errorCode = (e: unknown) =>
  e instanceof ApiError ? e.body?.code : undefined;

// 等 promise 失敗並回傳錯誤碼；若沒有失敗會回傳 "NO_ERROR"
const rejectCode = (p: Promise<unknown>) =>
  p.then(
    () => "NO_ERROR",
    (e: unknown) => errorCode(e) ?? `NOT_API_ERROR: ${String(e)}`,
  );

// 併發請求的結果：成功的有哪些、失敗的錯誤碼有哪些
const settle = async <T>(promises: Promise<T>[]) => {
  const results = await Promise.allSettled(promises);
  const ok = results.flatMap((r) =>
    r.status === "fulfilled" ? [r.value] : [],
  );
  const failCodes = results.flatMap((r) =>
    r.status === "rejected"
      ? [errorCode(r.reason) ?? `NOT_API_ERROR: ${String(r.reason)}`]
      : [],
  );
  return { ok, failCodes };
};

const claimedRows = (key: string) =>
  db
    .select()
    .from(rewardTable)
    .where(and(eq(rewardTable.key, key), isNotNull(rewardTable.claimerId)));

const getChances = async (userId: string) => {
  const [row] = await db
    .select({ n: userTable.freeDrawChances })
    .from(userTable)
    .where(eq(userTable.id, userId));
  return row.n;
};

// ─────────────────────────────────────────────────────────────
// claimRewardInTx：基本規則
// ─────────────────────────────────────────────────────────────

describe("claimRewardInTx：基本規則", () => {
  it("成功領取：寫入 claimer、claimedAt 與兌換價格", async () => {
    const rs = paidSetting({ price: 30, limit: 1 });
    const userId = await createUser({ score: 100 });
    await addStock(rs, 1);

    const result = await claim(userId, rs);

    expect(result).toMatchObject({ key: rs.key, name: rs.name });
    const [row] = await claimedRows(rs.key);
    expect(row).toMatchObject({ id: result.id, claimerId: userId, price: 30 });
    expect(row.claimedAt).toBeInstanceOf(Date);
  });

  it("使用者不存在", async () => {
    const rs = paidSetting();
    await addStock(rs, 1);

    expect(await rejectCode(claim(`${PREFIX}-ghost`, rs))).toBe(
      "USER_NOT_FOUND",
    );
    expect(await claimedRows(rs.key)).toHaveLength(0);
  });

  it("點數不足：拒絕且不動庫存", async () => {
    const rs = paidSetting({ price: 240 });
    const userId = await createUser({ score: 100 });
    await addStock(rs, 1);

    expect(await rejectCode(claim(userId, rs))).toBe("SCORE_NOT_ENOUGH");
    expect(await claimedRows(rs.key)).toHaveLength(0);
  });

  it("點數計算包含已兌換的歷史", async () => {
    const rs = paidSetting({ price: 240 });
    const userId = await createUser({ score: 300 });
    await addStock(rs, 2);

    await claim(userId, rs); // 已花 240，剩 60
    expect(await rejectCode(claim(userId, rs))).toBe("SCORE_NOT_ENOUGH");
  });

  it("達到個人兌換上限", async () => {
    const rs = paidSetting({ limit: 1 });
    const userId = await createUser({ score: 1000 });
    await addStock(rs, 2);

    await claim(userId, rs);
    expect(await rejectCode(claim(userId, rs))).toBe(
      "CLAIM_COUNT_REACH_USER_LIMIT",
    );
  });

  it("庫存不足", async () => {
    const rs = paidSetting();
    const userId = await createUser({ score: 1000 });

    expect(await rejectCode(claim(userId, rs))).toBe("REWARD_OUT_OF_STOCK");
  });

  it("免費獎勵（price 0）不檢查點數", async () => {
    const rs = freeSetting();
    const userId = await createUser({ score: 0 });
    await addStock(rs, 1);

    await expect(claim(userId, rs)).resolves.toMatchObject({ key: rs.key });
  });
});

// ─────────────────────────────────────────────────────────────
// claimRewardInTx：每日上限
// ─────────────────────────────────────────────────────────────

describe("claimRewardInTx：每日上限", () => {
  it("達到每日上限後，其他玩家也不能領", async () => {
    const rs = freeSetting({ dailyLimit: 2 });
    const [u1, u2, u3] = await createUsers(3);
    await addStock(rs, 5);

    await claim(u1, rs);
    await claim(u2, rs);
    expect(await rejectCode(claim(u3, rs))).toBe(
      "CLAIM_COUNT_REACH_DAILY_LIMIT",
    );
  });

  it("昨天的領取量不計入今日（日界線）", async () => {
    const rs = freeSetting({ dailyLimit: 1 });
    const [yesterdayUser, today1, today2] = await createUsers(3);
    await addStock(rs, 3);

    // 把一件庫存標成「今日 00:00 前 1 毫秒」被領走
    const { start } = getTodayRange();
    const [stock] = await db
      .select({ id: rewardTable.id })
      .from(rewardTable)
      .where(eq(rewardTable.key, rs.key))
      .limit(1);
    await db
      .update(rewardTable)
      .set({
        claimerId: yesterdayUser,
        claimedAt: new Date(start.getTime() - 1),
      })
      .where(eq(rewardTable.id, stock.id));

    await expect(claim(today1, rs)).resolves.toMatchObject({ key: rs.key });
    expect(await rejectCode(claim(today2, rs))).toBe(
      "CLAIM_COUNT_REACH_DAILY_LIMIT",
    );
  });
});

// ─────────────────────────────────────────────────────────────
// claimRewardInTx：併發（原子性的重點）
// ─────────────────────────────────────────────────────────────

describe("claimRewardInTx：併發", () => {
  it("同一玩家同時兌換 limit=1 的獎勵，只會成功一次", async () => {
    const rs = paidSetting({ price: 10, limit: 1 });
    const userId = await createUser({ score: 1000 });
    await addStock(rs, 5);

    const { ok, failCodes } = await settle(
      Array.from({ length: 5 }, () => claim(userId, rs)),
    );

    expect(ok).toHaveLength(1);
    expect(failCodes).toEqual(Array(4).fill("CLAIM_COUNT_REACH_USER_LIMIT"));
    expect(await claimedRows(rs.key)).toHaveLength(1);
  });

  it("點數只夠一次時，同時兌換只會成功一次", async () => {
    // limit 設為 Infinity，確保擋下請求的是「點數」而不是「個人上限」
    const rs = paidSetting({ price: 240, limit: Infinity });
    const userId = await createUser({ score: 300 });
    await addStock(rs, 5);

    const { ok, failCodes } = await settle(
      Array.from({ length: 5 }, () => claim(userId, rs)),
    );

    expect(ok).toHaveLength(1);
    expect(failCodes).toEqual(Array(4).fill("SCORE_NOT_ENOUGH"));
    expect(await claimedRows(rs.key)).toHaveLength(1);
  });

  it("多位玩家搶有限庫存：不會重複發放", async () => {
    const rs = paidSetting({ price: 10 });
    const users = await createUsers(10, { score: 100 });
    await addStock(rs, 3);

    const { ok, failCodes } = await settle(users.map((u) => claim(u, rs)));

    expect(ok).toHaveLength(3);
    expect(new Set(ok.map((r) => r.id)).size).toBe(3); // 三件各不相同
    expect(failCodes).toEqual(Array(7).fill("REWARD_OUT_OF_STOCK"));
    expect(await claimedRows(rs.key)).toHaveLength(3);
  });

  it("多位玩家同時領：不會超過每日上限", async () => {
    // 這題驗證 advisory lock。把 service 裡那段 lock 註解掉，
    // 這個測試應該會（高機率）失敗，藉此確認測試真的測得到競態。
    const rs = freeSetting({ dailyLimit: 3 });
    const users = await createUsers(10);
    await addStock(rs, 20);

    const { ok, failCodes } = await settle(users.map((u) => claim(u, rs)));

    expect(ok).toHaveLength(3);
    expect(failCodes).toEqual(Array(7).fill("CLAIM_COUNT_REACH_DAILY_LIMIT"));
    expect(await claimedRows(rs.key)).toHaveLength(3);
  });
});

// ─────────────────────────────────────────────────────────────
// claimFreeReward
// ─────────────────────────────────────────────────────────────

describe("claimFreeReward", () => {
  it("沒有抽獎次數", async () => {
    const userId = await createUser({ freeDrawChances: 0 });

    expect(await rejectCode(rewardService.claimFreeReward(userId, null))).toBe(
      "DRAW_CHANCE_NOT_ENOUGH",
    );
  });

  it("銘謝惠顧也會消耗一次次數", async () => {
    const userId = await createUser({ freeDrawChances: 2 });

    const result = await rewardService.claimFreeReward(userId, null);

    expect(result).toEqual({ won: false, reward: null, chancesLeft: 1 });
    expect(await getChances(userId)).toBe(1);
  });

  it("中獎：領到獎勵並扣一次次數", async () => {
    const rs = freeSetting();
    const userId = await createUser({ freeDrawChances: 1 });
    await addStock(rs, 1);

    const result = await rewardService.claimFreeReward(userId, rs);

    expect(result).toMatchObject({
      won: true,
      chancesLeft: 0,
      reward: { key: rs.key },
    });
    const rows = await claimedRows(rs.key);
    expect(rows).toHaveLength(1);
    expect(rows[0].claimerId).toBe(userId);
  });

  it("抽到但庫存不足：視為沒中，次數照扣", async () => {
    const rs = freeSetting();
    const userId = await createUser({ freeDrawChances: 1 });
    // 不建立庫存

    const result = await rewardService.claimFreeReward(userId, rs);

    expect(result).toEqual({ won: false, reward: null, chancesLeft: 0 });
    expect(await getChances(userId)).toBe(0);
  });

  it("抽到但已達每日上限：視為沒中，次數照扣，庫存不動", async () => {
    const rs = freeSetting({ dailyLimit: 0 });
    const userId = await createUser({ freeDrawChances: 1 });
    await addStock(rs, 1);

    const result = await rewardService.claimFreeReward(userId, rs);

    expect(result).toEqual({ won: false, reward: null, chancesLeft: 0 });
    expect(await getChances(userId)).toBe(0);
    expect(await claimedRows(rs.key)).toHaveLength(0);
  });

  it("非預期的 DB 錯誤：整筆回滾，次數退回", async () => {
    // price 1.5 能通過點數檢查，但寫入 integer 欄位時 PostgreSQL 會報錯，
    // 藉此模擬「領獎階段發生非預期錯誤」（不是 ApiError，所以不會被當成沒中）。
    const rs = freeSetting();
    const brokenRs = { ...rs, price: 1.5 };
    const userId = await createUser({ score: 100, freeDrawChances: 1 });
    await addStock(rs, 1);

    await expect(
      rewardService.claimFreeReward(userId, brokenRs),
    ).rejects.toThrow();

    expect(await getChances(userId)).toBe(1);
    expect(await claimedRows(rs.key)).toHaveLength(0);
  });

  it("併發：次數只夠一次時，只會成功一次", async () => {
    const userId = await createUser({ freeDrawChances: 1 });

    const { ok, failCodes } = await settle(
      Array.from({ length: 10 }, () =>
        rewardService.claimFreeReward(userId, null),
      ),
    );

    expect(ok).toHaveLength(1);
    expect(failCodes).toEqual(Array(9).fill("DRAW_CHANCE_NOT_ENOUGH"));
    expect(await getChances(userId)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// claimPaidReward：入口驗證（在碰資料庫之前就會拒絕）
// ─────────────────────────────────────────────────────────────

describe("claimPaidReward：入口驗證", () => {
  it("查無此獎勵", async () => {
    expect(
      await rejectCode(
        rewardService.claimPaidReward("any-user", "no-such-key", 1),
      ),
    ).toBe("REWARD_NOT_FOUND");
  });

  it("價格不符", async () => {
    // "teemo-hat" 是 paidRewardSettings 裡真實存在的 key；價格 -1 必然不符
    expect(
      await rejectCode(
        rewardService.claimPaidReward("any-user", "teemo-hat", -1),
      ),
    ).toBe("PRICE_NOT_MATCH");
  });
});
