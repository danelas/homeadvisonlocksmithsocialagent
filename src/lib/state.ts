import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { State, PublishedRecord } from "./types.ts";

const STATE_PATH = resolve(process.cwd(), "state.json");

export async function loadState(): Promise<State> {
  try {
    const raw = await readFile(STATE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as State;
    if (!parsed || !Array.isArray(parsed.published)) {
      return { published: [] };
    }
    return parsed;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return { published: [] };
    }
    throw err;
  }
}

export async function saveState(state: State): Promise<void> {
  const tmp = STATE_PATH + ".tmp";
  await writeFile(tmp, JSON.stringify(state, null, 2) + "\n", "utf-8");
  // Atomic-ish swap. On Windows this is two ops but git-friendly enough.
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + "\n", "utf-8");
}

export function hasPublished(state: State, id: string): boolean {
  // Once attempted, do NOT auto-retry — even on error. Otherwise a per-platform
  // failure (e.g. FB Page not connected, IG token expired) causes us to repost
  // the SAME content to the platform that succeeded over and over. If you
  // genuinely want to retry a failed post, remove its entry from state.json
  // manually.
  return state.published.some((r) => r.id === id);
}

export function recordPublish(state: State, record: PublishedRecord): State {
  return {
    ...state,
    published: [...state.published.filter((r) => r.id !== record.id), record],
  };
}
