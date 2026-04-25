"use client";

import type { Character } from "@/lib/schema";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

export default function FeedClient({
  characters,
  startSlug,
}: {
  characters: Character[];
  startSlug: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef(new Map<string, HTMLDivElement>());

  const ordered = useMemo(() => {
    // Stabil: startSlug falls vorhanden zuerst, danach der Rest in bestehender Reihenfolge
    const idx = characters.findIndex((c) => c.slug === startSlug);
    if (idx <= 0) return characters;
    return [characters[idx], ...characters.slice(0, idx), ...characters.slice(idx + 1)];
  }, [characters, startSlug]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = itemRefs.current.get(startSlug);
    if (!el) return;

    // Beim ersten Render sauber auf startSlug springen
    requestAnimationFrame(() => {
      el.scrollIntoView({ block: "start" });
    });
  }, [startSlug]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { slug: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const ratio = entry.intersectionRatio;
          if (ratio < 0.5) continue;
          const slug = (entry.target as HTMLElement).dataset.slug;
          if (!slug) continue;
          if (!best || ratio > best.ratio) best = { slug, ratio };
        }

        if (best) {
          window.history.replaceState(null, "", `/feed/${best.slug}`);
        }
      },
      { root: container, threshold: [0, 0.5, 0.75, 1] },
    );

    const els = Array.from(itemRefs.current.values());
    for (const el of els) observer.observe(el);

    return () => observer.disconnect();
  }, [ordered]);

  return (
    <main className="bg-black min-h-dvh">
      <div className="min-h-dvh flex">
        {/* Left desktop sidebar */}
        <aside className="hidden lg:flex flex-1 justify-end">
          <div className="w-[320px] p-6 text-zinc-400">
            <div className="sticky top-6 space-y-3">
              <div className="text-white text-2xl font-black tracking-tight">
                Tap<span className="text-pink-500">crush</span>
              </div>
              <p className="text-sm text-zinc-500">Swipe. Tap. Meet your AI crush.</p>
            </div>
          </div>
        </aside>

        {/* Center feed column */}
        <div className="w-full max-w-[420px] h-dvh mx-auto">
          <div
            ref={containerRef}
            className="h-dvh overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
            }}
          >
            {ordered.map((c) => (
              <CharacterFeedItem
                key={c.id}
                character={c}
                setRef={(el) => {
                  if (!el) return;
                  itemRefs.current.set(c.slug, el);
                }}
              />
            ))}
          </div>
        </div>

        {/* Right desktop sidebar */}
        <aside className="hidden lg:flex flex-1">
          <div className="w-[320px] p-6 text-zinc-400">
            <div className="sticky top-6">
              <div className="h-[calc(100dvh-48px)] rounded-2xl bg-black border border-zinc-900" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function CharacterFeedItem({
  character,
  setRef,
}: {
  character: Character;
  setRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={setRef}
      data-slug={character.slug}
      className="relative h-dvh snap-start bg-black"
    >
      {/* Portrait */}
      {character.portraitUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={character.portraitUrl}
          alt={character.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-900">
          <span className="text-8xl font-black text-zinc-700 select-none">
            {character.name.slice(0, 1)}
          </span>
        </div>
      )}

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black via-black/60 to-transparent" />

      {/* Left-bottom overlay */}
      <div className="absolute left-4 bottom-28 right-20">
        <div className="text-white text-4xl font-black tracking-tight drop-shadow">
          {character.name}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {character.personality.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25 capitalize backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right icon rail */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-4">
        <IconLink href={`/character/${character.slug}`} label="Profil">
          <ProfileIcon />
        </IconLink>
        <IconLink href={`/chat/${character.slug}`} label="Chat">
          <ChatIcon />
        </IconLink>
        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: character.seoTitle,
                text: character.seoDescription,
                url: window.location.href,
              });
            } else {
              void navigator.clipboard?.writeText(window.location.href);
            }
          }}
          className="w-12 h-12 rounded-full bg-zinc-950/60 border border-zinc-800 text-white flex items-center justify-center hover:bg-zinc-900/70 transition-colors"
          aria-label="Share"
        >
          <ShareIcon />
        </button>
      </div>

      {/* CTA */}
      <div className="absolute inset-x-4 bottom-6">
        <a
          href={character.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full text-center py-4 px-6 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.01]"
        >
          {character.affiliateLabel}
        </a>
      </div>
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="w-12 h-12 rounded-full bg-zinc-950/60 border border-zinc-800 text-white flex items-center justify-center hover:bg-zinc-900/70 transition-colors"
      aria-label={label}
      title={label}
    >
      {children}
    </Link>
  );
}

function ProfileIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 21a8 8 0 1 0-16 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 1 1 18 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 8a3 3 0 1 0-2.83-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 12l6-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9 12l6 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M18 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
