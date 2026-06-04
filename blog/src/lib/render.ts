// Renders DraftedPost JSON + a published-list (for the blog index) into HTML
// pages that match the Home Advisor Locksmith site brand (shared /styles.css).

import type { DraftedPost, PublishedRecord } from "./types.ts";

const SITE = (process.env.SITE_URL ?? "https://www.homeadvisorlocksmith.com").replace(/\/+$/, "");
const BRAND = "Home Advisor Locksmith";
const PHONE_TEL = "+17867779529";
const PHONE_DISPLAY = "(786) 777-9529";

function esc(s: string): string {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const ICON_SPRITE = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
  <symbol id="i-gift" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/></symbol>
  <symbol id="i-key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></symbol>
</defs></svg>`.trim();

function buildJsonLd(post: DraftedPost, url: string, heroUrl: string, publishedAt: string) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.metaDescription,
        image: heroUrl,
        datePublished: publishedAt,
        dateModified: publishedAt,
        author: { "@type": "Organization", name: BRAND, url: SITE },
        publisher: {
          "@type": "Organization",
          name: BRAND,
          logo: { "@type": "ImageObject", url: `${SITE}/images/logo.jpg` },
        },
        mainEntityOfPage: url,
      },
      post.faqs.length > 0 && {
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ].filter(Boolean),
  };
  return JSON.stringify(data);
}

const HEADER_PARTIAL = `
<a class="skip" href="#main">Skip to content</a>

<a class="call-bar" href="tel:${PHONE_TEL}" aria-label="Call ${PHONE_DISPLAY} — 24/7 locksmith">
  <span class="call-bar__pulse" aria-hidden="true"></span>
  <span class="call-bar__label">Call Now — 24/7</span>
  <span class="call-bar__num">${PHONE_DISPLAY}</span>
</a>

<aside class="promo" role="region" aria-label="Current offer">
  <a class="promo__inner" href="/#contact">
    <svg class="icon" width="20" height="20" aria-hidden="true"><use href="#i-gift"/></svg>
    <span><strong>FREE Service Call</strong> with any locksmith job · Mention code <code>LOCK25</code></span>
  </a>
</aside>

<header class="topbar">
  <a class="topbar__brand" href="/" aria-label="${BRAND} — home">
    <img src="/images/logo.jpg" alt="${BRAND}" width="320" height="320" />
  </a>
  <div class="topbar__right">
    <a class="topbar__phone" href="tel:${PHONE_TEL}" aria-label="Call ${PHONE_DISPLAY}">
      <svg class="icon" width="20" height="20" aria-hidden="true"><use href="#i-phone"/></svg>
      <span class="topbar__num">${PHONE_DISPLAY}</span>
    </a>
  </div>
</header>`;

const FOOTER_PARTIAL = `
<footer class="foot">
  <div class="container">
    <p><strong>${BRAND}</strong> · 24/7 mobile locksmith — residential, automotive &amp; commercial · <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></p>
    <p class="foot__fine">Licensed, bonded &amp; insured. We come to you.</p>
    <p class="foot__fine"><a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/#services">Services</a> · <a href="/#contact">Contact</a></p>
  </div>
</footer>
<script src="/script.js" defer></script>`;

const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%2315171c'/%3E%3Ccircle cx='24' cy='40' r='10' fill='none' stroke='%23c8102e' stroke-width='4'/%3E%3Cpath d='M31 33 48 16' stroke='%23c8102e' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M41 23l6 6' stroke='%23c8102e' stroke-width='4' stroke-linecap='round'/%3E%3C/svg%3E`;

export function renderBlogPost(post: DraftedPost, publishedAt: string): string {
  const url = `${SITE}/blog/${post.slug}`;
  const heroUrl = `${SITE}/blog/${post.slug}/hero.jpg`;

  const sectionsHtml = post.sections
    .map(
      (s) => `
    <section>
      <h2>${esc(s.heading)}</h2>
      ${s.body}
    </section>`
    )
    .join("\n");

  const faqsHtml =
    post.faqs.length > 0
      ? `
  <section class="faq container container--narrow" aria-labelledby="faq-h">
    <h2 id="faq-h">Frequently Asked Questions</h2>
    ${post.faqs
      .map(
        (f) => `
    <details class="faq__item">
      <summary>${esc(f.question)}</summary>
      <p>${esc(f.answer)}</p>
    </details>`
      )
      .join("\n    ")}
  </section>`
      : "";

  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />

<title>${esc(post.title)} | ${BRAND}</title>
<meta name="description" content="${esc(post.metaDescription)}" />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
<meta name="theme-color" content="#15171c" />

<meta property="og:type" content="article" />
<meta property="og:site_name" content="${BRAND}" />
<meta property="og:title" content="${esc(post.title)}" />
<meta property="og:description" content="${esc(post.metaDescription)}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${heroUrl}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="article:published_time" content="${publishedAt}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(post.title)}" />
<meta name="twitter:description" content="${esc(post.metaDescription)}" />
<meta name="twitter:image" content="${heroUrl}" />

<link rel="icon" href="${FAVICON}" />
<link rel="stylesheet" href="/styles.css" />

<script type="application/ld+json">${buildJsonLd(post, url, heroUrl, publishedAt)}</script>
</head>
<body>

${ICON_SPRITE}
${HEADER_PARTIAL}

<article class="hero" id="main" style="padding-bottom:1rem;">
  <div class="hero__inner" style="max-width:800px;">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <a href="/blog">Blog</a> <span aria-hidden="true">›</span>
      <span aria-current="page">${esc(post.title)}</span>
    </nav>
    <h1>${esc(post.h1)}</h1>
    <p class="post-meta">Published ${esc(formattedDate)}</p>
  </div>
</article>

<section class="post-wrap">
  <div class="container container--narrow">
    <img class="post-hero" src="hero.jpg" alt="${esc(post.title)}" width="1200" height="630" loading="eager" />
    <div class="post-body">
      ${sectionsHtml}
    </div>
  </div>
</section>

${faqsHtml}

<section class="quote">
  <div class="container container--narrow" style="text-align:center;">
    <h2>Locked out or need a lock changed today?</h2>
    <p class="quote__sub">24/7 mobile locksmith — we come to you. Up-front pricing, FREE service call with any job when you mention code <strong>LOCK25</strong>.</p>
    <div class="quote__btns">
      <a class="btn btn--primary" href="tel:${PHONE_TEL}">
        <svg class="icon" width="20" height="20" aria-hidden="true"><use href="#i-phone"/></svg>
        <span>Call ${PHONE_DISPLAY}</span>
      </a>
      <a class="btn btn--ghost" href="/#contact">Get a Free Quote</a>
    </div>
  </div>
</section>

${FOOTER_PARTIAL}
</body>
</html>
`;
}

export function renderBlogIndex(records: PublishedRecord[]): string {
  const sorted = [...records].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const url = `${SITE}/blog`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />

<title>Locksmith Tips &amp; Guides | ${BRAND}</title>
<meta name="description" content="Real-world locksmith advice from licensed pros — lockouts, rekeying, car keys, smart locks, home and business security. 24/7 mobile service." />
<link rel="canonical" href="${url}" />
<meta name="robots" content="index, follow" />
<meta name="theme-color" content="#15171c" />
<link rel="icon" href="${FAVICON}" />
<link rel="stylesheet" href="/styles.css" />
</head>
<body>

${ICON_SPRITE}
${HEADER_PARTIAL}

<header class="hero" id="main">
  <div class="hero__inner">
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> <span aria-hidden="true">›</span>
      <span aria-current="page">Blog</span>
    </nav>
    <h1>Locksmith Tips &amp; Guides</h1>
    <p class="hero__sub">Real-world advice from licensed locksmiths — lockouts, rekeying, car keys, smart locks, and keeping your home and business secure.</p>
  </div>
</header>

<section class="services">
  <div class="container">
    ${
      sorted.length === 0
        ? `<p style="text-align:center;color:var(--muted);">No posts yet — check back soon.</p>`
        : `<div class="grid">
      ${sorted
        .map((r) => {
          const dateStr = new Date(r.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return `
      <article class="card">
        <p class="card__date">${esc(dateStr)}</p>
        <h2 class="card__title"><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></h2>
        <p class="card__excerpt">${esc(r.excerpt)}</p>
        <a class="card__more" href="/blog/${esc(r.slug)}">Read more ›</a>
      </article>`;
        })
        .join("\n      ")}
    </div>`
    }
  </div>
</section>

${FOOTER_PARTIAL}
</body>
</html>
`;
}
