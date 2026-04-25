import { db } from "@/lib/db";
import { characters } from "@/lib/schema";
import { asc } from "drizzle-orm";
import CharacterCard from "@/components/CharacterCard";

export const revalidate = 3600;

export default async function HomePage() {
  const allCharacters = await db
    .select()
    .from(characters)
    .orderBy(asc(characters.createdAt));

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tight text-white">
            Tap<span className="text-pink-500">crush</span>
          </span>
          <p className="text-zinc-500 text-sm hidden sm:block">
            Your AI crush, one tap away
          </p>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
          Meet your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            AI crush
          </span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          Discover companions that actually listen — romantic, playful, deep, or
          bold. One tap away.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allCharacters.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-zinc-600 text-xs">
        <p>© {new Date().getFullYear()} Tapcrush · AI companion discovery</p>
        <p className="mt-1">All characters are fictional AI companions. 18+ only.</p>
      </footer>
    </main>
  );
}
