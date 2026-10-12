import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { SourceChip } from "@/components/SourceChip";
import { SourceLinks } from "@/components/SourceLinks";
import { parseSourceUrls, URL_RE, isOriginalUrl } from "@/lib/source-links";
import { SignalCard } from "@/components/SignalCard";
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
  coverageInProgressLine,
} from "@/lib/format";

export const dynamic = "force-dynamic";

function shortMarketLabel(name: string, slug: string): string {
  if (slug === "orlando") return "Orlando";
  if (slug === "las-vegas") return "Vegas";
  const first = name.split(/[–—,/]/)[0]?.trim();
  return first || name;
}

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const market = await prisma.market.findUnique({
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
  });

  if (!market) notFound();
  // Seed / illustrative rows stay in the DB but are never rendered.
  market.signals = citedOnly(market.signals);
  market.assets = citedOnly(market.assets);
  market.findings = market.findings.filter((f) => !/illustrative/i.test(`${f.title} ${f.summary} ${f.sourceLabel}`));

  const isOrlando = market.slug === "orlando";
  const thin = isSeedMarket(market);
  const short = shortMarketLabel(market.name, market.slug);
  const hasRevpar = market.occupancy != null && market.adr != null;

  return (
    <div className="space-y-10">
      <div>
        <Link href="/markets" className="text-xs text-slate-500 hover:text-emerald-300">
          ← Markets
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white">{market.name}</h1>
          {thin ? null : (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-200">
              Cited snapshot
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-400">
          <span className="text-slate-300">{market.region}</span>
          <span className="mx-2 text-slate-600">·</span>
          Destination dashboard
        </p>
        {thin ? (
          <p className="mt-4 max-w-3xl text-slate-300">{coverageInProgressLine(market.name)}</p>
        ) : (
          <>
            <p className="mt-4 max-w-3xl text-slate-300">{market.summary}</p>
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

      {thin ? null : market.nuanceNote ? (
        isOrlando ? (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-200">
              Which Orlando — impact ≠ scarcity
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-amber-50/90">{market.nuanceNote}</p>
            <div className="mt-3">
              <SourceChip label={market.sourceLabel} />
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-200">
              Which {short} — scarcity vs impact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-200">{market.nuanceNote}</p>
            <div className="mt-3">
              <SourceChip label={market.sourceLabel} />
            </div>
          </section>
        )
      ) : (
        <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Underwriting nuance
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            No submarket nuance note yet for {short}. Underwrite by corridor and product class — not MSA
            averages alone. Talent / staffing remains a CapEx greenlight gate.
          </p>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Signals</h2>
          <span className="text-xs text-slate-500">
            {market.signals.length ? `${market.signals.length} cited` : "none yet"}
          </span>
        </div>
        {market.signals.length ? (
          <div className="grid gap-3">
            {market.signals.map((s, i) => {
              const links = parseSourceUrls(s.sourceUrls);
              const labelUrl = s.sourceLabel.match(URL_RE)?.[0];
              const primary = links[0]?.url ?? (labelUrl && isOriginalUrl(labelUrl) ? labelUrl : null);
              const title = scrubInternal(s.title);
              const npr = !links.length && /no public read/i.test(s.body) && !labelUrl;
              return (
                <SignalCard
                  key={`sig-${i}`}
                  primaryUrl={primary}
                  title={title}
                  meta={
                    <>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-slate-400">
                        {s.kind}
                      </span>
                      {s.magnitude ? (
                        <span className="text-xs font-semibold tabular-nums text-emerald-300">
                          {scrubInternal(s.magnitude)}
                        </span>
                      ) : null}
                      {s.asOf ? <span className="text-[11px] text-slate-500">as of {s.asOf}</span> : null}
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
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-400">
            No cited market signals yet. {coverageInProgressLine(market.name)}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">Assets</h2>
          <span className="text-xs text-slate-500">
            {market.assets.length ? `${market.assets.length} cited` : "none yet"}
          </span>
        </div>
        {market.assets.length ? (
          <div className="grid gap-3">
            {market.assets.map((a) => (
              <div key={a.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium text-white">{a.name}</h3>
                  <span className="text-xs text-slate-400">
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
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-400">
            No cited assets yet for this destination. Underwrite by submarket and product class —
            MSA averages are not a substitute for a competitive set.
          </div>
        )}
      </section>

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
                    <span className="text-[11px] uppercase tracking-wider opacity-80">
                      {f.severity} · {f.radar.name}
                    </span>
                  }
                >
                  <p className="mt-1 line-clamp-2 text-sm opacity-90">{briefLine(f.title, f.summary, 180)}</p>
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
          <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.02] p-5 text-sm text-slate-400">
            No radar findings linked to this market yet. National debt-wall and talent radars may still apply —
            see{" "}
            <Link href="/radars" className="text-emerald-300 hover:underline">
              Radars
            </Link>
            .
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/sound-money-lodging?market=${market.slug}`}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
        >
          Generate Stack memo
        </Link>
        <Link
          href={`/chat?market=${market.slug}&q=${encodeURIComponent(
            `Capital thesis for ${market.name}: RevPAR, occupancy, supply, talent gates?`
          )}`}
          className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white hover:bg-white/5"
        >
          Ask about this market
        </Link>
      </div>
    </div>
  );
}
