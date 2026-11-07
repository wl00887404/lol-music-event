import { readFileSync } from "fs";
import { resolve } from "path";
import { reward as rewardTable } from "../src/models/schema.ts";
import { db } from "../src/db.ts";
import { range } from "../src/libs/lodash.ts";

const getCodes = (key: string) => {
  const path = `./codes/${key}.txt`;
  const content = readFileSync(resolve(import.meta.dirname, path), {
    encoding: "utf-8",
  });
  return content.trim().split("\n");
};

const moreBoxCodes = getCodes("more-box");
const boxCodes = getCodes("box");
const ballCodes = getCodes("ball");

const items = [
  {
    key: "paid-box",
    name: "海克斯科技鑰匙 & 寶箱",
    count: 21_000,
    codes: boxCodes.slice(0, 21_000),
  },
  {
    key: "more-box",
    name: "海克斯科技鑰匙 & 寶箱（備用）",
    count: 3_998,
    codes: moreBoxCodes.slice(0, 3_998),
  },
  {
    key: "paid-ball",
    name: "世界大賽晶球",
    count: 10_000,
    codes: ballCodes.slice(0, 10_000),
  },
  {
    key: "ezreal-skin-2023",
    name: "心鋼之聲 伊澤瑞爾 造型 (2023)",
    count: 15,
    codes: getCodes("ezreal-skin-2023"),
  },
  {
    key: "yone-skin-2023",
    name: "心鋼之聲 犽凝 造型 (2023)",
    count: 15,
    codes: getCodes("yone-skin-2023"),
  },
  {
    key: "ksante-skin-2023",
    name: "心鋼之聲 卡桑帝 造型 (2023)",
    count: 15,
    codes: getCodes("ksante-skin-2023"),
  },
  {
    key: "sett-skin-2023",
    name: "心鋼之聲 賽特 造型 (2023)",
    count: 15,
    codes: getCodes("sett-skin-2023"),
  },
  {
    key: "aphelios-skin-2023",
    name: "心鋼之聲 亞菲利歐 造型 (2023)",
    count: 15,
    codes: getCodes("aphelios-skin-2023"),
  },
  {
    key: "ahri-skin-2018",
    name: "K/DA 阿璃 造型 (2018)",
    count: 15,
    codes: getCodes("ahri-skin-2018"),
  },
  {
    key: "akali-skin-2018",
    name: "K/DA 阿卡莉 造型 (2018)",
    count: 15,
    codes: getCodes("akali-skin-2018"),
  },
  {
    key: "evelynn-skin-2018",
    name: "K/DA 伊芙琳 造型 (2018)",
    count: 15,
    codes: getCodes("evelynn-skin-2018"),
  },
  {
    key: "kaisa-skin-2018",
    name: "K/DA 凱莎 造型 (2018)",
    count: 15,
    codes: getCodes("kaisa-skin-2018"),
  },
  {
    key: "yasuo-skin-2019",
    name: "True Damage 犽宿 造型 (2019)",
    count: 15,
    codes: getCodes("yasuo-skin-2019"),
  },
  {
    key: "senna-skin-2019",
    name: "True Damage 姍娜 造型 (2019)",
    count: 15,
    codes: getCodes("senna-skin-2019"),
  },
  {
    key: "akali-skin-2019",
    name: "True Damage 阿卡莉 造型 (2019)",
    count: 15,
    codes: getCodes("akali-skin-2019"),
  },
  {
    key: "qiyana-skin-2019",
    name: "True Damage 姬亞娜 造型 (2019)",
    count: 15,
    codes: getCodes("qiyana-skin-2019"),
  },
  {
    key: "paid-idol-box",
    name: "大混戰音樂季 典藏箱",
    isMerch: true,
    count: 10,
  },
];

const dd: any = [];

async function insertRewards() {
  const values = items
    .map((i) => {
      const codes = [];

      if (Array.isArray(i.codes)) {
        codes.push(...i.codes);
      }

      if (i.isMerch) {
        const mockCodes = range(i.count).map((j) => {
          return i.key + "-1106-" + j;
        });

        codes.push(...mockCodes);
      }

      dd.push({
        name: i.name,
        count: codes.length,
      });

      return codes.map((c) => {
        return {
          key: i.key,
          code: c,
        };
      });
    })
    .flat();

  let start = 0;
  let page = 200;
  let batch = [];

  console.table(dd);

  while (true) {
    console.log("start:", start);
    batch = values.slice(start, start + page);
    if (batch.length === 0) break;
    await db.insert(rewardTable).values(batch).onConflictDoNothing();
    start += page;
    await new Promise((res) => setTimeout(res, 200));
  }
}

insertRewards();
