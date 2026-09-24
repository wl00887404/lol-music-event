import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { reward as rewardTable } from "../models/schema.ts";
import { eq } from "drizzle-orm";
import { head } from "../libs/lodash.ts";

type RewardsSetting = {
  type: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  getFinishStatus: (soloMissionScore: number) => {
    finishedCount: number;
    totalCount: number;
  };
};

const rewardsSettingMap: Record<string, RewardsSetting> = {
  "hang-time-buddy": {
    type: "hang-time-buddy",
    name: "懸吊樹懶 吊飾",
    image: "/rewards/solo-20.webp",
    icon: "/rewards/solo-20-icon.webp",
    description: "榮譽積分達到 20 即可領取",
    getFinishStatus: (soloMissionScore) => {
      return {
        finishedCount: soloMissionScore,
        totalCount: 20,
      };
    },
  },
  "pixel-moments-pearl": {
    type: "pixel-moments-pearl",
    name: "像素混戰：深海遺珠 玩家卡面",
    image: "/rewards/solo-50.webp",
    icon: "/rewards/solo-50-icon.webp",
    description: "榮譽積分達到 50 即可領取",
    getFinishStatus: (soloMissionScore) => {
      return {
        finishedCount: soloMissionScore,
        totalCount: 50,
      };
    },
  },
};

const rewardsSettings: RewardsSetting[] = [
  rewardsSettingMap["slime-mosh-buddy"],
  rewardsSettingMap["the-perfect-shot"],
  rewardsSettingMap["bust-a-move-spray"],
];

export type Reward = {
  type: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  finishedCount: number;
  totalCount: number;
  code: string | null;
};

export const rewardService = {
  checkClaimable: async (rewardType: string, userId: string) => {
    if (!(rewardType in rewardsSettingMap)) {
      throw new Error("查無此獎勵");
    }
    const missionResult = await db
      .select({
        soloMissionScore: userTable.score,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1)
      .then(head);

    const { finishedCount, totalCount } = rewardsSettingMap[
      rewardType
    ].getFinishStatus(missionResult.soloMissionScore || 0);

    return finishedCount >= totalCount;
  },
  toJson: async (userId: string): Promise<Reward[]> => {
    const missionResult = await db
      .select({
        soloMissionScore: userTable.score,
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1)
      .then(head);

    const rewardResults = await db
      .select({
        type: rewardTable.type,
        code: rewardTable.code,
      })
      .from(rewardTable)
      .where(eq(rewardTable.claimerId, userId));

    const codeMap: Record<string, string> = {};

    rewardResults.forEach((rewardResult) => {
      codeMap[rewardResult.type] = rewardResult.code;
    });

    return rewardsSettings.map((rewardsSetting) => {
      return {
        type: rewardsSetting.type,
        name: rewardsSetting.name,
        description: rewardsSetting.description,
        image: rewardsSetting.image,
        icon: rewardsSetting.icon,
        code: codeMap[rewardsSetting.type] || null,
        ...rewardsSetting.getFinishStatus(missionResult.soloMissionScore || 0),
      };
    });
  },
  getName: (rewardType: string) => {
    if (rewardType in rewardsSettingMap) {
      return rewardsSettingMap[rewardType].name;
    }

    return rewardType;
  },
};
