import express from "express";

import path from "path";
import { authRouter } from "./auth.ts";

import meRouter from "./controllers/me.ts";
import leaderboardRouter from "./controllers/leaderboard.ts";
import rewardRouter from "./controllers/reward.ts";
import cookieParser from "cookie-parser";

import { leaderboardService } from "./services/leaderboard.ts";
import { meService } from "./services/me.ts";

import "./jobs/index.ts";
import handleError from "./middlewares/errorHandler.ts";
import csrfProtection from "./middlewares/csrfProtection.ts";
import limiter from "./middlewares/limiter.ts";
import adminRouter, {
  staticPath as adminStaticPath,
} from "./controllers/admin.ts";

const port = process.env.PORT || 3000;
const app = express();
const staticPath = path.join(import.meta.dirname, "../../client/dist");

app.use(express.static(staticPath, { extensions: ["html"] }));

app.use(authRouter);
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);

app.use(meRouter);
app.use(leaderboardRouter);
app.use(rewardRouter);
app.use(adminRouter);

app.use((_req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.use(handleError);

app.listen(port, async () => {
  console.log("staticPath", staticPath);
  console.log("adminStaticPath", adminStaticPath);

  // 正式機更新再 reset 就好
  if (process.env.NODE_ENV !== "development") {
    await leaderboardService.updateMaterialView();
    await meService.resetIsUpdating();
  }

  console.log(`http://localhost:${port}`);
});
