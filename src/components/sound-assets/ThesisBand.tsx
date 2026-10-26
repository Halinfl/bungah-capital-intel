import Link from "next/link";
import { BTC, HOLDINGS_DISCLOSURE, HOLDINGS_PLACEHOLDER, btcHistoryYears } from "@/lib/sound-assets";

/**
 * Persistent labeled band on every /hard-assets page: the thesis and all five disclosures (spec §7),
 * visible, never collapsed. Same charcoal palette; the band is a label, not a new color.
 * Never render this on a data page (Tuesday Trends, REITs, Ledger).
 */
export function ThesisBand() {
  const years = btcHistoryYears();
  return (
    <section
      aria-label="Editorial thesis section and disclosures"
      className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2.5 sm:px-5 sm:py-3"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-white">Editorial thesis section</span>
        <span className="hidden text-[13px] text-slate-300 sm:inline">This section argues a stated thesis. Our data products do not.</span>
      </div>
      <ol className="mt-1.5 grid grid-cols-1 gap-x-6 gap-y-1 text-[14px] leading-snug text-slate-200 sm:mt-2 sm:gap-y-1.5 sm:text-[13px] md:grid-cols-2">
        <li>
          <span className="text-slate-400">1.</span> Our thesis, stated up front: we believe Bitcoin is the most sound
          asset humans have ever had access to. This section argues that thesis.
        </li>
        <li>
          <span className="text-slate-400">2.</span> Our holdings:{" "}
          {HOLDINGS_DISCLOSURE ?? (
            <span className="rounded border border-dashed border-white/40 px-1.5 py-0.5 font-medium text-white">
              {HOLDINGS_PLACEHOLDER}
            </span>
          )}
        </li>
        <li>
          <span className="text-slate-400">3.</span> We make no price predictions, ever: not for BTC, not for hotels.
        </li>
        <li>
          <span className="text-slate-400">4.</span> BTC has {years} years of history (genesis block{" "}
          <a href={BTC.genesis.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
            January 3, 2009 ↗
          </a>
          ); statistical claims carry that caveat.
        </li>
        <li className="md:col-span-2">
          <span className="text-slate-400">5.</span> No sponsorships from bitcoin-industry companies; if that ever
          changes, the disclosure goes at the top of the page, not in fine print.{" "}
          <Link href="/sponsorship-policy" className="underline underline-offset-2 hover:text-white">
            Sponsorship policy
          </Link>
        </li>
      </ol>
    </section>
  );
}
