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

// 用「測試專屬的 key」建立獎勵設定，完全不碰真實庫存。
// 與 service 的對應規則一致：無限兌換的商品，limit 一律是 Infinity。
const paidSetting = (
  o: { price?: number; limit?: number; unlimitedSupply?: boolean } = {},
) => {
  const key = `${PREFIX}-k${seq++}`;
  const unlimitedSupply = o.unlimitedSupply ?? false;
  return mkPaidRs({
    key,
    name: key,
    description: "",
    price: o.price ?? 10,
    limit: unlimitedSupply ? Infinity : (o.limit ?? Infinity),
    isMerch: false,
    unlimitedSupply,
  });
};

// 無限兌換（如抽獎券）：不需要預建庫存，兌換時現場產生紀錄
const unlimitedSetting = (price = 20) =>
  paidSetting({ price, unlimitedSupply: true });

// 免費獎勵：price 固定 0；limit 是「每人最多中幾次」（預設不限）
const freeSetting = (o: { dailyLimit?: number; limit?: number } = {}) => {
  const key = `${PREFIX}-k${seq++}`;
  return mkFreeRs({
    key,
    name: key,
    description: "",
    dailyLimit: o.dailyLimit ?? Infinity,
    weekdayChance: 0,
    weekendChance: 0,
    limit: o.limit ?? Infinity,
    isMerch: false,
    unlimitedSupply: false,
  });
};

// 預建庫存列。code 固定為 `${key}-c${i}`，
// 與無限兌換現場產生的 `${key}-${uuid}` 格式不同，測試可據此分辨來源。
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
// claimRewardInTx：基本規則（預建庫存的獎勵）
// ─────────────────────────────────────────────────────────────

describe("claimRewardInTx：基本規則", () => {
  it("成功領取：寫入 claimer、claimedAt 與兌換價格，回傳庫存列的 code", async () => {
    const rs = paidSetting({ price: 30, limit: 1 });
    const userId = await createUser({ score: 100 });
    await addStock(rs, 1);

    const result = await claim(userId, rs);

    expect(result).toMatchObject({ key: rs.key, code: `${rs.key}-c0` });
    expect(result.claimedAt).toBeInstanceOf(Date);
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

  it("免費獎勵也受個人上限限制", async () => {
    const rs = freeSetting({ limit: 1 });
    const userId = await createUser();
    await addStock(rs, 2);

    await claim(userId, rs);
    expect(await rejectCode(claim(userId, rs))).toBe(
      "CLAIM_COUNT_REACH_USER_LIMIT",
    );
    expect(await claimedRows(rs.key)).toHaveLength(1);
  });

  it("limit 為 Infinity 但非無限供應：仍從預建庫存領取，不會現場生成", async () => {
    // 免費獎勵的 limit 預設是 Infinity（個人不限次數），
    // 但它不是 unlimitedSupply，必須領預建庫存。
    const rs = freeSetting();
    const [u1, u2] = await createUsers(2);
    await addStock(rs, 1);

    const first = await claim(u1, rs);

    expect(first.code).toBe(`${rs.key}-c0`); // 是預建庫存的 code
    expect(await rejectCode(claim(u2, rs))).toBe("REWARD_OUT_OF_STOCK");
    expect(await claimedRows(rs.key)).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────
// claimRewardInTx：無限兌換（unlimitedSupply）
// ─────────────────────────────────────────────────────────────

describe("claimRewardInTx：無限兌換", () => {
  it("不需要預建庫存：兌換時現場產生紀錄", async () => {
    const rs = unlimitedSetting(20);
    const userId = await createUser({ score: 100 });
    // 刻意不建立任何庫存

    const result = await claim(userId, rs);

    expect(result.key).toBe(rs.key);
    expect(result.code.startsWith(`${rs.key}-`)).toBe(true);
    const [row] = await claimedRows(rs.key);
    expect(row).toMatchObject({ id: result.id, claimerId: userId, price: 20 });
    expect(row.claimedAt).toBeInstanceOf(Date);
  });

  it("不同玩家各領一張：code 不會重複", async () => {
    const rs = unlimitedSetting();
    const [u1, u2] = await createUsers(2, { score: 100 });

    const a = await claim(u1, rs);
    const b = await claim(u2, rs); // code 若只含個人計數，這裡會撞唯一索引

    expect(a.code).not.toBe(b.code);
    expect(await claimedRows(rs.key)).toHaveLength(2);
  });

  it("同一玩家可重複兌換，每次的 code 都不同", async () => {
    const rs = unlimitedSetting(20);
    const userId = await createUser({ score: 100 });

    const codes: string[] = [];
    for (let i = 0; i < 3; i++) {
      codes.push((await claim(userId, rs)).code);
    }

    expect(new Set(codes).size).toBe(3);
    expect(await claimedRows(rs.key)).toHaveLength(3);
  });

  it("仍受點數限制，且歷史花費會累計", async () => {
    const rs = unlimitedSetting(20);
    const userId = await createUser({ score: 50 });

    await claim(userId, rs);
    await claim(userId, rs); // 已花 40，剩 10
    expect(await rejectCode(claim(userId, rs))).toBe("SCORE_NOT_ENOUGH");
    expect(await claimedRows(rs.key)).toHaveLength(2);
  });

  it("併發：同一玩家點數只夠兩張時，同時兌換只會成功兩次", async () => {
    const rs = unlimitedSetting(40);
    const userId = await createUser({ score: 100 }); // 40 + 40 = 80 ≤ 100 < 120

    const { ok, failCodes } = await settle(
      Array.from({ length: 5 }, () => claim(userId, rs)),
    );

    expect(ok).toHaveLength(2);
    expect(failCodes).toEqual(Array(3).fill("SCORE_NOT_ENOUGH"));
    expect(await claimedRows(rs.key)).toHaveLength(2);
  });

  it("併發：多位玩家同時兌換都會成功，且 code 全部不同", async () => {
    const rs = unlimitedSetting(20);
    const users = await createUsers(10, { score: 100 });

    const { ok, failCodes } = await settle(users.map((u) => claim(u, rs)));

    expect(failCodes).toEqual([]);
    expect(ok).toHaveLength(10);
    expect(new Set(ok.map((r) => r.code)).size).toBe(10);
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
// claimRewardInTx：併發（預建庫存）
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
    // 不設個人上限，確保擋下請求的是「點數」而不是「個人上限」
    const rs = paidSetting({ price: 240 });
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

    expect(result).toEqual({ win: false, reward: null, chancesLeft: 1 });
    expect(await getChances(userId)).toBe(1);
  });

  it("中獎：領到獎勵並扣一次次數", async () => {
    const rs = freeSetting();
    const userId = await createUser({ freeDrawChances: 1 });
    await addStock(rs, 1);

    const result = await rewardService.claimFreeReward(userId, rs);

    expect(result).toMatchObject({
      win: true,
      chancesLeft: 0,
      reward: { key: rs.key, code: `${rs.key}-c0` },
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

    expect(result).toEqual({ win: false, reward: null, chancesLeft: 0 });
    expect(await getChances(userId)).toBe(0);
  });

  it("抽到但已達每日上限：視為沒中，次數照扣，庫存不動", async () => {
    const rs = freeSetting({ dailyLimit: 0 });
    const userId = await createUser({ freeDrawChances: 1 });
    await addStock(rs, 1);

    const result = await rewardService.claimFreeReward(userId, rs);

    expect(result).toEqual({ win: false, reward: null, chancesLeft: 0 });
    expect(await getChances(userId)).toBe(0);
    expect(await claimedRows(rs.key)).toHaveLength(0);
  });

  it("抽到但已達個人上限：視為沒中，次數照扣，不再發放", async () => {
    // 對應 free-box 的「每人最多中一次」。
    // 這題依賴 service 把 CLAIM_COUNT_REACH_USER_LIMIT 納入 no-prize 清單；
    // 若沒納入，玩家會收到錯誤且次數退回，這題會失敗。
    const rs = freeSetting({ limit: 1 });
    const userId = await createUser({ freeDrawChances: 2 });
    await addStock(rs, 3);

    const first = await rewardService.claimFreeReward(userId, rs);
    const second = await rewardService.claimFreeReward(userId, rs);

    expect(first).toMatchObject({ win: true, chancesLeft: 1 });
    expect(second).toEqual({ win: false, reward: null, chancesLeft: 0 });
    expect(await getChances(userId)).toBe(0);
    expect(await claimedRows(rs.key)).toHaveLength(1);
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

  it("併發：同一玩家同時抽兩次，個人上限 1 的獎只會中一次", async () => {
    const rs = freeSetting({ limit: 1 });
    const userId = await createUser({ freeDrawChances: 2 });
    await addStock(rs, 5);

    const results = await Promise.all([
      rewardService.claimFreeReward(userId, rs),
      rewardService.claimFreeReward(userId, rs),
    ]);

    expect(results.filter((r) => r.win)).toHaveLength(1);
    expect(await claimedRows(rs.key)).toHaveLength(1);
    expect(await getChances(userId)).toBe(0); // 兩次擲骰都各扣一次
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
    // 取設定檔裡實際存在的第一項；價格 -1 必然不符
    const [real] = rewardService.paidRewardSettings;
    expect(
      await rejectCode(rewardService.claimPaidReward("any-user", real.key, -1)),
    ).toBe("PRICE_NOT_MATCH");
  });
});
