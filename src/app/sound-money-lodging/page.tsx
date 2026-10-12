import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isSeedMarket, isPlaceholderText } from "@/lib/format";
import { StackStudio } from "./StackStudio";
import { SourceChip } from "@/components/SourceChip";
import { MarkdownLite } from "@/components/MarkdownLite";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sound Asset Lodging · Bungah Capital Intel",
  description:
    "Bitcoin treasury, capital stack, and operations for hotel investors — decision support, educational, hotel-native.",
};

const pillars = [
  {
    n: "01",
    title: "Treasury",
    body: "After franchise and management fees, free cash flow is the allocation base. Short USD for ops; intermediate liquid reserves; long strategic spot BTC for purchasing power — sized to seasonality and group-book risk, not smooth leases.",
    bullets: [
      "RevPAR-shock survival months before Tranche 3 sizing",
      "Seasonal + group-aware DCA (not NNN-style smooth DCA)",
      "Policy and conviction bands before emotion",
    ],
  },
  {
    n: "02",
    title: "Capital stack",
    body: "Debt-wall and maturity clocks dominate hotel risk. Strategic reserves and creative collateral are framed as education — runway through refi gaps, not leverage-first speculation.",
    bullets: [
      "Bitcoin per key as signature KPI",
      "Months of debt service covered by strategic BTC (decision-support KPI)",
      "Dual-collateral / refi→sats as category education only",
    ],
  },
  {
    n: "03",
    title: "Operations",
    body: "PIP and FF&E cycles, labor intensity, and owner–brand–manager politics are hotel deltas vs generic CRE. Payments and loyalty rails come after CapEx realism — mining only where mechanical and brand policy allow.",
    bullets: [
      "PIP countdown + sats-funded CapEx runway",
      "Labor stress scenarios (housekeeping, F&B, desk)",
      "Role-based talking points: Owner · Brand · GM",
    ],
  },
] as const;

const notToDo = [
  "Never starve PIP or debt service to accumulate BTC.",
  "Do not ignore flag / brand policy on payments UX or mechanical experiments.",
  "Do not lead with mine-to-heat before treasury discipline and CapEx realism.",
  "Do not treat MSA averages as scarce submarket truth — ask which product class.",
] as const;

export default async function SoundMoneyLodgingPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>;
}) {
  const sp = await searchParams;
  const markets = await prisma.market.findMany({ orderBy: { name: "asc" } });
  // Hide stored memos built from seed / illustrative snapshots (rows kept in the DB, never rendered).
  const memos = (
    await prisma.artifact.findMany({
      where: { kind: { in: ["stack", "ic-one-pager"] } },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: { market: true },
    })
  )
    .filter(
      (a) =>
        !isPlaceholderText(a.title, a.markdown, a.sourceLabel) &&
        !(a.market && isSeedMarket(a.market) && /As of seed/.test(a.markdown))
    )
    .slice(0, 10);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="space-y-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Doctrine · work product
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Sound Asset Lodging
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
          Bitcoin treasury, capital stack, and operations for hotel investors —
          hotel-native, decision support, and educational. Balance-sheet appreciation as a fifth
          return driver beside NOI, CapEx quality, leverage, and cap rates.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
          Not financial, tax, legal, lending, or real-estate advice. We cite and propose — you
          decide. Inspired by CRE × Bitcoin education associated with Chris Drzyzga /{" "}
          <a
            href="https://www.tftc.io/cre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            TFTC CRE guide
          </a>
          . <span className="text-slate-400">No affiliation claimed.</span>
        </p>
        <div className="flex flex-wrap gap-2.5 pt-1">
          <a
            href="#studio"
            className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
          >
            Generate Stack memo
          </a>
          <Link
            href="/markets"
            className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-white/20 hover:text-white"
          >
            Browse markets
          </Link>
        </div>
      </section>

      {/* Why hotel playbook */}
      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Why the hotel playbook is breaking
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Nightly yield, PIP clocks, fee stacks, labor, group books, debt walls, and brand politics
          underspecify when you only borrow office/industrial framing. Sound Asset Lodging reweights
          treasury · capital · operations around{" "}
          <span className="text-slate-300">STR · Occupancy · ADR · RevPAR</span>,{" "}
          <span className="text-slate-300">Bitcoin per key</span>, and runway through maturity gaps —
          leverage-first → balance-sheet-first.
        </p>
      </section>

      {/* Fifth return driver */}
      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-5">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Fifth return driver
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">
          Classic hotel returns: grow NOI · improve the asset · manage leverage · favorable cap rates.
          <span className="text-slate-200"> Fifth — balance-sheet appreciation:</span> a strategic
          Bitcoin reserve that can compound <em>independently of RevPAR</em>, local property values,
          and refinancing conditions. Track{" "}
          <span className="text-slate-300">Bitcoin per key</span> and{" "}
          <span className="text-slate-300">months of debt service / PIP runway covered by strategic BTC</span>{" "}
          as decision-support KPIs — never starve PIP or debt service to fund the reserve.
        </p>
      </section>

      {/* Three pillars */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Three pillars
        </h2>
        <div className="grid gap-3 lg:grid-cols-3">
          {pillars.map((p) => (
            <article
              key={p.n}
              className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] tabular-nums text-slate-500">{p.n}</span>
                <h3 className="text-base font-medium text-white">{p.title}</h3>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.body}</p>
              <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-slate-500">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Signature metrics */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Signature metrics
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Bitcoin per key",
            "Months of debt service covered by strategic BTC",
            "PIP runway funded (USD + sats equivalent)",
            "RevPAR-shock survival months",
            "% FCF → intermediate vs strategic after fees",
            "Loyalty / payment signal status",
          ].map((m) => (
            <div
              key={m}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-slate-300"
            >
              {m}
            </div>
          ))}
        </div>
      </section>

      {/* Hotel structuring — Esner / RES Ep.11 */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Hotel structuring signals
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
          From hospitality-sector dialogue with operators (e.g. Justin Esner on The Real Estate
          Standard Ep.11 — educational, not advice): flags often lag 18–24 months; land vs
          operating/building sleeves can create distinct collateral and optionality; Bitcoin on
          the owner balance sheet is framed as the emerging normal for competitive owners. Major
          brand loyalty and payment rails usually gate guest BTC UX — stronger path for
          independent / soft-brand / owner-led assets.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Separate land vs ops / building for capital-stack optionality",
            "Allocate surplus to spot BTC / digital credit only after fees + PIP + debt service",
            "Brand-policy gate before guest payments or loyalty experiments",
            "First-mover framing around stress / special-servicing windows — thesis, not forecast",
          ].map((t) => (
            <div
              key={t}
              className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-slate-400"
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* What not to do */}
      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          What not to do
        </h2>
        <ul className="space-y-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          {notToDo.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-400">
              <span className="shrink-0 text-slate-600">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Studio */}
      <section id="studio" className="scroll-mt-24 space-y-4">
        <div>
          <h2 className="text-sm font-medium text-slate-300">Stack memo studio</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            Deterministic markdown from the Capital Graph — market numbers, pillar checklist, and
            decision-support next steps. No paid LLM. Citations embedded.
          </p>
        </div>
        <StackStudio
          markets={markets.map((m) => ({ slug: m.slug, name: m.name }))}
          initialSlug={sp.market ?? markets[0]?.slug ?? ""}
        />
      </section>

      {/* Recent memos */}
      <section className="space-y-4">
        <h2 className="text-sm font-medium text-slate-300">Recent Stack memos</h2>
        {memos.map((a) => {
          // Existing persisted memos may use the former product name; keep the public surface consistent.
          const displayTitle = a.title.replaceAll("Sound Money Lodging", "Sound Asset Lodging");
          const displayMarkdown = a.markdown
            .replaceAll("Sound Money Lodging", "Sound Asset Lodging")
            // Older memos used seed-era template wording over cited figures; relabel for display.
            .replace(/\*\*As of seed:\*\*[^\n]*\n/g, "")
            .replaceAll("Seed snapshot for this market", "Market snapshot")
            .replaceAll("Competitive set (seed assets)", "Competitive set");

          return (
          <article
            key={a.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-white">{displayTitle}</h3>
              <span className="text-xs text-slate-500">
                {a.kind}
                {a.market ? ` · ${a.market.slug}` : ""} ·{" "}
                {a.createdAt.toLocaleString("en-US", { timeZone: "America/New_York" })} ET
              </span>
            </div>
            <div className="mt-2">
              <SourceChip label={a.sourceLabel} />
            </div>
            <div className="mt-4 max-h-80 overflow-y-auto rounded-lg border border-white/5 bg-black/20 p-4">
              <MarkdownLite text={displayMarkdown} />
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
                Raw markdown
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-[11px] text-slate-400">
                {displayMarkdown}
              </pre>
            </details>
          </article>
          );
        })}
        {!memos.length ? (
          <p className="text-sm text-slate-500">No Stack memos yet — generate one above.</p>
        ) : null}
      </section>

      {/* Lineage footnote */}
      <p className="text-xs leading-relaxed text-slate-600">
        Educational synthesis only. Lineage: Chris Drzyzga / TFTC CRE (
        <a
          href="https://www.tftc.io/cre"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
        >
          tftc.io/cre
        </a>
        ); hotel dialogue via The Real Estate Standard Ep.11 (Justin Esner). Bungah is not
        affiliated with TFTC, Mr. Drzyzga, or the show. Decision support · citations required.
      </p>
    </div>
  );
}
