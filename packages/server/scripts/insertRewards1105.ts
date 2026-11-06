import { readFileSync } from "fs";
import { resolve } from "path";
import { reward as rewardTable } from "../src/models/schema.ts";
import { db } from "../src/db.ts";
import { range } from "../src/libs/lodash.ts";

const read = (path: string) => {
  return readFileSync(resolve(import.meta.dirname, path), {
    encoding: "utf-8",
  });
};

const boxCodes = read("./codes/box.txt").trim().split("\n");
const ballCodes = read("./codes/ball.txt").trim().split("\n");

const items = [
  // {
  //   key: "paid-box",
  //   name: "海克斯科技鑰匙 & 寶箱",
  //   count: 21_000,
  //   codes: boxCodes.slice(0, 21_000),
  // },
  {
    key: "free-box",
    name: "海克斯科技鑰匙 & 寶箱（抽獎）",
    count: 1,
    codes: boxCodes.slice(0, 0 + 1),
  },
  // {
  //   key: "paid-ball",
  //   name: "世界大賽晶球",
  //   count: 10_000,
  //   codes: ballCodes.slice(0, 10_000),
  // },
  {
    key: "free-ball",
    name: "世界大賽晶球（抽獎）",
    count: 4_999,
    codes: ballCodes.slice(0, 0 + 4_999),
  },
];

const dd: any = [];

async function insertRewards() {
  const values = items
    .map((i) => {
      const codes = [];
      // if (typeof i.codes === "string") {
      //   codes.push(...i.codes.trim().split("\n"));
      // }

      if (Array.isArray(i.codes)) {
        codes.push(...i.codes);
      }

      // if (i.isMerch) {
      //   const mockCodes = range(i.count).map((j) => {
      //     return i.key + "-" + j;
      //   });

      //   codes.push(...mockCodes);
      // }

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
