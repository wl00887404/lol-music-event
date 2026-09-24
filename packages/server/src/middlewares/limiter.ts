import { RateLimiterRedis } from "rate-limiter-flexible";
import { Redis } from "ioredis";
import { type Request, type Response, type NextFunction } from "express";
import { ApiError } from "./errorHandler.ts";

const redisClient = new Redis(process.env.REDIS_URI!);

const anonLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_anon",
  points: 100,
  duration: 60,
});

const authLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rl_auth",
  points: 300,
  duration: 60,
});

async function limiter(req: Request, res: Response, next: NextFunction) {
  const userId = req.session?.userId;
  const clientIp = req.ip || req.socket.remoteAddress || "unknown";

  try {
    if (userId) {
      await authLimiter.consume(userId);
    } else {
      await anonLimiter.consume(clientIp);
    }
    next();
  } catch (rejRes) {
    const riotId = req.user?.riotId;

    console.error(
      `userId: ${userId} riotId: ${riotId} clientIp: ${clientIp} 正在高頻率發出 Request`,
    );

    throw new ApiError(429, {
      code: "RATE_LIMITED",
      message: "請稍後再試",
    });
  }
}

export default limiter;
