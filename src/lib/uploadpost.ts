// Upload-Post API wrapper for Home Advisor Locksmith. Image-post path with the
// same safety checks that prevent posting to the wrong account when multiple
// FB Pages live on the same OAuth grant — PLUS Google Business multi-location
// routing via gbp_location_id (you manage several Business Profiles under one
// Google login, so every GBP post must say which location it's for).

import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import type { Platform } from "./types.ts";

const API_BASE = "https://api.upload-post.com/api";

export type UploadInput = {
  caption: string;
  title?: string;
  mediaPath: string;
  platforms: Platform[];
  scheduledTime?: Date;
};

function authHeader(): Record<string, string> {
  const key = (process.env.UPLOAD_POST_API_KEY ?? "").trim();
  if (!key) throw new Error("UPLOAD_POST_API_KEY not set");
  return { Authorization: `Apikey ${key}` };
}

function userProfile(): string {
  const user = (process.env.UPLOAD_POST_USER ?? "").trim();
  if (!user) throw new Error("UPLOAD_POST_USER not set (profile name in your Upload-Post dashboard)");
  return user;
}

// ---------- Safety: verify the profile is connected to the right accounts ----------
type ConnectedAccounts = {
  profile?: { username?: string };
  social_accounts?: Record<
    string,
    { username?: string; display_name?: string; name?: string } | undefined
  >;
};

let cachedAccounts: ConnectedAccounts | null = null;

async function getProfileAccounts(): Promise<ConnectedAccounts> {
  if (cachedAccounts) return cachedAccounts;
  const url = `${API_BASE}/uploadposts/users?profile=${encodeURIComponent(userProfile())}`;
  const resp = await fetch(url, { headers: authHeader() });
  if (!resp.ok) {
    throw new Error(`upload-post profile lookup failed: ${resp.status} ${await resp.text()}`);
  }
  cachedAccounts = (await resp.json()) as ConnectedAccounts;
  return cachedAccounts;
}

function parseExpectedHandles(): Map<string, string> {
  const raw = process.env.UPLOAD_POST_EXPECTED_HANDLES;
  const map = new Map<string, string>();
  if (!raw) return map;
  for (const part of raw.split(",")) {
    const [platform, handle] = part.split(":").map((s) => s.trim());
    if (platform && handle) map.set(platform.toLowerCase(), handle.toLowerCase().replace(/^@/, ""));
  }
  return map;
}

async function verifyConnectedAccounts(platforms: Platform[]): Promise<void> {
  const expected = parseExpectedHandles();
  if (expected.size === 0) return; // user opts in by setting UPLOAD_POST_EXPECTED_HANDLES

  let accounts: ConnectedAccounts;
  try {
    accounts = await getProfileAccounts();
  } catch (err) {
    console.warn(`[upload-post] connected-account verification skipped: ${(err as Error).message}`);
    return;
  }

  const social = accounts.social_accounts ?? {};
  const mismatches: string[] = [];

  for (const platform of platforms) {
    const expectedHandle = expected.get(platform);
    if (!expectedHandle) continue;
    const acct = social[platform];
    const actual =
      acct?.username?.toLowerCase().replace(/^@/, "") ||
      acct?.display_name?.toLowerCase() ||
      acct?.name?.toLowerCase() ||
      "(no account connected)";
    if (!actual.includes(expectedHandle)) {
      mismatches.push(`${platform}: expected "${expectedHandle}", connected to "${actual}"`);
    }
  }

  if (mismatches.length > 0) {
    throw new Error(
      `ABORT: Upload-Post profile "${userProfile()}" is connected to wrong account(s) — refusing to post.\n  ` +
        mismatches.join("\n  ") +
        `\nFix: log into upload-post.com → Profiles → ${userProfile()} → reconnect the misrouted account, then retry.`
    );
  }
}

// ---------- Status polling (async handoff path) ----------
function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

const POLL_MAX_MS = 4 * 60 * 1000;     // 4 minutes
const POLL_INTERVAL_MS = 5 * 1000;     // 5 seconds
const TERMINAL_STATES = new Set(["completed", "complete", "success", "succeeded", "failed", "error", "rejected"]);

async function pollStatus(requestId: string): Promise<unknown> {
  const url = `${API_BASE}/uploadposts/status?request_id=${encodeURIComponent(requestId)}`;
  const start = Date.now();
  let last: unknown = null;

  while (Date.now() - start < POLL_MAX_MS) {
    await sleep(POLL_INTERVAL_MS);

    const resp = await fetch(url, { headers: authHeader() });
    if (!resp.ok) {
      console.warn(`[upload-post] status poll HTTP ${resp.status}`);
      continue;
    }
    const text = await resp.text();
    try { last = JSON.parse(text); } catch { last = text; }
    console.log(`[upload-post] status:`, JSON.stringify(last));

    // Try several shapes for "is this done?"
    if (last && typeof last === "object") {
      const o = last as Record<string, unknown>;
      const top = String(o.status ?? o.state ?? "").toLowerCase();
      if (TERMINAL_STATES.has(top)) return last;

      // Also done if every platform has its own terminal status
      const platforms = (o.platforms ?? null) as Record<string, unknown> | null;
      if (platforms && typeof platforms === "object") {
        const platformKeys = Object.keys(platforms);
        if (platformKeys.length > 0) {
          const allTerminal = platformKeys.every((k) => {
            const p = platforms[k];
            if (!p || typeof p !== "object") return false;
            const s = String((p as Record<string, unknown>).status ?? "").toLowerCase();
            return TERMINAL_STATES.has(s) || s === "posted" || s === "published";
          });
          if (allTerminal) return last;
        }
      }
    }
  }

  throw new Error(
    `Upload-Post status poll timed out after ${POLL_MAX_MS / 1000}s (request_id ${requestId}). ` +
      `Last response logged above. Check upload-post.com dashboard.`
  );
}

// ---------- The actual post ----------
export async function postImage(input: UploadInput): Promise<unknown> {
  await verifyConnectedAccounts(input.platforms);

  const fileBuf = await readFile(input.mediaPath);
  const fileName = basename(input.mediaPath);
  const blob = new Blob([fileBuf]);

  const form = new FormData();
  form.append("user", userProfile());
  for (const p of input.platforms) form.append("platform[]", p);
  if (input.scheduledTime) form.append("scheduled_time", input.scheduledTime.toISOString());

  // Explicit FB Page routing — prevents posts landing on the wrong Page when
  // multiple Pages share one FB OAuth grant.
  if (input.platforms.includes("facebook")) {
    const pageId = (process.env.FACEBOOK_PAGE_ID ?? "").trim();
    if (!pageId) {
      throw new Error(
        "FACEBOOK_PAGE_ID not set — required when posting to Facebook to prevent misrouted posts."
      );
    }
    form.append("facebook_page_id", pageId);
  }

  // Explicit Google Business location routing. You manage several Business
  // Profiles under one Google login, so Upload-Post can't guess which one
  // this post is for — it would error asking you to select a location. We
  // pass gbp_location_id (the `name` from `npm run gbp:locations`) to pin it.
  if (input.platforms.includes("google_business")) {
    const locationId = (process.env.GBP_LOCATION_ID ?? "").trim();
    if (!locationId) {
      throw new Error(
        "GBP_LOCATION_ID not set — required when posting to Google Business because this " +
          "account has multiple Business Profiles. Run `npm run gbp:locations` to list them, " +
          "then copy the `name` of the one you want into GBP_LOCATION_ID."
      );
    }
    form.append("gbp_location_id", locationId);
  }

  form.append("photos[]", blob, fileName);
  form.append("caption", input.caption);
  form.append("title", input.title ?? input.caption.slice(0, 90));

  const resp = await fetch(`${API_BASE}/upload_photos`, {
    method: "POST",
    headers: authHeader(),
    body: form,
  });

  const bodyText = await resp.text();
  if (!resp.ok) {
    throw new Error(`upload-post HTTP error: ${resp.status} ${bodyText}`);
  }

  let body: unknown;
  try { body = JSON.parse(bodyText); } catch { body = bodyText; }

  // Log full response so failures are visible in GH Actions output.
  console.log(`[upload-post] response:`, JSON.stringify(body, null, 2));

  // If Upload-Post handed the job off to a background worker, the initial
  // 200 response carries a request_id but doesn't yet know whether the
  // platforms succeeded. Poll the status endpoint until it completes.
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    const requestId = obj.request_id;
    if (typeof requestId === "string" && requestId.length > 0) {
      console.log(`[upload-post] async handoff detected (request_id=${requestId}). Polling for completion…`);
      const finalStatus = await pollStatus(requestId);
      body = finalStatus;
    }
  }

  // Detect per-platform failures even when HTTP returns 200. Upload-Post
  // sometimes returns success at the envelope level while individual
  // platforms (especially Instagram) silently fail — common reasons:
  // IG account isn't Business, IG not linked to a FB Page, image rejected
  // by IG's content review, GBP location not selected, etc.
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    const failed: string[] = [];
    for (const platform of input.platforms) {
      const r = obj[platform];
      if (r && typeof r === "object") {
        const pr = r as Record<string, unknown>;
        const status = String(pr.status ?? pr.state ?? "").toLowerCase();
        const error = pr.error ?? pr.message;
        if (error || status === "failed" || status === "error" || status === "rejected") {
          failed.push(`${platform}: ${typeof error === "string" ? error : status || "unknown error"}`);
        }
      }
    }
    // Also detect generic top-level error / status=failed shapes.
    const topStatus = String(obj.status ?? "").toLowerCase();
    const topError = obj.error ?? obj.errors;
    if (topStatus === "failed" || topStatus === "error" || (topError && !failed.length)) {
      failed.push(`overall: ${typeof topError === "string" ? topError : topStatus || "failed"}`);
    }
    if (failed.length > 0) {
      throw new Error(
        `Upload-Post returned HTTP 200 but one or more platforms failed:\n  ${failed.join("\n  ")}\n` +
          `Full response logged above. Check upload-post.com dashboard for details.`
      );
    }
  }

  return body;
}
