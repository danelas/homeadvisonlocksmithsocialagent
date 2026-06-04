import dotenv from "dotenv";
dotenv.config({ override: true });

import { resolve } from "node:path";
import { writeFile, mkdir, access } from "node:fs/promises";
import { POSTS } from "./content/posts.ts";
import { loadState, hasPublished, recordPublish, saveState } from "./lib/state.ts";
import { postImage } from "./lib/uploadpost.ts";
import { generateImage } from "./lib/image.ts";
import { overlayLogo, brandedPathFor, logoExists } from "./lib/logo.ts";
import type { Post, Platform, PublishedRecord } from "./lib/types.ts";

const DRY_RUN = process.argv.includes("--dry-run");
const PRINT_NEXT = process.argv.includes("--print-next");

const ASSETS_DIR = resolve(process.cwd(), "assets");
const PREVIEW_DIR = resolve(process.cwd(), "preview");

function captionFor(post: Post, platform: Platform): string {
  const override = post.perPlatform?.[platform];
  const body = override?.caption ?? post.caption;
  const tags = override?.hashtags ?? post.hashtags;
  return `${body}\n\n${tags.map((h) => `#${h}`).join(" ")}`;
}

async function pathExists(p: string): Promise<boolean> {
  try { await access(p); return true; } catch { return false; }
}

async function resolveMedia(post: Post): Promise<string> {
  const m = post.media;
  if (m.source === "asset") {
    const path = resolve(ASSETS_DIR, m.path);
    if (!(await pathExists(path))) {
      throw new Error(`Asset not found: assets/${m.path} (referenced by post "${post.id}")`);
    }
    return path;
  }

  if (m.source === "url") {
    await mkdir(PREVIEW_DIR, { recursive: true });
    const fileName = `${post.id}.png`;
    const out = resolve(PREVIEW_DIR, fileName);
    console.log(`[media] downloading ${m.url} → ${out}`);
    const resp = await fetch(m.url);
    if (!resp.ok) throw new Error(`media download failed: ${resp.status}`);
    const buf = Buffer.from(await resp.arrayBuffer());
    await writeFile(out, buf);
    return out;
  }

  if (m.source === "ai") {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        `Post "${post.id}" needs AI image generation but OPENAI_API_KEY is not set. ` +
          `Either add the key or replace media.source with "asset" pointing at a manual file in /assets.`
      );
    }
    return await generateImage(m.prompt, `${post.id}.png`, m.size ?? "1024x1024");
  }

  throw new Error(`Unsupported media source for post "${post.id}"`);
}

async function main(): Promise<void> {
  console.log(`[agent] dry-run=${DRY_RUN} print-next=${PRINT_NEXT}`);

  const state = await loadState();
  console.log(`[agent] state: ${state.published.length} posts already published`);

  const next = POSTS.find((p) => !hasPublished(state, p.id));
  if (!next) {
    console.log("[agent] no posts left in the queue — add more to src/content/posts.ts");
    return;
  }
  console.log(`[agent] next post: ${next.id} (${next.title})`);
  console.log(`[agent] platforms: ${next.platforms.join(", ")}`);

  if (PRINT_NEXT) {
    console.log("---");
    console.log(captionFor(next, "instagram"));
    console.log("---");
    return;
  }

  const rawMediaPath = await resolveMedia(next);
  console.log(`[agent] media generated: ${rawMediaPath}`);

  // Brand every image with the Home Advisor Locksmith logo unless the post
  // opts out — or unless no logo file exists yet (drop one at assets/logo.jpg).
  let mediaPath = rawMediaPath;
  if (next.skipLogo) {
    console.log(`[agent] skipLogo=true — posting raw image unbranded`);
  } else if (!logoExists()) {
    console.warn(
      `[agent] no logo at assets/logo.jpg — posting unbranded. Drop your logo there to brand every image.`
    );
  } else {
    const brandedPath = brandedPathFor(rawMediaPath, PREVIEW_DIR, next.id);
    await overlayLogo(rawMediaPath, brandedPath, {
      corner: next.logoCorner ?? "bottom-right",
    });
    console.log(`[agent] branded: ${brandedPath}`);
    mediaPath = brandedPath;
  }

  if (DRY_RUN) {
    console.log(`[agent] dry-run — would post to ${next.platforms.join("+")}, captions below:`);
    for (const platform of next.platforms) {
      console.log(`\n[${platform}]\n${captionFor(next, platform)}\n`);
    }
    return;
  }

  // Upload-Post handles multiple platforms in a single call. We use the same
  // caption across IG / FB / Google Business to keep the call simple. If you
  // ever need per-platform copy, set post.perPlatform or split into one call
  // per platform.
  const caption = captionFor(next, "instagram");
  let record: PublishedRecord;
  try {
    const result = await postImage({
      caption,
      title: next.title,
      mediaPath,
      platforms: next.platforms,
    });
    record = { id: next.id, at: new Date().toISOString(), result };
    console.log(`[agent] ✅ posted "${next.id}"`);
  } catch (err) {
    const msg = (err as Error).message;
    console.error(`[agent] ❌ failed to post "${next.id}":`, msg);
    record = { id: next.id, at: new Date().toISOString(), error: msg };
  }

  const updated = recordPublish(state, record);
  await saveState(updated);
  console.log(`[agent] state updated: ${updated.published.length} entries`);

  if (record.error) process.exit(1);
}

main().catch((err) => {
  console.error("[agent] fatal:", err);
  process.exit(1);
});
