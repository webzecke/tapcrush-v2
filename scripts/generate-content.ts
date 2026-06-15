import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { characters } from "../lib/schema";
import type { NewCharacter } from "../lib/schema";
import { generateJSON, logUsage } from "../lib/llm";
import { batchSchema, type Companion } from "../lib/content-schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: { characters } });

const BATCH_SIZE = 10;
const AFFILIATE_BASE = "https://placeholder.com/ref/tapcrush";

type Locale = "de" | "en";
const LANG_LABEL: Record<Locale, string> = {
  de: "German (Deutsch)",
  en: "English",
};

function parseArgs(): { count: number; languages: Locale[] } {
  const args = process.argv.slice(2);
  let count = 80;
  let languages: Locale[] = ["de", "en"];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count") count = Number(args[++i]);
    else if (args[i] === "--languages") {
      languages = args[++i]
        .split(",")
        .map((s) => s.trim())
        .filter((s): s is Locale => s === "de" || s === "en");
    }
  }

  if (!Number.isInteger(count) || count <= 0) throw new Error("--count must be a positive integer");
  if (languages.length === 0) throw new Error("--languages must include de and/or en");

  return { count, languages };
}

function kebab(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomSeed(): number {
  return Math.floor(Math.random() * 9_000_000) + 1_000_000;
}

function buildPrompt(count: number, language: Locale): string {
  return `You are generating fictional AI companion profiles for "Tapcrush", an AI companion discovery site (18+).

Generate exactly ${count} DISTINCT companions. Return ONLY valid JSON of this exact shape:
{"companions":[{ "name": string, "age": number, "style": "realistic"|"anime"|"illustrated"|"3d", "personality": string[], "useCase": string[], "narrativeHook": string, "prompt": string, "chatPreview": [{"role":"assistant"|"user","text":string}], "seoTitle": string, "seoDescription": string }]}

Rules:
- LANGUAGE: narrativeHook, chatPreview text, seoTitle and seoDescription MUST be written in ${LANG_LABEL[language]}.
- personality (3-6) and useCase (2-4): always lowercase ENGLISH tags (e.g. "shy", "playful", "dominant", "emotional-support", "flirting").
- prompt: the IMAGE prompt, always in ENGLISH, language-neutral. Photorealistic/anime portrait description, tasteful and elegant, end with "no nudity". No real person names.
- age: a plausible adult age between 18 and 35.
- chatPreview: 4-6 lines, START with an "assistant" line (a hook/opener), then alternate with 2-3 "user" lines and a closing "assistant" line. In ${LANG_LABEL[language]}.
- narrativeHook: one short emotional sentence in ${LANG_LABEL[language]}.
- seoTitle <= 60 chars, seoDescription <= 155 chars, both in ${LANG_LABEL[language]}.
- Names must be diverse and unique within the batch. Vary the vibe (romantic, playful, deep, bold, nerdy, mysterious, etc.).`;
}

function toNewCharacter(c: Companion, language: Locale): NewCharacter {
  const slug = `${kebab(c.name)}-${kebab(c.personality[0])}-${language}`;
  const id = slug;
  const label =
    language === "de" ? `${c.name} auf Candy AI treffen` : `Meet ${c.name} on Candy AI`;

  // `age` is intentionally dropped – no column in the characters table.
  return {
    id,
    slug,
    name: c.name,
    seed: randomSeed(),
    style: c.style,
    personality: c.personality,
    useCase: c.useCase,
    language: [language],
    narrativeHook: c.narrativeHook,
    prompt: c.prompt,
    portraitUrl: "",
    chatPreview: c.chatPreview,
    affiliatePlatform: "candy-ai",
    affiliateUrl: `${AFFILIATE_BASE}?utm_source=tapcrush&utm_medium=char&utm_campaign=${id}`,
    affiliateLabel: label,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
  };
}

async function main() {
  const { count, languages } = parseArgs();
  console.log(`🏭 Generating ${count} companions across [${languages.join(", ")}]...\n`);

  const seenSlugs = new Set<string>();
  let inserted = 0;

  for (const language of languages) {
    // Split the total evenly across languages.
    const perLang = Math.ceil(count / languages.length);
    let remaining = perLang;
    console.log(`\n🌐 ${LANG_LABEL[language]} — target ${perLang}`);

    while (remaining > 0) {
      const batchCount = Math.min(BATCH_SIZE, remaining);
      remaining -= batchCount;

      let companions: Companion[];
      try {
        const raw = await generateJSON(buildPrompt(batchCount, language));
        const parsed = batchSchema.safeParse(raw);
        if (!parsed.success) {
          console.log(`  ⚠️  Batch skipped — invalid output: ${parsed.error.issues[0]?.message}`);
          continue;
        }
        companions = parsed.data.companions;
      } catch (err) {
        console.log(`  ❌ Batch failed: ${(err as Error).message}`);
        continue;
      }

      const rows = companions
        .map((c) => toNewCharacter(c, language))
        .filter((row) => {
          if (seenSlugs.has(row.slug)) return false;
          seenSlugs.add(row.slug);
          return true;
        });

      if (rows.length === 0) continue;

      const result = await db
        .insert(characters)
        .values(rows)
        .onConflictDoNothing()
        .returning({ id: characters.id });

      inserted += result.length;
      for (const r of result) console.log(`  ✅ ${r.id}`);
    }
  }

  console.log(`\n🎉 Inserted ${inserted} new companions.`);
  logUsage();
  console.log("👉 Next: run `npx tsx scripts/generate-images.ts` to generate portraits.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
