# Home Advisor Locksmith — Marketing Automation

This repo holds three things that share one brand + logo:

| Part | What it does | Lives in | Deploys to |
|---|---|---|---|
| **Website** | Static homepage + `/blog` for Home Advisor Locksmith | [`site/`](site/) | Vercel → https://www.homeadvisorlocksmith.com |
| **Blog agent** | Drafts one SEO-optimized article/day via Claude, generates a hero image, writes it into `site/blog/` (Vercel auto-deploys) | [`blog/`](blog/) | GitHub Actions (daily 9 AM ET) |
| **Social agent** | Posts to Google Business + Instagram + Facebook via upload-post.com | repo root (`src/`) | GitHub Actions (Tue/Thu/Sat) |

Vercel is connected to this repo and serves the [`site/`](site/) folder (see
[`vercel.json`](vercel.json)). The blog agent has its own
[README](blog/README.md). The rest of this file covers the social agent.

---

# Social Agent

Lightweight social-media posting agent for **Home Advisor Locksmith**. Runs on a
GitHub Actions cron, picks the next post from a curated content library,
generates imagery via OpenAI, **composites your logo onto every image**, and
publishes to **Google Business Profile + Instagram + Facebook** via
[upload-post.com](https://upload-post.com).

Modeled on the ASAP Garage Door social agent — same posting stack, same
Upload-Post safety checks — with one addition: **multi-location Google Business
support**. You manage several Google Business Profiles under a single Google
login, so every GBP post pins itself to a specific location via `gbp_location_id`.

No real photos required — every starter post is AI-generated. Until you drop a
logo at `assets/logo.jpg`, images post unbranded (the agent warns and continues).

## Multiple Google Business locations — the key difference

Upload-Post connects your whole Google account as one connection. When that
account owns more than one Business Profile, the upload API can't guess which
location a post is for and will error unless you tell it. This agent handles
that with the `gbp_location_id` parameter:

```bash
# 1. List the locations connected to your profile
npm run gbp:locations
```

Example output:

```
Found 3 Google Business location(s):

  [1] Home Advisor Locksmith — Downtown
      GBP_LOCATION_ID=accounts/123456789/locations/111111111

  [2] Home Advisor Locksmith — Westside
      GBP_LOCATION_ID=accounts/123456789/locations/222222222

  [3] Home Advisor Locksmith — North
      GBP_LOCATION_ID=accounts/123456789/locations/333333333
```

```bash
# 2. Put the one you want in .env (or as a GitHub secret)
GBP_LOCATION_ID=accounts/123456789/locations/222222222
```

**One location per run.** To cover multiple locations, either change
`GBP_LOCATION_ID` between runs, or stand up a second copy of this repo/agent
with its own secret value. (Don't see your profiles in the list? Disconnect and
reconnect Google at upload-post.com → **Manage Users** to refresh the scopes.)

## Quickstart

### 1. Local prerequisites
- Node 20+
- An [upload-post.com](https://upload-post.com) account with **Instagram +
  Facebook + Google Business** connected to a profile
- The Facebook Page ID (prevents posts landing on the wrong Page)
- The Google Business `GBP_LOCATION_ID` (from `npm run gbp:locations`)
- An OpenAI API key (only for posts whose `media.source === "ai"`)

### 2. Install + configure

```bash
npm install
cp .env.example .env
# then fill in the values in .env
npm run gbp:locations   # to find your GBP_LOCATION_ID
```

### 3. Try a dry-run

```bash
npm run post:dry
```

Generates any AI images and prints the captions to stdout but doesn't upload.

### 4. Ship one post

```bash
npm run post
```

Picks the next unpublished post, generates its media, brands it, posts to
Google Business + Instagram + Facebook, writes the result to `state.json`.

### 5. Check what's next without running it

```bash
npm run post:next
```

## Running on GitHub Actions (production)

1. Push this repo to GitHub.
2. Repo → **Settings → Secrets and variables → Actions → New repository secret** —
   add the values from `.env.example`:
   - `UPLOAD_POST_API_KEY` (required)
   - `UPLOAD_POST_USER` (required)
   - `UPLOAD_POST_EXPECTED_HANDLES` (optional but recommended — safety check)
   - `FACEBOOK_PAGE_ID` (required to post to Facebook)
   - `GBP_LOCATION_ID` (required to post to Google Business)
   - `OPENAI_API_KEY` (required for `media.source: "ai"` posts)
3. Default schedule is **Tue / Thu / Sat at 10am ET** (cron `0 14 * * 2,4,6`).
   Edit `.github/workflows/daily.yml` to change it.
4. Manual run: **Actions → Daily Social Post → Run workflow** (optional "Dry run").

## Adding / editing posts

Brand details (name, phone, license, promo code) live in one place — the
`BRAND` const at the top of [src/content/posts.ts](src/content/posts.ts). Edit
those once and they flow into every caption. Append new posts to the `POSTS`
array (unique `id`, never reused):

```ts
{
  id: "promo-summer-2026",
  title: "Summer 2026 promo",
  caption: `...your caption here...`,
  hashtags: [...COMMON_HASHTAGS, "summer"],
  media: { source: "ai", prompt: "..." },         // or { source: "asset", path: "myphoto.jpg" }
  platforms: ["instagram", "facebook", "google_business"],
},
```

⚠️ **Never put prices** ($ amounts, "starting at $X") in captions — pricing
belongs in DMs / calls / on-site quotes.

## Safety nets baked in

- **Account-routing verification** (`UPLOAD_POST_EXPECTED_HANDLES`): aborts if
  Upload-Post's profile is wired to the wrong IG / FB / Google account.
- **Explicit Facebook Page ID**: required when posting to Facebook.
- **Explicit Google Business location** (`gbp_location_id`): required when
  posting to Google Business — prevents the "which of your profiles?" error and
  stops a post landing on the wrong location.
- **State.json** is the source of truth for "what's been published" — committed
  after every run. Git is the database.
- **Dry-run mode** prints the caption + generates media but never posts.
- **Logo-optional**: no `assets/logo.jpg` yet? Posts ship unbranded with a
  warning instead of crashing.

## Folder layout

```
locksmith-social-agent/
├── .github/workflows/daily.yml    # cron + workflow
├── src/
│   ├── content/posts.ts           # the post library + BRAND details — main thing you edit
│   ├── lib/
│   │   ├── uploadpost.ts          # Upload-Post API wrapper + safety checks + gbp_location_id
│   │   ├── locations.ts           # Google Business location lookup
│   │   ├── image.ts               # OpenAI gpt-image-1 generation
│   │   ├── logo.ts                # auto logo overlay (sharp-based, logo-optional)
│   │   ├── state.ts               # state.json read/write
│   │   └── types.ts
│   ├── locations.ts               # `npm run gbp:locations` CLI
│   └── index.ts                   # main entry — picks next post, posts it
├── assets/                        # logo + fallback images (drop logo.jpg here)
├── preview/                       # ai-generated + branded images (gitignored)
├── state.json                     # what's been published (auto-updated)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "no posts left in queue" | All posts already in `state.json` | Add more to `src/content/posts.ts` |
| `GBP_LOCATION_ID not set` | Posting to Google Business with no location chosen | Run `npm run gbp:locations`, copy a `name` into `GBP_LOCATION_ID` |
| `google-business/locations lookup failed` / empty list | Google not connected, or scopes stale | Reconnect Google at upload-post.com → Manage Users |
| `FACEBOOK_PAGE_ID not set` | Posting to FB without a Page ID | Get it from `https://api.upload-post.com/api/uploadposts/facebook/pages?profile=<your_profile>` |
| `ABORT: ...connected to wrong account(s)` | Safety check fired | Reconnect the right account at upload-post.com |
| Images post without a logo | No `assets/logo.jpg` | Drop your logo there |

## License

Private. Internal tooling for Home Advisor Locksmith.
