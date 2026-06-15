import { z } from "zod";

/**
 * Validates a single companion produced by the LLM.
 * Note: `age` is generated (18+ guard for an adult site) but is NOT persisted –
 * the `characters` table has no age column. It's dropped on DB insert.
 */
export const companionSchema = z.object({
  name: z.string().min(2).max(40),
  age: z.number().int().min(18).max(60),
  style: z.enum(["anime", "realistic", "illustrated", "3d"]),
  personality: z.array(z.string().min(2)).min(3).max(6),
  useCase: z.array(z.string().min(2)).min(2).max(4),
  narrativeHook: z.string().min(10).max(200),
  // Image prompt is language-neutral (English) so portraits are reusable.
  prompt: z.string().min(20),
  chatPreview: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().min(1),
      }),
    )
    .min(2)
    .max(8),
  seoTitle: z.string().min(10).max(70),
  seoDescription: z.string().min(20).max(160),
});

export type Companion = z.infer<typeof companionSchema>;

/** The LLM returns a batch wrapped in `{ companions: [...] }`. */
export const batchSchema = z.object({
  companions: z.array(companionSchema),
});
