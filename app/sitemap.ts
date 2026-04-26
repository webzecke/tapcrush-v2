import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { characters } from "@/lib/schema";

export const revalidate = 3600;

const BASE = "https://tapcrush.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await db.select({ slug: characters.slug }).from(characters);

  const feedUrls = rows.map(({ slug }) => ({
    url: `${BASE}/feed/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const characterUrls = rows.map(({ slug }) => ({
    url: `${BASE}/character/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const chatUrls = rows.map(({ slug }) => ({
    url: `${BASE}/chat/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: `${BASE}/`,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...feedUrls,
    ...characterUrls,
    ...chatUrls,
  ];
}
