import Link from "next/link";
import type { Metadata } from "next";
import { DealsSubnav } from "@/components/deals/DealsSubnav";
import { Chip, DotBar } from "@/components/deals/DotBar";
import {
  RUBRIC,
  basisLabel,
  dealLog,
  fmtDate,
  fmtPerKey,
  fmtPrice,
  gradesFor,
  gradeLabel,
  cardMetaFor,
  salePrice,
  sales,
  closeLabel,
  displayMarket,
  fmtKeys,
  type LogRow,
  type Sale,
} from "@/lib/deals";

export const metadata: Metadata = {
  title: "Recent Deals · Bungah Capital Intel",
  description: "Graded autopsies of notable US hotel sales, on public data. Decision support, not a recommendation.",
  alternates: { canonical: "/deals" },
};

/**
 * Separator for wrapped inline text: a no-break space before the dot glues it to the word before, so a wrapped line
 * never starts with "·" (it can only end with one). Eric r5/r6.
 */
const SEP = "\u00a0· ";
/** Keep a short phrase on one line ("Chicago, IL", "replacement cost"). */
const glue = (t: string) => t.replace(/ /g, "\u00a0");

const ngItems = (line: string) => line.replace(/^Not graded:\s*/, "").split(", ");
/** First item ("replacement cost,"), kept with the label. */
const notGradedHead = (line: string) => {
  const items = ngItems(line);
  return `${items[0]}${items.length > 1 ? "," : ""}`;
};
/** Remaining items, each kept whole ("spread, supply"). */
const notGradedTail = (line: string) => {
  const rest = ngItems(line).slice(1);
  return rest.length ? ` ${rest.map(glue).join(", ")}` : "";
};

function GradeRow({ sale }: { sale: Sale }) {
  const g = gradesFor(sale.sale_id)[0];
  if (!g) return <div className="text-[13px] text-slate-300">Not graded yet</div>;
  // One compact meta line (Eric r4): grade · coverage · Not graded: … The full output line stays on the deal page.
  const m = cardMetaFor(g);
  // Inline flow (not flex-wrap) so a wrapped line never starts with a dangling "·".
  return (
    <p className="text-[13px] leading-6 text-slate-300">
      {g.overall !== null ? (
        <>
          <span className="text-base font-semibold tabular-nums text-white">
            {g.overall.toFixed(1)}
            <span className="text-xs font-normal text-slate-300"> of {RUBRIC.scale.max}</span>
          </span>{" "}
          <span className="inline-flex align-middle">
            <DotBar score={g.overall} />
          </span>
        </>
      ) : (
        <span className="font-semibold text-slate-100">{m.grade}</span>
      )}
      {SEP}
      <span className="whitespace-nowrap">{m.coverage}</span>
      {m.notGraded ? (
        <>
          {SEP}
          {/* "Not graded:" stays on the line with its first item; the list may wrap after that. */}
          <span className="whitespace-nowrap">Not graded: {notGradedHead(m.notGraded)}</span>
          {notGradedTail(m.notGraded)}
        </>
      ) : null}
    </p>
  );
}

/** Eric's spec: current and original grades both visible. */
function VersionRow({ sale }: { sale: Sale }) {
  const gs = gradesFor(sale.sale_id);
  if (gs.length < 2) return null;
  const cur = gs[0];
  const orig = gs[gs.length - 1];
  return (
    <div className="flex flex-col text-[13px] text-slate-300 sm:flex-row sm:gap-x-1">
      <span className="whitespace-nowrap">Rubric {cur.rubric_version} (current)</span>
      <span aria-hidden="true" className="hidden sm:inline">
        |
      </span>
      <span>
        Rubric {orig.rubric_version} (original): {gradeLabel(orig)}
      </span>
    </div>
  );
}

function DealCard({ sale }: { sale: Sale }) {
  return (
    <Link
      href={`/deals/${sale.slug}`}
      className="block space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
    >
      <div>
        <span className="font-semibold text-white">{sale.property}</span>
        <span className="text-slate-300">
          {SEP}
          <span className="whitespace-nowrap">{sale.market}</span>
        </span>
      </div>
      <div className="text-sm tabular-nums text-slate-200">
        {salePrice(sale)}
        {SEP}
        {glue(fmtPerKey(sale.price_per_key))}
        {SEP}
        {glue(fmtKeys(sale.keys))}
      </div>
      <div className="text-[13px] text-slate-300">
        Buyer {sale.buyer}
        {SEP}Seller {sale.seller}
      </div>
      <GradeRow sale={sale} />
      <VersionRow sale={sale} />
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
        <span>Announced {fmtDate(sale.announced_on)}</span>
        <Chip>{closeLabel(sale)}</Chip>
      </div>
    </Link>
  );
}

function logStatus(r: LogRow): React.ReactNode {
  const sale = sales().find((s) => r.log_id && s.log_id === r.log_id);
  if (sale && gradesFor(sale.sale_id).length)
    return (
      <Link href={`/deals/${sale.slug}`} className="-mx-1 px-1 py-3.5 underline decoration-white/30 underline-offset-2 hover:text-white">
        Graded
      </Link>
    );
  if (sale)
    return (
      <Link href={`/deals/${sale.slug}`} className="-mx-1 px-1 py-3.5 underline decoration-white/30 underline-offset-2 hover:text-white">
        Grading
      </Link>
    );
  return <span>Not graded: inputs not yet gathered</span>;
}

/** Disclosed price, or the partial figure exactly as recorded, or Unpriced. Never estimated. */
function logPrice(r: LogRow): string {
  if (r.price_usd) return fmtPrice(Number(r.price_usd));
  const sale = sales().find((s) => s.log_id === r.log_id);
  if (sale?.price_display) return sale.price_display;
  if (r.inclusion_basis.startsWith("included") && r.disclosed_metric) return r.disclosed_metric;
  return "Unpriced";
}

function LogTable({ rows }: { rows: LogRow[] }) {
  return (
    <>
      {/* Desktop: plain table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="text-xs uppercase tracking-wider text-slate-300">
          <tr className="border-b border-white/10">
            <th className="py-2 pr-3 font-medium">Announced</th>
            <th className="py-2 pr-3 font-medium">Property</th>
            <th className="py-2 pr-3 font-medium">Market</th>
            <th className="py-2 pr-3 font-medium">Price</th>
            <th className="py-2 pr-3 font-medium">Qualifies by</th>
            <th className="py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="text-slate-200">
          {rows.map((r) => (
            <tr key={r.log_id} className="border-b border-white/[0.06] align-top">
              <td className="whitespace-nowrap py-2 pr-3 tabular-nums">{fmtDate(r.announce_date)}</td>
              <td className="py-2 pr-3">
                <a href={r.source_url} className="inline-flex min-h-11 items-center hover:text-white" rel="noopener" target="_blank">
                  {r.hotel}
                </a>
              </td>
              <td className="py-2 pr-3">{displayMarket(r.market)}</td>
              <td className="py-2 pr-3 tabular-nums">{logPrice(r)}</td>
              <td className="py-2 pr-3">{basisLabel(r.inclusion_basis)}</td>
              <td className="py-2">{logStatus(r)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile: two-line list items */}
      <ul className="divide-y divide-white/[0.06] md:hidden">
        {rows.map((r) => (
          <li key={`${r.log_id}-m`} className="py-2 text-sm">
            <div className="text-slate-100">
              {/* Plain inline (not inline-flex) so "\u00a0· City, ST" stays glued; py-3.5 keeps a 44px tap height. */}
              <a href={r.source_url} className="py-3.5 hover:text-white" rel="noopener" target="_blank">
                {r.hotel}
              </a>
              <span className="text-slate-300">
                {SEP}
                <span className="whitespace-nowrap">{displayMarket(r.market)}</span>
              </span>
            </div>
            <div className="text-[13px] text-slate-300">
              <span className="whitespace-nowrap">{fmtDate(r.announce_date)}</span>
              {SEP}
              {logPrice(r)}
              {SEP}
              {basisLabel(r.inclusion_basis)}
              {SEP}
              {logStatus(r)}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function DealsIndexPage() {
  const all = sales();
  const log = dealLog();
  const first = log.slice(0, 10);
  const rest = log.slice(10);
  return (
    <div className="space-y-8">
      <DealsSubnav active="index" />
      <header className="space-y-3">
        <h1 className="t-h1">Recent Deals</h1>
        <p className="max-w-3xl t-lead">
          Graded autopsies of notable US hotel sales, on public data. Decision support, not a recommendation.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/deals/methodology#inclusion-rule" className="inline-flex min-h-11 items-center text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white">
            Inclusion rule
          </Link>
          <Link href="/deals/methodology#rubric" className="inline-flex min-h-11 items-center text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white">
            Rubric {RUBRIC.rubric_version}
          </Link>
        </div>
      </header>

      <section aria-label="Entries" className="grid gap-4 md:grid-cols-2">
        {all.map((s) => (
          <DealCard key={s.sale_id} sale={s} />
        ))}
      </section>

      <section aria-labelledby="deal-log" className="space-y-3">
        <h2 id="deal-log" className="text-xl font-semibold tracking-tight text-white">
          Every qualifying deal ({log.length})
        </h2>
        <p className="max-w-3xl text-sm text-slate-300">
          Every deal that meets the inclusion rule is logged here, graded or not, from Aug 10, 2026 on. Ordered by announcement date, newest first.
          Each property links to its source. Prices are as disclosed or recorded, never estimated.
        </p>
        <LogTable rows={first} />
        {rest.length ? (
          <details className="group">
            <summary className="flex min-h-11 cursor-pointer items-center text-sm text-slate-200 hover:text-white">Show all ({log.length})</summary>
            <div className="mt-2">
              <LogTable rows={rest} />
            </div>
          </details>
        ) : null}
      </section>
    </div>
  );
}
