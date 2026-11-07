import express from "express";
import { requireAuth } from "../auth.ts";
import { rewardService } from "../services/reward.ts";
import { type PublicReward } from "../types.ts";
import { db } from "../db.ts";
import { reward as rewardTable } from "../models/schema.ts";
import { and, eq } from "drizzle-orm";

const URL = "/api/rewards";

const rewardRouter = express.Router();

rewardRouter.use(URL, requireAuth);

rewardRouter.post(`${URL}/claim`, async (req, res) => {
  const me = req.user!;
  const { key } = req.body;
  const price = Number(req.body.price);

  const reward = await rewardService.claimPaidReward(me.id, key, price);
  const setting = rewardService.getRewardSetting(reward.key);
  const publicReward: PublicReward = {
    key: setting.key,
    name: setting.name,
    description: setting.description,
    claimedAt: reward.claimedAt,
    isMerch: setting.isMerch,
    price: setting.price,
    buttonText: reward.buttonText,
    eligible: true, // 不會用到的欄位，應該可以隨意傳

    // 無限兌換不回傳 code，避免誤判顯示兌換按鈕
    code: setting.unlimitedSupply ? null : reward.code,
    // 無限兌換永遠可以再換一個
    available: setting.unlimitedSupply ? true : false,
  };

  return res.send({ reward: publicReward });
});

rewardRouter.post(`${URL}/lucky-draw`, async (req, res) => {
  const me = req.user!;
  const { reward } = await rewardService.claimFreeReward(me.id);

  if (!reward) {
    return res.send({ reward: null });
  }

  const setting = rewardService.getRewardSetting(reward.key);
  const publicReward: PublicReward = {
    key: setting.key,
    name: setting.name,
    description: setting.description,
    code: reward.code,
    price: setting.price,
    isMerch: setting.isMerch,
    available: false, // 不會用到的欄位，應該可以隨意傳
    claimedAt: reward.claimedAt,
    buttonText: reward.buttonText,
    eligible: true, // 不會用到的欄位，應該可以隨意傳
  };

  return res.send({ reward: publicReward });
});

rewardRouter.get(`${URL}/refund-lottery-ticket`, async (req, res) => {
  const me = req.user!;

  if (!me) res.send("您尚未登入，請登入後再點此連結");

  await db
    .delete(rewardTable)
    .where(
      and(
        eq(rewardTable.claimerId, me.id),
        eq(rewardTable.key, "lottery-ticket"),
      ),
    );

  return res.redirect("/me");
});

export default rewardRouter;
