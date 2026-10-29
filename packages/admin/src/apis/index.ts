import axios from "axios";

const CSRF_COOKIE_NAME = "csrf_token" as const;
const CSRF_HEADER_NAME = "x-csrf-token" as const;
const MUTATING_METHODS = ["POST", "PUT", "PATCH", "DELETE"] as const;

function getCookieValue(name: string): string | null {
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

type ErrorResponse = {
  code: string;
  message: string;
};

type ApiError = {
  error: ErrorResponse;
};

export type DateString = string;

type CommonMutationData = { success: true };

const unknownError: ApiError = {
  error: {
    code: "unknown",
    message: "發生未知錯誤",
  },
};

export type User = {
  id: string;
  name: string; // 沒有用的欄位
  email: string | null;
  emailVerified: false;
  image: string;
  createdAt: DateString;
  updatedAt: DateString;
  phone: string;
  score: number;
  isLeader: false;
  inviteCode: string;
  riotId: string;
  puuid: string;
  isUpdating: boolean;
  isCompleted: boolean;
  inviterId: null;
  isInviteCompleted: boolean;
  consentVersion: string;
  termsAcceptedAt: DateString;
  privacyAcceptedAt: DateString;
  ageConfirmedAt: DateString;
  inviterRiotId: string;
  team: string;
  teamName: string;
};

export type GetUsersData = {
  data: User[];
  total: number;
};

type GetUsersPayload = {
  offset: number;
  limit?: number;
  sort?: string;
  isCompleted?: string;
  riotId?: string;
  inviterRiotId?: string;
  team?: string;
};

export const getUsers = async (payload: GetUsersPayload) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  if (payload.limit !== undefined) {
    qs.append("limit", payload.limit.toString());
  }
  qs.append("sort", payload.sort || "createdAt");
  qs.append("isCompleted", payload.isCompleted || "all");
  qs.append("riotId", (payload.riotId || "").trim());
  qs.append("inviterRiotId", (payload.inviterRiotId || "").trim());
  qs.append("team", (payload.team || "all").trim());

  const response = await instance.get<GetUsersData>(`/api/admin/users?${qs}`);
  const { data } = response;

  return data;
};

export type TeamMission = {
  name: string;
  description: string;
  status: "finished" | "inProgress" | "locked";
};

export type TeamMember = { riotId: string; score: number; isLeader: boolean };

export type Team = {
  id: string;
  inviteCode: string;
  name: string;
  school: string;
  missionArgs: { isFinished: boolean }[];
  members: TeamMember[];
  missions: TeamMission[];
};

export type GetTeamsData = {
  data: Team[];
  total: number;
};

type GetTeamsPayload = {
  offset: number;
  limit?: number;
  teamName?: string;
};

export const getTeams = async (payload: GetTeamsPayload) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  if (payload.limit !== undefined) {
    qs.append("limit", payload.limit.toString());
  }
  qs.append("teamName", payload.teamName || "");

  const response = await instance.get<GetTeamsData>(`/api/admin/teams?${qs}`);
  const { data } = response;

  return data;
};

type GetUpdatingCount = {
  count: number;
};

export const getUpdatingCount = async () => {
  const response = await instance.get<GetUpdatingCount>(
    `/api/admin/users/updating-count`,
  );
  const { data } = response;

  return data;
};

type UpdateUserPayload = {
  id: string;
  email: string;
  school: string;
  phone: string;
};

export const updateUser = async (payload: UpdateUserPayload) => {
  try {
    const response = await instance.post<{ success: true }>(
      `/api/admin/users/${payload.id}`,
      { email: payload.email, school: payload.school, phone: payload.phone },
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

export type GetSchoolsData = {
  north: { highSchool: string[]; college: string[] };
  central: { highSchool: string[]; college: string[] };
  south: { highSchool: string[]; college: string[] };
  other: { highSchool: string[]; college: string[] };
};

export const getSchools = async () => {
  const response = await instance.get<GetSchoolsData>("/api/schools");
  const { data } = response;

  return data;
};

// export type GetScoreCountData = { score: number; count: number }[];

// export const getScoreCount = async () => {
//   const response = await instance.get<GetScoreCountData>(
//     "/api/admin/statistics/score-count",
//   );
//   const { data } = response;

//   return data.sort((a, b) => a.score - b.score);
// };

// export type GetCreateAt = {
//   createdAt: DateString;
//   inviterId: string | null;
//   isCompleted: boolean;
// }[];

// export const getCreatedAt = async () => {
//   const response = await instance.get<GetCreateAt>(
//     "/api/admin/statistics/user-source",
//   );

//   const { data } = response;

//   return data;
// };

export type Reward = {
  id: string;
  key: string;
  claimerRiotId: string;
  claimedAt: string;
  claimerEmail: string;
  claimerPhone: string;
};

type GetRewardPayload = {
  offset: number;
  limit?: number;
  rewardKeys?: string[];
  claimerRiotId?: string;
};

export type GetRewardData = {
  data: Reward[];
  total: number;
};

export const getRewards = async (payload: GetRewardPayload) => {
  const response = await instance.post<GetRewardData>(`/api/admin/rewards`, {
    offset: payload.offset || 0,
    limit: payload.limit,
    rewardKeys: payload.rewardKeys || [],
    claimerRiotId: payload.claimerRiotId || "",
  });
  const { data } = response;

  return data;
};

export type Stock = {
  key: string;
  claimedCount: number;
  unclaimedCount: number;
};

export type GetStockData = Stock[];

export const getStock = async () => {
  const response = await instance.get<GetStockData>(`/api/admin/rewards/stock`);
  const { data } = response;

  return data;
};

export type DbSize = {
  tableName: string;
  totalSize: string;
  tableOnly: string;
  indexSize: string;
};

type GetDbSize = DbSize[];

export const getDbSize = async () => {
  const response = await instance.get<GetDbSize>(`/api/admin/db-size`);
  const { data } = response;

  return data;
};

export const truncateMatchDetail = async () => {
  try {
    const response = await instance.post<{ success: true }>(
      `/api/admin/truncate-match-detail`,
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

export const reloadStockMap = async () => {
  try {
    const response = await instance.post<{ success: true }>(
      `/api/admin/reload-stock-map`,
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

export const updateLeaderboard = async () => {
  try {
    const response = await instance.post<{ success: true }>(
      `/api/admin/update-leaderboard`,
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

export type LotteryReward = {
  key: string;
  claimerRiotId: string;
  claimerEmail: string;
  claimerPhone: string;
  count: number;
};

export type GetLotteryRewardsData = {
  data: LotteryReward[];
  total: number;
};

export type GetLotteryRewardsPayload = {
  offset: number;
  limit?: number;
};

export const getLotteryRewards = async (payload: GetLotteryRewardsPayload) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  if (payload.limit !== undefined) {
    qs.append("limit", payload.limit.toString());
  }
  const response = await instance.get<GetLotteryRewardsData>(
    `/api/admin/rewards/lottery?${qs}`,
  );
  const { data } = response;

  return data;
};

export type FreeDrawReportReward = { key: string; count: number };
export type FreeDrawReport = {
  date: string;
  drawCount: number;
  rewards: FreeDrawReportReward[];
};

export type GetFreeDrawReportData = FreeDrawReport[];

export const getFreeDrawReport = async (now?: boolean) => {
  const postfix = now ? "/now" : "";
  const response = await instance.get<GetFreeDrawReportData>(
    `/api/admin/free-draw-report${postfix}`,
  );
  const { data } = response;

  return data;
};
