// Composes a branded service-ad flyer (like a designed locksmith ad) from a
// plain AI-generated PHOTO background. The AI only produces the photograph —
// every piece of text, the logo, the CALL NOW bar, and the service-area badge
// are drawn here with sharp/SVG so the phone number and branding are always
// pixel-perfect (gpt-image-1 can't be trusted to render exact text/logos).
//
// Output: a 1200x900 (4:3 landscape) JPEG. Google Business Profile displays
// post images in a landscape card — a 4:3 image fills it instead of getting
// black pillar-bars around a square. Change W/H below to retarget the ratio.

import sharp from "sharp";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";

const LOGO_PATH = resolve(process.cwd(), "assets/logo.jpg");

const W = 1200;
const H = 900;
const P = 56;                                  // outer padding
const BRAND_RED = "#c8102e";
const BAR_H = 118;                             // bottom CALL NOW bar height

export type FlyerSpec = {
  /** Headline split into lines (kept short so it never wraps). 1–3 lines. */
  headline: string[];
  /** One short supporting line under the headline. */
  subhead: string;
  /** 3 short benefit bullets. */
  bullets: string[];
  /** e.g. "Serving Miami & Surrounding Areas" */
  area: string;
  /** Display phone, e.g. "786-777-9529" */
  phone: string;
  /** Small top-right tagline, e.g. "LOCAL · RELIABLE · PROFESSIONAL" */
  tagline: string;
};

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const FONT = "Arial, 'DejaVu Sans', 'Liberation Sans', sans-serif";

function buildSvg(spec: FlyerSpec, logoBox: { w: number; h: number }): string {
  const headlineStartY = P + logoBox.h + 70;   // below the logo card
  const lineH = 70;
  const headline = spec.headline.slice(0, 3);
  const headlineLines = headline
    .map(
      (line, i) =>
        `<text x="${P}" y="${headlineStartY + i * lineH}" font-family="${FONT}" font-size="62" font-weight="800" fill="#ffffff" letter-spacing="-1">${esc(
          line.toUpperCase()
        )}</text>`
    )
    .join("\n");

  const lastHeadlineY = headlineStartY + (headline.length - 1) * lineH;
  const accentY = lastHeadlineY + 24;
  const subY = accentY + 52;

  const bulletsStartY = subY + 62;
  const bulletGap = 58;
  const bullets = spec.bullets
    .slice(0, 3)
    .map((b, i) => {
      const cy = bulletsStartY + i * bulletGap;
      return `
    <g transform="translate(${P + 20}, ${cy})">
      <circle cx="0" cy="-10" r="18" fill="${BRAND_RED}"/>
      <polyline points="-8,-10 -3,-4 8,-16" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="${P + 56}" y="${cy - 1}" font-family="${FONT}" font-size="30" font-weight="600" fill="#ffffff">${esc(b)}</text>`;
    })
    .join("\n");

  const barY = H - BAR_H;
  const phoneCx = P + 30;
  const phoneCy = barY + BAR_H / 2;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="#0c0e12" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#0c0e12" stop-opacity="0.82"/>
      <stop offset="80%" stop-color="#0c0e12" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#0c0e12" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="topfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0c0e12" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0c0e12" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="0" y="0" width="${W}" height="170" fill="url(#topfade)"/>

  <!-- top-right tagline -->
  <text x="${W - P}" y="${P + 30}" text-anchor="end" font-family="${FONT}" font-size="22" font-weight="800" fill="${BRAND_RED}" letter-spacing="1.5">${esc(
    spec.tagline.toUpperCase()
  )}</text>

  <!-- headline -->
  ${headlineLines}
  <rect x="${P}" y="${accentY}" width="90" height="8" rx="4" fill="${BRAND_RED}"/>

  <!-- subhead -->
  <text x="${P}" y="${subY}" font-family="${FONT}" font-size="28" font-weight="500" fill="#d6d9e0">${esc(spec.subhead)}</text>

  <!-- bullets -->
  ${bullets}

  <!-- bottom CALL NOW bar -->
  <rect x="0" y="${barY}" width="${W}" height="${BAR_H}" fill="${BRAND_RED}"/>
  <circle cx="${phoneCx + 22}" cy="${phoneCy}" r="32" fill="#ffffff"/>
  <path transform="translate(${phoneCx + 5}, ${phoneCy - 17})" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" fill="none" stroke="${BRAND_RED}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="${phoneCx + 72}" y="${phoneCy - 10}" font-family="${FONT}" font-size="24" font-weight="800" fill="#ffffff" letter-spacing="2">CALL NOW</text>
  <text x="${phoneCx + 72}" y="${phoneCy + 32}" font-family="${FONT}" font-size="48" font-weight="800" fill="#ffffff">${esc(spec.phone)}</text>

  <!-- service-area badge (right side of bar) -->
  <g transform="translate(${W - P - 6}, ${phoneCy})">
    <path transform="translate(-20, -17) scale(1.35)" d="M12 21s-6-5.1-6-9.5A6 6 0 0 1 18 11.5C18 15.9 12 21 12 21z M12 9.2a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6z" fill="#ffffff"/>
    <text x="-40" y="-2" text-anchor="end" font-family="${FONT}" font-size="21" font-weight="700" fill="#ffffff">Serving ${esc(spec.area.replace(/^Serving\s+/i, "").split("&")[0].trim())} &amp;</text>
    <text x="-40" y="24" text-anchor="end" font-family="${FONT}" font-size="21" font-weight="700" fill="#ffffff">Surrounding Areas</text>
  </g>
</svg>`;
}

/**
 * Render the flyer: photo background (filling the whole 4:3 canvas) + dark
 * scrim + headline/bullets + logo card + CALL NOW bar. Returns outPath.
 */
export async function composeFlyer(bgPath: string, outPath: string, spec: FlyerSpec): Promise<string> {
  await mkdir(dirname(outPath), { recursive: true });

  // 1) Background photo, cover-cropped to fill the whole canvas (no bars).
  const bg = await sharp(bgPath).resize(W, H, { fit: "cover", position: "center" }).toBuffer();

  // 2) Logo: trim the surrounding white, resize, and set it on a white card.
  const composites: sharp.OverlayOptions[] = [];
  let logoBox = { w: 300, h: 110 };

  if (existsSync(LOGO_PATH)) {
    const LOGO_W = 250;
    const PADL = 16;
    const trimmed = await sharp(LOGO_PATH)
      .trim({ threshold: 12 })
      .resize({ width: LOGO_W })
      .toBuffer();
    const tmeta = await sharp(trimmed).metadata();
    const lw = tmeta.width ?? LOGO_W;
    const lh = tmeta.height ?? 90;

    const cardW = lw + PADL * 2;
    const cardH = lh + PADL * 2;
    logoBox = { w: cardW, h: cardH };

    const card = Buffer.from(
      `<svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="${cardW}" height="${cardH}" rx="14" ry="14" fill="#ffffff"/></svg>`
    );
    composites.push({ input: card, top: P, left: P });
    composites.push({ input: trimmed, top: P + PADL, left: P + PADL });
  }

  // 3) SVG text/graphics layer (sized using the logo card height). It goes
  // UNDER the logo card so the scrim doesn't dim the logo.
  const svg = Buffer.from(buildSvg(spec, logoBox));
  composites.unshift({ input: svg, top: 0, left: 0 });

  await sharp(bg).composite(composites).jpeg({ quality: 90, mozjpeg: true }).toFile(outPath);
  return outPath;
}
