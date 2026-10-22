import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync } from "node:fs";

const inputPath = new URL("./rewards.csv", import.meta.url);
const outputPath = new URL("./output.json", import.meta.url);

const records = parse(readFileSync(inputPath), {
  columns: true, // 第一行當屬性名稱
  skip_empty_lines: true,
  bom: true, // 處理 Excel 匯出的 UTF-8 BOM
});

const nameMap: Record<string, string> = {
  "ezreal-skin-2023": "心鋼之聲 伊澤瑞爾 造型 (2023)",
  "yone-skin-2023": "心鋼之聲 犽凝 造型 (2023)",
  "ksante-skin-2023": "心鋼之聲 卡桑帝 造型 (2023)",
  "sett-skin-2023": "心鋼之聲 賽特 造型 (2023)",
  "aphelios-skin-2023": "心鋼之聲 亞菲利歐 造型 (2023)",
  "ahri-skin-2018": "K/DA 阿璃 造型 (2018)",
  "akali-skin-2018": "K/DA 阿卡莉 造型 (2018)",
  "evelynn-skin-2018": "K/DA 伊芙琳 造型 (2018)",
  "kaisa-skin-2018": "K/DA 凱莎 造型 (2018)",
  "yasuo-skin-2019": "True Damage 犽宿 造型 (2019)",
  "senna-skin-2019": "True Damage 姍娜 造型 (2019)",
  "akali-skin-2019": "True Damage 阿卡莉 造型 (2019)",
  "qiyana-skin-2019": "True Damage 姬亞娜 造型 (2019)",
  "paid-my-card-150": "MyCard 150 點（英雄聯盟專用點數）",
  "paid-my-card-300": "MyCard 300 點（英雄聯盟專用點數）",
  "kda-cdc-blades": "K/DA FIRESTARTER CD 典藏套組\n（BLADES 版）",
  "heart-steel-usb": "心鋼之聲 滑板造型 USB",
  "caps-hall-of-legends-bundle": "傳奇殿堂 Caps 帽子 + 滑鼠墊",
};

type CsvRow = {
  虛寶: string;
  價值: string;
  換算台幣: string;
  分數: string;
  ID: string;
  獎品: string;
  整體數量: string;
  兌換限制: string;
  說明文字: string;
  提供單位: string;
  提供狀況: string;
  素材照片: string;
  "": string;
};

const paidReward = (records as unknown as CsvRow[])
  .map((r) => {
    const getLimit = () => {
      if (r.兌換限制.includes("一次")) {
        return 1;
      }

      if (r.兌換限制.includes("兩次")) {
        return 2;
      }

      return Infinity;
    };

    return {
      key: r.ID,
      name: nameMap[r.ID] || r.獎品,
      description: r.說明文字
        .replace(/Mycard 300點/g, "MyCard 300 點")
        .replace(/Mycard 150點/g, "MyCard 150 點")
        .replace(/Mycard/g, "MyCard")
        .replace(/） 序/g, "）序")
        .replace(/心鋼之聲 滑板造型USB/g, "心鋼之聲 滑板造型 USB")
        .replace(/帽子\+滑鼠墊/, "帽子 + 滑鼠墊")
        .replace(/2026世界大賽晶球/g, "2026 世界大賽晶球"),
      price: parseInt(r.分數.replace("Pts", "")),
      limit: getLimit(),
    };
  })
  .filter((r) => r.key);

writeFileSync(outputPath, JSON.stringify(paidReward, null, 2));
