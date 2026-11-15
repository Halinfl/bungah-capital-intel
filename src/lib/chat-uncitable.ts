/**
 * A question that leans on a source we cannot cite (a DOI, a clearly invented paper, an unsourced 999% print)
 * must be refused before market routing, so a Nashville RevPAR memo cannot swallow it.
 */
export const UNCITABLE_REFUSAL =
  "I can't find that source, so I won't use a figure from it. If you have a public filing, government release, or other cited source, share the link and I'll try again.";

export function asksForUncitableSource(question: string): boolean {
  const q = question.trim();
  if (!q) return false;
  if (/\bdoi:\s*10\.\d+\//i.test(q)) return true;
  if (/\b(fake|fabricated|made-up|non[- ]existent)\b.{0,60}\b(doi|paper|citation|source|study|article)\b/i.test(q)) return true;
  if (/\b(doi|paper|citation|study)\b.{0,60}\b(fake|fabricated|made-up|non[- ]existent)\b/i.test(q)) return true;
  return false;
}
