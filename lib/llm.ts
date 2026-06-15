/**
 * OpenRouter wrapper for Tapcrush content generation.
 * OpenRouter is OpenAI-compatible REST – no SDK needed, plain fetch.
 *
 * Env:
 *   OPENROUTER_API_KEY   (required)
 *   OPENROUTER_MODEL     (optional, default below)
 *   OPENROUTER_PRICE_IN  (optional, USD per 1M input tokens – only for $ estimate)
 *   OPENROUTER_PRICE_OUT (optional, USD per 1M output tokens – only for $ estimate)
 */

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "deepseek/deepseek-v4-flash";
const TIMEOUT_MS = 60_000;

type Usage = { prompt_tokens: number; completion_tokens: number; total_tokens: number };

let totalPromptTokens = 0;
let totalCompletionTokens = 0;

type OpenRouterResponse = {
  choices: { message: { content: string } }[];
  usage?: Usage;
};

/**
 * Calls the LLM and returns parsed JSON. Validation against a schema is the
 * caller's job – this only guarantees the response is valid JSON.
 */
export async function generateJSON(prompt: string): Promise<unknown> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tapcrush.app",
        "X-Title": "Tapcrush Content Factory",
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as OpenRouterResponse;

  if (data.usage) {
    totalPromptTokens += data.usage.prompt_tokens;
    totalCompletionTokens += data.usage.completion_tokens;
  }

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned no content");

  return JSON.parse(content);
}

/** Logs accumulated token usage (and a $ estimate if price env vars are set). */
export function logUsage(): void {
  console.log(
    `🪙 Tokens: ${totalPromptTokens} in + ${totalCompletionTokens} out = ${
      totalPromptTokens + totalCompletionTokens
    } total`,
  );

  const priceIn = Number(process.env.OPENROUTER_PRICE_IN);
  const priceOut = Number(process.env.OPENROUTER_PRICE_OUT);
  if (priceIn > 0 || priceOut > 0) {
    const cost =
      (totalPromptTokens / 1_000_000) * (priceIn || 0) +
      (totalCompletionTokens / 1_000_000) * (priceOut || 0);
    console.log(`💵 Estimated cost: $${cost.toFixed(4)}`);
  }
}
