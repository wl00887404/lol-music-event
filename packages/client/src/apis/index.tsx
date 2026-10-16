import toast from "@/components/toast";
import type { Team } from "@/types";
import axios from "axios";

const CSRF_COOKIE_NAME = "csrf_token" as const;
const CSRF_HEADER_NAME = "x-csrf-token" as const;
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;

export function getCookieValue(name: string): string | null {
  const match = document.cookie.match(
    new RegExp("(^|;\\s*)" + name + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

const instance = axios.create();

instance.interceptors.request.use((config) => {
  const method =
    config.method?.toUpperCase() as (typeof MUTATING_METHODS)[number];

  if (method && MUTATING_METHODS.includes(method)) {
    const token = getCookieValue(CSRF_COOKIE_NAME);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers[CSRF_HEADER_NAME] = token;
    }
  }

  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      const message = err.response?.data.message;

      if (message) {
        toast.error(message);
      }
    }

    return Promise.reject(err);
  },
);

type ErrorResponse = {
  code: string;
  message: string;
};

type ApiError = {
  error: ErrorResponse;
};

type DateString = string;

type CommonMutationData = { success: true };

export type SoloMission = {
  name: string;
  score: number;
  status: "finished" | "inProgress" | "locked";
};

const unknownError: ApiError = {
  error: {
    code: "unknown",
    message: "發生未知錯誤",
  },
};

type GetSoloMissionsData = {
  missions: SoloMission[];
  skipChance: number;
  syncedAt: DateString;
};

export const getSoloMissions = async () => {
  const response = await instance.get<GetSoloMissionsData>(
    "/api/me/solo-missions",
  );

  const { data } = response;
  return data;
};

export const requestSync = async () => {
  const response = await instance.post("/api/me/sync");
  const { data } = response;
  return data;
};

type CompleteUserDataPayload = {
  email: string;
  phone: string;
  team: string;
  inviteCode?: string;
  isTermsAndPrivacyAccepted: boolean;
  isOver15: boolean;
  consentVersion: string;
};

export const completeUserData = async (payload: CompleteUserDataPayload) => {
  try {
    const response = await instance.post<CommonMutationData>(
      "/api/me/complete-user-data",
      payload,
    );

    const { data } = response;
    return data;
  } catch (err) {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      return { error: err.response?.data } as ApiError;
    }
  }

  return unknownError;
};

type CheckUpdatingData = {
  isUpdating: boolean;
};

export const checkUpdating = async () => {
  const response = await instance.get<CheckUpdatingData>(
    "/api/me/check-updating",
  );

  const { data } = response;
  return data;
};

// FIXME: 要確認
export type GetMyStatsData = {
  totalRank: number;
  playerCount: number;
  totalCount: number;
  wonCount: number;
  averageKda: number;
};

export const getMyStats = async () => {
  const response = await instance.get<GetMyStatsData>("/api/me/stats");

  const { data } = response;
  return data;
};

export type CommonLeaderboardPayload = {
  team?: "all" | Team;
  offset: number;
  limit?: number;
};

export type PlayerLeaderboardPayLoad = CommonLeaderboardPayload & {
  keyword: string;
};

export type PlayerLeaderboardItem = {
  id: string;
  riotId: string;
  score: number;
  image: string;
  totalRank: number;
  titles: string[];
};

type GetPlayerLeaderboard = {
  data: PlayerLeaderboardItem[];
  total: number;
};

export const getPlayerLeaderboard = async (
  payload: PlayerLeaderboardPayLoad,
) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  qs.append("limit", `${payload.limit || 12}`);
  qs.append("keyword", payload.keyword || "");
  qs.append("team", payload.team || "all");

  const response = await instance.get<GetPlayerLeaderboard>(
    `/api/leaderboard/player?${qs}`,
  );

  const { data } = response;
  return data;
};

export type HonorRollItem = {
  id: string;
  riotId: string;
  name: string;
  image: string;
};

type GetHonorRollData = HonorRollItem[];

export const getHonorRoll = async () => {
  const response = await instance.get<GetHonorRollData>(
    `/api/leaderboard/honor-roll`,
  );

  const { data } = response;
  return data;
};

export const skipSoloMission = async () => {
  try {
    const response = await instance.post<CommonMutationData>(
      "/api/me/skip-solo-mission",
    );

    const { data } = response;
    return data;
  } catch (err) {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      return { error: err.response?.data } as ApiError;
    }
  }

  return unknownError;
};

// FIXME: 要確認
type GetMyLeaderboardData = {
  player: PlayerLeaderboardItem | null;
};

export const getMyLeaderboard = async () => {
  const response =
    await instance.get<GetMyLeaderboardData>(`/api/me/leaderboard`);

  const { data } = response;
  return data;
};

// FIXME: 要確認
export type Reward = {
  code: string | null;
  description: string;
  finishedCount: number;
  icon: string;
  image: string;
  name: string;
  totalCount: number;
  type: string;
};

type GetRewardData = Reward[];

export const getRewards = async () => {
  const response = await instance.get<GetRewardData>("/api/me/rewards");

  const { data } = response;
  return data;
};

type GetMyInviteesData = string;

export const getMyInvitee = async () => {
  const response = await instance.get<GetMyInviteesData>("/api/me/invitees");

  const { data } = response;
  return data;
};

export const claimReward = async (type: string) => {
  try {
    const response = await instance.post<CommonMutationData>(
      "/api/rewards/claim",
      { type },
    );

    const { data } = response;
    return data;
  } catch (err) {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      return { error: err.response?.data } as ApiError;
    }
  }

  return unknownError;
};
