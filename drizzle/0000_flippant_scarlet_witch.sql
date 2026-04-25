CREATE TYPE "public"."style" AS ENUM('anime', 'realistic', 'illustrated', '3d');--> statement-breakpoint
CREATE TABLE "characters" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"seed" integer NOT NULL,
	"style" "style" NOT NULL,
	"personality" jsonb NOT NULL,
	"use_case" jsonb NOT NULL,
	"language" jsonb NOT NULL,
	"narrative_hook" text NOT NULL,
	"prompt" text NOT NULL,
	"portrait_url" text NOT NULL,
	"chat_preview" jsonb NOT NULL,
	"affiliate_platform" text NOT NULL,
	"affiliate_url" text NOT NULL,
	"affiliate_label" text NOT NULL,
	"seo_title" text NOT NULL,
	"seo_description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "characters_slug_unique" UNIQUE("slug")
);
