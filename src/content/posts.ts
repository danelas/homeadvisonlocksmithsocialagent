// The post library. The agent walks this list IN ORDER, picking the first
// post not yet in state.json. Add new posts at the end; never reorder or
// reuse IDs.
//
// Every post defaults to media.source = "ai" so no real photos are needed.
// If a logo is present at assets/logo.jpg it is auto-composited into the
// bottom-right corner with a brand frame on every image. AI prompts are
// written so the bottom-right ~20% of the canvas stays uniform/empty so the
// logo overlay has clean space.
//
// ⚠️ NEVER include specific prices ($ amounts, ranges, "starting at $X") in
// social captions. Pricing belongs in DMs, phone calls, or on-site quotes —
// not the public feed.
//
// 👉 FILL IN your details in BRAND below. Phone / license / promo are
// placeholders. They flow into every caption automatically.

import type { Post } from "../lib/types.ts";

const BRAND = {
  name: "Home Advisor Locksmith",
  phone: "(786) 777-9529",
  license: "",                      // state locksmith license # — fill to show "Lic #..." in captions
  promo: "LOCK25",                  // promo code mentioned in captions
  // Default platforms for every post. GBP location is chosen via the
  // GBP_LOCATION_ID env var (one location per run), not here.
  platforms: ["instagram", "facebook", "google_business"] as const,
};

// Only show the license line once you've filled BRAND.license — avoids
// posting a placeholder publicly.
const LICENSE_SUFFIX = BRAND.license ? ` — Lic #${BRAND.license}` : "";

const COMMON_HASHTAGS = [
  "locksmith",
  "locksmithservice",
  "lockedout",
  "rekey",
  "247locksmith",
  "emergencylocksmith",
  "carkeys",
  "homesecurity",
  "localbusiness",
  "keys",
];

const LOGO_SPACE_HINT =
  "Leave the bottom-right corner (~20% of the canvas) clean and uniform — no text or busy detail there. A small logo badge will be overlaid on top.";

export const POSTS: Post[] = [
  // -----------------------------------------------------------------------
  {
    id: "intro-brand",
    title: "Brand intro",
    caption: `Locked out? We're already on the way.

We're ${BRAND.name} — your 24/7 mobile locksmith.
We answer the phone day or night (yes, including holidays).
Homes · Cars · Businesses · Rekeys · Lockouts · Smart locks.
Licensed, bonded & insured${LICENSE_SUFFIX}.

🎁 FREE service call with any job — mention ${BRAND.promo}
☎️ ${BRAND.phone}
🔗 link in bio`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "mobilelocksmith",
      "lockoutservice",
      "lockchange",
      "licensedlocksmith",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A premium service-brand graphic on a deep charcoal background (#15171c) with a soft gold radial glow from the upper-left. Centered in the upper half: the bold white sans-serif headline 'LOCKED OUT? WE'VE GOT THE KEY', followed below by smaller white type '24/7 · MOBILE LOCKSMITH · LICENSED & INSURED'. A thin gold horizontal line under the headline. No phone numbers, no company logos, no specific key brand names. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "car-lockout",
    title: "Car lockout — keys inside",
    caption: `Keys locked in the car? Don't break a window.

A coat hanger and a YouTube video are how scratched paint and bent door frames happen. Modern cars have sensors, airbags, and side-impact bars right where you'd pry.

We carry the right tools to open it clean — no damage:
• Sedans, SUVs, trucks
• Push-to-start & traditional keys
• Most makes & models

Same-day, we come to you. Quote before we touch the door.

🎁 ${BRAND.promo} for a FREE service call
☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "carlockout",
      "keylockedincar",
      "roadsideassistance",
      "automotivelocksmith",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A clean, professional photorealistic image for an automotive locksmith. A modern car door (neutral silver sedan) in a daylit parking lot, with a slim professional lockout tool being used gently at the top of the window frame — no damage, no force. Shallow depth of field, editorial style, no text, no people's faces, no visible brand logos. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "rekey-vs-replace",
    title: "Rekey vs replace",
    caption: `Just moved in? Rekey before you unpack.

You have no idea how many copies of your new home's keys are floating around — old tenants, contractors, the dog walker, the "spare" under the mat.

Two ways we fix that:
🔑 REKEY — we re-pin your existing locks so old keys stop working. Keeps your current hardware. Fast and budget-friendly.
🔒 REPLACE — new hardware when locks are worn, damaged, or you want an upgrade (smart locks, deadbolts, keypads).

Not sure which you need? Send a photo of your locks and we'll tell you straight.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "rekeylocks",
      "newhome",
      "movingtips",
      "homesafety",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A clean split-image graphic for a locksmith. Left half: photorealistic close-up of a brass door lock cylinder being re-pinned on a workbench with small locksmith tools and pins laid out neatly. Right half: a brand-new modern matte-black deadbolt installed on a fresh white door. Subtle thin gold vertical line dividing the halves. Realistic, no text, no people, professional editorial style. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "broken-key-extraction",
    title: "Broken key extraction",
    caption: `Key snapped off in the lock? Stop turning it.

Every wiggle pushes the broken half deeper and risks scoring the cylinder — turning a 10-minute extraction into a full lock replacement.

What to do:
1️⃣ Don't force it or try to glue it (glue ruins the lock)
2️⃣ Don't spray oil hoping it slides out
3️⃣ Call us — we extract the broken piece and cut you a fresh key on the spot

We carry extraction tools and key-cutting gear on every van.

☎️ ${BRAND.phone}
🎁 ${BRAND.promo} for a FREE service call`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "brokenkey",
      "keyextraction",
      "keycutting",
      "lockrepair",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A photorealistic macro close-up of a metal house key snapped in half, the broken end stuck in a brass door lock cylinder, dramatic side lighting on a dark neutral background. Crisp detail on the jagged break. No text, no hands, no logos, editorial product-photography style. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "smart-lock-install",
    title: "Smart lock install",
    caption: `Thinking about a smart lock? Here's the honest pro take.

Smart locks are great — IF they're installed right and matched to your door. The #1 thing we see: a keypad lock bought online that doesn't fit the door's backset or strike, so it jams within a month.

We handle the whole thing:
✅ Recommend a model that fits YOUR door
✅ Install + align it so it locks smoothly every time
✅ Set up codes and show you the app
✅ Keep a physical key backup so you're never locked out by a dead battery

Keyless, but never careless.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "smartlock",
      "keyless",
      "smarthome",
      "homeupgrade",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A photorealistic close-up of a sleek modern keypad smart lock (matte black, illuminated number pad) installed on a clean white front door, warm daylight from the left, shallow depth of field. Premium and trustworthy feel. No text, no people, no real brand logos. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "car-key-fob",
    title: "Car key / fob replacement",
    caption: `Dealership quoted you a fortune for a spare car key? Call us first.

Lost your only key fob, or want a backup before you lose it? You don't have to tow the car to the dealer and wait a week.

We cut and program keys & fobs on-site for most makes:
🔑 Transponder keys
🔑 Remote head keys
🔑 Push-to-start smart fobs
🔑 Spare keys before you're stranded

We come to your driveway, your office, or the parking lot you're stuck in.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "carkeyreplacement",
      "keyfob",
      "transponderkey",
      "automotivelocksmith",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A photorealistic close-up of a modern black car key fob and a freshly cut transponder car key resting on a clean dark surface, with a subtle key-cutting machine blurred in the background. Professional automotive locksmith vibe, warm key-light, no text, no logos. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "commercial-master-key",
    title: "Commercial master key systems",
    caption: `Run a business? Stop handing out a key to everyone.

A master key system gives you ONE key that opens everything, while each employee's key opens only what they need. When someone leaves, you rekey one door — not the whole building.

We set up and maintain:
🏢 Master & sub-master key systems
🏢 High-security restricted keys (can't be copied at the hardware store)
🏢 Panic bars & commercial-grade deadbolts
🏢 Lock changes the same day an employee is let go

Control who goes where — without a spreadsheet of who has which key.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "commerciallocksmith",
      "masterkey",
      "smallbusiness",
      "accesscontrol",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A clean professional photorealistic image of a row of labeled brass commercial keys hanging on a key-control board, with a single 'master' key in focus in the foreground. Subtle office/business backdrop, neutral tones, editorial style. No readable text, no logos, no people. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "home-security-tip",
    title: "Home security tip",
    caption: `🚨 Your deadbolt is only as strong as the screws holding the strike plate.

Most break-ins aren't lock-picking — they're one hard kick. The door swings in because the strike plate is held by two 1/2-inch screws into soft trim.

Free upgrade that actually stops kick-ins:
1️⃣ Swap to a reinforced strike plate
2️⃣ Use 3-inch screws that bite into the wall stud, not just the frame
3️⃣ Add a grade-1 or grade-2 deadbolt

We do all three in one visit — most homes in under an hour.

Save this post and check your own door tonight.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "homesecurity",
      "deadbolt",
      "burglaryprevention",
      "safetytip",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A striking security-tip social graphic on a dark charcoal background (#15171c) with a subtle gold glow from the top. Centered bold white sans-serif headline: 'A GOOD LOCK NEEDS GOOD SCREWS.' Below in smaller white text: 'Most break-ins are one kick. A reinforced strike plate and 3-inch screws stop them.' A small gold shield icon near the headline. " +
        LOGO_SPACE_HINT +
        " No phone numbers, no logos.",
    },
    platforms: [...BRAND.platforms],
  },

  // -----------------------------------------------------------------------
  {
    id: "review-shoutout",
    title: "5-star review",
    caption: `⭐⭐⭐⭐⭐ from a customer this week.

This is why we answer at midnight.

Locked out of the house with a sleeping baby monitor going off inside. We were there in 25 minutes, had the door open clean — no damage — and cut a spare key so it wouldn't happen again.

That's what 24/7 actually means. Not "we'll call you back in the morning" — real around-the-clock service.

⭐ If we've helped you, leave us a Google review — link in bio.

☎️ ${BRAND.phone}`,
    hashtags: [
      ...COMMON_HASHTAGS,
      "googlereview",
      "5stars",
      "happycustomer",
      "emergencylocksmith",
    ],
    media: {
      source: "ai",
      size: "1024x1024",
      prompt:
        "A clean stylized review-card graphic on a soft warm-white background (#faf8f3) with a subtle drop shadow. Top of the card: 5 gold filled stars in a row, centered. Below the stars in deep charcoal bold sans-serif: 'FAST AND HONEST.' Below in smaller dark gray italic body text inside quotation marks: 'Locked out at midnight, they showed up in 25 minutes and got me in with zero damage. — local customer.' A thin gold horizontal accent at the very top of the card. Editorial design, no real logos, no people. " +
        LOGO_SPACE_HINT,
    },
    platforms: [...BRAND.platforms],
  },
];
