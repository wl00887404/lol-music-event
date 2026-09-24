import "dotenv/config";
import axios, { type AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";
import Bottleneck from "bottleneck";

// 兩層 limiter，對應 Riot 的兩條限制
const perTenSeconds = new Bottleneck({
  reservoir: 500,
  reservoirRefreshAmount: 500,
  reservoirRefreshInterval: 10_000,
  maxConcurrent: 20,
});

const perTenMinutes = new Bottleneck({
  reservoir: 30_000,
  reservoirRefreshAmount: 30_000,
  reservoirRefreshInterval: 10 * 60 * 1_000,
});

const limiter = perTenSeconds.chain(perTenMinutes);

const instance = axios.create({
  headers: {
    "X-Riot-Token": process.env.RIOT_API_KEY,
  },
});

axiosRetry(instance, {
  retries: 3,
  retryDelay: (_retryCount, error) => {
    const retryAfter = Number(error.response?.headers["retry-after"] ?? 1);
    return retryAfter * 1000; // 優先用 Riot 給的等待時間
  },
  retryCondition: (error) => error.response?.status === 429,
});

async function riotGet<T>(url: string, config?: AxiosRequestConfig) {
  return limiter.schedule(() => instance.get<T>(url));
}

export default riotGet;
