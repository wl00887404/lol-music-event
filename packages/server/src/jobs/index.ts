import cron from "node-cron";
import { soloMissionService } from "../services/soloMission.ts";
import { leaderboardService } from "../services/leaderboard.ts";
import { lockTimestampMap, riotService } from "../services/riot.ts";
import { rewardService } from "../services/reward.ts";

const taskOption = { timezone: "Asia/Taipei" };

// 星期一早上八點，刷新跳過任務次數
cron.schedule(
  "0 8 * * 1",
  async () => {
    console.log(`[pid:${process.pid}] 跳過任務次數重置`);
    try {
      await soloMissionService.resetSkipChance();
    } catch (err) {
      console.error(`[pid:${process.pid}] 跳過任務次數重置失敗`, err);
    }
  },
  taskOption,
);

// 每日午夜，更新抽獎次數
cron.schedule(
  "0 0 * * *",
  async () => {
    console.log(`[pid:${process.pid}] 每日抽獎次數重置`);
    try {
      await rewardService.resetFreeDrawChance();
    } catch (err) {
      console.error(`[pid:${process.pid}] 每日抽獎次數重置失敗`, err);
    }
  },
  taskOption,
);

// 6 分鐘，更新排行榜
cron.schedule(
  "*/6 * * * *",
  async () => {
    console.log(`[pid:${process.pid}] 更新排行榜`);
    try {
      await leaderboardService.updateMaterialView();
    } catch (err) {
      console.error(`[pid:${process.pid}] 更新排行榜失敗`, err);
    }
  },
  taskOption,
);

// 每 10 分鐘，檢查同步超時
cron.schedule(
  "*/10 * * * *",
  async () => {
    console.log(`[pid:${process.pid}] 檢查同步超時`);
    const now = Date.now();
    // 複製一份再遍歷，避免 resyncUser 修改 Map 時影響迴圈
    for (const [userID, timestamp] of [...lockTimestampMap]) {
      if (now - timestamp <= 20 * 60 * 1000) continue;
      console.error("userId ", userID, " 同步超過了 20 分鐘");
      // 每個 user 各自 try/catch，單一失敗不會中斷其他 user
      try {
        await riotService.resyncUser(userID);
      } catch (err) {
        console.error(`[pid:${process.pid}] userId ${userID} resync 失敗`, err);
      }
    }
  },
  taskOption,
);

// 每日 05:01，更新所有 User
cron.schedule(
  "1 5 * * *",
  async () => {
    console.log(`[pid:${process.pid}] 更新所有 User`);
    try {
      await riotService.syncAllUser();
    } catch (err) {
      console.error(`[pid:${process.pid}] 更新所有 User 失敗`, err);
    }
  },
  taskOption,
);

// 每日 07:01，刪除 match detail
cron.schedule(
  "1 7 * * *",
  async () => {
    console.log(`[pid:${process.pid}] 刪除 match detail`);
    try {
      await riotService.truncateMatchDetail();
    } catch (err) {
      console.error(`[pid:${process.pid}] 刪除 match detail 失敗`, err);
    }
  },
  taskOption,
);
