import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { fal } from "@fal-ai/client";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { characters } from "../lib/schema";
import { eq, or, isNull } from "drizzle-orm";
import fs from "fs";
import path from "path";

fal.config({ credentials: process.env.FAL_KEY });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: { characters } });

async function downloadImage(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buffer);
}

async function generateForCharacter(character: {
  id: string;
  name: string;
  prompt: string;
  seed: number;
}): Promise<string> {
  const result = await fal.subscribe("fal-ai/flux/dev" as string, {
    input: {
      prompt: character.prompt,
      seed: character.seed,
      image_size: "portrait_4_3",
      num_images: 1,
      num_inference_steps: 28,
    },
    logs: false,
  });

  const imageUrl = (result.data as { images: { url: string }[] }).images[0].url;

  const localDir = path.join(process.cwd(), "public", "chars", character.id);
  const localPath = path.join(localDir, "portrait.webp");
  await downloadImage(imageUrl, localPath);

  return `/chars/${character.id}/portrait.webp`;
}

async function main() {
  const rows = await db
    .select({
      id: characters.id,
      name: characters.name,
      prompt: characters.prompt,
      seed: characters.seed,
      portraitUrl: characters.portraitUrl,
    })
    .from(characters)
    .where(or(isNull(characters.portraitUrl), eq(characters.portraitUrl, "")));

  if (rows.length === 0) {
    console.log("✅ All characters already have portraits.");
    return;
  }

  console.log(`🎨 Generating portraits for ${rows.length} characters...\n`);

  for (const char of rows) {
    process.stdout.write(`  ⏳ ${char.name} (seed: ${char.seed})... `);
    try {
      const portraitUrl = await generateForCharacter(char);
      await db
        .update(characters)
        .set({ portraitUrl })
        .where(eq(characters.id, char.id));
      console.log(`✅ ${portraitUrl}`);
    } catch (err) {
      console.log(`❌ Failed`);
      console.error(`     ${(err as Error).message}`);
    }
  }

  console.log("\n🎉 Done! All portraits generated.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
