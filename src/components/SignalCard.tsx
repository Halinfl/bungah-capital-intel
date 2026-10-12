import type { ReactNode } from "react";

/**
 * Compact signal card. With a primary URL the whole card opens it in a new tab via a stretched
 * link (the title <a> carries an absolute overlay), so there is no <a> nested inside <a>; other
 * links in the card sit above the overlay (relative z-10). Without a URL the card is static.
 */
export function SignalCard({
  primaryUrl,
  title,
  meta,
  children,
  className = "",
  tone = "border-white/10",
}: {
  primaryUrl?: string | null;
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Border / colour classes (e.g. radar severity); defaults to the neutral card border. */
  tone?: string;
}) {
  const clickable = Boolean(primaryUrl);
  return (
    <div
      data-card-link={clickable ? primaryUrl! : undefined}
      className={`relative rounded-lg border p-3 ${
        clickable
          ? `group cursor-pointer ${tone} transition-colors hover:border-emerald-400/40 hover:bg-white/[0.04] focus-within:border-emerald-400/60 focus-within:ring-1 focus-within:ring-emerald-400/40`
          : tone
      } ${className}`}
    >
      {meta ? <div className="flex flex-wrap items-center gap-2">{meta}</div> : null}
      <h3 className={`mt-1 text-sm font-medium leading-snug ${tone === "border-white/10" ? "text-white" : ""}`}>
        {clickable ? (
          <a
            href={primaryUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="outline-none group-hover:text-emerald-200"
          >
            <span aria-hidden="true" className="absolute inset-0 rounded-lg" />
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {children}
    </div>
  );
}
