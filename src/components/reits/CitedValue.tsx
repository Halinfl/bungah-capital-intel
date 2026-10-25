import type { Cited } from "@/lib/reits-shared";

/** A reported number linked to the SEC filing it came from. */
export function CitedValue({
  c,
  fmt,
  className = "",
  stop = false,
}: {
  c: Cited | null;
  fmt: (v: number) => string;
  className?: string;
  /** Stop the click from bubbling to a clickable row. */
  stop?: boolean;
}) {
  if (!c) return <span className="text-slate-300">—</span>;
  return (
    <a
      href={c.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Source: ${c.source}`}
      onClick={stop ? (e) => e.stopPropagation() : undefined}
      className={`relative tabular-nums text-white underline decoration-white/25 underline-offset-4 hover:decoration-white ${className}`}
    >
      {fmt(c.value)}
      <span className="sr-only"> (source: {c.source})</span>
    </a>
  );
}
