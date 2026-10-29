import Link from "next/link";
import { HORIZONS, STAYS, fmtPct, ttLatest, ttShortDate } from "@/lib/tuesday-trends";

/** Days from a capture date (YYYY-MM-DD) to today in ET. */
function ageDays(date: string, now = new Date()): number {
  const today = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD
  return Math.round((Date.parse(`${today}T12:00:00Z`) - Date.parse(`${date}T12:00:00Z`)) / 86_400_000);
}

/**
 * Home: the latest Tuesday Trends issue, directly under the hero CTA (above the fold at 360 and 390).
 * Real data only: hidden when there is no capture or no week-over-week move. Says "This Tuesday" only while the
 * capture is at most 8 days old, otherwise "Latest". Neutral gray; the sign carries direction.
 */
export function ThisTuesdayCard() {
  const issue = ttLatest();
  if (!issue) return null;
  const top = [...issue.moves()].sort((a, b) => Math.abs(b.pct) - Math.abs(a.pct))[0];
  if (!top) return null;
  const n = issue.markets().length;
  const h = HORIZONS.find((x) => x.key === top.horizon)!;
  const s = STAYS.find((x) => x.key === top.stay)!;
  const fresh = ageDays(issue.date) <= 8;
  const kicker = fresh ? `This Tuesday · ${ttShortDate(issue.date)}` : `Latest · ${issue.capturedLabel.replace(/, \d{4}$/, "")}`;
  const prev = issue.prevCapturedLabel.replace(/^Tue, /, "").replace(/, \d{4}$/, "");
  return (
    <Link
      href="/tuesday-trends"
      className="block min-h-11 rounded-xl border border-white/[0.14] bg-white/[0.04] px-3.5 py-3 text-slate-100 transition hover:border-white/25 hover:bg-white/[0.06]"
      aria-label={`Tuesday Trends, rates captured ${issue.capturedLabel}: biggest move outside holiday weeks vs ${prev}, ${top.marketName} ${fmtPct(top.pct)}, ${h.long}, ${s.label.toLowerCase()}, same ${top.nPairs} hotels. Open the board`}
    >
      <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-[12px] uppercase tracking-[0.02em] text-slate-300">
        <span>{kicker}</span>
        <span className="normal-case tracking-normal">Google Hotels rates</span>
      </span>
      <span className="mt-1 block text-base font-semibold leading-snug text-white">
        Tuesday Trends: hotel rates, {n} US markets
      </span>
      <span className="mt-0.5 block text-[13px] tabular-nums text-slate-300">
        Biggest move outside holiday weeks: {top.marketName} {fmtPct(top.pct)} ({h.label}, {s.label.toLowerCase()}, same {top.nPairs} hotels vs {prev})
      </span>
      <span className="mt-2 block text-sm text-slate-200">{fresh ? "Open this week\u2019s board" : "Open the latest board"} →</span>
    </Link>
  );
}
