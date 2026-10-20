import { cleanSourceLabel } from "@/lib/public-text";

/**
 * Plain, muted source line for cards with no link — reads as "here is the source" rather than a broken link.
 * Never clickable; URLs (if any slipped into the label) are dropped from the text.
 */
export function SourceNote({ label, noPublicRead }: { label: string; noPublicRead?: boolean }) {
  const text = cleanSourceLabel(label)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([;,.])/g, "$1")
    .trim();
  return (
    <p className="text-xs leading-snug text-slate-200">
      <span className="text-slate-200">Source:</span> {text || "not linked"}
      {noPublicRead ? <span className="text-slate-200"> · no public read</span> : null}
    </p>
  );
}
