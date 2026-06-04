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

export async function generateImage(
  prompt: string,
  outFilename: string,
  size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024"
): Promise<string> {
  const outPath = resolve(PREVIEW_DIR, outFilename);
  await mkdir(dirname(outPath), { recursive: true });

  console.log(`[image] generating: "${prompt.slice(0, 100)}…" (${size})`);
  const resp = await client().images.generate({
    model: "gpt-image-1",
    prompt,
    size,
    n: 1,
  });
  const b64 = resp.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI did not return image bytes");
  const buf = Buffer.from(b64, "base64");
  await writeFile(outPath, buf);
  console.log(`[image] wrote ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  return outPath;
}
