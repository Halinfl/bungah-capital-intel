import { splitUrls } from "@/lib/source-links";
import { cleanSourceLabel } from "@/lib/public-text";
import { glueText } from "@/lib/glue";

/** Source label; any original URL inside it is clickable (new tab). Internal labels are stripped. */
export function SourceChip({ label }: { label: string }) {
  const clean = cleanSourceLabel(label);
  const parts = splitUrls(clean);
  return (
    <span
      className="relative z-10 inline-flex max-w-full items-start gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs leading-snug text-slate-300"
      title={clean}
    >
      <span className="shrink-0 font-medium text-emerald-300">Source</span>
      <span className="min-w-0 break-words">
        {parts.map((p, i) =>
          p.url ? (
            <a
              key={i}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 text-emerald-300 underline-offset-2 hover:underline"
            >
              {glueText(p.text)}{"\u00a0↗"}
            </a>
          ) : (
            <span key={i}>{glueText(p.text)}</span>
          )
        )}
      </span>
    </span>
  );
}
