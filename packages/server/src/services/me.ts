import { db } from "../db.ts";
import { user as userTable } from "../models/auth-schema.ts";

const resetIsUpdating = async () => {
  await db.update(userTable).set({ isUpdating: false });
};

export const meService = { resetIsUpdating };
