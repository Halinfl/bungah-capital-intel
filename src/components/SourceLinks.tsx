import type { SourceLink } from "@/lib/source-links";
import { scrubInternal } from "@/lib/public-text";

const linkCls = "relative z-10 text-emerald-300 underline-offset-2 hover:underline focus-visible:underline";

function Item({ l }: { l: SourceLink }) {
  return (
    <li className="relative z-10 inline-flex items-center gap-1">
      <a href={l.url} target="_blank" rel="noopener noreferrer" className={linkCls} title={l.url}>
        {scrubInternal(l.label)} ↗
      </a>
      {l.secondary ? (
        <span className="rounded border border-amber-500/30 px-1 text-xs uppercase tracking-wider text-amber-200/80">
          secondary
        </span>
      ) : null}
    </li>
  );
}

/**
 * Each original article as its own link (new tab). Secondary = broker/advisor blog rows.
 * Links sit above a stretched card link (relative z-10) so they stay individually clickable.
 * `limit` keeps cards compact; the rest open from a "+N more" disclosure.
 */
export function SourceLinks({
  links,
  noPublicRead,
  limit,
}: {
  links: SourceLink[];
  noPublicRead?: boolean;
  limit?: number;
}) {
  if (!links.length) {
    return noPublicRead ? <span className="text-xs text-slate-300">no public read</span> : null;
  }
  const shown = limit ? links.slice(0, limit) : links;
  const rest = limit ? links.slice(limit) : [];
  return (
    <div className="relative z-10 text-xs leading-snug">
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {shown.map((l) => (
          <Item key={`${l.url}|${l.label}`} l={l} />
        ))}
      </ul>
      {rest.length ? (
        <details className="mt-1">
          <summary className="cursor-pointer select-none text-slate-300 hover:text-slate-300">
            +{rest.length} more source{rest.length === 1 ? "" : "s"}
          </summary>
          <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {rest.map((l) => (
              <Item key={`${l.url}|${l.label}`} l={l} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
