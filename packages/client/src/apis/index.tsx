import toast from "@/components/toast";
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

type CreateTeamPayload = {
  name: string;
};

export const createTeam = async (payload: CreateTeamPayload) => {
  try {
    const response = await instance.post<CommonMutationData>(
      "/api/teams",
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

export type TeamMission = {
  name: string;
  description: string;
  status: "finished" | "inProgress" | "locked";
};

type getTeamByInviteCodeData = {
  name: string;
  score: number;
  school: string;
  leader: string | null;
  memberCount: number | null;
};

export const getTeamByInviteCode = async (inviteCode: string) => {
  const url = `/api/teams/${inviteCode}`;

  try {
    const response = await instance.get<getTeamByInviteCodeData>(url);
    const { data } = response;

    return data;
  } catch (err) {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      return { error: err.response?.data } as ApiError;
    }
  }

  return unknownError;
};

type GetMyTeamData = {
  name: string;
  inviteCode: string;
  school: string;
  missions: TeamMission[];
  members: { riotId: string; score: number; isLeader: boolean }[];
};

export const getTeam = async () => {
  const url = "/api/teams";

  try {
    const response = await instance.get<GetMyTeamData>(url);

    const getOrder = (mission: TeamMission) => {
      if (mission.status === "inProgress") return 0;
      if (mission.status === "finished") return 1;

      return 2;
    };

    const { data } = response;
    const sortedMissions = data.missions.sort((m1, m2) => {
      return getOrder(m1) - getOrder(m2);
    });

    return { ...data, missions: sortedMissions };
  } catch (err) {
    if (axios.isAxiosError<ErrorResponse>(err)) {
      return { error: err.response?.data } as ApiError;
    }
  }

  return unknownError;
};

export const joinTeam = async (inviteCode: string) => {
  try {
    const response = await instance.post<CommonMutationData>(
      "/api/teams/join",
      { inviteCode },
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

export type GetMyStatsData = {
  totalRank: number;
  playerCount: number;
  totalCount: number;
  wonCount: number;
  characters: {
    id: string;
    totalCount: number;
    wonCount: number;
  }[];
};

export const getMyStats = async () => {
  const response = await instance.get<GetMyStatsData>("/api/me/stats");

  const { data } = response;
  return data;
};

export type CommonLeaderboardPayload = {
  offset: number;
  schoolArea: "all" | "north" | "central" | "south" | "other";
  schoolType: "all" | "highSchool" | "college";
  limit?: number;
  school: string;
};

export type PlayerLeaderboardPayLoad = CommonLeaderboardPayload & {
  keyword: string;
};

export type PlayerLeaderboardItem = {
  id: string;
  riotId: string;
  school: string;
  score: number;
  tier: number;
  image: string | null;
  totalRank: number;
  schoolRank: number;
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
  qs.append("school", payload.school || "");
  qs.append("schoolArea", payload.schoolArea || "all");
  qs.append("schoolType", payload.schoolType || "all");

  const response = await instance.get<GetPlayerLeaderboard>(
    `/api/leaderboard/player?${qs}`,
  );

  const { data } = response;
  return data;
};

export type TeamLeaderboardPayLoad = CommonLeaderboardPayload & {
  keyword: string;
  school: string;
};

export type TeamLeaderboardItem = {
  id: string;
  name: string;
  school: string;
  score: number;
  totalRank: number;
  schoolRank: number;
  title: string | null;
};

type GetTeamLeaderboard = {
  data: TeamLeaderboardItem[];
  total: number;
};

export const getTeamLeaderboard = async (payload: TeamLeaderboardPayLoad) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  qs.append("limit", `${payload.limit || 12}`);
  qs.append("keyword", payload.keyword || "");
  qs.append("school", payload.school || "");
  qs.append("schoolArea", payload.schoolArea || "all");
  qs.append("schoolType", payload.schoolType || "all");

  const response = await instance.get<GetTeamLeaderboard>(
    `/api/leaderboard/team?${qs}`,
  );

  const { data } = response;
  return data;
};

export type SchoolLeaderboardItem = {
  school: string;
  score: number;
  totalRank: number;
};

type GetSchoolLeaderboard = {
  data: SchoolLeaderboardItem[];
  total: number;
};

export const getSchoolLeaderboard = async (
  payload: CommonLeaderboardPayload,
) => {
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  qs.append("limit", `${payload.limit || 12}`);
  qs.append("school", payload.school || "");
  qs.append("schoolArea", payload.schoolArea || "all");
  qs.append("schoolType", payload.schoolType || "all");

  const response = await instance.get<GetSchoolLeaderboard>(
    `/api/leaderboard/school?${qs}`,
  );

  const { data } = response;
  return data;
};

type GetHonorRollPayload = {
  offset: number;
  limit: number;
  keyword: string;
  type: string;
};

export type HonorRollItem = {
  id: string;
  name: string;
  title: string;
  image: string | null;
  school: string;
};

type GetHonorRollData = {
  data: HonorRollItem[];
  total: number;
};

export const getHonorRoll = async (payload: GetHonorRollPayload) => {
  const { type } = payload;
  const qs = new URLSearchParams();
  qs.append("offset", `${payload.offset || 0}`);
  qs.append("limit", `${payload.limit || 12}`);
  qs.append("keyword", payload.keyword || "");

  const response = await instance.get<GetHonorRollData>(
    `/api/leaderboard/honor-roll/${type}?${qs}`,
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

type GetMyLeaderboardData = {
  player: PlayerLeaderboardItem | null;
  team: TeamLeaderboardItem | null;
  school: SchoolLeaderboardItem | null;
};

export const getMyLeaderboard = async () => {
  const response =
    await instance.get<GetMyLeaderboardData>(`/api/me/leaderboard`);

  const { data } = response;
  return data;
};

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
