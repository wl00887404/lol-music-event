export const Team = {
  kda: "kda",
  heartSteel: "heart-steel",
  trueDamage: "true-damage",
} as const;

export type Team = (typeof Team)[keyof typeof Team];
