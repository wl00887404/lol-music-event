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

const items = [
  {
    key: "paid-my-card-150",
    name: "MyCard 150 點（英雄聯盟專用點數）",
    count: 300,
    codes: getCodes("my-card-150"),
  },
  {
    key: "hyperx-pulsefire-fuse",
    name: "HyperX Pulsefire Fuse 無線電競滑鼠",
    count: 2,
    isMerch: true,
  },
  {
    key: "hyperx-cloud-flight-2-wireless",
    name: "HyperX Cloud Flight 2 Wireless 無線電競耳機",
    count: 1,
    isMerch: true,
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
