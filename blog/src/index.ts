import dotenv from "dotenv";
dotenv.config({ override: true });

import { resolve } from "node:path";
import { writeFile, mkdir } from "node:fs/promises";
import { TOPICS } from "./lib/topics.ts";
import { draftPost } from "./lib/anthropic.ts";
import { generateHeroImage } from "./lib/image.ts";
import { brandHero } from "./lib/logo.ts";
import { renderBlogPost } from "./lib/render.ts";
import { loadState, hasPublished, recordPublish, saveState } from "./lib/state.ts";
import {
  assertSiteDir,
  writePostFiles,
  writeBlogIndex,
  rebuildSitemap,
} from "./lib/publish.ts";
import type { PublishedRecord } from "./lib/types.ts";

const DRY_RUN = process.argv.includes("--dry-run");
const PRINT_NEXT = process.argv.includes("--print-next");

const PREVIEW_DIR = resolve(process.cwd(), "preview");
const SITE = (process.env.SITE_URL ?? "https://www.homeadvisorlocksmith.com").replace(/\/+$/, "");

async function main(): Promise<void> {
  console.log(`[blog] dry-run=${DRY_RUN} print-next=${PRINT_NEXT}`);

  const state = await loadState();
  console.log(`[blog] state: ${state.published.length} posts already published`);

  const next = TOPICS.find((t) => !hasPublished(state, t.id));
  if (!next) {
    console.log("[blog] no topics left in the queue — add more to src/lib/topics.ts");
    return;
  }

  console.log(`[blog] next topic: ${next.id} — "${next.title}"`);

  if (PRINT_NEXT) {
    console.log("---");
    console.log(JSON.stringify(next, null, 2));
    return;
  }

  // 1) Draft the post via Claude.
  console.log("[blog] drafting via Claude…");
  const post = await draftPost(next);
  console.log(`[blog] drafted "${post.title}" (slug=${post.slug}, ${post.sections.length} sections, ${post.faqs.length} faqs)`);

  // 2) Generate a hero image via OpenAI.
  console.log("[blog] generating hero image…");
  const rawHero = await generateHeroImage(post.heroImagePrompt, `${post.slug}-raw.png`);

  // 3) Crop to OG ratio + composite the logo overlay.
  const brandedHero = resolve(PREVIEW_DIR, `${post.slug}-hero.jpg`);
  await brandHero(rawHero, brandedHero);
  console.log(`[blog] branded hero: ${brandedHero}`);

  // 4) Render the post HTML.
  const publishedAt = new Date().toISOString();
  const html = renderBlogPost(post, publishedAt);

  // Save the rendered HTML + raw plan JSON to preview/ BEFORE anything that can
  // fail. The GitHub Actions preview artifact always contains the generated
  // article even if a later step fails — download it from Actions → Artifacts.
  await mkdir(PREVIEW_DIR, { recursive: true });
  await writeFile(resolve(PREVIEW_DIR, `${post.slug}.html`), html, "utf-8");
  await writeFile(resolve(PREVIEW_DIR, `${post.slug}.json`), JSON.stringify(post, null, 2), "utf-8");
  console.log(`[blog] preview saved: preview/${post.slug}.html`);

  if (DRY_RUN) {
    console.log("[blog] dry-run — not writing into site/. Drafted HTML length:", html.length, "chars");
    console.log("---");
    console.log("META TITLE:", post.title);
    console.log("META DESC :", post.metaDescription);
    console.log("SLUG      :", post.slug);
    console.log("FIRST 400 CHARS OF SECTION 1:", post.sections[0]?.body?.slice(0, 400));
    return;
  }

  // 5) Write the post into site/ (this repo). The workflow commits + pushes.
  assertSiteDir();
  const written = await writePostFiles({ postHtml: html, postSlug: post.slug, heroPath: brandedHero });
  console.log(`[blog] wrote ${written.relHtmlPath}`);

  // 6) Record the publish, then regenerate the blog index + sitemap from the
  // full list so older posts stay listed accurately.
  const newRecord: PublishedRecord = {
    topicId: next.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt,
    url: `${SITE}/blog/${post.slug}`,
  };
  const finalState = recordPublish(state, newRecord);

  await writeBlogIndex(finalState.published);
  await rebuildSitemap(finalState.published);
  console.log(`[blog] regenerated blog index + sitemap (${finalState.published.length} posts)`);

  // 7) Save state.json in THIS (blog) folder so the next run skips this topic.
  await saveState(finalState);
  console.log(`[blog] ✅ done — ${SITE}/blog/${post.slug}`);
  console.log(`[blog] state.json updated — ${finalState.published.length} total posts`);
}

main().catch((err) => {
  console.error("[blog] fatal:", err);
  process.exit(1);
});
