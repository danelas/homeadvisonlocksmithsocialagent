// OpenAI image generation for posts whose media.source === "ai".
// Uses gpt-image-1, writes a PNG to disk, returns the path.

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

// gpt-image-1's safety system sometimes blocks service-trade scenes (e.g.
// close-ups of tools on locks read as break-in imagery). The block happens at
// the OUTPUT stage, so it's stochastic — the same prompt can pass one day and
// fail the next. When that happens we retry once with this deliberately bland
// background; every flyer composites its own text/logo on top of a dark scrim,
// so a generic backdrop still produces a usable post instead of a dead run.
const SAFE_FALLBACK_PROMPT =
  "A clean, professional photograph of a modern commercial building entrance " +
  "with glass doors in warm late-afternoon light, empty sidewalk, no people. " +
  "Absolutely no text, letters, numbers, logos, or watermarks anywhere in the image.";

function isModerationBlocked(err: unknown): boolean {
  const e = err as { code?: string; error?: { code?: string } };
  return e?.code === "moderation_blocked" || e?.error?.code === "moderation_blocked";
}

export async function generateImage(
  prompt: string,
  outFilename: string,
  size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024"
): Promise<string> {
  const outPath = resolve(PREVIEW_DIR, outFilename);
  await mkdir(dirname(outPath), { recursive: true });

  let resp: OpenAI.Images.ImagesResponse;
  console.log(`[image] generating: "${prompt.slice(0, 100)}…" (${size})`);
  try {
    resp = await client().images.generate({
      model: "gpt-image-1",
      prompt,
      size,
      // "medium" costs ~4x less than the default (high) and the difference is
      // invisible under the flyer's dark scrim + JPEG + GBP compression.
      quality: "medium",
      n: 1,
    });
  } catch (err) {
    if (!isModerationBlocked(err)) throw err;
    console.warn(
      `[image] prompt blocked by OpenAI moderation — retrying with the generic fallback background`
    );
    resp = await client().images.generate({
      model: "gpt-image-1",
      prompt: SAFE_FALLBACK_PROMPT,
      size,
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
