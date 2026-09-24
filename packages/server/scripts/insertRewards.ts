import { readFileSync } from "fs";
import { resolve } from "path";
import { reward as rewardTable } from "../src/models/schema.ts";
import { db } from "../src/db.ts";

async function insertRewards() {
  const rawData = readFileSync(resolve(import.meta.dirname, "./code.csv"), {
    encoding: "utf-8",
  });

  const rows = rawData
    .split("\n")
    .map((row) => row.split(",").map((col) => col.trim()))
    .slice(3);

  const values = rows.flatMap((cols) => {
    return [
      { type: "slime-mosh-buddy", code: cols[0] },
      { type: "the-perfect-shot", code: cols[2] },
      { type: "bust-a-move-spray", code: cols[4] },
    ];
  });

  for (const v of values) {
    await db.insert(rewardTable).values(v);
  }
}

insertRewards();
