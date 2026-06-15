/**
 * Thin LLM provider wrapper.
 *
 * If AI_PROVIDER_API_KEY is set, calls the Anthropic Messages API.
 * If not, returns { available: false } so every feature can fall back to a
 * deterministic, clearly-labeled demo response. We NEVER fabricate research
 * citations or invent sources in either path.
 */

export type LlmResult =
  | { available: true; text: string }
  | { available: false; text: null };

const API_URL = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = "claude-sonnet-4-6";

export function aiConfigured(): boolean {
  return Boolean(process.env.AI_PROVIDER_API_KEY);
}

export async function runLlm(opts: {
  system: string;
  prompt: string;
  maxTokens?: number;
}): Promise<LlmResult> {
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  if (!apiKey) return { available: false, text: null };

  const model = process.env.AI_MODEL || DEFAULT_MODEL;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 1024,
        system: opts.system,
        messages: [{ role: "user", content: opts.prompt }],
      }),
    });
    if (!res.ok) return { available: false, text: null };
    const data = await res.json();
    const text = Array.isArray(data?.content)
      ? data.content
          .filter((b: { type?: string }) => b?.type === "text")
          .map((b: { text?: string }) => b.text ?? "")
          .join("\n")
          .trim()
      : "";
    if (!text) return { available: false, text: null };
    return { available: true, text };
  } catch {
    return { available: false, text: null };
  }
}

/** Safely parse a JSON object from model output that may be fenced. */
export function parseJsonLoose<T>(raw: string): T | null {
  try {
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}
