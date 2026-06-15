/** Minimal UI translations – no framework, just key-value maps. */

export type Locale = "de" | "en";

const dict = {
  de: {
    chat: "Chatten",
    like: "Gefällt mir",
    continue: "Weitermachen",
    share: "Teilen",
    profile: "Profil",
    meet: "Kennenlernen",
    watch: "Ansehen",
    back: "Zurück",
    feed: "Feed",
    preview: "Vorschau",
    aiCompanion: "KI-Begleiterin",
    continueOn: "Weiter auf",
  },
  en: {
    chat: "Chat",
    like: "Like",
    continue: "Continue",
    share: "Share",
    profile: "Profile",
    meet: "Meet",
    watch: "Watch",
    back: "Back",
    feed: "Feed",
    preview: "Preview",
    aiCompanion: "AI Companion",
    continueOn: "Continue on",
  },
} as const;

export type UIKey = keyof (typeof dict)["en"];

export function t(locale: Locale, key: UIKey): string {
  return dict[locale][key];
}
