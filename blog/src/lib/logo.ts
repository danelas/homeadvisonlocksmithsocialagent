// Crops a blog hero image to a clean 1200x630 OG ratio and composites the
// Home Advisor Locksmith logo into the bottom-right corner with a thin brand
// frame. If no logo exists at assets/logo.jpg the hero is still produced
// (just unbranded) so the agent never hard-fails on a missing logo.

import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";

const LOGO_PATH = resolve(process.cwd(), "assets/logo.jpg");

const TARGET_W = 1200;
const TARGET_H = 630;
const LOGO_WIDTH_PCT = 0.12;     // 12% of canvas width
const PADDING_PCT = 0.025;
const FRAME_PX = 4;
const FRAME_COLOR = { r: 200, g: 16, b: 46, alpha: 1 }; // #c8102e

export async function brandHero(srcPath: string, outPath: string): Promise<string> {
  await mkdir(dirname(outPath), { recursive: true });

  // Resize + cover-crop the source image to 1200x630.
  const cropped = await sharp(srcPath)
    .resize(TARGET_W, TARGET_H, { fit: "cover", position: "center" })
    .toBuffer();

  if (!existsSync(LOGO_PATH)) {
    console.warn(`[logo] no assets/logo.jpg — writing unbranded hero`);
    await sharp(cropped).jpeg({ quality: 88, mozjpeg: true }).toFile(outPath);
    return outPath;
  }

  const targetLogoWidth = Math.round(TARGET_W * LOGO_WIDTH_PCT);
  const innerLogoWidth = targetLogoWidth - FRAME_PX * 2;

  const framedLogo = await sharp(LOGO_PATH)
    .resize({ width: innerLogoWidth })
    .extend({
      top: FRAME_PX, bottom: FRAME_PX, left: FRAME_PX, right: FRAME_PX,
      background: FRAME_COLOR,
    })
    .png()
    .toBuffer();

  const meta = await sharp(framedLogo).metadata();
  const logoW = meta.width ?? targetLogoWidth;
  const logoH = meta.height ?? Math.round(targetLogoWidth * 0.625);

  const padding = Math.round(TARGET_W * PADDING_PCT);
  const top = TARGET_H - logoH - padding;
  const left = TARGET_W - logoW - padding;

  await sharp(cropped)
    .composite([{ input: framedLogo, top, left }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);

  return outPath;
}
