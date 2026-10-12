import type { SourceLink } from "@/lib/source-links";

/** Each original article as its own link (new tab). Secondary = broker/advisor blog rows. */
export function SourceLinks({
  links,
  noPublicRead,
}: {
  links: SourceLink[];
  noPublicRead?: boolean;
}) {
  if (!links.length) {
    return noPublicRead ? (
      <span className="text-[11px] text-slate-500">no public read</span>
    ) : null;
  }
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] leading-snug">
      {links.map((l) => (
        <li key={l.url} className="inline-flex items-center gap-1">
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-300 underline-offset-2 hover:underline"
            title={l.url}
          >
            {l.label} ↗
          </a>
          {l.secondary ? (
            <span className="rounded border border-amber-500/30 px-1 text-[9px] uppercase tracking-wider text-amber-200/80">
              secondary
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
