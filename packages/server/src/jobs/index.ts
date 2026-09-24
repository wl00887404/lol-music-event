import cron from "node-cron";
import { soloMissionService } from "../services/soloMission.ts";
import { leaderboardService } from "../services/leaderboard.ts";
import { lockTimestampMap, riotService } from "../services/riot.ts";

const taskOption = { timezone: "Asia/Taipei" };
// 星期一早上八點，刷新跳過任務次數
cron.schedule(
  "0 8 * * 1",
  async () => {
    console.log(`[pid:${process.pid}] 跳過任務次數重置`);
    await soloMissionService.resetSkipChance();
  },
  taskOption,
);

// 每半小時，更新排行榜
cron.schedule(
  "*/30 * * * *",
  async () => {
    console.log(`[pid:${process.pid}] 更新排行榜`);
    await leaderboardService.updateMaterialView();
  },
  taskOption,
);

cron.schedule(
  "*/10 * * * *",
  async () => {
    console.log(`[pid:${process.pid}] 檢查同步超時`);
    const now = Date.now();
    for (const [userID, timestamp] of lockTimestampMap) {
      if (now - timestamp <= 20 * 60 * 1000) continue;
      console.error("userId ", userID, " 同步超過了 20 分鐘");
      riotService.resyncUser(userID);
    }
  },
  taskOption,
);

// 每日 05:01，更新所有 User
cron.schedule(
  "1 5 * * *",
  async () => {
    console.log(`[pid:${process.pid}] 更新所有 User`);
    riotService.syncAllUser();
  },
  taskOption,
);

cron.schedule(
  "1 7 * * *",
  async () => {
    console.log(`[pid:${process.pid}] 刪除 match detail`);
    riotService.truncateMatchDetail();
  },
  taskOption,
);
