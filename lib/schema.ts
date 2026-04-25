import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const styleEnum = pgEnum("style", [
  "anime",
  "realistic",
  "illustrated",
  "3d",
]);

export const characters = pgTable("characters", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  seed: integer("seed").notNull(),
  style: styleEnum("style").notNull(),
  personality: jsonb("personality").notNull().$type<string[]>(),
  useCase: jsonb("use_case").notNull().$type<string[]>(),
  language: jsonb("language").notNull().$type<string[]>(),
  narrativeHook: text("narrative_hook").notNull(),
  prompt: text("prompt").notNull(),
  portraitUrl: text("portrait_url").notNull(),
  chatPreview: jsonb("chat_preview").notNull().$type<{ role: string; text: string }[]>(),
  affiliatePlatform: text("affiliate_platform").notNull(),
  affiliateUrl: text("affiliate_url").notNull(),
  affiliateLabel: text("affiliate_label").notNull(),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
