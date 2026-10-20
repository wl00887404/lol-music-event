import { Team } from "@/types";

export const Tab = {
  all: "all",
  ...Team,
} as const;

export type Tab = (typeof Tab)[keyof typeof Tab];
