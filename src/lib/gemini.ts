import type { Lang } from "./types";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const BASE = "https://generativelanguage.googleapis.com/v1beta";

export const aiReady = Boolean(API_KEY);

export interface GeminiOptions {
  system?: string;
  json?: boolean;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Low-level Gemini text generation. Returns null when the key is missing or the
 * request fails, so callers can gracefully fall back to offline content.
 */
export async function generateText(
  prompt: string,
  opts: GeminiOptions = {}
): Promise<string | null> {
  if (!API_KEY) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(
      `${BASE}/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        cache: "no-store",
        body: JSON.stringify({
          systemInstruction: opts.system
            ? { parts: [{ text: opts.system }] }
            : undefined,
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: opts.temperature ?? 0.7,
            maxOutputTokens: opts.maxOutputTokens ?? 2048,
            ...(opts.json ? { responseMimeType: "application/json" } : {}),
          },
        }),
      }
    );
    if (!res.ok) {
      console.error("[gemini] HTTP", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const text = parts.map((p: { text?: string }) => p.text ?? "").join("");
    return text.trim() || null;
  } catch (err) {
    console.error("[gemini] request failed", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Generate and parse a JSON object response from Gemini. */
export async function generateJson<T>(
  prompt: string,
  opts: GeminiOptions = {}
): Promise<T | null> {
  const text = await generateText(prompt, { ...opts, json: true });
  if (!text) return null;
  return parseJson<T>(text);
}

export function parseJson<T>(text: string): T | null {
  const cleaned = text
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/[{[][\s\S]*[}\]]/);
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export function langName(lang: Lang) {
  return lang === "bn" ? "Bangla (Bengali)" : "English";
}
