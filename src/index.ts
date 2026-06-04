import dotenv from "dotenv";
dotenv.config({ override: true });

import { resolve } from "node:path";
import { SERVICES, BRAND } from "./content/services.ts";
import { loadState, recordPublish, saveState } from "./lib/state.ts";
import { postImage } from "./lib/uploadpost.ts";
import { generateImage } from "./lib/image.ts";
import { composeFlyer } from "./lib/flyer.ts";
import type { Service, PublishedRecord } from "./lib/types.ts";

const DRY_RUN = process.argv.includes("--dry-run");
const PRINT_NEXT = process.argv.includes("--print-next");

const PREVIEW_DIR = resolve(process.cwd(), "preview");

function captionFor(service: Service): string {
  const tags = service.hashtags.map((h) => `#${h}`).join(" ");
  return `${service.caption}\n\n📞 ${BRAND.phoneDisplay} · FREE service call with any job — mention ${BRAND.promo}\n\n${tags}`;
}

/**
 * Rotate through the service catalog. The Nth post (by published count) maps to
 * SERVICES[N % length], so the agent cycles through every job type forever —
 * it never "runs out", and each run generates a brand-new background image.
 */
function pickService(publishedCount: number): { service: Service; runIndex: number } {
  const runIndex = publishedCount;
  const service = SERVICES[runIndex % SERVICES.length];
  return { service, runIndex };
}

async function main(): Promise<void> {
  console.log(`[agent] dry-run=${DRY_RUN} print-next=${PRINT_NEXT}`);

  const state = await loadState();
  console.log(`[agent] state: ${state.published.length} flyers posted so far`);

  const { service, runIndex } = pickService(state.published.length);
  const id = `${service.id}-${String(runIndex).padStart(3, "0")}`;
  console.log(`[agent] next service: ${service.id} (run #${runIndex}) → "${service.headline.join(" ")}"`);
  console.log(`[agent] platforms: ${BRAND.platforms.join(", ")}`);

  if (PRINT_NEXT) {
    console.log("---");
    console.log(captionFor(service));
    console.log("---");
    return;
  }

  // 1) AI generates ONLY the photo background.
  const bgPath = await generateImage(service.bgPrompt, `${id}-bg.png`, "1024x1024");
  console.log(`[agent] background generated: ${bgPath}`);

  // 2) Composite the branded flyer (logo + headline + bullets + CALL NOW bar).
  const flyerPath = resolve(PREVIEW_DIR, `${id}-flyer.jpg`);
  await composeFlyer(bgPath, flyerPath, {
    headline: service.headline,
    subhead: service.subhead,
    bullets: service.bullets,
    area: BRAND.area,
    phone: BRAND.phone,
    tagline: BRAND.tagline,
  });
  console.log(`[agent] flyer composed: ${flyerPath}`);

  const caption = captionFor(service);

  if (DRY_RUN) {
    console.log(`[agent] dry-run — flyer saved to ${flyerPath}, not posting.`);
    console.log("---\n" + caption + "\n---");
    return;
  }

  let record: PublishedRecord;
  try {
    const result = await postImage({
      caption,
      title: service.headline.join(" "),
      mediaPath: flyerPath,
      platforms: [...BRAND.platforms],
    });
    record = { id, at: new Date().toISOString(), result };
    console.log(`[agent] ✅ posted "${id}"`);
  } catch (err) {
    const msg = (err as Error).message;
    console.error(`[agent] ❌ failed to post "${id}":`, msg);
    record = { id, at: new Date().toISOString(), error: msg };
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
