import { db } from "@/lib/db";
import { characters, type Character } from "@/lib/schema";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChatClient from "@/components/ChatClient";

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

export default async function ChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [character]: Character[] = await db
    .select()
    .from(characters)
    .where(eq(characters.slug, slug))
    .limit(1);

  if (!character) notFound();

  return <ChatClient character={character} />;
}
