// Google Business Profile location lookup.
//
// When a single Upload-Post Google connection has MORE THAN ONE Business
// Profile (multiple locations under the same Google login), the upload API
// can't guess which one you mean — you must pass `gbp_location_id` on every
// post. This module pulls the list so you can find the right id.
//
//   npm run gbp:locations
//
// Copy the `name` value (looks like "accounts/123/locations/456") of the
// profile you want and put it in .env as GBP_LOCATION_ID.

const API_BASE = "https://api.upload-post.com/api";

export type GbpLocation = {
  /** The value you pass as gbp_location_id (e.g. "accounts/123/locations/456"). */
  name: string;
  /** Human-readable business/location name. */
  title: string;
  /** Anything else the API returned, kept for debugging. */
  raw: Record<string, unknown>;
};

function authHeader(): Record<string, string> {
  const key = (process.env.UPLOAD_POST_API_KEY ?? "").trim();
  if (!key) throw new Error("UPLOAD_POST_API_KEY not set");
  return { Authorization: `Apikey ${key}` };
}

function userProfile(): string {
  const user = (process.env.UPLOAD_POST_USER ?? "").trim();
  if (!user) {
    throw new Error("UPLOAD_POST_USER not set (profile name in your Upload-Post dashboard)");
  }
  return user;
}

/**
 * Best-effort extraction of the location array from Upload-Post's response.
 * The endpoint is young and the envelope shape isn't pinned down, so we look
 * in the common places: a top-level array, or `.locations` / `.data` /
 * `.results` arrays.
 */
function extractList(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    for (const key of ["locations", "data", "results", "profiles"]) {
      const v = obj[key];
      if (Array.isArray(v)) return v as Record<string, unknown>[];
    }
  }
  return [];
}

export async function listGbpLocations(): Promise<GbpLocation[]> {
  const url = `${API_BASE}/uploadposts/google-business/locations?profile=${encodeURIComponent(userProfile())}`;
  const resp = await fetch(url, { headers: authHeader() });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(
      `google-business/locations lookup failed: ${resp.status} ${text}\n` +
        `If this is a permissions/scope error, disconnect and reconnect your Google account at ` +
        `upload-post.com → Manage Users so the GBP scopes refresh.`
    );
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`google-business/locations returned non-JSON: ${text}`);
  }

  const list = extractList(json);
  return list.map((raw) => ({
    name: String(raw.name ?? raw.id ?? ""),
    title: String(raw.title ?? raw.display_name ?? raw.locationName ?? "(untitled)"),
    raw,
  }));
}
