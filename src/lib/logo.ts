// Composites the Home Advisor Locksmith logo onto any source image as a
// bottom-right badge with a thin brand-red frame. Runs on every post by
// default so every social image is branded with no manual prep.
//
// Why a frame: the source logo typically has a white background. On dark
// imagery the white BG reads as a clean badge; on light imagery it would
// blend in. A 4px frame guarantees the logo is always visible no matter what
// the AI generated underneath.

import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";

export const LOGO_PATH = resolve(process.cwd(), "assets/logo.jpg");

/** True if a brand logo file is present to overlay. */
export function logoExists(): boolean {
  return existsSync(LOGO_PATH);
}

// Tuning knobs — feel free to adjust.
const LOGO_WIDTH_PCT = 0.14;                              // 14% of image width
const PADDING_PCT    = 0.03;                              // 3% padding from edges
const FRAME_PX       = 4;                                 // brand border thickness
const FRAME_COLOR    = { r: 200, g: 16, b: 46, alpha: 1 }; // #c8102e (swap to your brand color)

export type LogoCorner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type OverlayOptions = {
  corner?: LogoCorner;
  /** Override the percent (0–1) of image width the logo occupies. */
  widthPct?: number;
};

/**
 * Returns the path of a new branded image. Source image is not modified.
 */
export async function overlayLogo(
  srcPath: string,
  outPath: string,
  opts: OverlayOptions = {}
): Promise<string> {
  await mkdir(dirname(outPath), { recursive: true });

  const corner = opts.corner ?? "bottom-right";
  const widthPct = opts.widthPct ?? LOGO_WIDTH_PCT;

  const baseImg = sharp(srcPath);
  const meta = await baseImg.metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Cannot read dimensions of ${srcPath}`);
  }

  // Build the logo with a brand frame.
  const targetLogoWidth = Math.max(80, Math.round(meta.width * widthPct));
  const innerWidth = Math.max(40, targetLogoWidth - FRAME_PX * 2);

  const framedLogoBuf = await sharp(LOGO_PATH)
    .resize({ width: innerWidth, withoutEnlargement: false })
    .extend({
      top: FRAME_PX,
      bottom: FRAME_PX,
      left: FRAME_PX,
      right: FRAME_PX,
      background: FRAME_COLOR,
    })
    .png()
    .toBuffer();

  const framedMeta = await sharp(framedLogoBuf).metadata();
  const logoW = framedMeta.width ?? targetLogoWidth;
  const logoH = framedMeta.height ?? Math.round(targetLogoWidth * 0.625);

  const padding = Math.max(16, Math.round(meta.width * PADDING_PCT));

  let top: number;
  let left: number;
  switch (corner) {
    case "top-left":
      top = padding;
      left = padding;
      break;
    case "top-right":
      top = padding;
      left = meta.width - logoW - padding;
      break;
    case "bottom-left":
      top = meta.height - logoH - padding;
      left = padding;
      break;
    case "bottom-right":
    default:
      top = meta.height - logoH - padding;
      left = meta.width - logoW - padding;
  }

  // Re-encode as JPEG. Quality 88 keeps sub-300KB on 1024² output and avoids
  // sending PNGs that some social APIs choke on.
  await baseImg
    .composite([{ input: framedLogoBuf, top, left }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);

  return outPath;
}

/**
 * Convenience: given a raw media path, write a branded version next to it
 * with a "-branded.jpg" suffix.
 */
export function brandedPathFor(_srcPath: string, previewDir: string, postId: string): string {
  return resolve(previewDir, `${postId}-branded.jpg`);
}
