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
const boxCodes = read("./codes/box.txt")
  .trim()
  .split("\n")
  .map((l) => l.trim());

const items = [
  {
    key: "worlds-2026-collector-box",
    name: "2026 世界大賽 典藏版禮盒",
    count: 1,
    isMerch: true,
  },
  {
    key: "kda-cd-blades",
    name: "K/DA FIRESTARTER CD\n（BLADES 版）",
    count: 10,
    isMerch: true,
  },
  {
    key: "kda-cd-akali",
    name: "K/DA FIRESTARTER CD\n（阿卡莉版）",
    count: 10,
    isMerch: true,
  },
  {
    key: "kda-cd-evelynn",
    name: "K/DA FIRESTARTER CD\n（伊芙琳版）",
    count: 10,
    isMerch: true,
  },
  {
    key: "kda-cd-kaisa",
    name: "K/DA FIRESTARTER CD\n（凱莎版）",
    count: 10,
    isMerch: true,
  },
  {
    key: "kda-poster",
    name: "K/DA 海報掛軸",
    count: 10,
    isMerch: true,
  },
];

const dd: any = [];

async function insertRewards() {
  const values = items
    .map((i) => {
      const codes: any[] = [];
      // if (typeof i.codes === "string") {
      //   codes.push(...i.codes.trim().split("\n"));
      // }

      // if (Array.isArray(i.codes)) {
      //   codes.push(...i.codes);
      // }

      if (i.isMerch) {
        const mockCodes = range(i.count).map((j) => {
          return i.key + "-10-29-" + j;
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
