"use client";

import type { Character } from "@/lib/schema";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type ScriptRole = "ai" | "user" | "blur";
type ScriptLine = { role: string; text: string };
type ChatMessage = { id: string; role: "ai" | "user"; text: string };

function normalizeRole(role: string): ScriptRole | null {
  const r = role.toLowerCase();
  if (r === "ai" || r === "assistant") return "ai";
  if (r === "user") return "user";
  if (r === "blur") return "blur";
  return null;
}

function getNextAiIndex(script: ScriptLine[], fromIndex: number) {
  for (let i = fromIndex; i < script.length; i++) {
    const role = normalizeRole(script[i]?.role ?? "");
    if (role === "ai") return i;
    if (role === "blur") return i;
  }
  return -1;
}

function getOptions(script: ScriptLine[], fromIndex: number) {
  const options: { index: number; text: string }[] = [];
  for (let i = fromIndex; i < script.length; i++) {
    const role = normalizeRole(script[i]?.role ?? "");
    if (role === "user") {
      options.push({ index: i, text: script[i]!.text });
      continue;
    }
    if (role === "ai" || role === "blur") break;
  }
  return options.slice(0, 3);
}

export default function ChatClient({ character }: { character: Character }) {
  const script = useMemo(() => character.chatPreview as ScriptLine[], [character.chatPreview]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [blurred, setBlurred] = useState(false);
  const [started, setStarted] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
  }, [messages, typing, blurred]);

  // Start: first AI message after 800ms (typing first)
  useEffect(() => {
    if (started) return;
    setStarted(true);

    const first = getNextAiIndex(script, 0);
    if (first < 0) return;

    setTyping(true);
    const t = window.setTimeout(() => {
      const role = normalizeRole(script[first]!.role);
      if (role === "blur") {
        setTyping(false);
        setBlurred(true);
        setCursor(first + 1);
        return;
      }

      setMessages([{ id: `ai-${first}`, role: "ai", text: script[first]!.text }]);
      setTyping(false);
      setCursor(first + 1);
    }, 800);

    return () => window.clearTimeout(t);
  }, [script, started]);

  const options = useMemo(() => {
    if (blurred) return [];
    if (typing) return [];
    if (messages.length === 0) return [];
    return getOptions(script, cursor);
  }, [blurred, typing, messages.length, script, cursor]);

  const canChoose = options.length > 0;

  function chooseOption(optionIndex: number) {
    if (typing || blurred) return;

    const line = script[optionIndex];
    if (!line) return;
    if (normalizeRole(line.role) !== "user") return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${optionIndex}-${Date.now()}`, role: "user", text: line.text },
    ]);

    // Skip all remaining user-options until next AI/blur
    const nextAi = getNextAiIndex(script, optionIndex + 1);
    if (nextAi < 0) {
      setCursor(script.length);
      return;
    }

    setTyping(true);
    window.setTimeout(() => {
      const role = normalizeRole(script[nextAi]!.role);
      if (role === "blur") {
        setTyping(false);
        setBlurred(true);
        setCursor(nextAi + 1);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: `ai-${nextAi}-${Date.now()}`, role: "ai", text: script[nextAi]!.text },
      ]);
      setTyping(false);
      setCursor(nextAi + 1);
    }, 1000);
  }

  return (
    <main className="min-h-dvh bg-zinc-950 text-white flex justify-center">
      <div className="w-full max-w-[420px] min-h-dvh flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/60">
          <div className="h-14 px-4 flex items-center gap-3">
            <Link
              href={`/feed/${character.slug}`}
              className="text-zinc-300 hover:text-white text-sm transition-colors"
            >
              ← Feed
            </Link>
            <div className="flex-1 flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black">
                {character.name.slice(0, 1)}
              </div>
              <div className="leading-tight text-center">
                <div className="font-semibold text-white">{character.name}</div>
                <div className="text-[11px] text-zinc-500">AI Companion</div>
              </div>
            </div>
            <div className="w-[52px]" />
          </div>
        </header>

        {/* Chat area */}
        <div className="relative flex-1">
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto px-4 py-5 space-y-3 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} nameInitial={character.name.slice(0, 1)}>
                {m.text}
              </Bubble>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold">
                  {character.name.slice(0, 1)}
                </div>
                <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800 text-zinc-200">
                  <TypingDots />
                </div>
              </div>
            )}

            {canChoose && (
              <div className="pt-2 space-y-2">
                {options.map((o) => (
                  <button
                    key={o.index}
                    type="button"
                    onClick={() => chooseOption(o.index)}
                    className="w-full text-left px-4 py-3 rounded-2xl bg-pink-600/15 border border-pink-500/25 text-pink-100 hover:bg-pink-600/25 transition-colors"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
            )}

            {!typing && !blurred && messages.length > 0 && options.length === 0 && (
              <div className="pt-2 text-center text-xs text-zinc-600">
                No more options.
              </div>
            )}
          </div>

          {/* Blur + CTA */}
          {blurred && (
            <div className="absolute inset-0 z-30 flex items-end">
              <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
              <div className="relative w-full p-4 pb-6">
                <a
                  href={character.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="block w-full text-center py-4 px-6 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 hover:scale-[1.01]"
                >
                  {character.affiliateLabel}
                </a>
                <p className="text-center text-zinc-400 text-xs mt-3">
                  This is a preview. Continue on {character.affiliatePlatform} →
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Bubble({
  role,
  nameInitial,
  children,
}: {
  role: "ai" | "user";
  nameInitial: string;
  children: React.ReactNode;
}) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tr-sm bg-pink-600 text-white">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold">
        {nameInitial}
      </div>
      <div className="max-w-[78%] px-4 py-3 rounded-2xl rounded-tl-sm bg-zinc-800 text-zinc-200">
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:0ms]" />
      <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:150ms]" />
      <span className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
