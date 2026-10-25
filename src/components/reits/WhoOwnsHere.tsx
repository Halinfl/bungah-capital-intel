import Link from "next/link";
import { SourceChip } from "@/components/SourceChip";
import { fmtDay, fmtInt } from "@/lib/reits-shared";
import type { MarketOwners } from "@/lib/reits-market";

/** Compact list of REIT-owned hotels in a market, plus REIT transactions there as comps. */
export function WhoOwnsHere({ data, short }: { data: MarketOwners; short: string }) {
  const tickers = [...new Set(data.hotels.map((h) => h.ticker))].sort();
  const SHOWN = 8;
  const row = (h: MarketOwners["hotels"][number], i: number) => (
    <li key={i} className="flex items-baseline justify-between gap-3 px-4 py-2">
      <span className="min-w-0">
        <span className="block truncate text-sm text-white">{h.name}</span>
        {h.city ? <span className="block text-xs text-slate-300">{[h.city, h.state].filter(Boolean).join(", ")}</span> : null}
      </span>
      <span className="flex shrink-0 items-baseline gap-3 text-xs tabular-nums">
        {h.rooms != null ? (
          <a href={h.url} target="_blank" rel="noopener noreferrer" title={`Source: ${h.source}`} className="text-slate-200 underline decoration-white/25 underline-offset-4 hover:decoration-white">
            {fmtInt(h.rooms)} rooms
          </a>
        ) : null}
        <Link href={`/reits/${h.ticker.toLowerCase()}`} className="rounded border border-white/15 px-1.5 py-0.5 font-medium text-slate-100 hover:border-white/40">
          {h.ticker}
        </Link>
      </span>
    </li>
  );
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Who owns here</h2>
        <span className="text-xs text-slate-300">
          {data.hotels.length ? `${data.hotels.length} REIT-owned ${data.hotels.length === 1 ? "hotel" : "hotels"} · ${tickers.join(", ")}` : "REIT transactions"}
        </span>
      </div>
      {data.hotels.length ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.03]">
          <ul className="divide-y divide-white/[0.06]">{data.hotels.slice(0, SHOWN).map(row)}</ul>
          {data.hotels.length > SHOWN ? (
            <details className="border-t border-white/10">
              <summary className="cursor-pointer px-4 py-2 text-xs text-slate-300 hover:text-slate-200">
                +{data.hotels.length - SHOWN} more REIT-owned hotels in {short}
              </summary>
              <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">{data.hotels.slice(SHOWN).map(row)}</ul>
            </details>
          ) : null}
        </div>
      ) : null}
      {data.comps.length ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Recorded REIT transactions (comps)</h3>
          <p className="text-[13px] text-slate-300">From REIT filings; this list may be incomplete.</p>
          <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/10 bg-white/[0.03] text-sm">
            {data.comps.map((c, i) => (
              <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-2">
                <span className="min-w-0">
                  <span className="text-white">{c.hotel}</span>
                  <span className="ml-2 text-xs text-slate-300">
                    {fmtDay(c.date)} · {c.kind === "acquisition" ? "bought by" : c.pending ? "pending sale by" : "sold by"}{" "}
                    <Link href={`/reits/${c.ticker.toLowerCase()}`} className="text-slate-100 underline decoration-white/25 underline-offset-4 hover:decoration-white">
                      {c.ticker}
                    </Link>
                    {c.counterparty ? ` · ${c.kind === "acquisition" ? "seller" : "buyer"} ${c.counterparty}` : ""}
                    {c.rooms != null ? ` · ${fmtInt(c.rooms)} rooms` : ""}
                  </span>
                </span>
                <span className="flex items-baseline gap-3 text-xs tabular-nums">
                  {c.priceUsdM != null ? (
                    <span className="text-slate-100">${c.priceUsdM < 100 ? c.priceUsdM.toFixed(1) : Math.round(c.priceUsdM).toLocaleString("en-US")}M</span>
                  ) : (
                    <span className="text-slate-300">price not disclosed</span>
                  )}
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                    filing ↗
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <SourceChip label="REIT property schedules and transaction disclosures in SEC filings https://www.sec.gov/edgar/search/" />
        <Link href="/reits" className="text-xs text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white">
          All hotel REITs
        </Link>
      </div>
    </section>
  );
}
