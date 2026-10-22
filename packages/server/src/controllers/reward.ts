import express from "express";
import { requireAuth } from "../auth.ts";
import { rewardService } from "../services/reward.ts";
import { type PublicReward } from "../types.ts";

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
    code: reward.code,
    price: setting.price,
    isMerch: setting.isMerch,
    available: false,
    claimedAt: reward.claimedAt,
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
    available: false,
    claimedAt: reward.claimedAt,
  };

  return res.send({ reward: publicReward });
});

export default rewardRouter;
