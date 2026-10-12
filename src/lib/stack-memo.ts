import tier1Data from "@/data/stack-memo-tier1.json";
import { publisherName, scrubInternal } from "./public-text";
import { parseSourceUrls } from "./source-links";
import { sortTaxNewest, isTaxSeries } from "./tax-series";

/**
 * Sound Asset Lodging Stack memo — deterministic, no LLM.
 * Tier 1 markets draw on checked market data (src/data/stack-memo-tier1.json, rebuilt by
 * scripts/gen_stack_memo_data.py). Every other market gets "no checked read yet" blocks plus its
 * existing cited signals. Figure rows are bullet lines whose first link is the row's original source
 * (the renderer turns the whole row into that link); `{tag: …}` renders as a chip.
 */

export const STACK_MEMO_KIND = "stack-memo";

type Row = { t: string; u: string[]; sec: boolean; d?: string; [k: string]: unknown };
type Tier1Market = {
  supply: { score: number | null; caution: string; rows: Row[]; projects: Row[]; rollup: Row[] };
  demand: {
    caution: string | null;
    visitation: Row | null;
    airlift: Row[];
    seats: Row[];
    anchors: Row[];
    events: (Row & { start: string | null; end: string | null; gap: boolean })[];
    pace: Row;
    normalize: string | null;
  };
  capital: {
    caution: string | null;
    cautionSecondary: boolean;
    comps: (Row & { cap: number | null })[];
    loans: (Row & { watch: boolean })[];
    holdability: string;
  };
  ops: {
    caution: string | null;
    flag: string | null;
    flagLinks: string[];
    wage: (Row & { union: boolean; gap: boolean })[];
    oews: Row | null;
    build: Row | null;
    operators: Row[];
    change: string | null;
    changeLinks: string[];
    preopen: Row[];
    gaps: string[];
  };
};

const TIER1 = (tier1Data as unknown as { markets: Record<string, Tier1Market> }).markets;

export function isTier1(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(TIER1, slug);
}

/** House rate pack (capital conditions pack, as of 2026-10-05; rate pack locked 2026-09-28). */
const RATE = {
  asOf: "2026-10-05",
  locked: "2026-09-28",
  tenY: "https://fred.stlouisfed.org/series/DGS10",
  sofr: "https://fred.stlouisfed.org/series/SOFR",
  dq: "https://www.trepp.com/trepptalk/cmbs-delinquency-report-sept-2026",
  ss: "https://www.trepp.com/trepptalk/cmbs-special-servicing-rate-climbs-in-august-2026",
};
const HOLD_YEARS = 5;
const SECONDARY = "{tag: secondary}";

/**
 * Reserved slot: "Cardone model, hotel version". Rendered only when it has content; stays empty
 * (and invisible) until that section is written and cleared.
 */
const CARDONE_SRC = {
  filing: "https://www.sec.gov/Archives/edgar/data/1915521/000147793226005246/cardone_1apos.htm",
  coindesk: "https://www.coindesk.com/business/2025/01/22/grant-cardone-wants-to-use-real-estate-cash-flow-to-buy-bitcoin-here-s-how",
  faq: "https://cardonecapital.com/faq/",
  capexClaim: "https://x.com/GrantCardone/status/2098437260072853935",
  lockbox: "https://www.hklaw.com/files/Uploads/Documents/Articles/Booth_CMBSLoans.pdf",
};
const SELF = "{tag: self-reported}";
const CARDONE_HOTEL_SECTION: string[] = [
  `Grant Cardone's Cardone Capital multifamily funds are the apartment precedent for pairing property with Bitcoin. This section credits that precedent and sets the hotel rules; it is education and decision support, not a recommendation.`,
  ``,
  `### Apartment precedent`,
  ``,
  `- 10X Space Coast fund (300 units, Melbourne FL): $15.0M of Bitcoin bought at closing with investor equity, about 17% of an $88.35M raise (our arithmetic; filing dated 2026-08-24) · [${publisherName(CARDONE_SRC.filing)} ↗](${CARDONE_SRC.filing})`,
  `- After closing, monthly property cash flow buys more Bitcoin until the real estate / Bitcoin mix moves from 85/15 to 70/30, over about 4 years (2025-01-22) · [${publisherName(CARDONE_SRC.coindesk)} ↗](${CARDONE_SRC.coindesk}) ${SELF}`,
  `- Boca Raton fund (366 units): $108.0M of Bitcoin at launch, also investor equity, beside $140.0M of filed financing (filing dated 2026-08-24) · [${publisherName(CARDONE_SRC.filing)} ↗](${CARDONE_SRC.filing})`,
  `- Stated firm-wide band: Bitcoin at 15–50% of the mix, adjusted for capex, liquidity and debt-maturity needs (page undated) · [${publisherName(CARDONE_SRC.faq)} ↗](${CARDONE_SRC.faq}) ${SELF}`,
  ``,
  `### Hotel version rules`,
  ``,
  `- Bitcoin is bought only from cash left after the PIP, the FF&E reserve, management and franchise fees, and a fully staffed hotel. The FF&E reserve level is a house assumption set by the franchise, management or loan documents, not a sourced figure.`,
  `- Under a lender lockbox or cash sweep, only released cash or new equity can buy Bitcoin; swept cash never does (CMBS loan-structure background) · [${publisherName(CARDONE_SRC.lockbox)} ↗](${CARDONE_SRC.lockbox})`,
  `- The refinance test runs on hotel income alone, with no Bitcoin credit. A Bitcoin tranche never fixes a DY shortfall.`,
  `- The apartment claim that Bitcoin covers capex and debt maturities does not carry over: the franchisor sets PIP timing, and a PIP can come due in a Bitcoin drawdown (claim dated 2026-09-11) · [${publisherName(CARDONE_SRC.capexClaim)} ↗](${CARDONE_SRC.capexClaim}) ${SELF}`,
  `- Illustration: Boca's debt yield is about 7.5% (166-day NOI of $4.80M annualised ≈ $10.5M ÷ the $140M filed loan; our arithmetic), under the 8% hard-watch line before any Bitcoin is counted · [${publisherName(CARDONE_SRC.filing)} ↗](${CARDONE_SRC.filing}) {tag: watch}`,
  `- No staff cuts and no automating guest-facing roles to free cash for Bitcoin.`,
  ``,
];

function untimedT(t: string): boolean {
  return /timing: no public read/i.test(t);
}

function keysOf(t: string): number {
  const m = t.match(/(\d[\d,]*)\s+keys/);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

/** Tier 1 only: the precedent + rules, then this market's supply beside any allocation. */
function cardoneSection(m: Tier1Market): string[] {
  if (!CARDONE_HOTEL_SECTION.length) return [];
  const s = m.supply;
  const out = [...CARDONE_HOTEL_SECTION, `### This market, beside any allocation`, ``];
  out.push(
    `- Supply pressure ${s.score ?? "—"}/5 (${supplyMeaning(s.score)}); named projects opening inside the hold: ${
      s.projects.length
        ? `${s.projects.length} (opening date public for ${s.projects.filter((p) => !untimedT(p.t)).length}); largest below, dated first`
        : "no named list published (see pipeline by stage above)"
    }.`
  );
  const untimed = (t: string) => (untimedT(t) ? 1 : 0);
  const top = [...s.projects].sort((a, b) => untimed(a.t) - untimed(b.t) || keysOf(b.t) - keysOf(a.t)).slice(0, 3);
  for (const r of top) {
    const l = rowLine(r);
    if (l) out.push(l);
  }
  if ((s.score ?? 0) >= 4) out.push(``, `> **Size off normalized income net of new supply.**`, ``);
  out.push(`- Sizing base (this market's normalized T12 income): no checked read, so no allocation is sized here.`, ``);
  return out;
}

function oneLine(s: string): string {
  return scrubInternal(s).replace(/\s+/g, " ").replace(/[\[\]]/g, "").trim();
}

function links(urls: string[]): string {
  const seen = new Set<string>();
  return urls
    .filter((u) => /^https?:\/\//.test(u) && !seen.has(u) && seen.add(u))
    .map((u) => `[${publisherName(u)} ↗](${u})`)
    .join(" · ");
}

/** A figure row: linked rows become whole-row links; unlinked rows only for "no public read". */
function rowLine(r: Row | null | undefined, ...tags: (string | false | null | undefined)[]): string | null {
  if (!r) return null;
  const text = oneLine(r.t);
  if (!text) return null;
  const date = r.d && !text.includes(r.d) ? ` (${oneLine(r.d)})` : "";
  const t = [r.sec ? SECONDARY : null, ...tags].filter(Boolean).join(" ");
  if (!r.u?.length) {
    if (!/no public read|not checked/i.test(text)) return null;
    return `- ${text}${date}${t ? " " + t : ""}`;
  }
  return `- ${text}${date} · ${links(r.u)}${t ? " " + t : ""}`;
}

function etDate(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function addYears(iso: string, n: number): string {
  return `${Number(iso.slice(0, 4)) + n}${iso.slice(4)}`;
}

export type MemoPurpose = "acquisition" | "build";

type SignalLike = {
  id: string;
  title: string;
  body: string;
  magnitude: string | null;
  asOf: string | null;
  sourceLabel: string;
  sourceUrls: unknown;
};

function latestTax(signals: SignalLike[], slug: string): string | null {
  const tax = sortTaxNewest(signals.filter((s) => isTaxSeries(s) && !/gaps$/.test(s.id))).find(
    (s) => parseSourceUrls(s.sourceUrls).length
  );
  if (!tax) return null;
  const urls = parseSourceUrls(tax.sourceUrls).map((l) => l.url);
  const sec = parseSourceUrls(tax.sourceUrls).some((l) => l.secondary);
  let mag = oneLine(tax.magnitude ?? "");
  if ((slug === "honolulu" || slug === "phoenix") && !/rate-driven/i.test(mag)) mag += " · rate-driven";
  const la = slug === "los-angeles" ? " · postings are lumpy: read fiscal-year totals" : "";
  return rowLine(
    { t: `${oneLine(tax.title)}: ${mag}${la}`, u: urls, sec, d: tax.asOf ?? "" },
    "{tag: tax ≠ refinance capacity}"
  );
}

function supplyMeaning(score: number | null): string {
  if (score == null) return "";
  if (score <= 2) return "tailwind — but a low score is never a buy signal on its own";
  if (score === 3) return "mixed — underwrite by submarket";
  return "no ground-up without a hard barrier";
}

export function buildStackMemo(opts: {
  slug: string;
  name: string;
  signals: SignalLike[];
  purpose?: MemoPurpose;
  now?: Date;
}): { markdown: string; tier1: boolean } {
  const { slug, name, signals } = opts;
  const purpose: MemoPurpose = opts.purpose === "build" ? "build" : "acquisition";
  const today = etDate(opts.now ?? new Date());
  const in90 = addDays(today, 90);
  const holdEnd = addYears(today, HOLD_YEARS);
  const m = TIER1[slug];
  const L: (string | null)[] = [];
  const push = (...xs: (string | null | undefined)[]) => L.push(...xs.map((x) => x ?? null));

  push(
    `# Sound Asset Lodging — Stack memo · ${name}`,
    ``,
    `**Memo date:** ${today} ET · **Hold window:** ${HOLD_YEARS} years (to ${holdEnd}) · **Memo type:** ${
      purpose === "build" ? "build or renovation" : "acquisition / hold"
    }`,
    ``,
    `Decision support and education only — not financial, tax, legal, lending or real-estate advice. Every figure row opens its original source.`,
    ``
  );

  if (!m) {
    push(
      `## Market thesis (demand)`,
      ``,
      `Demand: no checked read yet.`,
      ``,
      `## Capital`,
      ``,
      `Capital: no checked read yet.`,
      ``,
      `## Operations`,
      ``,
      `Operations: no checked read yet.`,
      ``,
      `## Supply`,
      ``,
      `Supply: no checked read yet.`,
      ``,
      `## Cited signals on file`,
      ``
    );
    const cited = signals
      .map((s) => {
        const ls = parseSourceUrls(s.sourceUrls);
        if (!ls.length) return null;
        return rowLine({
          t: `${oneLine(s.title)}${s.magnitude && !s.title.includes(s.magnitude) ? `: ${oneLine(s.magnitude)}` : ""}`,
          u: ls.map((l) => l.url),
          sec: ls.some((l) => l.secondary),
          d: s.asOf ?? "",
        });
      })
      .filter(Boolean)
      .slice(0, 8) as string[];
    push(...(cited.length ? cited : ["No linked signals on file yet."]), ``);
    pillarsAndNext(push, null, purpose);
    return { markdown: finish(L), tier1: false };
  }

  // ---------- Market thesis from demand ----------
  const d = m.demand;
  push(`## Market thesis (demand)`, ``);
  if (d.caution) push(`> **Demand caution:** ${d.caution}`, ``);
  const airlift = [...d.seats.filter((r) => r.u.length), ...d.airlift, ...d.seats.filter((r) => !r.u.length)];
  push(
    `### Airlift`,
    ``,
    ...airlift.map((r) => rowLine(r)),
    `- Forward seats outrank trailing passengers; route counts are not seats.`,
    ``
  );
  const ev = d.events.filter((e) => {
    if (e.gap && !e.start && !e.end) return true;
    const start = e.start ?? today;
    const end = e.end ?? start;
    return start <= in90 && end >= today;
  });
  push(`### Citywides in the next 90 days (to ${in90})`, ``);
  push(...(ev.length ? ev.map((e) => rowLine(e, e.u.length ? null : "{tag: no public read}")) : ["- No cited citywide inside the window."]));
  push(rowLine(d.pace), ``);
  push(`### Visitation and anchors`, ``, rowLine(d.visitation), ...d.anchors.map((r) => rowLine(r)));
  if (d.normalize) push(`- ${d.normalize} {tag: normalize T12}`);
  push(`- Economic impact is not demand, and an MSA average is not a submarket.`, ``);

  // ---------- Capital ----------
  const c = m.capital;
  push(
    `## Capital`,
    ``,
    `> **Refinance test (house frame, not a quote or appraisal; as of ${RATE.asOf}):** takeout at ≥7.5–8.0%+ off 10Y ~5.18% / SOFR ~3.90% (locked ${RATE.locked}). Debt yield on a normalized T12: target ≥10%, flag ≤9%, hard watch ≤8%. This test outranks every other block in the memo.`,
    ``,
    `- 10-year Treasury 5.24% (2026-10-01; 5.18% at the lock) · ${links([RATE.tenY])}`,
    `- SOFR 3.88% (2026-10-02; 3.90% at the lock) · ${links([RATE.sofr])}`,
    `- National lodging CMBS delinquency 6.18% (Sep 2026) and special servicing 8.74% (Aug 2026) — national, not ${name} · ${links([RATE.dq, RATE.ss])} {tag: national}`,
    ``
  );
  if (c.caution) push(`> **Capital caution:** ${c.caution}${c.cautionSecondary ? " {tag: secondary}" : ""}`, ``);
  if (c.holdability) {
    push(`### Holdability read (as written)`, ``, ...holdabilityLines(c.holdability), ``);
  }
  push(`### Deal comps (most recent ${Math.min(5, c.comps.length)})`, ``);
  push(
    ...c.comps.map((r) =>
      rowLine(r, r.cap != null && r.cap < 7.5 ? "{tag: cap below house takeout: negative leverage at today's debt}" : null)
    ),
    `- No market-average cap rate: each disclosed cap is read on its own, and an undisclosed cap is never inferred.`,
    ``
  );
  push(`### Loan watch`, ``, ...c.loans.map((r) => rowLine(r, r.watch ? "{tag: watch}" : null)));
  push(`- Distressed or receivership assets stay **watch**, never buy, until DY, PIP, insurance and talent all clear.`, ``);
  const tax = latestTax(signals, slug);
  push(`### Hotel-tax collections (latest)`, ``, tax ?? "- Hotel-tax collections: no public read", ``);

  // ---------- Operations ----------
  const o = m.ops;
  push(`## Operations`, ``);
  if (o.caution) push(`> **Operations caution:** ${o.caution}`, ``);
  const floor = o.wage.filter((w) => !w.union && w.u.length).slice(0, 4);
  push(`### Wage floor (steps inside the hold, to ${holdEnd})`, ``, ...floor.map((r) => rowLine(r)));
  if (o.oews) push(rowLine(o.oews, "{tag: a low statutory floor is not cheap labor}"));
  push(
    `- Labor is costed at the floor in force on each hold date, with no staff cuts, no reduced service and no automating guest-facing roles. If labor breaks the refinance test, the options are revenue, pricing, mix or capital structure.`,
    ``
  );
  const unionRows = o.wage.filter((w) => w.union && w.u.length).slice(0, 3);
  push(`### Contract risk in the hold`, ``);
  if (o.flag) {
    const none = /^none public/i.test(o.flag);
    push(
      o.flagLinks.length
        ? `- ${oneLine(o.flag)} · ${links(o.flagLinks)}${none ? "" : " {tag: watch}"}`
        : `- ${oneLine(o.flag)}${none ? "" : " {tag: watch}"}`
    );
  }
  push(...unionRows.map((r) => rowLine(r, /strike|expire|bargain|no contract/i.test(r.t) ? "{tag: watch}" : null)));
  push(`- A live strike or open contract stays **watch** until a ratified source says otherwise.`, ``);
  push(`### Operator bench`, ``, ...o.operators.map((r) => rowLine(r)));
  if (o.change && o.changeLinks.length) push(`- Latest management change: ${oneLine(o.change)} · ${links(o.changeLinks)}`);
  push(`- Operator and GM names come from public announcements; they are not contact suggestions.`, ``);
  push(`### Pre-open and transition`, ``);
  push(...(o.preopen.length ? o.preopen.map((r) => rowLine(r)) : ["- Named pre-open leadership: no public read"]), ``);
  if (purpose === "build" && o.build) push(`### Construction labor (build / renovation)`, ``, rowLine(o.build), ``);
  if (o.gaps.length) push(`### Gaps`, ``, ...o.gaps.map((g) => `- ${oneLine(g)}: no public read`), ``);

  // ---------- Supply ----------
  const s = m.supply;
  push(
    `## Supply`,
    ``,
    `> **Supply pressure ${s.score ?? "—"}/5** (${supplyMeaning(s.score)}). **Supply caution:** ${s.caution}`,
    ``,
    ...s.rows.map((r) => rowLine(r))
  );
  push(`- Supply never overrides the refinance test, and low supply is never read as a buy.`, ``);
  if (s.projects.length) {
    const shown = s.projects.slice(0, 6);
    push(`### Named deliveries inside the hold`, ``, ...shown.map((r) => rowLine(r)));
    if (s.projects.length > shown.length) push(`- Plus ${s.projects.length - shown.length} more named projects in the same cited pipeline sources.`);
    push(``);
  } else if (s.rollup.length) {
    push(`### Pipeline by stage (no named list published)`, ``, ...s.rollup.map((r) => rowLine(r)), ``);
  }

  pillarsAndNext(push, m, purpose);
  return { markdown: finish(L), tier1: true };
}

function holdabilityLines(text: string): string[] {
  // Verbatim, minus internal references; inline URLs become publisher links.
  const out: string[] = [];
  for (const raw of text.split(/\n+/)) {
    let line = scrubInternal(raw).trim();
    if (!line) continue;
    line = line.replace(/\(?(https?:\/\/[^\s);,]+)\)?/g, (_m, u: string) => `[${publisherName(u)} ↗](${u})`);
    out.push(line.startsWith("- ") ? line : `- ${line}`);
  }
  return out;
}

function pillarsAndNext(
  push: (...xs: (string | null | undefined)[]) => void,
  m: Tier1Market | null,
  purpose: MemoPurpose
) {
  push(
    `## Three pillars checklist`,
    ``,
    `- **Capital:** the refinance test clears (DY ≥10% on a normalized T12 at ≥7.5–8.0% takeout) before anything else is sized.`,
    `- **Operations:** labor at the scheduled floors and contract rates, full staffing, PIP and FF&E funded.`,
    `- **Treasury:** only free cash flow after fees, debt service and PIP escrow is eligible for a reserve.`,
    ``,
    `## Bitcoin tranche (education only)`,
    ``,
    `- A strategic Bitcoin tranche never fixes a debt-yield or DSCR shortfall; it is sized only after the refinance test clears.`,
    `- Track Bitcoin per key and months of debt service covered as decision-support KPIs; never starve PIP or debt service to fund it.`,
    `- Bonuses or tips paid in sats are a concept only: pay and tip rules vary by state and need legal review before any use.`,
    ``
  );
  const cardone = m ? cardoneSection(m) : [];
  if (cardone.length) push(`## Cardone model, hotel version`, ``, ...cardone);
  const watchLoans = m ? m.capital.loans.filter((l) => l.watch && l.u.length).length : 0;
  push(
    `## Next steps (decision support)`,
    ``,
    `1. Run the refinance test on a normalized T12${m?.demand.normalize ? " (event windows stripped)" : ""} before any price or tranche discussion.`,
    m
      ? `2. Diligence the watch items above${watchLoans ? ` (${watchLoans} loan-watch rows)` : ""} and the open contract risk before treating any asset as available.`
      : `2. Wait for a checked market read before underwriting this market; use only the cited signals above.`,
    `3. Cost labor at each scheduled floor through the hold; no staff cuts to make the numbers work.`,
    purpose === "build"
      ? `4. For a build or renovation, test the construction-labor line and named deliveries against the opening date.`
      : `4. Check named deliveries and the submarket before relying on market-level occupancy or rate.`,
    `5. A person decides: no automatic CapEx, outreach, refinance or Bitcoin purchase comes from this memo.`,
    ``,
    `---`,
    `*Sound Asset Lodging · Bungah Capital Intel · decision support · rows tagged secondary are broker or aggregator reads*`
  );
}

function finish(lines: (string | null)[]): string {
  return lines
    .filter((l) => l !== null)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}
