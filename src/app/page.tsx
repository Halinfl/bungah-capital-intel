import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PricingTiers } from "@/components/PricingTiers";
import { citedFindings, citedOnly, derivedRevpar, fmtPct, fmtUsd, hasPublicCoverage, isSeedMarket } from "@/lib/format";
import { parseSourceUrls } from "@/lib/source-links";
import { publisherName, scrubInternal } from "@/lib/public-text";

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

  const radars = await prisma.radar.findMany({
    include: { findings: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  const latestFinding = radars
    .flatMap((r) => citedFindings(r.findings))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
  const liveRadars = radars.filter((r) => citedFindings(r.findings).length > 0).length;

  const tools = [
    {
      href: "/markets",
      title: "Markets",
      kicker: "Capital Graph",
      body: `${coveredCount} US hotel markets with cited coverage: occupancy, ADR, supply, debt and labor, each with its source.`,
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
      kicker: `${liveRadars} with cited findings`,
      body: latestFinding
        ? `Quiet monitors over the graph. Latest: ${scrubInternal(latestFinding.title.replace(/^Radar refresh:\s*/i, ""))}`
        : "Quiet monitors over the graph. Material, cited findings only.",
    },
    {
      href: "/sound-money-lodging",
      title: "Sound Asset",
      kicker: "Two calculators",
      body: "Bitcoin treasury and capital-stack guide for hotels, with a sleeve carry check and a ground rent coverage calculator.",
    },
  ];

  return (
    <div className="space-y-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      {/* Hero */}
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
            <Link
              href="/chat"
              className="rounded-lg bg-slate-100 px-5 py-3 text-base font-medium text-slate-900 hover:bg-white"
            >
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
      </section>

      {/* One quiet trust line */}
      <p className="text-sm text-slate-300">
        Private · Cited · Decision support ·{" "}
        <Link href="/trust" className="text-slate-100 underline decoration-white/30 underline-offset-4 hover:decoration-white">
          Read the Trust Contract
        </Link>
      </p>

      <PricingTiers />

      {/* Tools — four equal cards */}
      <section className="space-y-4">
        <h2 className="t-h2">What&apos;s inside</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="flex flex-col rounded-xl border border-white/[0.1] bg-white/[0.03] p-5 transition hover:border-white/25 hover:bg-white/[0.05]"
            >
              <span className="text-sm text-slate-300">{t.kicker}</span>
              <h3 className="mt-1 text-lg font-medium text-white">{t.title}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-slate-200">{t.body}</p>
              <span className="mt-4 text-sm text-slate-100">Open {t.title} →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
