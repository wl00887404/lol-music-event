import express from "express";
import { requireAuth } from "../auth.ts";
import { db } from "../db.ts";
import { sql } from "drizzle-orm";
import { rewardService } from "../services/reward.ts";
import { ApiError } from "../middlewares/errorHandler.ts";
import { logService } from "../services/log.ts";

const URL = "/api/rewards";

const rewardRouter = express.Router();

rewardRouter.use(URL, requireAuth);

rewardRouter.post(`${URL}/claim`, async (req, res) => {
  const me = req.user;
  const { type } = req.body;

  try {
    const claimable = await rewardService.checkClaimable(type, me.id);

    if (!claimable) {
      throw new ApiError(403, {
        code: "REDEEM_CONDITION_NOT_MET",
        message: "尚未達成兌換條件",
      });
    }
  } catch (err) {
    throw new ApiError(404, {
      code: "INVALID_REWARD_TYPE",
      message: "查無此獎勵",
    });
  }

  try {
    const result = await db.execute(sql`
      WITH claimed AS (
        UPDATE reward
        SET claimer_id = ${me.id}
        WHERE id = (
          SELECT id
          FROM reward
          WHERE type = ${type}
            AND claimer_id IS NULL
            -- 若該 user 已經領過同一個 type，就不會選出任何候選列
            AND NOT EXISTS (
              SELECT 1 FROM reward AS c2
              WHERE c2.type = ${type}
                AND c2.claimer_id = ${me.id}
            )
          ORDER BY id
          FOR UPDATE SKIP LOCKED
          LIMIT 1
        )
        RETURNING id, type, code
      )
      SELECT * FROM claimed;
    `);

    const claimedReward = result.rows[0];

    if (!claimedReward) {
      // 這裡有兩種可能，先分辨是哪一種，給前端更準確的錯誤訊息
      const alreadyClaimed = await db.execute(sql`
        SELECT 1 FROM coupon
        WHERE type = ${type} AND claimer_id = ${me.id}
        LIMIT 1
      `);

      if (alreadyClaimed.rows.length > 0) {
        throw new ApiError(409, {
          code: "REWARD_ALREADY_CLAIMED",
          message: "你已經領取過這個獎項",
        });
      }

      throw new ApiError(409, {
        code: "REWARD_OUT_OF_STOCK",
        message: "領取失敗，請向客服回報異常",
      });
    }

    await logService.insert(
      `${me.riotId} 領取獎勵成功`,
      rewardService.getName(type),
    );
    return res.send({ success: true });
  } catch (err: any) {
    // 極端 race condition 下（例如同時兩個 request 都通過了 NOT EXISTS 檢查後才 commit），
    // 靠 unique index 擋下第二筆，這裡攔截 constraint violation
    if (
      err?.code === "23505" &&
      err?.constraint === "reward_type_claimer_unique_idx"
    ) {
      throw new ApiError(409, {
        code: "REWARD_ALREADY_CLAIMED",
        message: "你已經領取過這個獎項",
      });
    }

    console.error("Reward claim error:", err);
    throw new ApiError();
  }
});

export default rewardRouter;
