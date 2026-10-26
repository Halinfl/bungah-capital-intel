import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { citedFindings, citedOnly, derivedRevpar, fmtPct, fmtUsd, hasPublicCoverage, isSeedMarket } from "@/lib/format";
import { parseSourceUrls } from "@/lib/source-links";
import { publisherName, scrubInternal } from "@/lib/public-text";
import { REITS_UNIVERSE, reits } from "@/lib/reits";
import { SUPERSEDED_RADAR_SLUGS } from "@/lib/radars-preview";
import { TT_CAPTURE_DATE, ttMarkets } from "@/lib/tuesday-trends";
import { SCORECARD } from "@/lib/sound-assets";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hotel capital intelligence · Bungah Capital Intel",
  description:
    "Hotel market numbers, debt and supply signals for owners, investors, asset managers and developers, every figure linked to its source. Decision support; you make the call.",
  alternates: { canonical: "/" },
};

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bungah Capital Intel",
  url: "https://bungah.io",
  description: "Cited hotel capital intelligence for owners, investors, asset managers and developers.",
};

/** "Chicago–Naperville–Elgin MSA" → "Chicago"; adds "CBD" when the cited source is CBD-scoped. */
function shortName(name: string, sourceLabel: string): string {
  const base = name.split(/[–(]/)[0].replace(/\bMSA\b/, "").trim();
  return /\bCBD\b/.test(sourceLabel) ? `${base} CBD` : base;
}

function period(sourceLabel: string): string {
  return sourceLabel.match(/\b(?:YE )?20\d\d\b/)?.[0] ?? "";
}

/** Dates on the Latest strip, in ET (same format as the Radars cards). */
function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" });
}

const fmtInt = (n: number) => n.toLocaleString("en-US");

const primaryBtn =
  "inline-flex items-center justify-center rounded-lg bg-slate-100 px-5 py-3 text-base font-medium text-slate-900 hover:bg-white";

export default async function HomePage() {
  const markets = await prisma.market.findMany({
    orderBy: { name: "asc" },
    include: {
      signals: {
        select: { kind: true, sourceLabel: true, title: true, body: true, magnitude: true, asOf: true, sourceUrls: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  const coveredCount = markets.filter((m) => hasPublicCoverage(m, citedOnly(m.signals).length)).length;

  // Hero card: only markets whose snapshot is cited (no seed numbers). Source links come from the
  // market's own cited occupancy / visitation rows, which carry the same publisher documents.
  const snapshot = markets
    .filter((m) => !isSeedMarket(m) && m.occupancy != null && m.adr != null)
    .map((m) => {
      const urls = citedOnly(m.signals)
        .filter((s) => s.kind === "occupancy" || s.kind === "visitation")
        .flatMap((s) => parseSourceUrls(s.sourceUrls).slice(0, 1));
      // One link per publisher, at most two publishers per row.
      const seen = new Set<string>();
      const links = urls
        .map((u) => ({ url: u.url, label: publisherName(u.url) }))
        .filter((l) => (seen.has(l.label) ? false : (seen.add(l.label), true)))
        .slice(0, 2);
      return {
        slug: m.slug,
        name: shortName(m.name, m.sourceLabel),
        period: period(m.sourceLabel),
        occupancy: m.occupancy,
        adr: m.adr,
        revpar: derivedRevpar(m.occupancy, m.adr),
        links,
      };
    })
    .filter((r) => r.links.length > 0);

  // Radars: same public rule as /radars for signed-out visitors (cited findings only, superseded rows out).
  const radars = (
    await prisma.radar.findMany({
      include: { findings: { orderBy: { createdAt: "desc" }, take: 5 } },
    })
  ).filter((r) => !SUPERSEDED_RADAR_SLUGS.includes(r.slug));
  const latestRadar = radars
    .flatMap((r) => citedFindings(r.findings).map((f) => ({ ...f, radarName: r.name })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const liveRadars = radars.filter((r) => citedFindings(r.findings).length > 0).length;

  const reitCount = reits().length;
  const ttMarketCount = ttMarkets().length;

  // "What's inside": the nav, in nav order. Kicker is a live stat or a plain label; no placeholders.
  const inside = [
    {
      href: "/markets",
      title: "Markets",
      kicker: coveredCount > 0 ? `${coveredCount} markets with cited coverage` : "Capital Graph",
      body: "Occupancy, ADR, supply, debt and labor for US hotel markets, each figure with its source.",
    },
    {
      href: "/reits",
      title: "REITs",
      kicker:
        reitCount > 0
          ? REITS_UNIVERSE.hotels
            ? `${reitCount} REITs · ${fmtInt(REITS_UNIVERSE.hotels)} hotels`
            : `${reitCount} REITs`
          : "Hotel REITs",
      body: "US-listed hotel REITs, one page each: reported RevPAR, portfolio by market and earnings calls, linked to SEC filings.",
    },
    {
      href: "/chat",
      title: "Chat",
      kicker: "Deploy · Hold · Flag",
      body: "Start from the decision in front of you and get a short, cited memo back. You make the call.",
    },
    {
      href: "/radars",
      title: "Radars",
      kicker: liveRadars > 0 ? `${liveRadars} with cited findings` : "Market monitors",
      body: "Quiet monitors over the graph that surface material, cited findings only.",
    },
    {
      href: "/hard-assets",
      title: "Sound Assets",
      kicker:
        SCORECARD.assets.length && SCORECARD.criteria.length
          ? `${SCORECARD.assets.length} assets · ${SCORECARD.criteria.length} criteria`
          : "Editorial thesis",
      body: "Our thesis on sound assets: how we define soundness, one scorecard, and the evidence for and against.",
    },
    {
      href: "/podcast",
      title: "Podcast",
      kicker: "Listening shelf",
      body: "Conversations with people who move hospitality capital, clearly marked when external.",
    },
  ];

  // Latest: only sources with a real, dated item. The podcast shelf carries no episode dates yet,
  // so it has no tile until it does. The strip hides when nothing qualifies.
  const latest = [
    TT_CAPTURE_DATE && ttMarketCount > 0
      ? {
          href: "/tuesday-trends",
          source: "Tuesday Trends",
          title: `Weekly hotel rates across ${ttMarketCount} US markets`,
          date: fmtDate(new Date(`${TT_CAPTURE_DATE}T12:00:00-04:00`)),
        }
      : null,
    latestRadar
      ? {
          href: "/radars",
          source: `Radar · ${scrubInternal(latestRadar.radarName)}`,
          title: scrubInternal(latestRadar.title.replace(/^Radar refresh:\s*/i, "")),
          date: fmtDate(latestRadar.createdAt),
        }
      : null,
  ].filter((x): x is NonNullable<typeof x> => x !== null);

  return (
    <div className="space-y-16 sm:space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      {/* 1 · Hero (one primary action) + 2 · cited snapshot with the trust line under it */}
      <section className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-5 pt-2">
          <h1 className="t-display max-w-xl">
            See where hotel capital is moving, and what to do about it.
          </h1>
          <p className="t-lead max-w-lg">
            For hotel owners, investors, asset managers and developers. Market numbers, debt and
            supply signals in one place, every figure linked to its source.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <Link href="/chat" className={primaryBtn}>
              Ask a capital question
            </Link>
            <Link
              href="/markets"
              className="text-base text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white"
            >
              Browse markets
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {snapshot.length ? (
            <figure className="rounded-2xl border border-white/[0.12] bg-[#383d47] p-5 sm:p-6">
              <figcaption className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-white">Capital Graph · cited snapshot</span>
                <span className="text-sm text-slate-300">Latest published</span>
              </figcaption>
              <table className="mt-4 w-full text-left text-sm tabular-nums">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300">
                    <th scope="col" className="pb-2 font-normal">Market</th>
                    <th scope="col" className="pb-2 pl-3 text-right font-normal">OCC</th>
                    <th scope="col" className="pb-2 pl-3 text-right font-normal">ADR</th>
                    <th scope="col" className="pb-2 pl-3 text-right font-normal">RevPAR</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.map((r) => (
                    <tr key={r.slug} className="border-b border-white/[0.07] align-top last:border-0">
                      <td className="py-3 pr-2">
                        <Link href={`/markets/${r.slug}`} className="font-medium text-white hover:underline">
                          {r.name}
                        </Link>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-slate-300">
                          {r.period ? <span>{r.period}</span> : null}
                          {r.links.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-300 underline-offset-2 hover:underline"
                            >
                              {l.label} ↗
                            </a>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pl-3 text-right text-white">{fmtPct(r.occupancy)}</td>
                      <td className="py-3 pl-3 text-right text-white">{fmtUsd(r.adr, 0)}</td>
                      <td className="py-3 pl-3 text-right text-white">{fmtUsd(r.revpar, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                OCC and ADR as published by each source; RevPAR = OCC × ADR.
              </p>
            </figure>
          ) : null}
          <p className="text-sm text-slate-300">
            Private · Cited · Decision support ·{" "}
            <Link href="/trust" className="text-slate-100 underline decoration-white/30 underline-offset-4 hover:decoration-white">
              Read the Trust Contract
            </Link>
          </p>
        </div>
      </section>

      {/* 3 · What's inside: a map of the nav, in nav order */}
      <section aria-labelledby="inside" className="space-y-4">
        <h2 id="inside" className="t-h2">What&apos;s inside</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {inside.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="group flex h-full flex-col rounded-xl border border-white/[0.1] bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.05] focus-visible:outline focus-visible:outline-2 focus-visible:outline-slate-200"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-medium text-white">{t.title}</h3>
                  <span aria-hidden="true" className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-white">
                    →
                  </span>
                </div>
                <span className="mt-0.5 text-[13px] text-slate-300">{t.kicker}</span>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{t.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 4 · Latest: real, dated items only; hidden when empty */}
      {latest.length ? (
        <section aria-labelledby="latest" className="space-y-4">
          <h2 id="latest" className="t-h2">Latest</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {latest.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="flex h-full flex-col rounded-xl border border-white/[0.1] p-4 transition hover:border-white/25 hover:bg-white/[0.04]"
                >
                  <span className="text-[13px] text-slate-300">{l.source}</span>
                  <span className="mt-1 text-[15px] font-medium leading-snug text-white">{l.title}</span>
                  <span className="mt-2 text-[13px] text-slate-300">Updated {l.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 5 · Closing band: the same one primary action */}
      <section className="flex flex-col items-start gap-5 rounded-2xl border border-white/[0.1] bg-[#383d47] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="max-w-xl text-lg font-medium leading-snug text-white">
          Decision support for hotel capital. Every number cited; you make the call.
        </p>
        <Link href="/chat" className={`${primaryBtn} shrink-0`}>
          Ask a capital question
        </Link>
      </section>
    </div>
  );
}
