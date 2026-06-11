// Generates a 1200x630 blog hero via OpenAI gpt-image-1, writes PNG to disk.

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import OpenAI from "openai";

const PREVIEW_DIR = resolve(process.cwd(), "preview");

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const apiKey = (process.env.OPENAI_API_KEY ?? "").trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");
  _client = new OpenAI({ apiKey });
  return _client;
}

export async function generateHeroImage(prompt: string, outFilename: string): Promise<string> {
  const outPath = resolve(PREVIEW_DIR, outFilename);
  await mkdir(dirname(outPath), { recursive: true });

  // gpt-image-1's output-stage moderation stochastically rejects some
  // locksmith scenes (tools near locks read as break-in imagery). Retry once
  // with a bland backdrop so a flagged hero never kills the whole run.
  const SAFE_FALLBACK_PROMPT =
    "A clean, professional photograph of a modern building entrance with a glass door " +
    "in warm late-afternoon light, no people. Leave the bottom-right 15% of the frame " +
    "empty and uniform. Absolutely no text, letters, numbers, logos, or watermarks.";

  console.log(`[image] generating: "${prompt.slice(0, 100)}…"`);
  let resp: Awaited<ReturnType<OpenAI["images"]["generate"]>>;
  try {
    resp = await client().images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1536x1024",   // closest gpt-image-1 size to OG 1200x630 — we crop later
      quality: "medium",   // ~4x cheaper than high; fine for a blog hero
      n: 1,
    });
  } catch (err) {
    const e = err as { code?: string; error?: { code?: string } };
    if (e?.code !== "moderation_blocked" && e?.error?.code !== "moderation_blocked") throw err;
    console.warn("[image] prompt blocked by OpenAI moderation — retrying with the generic fallback");
    resp = await client().images.generate({
      model: "gpt-image-1",
      prompt: SAFE_FALLBACK_PROMPT,
      size: "1536x1024",
      quality: "medium",
      n: 1,
    });
  }
  const b64 = resp.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI did not return image bytes");
  const buf = Buffer.from(b64, "base64");
  await writeFile(outPath, buf);
  console.log(`[image] wrote ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  return outPath;
}
