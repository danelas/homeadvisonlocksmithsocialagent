// Single source of truth for the canonical site origin. Normalizes SITE_URL
// so it ALWAYS has an https:// scheme and no trailing slash — even if the
// GitHub secret is set to a bare domain like "www.homeadvisorlocksmith.com".
// Without this, canonical tags, OG URLs, JSON-LD, and the sitemap come out
// protocol-less and search engines reject them.

const DEFAULT_SITE = "https://www.homeadvisorlocksmith.com";

function normalizeSite(value: string | undefined): string {
  let s = (value ?? DEFAULT_SITE).trim().replace(/\/+$/, "");
  if (!s) return DEFAULT_SITE;
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
  return s;
}

export const SITE = normalizeSite(process.env.SITE_URL);
