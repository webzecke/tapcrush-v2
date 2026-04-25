import { db } from "@/lib/db";
import { characters } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import FeedClient from "@/components/FeedClient";
import type { Character } from "@/lib/schema";

export const revalidate = 3600;

export async function generateStaticParams() {
  const rows = await db.select({ slug: characters.slug }).from(characters);
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [character] = await db
    .select({
      seoTitle: characters.seoTitle,
      seoDescription: characters.seoDescription,
      portraitUrl: characters.portraitUrl,
    })
    .from(characters)
    .where(eq(characters.slug, slug))
    .limit(1);

  if (!character) return {};

  return {
    title: character.seoTitle,
    description: character.seoDescription,
    openGraph: {
      title: character.seoTitle,
      description: character.seoDescription,
      images: character.portraitUrl ? [character.portraitUrl] : [],
    },
  };
}

export default async function FeedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allCharacters: Character[] = await db.select().from(characters);

  return <FeedClient characters={allCharacters} startSlug={slug} />;
}
