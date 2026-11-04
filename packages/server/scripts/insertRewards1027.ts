import { readFileSync } from "fs";
import { resolve } from "path";
import { reward as rewardTable } from "../src/models/schema.ts";
import { db } from "../src/db.ts";
import { range } from "../src/libs/lodash.ts";

// const read = (path: string) => {
//   return readFileSync(resolve(import.meta.dirname, path), {
//     encoding: "utf-8",
//   });
// };

const items = [
  {
    key: "true-damage-vinyl",
    name: "True Damage 黑膠唱片",
    count: 3,
    isMerch: true,
  },
  {
    key: "heart-steel-usb",
    name: "心鋼之聲 滑板造型 USB",
    count: 2,
    isMerch: true,
  },
  {
    key: "kda-vinyl",
    name: "K/DA 黑膠唱片",
    count: 3,
    isMerch: true,
  },
  {
    key: "kda-cdc-blades",
    name: "K/DA FIRESTARTER CD 典藏套組\n（BLADES 版）",
    count: 6,
    isMerch: true,
  },
  {
    key: "kda-cd-blades",
    name: "K/DA FIRESTARTER CD\n（BLADES 版）",
    count: 9,
    isMerch: true,
  },
  {
    key: "kda-cd-ahri",
    name: "K/DA FIRESTARTER CD\n（阿璃版）",
    count: 5,
    isMerch: true,
  },
  {
    key: "kda-cd-akali",
    name: "K/DA FIRESTARTER CD\n（阿卡莉版）",
    count: 5,
    isMerch: true,
  },
  {
    key: "kda-cd-evelynn",
    name: "K/DA FIRESTARTER CD\n（伊芙琳版）",
    count: 5,
    isMerch: true,
  },
  {
    key: "kda-cd-kaisa",
    name: "K/DA FIRESTARTER CD\n（凱莎版）",
    count: 5,
    isMerch: true,
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

      // if (Array.isArray(i.codes)) {
      //   codes.push(...i.codes);
      // }

      if (i.isMerch) {
        const mockCodes = range(i.count).map((j) => {
          return i.key + "-10-27-" + j;
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
