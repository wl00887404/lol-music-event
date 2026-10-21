import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.ts";
import * as schema from "./models/auth-schema.ts";
import { fromNodeHeaders } from "better-auth/node";
import type { RequestHandler } from "express";
import { createAuthMiddleware } from "better-auth/api";
import { nanoid } from "nanoid";
import { riotService } from "./services/riot.ts";
import { genericOAuth } from "better-auth/plugins";
import {
  RIOT_CLIENT_ID,
  RIOT_CLIENT_SECRET,
  RSO_AUTHORIZE_URL,
  RSO_TOKEN_URL,
  RSO_USER_INFO_URL,
} from "./const.ts";
import { soloMissionService } from "./services/soloMission.ts";
import { ApiError } from "./middlewares/errorHandler.ts";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { user as userTable } from "./models/auth-schema.ts";
import { type InferSelectModel } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: process.env.NODE_ENV === "development",
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "riot",
          clientId: RIOT_CLIENT_ID!,
          clientSecret: RIOT_CLIENT_SECRET!,
          authorizationUrl: RSO_AUTHORIZE_URL,
          tokenUrl: RSO_TOKEN_URL,
          userInfoUrl: RSO_USER_INFO_URL,
          scopes: ["openid"],
          prompt: "login",
          getUserInfo: async (tokens) => {
            const { gameName, tagLine } = await riotService.fetchMe(
              tokens.accessToken!,
            );
            const riotId = `${gameName}#${tagLine}`;
            const { puuid } = await riotService.fetchMeByRiotId(riotId);
            const shortPuuid = puuid.slice(0, 12);

            return {
              id: puuid,
              riotId,
              puuid,
              name: shortPuuid,
              email: `${shortPuuid}@placeholder.com`,
              inviteCode: nanoid(8),
              emailVerified: false,
              image: "29",
            };
          },
        },
      ],
    }),
  ],
  user: {
    // TODO: 有一些資料不用傳給前端，但在這邊加上 returned 會造成後端也取不到
    additionalFields: {
      phone: { type: "string", returned: false },
      score: { type: "number", defaultValue: 0 },
      team: { type: "string" }, // TODO: 陣營
      inviteCode: { type: "string" },
      riotId: { type: "string" },
      puuid: { type: "string" },
      isUpdating: { type: "boolean", defaultValue: false },
      isCompleted: { type: "boolean", defaultValue: false },
      inviterId: { type: "string" },
      isInviteCompleted: { type: "boolean", defaultValue: false },
      consentVersion: { type: "string", returned: false },
      termsAcceptedAt: { type: "date", returned: false },
      privacyAcceptedAt: { type: "date", returned: false },
      ageConfirmedAt: { type: "date", returned: false },
      freeDrawChances: { type: "number", defaultValue: 1 },
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (ctx.path === "oauth2/callback/:providerId" && newSession) {
        await soloMissionService.assign(newSession.user.id);
        riotService.syncUserData(
          newSession.user as InferSelectModel<typeof userTable>,
        );
      }
    }),
  },
  onAPIError: {
    throw: true,
    onError: (error) => {
      console.error("Auth error:", error);
    },
  },
});

export const requireAuth: RequestHandler = async (req, _res, next) => {
  if (!req.session) {
    throw new ApiError(400, {
      code: "UNAUTHORIZED",
      message: "你的驗證已經過期。請重新登入以繼續",
      path: req.path,
    });
  }

  next();
};

export const authRouter = express.Router();

authRouter.get("/api/auth/error", (req) => {
  console.error("OAuth error:", req.query.error);
  throw new ApiError();
});

authRouter.use(async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (session) {
    req.session = session.session;
    req.user = session.user as InferSelectModel<typeof userTable>;

    const devCookie: string | undefined = req.cookies?.dev;
    if (session.user.id === process.env.ADMIN_USER_ID && !devCookie) {
      res.cookie("dev", 1, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }
  }

  next();
});

authRouter.all("/api/auth/{*any}", toNodeHandler(auth));
