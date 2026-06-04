export type Platform = "instagram" | "facebook" | "google_business";

export type Media =
  | { source: "asset"; path: string }           // file relative to /assets
  | { source: "url"; url: string }              // remote URL (we download it)
  | { source: "ai"; prompt: string; size?: "1024x1024" | "1024x1536" | "1536x1024" };

export type LogoCorner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export type Post = {
  id: string;                                   // stable identifier — never reuse
  title: string;                                // short label, shown in logs
  caption: string;                              // body text (no hashtags here)
  hashtags: string[];                           // appended in the caption per-platform
  media: Media;
  platforms: Platform[];
  /** Skip the auto logo-overlay step for this post (rare — e.g. testing). */
  skipLogo?: boolean;
  /** Override where the logo lands. Defaults to bottom-right. */
  logoCorner?: LogoCorner;
  /** Optional override of the platform-level captions/hashtag tail. */
  perPlatform?: Partial<Record<Platform, { caption?: string; hashtags?: string[] }>>;
};

export type PublishedRecord = {
  id: string;
  at: string;                                   // ISO timestamp
  result?: unknown;                             // raw upload-post response
  error?: string;
};

export type State = {
  published: PublishedRecord[];
};
