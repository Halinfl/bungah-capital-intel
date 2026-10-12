import type { SweepSignal } from "./sweep-2026-10-11.data";

/** Signal row with clickable original-article links (null = none recorded, e.g. "no public read"). */
export type SourceUrl = { url: string; label: string; secondary?: boolean };
export type LinkedSignal = SweepSignal & { sourceUrls?: SourceUrl[] | null };
