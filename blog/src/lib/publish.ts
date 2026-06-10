// In-repo publisher. Writes the new blog post into the site/ folder of THIS
// repo (site/blog/<slug>/index.html + hero.jpg), regenerates the blog index,
// and keeps sitemap.xml in sync. No cross-repo clone/token needed — the
// GitHub Actions workflow commits site/ + blog/state.json and pushes, and
// Vercel (connected to this repo) auto-deploys.

import { resolve, dirname } from "node:path";
import { mkdir, writeFile, copyFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { renderBlogIndex } from "./render.ts";
import { SITE } from "./site.ts";
import type { PublishedRecord } from "./types.ts";

// site/ lives at the repo root, one level up from blog/ (process.cwd()).
const SITE_DIR = resolve(process.cwd(), "..", "site");

export async function writePostFiles(opts: {
  postHtml: string;
  postSlug: string;
  heroPath: string;
}): Promise<{ relHtmlPath: string; relHeroPath: string }> {
  const blogDir = resolve(SITE_DIR, "blog", opts.postSlug);
  await mkdir(blogDir, { recursive: true });

  const htmlPath = resolve(blogDir, "index.html");
  await writeFile(htmlPath, opts.postHtml, "utf-8");

  const heroDest = resolve(blogDir, "hero.jpg");
  await copyFile(opts.heroPath, heroDest);

  return {
    relHtmlPath: `site/blog/${opts.postSlug}/index.html`,
    relHeroPath: `site/blog/${opts.postSlug}/hero.jpg`,
  };
}

export async function writeBlogIndex(records: PublishedRecord[]): Promise<void> {
  const html = renderBlogIndex(records);
  const indexPath = resolve(SITE_DIR, "blog", "index.html");
  await mkdir(dirname(indexPath), { recursive: true });
  await writeFile(indexPath, html, "utf-8");
}

/**
 * Rebuilds site/sitemap.xml from the homepage, the blog index, and every
 * published post. Idempotent — safe to run every publish.
 */
export async function rebuildSitemap(records: PublishedRecord[]): Promise<void> {
  const sitemapPath = resolve(SITE_DIR, "sitemap.xml");
  const today = new Date().toISOString().slice(0, 10);

  const urls: Array<{ loc: string; changefreq: string; priority: string; lastmod: string }> = [
    { loc: `${SITE}/`, changefreq: "weekly", priority: "1.0", lastmod: today },
    { loc: `${SITE}/blog`, changefreq: "daily", priority: "0.7", lastmod: today },
  ];

  for (const r of [...records].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))) {
    urls.push({
      loc: `${SITE}/blog/${r.slug}`,
      changefreq: "monthly",
      priority: "0.6",
      lastmod: r.publishedAt.slice(0, 10),
    });
  }

  const body = urls
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  await mkdir(dirname(sitemapPath), { recursive: true });
  await writeFile(sitemapPath, xml, "utf-8");
}

/** Guard: fail early with a clear message if site/ isn't where we expect. */
export function assertSiteDir(): void {
  if (!existsSync(SITE_DIR)) {
    throw new Error(
      `Expected the website folder at ${SITE_DIR} but it doesn't exist. ` +
        `Run the blog agent from the blog/ directory of the repo (site/ must be its sibling).`
    );
  }
}

export async function readSitemapCount(): Promise<number> {
  try {
    const xml = await readFile(resolve(SITE_DIR, "sitemap.xml"), "utf-8");
    return (xml.match(/<loc>/g) ?? []).length;
  } catch {
    return 0;
  }
}
