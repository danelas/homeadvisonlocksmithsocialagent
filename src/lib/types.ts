export type Platform = "instagram" | "facebook" | "google_business";

// A locksmith service the agent makes a daily ad flyer for. The agent rotates
// through the catalog (never runs out) — each run generates a FRESH photo
// background and composites the branded flyer over it.
export type Service = {
  id: string;                 // stable identifier (used in filenames/state)
  /** Headline split into short lines so it never wraps on the flyer. 1–3 lines. */
  headline: string[];
  subhead: string;            // one short line under the headline
  bullets: string[];          // 3 short benefit bullets
  bgPrompt: string;           // AI prompt for the PHOTO background only (no text)
  caption: string;            // social caption body (no hashtags)
  hashtags: string[];         // appended to the caption
};

export type PublishedRecord = {
  id: string;
  at: string;                 // ISO timestamp
  result?: unknown;           // raw upload-post response
  error?: string;
};

export type State = {
  published: PublishedRecord[];
};
