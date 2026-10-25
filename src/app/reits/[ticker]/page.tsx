import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StatCard } from "@/components/StatCard";
import { SignalCard } from "@/components/SignalCard";
import { SourceChip } from "@/components/SourceChip";
import { ReitsTabs } from "@/components/reits/ReitsTabs";
import { CitedValue } from "@/components/reits/CitedValue";
import { Independence } from "@/components/reits/Independence";
import { reitsTabs } from "@/lib/reits-tabs";
import {
  REITS_FIRST_CAPTURE,
  chipLabel,
  fmtDate,
  fmtInt,
  fmtMoney,
  fmtPct,
  fmtQuarter,
  peerLabel,
  reitByTicker,
  reits,
  fmtDay,
  fmtRange,
  type Cited,
  type Transaction,
} from "@/lib/reits";

export const dynamicParams = false;

export function generateStaticParams() {
  return reits().map((r) => ({ ticker: r.ticker.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ ticker: string }> }): Promise<Metadata> {
  const { ticker } = await params;
  const r = reitByTicker(ticker);
  if (!r) return {};
  return {
    title: `${r.name} (${r.ticker}) · Bungah Capital Intel`,
    description: `${r.name} (${r.ticker}): reported RevPAR, ADR, occupancy, portfolio by market and earnings calls, each figure linked to its SEC filing.`,
  };
}

function TxCard({ t }: { t: Transaction }) {
  return (
    <SignalCard
      primaryUrl={t.url}
      title={`${t.kind === "acquisition" ? "Acquired" : t.pending ? "Agreed to sell" : "Sold"} ${t.hotel}`}
      meta={
        <>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs uppercase tracking-wider text-slate-300">{t.kind}</span>
          {t.priceUsdM != null ? (
            <span className="text-xs font-semibold tabular-nums text-slate-100">
              ${t.priceUsdM < 100 ? t.priceUsdM.toFixed(1) : Math.round(t.priceUsdM).toLocaleString("en-US")}M
            </span>
          ) : null}
          <span className="text-xs text-slate-300">{fmtDay(t.date)}</span>
        </>
      }
    >
      <p className="mt-1 text-sm text-slate-300">
        {[
          [t.city, t.state].filter(Boolean).join(", "),
          t.rooms != null ? `${fmtInt(t.rooms)} rooms` : null,
          t.counterparty ? `${t.kind === "acquisition" ? "Seller" : "Buyer"}: ${t.counterparty}` : null,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <div className="mt-2">
        <SourceChip label={chipLabel(t)} />
      </div>
    </SignalCard>
  );
}

function Stat({ label, c, fmt }: { label: string; c: Cited | null; fmt: (v: number) => string }) {
  if (!c) return null;
  return <StatCard label={label} value={fmt(c.value)} sourceLabel={chipLabel(c)} />;
}

const money2 = (v: number) => fmtMoney(v, 2);

export default async function ReitPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const r = reitByTicker(ticker);
  if (!r) notFound();

  const arc = r.quarters.filter((q) => q.adr || q.revpar || q.occupancy);
  const siteMarkets = r.markets.filter((m) => m.slug);
  const otherMarkets = r.markets.filter((m) => !m.slug);
  const hasCapital =
    r.dividends.length > 0 || r.dividendNote != null || r.transactions.length > 0 || r.txIncomplete || r.guidance.length > 0 || (r.debt?.items.length ?? 0) > 0 || r.buybacks.length > 0;
  const txShown = 6;
  const latestGuidance = r.guidance.length ? r.guidance[r.guidance.length - 1] : null;
  const guidanceRows = latestGuidance ? r.guidance.filter((g) => g.period === latestGuidance.period) : [];
  const gMetrics = [
    ...new Map(guidanceRows.flatMap((g) => g.items).map((i) => [i.metric, { metric: i.metric, label: i.label }])).values(),
  ];
  const guidanceOn = (d: string) => {
    const t = Date.parse(d);
    return r.guidance.find((g) => Math.abs(Date.parse(g.date) - t) <= 2 * 86400000) ?? null;
  };
  const askHref = `/chat?q=${encodeURIComponent(
    `${r.name} (${r.ticker}): latest reported RevPAR, ADR and occupancy, portfolio and capital?`
  )}`;
  const summaryBits = [
    r.latest.hotels ? `${fmtInt(r.latest.hotels.value)} hotels` : null,
    r.latest.rooms ? `${fmtInt(r.latest.rooms.value)} rooms` : null,
    siteMarkets.length ? `in ${siteMarkets.length} of the markets this site covers${otherMarkets.length ? " and elsewhere" : ""}` : null,
  ].filter(Boolean);

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <ReitsTabs active="reits" tabs={reitsTabs()} />
        <div>
          <Link href="/reits" className="text-xs text-slate-300 hover:text-emerald-300">
            ← REITs
          </Link>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <h1 className="t-h1">
              {r.name} <span className="text-slate-300">({r.ticker})</span>
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Reported data
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-300">
            <span>{peerLabel(r.ticker)}</span>
            <span className="mx-2">·</span>
            REIT dashboard
          </p>
          {summaryBits.length ? (
            <p className="mt-4 max-w-3xl text-slate-300">
              {summaryBits.join(", ")}
              {r.latestQuarter ? ` at the end of ${fmtQuarter(r.latestQuarter)}, as reported.` : "."}
            </p>
          ) : null}
          <Independence className="mt-2" />
        </div>
      </div>

      {/* ---------- Snapshot (reported) ---------- */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Snapshot</h2>
          <span className="text-xs text-slate-300">{fmtQuarter(r.latestQuarter)} · reported</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Stat label="RevPAR" c={r.latest.revpar} fmt={money2} />
          <Stat label="ADR" c={r.latest.adr} fmt={money2} />
          <Stat label="Occupancy" c={r.latest.occupancy} fmt={fmtPct} />
          <Stat label="Hotels" c={r.latest.hotels} fmt={fmtInt} />
          <Stat label="Rooms" c={r.latest.rooms} fmt={fmtInt} />
        </div>
        {!r.latest.hotels && r.latest.rooms ? (
          <p className="text-[13px] text-slate-300">
            The company states room counts but no hotel count, so no hotel count is shown. The portfolio below lists the
            hotels named in its filings.
          </p>
        ) : null}
        <p className="text-[13px] text-slate-300">
          Tracking gap (captured rate vs reported ADR) appears after the first weekly capture,{" "}
          {fmtDate(REITS_FIRST_CAPTURE, { year: true })}.
        </p>
      </section>

      {/* ---------- Portfolio ---------- */}
      {r.markets.length ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Portfolio</h2>
            <span className="text-xs text-slate-300">
              {r.properties.length} hotels · {r.markets.length} {r.markets.length === 1 ? "market" : "markets"}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {r.markets.map((m) => {
              const rooms = m.properties.reduce((s, p) => s + (p.rooms ?? 0), 0);
              const allRooms = m.properties.every((p) => p.rooms != null);
              const body = (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-medium text-white">{m.label}</h3>
                    <span className="text-xs tabular-nums text-slate-300">
                      {m.properties.length} {m.properties.length === 1 ? "hotel" : "hotels"}
                      {allRooms && rooms ? ` · ${fmtInt(rooms)} rooms` : ""}
                    </span>
                  </div>
                  <ul className="mt-2 space-y-0.5 text-[13px] text-slate-300">
                    {m.properties.map((p, i) => (
                      <li key={i} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{p.name}</span>
                        {p.rooms != null ? <span className="shrink-0 tabular-nums">{fmtInt(p.rooms)}</span> : null}
                      </li>
                    ))}
                  </ul>
                </>
              );
              return m.slug ? (
                <Link
                  key={m.label}
                  href={`/markets/${m.slug}`}
                  className="block rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-emerald-500/40"
                >
                  {body}
                </Link>
              ) : (
                <div key={m.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  {body}
                </div>
              );
            })}
          </div>
          {r.properties[0]?.source ? (
            <SourceChip label={r.properties[0].url ? `${r.properties[0].source} ${r.properties[0].url}` : r.properties[0].source} />
          ) : null}
        </section>
      ) : null}

      {/* ---------- Reported performance ---------- */}
      {arc.length ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Reported performance</h2>
            <span className="text-xs text-slate-300">{arc.length} quarters · click a value for its filing</span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                  <th scope="col" className="px-4 py-2.5 font-medium">Quarter</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">RevPAR</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">ADR</th>
                  <th scope="col" className="px-3 py-2.5 text-right font-medium">Occupancy</th>
                </tr>
              </thead>
              <tbody>
                {[...arc].reverse().map((q) => (
                  <tr key={q.quarter} className="border-b border-white/[0.06] last:border-b-0">
                    <th scope="row" className="px-4 py-2 text-sm font-medium tabular-nums text-white">
                      {fmtQuarter(q.quarter)}
                    </th>
                    <td className="px-3 py-2 text-right text-sm">
                      <CitedValue c={q.revpar} fmt={money2} />
                    </td>
                    <td className="px-3 py-2 text-right text-sm">
                      <CitedValue c={q.adr} fmt={money2} />
                    </td>
                    <td className="px-3 py-2 text-right text-sm">
                      <CitedValue c={q.occupancy} fmt={fmtPct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[13px] text-slate-300">
            As reported in each quarter&apos;s filing, for the portfolio the REIT reports on that quarter (often a
            comparable set), so quarters are not always like-for-like.
          </p>
        </section>
      ) : null}

      {/* ---------- Capital ---------- */}
      {hasCapital ? (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold text-white">Capital</h2>

          {latestGuidance ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Guidance, {latestGuidance.period}
                </h3>
                <span className="text-xs text-slate-300">as each release stated it</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                      <th scope="col" className="px-4 py-2.5 font-medium">Release</th>
                      {gMetrics.map((m) => (
                        <th key={m.metric} scope="col" className="px-3 py-2.5 text-right font-medium">
                          {m.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guidanceRows.map((g) => (
                      <tr key={g.date} className="border-b border-white/[0.06] last:border-b-0">
                        <th scope="row" className="px-4 py-2 font-medium text-white">
                          <a href={g.url} target="_blank" rel="noopener noreferrer" title={`Source: ${g.source}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-white">
                            {fmtDay(g.date)}
                          </a>
                        </th>
                        {gMetrics.map((m) => {
                          const i = g.items.find((x) => x.metric === m.metric);
                          return (
                            <td key={m.metric} className="px-3 py-2 text-right tabular-nums text-slate-100">
                              {i ? fmtRange(i) : <span className="text-slate-300">—</span>}
                              {i?.change ? <span className="block text-xs text-slate-300">{i.change}</span> : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[13px] text-slate-300">
                Raised, lowered or maintained compares the midpoint with the previous release for the same year.
              </p>
            </div>
          ) : null}

          {r.debt && r.debt.items.length ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Debt maturities</h3>
              <div className="flex flex-wrap gap-2">
                {r.debt.items.map((d) => (
                  <a
                    key={d.label}
                    href={r.debt!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:border-emerald-500/40"
                  >
                    <span className="block text-xs text-slate-300">{d.label}</span>
                    <span className="tabular-nums text-white">{d.value != null ? `$${Math.round(d.value).toLocaleString("en-US")}M` : "—"}</span>
                  </a>
                ))}
              </div>
              <SourceChip label={chipLabel(r.debt)} />
            </div>
          ) : null}

          {r.buybacks.length ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Share repurchases</h3>
              <div className="flex flex-wrap gap-2">
                {r.buybacks.map((b) => (
                  <a
                    key={b.label}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Source: ${b.source}`}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:border-emerald-500/40"
                  >
                    <span className="block text-xs text-slate-300">{b.label}</span>
                    <span className="tabular-nums text-white">${b.value < 10 ? b.value.toFixed(1) : Math.round(b.value).toLocaleString("en-US")}M</span>
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {r.dividends.length ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Dividends declared per share</h3>
              <div className="flex flex-wrap gap-2">
                {[...r.dividends].reverse().slice(0, 8).map((d) => (
                  <span key={d.quarter} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm">
                    <span className="block text-xs text-slate-300">{fmtQuarter(d.quarter)}</span>
                    <CitedValue c={d} fmt={(v) => fmtMoney(v, v < 0.1 ? 3 : 2)} />
                    {d.special ? <span className="ml-1.5 text-xs text-slate-300">incl. special</span> : null}
                  </span>
                ))}
              </div>
              {r.dividends.slice(-8).some((d) => d.special) ? (
                <p className="text-[13px] text-slate-300">
                  &ldquo;incl. special&rdquo;: the earnings release for that quarter mentions a special or supplemental dividend.
                </p>
              ) : null}
            </div>
          ) : r.dividendNote ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Dividends</h3>
              <p className="text-sm text-slate-300">
                {r.dividendNote.text}{" "}
                <a href={r.dividendNote.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                  {r.dividendNote.source} ↗
                </a>
              </p>
            </div>
          ) : null}

          {r.transactions.length || r.txIncomplete ? (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Recorded transactions</h3>
              <p className="text-[13px] text-slate-300">
                {r.transactions.length ? "" : "No transactions recorded yet. "}
                {r.txIncomplete
                  ? "This list is known to be incomplete for this REIT: deals disclosed only in other 8-K filings are not yet included."
                  : "From transaction tables in 10-Q, 10-K and earnings-release filings; this list may be incomplete."}{" "}
                <Link href="/reits/methodology#universe" className="underline decoration-white/30 underline-offset-4 hover:text-white">
                  How this is built
                </Link>
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {r.transactions.slice(0, txShown).map((t, i) => (
                  <TxCard key={i} t={t} />
                ))}
              </div>
              {r.transactions.length > txShown ? (
                <details>
                  <summary className="cursor-pointer text-xs text-slate-300 hover:text-slate-200">
                    +{r.transactions.length - txShown} earlier transactions
                  </summary>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {r.transactions.slice(txShown).map((t, i) => (
                      <TxCard key={i} t={t} />
                    ))}
                  </div>
                </details>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ---------- Earnings calls ---------- */}
      <section id="earnings" className="scroll-mt-24 space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Earnings calls</h2>
          {r.releases.length ? <span className="text-xs text-slate-300">{r.releases.length} quarterly releases on file</span> : null}
        </div>
        {r.nextCall ? (
          <SignalCard
            primaryUrl={r.nextCall.url}
            title={
              r.nextCall.kind === "call"
                ? `Next call: ${fmtDate(r.nextCall.date, { year: true })}${r.nextCall.time ? `, ${r.nextCall.time}` : ""}${r.nextCall.estimated ? " (est.)" : ""}`
                : `Next results release: ${fmtDate(r.nextCall.date, { year: true })} · no call announced`
            }
            meta={<span className="rounded bg-white/5 px-1.5 py-0.5 text-xs uppercase tracking-wider text-slate-300">upcoming</span>}
          >
            {r.nextCall.kind === "call" && r.nextCall.releaseDate ? (
              <p className="mt-1 text-sm text-slate-300">
                Results {fmtDate(r.nextCall.releaseDate)}
                {r.nextCall.releaseTiming ? `, ${r.nextCall.releaseTiming}` : ""}.
              </p>
            ) : null}
            {r.nextCall.source ? (
              <div className="mt-2">
                <SourceChip label={r.nextCall.url ? `${r.nextCall.source} ${r.nextCall.url}` : r.nextCall.source} />
              </div>
            ) : null}
          </SignalCard>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-slate-300">
            Next results date not announced by the company.
          </div>
        )}
        {r.releases.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[...r.releases].reverse().slice(0, 8).map((e) => {
              const g = guidanceOn(e.filingDate);
              return (
                <SignalCard
                  key={e.quarter}
                  primaryUrl={e.eventUrl ?? e.url}
                  title={`${fmtQuarter(e.quarter)} results${e.callDate ? ` · call ${fmtDate(e.callDate, { year: true, dow: false })}` : ""}`}
                  meta={<span className="text-xs text-slate-300">release filed {fmtDay(e.filingDate)}</span>}
                >
                  {g ? (
                    <p className="mt-1 text-sm text-slate-300">
                      {g.period} guidance:{" "}
                      {g.items
                        .map((i) => `${i.label} ${fmtRange(i)}${i.change ? ` (${i.change})` : ""}`)
                        .join(" · ")}
                    </p>
                  ) : null}
                  <div className="mt-2">
                    <SourceChip label={chipLabel(e)} />
                  </div>
                </SignalCard>
              );
            })}
          </div>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href={askHref} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/5">
          Ask about this REIT
        </Link>
        <Link
          href="/reits/methodology"
          className="text-sm text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
        >
          How these numbers are built
        </Link>
      </div>

      <Independence />
    </div>
  );
}
