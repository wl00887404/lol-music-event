import type { Reward } from "@/apis";
import { imgUri } from "@/libs/uris";

export const getIconSrc = (key: string) => {
  return imgUri(`/rewards/icons/${key.replace("free-", "paid-")}.png`);
};

const meta: Record<string, number[]> = {
  "ahri-skin-2018-title.png": [487 * 0.8, 64 * 0.8],
  "akali-skin-2018-title.png": [545 * 0.8, 64 * 0.8],
  "akali-skin-2019-title.png": [800, 66],
  "aphelios-skin-2023-title.png": [692, 64],
  "caps-hall-of-legends-bundle-title.png": [772, 64],
  "classic-mode-bundle-title.png": [465 * 0.8, 58 * 0.8],
  "dj-sona-figure-title.png": [337 * 0.8, 58 * 0.8],
  "evelynn-skin-2018-title.png": [545, 64],
  "ezreal-skin-2023-title.png": [692, 64],
  "heart-steel-poster-title.png": [480 * 0.8, 58 * 0.8],
  "heart-steel-usb-title.png": [621, 58],
  "kaisa-skin-2018-title.png": [487 * 0.8, 64 * 0.8],
  "kda-cd-ahri-title.png": [913, 63],
  "kda-cd-akali-title.png": [971, 63],
  "kda-cd-blades-title.png": [1047, 63],
  "kda-cd-evelynn-title.png": [971, 63],
  "kda-cd-kaisa-title.png": [913, 63],
  "kda-cdc-blades-title.png": [994, 124],
  "kda-poster-title.png": [393 * 0.8, 63 * 0.8],
  "kda-vinyl-title.png": [390 * 0.72, 63 * 0.72],
  "kkbox-title.png": [651, 81],
  "ksante-skin-2023-title.png": [634, 64],
  "loser-title.png": [411 * 0.8, 141 * 0.8],
  "lottery-ticket-title.png": [251 * 0.8, 81 * 0.8],
  "paid-ball-title.png": [512, 58],
  "paid-box-title.png": [601, 59],
  "paid-idol-box-title.png": [539, 103],
  "paid-idol-card-title.png": [763, 103],
  "paid-my-card-150-title.png": [937, 65],
  "paid-my-card-300-title.png": [937, 65],
  "qiyana-skin-2019-title.png": [800, 65],
  "senna-skin-2019-title.png": [742, 65],
  "sett-skin-2023-title.png": [574, 64],
  "teemo-hat-title.png": [174 * 0.8, 58 * 0.8],
  "tibbers-blind-box-title.png": [424 * 0.72, 58 * 0.72],
  "tibbers-plush-title.png": [307 * 0.8, 58 * 0.8],
  "true-damage-poster-title.png": [648, 66],
  "true-damage-vinyl-title.png": [645, 66],
  "worlds-2026-collector-box-title.png": [704, 58],
  "yasuo-skin-2019-title.png": [742, 66],
  "yone-skin-2023-title.png": [574, 64],
};

export const getTitleSrc = (key: string) => {
  const fileName = `${key.replace("free-", "paid-")}-title.png`;
  const width = meta[fileName]?.[0] || undefined;
  const height = meta[fileName]?.[1] || undefined;

  return {
    src: imgUri(`/rewards/titles/${fileName}`),
    width,
    height,
  };
};

export const getClaimedMerchButtonText = (reward: Reward) => {
  return reward.buttonText ? reward.buttonText : "專人處理中";
};
