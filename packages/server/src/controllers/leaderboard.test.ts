import { expect, test } from "vitest";
import ajax from "../test/ajax.ts";

const CSRF_TOKEN =
  "ea79541f75ae67a719814aa20050644b0f34056423df5430542ad21b647a01e5" as const;
const headers: Record<string, string> = {
  cookie:
    `__Secure-better-auth.session_token=${process.env.SESSION_TOKEN_FOR_TEST}` +
    ";" +
    `csrf_token=${CSRF_TOKEN}`,
  "x-csrf-token": CSRF_TOKEN,
  origin: process.env.BASE_URL_FOR_TEST!,
};

function getStarCount(str: String) {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "*") count++;
  }
  return count;
}

// test.skip("玩家排行榜", async () => {
//   const { data: data1 } = await ajax.get("/api/leaderboard/player");
//   // console.log("玩家排行榜", data1.data[0]);

//   const firstRiotId1 = data1.data[0].riotId;
//   const starCount1 = getStarCount(firstRiotId1);
//   expect(firstRiotId1.length - starCount1).toBe(2);

//   const { data: data2 } = await ajax.get("/api/leaderboard/player", {
//     headers,
//   });

//   const firstRiotId2 = data2.data[0].riotId;
//   const starCount2 = getStarCount(firstRiotId2);
//   expect(starCount2).toBe(0);
// });

// test.skip("隊伍排行榜", async () => {
//   const { data } = await ajax.get("/api/leaderboard/team");

//   console.log("隊伍排行榜", data.data[0]);
// });

// test.skip("學校排行榜", async () => {
//   const { data } = await ajax.get("/api/leaderboard/school");

//   console.log("學校排行榜", data.data[0]);
// });

// test.skip("分區榮譽榜", async () => {
//   const { data: data1 } = await ajax.get("/api/leaderboard/honor-roll/area");

//   // console.log("分區榮譽榜", data.data[0]);

//   const firstRiotId1 = data1.data[0].name;
//   const starCount1 = getStarCount(firstRiotId1);
//   expect(firstRiotId1.length - starCount1).toBe(2);

//   const { data: data2 } = await ajax.get("/api/leaderboard/honor-roll/area", {
//     headers,
//   });

//   const firstRiotId2 = data2.data[0].name;
//   const starCount2 = getStarCount(firstRiotId2);
//   expect(starCount2).toBe(0);
// });

// test.skip("校園榮譽榜", async () => {
//   const { data } = await ajax.get("/api/leaderboard/honor-roll/school");

//   console.log("校園榮譽榜", data.data[0]);
// });

// test.skip("隊伍榮譽榜", async () => {
//   const { data } = await ajax.get("/api/leaderboard/honor-roll/team");

//   console.log("隊伍榮譽榜", data.data[0]);
// });
