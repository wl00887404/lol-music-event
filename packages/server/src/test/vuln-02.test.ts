import { expect, test } from "vitest";
import ajax from "./ajax.ts";

const CSRF_TOKEN =
  "ea79541f75ae67a719814aa20050644b0f34056423df5430542ad21b647a01e5" as const;

test("CSRF 防護", async () => {
  const headers: Record<string, string> = {
    cookie: `__Secure-better-auth.session_token=${process.env.SESSION_TOKEN_FOR_TEST}`,
  };
  const response1 = await ajax.post("/api/me/sync", {}, { headers });
  expect(response1.status).toBe(403);
  expect(response1.data.code).toBe("CSRF_ORIGIN_MISSING");

  headers.origin = "https://evil.example";
  const response2 = await ajax.post("/api/me/sync", {}, { headers });
  expect(response2.status).toBe(403);
  expect(response2.data.code).toBe("CSRF_ORIGIN_INVALID");

  headers.origin = process.env.BASE_URL_FOR_TEST!;
  const response3 = await ajax.post("/api/me/sync", {}, { headers });
  expect(response3.status).toBe(403);
  expect(response3.data.code).toBe("CSRF_TOKEN_MISMATCH");

  headers.cookie += ";csrf_token=" + CSRF_TOKEN;
  headers["x-csrf-token"] = CSRF_TOKEN;
  const response4 = await ajax.post("/api/me/sync", {}, { headers });
  expect(response4.status).toBe(200); 
});
