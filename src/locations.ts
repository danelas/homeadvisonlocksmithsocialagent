/**
 * CLI: print the Google Business Profile locations connected to your
 * Upload-Post profile so you can pick which one to post to.
 *
 *   npm run gbp:locations
 *
 * Copy the `name` of the location you want into .env:
 *   GBP_LOCATION_ID=accounts/123456789/locations/987654321
 *
 * The agent passes that value as `gbp_location_id` on every Google Business
 * post. Required whenever your Google connection has more than one profile —
 * otherwise Upload-Post errors asking you to select a location.
 */
import dotenv from "dotenv";
dotenv.config({ override: true });

import { listGbpLocations } from "./lib/locations.ts";

async function main(): Promise<void> {
  const locations = await listGbpLocations();

  if (locations.length === 0) {
    console.log(
      "No Google Business locations returned.\n" +
        "  • Make sure Google Business is connected on this Upload-Post profile.\n" +
        "  • If you have profiles but they're missing here, disconnect + reconnect\n" +
        "    Google at upload-post.com → Manage Users to refresh the scopes."
    );
    return;
  }

  console.log(`Found ${locations.length} Google Business location(s):\n`);
  locations.forEach((loc, i) => {
    console.log(`  [${i + 1}] ${loc.title}`);
    console.log(`      GBP_LOCATION_ID=${loc.name}\n`);
  });
  console.log(
    "Copy the GBP_LOCATION_ID line for the profile you want into your .env\n" +
      "(or set it as a GitHub Actions secret named GBP_LOCATION_ID)."
  );
}

main().catch((err) => {
  console.error("[gbp:locations] failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
