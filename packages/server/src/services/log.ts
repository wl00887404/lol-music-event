import { db } from "../db.ts";
import { log } from "../models/schema.ts";

async function insert(...messages: string[]) {
  const message = messages.join(" ");

  if (process.env.NODE_ENV === "production") {
    await db.insert(log).values({ message: message });
  } else {
    console.log(message);
  }
}

export const logService = { insert };
