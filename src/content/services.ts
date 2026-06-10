// The locksmith service catalog. The agent rotates through this list (one per
// run, wrapping around forever) and builds a fresh ad flyer each day:
//   AI generates ONLY the photo background → flyer.ts composites the logo,
//   headline, bullets, CALL NOW bar, and service-area badge on top.
//
// Add new services anywhere — order only affects rotation. To bias toward a
// service, list it more than once.
//
// ⚠️ Background prompts must say NO text / words / logos / watermarks — all
// text is drawn by the flyer composer, not the AI. Keep the LEFT side of each
// scene darker/uncluttered so the overlaid headline stays readable.
//
// ⚠️ Never put prices in captions.

import type { Service } from "../lib/types.ts";

export const BRAND = {
  phone: "786-777-9529",                 // shown on the flyer
  phoneTel: "+17867779529",
  phoneDisplay: "(786) 777-9529",        // shown in captions
  area: process.env.SERVICE_AREA?.trim() || "Miami & Surrounding Areas",
  tagline: "Local · Reliable · Professional",
  promo: "LOCK25",
  // GBP-only for now. Add "instagram" / "facebook" here once those are
  // connected on the upload-post profile (and set FACEBOOK_PAGE_ID for FB).
  platforms: ["google_business"] as const,
};

const NO_TEXT =
  "Photorealistic, professional advertising photography. No text, no words, no letters, no numbers, no logos, no watermarks, no signage anywhere in the image. Keep the LEFT third of the frame darker and uncluttered (a shadowed wall or plain surface) so text can be overlaid. Clean, modern, high-end commercial look, soft natural lighting.";

export const SERVICES: Service[] = [
  {
    id: "car-keys",
    headline: ["Car Key", "Solutions"],
    subhead: "Lost your keys or need a spare? We've got you.",
    bullets: ["Car key replacement", "Key fob programming", "Transponder & smart keys"],
    bgPrompt:
      "A close-up of a hand holding a modern black car key fob in front of a sleek car door in a bright driveway. " + NO_TEXT,
    caption:
      "Lost your car key or need a spare? Home Advisor Locksmith comes to you — car key replacement, fob programming, transponder and push-to-start keys, cut and programmed on-site. No tow to the dealer.",
    hashtags: ["carkey", "carkeyreplacement", "keyfob", "automotivelocksmith", "miamilocksmith"],
  },
  {
    id: "rekey",
    headline: ["Rekey", "Service"],
    subhead: "New place? Make old keys stop working — today.",
    bullets: ["Enhanced security", "Cost-effective", "Residential & commercial"],
    bgPrompt:
      "A locksmith's hands rekeying a brass door lock cylinder on a modern front door, small precision tools visible, shallow depth of field. " + NO_TEXT,
    caption:
      "Just moved in? You don't know who still has a key. Rekeying makes every old key stop working while keeping your existing hardware — fast and budget-friendly. Homes and businesses.",
    hashtags: ["rekey", "rekeylocks", "newhome", "homesecurity", "locksmith"],
  },
  {
    id: "smart-locks",
    headline: ["Upgrade Your", "Security"],
    subhead: "Keypad & smart lock installation, done right.",
    bullets: ["Keypad locks installed", "Smart lock solutions", "Pro installation"],
    bgPrompt:
      "A modern matte-black keypad smart lock on a stylish front door, a hand reaching toward the illuminated keypad, premium home exterior. " + NO_TEXT,
    caption:
      "Go keyless — the right way. We recommend a smart or keypad lock that actually fits your door, install and align it, set up your codes, and leave you a key backup so a dead battery never locks you out.",
    hashtags: ["smartlock", "keyless", "keypadlock", "smarthome", "homesecurity"],
  },
  {
    id: "house-lockout",
    headline: ["Locked Out?", "We'll Get", "You In"],
    subhead: "Fast, damage-free house lockout service.",
    bullets: ["24/7 emergency response", "No damage to your door", "We come to you"],
    bgPrompt:
      "A residential front door at dusk with warm porch light, a locksmith kneeling to work on the door handle, calm and reassuring mood. " + NO_TEXT,
    caption:
      "Locked out of your house? Don't force it. We open most doors clean — no damage — and can cut you a spare on the spot so it doesn't happen again. Available around the clock.",
    hashtags: ["lockedout", "houselockout", "emergencylocksmith", "247locksmith", "locksmithnearme"],
  },
  {
    id: "safes",
    headline: ["Safe Opening", "& Installation"],
    subhead: "Locked out of your safe? Locked in your valuables?",
    bullets: ["Safe unlocking", "Combination changes", "Delivery & install"],
    bgPrompt:
      "A sturdy modern home safe in a tidy office, a professional adjusting the dial, dramatic side lighting, sense of security and trust. " + NO_TEXT,
    caption:
      "Can't get into your safe, or want one installed and bolted down right? We open, service, and re-set safe combinations, and install home and business safes so your valuables stay yours.",
    hashtags: ["safe", "safeopening", "safeinstallation", "locksmith", "homesecurity"],
  },
  {
    id: "commercial",
    headline: ["Commercial", "Locksmith"],
    subhead: "Control who goes where in your building.",
    bullets: ["Master key systems", "High-security keys", "Same-day rekeys"],
    bgPrompt:
      "The glass entrance of a modern small business / storefront with commercial-grade door hardware, professional setting, daytime. " + NO_TEXT,
    caption:
      "Run a business? One key for you, limited access for everyone else. We set up master key systems, install high-security restricted keys that can't be copied at the store, and rekey same-day when an employee leaves.",
    hashtags: ["commerciallocksmith", "masterkey", "businesssecurity", "accesscontrol", "smallbusiness"],
  },
  {
    id: "lock-replacement",
    headline: ["Lock &", "Deadbolt", "Replacement"],
    subhead: "Worn, damaged, or just want stronger locks?",
    bullets: ["Grade-1 deadbolts", "Color-matched hardware", "Residential & commercial"],
    bgPrompt:
      "A close-up of a brand-new brushed-nickel deadbolt being installed on a clean white door, screwdriver in hand, crisp detail. " + NO_TEXT,
    caption:
      "Old or damaged locks? We replace worn deadbolts and handlesets with stronger, better-rated hardware — and reinforce the strike plate so the whole door actually holds.",
    hashtags: ["deadbolt", "lockreplacement", "lockchange", "homesecurity", "locksmith"],
  },
  {
    id: "broken-key",
    headline: ["Broken Key", "Extraction"],
    subhead: "Key snapped in the lock? Stop twisting it.",
    bullets: ["Clean key extraction", "New key cut on-site", "Lock saved when possible"],
    bgPrompt:
      "A macro close-up of a metal key broken off inside a brass door lock cylinder, dramatic lighting, dark neutral background. " + NO_TEXT,
    caption:
      "Key broke off in the lock? Don't glue it or jam it deeper. We extract the broken piece, save the lock when we can, and cut you a fresh key on the spot.",
    hashtags: ["brokenkey", "keyextraction", "keycutting", "lockrepair", "locksmith"],
  },
  {
    id: "key-fob",
    headline: ["Key Fob", "Programming"],
    subhead: "Fob dead or lost? We program on-site.",
    bullets: ["Most makes & models", "Spare fobs", "Cheaper than the dealer"],
    bgPrompt:
      "A hand pressing a modern car key fob button next to a car, subtle interior lighting, focus on the fob. " + NO_TEXT,
    caption:
      "Key fob stopped working or lost the only one? We cut and program fobs and remotes for most makes and models right in your driveway — usually for less than the dealership.",
    hashtags: ["keyfob", "fobprogramming", "carkey", "automotivelocksmith", "miamilocksmith"],
  },
  {
    id: "master-key",
    headline: ["Master Key", "Systems"],
    subhead: "One key for you. The right access for everyone else.",
    bullets: ["Custom keying plans", "Restricted key control", "Scales as you grow"],
    bgPrompt:
      "A row of labeled brass keys hanging on a key-control board with one master key in sharp focus in the foreground, professional office backdrop. " + NO_TEXT,
    caption:
      "Tired of a ring full of keys? A master key system lets one key open everything while each employee's key opens only what they need — and you rekey one door, not the whole building, when someone leaves.",
    hashtags: ["masterkey", "commerciallocksmith", "accesscontrol", "businesssecurity", "locksmith"],
  },
  {
    id: "emergency-247",
    headline: ["24/7", "Emergency", "Locksmith"],
    subhead: "Day or night, we answer and we come to you.",
    bullets: ["Homes, cars & business", "Nights, weekends, holidays", "Fast, friendly, licensed"],
    bgPrompt:
      "A locksmith service van parked on a city street at night with headlights on, professional and reassuring, urban evening mood. " + NO_TEXT,
    caption:
      "Lockouts don't wait for business hours — neither do we. Home Advisor Locksmith is on call 24/7 for homes, cars, and businesses. Licensed, bonded & insured, with up-front pricing.",
    hashtags: ["247locksmith", "emergencylocksmith", "locksmithnearme", "mobilelocksmith", "miamilocksmith"],
  },
  {
    id: "mailbox-lock",
    headline: ["Mailbox", "Lock Service"],
    subhead: "Lost the key or the lock's stuck? Quick fix.",
    bullets: ["Lock replacement", "New keys cut", "Residential & multi-unit"],
    bgPrompt:
      "A close-up of a cluster mailbox unit with a small lock, a hand inserting a key, clean apartment-complex setting, daytime. " + NO_TEXT,
    caption:
      "Stuck mailbox or lost the key? We replace mailbox and cluster-box locks and cut new keys — for single homes and multi-unit buildings alike.",
    hashtags: ["mailboxlock", "locksmith", "lockchange", "residentiallocksmith", "miamilocksmith"],
  },
];
