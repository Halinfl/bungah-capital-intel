/**
 * File-based corpus exclusions: ChatQuestionLog ids that must never reach a train / eval export
 * (e.g. QA questions run against production). The DB is shared and never edited for this.
 * Source of truth: data/train/excluded-question-ids.txt (one id per line, "#" comments).
 */
import { readFileSync } from "fs";
import path from "path";

export const EXCLUDED_IDS_FILE = path.join("data", "train", "excluded-question-ids.txt");

export function parseExcludedIds(text: string): Set<string> {
  const ids = new Set<string>();
  for (const line of text.split(/\r?\n/)) {
    const id = line.replace(/#.*$/, "").trim();
    if (/^[a-z0-9]{20,40}$/i.test(id)) ids.add(id);
  }
  return ids;
}

/** Reads the exclusion list from the project root (cwd). A missing file means no exclusions. */
export function loadExcludedQuestionIds(root = process.cwd()): Set<string> {
  try {
    return parseExcludedIds(readFileSync(path.join(root, EXCLUDED_IDS_FILE), "utf8"));
  } catch {
    return new Set();
  }
}
