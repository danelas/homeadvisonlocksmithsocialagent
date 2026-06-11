// Blog topic queue. The agent walks this list in order, picking the first
// topic not in state.json's published list. Add new topics at the end;
// never reorder or reuse ids.
//
// ~60 topics across the locksmith service verticals. Two per day =
// roughly a month of runway. Keep titles keyword-led but human.

import type { Topic } from "./types.ts";

export const TOPICS: Topic[] = [
  // ---------- Emergency / lockouts (6) ----------
  {
    id: "locked-out-of-house-what-to-do",
    title: "Locked Out of Your House? Do This First",
    intent: "Someone locked out right now needs calm, safe, immediate steps.",
    keywords: ["locked out of house", "house lockout", "what to do locked out"],
    category: "emergency",
  },
  {
    id: "locked-keys-in-car",
    title: "Keys Locked in the Car? Don't Break a Window",
    intent: "Driver locked out of their car wants a damage-free way in fast.",
    keywords: ["keys locked in car", "car lockout", "locked out of car"],
    category: "automotive",
  },
  {
    id: "what-does-emergency-locksmith-cost",
    title: "What Does an Emergency Locksmith Cost?",
    intent: "Price-shopper before calling — wants to understand what drives the price.",
    keywords: ["emergency locksmith cost", "locksmith price", "24 hour locksmith near me"],
    category: "cost",
  },
  {
    id: "locked-out-at-night",
    title: "Locked Out at Night? How 24/7 Locksmiths Work",
    intent: "Late-night lockout — reassurance that help is available and how it works.",
    keywords: ["24 hour locksmith", "late night lockout", "emergency locksmith near me"],
    category: "emergency",
  },
  {
    id: "lost-house-keys-replace",
    title: "Lost Your House Keys? Rekey Instead of Worrying",
    intent: "Lost keys — worried someone could get in, weighing options.",
    keywords: ["lost house keys", "replace house keys", "rekey after lost keys"],
    category: "residential",
  },
  {
    id: "broken-key-in-lock",
    title: "Key Broke Off in the Lock? Here's the Fix",
    intent: "Key snapped in the cylinder — wants extraction guidance, not to make it worse.",
    keywords: ["broken key in lock", "key snapped in lock", "key extraction"],
    category: "residential",
  },

  // ---------- Residential / rekey (6) ----------
  {
    id: "rekey-vs-replace-locks",
    title: "Rekey vs. Replace Locks: Which Do You Need?",
    intent: "Homeowner deciding between rekeying and buying new hardware.",
    keywords: ["rekey vs replace", "rekey locks", "should I rekey or replace locks"],
    category: "residential",
  },
  {
    id: "rekey-locks-after-moving",
    title: "Just Moved In? Why You Should Rekey Right Away",
    intent: "New homeowner/renter wondering whether to change the locks.",
    keywords: ["rekey after moving", "change locks new house", "should I change locks when I move"],
    category: "residential",
  },
  {
    id: "how-rekeying-works",
    title: "How Rekeying a Lock Actually Works",
    intent: "Curious homeowner wants to understand rekeying before paying for it.",
    keywords: ["how does rekeying work", "what is rekeying", "rekey a lock"],
    category: "residential",
  },
  {
    id: "deadbolt-grades-explained",
    title: "Deadbolt Grades Explained: Grade 1 vs 2 vs 3",
    intent: "Shopper comparing deadbolts wants to know which grade to buy.",
    keywords: ["deadbolt grades", "grade 1 deadbolt", "ansi bhma lock grades"],
    category: "security",
  },
  {
    id: "one-key-for-every-lock",
    title: "Can You Make One Key Open Every Lock in Your Home?",
    intent: "Homeowner tired of a crowded keyring wants keyed-alike locks.",
    keywords: ["keyed alike locks", "one key for all locks", "master key home"],
    category: "residential",
  },
  {
    id: "mailbox-lock-replacement",
    title: "Mailbox Lock Stuck or Lost the Key? Your Options",
    intent: "Person with a broken or keyless mailbox lock needs a path forward.",
    keywords: ["mailbox lock replacement", "lost mailbox key", "mailbox locksmith"],
    category: "residential",
  },

  // ---------- Automotive (5) ----------
  {
    id: "car-key-replacement-vs-dealer",
    title: "Car Key Replacement: Locksmith vs. Dealership",
    intent: "Driver needs a new key and is comparing a locksmith to the dealer.",
    keywords: ["car key replacement", "locksmith vs dealership car key", "replace car key cost"],
    category: "automotive",
  },
  {
    id: "transponder-key-programming",
    title: "What Is a Transponder Key — and Can a Locksmith Program It?",
    intent: "Owner of a chipped key wants to know if a locksmith can help.",
    keywords: ["transponder key", "chip key programming", "program car key"],
    category: "automotive",
  },
  {
    id: "key-fob-not-working",
    title: "Key Fob Not Working? Battery, Reset, or Replace",
    intent: "Fob stopped working — wants to troubleshoot before paying.",
    keywords: ["key fob not working", "key fob battery", "key fob replacement"],
    category: "automotive",
  },
  {
    id: "spare-car-key-worth-it",
    title: "Is a Spare Car Key Worth It? (Yes — Here's Why)",
    intent: "Single-key owner deciding whether to make a backup.",
    keywords: ["spare car key", "duplicate car key", "backup car key"],
    category: "automotive",
  },
  {
    id: "push-to-start-key-lost",
    title: "Lost Your Push-to-Start Key Fob? What Happens Next",
    intent: "Owner of a keyless-ignition car lost the only fob.",
    keywords: ["push to start key lost", "smart key replacement", "keyless ignition key lost"],
    category: "automotive",
  },

  // ---------- Commercial (4) ----------
  {
    id: "master-key-system-business",
    title: "Master Key Systems: Control Who Goes Where",
    intent: "Business owner wants to understand master keying for their building.",
    keywords: ["master key system", "commercial master key", "business keying"],
    category: "commercial",
  },
  {
    id: "rekey-office-after-employee-leaves",
    title: "Employee Left? Rekey Your Business the Same Day",
    intent: "Business owner worried about a former employee's key.",
    keywords: ["rekey office", "change business locks", "employee left locks"],
    category: "commercial",
  },
  {
    id: "high-security-keys-restricted",
    title: "High-Security Keys: Why They Can't Be Copied at the Store",
    intent: "Owner wants keys that can't be duplicated without authorization.",
    keywords: ["high security keys", "restricted keys", "keys that can't be copied"],
    category: "commercial",
  },
  {
    id: "panic-bars-and-exit-devices",
    title: "Panic Bars & Exit Devices: What Your Business Needs",
    intent: "Business owner navigating exit-hardware requirements.",
    keywords: ["panic bar", "exit device", "commercial door hardware"],
    category: "commercial",
  },

  // ---------- Smart locks (4) ----------
  {
    id: "smart-lock-worth-it",
    title: "Are Smart Locks Worth It? An Honest Locksmith Take",
    intent: "Homeowner weighing a smart lock — wants real pros and cons.",
    keywords: ["are smart locks worth it", "smart lock pros and cons", "smart lock"],
    category: "smart-locks",
  },
  {
    id: "smart-lock-installation",
    title: "Smart Lock Installation: What to Know Before You Buy",
    intent: "Buyer wants to avoid a smart lock that won't fit their door.",
    keywords: ["smart lock installation", "smart lock door fit", "install smart lock"],
    category: "smart-locks",
  },
  {
    id: "smart-lock-dead-battery",
    title: "Smart Lock Battery Died? How to Avoid Getting Locked Out",
    intent: "Smart-lock owner worried about battery lockouts.",
    keywords: ["smart lock dead battery", "smart lock locked out", "smart lock backup key"],
    category: "smart-locks",
  },
  {
    id: "keypad-vs-smart-lock",
    title: "Keypad Lock vs. Smart Lock: Which Is Right for You?",
    intent: "Shopper comparing simple keypad locks to app-connected smart locks.",
    keywords: ["keypad lock vs smart lock", "keypad door lock", "best keyless lock"],
    category: "smart-locks",
  },

  // ---------- Security / general (5) ----------
  {
    id: "stop-door-kick-ins",
    title: "Stop Door Kick-Ins: The Strike Plate Upgrade That Works",
    intent: "Homeowner wants to harden their door against forced entry.",
    keywords: ["stop door kick in", "reinforce door", "strike plate upgrade"],
    category: "security",
  },
  {
    id: "are-your-locks-good-enough",
    title: "Are Your Locks Actually Good Enough? A 5-Minute Check",
    intent: "Homeowner wants a quick way to assess their current locks.",
    keywords: ["are my locks secure", "home lock security", "check home security"],
    category: "security",
  },
  {
    id: "how-often-rekey-home",
    title: "How Often Should You Rekey Your Home?",
    intent: "Homeowner wondering about a sensible rekeying cadence.",
    keywords: ["how often rekey home", "when to rekey", "rekey schedule"],
    category: "security",
  },
  {
    id: "smart-ways-hide-spare-key",
    title: "Why the Fake Rock Doesn't Work — Smarter Spare-Key Options",
    intent: "Homeowner hiding a spare key wants safer alternatives.",
    keywords: ["hide spare key", "spare key ideas", "lockbox for key"],
    category: "security",
  },
  {
    id: "what-to-look-for-in-a-locksmith",
    title: "How to Choose a Locksmith You Can Trust",
    intent: "Consumer wants to avoid scam locksmiths and pick a legit one.",
    keywords: ["how to choose a locksmith", "trusted locksmith", "avoid locksmith scams"],
    category: "general",
  },

  // ---------- Batch 2 (added for 2x-daily cadence) ----------
  // ---------- Emergency / lockouts ----------
  {
    id: "locked-out-of-apartment",
    title: "Locked Out of Your Apartment? Renter's Guide to Getting Back In",
    intent: "Renter locked out wants to know whether to call the landlord or a locksmith.",
    keywords: ["locked out of apartment", "apartment lockout", "renter locked out"],
    category: "emergency",
  },
  {
    id: "door-lock-jammed-wont-turn",
    title: "Door Lock Jammed or Key Won't Turn? Causes and Fixes",
    intent: "Key goes in but won't turn — wants to know why and what's safe to try.",
    keywords: ["key won't turn in lock", "door lock jammed", "stuck door lock"],
    category: "emergency",
  },
  {
    id: "locked-out-in-bad-weather",
    title: "Locked Out in Bad Weather: How to Stay Safe While You Wait",
    intent: "Person locked out in heat, cold, or rain needs safety-first guidance.",
    keywords: ["locked out of house", "emergency locksmith", "lockout help"],
    category: "emergency",
  },
  {
    id: "how-fast-can-a-locksmith-arrive",
    title: "How Fast Can a Locksmith Get to You? Response Times Explained",
    intent: "Someone mid-lockout wants realistic ETAs and what affects them.",
    keywords: ["locksmith response time", "how long does a locksmith take", "mobile locksmith near me"],
    category: "emergency",
  },
  {
    id: "locked-out-with-pet-or-child-inside",
    title: "Pet or Child Locked Inside? When It's an Emergency",
    intent: "Panicked parent or pet owner needs to know when to call 911 vs. a locksmith.",
    keywords: ["child locked in house", "pet locked inside", "emergency lockout"],
    category: "emergency",
  },

  // ---------- Residential ----------
  {
    id: "front-door-lock-types",
    title: "Front Door Lock Types: Knobs, Deadbolts, Handlesets & More",
    intent: "Homeowner replacing a front-door lock wants to understand the options.",
    keywords: ["front door lock types", "types of door locks", "best front door lock"],
    category: "residential",
  },
  {
    id: "sliding-glass-door-locks",
    title: "Sliding Glass Door Locks: Fixing the Weakest Door in Your Home",
    intent: "Homeowner worried their patio slider is easy to force open.",
    keywords: ["sliding glass door lock", "patio door security", "secure sliding door"],
    category: "residential",
  },
  {
    id: "garage-entry-door-security",
    title: "The Garage Entry Door: Your Home's Forgotten Weak Spot",
    intent: "Homeowner overlooking the interior garage-to-house door's security.",
    keywords: ["garage entry door lock", "garage door security", "secure garage door"],
    category: "residential",
  },
  {
    id: "door-wont-latch-strike-alignment",
    title: "Door Won't Latch? It's Probably the Strike Plate",
    intent: "Homeowner with a door that won't stay shut wants the real cause fixed.",
    keywords: ["door won't latch", "strike plate alignment", "door lock not catching"],
    category: "residential",
  },
  {
    id: "rekeying-rental-property-landlords",
    title: "Rekeying Rental Properties: A Landlord's Turnover Checklist",
    intent: "Landlord wants a simple, legal-aware lock routine between tenants.",
    keywords: ["rekey rental property", "landlord change locks", "tenant turnover locks"],
    category: "residential",
  },
  {
    id: "duplicate-keys-where-and-how",
    title: "Where to Get Keys Duplicated — and Which Keys Can't Be Copied",
    intent: "Person needs a spare key and wants to know the best place to get one.",
    keywords: ["key duplication", "copy a key", "duplicate house key"],
    category: "residential",
  },

  // ---------- Automotive ----------
  {
    id: "car-key-stuck-in-ignition",
    title: "Key Stuck in the Ignition? Don't Force It — Do This",
    intent: "Driver with a stuck ignition key wants safe steps before damage happens.",
    keywords: ["key stuck in ignition", "car key won't come out", "ignition repair"],
    category: "automotive",
  },
  {
    id: "ignition-cylinder-problems",
    title: "Ignition Won't Turn? Signs Your Ignition Cylinder Is Failing",
    intent: "Driver whose key won't turn the ignition wants causes and costs.",
    keywords: ["ignition won't turn", "ignition cylinder replacement", "car ignition problems"],
    category: "automotive",
  },
  {
    id: "motorcycle-key-replacement",
    title: "Lost Motorcycle Keys? Replacement Options That Don't Involve Towing",
    intent: "Rider lost their only bike key and wants a mobile solution.",
    keywords: ["motorcycle key replacement", "lost motorcycle key", "motorcycle locksmith"],
    category: "automotive",
  },
  {
    id: "trunk-locked-keys-inside",
    title: "Keys Locked in the Trunk? Why It's Trickier Than the Cabin",
    intent: "Driver with keys shut in the trunk needs to know how pros open it.",
    keywords: ["keys locked in trunk", "trunk lockout", "open locked trunk"],
    category: "automotive",
  },
  {
    id: "laser-cut-vs-standard-car-keys",
    title: "Laser-Cut vs. Standard Car Keys: What's the Difference?",
    intent: "Owner replacing a key wants to know why some keys cost more.",
    keywords: ["laser cut car key", "high security car key", "sidewinder key"],
    category: "automotive",
  },

  // ---------- Commercial ----------
  {
    id: "commercial-lock-grades",
    title: "Commercial Lock Grades: Why Office Doors Need Grade 1 Hardware",
    intent: "Business owner wants to know what hardware is appropriate for a storefront.",
    keywords: ["commercial lock grades", "grade 1 commercial locks", "business door hardware"],
    category: "commercial",
  },
  {
    id: "storefront-door-lock-repair",
    title: "Storefront Door Problems: Aluminum Doors, Pivots & Panic Hardware",
    intent: "Shop owner with a misbehaving glass storefront door needs repair guidance.",
    keywords: ["storefront door repair", "commercial door lock repair", "aluminum door lock"],
    category: "commercial",
  },
  {
    id: "access-control-vs-keys",
    title: "Keycards, Fobs, or Keys? Choosing Access Control for a Small Business",
    intent: "Owner outgrowing physical keys is weighing electronic access control.",
    keywords: ["access control small business", "keycard entry system", "key fob door entry"],
    category: "commercial",
  },
  {
    id: "file-cabinet-and-desk-locks",
    title: "Locked Out of a File Cabinet or Desk? Yes, Locksmiths Open Those",
    intent: "Office worker locked out of a cabinet or desk drawer needs options.",
    keywords: ["file cabinet lock", "desk lock replacement", "cabinet locksmith"],
    category: "commercial",
  },

  // ---------- Smart locks ----------
  {
    id: "smart-lock-security-risks",
    title: "Can Smart Locks Be Hacked? Real Risks vs. Hype",
    intent: "Skeptical buyer wants an honest read on smart-lock vulnerabilities.",
    keywords: ["can smart locks be hacked", "smart lock security", "are smart locks safe"],
    category: "smart-locks",
  },
  {
    id: "smart-lock-for-airbnb-rentals",
    title: "Smart Locks for Airbnb & Rentals: Codes Beat Key Handoffs",
    intent: "Short-term-rental host wants keyless check-in done right.",
    keywords: ["smart lock airbnb", "rental property smart lock", "keyless entry rental"],
    category: "smart-locks",
  },
  {
    id: "retrofit-smart-lock-keep-keys",
    title: "Retrofit Smart Locks: Go Keyless Without Replacing Your Deadbolt",
    intent: "Renter or cautious owner wants smart features but keeps existing keys.",
    keywords: ["retrofit smart lock", "smart lock for renters", "smart deadbolt converter"],
    category: "smart-locks",
  },
  {
    id: "troubleshooting-smart-lock-problems",
    title: "Smart Lock Acting Up? Fixes for the 6 Most Common Problems",
    intent: "Smart-lock owner with connectivity or motor issues wants quick fixes.",
    keywords: ["smart lock not working", "smart lock troubleshooting", "smart lock won't lock"],
    category: "smart-locks",
  },

  // ---------- Security ----------
  {
    id: "home-security-after-break-in",
    title: "After a Break-In: A Locksmith's Recovery Checklist",
    intent: "Burglary victim needs a calm, ordered plan to re-secure their home.",
    keywords: ["after a break in", "burglary checklist", "re-secure home"],
    category: "security",
  },
  {
    id: "window-locks-overlooked",
    title: "Window Locks: The Security Upgrade Everyone Skips",
    intent: "Homeowner hardening doors forgets windows — what to add and where.",
    keywords: ["window locks", "window security", "secure home windows"],
    category: "security",
  },
  {
    id: "vacation-home-security-checklist",
    title: "Leaving Town? A Lock-Focused Vacation Security Checklist",
    intent: "Traveler wants the house buttoned up before a trip.",
    keywords: ["vacation home security", "secure house before vacation", "travel security checklist"],
    category: "security",
  },
  {
    id: "door-viewers-and-secondary-locks",
    title: "Peepholes, Chains & Bars: Do Secondary Door Locks Help?",
    intent: "Apartment dweller or homeowner weighing add-on door hardware.",
    keywords: ["door chain lock", "door security bar", "peephole installation"],
    category: "security",
  },
  {
    id: "safes-home-what-to-know",
    title: "Home Safes 101: Sizes, Ratings, and Where to Put One",
    intent: "Homeowner shopping for a first safe wants practical guidance.",
    keywords: ["home safe buying guide", "best home safe", "safe installation"],
    category: "security",
  },

  // ---------- Cost / general ----------
  {
    id: "rekey-cost-guide",
    title: "How Much Does It Cost to Rekey a House?",
    intent: "Homeowner budgeting a whole-house rekey wants per-lock pricing logic.",
    keywords: ["rekey cost", "cost to rekey house", "rekey locks price"],
    category: "cost",
  },
  {
    id: "car-key-replacement-cost-guide",
    title: "Car Key Replacement Cost: From Basic Keys to Smart Fobs",
    intent: "Driver pricing a replacement key across key types.",
    keywords: ["car key replacement cost", "key fob replacement cost", "transponder key cost"],
    category: "cost",
  },
  {
    id: "locksmith-scams-red-flags",
    title: "Locksmith Scams: 7 Red Flags Before You Hand Over a Dime",
    intent: "Consumer wants to spot bait-and-switch pricing and fake locksmiths.",
    keywords: ["locksmith scams", "locksmith bait and switch", "fake locksmith"],
    category: "general",
  },
  {
    id: "questions-to-ask-locksmith-on-phone",
    title: "5 Questions to Ask a Locksmith Before They Dispatch",
    intent: "Caller wants a quick script to vet a locksmith over the phone.",
    keywords: ["questions to ask a locksmith", "hiring a locksmith", "locksmith quote"],
    category: "general",
  },
];
