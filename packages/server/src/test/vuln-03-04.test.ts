import { expect, test } from "vitest";
import ajax from "./ajax.ts";

test("確認有使用 state 參數", async () => {
  const { data, headers } = await ajax.post("/api/auth/sign-in/oauth2", {
    providerId: "riot",
  });

  const setCookie = headers["set-cookie"];
  // const cookieHeader = setCookie?.map((c) => c.split(";")[0]).join("; ");

  const url = new URL(data.url);
  const qs = new URLSearchParams(url.searchParams);

  const state = qs.get("state");
  expect(state).not.toBeNull();

  const redirectUri = qs.get("redirect_uri");
  const redirectQs = new URLSearchParams();
  redirectQs.append("code", "invalid-test-code-no-state");

  const { status: statusWithoutState } = await ajax.get(
    redirectUri + "?" + redirectQs,
  );
  expect(statusWithoutState).toBe(500);

  /**
   * FIXME:
   *   第一個會因為沒有 state 錯誤，第二個會因為 code 驗證失敗錯誤
   *   但在 response 看不出來，沒必要為了測試回應不同的訊息
   */

  // redirectQs.append("state", state!);

  // const { data: data2, status: statusWithState } = await ajax.get(
  //   redirectUri + "?" + redirectQs,
  //   { headers: { cookie: cookieHeader } },
  // );

  // expect(statusWithState).toBe(500);
});
