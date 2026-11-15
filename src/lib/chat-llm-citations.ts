/**
 * LLM answer cleanup: the citations array lists only sources the prose actually used,
 * and leftover 【】 citation markers are stripped.
 */

/** Remove empty or leftover CJK-bracket citation markers the model sometimes emits. */
export function stripCitationBrackets(text: string): string {
  return text
    .replace(/\u3010\s*\u3011/g, "")
    .replace(/\u3010[^\u3011]*\u3011/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/ {2,}/g, " ")
    .trim();
}

function hostnames(label: string): string[] {
  const out: string[] = [];
  const urls = label.match(/https?:\/\/[^\s)\]>,"]+/gi) ?? [];
  for (const u of urls) {
    try {
      out.push(new URL(u).hostname.replace(/^www\./i, "").toLowerCase());
    } catch {
      /* ignore */
    }
  }
  for (const h of label.match(/\b(?:[a-z0-9-]+\.)+(?:com|org|gov|edu|net|io|us)\b/gi) ?? []) {
    out.push(h.replace(/^www\./i, "").toLowerCase());
  }
  return [...new Set(out)];
}

/** True when the answer text actually refers to this source label. */
export function citationMentioned(answer: string, label: string): boolean {
  const hay = answer.toLowerCase();
  const raw = (label ?? "").trim();
  if (!raw) return false;
  const lower = raw.toLowerCase();
  if (hay.includes(lower)) return true;
  for (const h of hostnames(raw)) {
    if (h && hay.includes(h)) return true;
  }
  const core = lower.split(/[(|]/)[0].trim();
  if (core.length >= 8 && hay.includes(core)) return true;
  const first = core.split(/[,·]/)[0].trim();
  if (first.length >= 4 && hay.includes(first)) return true;
  // Host FY guidance should cite the 8-K when the answer names that release.
  if (/8-k|earnings release/i.test(raw) && (/\b8-?k\b/.test(hay) || /earnings release/.test(hay))) return true;
  return false;
}

/** Keep only candidate source labels that the answer text actually uses, in first-use order. */
export function citationsUsedInAnswer(answer: string, candidates: string[]): string[] {
  const used: string[] = [];
  const seen = new Set<string>();
  for (const c of candidates) {
    const label = (c ?? "").trim();
    if (!label || seen.has(label)) continue;
    if (!citationMentioned(answer, label)) continue;
    seen.add(label);
    used.push(label);
  }
  return used;
}
