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
  sales,
  statusLabel,
  type LogRow,
  type Sale,
} from "@/lib/deals";

export const metadata: Metadata = {
  title: "Recent Deals · Bungah Capital Intel",
  description: "Graded autopsies of notable US hotel sales, on public data. Decision support, not a recommendation.",
  alternates: { canonical: "/deals" },
};

function GradeRow({ sale }: { sale: Sale }) {
  const g = gradesFor(sale.sale_id)[0];
  if (!g) return <div className="text-[13px] text-slate-300">Not graded yet</div>;
  if (g.overall === null)
    return (
      <div className="text-[13px] text-slate-200">
        {RUBRIC.missing_factor_rule.insufficient_label}
        <span className="text-slate-400"> · {g.factors_graded} of {g.factors_total} factors graded</span>
      </div>
    );
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
      <span className="text-base font-semibold tabular-nums text-white">
        {g.overall.toFixed(1)}
        <span className="text-xs font-normal text-slate-400"> / {RUBRIC.scale.max}</span>
      </span>
      <DotBar score={g.overall} />
      <span className="text-slate-300">
        {g.factors_graded} of {g.factors_total} factors graded
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
        <span className="text-slate-300"> · {sale.market}</span>
      </div>
      <div className="text-sm tabular-nums text-slate-200">
        {fmtPrice(sale.price)} · {fmtPerKey(sale.price_per_key)} · {sale.keys?.toLocaleString("en-US") ?? "n/d"} keys
      </div>
      <div className="text-[13px] text-slate-400">
        Buyer {sale.buyer} · Seller {sale.seller}
      </div>
      <GradeRow sale={sale} />
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
        <span>Announced {fmtDate(sale.announced_on)}</span>
        <Chip>{statusLabel(sale.status)}</Chip>
      </div>
    </Link>
  );
}

function logStatus(r: LogRow): React.ReactNode {
  const sale = sales().find((s) => r.log_id && s.log_id === r.log_id);
  if (sale && gradesFor(sale.sale_id).length)
    return (
      <Link href={`/deals/${sale.slug}`} className="underline decoration-white/30 underline-offset-2 hover:text-white">
        Graded
      </Link>
    );
  if (sale)
    return (
      <Link href={`/deals/${sale.slug}`} className="underline decoration-white/30 underline-offset-2 hover:text-white">
        Grading
      </Link>
    );
  return <span>Not graded yet</span>;
}

/** Disclosed price, or the partial figure exactly as recorded, or Unpriced. Never estimated. */
function logPrice(r: LogRow): string {
  if (r.price_usd) return fmtPrice(Number(r.price_usd));
  if (r.inclusion_basis.startsWith("included") && r.disclosed_metric) return r.disclosed_metric;
  return "Unpriced";
}

function LogTable({ rows }: { rows: LogRow[] }) {
  return (
    <>
      {/* Desktop: plain table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="text-xs uppercase tracking-wider text-slate-400">
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
                <a href={r.source_url} className="hover:text-white" rel="noopener" target="_blank">
                  {r.hotel}
                </a>
              </td>
              <td className="py-2 pr-3">{r.market}</td>
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
              <a href={r.source_url} className="hover:text-white" rel="noopener" target="_blank">
                {r.hotel}
              </a>{" "}
              <span className="text-slate-400">· {r.market}</span>
            </div>
            <div className="text-[13px] text-slate-300">
              {fmtDate(r.announce_date)} · {logPrice(r)} · {basisLabel(r.inclusion_basis)} · {logStatus(r)}
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
          <Link href="/deals/methodology#inclusion-rule" className="text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white">
            Inclusion rule
          </Link>
          <Link href="/deals/methodology#rubric" className="text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white">
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
            <summary className="cursor-pointer text-sm text-slate-200 hover:text-white">Show all ({log.length})</summary>
            <div className="mt-2">
              <LogTable rows={rest} />
            </div>
          </details>
        ) : null}
      </section>
    </div>
  );
}
