// Calls Claude to draft a blog post. Asks for structured JSON so we can
// render predictable, SEO-optimized HTML without parsing prose.

import Anthropic from "@anthropic-ai/sdk";
import type { Topic, DraftedPost } from "./types.ts";

const PHONE_DISPLAY = "(786) 777-9529";

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (_client) return _client;

  const raw = process.env.ANTHROPIC_API_KEY ?? "";
  const apiKey = raw.trim();
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  // Detect non-HTTP-safe characters inside the (already-trimmed) key, so we
  // fail with a clear diagnostic instead of the cryptic "*** is not a legal
  // HTTP header value" from node-fetch deep in the stack.
  const badIdx = [...apiKey].findIndex((c) => {
    const code = c.charCodeAt(0);
    return code < 0x20 || code > 0x7e; // outside printable ASCII
  });
  if (badIdx !== -1) {
    const bad = apiKey.charCodeAt(badIdx);
    throw new Error(
      `ANTHROPIC_API_KEY contains a character that's not allowed in HTTP headers ` +
        `(char code 0x${bad.toString(16)} at position ${badIdx}). ` +
        `Most likely a smart quote, em-dash, or pasted whitespace. ` +
        `Re-create the key in console.anthropic.com → settings/keys → copy with single-click + Ctrl+C → re-paste into GitHub secrets.`,
    );
  }
  if (apiKey.length < 50) {
    throw new Error(`ANTHROPIC_API_KEY looks too short (${apiKey.length} chars) — Anthropic keys are usually ~100 chars. Re-paste from console.anthropic.com.`);
  }
  if (raw.length !== apiKey.length) {
    console.warn(`[anthropic] trimmed ${raw.length - apiKey.length} whitespace char(s) from ANTHROPIC_API_KEY`);
  }

  _client = new Anthropic({ apiKey });
  return _client;
}

const SYSTEM = `You are a senior content marketer writing for Home Advisor Locksmith, a licensed, bonded & insured mobile locksmith. Your writing is:

VOICE
- Direct, helpful, no fluff. Sentences are short and varied.
- Honest. If a problem has a safe DIY fix, say so. Builds trust over the long run.
- Industry-aware. Drop specific, correct facts: pin-tumbler vs wafer locks, transponder/chip keys vs mechanical keys, rekey vs replace, ANSI/BHMA Grade 1/2/3 ratings, deadbolt strike-plate reinforcement, smart-lock backset/bore sizing, key fob programming, master/sub-master keying.
- Reassuring in emergencies. Many readers are locked out and stressed — lead with what to do right now.

THE HOME ADVISOR LOCKSMITH BRAND (weave in subtly when natural — don't sales-pitch every paragraph)
- 24/7 mobile locksmith — residential, automotive, and commercial
- Licensed, bonded & insured
- Up-front pricing quoted before any work starts; no surprise charges
- FREE service call with any job (code LOCK25)
- We come to you — home, office, or roadside
- Phone: ${PHONE_DISPLAY}

WHAT NOT TO WRITE
- No fake review counts, fake customer quotes, or invented testimonials
- No invented stats — only general industry facts (e.g. "most pin-tumbler deadbolts can be rekeyed in minutes")
- No claims you can't back (no "we've served 10,000 customers", no specific response-time guarantees in minutes)
- No instructions that help someone bypass a lock they don't own — never explain lock-picking, bumping, or bypass techniques in actionable detail. Keep security framing protective, not a how-to for break-ins.
- No purple prose. No "in today's fast-paced world." No "Here at Home Advisor Locksmith..."
- No keyword stuffing. Write naturally; SEO follows good content.
- Never name or link to competitors. Do not invent a street address or specific city neighborhoods.

OUTPUT FORMAT
You will return a single JSON object with this exact shape (no markdown, no preamble, just JSON):
{
  "title": "<final SEO-tuned title under 60 chars>",
  "slug": "<url-slug-lowercase-hyphens-no-stopwords>",
  "metaDescription": "<150-160 char meta description with primary keyword + soft CTA>",
  "h1": "<page H1 — can match title or be slightly different>",
  "excerpt": "<2-sentence summary used on the blog index>",
  "sections": [
    { "heading": "<H2 heading>", "body": "<2-4 paragraphs of HTML — use <p>, <strong>, <em>, <ul><li>, <a href=...> for internal links>" },
    ... aim for 5-7 sections, totaling 1,000-1,500 words across all section bodies combined ...
  ],
  "faqs": [
    { "question": "<question>", "answer": "<1-3 sentence answer in plain text>" },
    ... include exactly 5 FAQs ...
  ],
  "heroImagePrompt": "<a 2-3 sentence detailed prompt for gpt-image-1 to generate a hero image; red (#c8102e) and charcoal brand palette, clean and professional; NO realistic recognizable people; NO trademarks/brand logos; NO actionable lock-picking depiction; LEAVE BOTTOM-RIGHT 15% empty and uniform for a logo overlay>"
}`;

const PROMPT_TEMPLATE = (topic: Topic) => `Topic ID: ${topic.id}
Working title: ${topic.title}
Search intent: ${topic.intent}
Target keywords: ${topic.keywords.join(", ")}
Category: ${topic.category}

Internal links you SHOULD include where natural (use <a href="..."> in HTML):
${(topic.internalLinks ?? ["/#services", "/#contact", "/blog"]).map((l) => `- ${l}`).join("\n")}

End the post with a short CTA paragraph: phone ${PHONE_DISPLAY}, mention the FREE service call (code LOCK25), and that 24/7 mobile service is available — we come to you.

Return ONLY the JSON object — no prose, no markdown fence.`;

export async function draftPost(topic: Topic): Promise<DraftedPost> {
  const c = client();
  const response = await c.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 8000,
    system: SYSTEM,
    messages: [{ role: "user", content: PROMPT_TEMPLATE(topic) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned no text content");
  }

  // Strip any accidental markdown fences.
  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) raw = raw.replace(/^```(?:json)?\n?/, "").replace(/```$/, "").trim();

  let parsed: DraftedPost;
  try {
    parsed = JSON.parse(raw) as DraftedPost;
  } catch (err) {
    throw new Error(
      `Claude response was not valid JSON. First 400 chars:\n${raw.slice(0, 400)}\n\nError: ${(err as Error).message}`,
    );
  }

  // Sanity-check the response shape.
  const required: Array<keyof DraftedPost> = [
    "title", "slug", "metaDescription", "h1", "excerpt", "sections", "faqs", "heroImagePrompt",
  ];
  for (const k of required) {
    if (!(k in parsed)) throw new Error(`Claude response missing required field: ${k}`);
  }
  if (!Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new Error("Claude returned no sections");
  }
  if (!Array.isArray(parsed.faqs)) parsed.faqs = [];

  // Normalize slug defensively.
  parsed.slug = String(parsed.slug).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  return parsed;
}
