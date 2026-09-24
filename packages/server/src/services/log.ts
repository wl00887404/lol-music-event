import { db } from "../db.ts";
import { log } from "../models/schema.ts";

async function insert(...messages: string[]) {
  await db.insert(log).values({ message: messages.join(" ") });
}

export const logService = { insert };
