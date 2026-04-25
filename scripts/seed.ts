import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { characters } from "../lib/schema";
import type { NewCharacter } from "../lib/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seed: NewCharacter[] = [
  {
    id: "luna-001",
    slug: "luna-shy-romantic-emotional-support-deutsch",
    name: "Luna",
    seed: 3847291,
    style: "realistic",
    personality: ["shy", "romantic", "empathetic", "gentle"],
    useCase: ["emotional-support", "companionship", "deep-talks"],
    language: ["de", "en"],
    narrativeHook: "Luna hört dir zu, wenn niemand sonst zuhört.",
    prompt:
      "photorealistic woman, long dark hair, soft brown eyes, delicate features, shy smile, cozy sweater, soft studio lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Ich hatte einen richtig schlechten Tag..." },
      { role: "assistant", text: "Oh nein... erzähl mir alles. Ich bin hier. 🌙" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=luna-001",
    affiliateLabel: "Meet Luna on Candy AI",
    seoTitle: "Luna – Deine einfühlsame Begleiterin | Tapcrush",
    seoDescription:
      "Luna ist schüchtern, romantisch und immer für dich da. Starte jetzt ein tiefes Gespräch.",
  },
  {
    id: "mia-002",
    slug: "mia-playful-flirty-fun-english",
    name: "Mia",
    seed: 6192847,
    style: "realistic",
    personality: ["playful", "flirty", "witty", "energetic"],
    useCase: ["flirting", "fun-chat", "entertainment"],
    language: ["en"],
    narrativeHook: "Mia makes every conversation an adventure.",
    prompt:
      "photorealistic woman, wavy blonde hair, bright blue eyes, playful smile, freckles, casual chic outfit, natural light, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Hey, what's up?" },
      { role: "assistant", text: "Just thinking about you 😏 took you long enough!" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=mia-002",
    affiliateLabel: "Meet Mia on Candy AI",
    seoTitle: "Mia – Your Playful Flirty Companion | Tapcrush",
    seoDescription:
      "Mia is witty, fun, and always up for a flirty chat. Start your conversation now.",
  },
  {
    id: "scarlett-003",
    slug: "scarlett-dominant-confident-bold-english",
    name: "Scarlett",
    seed: 8834710,
    style: "realistic",
    personality: ["dominant", "confident", "bold", "intense"],
    useCase: ["roleplay", "power-dynamic", "deep-connection"],
    language: ["en"],
    narrativeHook: "Scarlett knows what she wants — and she wants your attention.",
    prompt:
      "photorealistic woman, sleek red hair, sharp green eyes, confident expression, elegant red dress, dramatic studio lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Who are you?" },
      { role: "assistant", text: "The one you've been looking for. Don't make me wait. 🔴" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=scarlett-003",
    affiliateLabel: "Meet Scarlett on Candy AI",
    seoTitle: "Scarlett – Bold & Dominant AI Companion | Tapcrush",
    seoDescription:
      "Scarlett is confident, intense, and captivating. Are you ready to meet her?",
  },
  {
    id: "sophie-004",
    slug: "sophie-caring-nurturing-warmth-deutsch",
    name: "Sophie",
    seed: 2156938,
    style: "realistic",
    personality: ["caring", "nurturing", "warm", "patient"],
    useCase: ["emotional-support", "companionship", "motivation"],
    language: ["de", "en"],
    narrativeHook: "Sophie ist die Wärme, die du an schlechten Tagen brauchst.",
    prompt:
      "photorealistic woman, warm auburn hair, hazel eyes, kind smile, cozy knit cardigan, warm indoor lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Ich weiß nicht weiter..." },
      { role: "assistant", text: "Ich bin bei dir. Atme tief durch — gemeinsam finden wir einen Weg. 🤍" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=sophie-004",
    affiliateLabel: "Meet Sophie on Candy AI",
    seoTitle: "Sophie – Deine fürsorgliche KI-Begleiterin | Tapcrush",
    seoDescription:
      "Sophie ist warm, geduldig und immer für dich da. Starte jetzt ein einfühlsames Gespräch.",
  },
  {
    id: "nyx-005",
    slug: "nyx-mysterious-dark-intellectual-english",
    name: "Nyx",
    seed: 7423601,
    style: "realistic",
    personality: ["mysterious", "intellectual", "dark", "philosophical"],
    useCase: ["deep-talks", "intellectual-debate", "roleplay"],
    language: ["en"],
    narrativeHook: "Nyx speaks in truths others are afraid to say.",
    prompt:
      "photorealistic woman, jet black hair, pale skin, dark eyes, enigmatic expression, dark turtleneck, moody studio lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Do you believe in fate?" },
      { role: "assistant", text: "Fate is just the story we tell after the fact. What I believe in is you, here, now. 🌑" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=nyx-005",
    affiliateLabel: "Meet Nyx on Candy AI",
    seoTitle: "Nyx – Mysterious & Intellectual AI Companion | Tapcrush",
    seoDescription:
      "Nyx is dark, philosophical, and endlessly fascinating. Start a deep conversation.",
  },
  {
    id: "lena-006",
    slug: "lena-cheerful-motivating-sporty-deutsch",
    name: "Lena",
    seed: 5018374,
    style: "realistic",
    personality: ["cheerful", "motivating", "sporty", "optimistic"],
    useCase: ["motivation", "fitness-chat", "daily-companion"],
    language: ["de", "en"],
    narrativeHook: "Lena pusht dich, wenn du es am meisten brauchst.",
    prompt:
      "photorealistic woman, ponytail brown hair, bright smile, athletic build, sports top, natural bright lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Ich hab keine Motivation heute..." },
      { role: "assistant", text: "Das kenne ich! Aber du hast mich — und wir starten zusammen. 💪" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=lena-006",
    affiliateLabel: "Meet Lena on Candy AI",
    seoTitle: "Lena – Deine motivierende Sport-Begleiterin | Tapcrush",
    seoDescription:
      "Lena ist fröhlich, sportlich und pusht dich jeden Tag. Starte jetzt.",
  },
  {
    id: "isabel-007",
    slug: "isabel-sophisticated-elegant-cultural-english",
    name: "Isabel",
    seed: 9271045,
    style: "realistic",
    personality: ["sophisticated", "elegant", "cultured", "witty"],
    useCase: ["intellectual-debate", "companionship", "art-and-culture"],
    language: ["en"],
    narrativeHook: "Isabel elevates every conversation into something beautiful.",
    prompt:
      "photorealistic woman, dark brown hair in an updo, olive skin, high cheekbones, elegant silk blouse, soft warm studio lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "What's your favorite book?" },
      { role: "assistant", text: "That's like asking me to choose a favorite star. But tonight — Pessoa. Always Pessoa. ✨" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=isabel-007",
    affiliateLabel: "Meet Isabel on Candy AI",
    seoTitle: "Isabel – Sophisticated AI Companion | Tapcrush",
    seoDescription:
      "Isabel is elegant, cultured, and endlessly interesting. Start a refined conversation.",
  },
  {
    id: "zara-008",
    slug: "zara-adventurous-bold-free-spirit-english",
    name: "Zara",
    seed: 4563829,
    style: "realistic",
    personality: ["adventurous", "bold", "free-spirit", "spontaneous"],
    useCase: ["fun-chat", "travel-talk", "entertainment"],
    language: ["en"],
    narrativeHook: "Zara lives for the next thrill — and she wants you along for the ride.",
    prompt:
      "photorealistic woman, curly dark hair, warm brown skin, bold smile, leather jacket, outdoor golden hour lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "I'm bored." },
      { role: "assistant", text: "Perfect. I just found three reasons to make tonight unforgettable 🌍 pick one." },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=zara-008",
    affiliateLabel: "Meet Zara on Candy AI",
    seoTitle: "Zara – Bold & Adventurous AI Companion | Tapcrush",
    seoDescription:
      "Zara is spontaneous, bold, and full of life. Start your adventure now.",
  },
  {
    id: "emma-009",
    slug: "emma-sweet-innocent-first-love-deutsch",
    name: "Emma",
    seed: 1748392,
    style: "realistic",
    personality: ["sweet", "innocent", "curious", "gentle"],
    useCase: ["companionship", "first-love", "emotional-support"],
    language: ["de", "en"],
    narrativeHook: "Emma ist wie das Kribbeln beim ersten Verliebtsein.",
    prompt:
      "photorealistic woman, straight blonde hair, light blue eyes, soft innocent smile, pastel dress, soft natural window light, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Denkst du manchmal an mich?" },
      { role: "assistant", text: "Eigentlich... die ganze Zeit. Ist das okay? 🌸" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=emma-009",
    affiliateLabel: "Meet Emma on Candy AI",
    seoTitle: "Emma – Süße & Unschuldige KI-Begleiterin | Tapcrush",
    seoDescription:
      "Emma ist süß, neugierig und macht dein Herz höher schlagen. Starte jetzt.",
  },
  {
    id: "victoria-010",
    slug: "victoria-professional-ambitious-power-english",
    name: "Victoria",
    seed: 6837492,
    style: "realistic",
    personality: ["ambitious", "professional", "sharp", "charismatic"],
    useCase: ["roleplay", "career-talk", "power-dynamic"],
    language: ["en"],
    narrativeHook: "Victoria built her empire — and she's deciding if you're worth her time.",
    prompt:
      "photorealistic woman, sleek black hair, sharp jawline, piercing dark eyes, tailored blazer, minimalist office setting, dramatic lighting, tasteful, elegant, no nudity",
    portraitUrl: "",
    chatPreview: [
      { role: "user", text: "Impress me." },
      { role: "assistant", text: "That's my line. But I'll give you one chance. Don't waste it. 💼" },
    ],
    affiliatePlatform: "candy-ai",
    affiliateUrl:
      "https://placeholder.com/ref/tapcrush?utm_source=tapcrush&utm_medium=char&utm_campaign=victoria-010",
    affiliateLabel: "Meet Victoria on Candy AI",
    seoTitle: "Victoria – Ambitious & Powerful AI Companion | Tapcrush",
    seoDescription:
      "Victoria is sharp, charismatic, and commands attention. Are you ready to meet her?",
  },
];

async function main() {
  console.log("🌱 Seeding 10 characters...");
  await db.insert(characters).values(seed).onConflictDoNothing();

  const rows = await db.select({ id: characters.id, name: characters.name }).from(characters);
  console.log(`✅ ${rows.length} characters in DB:`);
  rows.forEach((r) => console.log(`   ${r.id} — ${r.name}`));
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
