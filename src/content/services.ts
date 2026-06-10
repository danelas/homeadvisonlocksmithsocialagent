// The locksmith service catalog. The agent rotates through this list (one per
// run, wrapping around forever) and builds a fresh ad flyer each day:
//   AI generates ONLY the photo background → flyer.ts composites the logo,
//   headline, bullets, CALL NOW bar, and service-area badge on top.
//
// CONTENT STRATEGY (positions us for higher-value commercial work):
//   ~70% commercial locksmith & access control, ~30% emergency services.
//   The list is INTERLEAVED (roughly every 4th entry is emergency) so the
//   feed mixes instead of posting all-commercial-then-all-emergency.
//   Current mix: 11 commercial + 4 emergency = 15 entries (~73% / 27%).
//
// Captions are intentionally LONG, detailed, and educational — written to
// out-inform typical locksmith posts and read as an expert, while staying
// natural and SEO-aware. (index.ts appends the phone, the LOCK25 offer, and
// the hashtags below — don't repeat those in the caption body.)
//
// ⚠️ Background prompts must say NO text / words / logos / watermarks — all
// text is drawn by the flyer composer, not the AI. Keep the LEFT third of each
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
  "Photorealistic, professional commercial advertising photography. No text, no words, no letters, no numbers, no logos, no watermarks, no signage anywhere in the image. Keep the LEFT third of the frame darker and uncluttered (a shadowed wall or plain surface) so text can be overlaid. Clean, modern, high-end commercial look, soft natural lighting.";

// COMM = commercial / access control (~70%), EMER = emergency (~30%).
// Ordered to interleave the emergency posts through the rotation.
export const SERVICES: Service[] = [
  // 1 — COMMERCIAL
  {
    id: "access-control",
    headline: ["Access Control", "Systems"],
    subhead: "Replace brass keys with credentials you control.",
    bullets: ["Grant or revoke in seconds", "Full door audit trail", "Cloud or on-site"],
    bgPrompt:
      "A sleek wall-mounted electronic access control reader beside a modern glass office door, a hand approaching it, professional commercial lobby. " + NO_TEXT,
    caption:
      "Still handing out brass keys to your building? Access control swaps them for credentials you actually manage. Add or remove a person's access in seconds, set automatic door schedules (unlock at 8 AM, lock at 6 PM), and pull an audit trail that shows exactly who opened which door and when.\n\nFor Miami offices, warehouses, and multi-tenant properties, that ends the costly cycle of rekeying every time someone leaves — you simply deactivate their card or mobile credential. Systems range from a single standalone keypad to fully networked, cloud-managed access with remote lockdown across every door.\n\nWe assess your doors, recommend the right architecture (wired or wireless, on-prem or cloud), and install and support it. Book a walkthrough and we'll map out a plan built around how your business actually moves.",
    hashtags: ["accesscontrol", "commerciallocksmith", "businesssecurity", "accesscontrolsystems", "miamilocksmith", "commercialsecurity"],
  },
  // 2 — COMMERCIAL
  {
    id: "keycard-fob-entry",
    headline: ["Keycard & Fob", "Entry Systems"],
    subhead: "Tap-to-enter access for staff and tenants.",
    bullets: ["Prox cards & key fobs", "Lost-card lockout instantly", "Per-door permissions"],
    bgPrompt:
      "A close-up of a hand tapping a white keycard on a card reader mounted next to a commercial door, soft LED indicator glowing, modern office. " + NO_TEXT,
    caption:
      "Keycard and fob entry is the simplest way to give a team controlled access without keys floating around the neighborhood. Each employee gets a credential that works only on the doors you choose, during the hours you set.\n\nLose a card? It's deactivated in seconds — no lock changes, no risk that whoever found it can walk in. You also get a record of every entry, which is invaluable for offices, gyms, medical suites, and multi-tenant buildings where you need to know who came and went.\n\nWe install proximity cards, fobs, and mobile credentials, and tie them into door schedules and alarms. Ask us how a fob system compares to full networked access control for your space — we'll give you the honest trade-offs.",
    hashtags: ["keycardentry", "fobentry", "accesscontrol", "commerciallocksmith", "businesssecurity", "miamilocksmith"],
  },
  // 3 — COMMERCIAL
  {
    id: "master-key",
    headline: ["Master Key", "Systems"],
    subhead: "One key for you, limited access for everyone else.",
    bullets: ["Custom keying hierarchy", "Restricted, hard-to-copy keys", "Scales as you grow"],
    bgPrompt:
      "A row of labeled brass keys hanging on a key-control board with one master key in sharp focus in the foreground, professional facility office. " + NO_TEXT,
    caption:
      "A master key system gives you a clean hierarchy of access: a master key that opens everything, sub-masters for managers or departments, and individual keys that open only one door. One ring instead of twenty — without giving everyone the run of the building.\n\nDone right, it's also about control. We can build your system on restricted keyways, so blanks aren't sold at the hardware store and copies can't be made without your authorization. When someone leaves, you rekey one cylinder, not the whole property.\n\nThis is the backbone of security for property managers, schools, medical offices, and retail in Miami. We design the keying chart, cut the keys, and document it so you always know who holds what. Let's map your doors and build it properly.",
    hashtags: ["masterkey", "masterkeysystem", "commerciallocksmith", "businesssecurity", "propertymanagement", "miamilocksmith"],
  },
  // 4 — EMERGENCY
  {
    id: "car-lockout",
    headline: ["Car Lockouts"],
    subhead: "Keys locked in? We open it clean — no damage.",
    bullets: ["Cars, SUVs & trucks", "No broken windows", "We come to you fast"],
    bgPrompt:
      "A close-up of a modern car door in a parking lot at golden hour, a slim professional lockout tool being used gently at the top of the window, no damage. " + NO_TEXT,
    caption:
      "Keys locked in the car? Skip the coat hanger and the YouTube tutorial — modern doors hide airbags, sensors, and side-impact bars exactly where people try to pry, and one slip means a bent frame or scratched paint.\n\nWe carry professional lockout tools that open the door clean, the way it's meant to open, on most cars, SUVs, and trucks — push-to-start or traditional keys. We come to you, whether you're in a driveway, a parking garage, or stranded in a lot, and we verify it's your vehicle before we touch it.\n\nLocked out right now? Don't force it — call and we'll get you back in safely.",
    hashtags: ["carlockout", "lockedout", "emergencylocksmith", "247locksmith", "automotivelocksmith", "miamilocksmith"],
  },
  // 5 — COMMERCIAL
  {
    id: "commercial-rekey",
    headline: ["Commercial Lock", "Changes & Rekeys"],
    subhead: "New tenant or staff change? Secure it same-day.",
    bullets: ["Same-day rekeys", "Keep your hardware", "Keyed-alike options"],
    bgPrompt:
      "A locksmith's hands rekeying a commercial-grade lever lock cylinder on a glass storefront door, precision tools and pins visible, daytime. " + NO_TEXT,
    caption:
      "Whenever people change, your access should too. New tenant taking over a suite, an employee let go, a contractor who had a key during a build-out — any of these is a reason to rekey before it becomes a problem.\n\nRekeying re-pins your existing commercial locks so every old key stops working, while keeping the hardware you already paid for. We can key multiple doors alike so one key runs the whole space, or keep them separate for tighter control. When a lock is worn or you're upgrading security grade, we'll replace it with commercial-rated hardware instead.\n\nFor Miami businesses and property managers, we handle same-day changes so a turnover never leaves your space exposed overnight. Tell us how many doors and we'll get it locked down.",
    hashtags: ["commerciallocksmith", "rekey", "lockchange", "businesssecurity", "propertymanagement", "miamilocksmith"],
  },
  // 6 — COMMERCIAL
  {
    id: "panic-bars",
    headline: ["Panic Bars &", "Exit Devices"],
    subhead: "Safe, code-compliant exits for your building.",
    bullets: ["Fire-code compliant", "Push-to-exit hardware", "Install & repair"],
    bgPrompt:
      "A close-up of a stainless-steel push-bar panic device mounted on a commercial exit door, clean and modern, side lighting. " + NO_TEXT,
    caption:
      "Panic bars (exit devices) let anyone leave instantly in an emergency with a single push — while still keeping the door locked from the outside. For most commercial buildings they're not optional; they're tied to fire and life-safety code, and inspectors look for them on required exits.\n\nA bar that sticks, rattles, or doesn't latch isn't just annoying — it's a liability and a failed inspection waiting to happen. We install, adjust, and repair panic hardware, and pair it with the right strikes, closers, and alarms so the door is secure and compliant at the same time.\n\nIf you run a store, restaurant, office, or warehouse in Miami and you're not sure your exits meet code, we'll inspect them and tell you straight what needs attention.",
    hashtags: ["panicbar", "exitdevice", "commerciallocksmith", "commercialdoorhardware", "businesssecurity", "miamilocksmith"],
  },
  // 7 — COMMERCIAL
  {
    id: "electric-strikes-maglocks",
    headline: ["Electric Strikes", "& Mag Locks"],
    subhead: "Buzz-in and badge-in control for your doors.",
    bullets: ["Buzzer & intercom entry", "Fail-safe / fail-secure", "Tied to access control"],
    bgPrompt:
      "A macro close-up of an electric strike and a wired electromagnetic lock on a glass commercial door frame, neat wiring, modern entrance. " + NO_TEXT,
    caption:
      "Electric strikes and magnetic locks are what make a door buzz open from a desk or release for a valid badge. They're the muscle behind access control, intercom entry, and reception-controlled doors.\n\nThe details matter. A fail-secure strike stays locked if power is lost; a fail-safe mag lock releases so people can exit — and which one you need depends on the door, the code requirement, and whether it's on an exit path. Get it wrong and you either trap people in or leave a door unlocked during an outage. We also tie them into request-to-exit sensors, fire alarms, and door schedules so everything releases correctly in an emergency.\n\nWe spec, install, and troubleshoot electric strikes, mag locks, and the wiring behind them for Miami offices, lobbies, and retail. Let's make your entry doors smart and safe.",
    hashtags: ["maglock", "electricstrike", "accesscontrol", "commerciallocksmith", "businesssecurity", "miamilocksmith"],
  },
  // 8 — EMERGENCY
  {
    id: "residential-lockout",
    headline: ["Locked Out", "Of Your Home?"],
    subhead: "Fast, damage-free entry — day or night.",
    bullets: ["No damage to your door", "Spare key cut on-site", "24/7 mobile service"],
    bgPrompt:
      "A residential front door at dusk with a warm porch light on, a locksmith kneeling to work on the door handle, calm reassuring mood. " + NO_TEXT,
    caption:
      "Locked out of your house? Take a breath — this is one of the most common calls we get, and forcing it is the worst move. Prying a door or kicking it in usually costs far more than the lockout itself, between a cracked jamb, a bent door, and a lock you'll now have to replace.\n\nWe open most residential locks cleanly, with no damage, and we can cut you a spare on the spot so a single lost key never strands you again. If your lock is old or worn, we'll tell you honestly whether it's worth rekeying or upgrading while we're there.\n\nWe're mobile and available around the clock across Miami — nights, weekends, and holidays included. Don't risk your door; let us get you in the right way.",
    hashtags: ["lockedout", "houselockout", "residentiallocksmith", "emergencylocksmith", "247locksmith", "miamilocksmith"],
  },
  // 9 — COMMERCIAL
  {
    id: "storefront-repair",
    headline: ["Storefront", "Door Repairs"],
    subhead: "Sticking, sagging, or won't latch? We fix it.",
    bullets: ["Pivots & alignment", "Locks & closers", "Keep your door in service"],
    bgPrompt:
      "A modern aluminum-and-glass storefront door of a small business, slightly ajar, clean sidewalk, daytime, professional commercial exterior. " + NO_TEXT,
    caption:
      "A storefront door is the hardest-working door you own — opened hundreds of times a day, exposed to sun and weather, and the first thing customers touch. When the pivots wear, the alignment drifts, or the lock stops catching, it quickly becomes a security gap and a bad first impression.\n\nWe repair and adjust aluminum storefront doors: pivot and hinge wear, dragging or sagging panels, misaligned latches, worn cylinders, and closers that slam or won't pull the door shut. The goal is a door that opens smoothly, latches every time, and actually locks when you flip the key at close.\n\nServing retail, restaurants, and offices across Miami. If your front door is fighting you, we'll get it back to opening and locking the way it should.",
    hashtags: ["storefrontdoor", "commerciallocksmith", "doorrepair", "commercialdoorhardware", "businesssecurity", "miamilocksmith"],
  },
  // 10 — COMMERCIAL
  {
    id: "door-closers",
    headline: ["Commercial", "Door Closers"],
    subhead: "Doors that close and latch every single time.",
    bullets: ["Slam-free adjustment", "ADA-friendly settings", "Repair or replace"],
    bgPrompt:
      "A close-up of an overhead commercial door closer mounted at the top of a metal office door, clean mechanism, neutral interior lighting. " + NO_TEXT,
    caption:
      "A door closer is the quiet device at the top of the door that decides whether your door actually closes and latches — or drifts open and leaves you unsecured. When it fails, doors slam, stay propped, or stop just short of latching, which defeats every lock and access reader behind it.\n\nProper adjustment also matters for accessibility and safety: closing speed, latch speed, and opening force all have to be set within range so the door is easy to open but still self-closes and latches. On fire-rated doors, a working closer is a code requirement, not a nicety.\n\nWe adjust, rebuild, and replace commercial door closers on offices, stores, and multi-tenant buildings in Miami. If your doors slam or won't latch, we'll dial them in.",
    hashtags: ["doorcloser", "commerciallocksmith", "commercialdoorhardware", "doorrepair", "businesssecurity", "miamilocksmith"],
  },
  // 11 — COMMERCIAL
  {
    id: "retail-office-security",
    headline: ["Retail & Office", "Security Upgrades"],
    subhead: "Harden your space against break-ins and loss.",
    bullets: ["High-security locks", "Reinforced doors & strikes", "Access & restricted keys"],
    bgPrompt:
      "The interior entrance of a modern retail store or office at night with security shutters and a reinforced glass door, clean professional look. " + NO_TEXT,
    caption:
      "Most commercial break-ins aren't sophisticated — they exploit a weak strike, a builder-grade lock, or a door that never latched right. A security upgrade closes those gaps before they cost you inventory, a deductible, and downtime.\n\nWe assess your space and harden the weak points: high-security and ANSI Grade-1 locks, reinforced strike plates and door frames, restricted master keys that can't be copied off the street, and access control so you control and log every entry. For retail we add the layers that matter for shrink and after-hours security; for offices we focus on controlled access and clean audit trails.\n\nThink of it as a security tune-up for your business. We'll walk your Miami location, point out the realistic risks, and prioritize the fixes that give you the most protection first.",
    hashtags: ["commerciallocksmith", "businesssecurity", "retailsecurity", "officesecurity", "accesscontrol", "miamilocksmith"],
  },
  // 12 — EMERGENCY
  {
    id: "commercial-lockout",
    headline: ["Business", "Lockouts"],
    subhead: "Locked out of your store or office? We respond.",
    bullets: ["Storefronts & offices", "Damage-free entry", "Back open fast"],
    bgPrompt:
      "A commercial glass office or shop door early in the morning, a professional locksmith working the lock, city storefront setting, calm urgency. " + NO_TEXT,
    caption:
      "Locked out of your business is more than an inconvenience — every minute the door stays shut is lost sales, idle staff, and missed appointments. The reflex to jimmy the door or break the glass almost always costs more than the lockout and leaves you unsecured on top of it.\n\nWe open commercial doors — storefronts, offices, suites, and back-of-house — cleanly and without damage, and we verify you're authorized to be there first. While we're on-site, if a worn or failing lock caused the lockout, we can repair or rekey it so it doesn't strand you again tomorrow.\n\nWe're mobile across Miami and respond fast so you can open on time. Locked out of your business right now? Call and we'll get you back in.",
    hashtags: ["commerciallockout", "businesslockout", "commerciallocksmith", "emergencylocksmith", "247locksmith", "miamilocksmith"],
  },
  // 13 — COMMERCIAL
  {
    id: "commercial-hardware",
    headline: ["Commercial Door", "Hardware"],
    subhead: "Install & repair for every commercial door.",
    bullets: ["Levers, locks & hinges", "ADA & code compliant", "Built to take heavy use"],
    bgPrompt:
      "A close-up of commercial-grade lever handle and mortise lock hardware on a solid office door, brushed metal finish, professional interior. " + NO_TEXT,
    caption:
      "Commercial doors live a hard life, and residential-grade parts don't survive it. The right hardware — ANSI Grade-1 mortise locks, commercial levers, continuous hinges, exit devices, and closers — is built for thousands of cycles and for the code requirements your building has to meet.\n\nWe install and repair the full stack: lever handles and lock bodies, deadbolts and electric locks, hinges and pivots, closers, strikes, and exit hardware. Where accessibility or fire-rating applies, we make sure the door operates within ADA force and self-closes and latches as required.\n\nWhether you're outfitting a new build-out, replacing a failed lockset, or standardizing hardware across a Miami property, we'll spec parts that fit the door and the use — and won't be back on a service call in six months.",
    hashtags: ["commercialdoorhardware", "commerciallocksmith", "doorhardware", "businesssecurity", "propertymanagement", "miamilocksmith"],
  },
  // 14 — COMMERCIAL
  {
    id: "property-management",
    headline: ["Property Mgmt", "Security"],
    subhead: "One locksmith partner for your whole portfolio.",
    bullets: ["Turnover rekeys", "Master key planning", "Access control rollouts"],
    bgPrompt:
      "The entrance of a modern multi-tenant commercial or residential building with a secure access panel, professional property-management setting, daytime. " + NO_TEXT,
    caption:
      "Managing properties means managing keys and access at scale — and that's exactly where most security problems hide. Old tenant keys never returned, vendors with copies, no record of who can open what, and a frantic rekey every time a unit turns over.\n\nWe work with property managers and business owners as a single security partner across the portfolio: fast turnover rekeys between tenants, a planned master key system so your team holds one key instead of a bucket of them, restricted keys that can't be duplicated off-site, and access control that logs entries and lets you grant or cut access remotely.\n\nFrom a single building to a whole Miami portfolio, we'll standardize your hardware, document your keying, and be the number you call when a door, lock, or access issue comes up. Let's set up a plan that scales with you.",
    hashtags: ["propertymanagement", "commerciallocksmith", "businesssecurity", "accesscontrol", "masterkey", "miamilocksmith"],
  },
  // 15 — EMERGENCY
  {
    id: "lost-car-keys",
    headline: ["Lost Car Keys", "& Programming"],
    subhead: "New keys & fobs made and programmed on-site.",
    bullets: ["Transponder & smart keys", "Push-to-start fobs", "Cheaper than the dealer"],
    bgPrompt:
      "A hand holding a freshly cut car key and a black key fob next to a car, a key-cutting machine softly blurred in the background, professional automotive setting. " + NO_TEXT,
    caption:
      "Lost the only key to your car? You don't have to tow it to the dealer and wait days. Most modern keys are transponder or smart keys with a chip that has to be programmed to your specific vehicle — and that's work a properly equipped mobile locksmith does right in your driveway.\n\nWe cut and program transponder keys, remote head keys, and push-to-start smart fobs for most makes and models, usually for less than dealership pricing. It's also smart to make a spare before you're stranded — a backup key is a fraction of the cost and stress of an all-keys-lost situation.\n\nWe come to your home, office, or wherever the car is parked across Miami. Lost your keys or want a spare made? We'll get you driving again.",
    hashtags: ["lostcarkeys", "carkeyreplacement", "keyprogramming", "transponderkey", "automotivelocksmith", "miamilocksmith"],
  },
];
