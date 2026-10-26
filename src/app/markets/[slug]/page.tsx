import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cachedQuery } from "@/lib/db-safe";
import DataUnavailableNotice from "@/components/DataUnavailableNotice";
import { StatCard } from "@/components/StatCard";
import { SourceChip } from "@/components/SourceChip";
import { SourceLinks } from "@/components/SourceLinks";
import { parseSourceUrls, URL_RE, isOriginalUrl } from "@/lib/source-links";
import { SignalCard } from "@/components/SignalCard";
import { splitTaxSeries } from "@/lib/tax-series";
import { SourceNote } from "@/components/SourceNote";
import { scrubInternal, briefLine } from "@/lib/public-text";
import {
  fmtPct,
  fmtUsd,
  fmtVisitorsM,
  fmtRoomsK,
  fmtRevpar,
  severityClass,
  isSeedMarket,
  citedOnly,
  citedFindings,
  coverageInProgressLine,
  hasPublicCoverage,
  isIndexableMarket,
  isNoReadSignal,
} from "@/lib/format";
import type { Metadata } from "next";
import { MarketRatesBlock } from "@/components/tuesday-trends/MarketRatesBlock";
import { ttMarketBySiteSlug } from "@/lib/tuesday-trends";
import { WhoOwnsHere } from "@/components/reits/WhoOwnsHere";
import { marketOwners } from "@/lib/reits-market";

export const dynamic = "force-dynamic";

function shortMarketLabel(name: string, slug: string): string {
  if (slug === "orlando") return "Orlando";
  if (slug === "las-vegas") return "Vegas";
  const first = name.split(/[–—,/]/)[0]?.trim();
  return first || name;
}

/** Markets without public coverage stay reachable by link but are not indexed. */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: m } = await cachedQuery(["market-meta", slug], () =>
    prisma.market.findUnique({
      where: { slug },
      include: { signals: { select: { sourceLabel: true, title: true, body: true, magnitude: true, asOf: true } } },
    }), null);
  if (!m) return { title: "Hotel market · Bungah Capital Intel", alternates: { canonical: `/markets/${slug}` } };
  const covered = isIndexableMarket(m);
  const extras = [
    ttMarketBySiteSlug(slug) ? "weekly indicative Google Hotels rates" : null,
    marketOwners(slug)?.hotels.length ? "hotels owned by listed REITs" : null,
  ].filter(Boolean);
  return {
    title: `${m.name} hotel market · Bungah Capital Intel`,
    description: covered
      ? `${m.name}: cited hotel market signals on demand, supply, debt and labor, each linked to its source` +
        (extras.length ? `, plus ${extras.join(" and ")}.` : ".") +
        " Decision support."
      : `${m.name}: hotel market page. Sources for this market are still being checked.`,
    alternates: { canonical: `/markets/${slug}` },
    robots: covered ? undefined : { index: false, follow: true },
  };
}

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const marketQ = await cachedQuery(["market-detail", slug], () =>
    prisma.market.findUnique({
      where: { slug },
      include: {
        assets: { orderBy: { name: "asc" } },
        signals: { orderBy: { createdAt: "desc" } },
        findings: {
          include: { radar: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        },
      },
    }), null);
  const market = marketQ.data;

  // DB outage with no cached copy: friendly page (200), never a 404 or 500.
  if (!market && !marketQ.ok) {
    return (
      <div className="space-y-4">
        <Link href="/markets" className="text-sm text-slate-300 hover:text-white">← All markets</Link>
        <h1 className="t-h1">Market data is temporarily unavailable</h1>
        <DataUnavailableNotice what="This market's data" />
      </div>
    );
  }
  if (!market) notFound();
  // Seed / illustrative rows stay in the DB but are never rendered.
  // "tag: none / national applies" placeholder rows are not shown either.
  market.signals = citedOnly(market.signals).filter((s) => !isNoReadSignal(s));
  market.assets = citedOnly(market.assets);
  market.findings = citedFindings(market.findings);
  // Hotel-tax collection series render as their own newest-first section (Orlando-style cards).
  const { other: nonTax, tax: taxSeries } = splitTaxSeries(market.signals);
  market.signals = nonTax;
  const TAX_SHOWN = 6;

  const isOrlando = market.slug === "orlando";
  const thin = isSeedMarket(market);
  const short = shortMarketLabel(market.name, market.slug);
  const hasRevpar = market.occupancy != null && market.adr != null;
  const ttRates = ttMarketBySiteSlug(market.slug);
  const owners = marketOwners(market.slug);

  const renderSignal = (s: (typeof market.signals)[number], i: number, prefix = "sig") => {
    const links = parseSourceUrls(s.sourceUrls);
    const labelUrl = s.sourceLabel.match(URL_RE)?.[0];
    const primary = links[0]?.url ?? (labelUrl && isOriginalUrl(labelUrl) ? labelUrl : null);
    const title = scrubInternal(s.title);
    const npr = !links.length && /no public read/i.test(s.body) && !labelUrl;
    return (
      <SignalCard
        key={`${prefix}-${i}`}
        primaryUrl={primary}
        title={title}
        meta={
          <>
            <span className="rounded bg-white/5 px-1.5 py-0.5 text-xs uppercase tracking-wider text-slate-300">
              {s.kind}
            </span>
            {s.magnitude ? (
              <span className="text-xs font-semibold tabular-nums text-emerald-300">
                {scrubInternal(s.magnitude)}
              </span>
            ) : null}
            {s.asOf ? <span className="text-xs text-slate-300">as of {s.asOf}</span> : null}
          </>
        }
      >
        <p className="mt-1 line-clamp-2 text-sm text-slate-300">{briefLine(title, s.body)}</p>
        <div className="mt-2">
          {links.length ? (
            <SourceLinks links={links} limit={3} />
          ) : primary ? (
            <SourceChip label={s.sourceLabel} />
          ) : (
            <SourceNote label={s.sourceLabel} noPublicRead={npr} />
          )}
        </div>
      </SignalCard>
    );
  };

  return (
    <div className="space-y-10">
      <div>
        <Link href="/markets" className="text-xs text-slate-300 hover:text-emerald-300">
          ← Markets
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="t-h1">{market.name}</h1>
          {thin ? null : (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Cited snapshot
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-300">
          <span className="text-slate-300">{market.region}</span>
          <span className="mx-2 text-slate-300">·</span>
          Destination dashboard
        </p>
        {thin ? (
          <p className="mt-4 max-w-3xl text-slate-300">{coverageInProgressLine(market.name)}</p>
        ) : (
          <>
            <p className="mt-4 max-w-3xl text-slate-300">{scrubInternal(market.summary)}</p>
            <div className="mt-3">
              <SourceChip label={market.sourceLabel} />
            </div>
          </>
        )}
      </div>

      {thin ? null : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Visitors" value={fmtVisitorsM(market.visitorsM)} sourceLabel={market.sourceLabel} />
        <StatCard label="Rooms" value={fmtRoomsK(market.roomsK)} sourceLabel={market.sourceLabel} />
        <StatCard label="Occupancy" value={fmtPct(market.occupancy)} sourceLabel={market.sourceLabel} />
        <StatCard label="ADR" value={fmtUsd(market.adr, 2)} sourceLabel={market.sourceLabel} />
        <StatCard
          label="RevPAR (derived)"
          value={fmtRevpar(market.occupancy, market.adr)}
          hint={hasRevpar ? "OCC × ADR — not a stored feed" : "Needs OCC + ADR"}
          sourceLabel={market.sourceLabel}
        />
        {market.midweekOcc != null ? (
          <StatCard label="Midweek OCC" value={fmtPct(market.midweekOcc)} sourceLabel={market.sourceLabel} />
        ) : null}
        {market.weekendOcc != null ? (
          <StatCard label="Weekend OCC" value={fmtPct(market.weekendOcc)} sourceLabel={market.sourceLabel} />
        ) : null}
      </div>
      )}

      {ttRates ? <MarketRatesBlock market={ttRates} /> : null}

      {thin ? null : market.nuanceNote ? (
        isOrlando ? (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
              Orlando&apos;s hotel areas differ: record visitors don&apos;t mean rooms are scarce
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-50">{scrubInternal(market.nuanceNote)}</p>
            <div className="mt-3">
              <SourceChip label={market.sourceLabel} />
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-200">
              Which part of {short}: visitors vs. scarce rooms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{scrubInternal(market.nuanceNote)}</p>
            <div className="mt-3">
              <SourceChip label={market.sourceLabel} />
            </div>
          </section>
        )
      ) : (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Underwriting nuance
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            No submarket nuance note yet for {short}. Underwrite by corridor and product class — not MSA
            averages alone. Talent / staffing remains a CapEx greenlight gate.
          </p>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Signals</h2>
          <span className="text-xs text-slate-300">
            {market.signals.length ? `${market.signals.length} cited` : "none yet"}
          </span>
        </div>
        {market.signals.length ? (
          <div className="grid gap-3">
            {market.signals.map((s, i) => renderSignal(s, i))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-300">
            No cited market signals yet.
          </div>
        )}
      </section>

      {taxSeries.length ? (
        <section className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Hotel-tax collections</h2>
            <span className="text-xs text-slate-300">newest first · {taxSeries.length} periods</span>
          </div>
          <div className="grid gap-3">{taxSeries.slice(0, TAX_SHOWN).map((s, i) => renderSignal(s, i, "tax"))}</div>
          {taxSeries.length > TAX_SHOWN ? (
            <details>
              <summary className="cursor-pointer text-xs text-slate-300 hover:text-slate-200">
                +{taxSeries.length - TAX_SHOWN} earlier periods
              </summary>
              <div className="mt-3 grid gap-3">
                {taxSeries.slice(TAX_SHOWN).map((s, i) => renderSignal(s, i, "taxm"))}
              </div>
            </details>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Assets</h2>
          <span className="text-xs text-slate-300">
            {market.assets.length ? `${market.assets.length} cited` : "none yet"}
          </span>
        </div>
        {market.assets.length ? (
          <div className="grid gap-3">
            {market.assets.map((a) => (
              <div key={a.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-white">{a.name}</h3>
                  <span className="text-xs text-slate-300">
                    {a.keys ? `${a.keys.toLocaleString()} keys` : "keys n/a"} · {a.assetClass}
                  </span>
                </div>
                {a.submarket ? <p className="mt-1 text-xs text-emerald-300/80">{a.submarket}</p> : null}
                {a.notes ? <p className="mt-2 text-sm text-slate-300">{a.notes}</p> : null}
                <div className="mt-2">
                  <SourceChip label={a.sourceLabel} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-300">
            No cited assets yet for this destination. Underwrite by submarket and product class —
            MSA averages are not a substitute for a competitive set.
          </div>
        )}
      </section>

      {owners ? <WhoOwnsHere data={owners} short={short} marketName={market.name} /> : null}

      {market.findings.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Linked findings</h2>
          <div className="space-y-2">
            {market.findings.map((f) => {
              const u = f.sourceLabel.match(URL_RE)?.[0];
              return (
                <SignalCard
                  key={f.id}
                  primaryUrl={u && isOriginalUrl(u) ? u : null}
                  tone={severityClass(f.severity)}
                  title={scrubInternal(f.title)}
                  meta={
                    <span className="text-xs uppercase tracking-wider">
                      {f.severity} · {f.radar.name}
                    </span>
                  }
                >
                  <p className="mt-1 line-clamp-2 text-sm">{briefLine(f.title, f.summary, 180)}</p>
                  <div className="mt-2">
                    {u && isOriginalUrl(u) ? <SourceChip label={f.sourceLabel} /> : <SourceNote label={f.sourceLabel} />}
                  </div>
                </SignalCard>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Linked findings</h2>
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-300">
            No radar findings for this market yet.
          </div>
        </section>
      )}

      {(() => {
        const askHref = `/chat?market=${market.slug}&q=${encodeURIComponent(
          `Capital thesis for ${market.name}: RevPAR, occupancy, supply, labor?`
        )}`;
        const covered = hasPublicCoverage(market, market.signals.length);
        // With no checked data a Stack memo would be empty, so the memo link is a quiet text link.
        return covered ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/sound-money-lodging?market=${market.slug}#studio`}
              className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white"
            >
              Generate Stack memo
            </Link>
            <Link href={askHref} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/5">
              Ask about this market
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href={askHref} className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/5">
              Ask about this market
            </Link>
            <Link
              href="/sound-money-lodging#studio"
              className="text-sm text-slate-300 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Stack memos for markets with checked data
            </Link>
          </div>
        );
      })()}
    </div>
  );
}
