import { Session } from "better-auth";
import { user as userTable } from "../models/auth-schema.ts";
import { type InferSelectModel } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      session?: Session;
      user: InferSelectModel<typeof userTable>;
    }
  }
}
