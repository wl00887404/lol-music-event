import { expect, test, afterAll } from "vitest";
import ajax from "./ajax.ts";
import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";
import { eq } from "drizzle-orm";
import { head } from "../libs/lodash.ts";

const CSRF_TOKEN =
  "ea79541f75ae67a719814aa20050644b0f34056423df5430542ad21b647a01e5" as const;

// 用以測試後恢復資料
let me: any;

test("Complete User Data", async () => {
  // const headers: Record<string, string> = {
  //   cookie:
  //     `__Secure-better-auth.session_token=${process.env.SESSION_TOKEN_FOR_TEST}` +
  //     ";" +
  //     `csrf_token=${CSRF_TOKEN}`,
  //   "x-csrf-token": CSRF_TOKEN,
  //   origin: process.env.BASE_URL_FOR_TEST!,
  // };
  // const { data } = await ajax.get("/api/me", { headers });
  // me = await db
  //   .select()
  //   .from(userTable)
  //   .where(eq(userTable.id, data.id))
  //   .then(head);
  // const shortPuuid = data.puuid.slice(0, 12);
  // await db
  //   .update(userTable)
  //   .set({
  //     school: null,
  //     phone: null,
  //     email: `${shortPuuid}@placeholder.com`,
  //     isCompleted: false,
  //   })
  //   .where(eq(userTable.id, me.id));
  // const payload = {
  //   school: "不存在的學校",
  //   phone: me.phone,
  //   email: me.email,
  //   inviteCode: me.inviteCode,
  //   isTermsAndPrivacyAccepted: false,
  //   isOver15: false,
  //   consentVersion: "1.0",
  // };
  // const response1 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response1.status).toBe(430);
  // expect(response1.data.code).toBe("TOO_YOUNG");
  // payload.isOver15 = true;
  // const response2 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response2.status).toBe(430);
  // expect(response2.data.code).toBe("CONSENT_REQUIRED");
  // payload.isTermsAndPrivacyAccepted = true;
  // const response3 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response3.status).toBe(422);
  // expect(response3.data.code).toBe("SCHOOL_NOT_FOUND");
  // payload.school = "國立中興大學";
  // const response4 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response4.status).toBe(400);
  // expect(response4.data.code).toBe("CANNOT_USE_OWN_INVITE_CODE");
  // delete payload.inviteCode;
  // const response5 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response5.status).toBe(200);
  // const response6 = await ajax.post("/api/me/complete-user-data", payload, {
  //   headers,
  // });
  // expect(response6.status).toBe(409);
  // expect(response6.data.code).toBe("USER_DATA_ALREADY_COMPLETED");
});

afterAll(async () => {
  await db.update(userTable).set(me).where(eq(userTable.id, me.id));
});
