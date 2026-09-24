import { expect, test } from "vitest";
import ajax from "./ajax.ts";

test("limit 最大值限制為 12", async () => {
  // const qs = new URLSearchParams();
  // qs.append("offset", "0");
  // qs.append("limit", "114514");
  // qs.append("keyword", "");

  // const { data } = await ajax.get("/api/leaderboard/honor-roll/area?" + qs);

  // expect(data.data.length).toBe(12);
});

test("offset 不該為負數", async () => {
  // const qs = new URLSearchParams();
  // qs.append("offset", "-12");
  // qs.append("limit", "12");
  // qs.append("keyword", "");

  // const { data, status } = await ajax.get(
  //   "/api/leaderboard/honor-roll/area?" + qs,
  // );

  // expect(status).toBe(400);
  // expect(data.code).toBe("INVALID_OFFSET");
  // expect(data.data).toBeNullable();
});

test("未登入無法取得完整資料", async () => {
  // const qs = new URLSearchParams();
  // qs.append("offset", "0");
  // qs.append("limit", "12");
  // qs.append("keyword", "");

  // const { data } = await ajax.get("/api/leaderboard/honor-roll/area?" + qs);

  // data.data.forEach((item: any) => {
  //   let notHiddenCharCount = 0;
  //   for (const char of item.name) {
  //     if (char !== "*") {
  //       notHiddenCharCount++;
  //     }
  //   }
  //   expect(notHiddenCharCount).toBe(2);
  //   expect(item.image).toBe(null);
  // });
});

// test("Api 限制流量", async () => {
//   const qs = new URLSearchParams();
//   qs.append("offset", "0");
//   qs.append("limit", "12");
//   qs.append("keyword", "");

//   const results: Record<string, number> = {};
//   const requests = Array.from({ length: 120 }, () => {
//     return ajax
//       .get("/api/leaderboard/honor-roll/area?" + qs)
//       .then(({ status }) => {
//         if (results[status] === undefined) {
//           results[status] = 0;
//         }

//         results[status]++;
//       });
//   });

//   await Promise.all(requests);

//   expect(results["429"]).toBeGreaterThan(0);
// });
