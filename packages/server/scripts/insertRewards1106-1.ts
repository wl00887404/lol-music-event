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

const boxCodes = getCodes("box");
const ballCodes = getCodes("ball");

const items = [
  {
    key: "maybe-next-time-emote",
    name: "下次囉 表情",
    count: 100,
    codes: getCodes("maybe-next-time-emote"),
  },
  {
    key: "stone-faced-emote",
    name: "傻眼石像 表情",
    count: 100,
    codes: getCodes("stone-faced-emote"),
  },
  {
    key: "abandoned-top-island-emote",
    name: "上路孤島 表情",
    count: 100,
    codes: getCodes("abandoned-top-island-emote"),
  },
  {
    key: "okay-emote",
    name: "OK 表情",
    count: 100,
    codes: getCodes("okay-emote"),
  },
  {
    key: "unworthy-emote",
    name: "不值得 表情",
    count: 100,
    codes: getCodes("unworthy-emote"),
  },
  {
    key: "pcs-emotes-hps-arghhh",
    name: "PCS：HPS 表情",
    count: 14,
    codes: getCodes("pcs-emotes-hps-arghhh"),
  },
  {
    key: "paid-idol-card-extra",
    name: "限量社群小卡盲盒包（加碼）",
    isMerch: true,
    count: 1200,
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
          return i.key + "-" + j;
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

  // while (true) {
  //   console.log("start:", start);
  //   batch = values.slice(start, start + page);
  //   if (batch.length === 0) break;
  //   await db.insert(rewardTable).values(batch).onConflictDoNothing();
  //   start += page;
  //   await new Promise((res) => setTimeout(res, 200));
  // }
}

insertRewards();
