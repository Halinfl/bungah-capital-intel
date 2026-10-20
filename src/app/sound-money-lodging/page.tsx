import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { isPlaceholderText } from "@/lib/format";
import { StackStudio } from "./StackStudio";
import { SleeveCarryCheck } from "./SleeveCarryCheck";
import { GroundRentCoverage } from "./GroundRentCoverage";
import { SourceChip } from "@/components/SourceChip";
import { StackMemoView } from "@/components/StackMemoView";
import { STACK_MEMO_KIND } from "@/lib/stack-memo";

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
  "Never size a hotel loan on the BTC.",
  "Never buy BTC with construction draws.",
  "Never balance coverage on staffing.",
  "Do not ignore flag / brand policy on payments UX or mechanical experiments.",
  "Do not lead with mine-to-heat before treasury discipline and CapEx realism.",
  "Do not treat MSA averages as scarce submarket truth — ask which product class.",
] as const;


type SourceCard = { title: string; line: string; href?: string };

const SRC = {
  battery: "https://www.batteryfinance.io/",
  bankStreet:
    "https://www.nasdaq.com/articles/newmarket-capital-launches-battery-finance-bitcoin-collateralized-loan-strategy",
  slp630: "https://www.stephanlivera.com/630",
  foldBoard: "https://www.sec.gov/Archives/edgar/data/1889123/000119312526147945/424b3_pro.supp._no.23.htm",
  safe10k: "https://www.sec.gov/Archives/edgar/data/1095651/000109565126000010/safe-20251231x10k.htm",
  gsTax: "https://perspectives.goulstonstorrs.com/insights/article/tax-considerations-for-ground-leases",
  lev: "https://www.lev.com/blog/ground-lease",
  res11: "https://youtu.be/KzuqdOxFers",
} as const;

const sleeveScenarios: SourceCard[] = [
  {
    title: "Cash-out refi",
    line: "Size the loan on hotel NOI alone; the BTC dollars still count in the debt yield.",
    href: SRC.bankStreet,
  },
  {
    title: "New build",
    line: "Build with conventional debt; add a BTC sleeve only at stabilized takeout.",
    href: SRC.battery,
  },
  {
    title: "Acquisition",
    line: "Equity-funded BTC keeps the keys; loan-funded BTC trades upside and liquidity for leverage.",
    href: SRC.battery,
  },
];

const batteryFacts: SourceCard[] = [
  {
    title: "Collateral, not cash",
    line: "BTC bought with loan proceeds sits in the lender's collateral package; no margin calls on price.",
    href: SRC.battery,
  },
  {
    title: "Four-year lock",
    line: "The BTC stays pledged at least four years, even if the loan is repaid early.",
    href: SRC.slp630,
  },
  {
    title: "Upside share",
    line: "In the lender's own example it keeps 80% of BTC gain in year 4, falling to 50% by year 10.",
    href: SRC.battery,
  },
  {
    title: "One public deal",
    line: "Bank Street Court, Philadelphia, Nov 2024: $12.5M loan, about 20 BTC. No hotel deal disclosed.",
    href: SRC.bankStreet,
  },
  {
    title: "Custodian not named",
    line: "Described as institutionally custodied; the custodian is not disclosed. You do not hold the keys.",
    href: SRC.battery,
  },
  {
    title: "Board seats",
    line: "CEO Andrew Hohns is a director of Fold Holdings and BTC Development Corp.",
    href: SRC.foldBoard,
  },
];

const landSplit: SourceCard[] = [
  {
    title: "Internal split",
    line: "A land entity collects ground rent; the hotel keeps operating. No new capital, cleaner treasury lines.",
    href: SRC.safe10k,
  },
  {
    title: "Land sale-leaseback",
    line: "Releases capital now, adds a rent that rises every year.",
    href: SRC.gsTax,
  },
  {
    title: "Land entity treasury",
    line: "An unlevered land entity can buy BTC from rent without touching hotel loan covenants.",
    href: SRC.res11,
  },
  {
    title: "Financeability first",
    line: "Unsubordinated leases protect the land and cost the hotel leverage.",
    href: SRC.lev,
  },
  {
    title: "Leases end",
    line: "At expiry the building goes with the land; two Park Hotels leases were not extended past 2025.",
    href: SRC.safe10k,
  },
];

const beforeYouSign = [
  "Who holds the keys, where, and can the BTC be re-lent?",
  "How long is the BTC locked, including after early repayment?",
  "What share of the BTC gain do you keep, and from which year?",
  "What happens to the BTC if you prepay, default, or BTC falls?",
  "Who is the lender affiliated with?",
  "How many months of debt service and PIP will you hold in USD, outside the BTC?",
] as const;

function CardGrid({ cards, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { cards: SourceCard[]; cols?: string }) {
  return (
    <div className={`grid gap-2 ${cols}`}>
      {cards.map((c) => {
        const inner = (
          <>
            <span className="block text-sm font-medium text-slate-200">
              {c.title}
              {c.href ? <span className="ml-1 text-xs text-slate-500">↗</span> : null}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-slate-400">{c.line}</span>
          </>
        );
        const cls =
          "block rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3";
        return c.href ? (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${cls} hover:border-white/20 hover:bg-white/[0.04]`}
          >
            {inner}
          </a>
        ) : (
          <div key={c.title} className={cls}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

const NOT_ADVICE =
  "Not legal, tax or investment advice. Consult a lawyer and a CPA before structuring anything.";

export default async function SoundMoneyLodgingPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>;
}) {
  const sp = await searchParams;
  const markets = await prisma.market.findMany({ orderBy: { name: "asc" } });
  // Only memos built on the checked-data engine are listed; older template memos stay in the DB, unrendered.
  const memos = (
    await prisma.artifact.findMany({
      where: { kind: STACK_MEMO_KIND },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { market: true },
    })
  )
    .filter((a) => !isPlaceholderText(a.title, a.markdown, a.sourceLabel))
    .slice(0, 10);

  return (
    <div className="space-y-12">
      {/* Hero — short summary, then the two calculators; the full doctrine follows below */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-slate-300">Sound Asset Lodging</p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Bitcoin on a hotel balance sheet, without starving the hotel.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-200">
          A cited guide for hotel owners and investors weighing a Bitcoin reserve: treasury, capital
          stack and operations. Start with the two calculators below; the full doctrine, sources and
          memo studio follow.
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
          Not financial, tax, legal, lending, or real-estate advice. We cite and propose — you
          decide. Inspired by CRE × Bitcoin education associated with Chris Drzyzga /{" "}
          <a
            href="https://www.tftc.io/cre"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-100 underline underline-offset-2 hover:text-white"
          >
            TFTC CRE guide
          </a>
          . No affiliation claimed.
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-base">
          <a href="#calculators" className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white">
            Open the calculators
          </a>
          <a href="#studio" className="text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white">
            Generate a Stack memo
          </a>
          <Link href="/markets" className="text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white">
            Browse markets
          </Link>
        </div>
      </section>

      {/* The two calculators, near the top */}
      <section id="calculators" className="scroll-mt-24 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Two calculators</h2>
        <div className="grid min-w-0 gap-4">
          <SleeveCarryCheck />
          <GroundRentCoverage />
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {NOT_ADVICE} The context for each calculator is below:{" "}
          <a href="#btc-sleeve" className="underline underline-offset-2 hover:text-white">financing a BTC sleeve</a> and{" "}
          <a href="#land-split" className="underline underline-offset-2 hover:text-white">land / hotel split</a>.
        </p>
      </section>

      {/* Doctrine — long form */}
      <section className="space-y-3 border-t border-white/[0.1] pt-10">
        <h2 className="text-2xl font-semibold tracking-tight text-white">The doctrine</h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-200">
          Bitcoin treasury, capital stack, and operations for hotel investors —
          hotel-native, decision support, and educational. Balance-sheet appreciation as a fifth
          return driver beside NOI, CapEx quality, leverage, and cap rates.
        </p>
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

      {/* Financing a BTC sleeve */}
      <section id="btc-sleeve" className="scroll-mt-24 space-y-4">
        <div className="space-y-2">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Financing a BTC sleeve
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            Decision support for owners weighing loan-funded Bitcoin on a refinance, a new build or
            an acquisition. The hotel has to carry the whole loan on its own NOI.
          </p>
        </div>
        <CardGrid cards={sleeveScenarios} />
        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-medium text-slate-300">
            One cited lender example: Battery Finance
          </h3>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            An affiliate of Newmarket Capital that lends against commercial real estate plus
            Bitcoin. Named for its public facts, not as an endorsement.
          </p>
          <CardGrid cards={batteryFacts} />
          <p className="max-w-3xl text-sm leading-relaxed text-amber-200/80">
            Custody and counterparty risk: the BTC sits with the lender&apos;s custodian, not with
            you, and the loan stays a USD obligation the hotel must carry if BTC falls.
          </p>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          Run the numbers in the{" "}
          <a href="#sleeve-carry-check" className="underline underline-offset-2 hover:text-white">sleeve carry check</a>{" "}
          above. {NOT_ADVICE}
        </p>
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
            "Debt yield excluding BTC",
            "Ground rent coverage",
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

      {/* Land / hotel split */}
      <section id="land-split" className="scroll-mt-24 space-y-4">
        <div className="space-y-2">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
            Land / hotel split
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            For fee-simple owners and owners already on a ground lease: the same coverage test
            applies to the rent you would pay or pay today.
          </p>
        </div>
        <CardGrid cards={landSplit} />
        <p className="text-sm leading-relaxed text-slate-300">
          Run the numbers in the{" "}
          <a href="#ground-rent-coverage" className="underline underline-offset-2 hover:text-white">ground rent coverage</a>{" "}
          calculator above. {NOT_ADVICE}
        </p>
      </section>

      {/* Before you sign */}
      <section id="before-you-sign" className="scroll-mt-24 space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Before you sign
        </h2>
        <p className="max-w-3xl text-sm text-slate-400">
          Six questions on keys, locks, upside share and liquidity.
        </p>
        <ol className="grid gap-2 sm:grid-cols-2">
          {beforeYouSign.map((q, i) => (
            <li
              key={q}
              className="flex gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-slate-300"
            >
              <span className="shrink-0 tabular-nums text-slate-500">{i + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
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
            Deterministic memo from checked market data: demand, capital, operations and supply,
            each figure row linked to its original source. No paid LLM. Markets without a checked
            read show only their cited signals.
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
          return (
          <article
            key={a.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-white">{a.title}</h3>
              <span className="text-xs text-slate-500">
                {a.market ? `${a.market.name} · ` : ""}
                {a.createdAt.toLocaleString("en-US", { timeZone: "America/New_York" })} ET
              </span>
            </div>
            <div className="mt-2">
              <SourceChip label={a.sourceLabel} />
            </div>
            <div className="mt-3 max-h-[32rem] overflow-y-auto rounded-lg border border-white/5 bg-black/20 p-4">
              <StackMemoView text={a.markdown} />
            </div>
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
