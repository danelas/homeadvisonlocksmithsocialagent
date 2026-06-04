// Blog topic queue. The agent walks this list in order, picking the first
// topic not in state.json's published list. Add new topics at the end;
// never reorder or reuse ids.
//
// ~30 starter topics across the locksmith service verticals. One per day =
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
];
