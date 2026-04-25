import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { characters } from "../lib/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  const chars = await db.select({
    id: characters.id,
    chatPreview: characters.chatPreview,
  }).from(characters).limit(3);

  for (const c of chars) {
    console.log(c.id, JSON.stringify(c.chatPreview, null, 2));
  }
}

main();
