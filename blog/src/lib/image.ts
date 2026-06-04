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

  console.log(`[image] generating: "${prompt.slice(0, 100)}…"`);
  const resp = await client().images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1536x1024",   // closest gpt-image-1 size to OG 1200x630 — we crop later
    n: 1,
  });
  const b64 = resp.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI did not return image bytes");
  const buf = Buffer.from(b64, "base64");
  await writeFile(outPath, buf);
  console.log(`[image] wrote ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  return outPath;
}
