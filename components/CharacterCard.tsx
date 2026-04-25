import Link from "next/link";
import type { Character } from "@/lib/schema";

export default function CharacterCard({ character }: { character: Character }) {
  const { slug, name, personality, narrativeHook, portraitUrl, language } =
    character;

  return (
    <Link href={`/feed/${slug}`} className="group block">
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 transition-all duration-300 group-hover:border-pink-500/50 group-hover:shadow-[0_0_24px_rgba(236,72,153,0.15)]">
        {/* Portrait */}
        <div className="aspect-3/4 relative overflow-hidden bg-zinc-800">
          {portraitUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portraitUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl font-bold text-zinc-700 select-none">
                {name[0]}
              </span>
            </div>
          )}

          {/* Language badge */}
          <div className="absolute top-3 right-3 flex gap-1">
            {language.map((lang) => (
              <span
                key={lang}
                className="text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-zinc-300 px-2 py-0.5 rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-zinc-900 to-transparent" />
        </div>

        {/* Info */}
        <div className="p-4 -mt-2 relative">
          <h2 className="text-xl font-bold text-white mb-2">{name}</h2>

          {/* Personality tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {personality.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-zinc-400 text-sm leading-snug line-clamp-2">
            {narrativeHook}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Tap to meet her</span>
            <span className="text-pink-400 text-sm font-medium group-hover:translate-x-0.5 transition-transform">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
