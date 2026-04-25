import { db } from "@/lib/db";
import { characters } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

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
    .select()
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

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [character] = await db
    .select()
    .from(characters)
    .where(eq(characters.slug, slug))
    .limit(1);

  if (!character) notFound();

  const {
    name,
    personality,
    narrativeHook,
    portraitUrl,
    chatPreview,
    affiliateUrl,
    affiliateLabel,
  } = character;

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Back nav */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          >
            ← Back
          </Link>
          <span className="text-zinc-700">|</span>
          <span className="text-white font-semibold">{name}</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Portrait */}
        <div className="relative rounded-3xl overflow-hidden aspect-[3/4] mb-8 bg-zinc-900 border border-zinc-800">
          {portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portraitUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-9xl font-black text-zinc-700">{name[0]}</span>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          {/* Name overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-4xl font-black text-white mb-3">{name}</h1>
            <div className="flex flex-wrap gap-2">
              {personality.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/25 capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Narrative hook */}
        <p className="text-xl text-zinc-200 font-medium leading-relaxed mb-8 text-center">
          &ldquo;{narrativeHook}&rdquo;
        </p>

        {/* Chat preview */}
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 mb-4 font-semibold">
            Preview
          </h2>
          <div className="space-y-3">
            {chatPreview.map((msg, i) => {
              const isLast = i === chatPreview.length - 1;
              const isUser = msg.role === "user";

              return (
                <div
                  key={i}
                  className={`relative flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-pink-500/20 text-pink-100 rounded-tr-sm"
                        : "bg-zinc-800 text-zinc-200 rounded-tl-sm"
                    } ${isLast ? "select-none" : ""}`}
                  >
                    {msg.text}

                    {/* Blur overlay on last message */}
                    {isLast && (
                      <div className="absolute inset-0 rounded-2xl backdrop-blur-sm bg-zinc-950/40 flex items-center justify-center">
                        <span className="text-xs text-zinc-400 font-medium">
                          Continue on Candy AI →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full text-center py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.01]"
        >
          {affiliateLabel}
        </a>

        {/* Disclaimer */}
        <p className="text-center text-zinc-600 text-xs mt-4">
          This is a preview. Meet {name} on Candy AI →
        </p>
      </div>
    </main>
  );
}
