import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DealsSubnav } from "@/components/deals/DealsSubnav";
import { Chip, DotBar, UnderwriteNote } from "@/components/deals/DotBar";
import {
  DISCLAIMER,
  RUBRIC,
  anniversariesFor,
  entryFor,
  factorMeta,
  fmtDate,
  fmtMonthYear,
  fmtPerKey,
  fmtPrice,
  gradesFor,
  horizons,
  saleBySlug,
  sales,
  statusLabel,
  type FactorResult,
  type GradeResult,
  type Sale,
  type Source,
} from "@/lib/deals";

export function generateStaticParams() {
  return sales().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = saleBySlug(slug);
  if (!s) return {};
  return {
    title: `${s.property} · Recent Deals · Bungah Capital Intel`,
    description: `${s.property}, ${s.market}: ${fmtPrice(s.price)}, ${s.keys ?? "n/d"} keys, announced ${fmtDate(s.announced_on)}. Public-data deal autopsy.`,
    alternates: { canonical: `/deals/${s.slug}` },
  };
}

const KIND_ORDER = { filing: 0, record: 1, press: 2 } as const;
const kindLabel = (k: Source["kind"]) => (k === "filing" ? "Filing" : k === "record" ? "Record" : "Press");
const h2 = "text-xl font-semibold tracking-tight text-white";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-slate-100">{children}</dd>
    </div>
  );
}

function GradeSummary({ sale, g }: { sale: Sale; g: GradeResult | undefined }) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {!g ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <DotBar score={null} />
            <span className="text-base font-semibold text-white">Not graded yet</span>
          </div>
          <p className="text-sm text-slate-300">
            Rubric {RUBRIC.rubric_version} is published. The grade will use only public data dated on or before{" "}
            {fmtDate(sale.announced_on)}.
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {g.overall !== null ? (
              <>
                <span className="text-2xl font-semibold tabular-nums text-white">
                  {g.overall.toFixed(1)}
                  <span className="text-sm font-normal text-slate-400"> / {RUBRIC.scale.max}</span>
                </span>
                <DotBar score={g.overall} />
              </>
            ) : (
              <span className="text-base font-semibold text-white">{RUBRIC.missing_factor_rule.insufficient_label}</span>
            )}
          </div>
          <p className="text-sm text-slate-200">{g.output_text}</p>
        </>
      )}
      <Link href="/deals/methodology#rubric" className="inline-block">
        <Chip>Rubric {g?.rubric_version ?? RUBRIC.rubric_version}</Chip>
      </Link>
    </div>
  );
}

function SourceLinkCell({ r }: { r: FactorResult }) {
  if (!r.source_uri) return <span className="text-slate-400">None yet</span>;
  return (
    <a href={r.source_uri} className="break-all underline decoration-white/30 underline-offset-2 hover:text-white" rel="noopener" target="_blank">
      Source{r.as_of ? ` (${fmtDate(r.as_of)})` : ""}
    </a>
  );
}

function blankRows(): FactorResult[] {
  return RUBRIC.factors.map((f) => ({
    factor: f.id,
    weight: f.weight,
    graded: false,
    score: null,
    value: null,
    input_text: null,
    band_text: null,
    effective_weight: null,
    reason: "Public inputs are still being gathered.",
    as_of: null,
    source_uri: null,
  }));
}

function FactorTable({ rows }: { rows: FactorResult[] }) {
  return (
    <>
      <table className="hidden w-full text-left text-sm lg:table">
        <thead className="text-xs uppercase tracking-wider text-slate-400">
          <tr className="border-b border-white/10">
            <th className="py-2 pr-3 font-medium">Factor</th>
            <th className="py-2 pr-3 font-medium">Score</th>
            <th className="py-2 pr-3 font-medium">Input</th>
            <th className="py-2 pr-3 font-medium">Band</th>
            <th className="py-2 font-medium">Source</th>
          </tr>
        </thead>
        <tbody className="text-slate-200">
          {rows.map((r) => {
            const f = factorMeta(r.factor);
            return (
              <tr key={r.factor} className="border-b border-white/[0.06] align-top">
                <td className="py-2.5 pr-3">
                  {f.label} <span className="text-slate-400">{Math.round(f.weight * 100)}%</span>
                </td>
                <td className="whitespace-nowrap py-2.5 pr-3">
                  <span className="inline-flex items-center gap-2">
                    <DotBar score={r.score} />
                    <span className="tabular-nums">{r.graded ? r.score : "Not graded"}</span>
                  </span>
                </td>
                <td className="py-2.5 pr-3">{r.graded ? r.input_text : <span className="text-slate-300">{r.reason}</span>}</td>
                <td className="py-2.5 pr-3 text-slate-300">{r.band_text ?? ""}</td>
                <td className="py-2.5 text-[13px]">
                  <SourceLinkCell r={r} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ul className="divide-y divide-white/[0.06] rounded-xl border border-white/10 lg:hidden">
        {rows.map((r) => {
          const f = factorMeta(r.factor);
          return (
            <li key={`${r.factor}-m`}>
              <details className="group px-3 py-2.5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 text-sm text-slate-100">
                    {f.label} <span className="text-slate-400">{Math.round(f.weight * 100)}%</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 text-sm">
                    <DotBar score={r.score} />
                    <span className="tabular-nums text-slate-200">{r.graded ? r.score : "Not graded"}</span>
                  </span>
                </summary>
                <div className="mt-2 space-y-1 text-[13px] text-slate-300">
                  <p>{r.graded ? r.input_text : r.reason}</p>
                  {r.band_text ? <p>Band: {r.band_text}</p> : null}
                  <p>
                    <SourceLinkCell r={r} />
                  </p>
                </div>
              </details>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function GradeSection({ sale, grades }: { sale: Sale; grades: GradeResult[] }) {
  const [current, ...older] = grades;
  const rows = current ? current.factor_scores : blankRows();
  const ungraded = !!current && rows.some((r) => !r.graded);
  return (
    <section aria-labelledby="grade" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="grade" className={h2}>
          Grade at announcement
        </h2>
        <span className="text-[13px] text-slate-300">As of {fmtDate(sale.announced_on)}</span>
      </div>
      <FactorTable rows={rows} />
      {ungraded ? <p className="text-[13px] text-slate-300">Weights of ungraded factors are spread across graded ones.</p> : null}
      <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-sm">
        <span className="font-medium text-white">Overall</span>
        {current && current.overall !== null ? (
          <>
            <span className="tabular-nums text-white">
              {current.overall.toFixed(1)} / {RUBRIC.scale.max}
            </span>
            <span className="text-slate-300">· {current.factors_graded} of {current.factors_total} factors graded</span>
          </>
        ) : current ? (
          <span className="text-slate-200">
            {RUBRIC.missing_factor_rule.insufficient_label} · {current.factors_graded} of {current.factors_total} factors graded
          </span>
        ) : (
          <span className="text-slate-300">Not graded yet · 0 of {RUBRIC.factors.length} factors graded</span>
        )}
      </div>
      {older.map((g) => (
        <details key={g.rubric_version} className="text-sm text-slate-200">
          <summary className="cursor-pointer hover:text-white">Rubric {g.rubric_version} (original), graded {fmtDate(g.graded_on)}</summary>
          <div className="mt-2 space-y-2">
            <p>{g.output_text}</p>
            <FactorTable rows={g.factor_scores} />
          </div>
        </details>
      ))}
    </section>
  );
}

export default async function DealEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sale = saleBySlug(slug);
  if (!sale) notFound();
  const grades = gradesFor(sale.sale_id);
  const entry = entryFor(sale.sale_id);
  const landed = anniversariesFor(sale.sale_id);
  const sources = [...entry.sources].sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.date.localeCompare(b.date));

  const sourceList = (
    <ul className="space-y-2">
      {sources.map((s) => (
        <li key={s.url} className="flex flex-wrap items-start gap-2 text-sm">
          <Chip>{kindLabel(s.kind)}</Chip>
          <span className="min-w-0 flex-1">
            <a href={s.url} className="text-slate-100 underline decoration-white/30 underline-offset-2 hover:text-white" rel="noopener" target="_blank">
              {s.title}
            </a>
            <span className="text-slate-400">
              {" "}
              · {s.publisher} · {fmtDate(s.date)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8">
      <DealsSubnav active="entry" />
      <header className="space-y-4">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-300">
          <Link href="/markets" className="hover:text-white">
            Markets
          </Link>{" "}
          /{" "}
          <Link href="/deals" className="hover:text-white">
            Recent Deals
          </Link>
        </nav>
        <div>
          <h1 className="t-h1">{sale.property}</h1>
          <div className="mt-1 text-sm">
            {sale.market_slug ? (
              <Link href={`/markets/${sale.market_slug}`} className="text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white">
                {sale.market}
              </Link>
            ) : (
              <span className="text-slate-200">{sale.market}</span>
            )}
          </div>
        </div>
        <GradeSummary sale={sale} g={grades[0]} />
        <UnderwriteNote text={DISCLAIMER} />
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-4">
          <Fact label="Buyer">{sale.buyer}</Fact>
          <Fact label="Seller">{sale.seller}</Fact>
          <Fact label="Price">
            {fmtPrice(sale.price)}
            {sale.price_qualifier ? <span className="block text-xs text-slate-400">{sale.price_qualifier}</span> : null}
          </Fact>
          <Fact label="Price/key">{fmtPerKey(sale.price_per_key)}</Fact>
          <Fact label="Keys">
            {sale.keys?.toLocaleString("en-US") ?? "n/d"}
            {sale.keys_detail ? <span className="block text-xs text-slate-400">{sale.keys_detail}</span> : null}
          </Fact>
          <Fact label="Announced">{fmtDate(sale.announced_on)}</Fact>
          <Fact label="Status">
            {sale.status === "closed" && sale.closed_on ? `Closed ${fmtDate(sale.closed_on)}` : statusLabel(sale.status)}
          </Fact>
        </dl>
        {sale.seller_note ? <p className="text-[13px] text-slate-400">{sale.seller_note}</p> : null}
      </header>

      {entry.tape ? (
        <section aria-labelledby="tape" className="space-y-2">
          <h2 id="tape" className={h2}>
            The tape
          </h2>
          <p className="max-w-3xl text-[15px] leading-relaxed text-slate-200">{entry.tape}</p>
          {entry.financing_tags.length ? (
            <div className="flex flex-wrap gap-2">
              {entry.financing_tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      <GradeSection sale={sale} grades={grades} />

      {entry.factor_context && Object.keys(entry.factor_context).length ? (
        <section aria-labelledby="context" className="space-y-3">
          <div>
            <h2 id="context" className={h2}>
              Context, not scored
            </h2>
            <p className="text-[13px] text-slate-300">Cited figures shown for reference. They don&rsquo;t enter the grade.</p>
          </div>
          {Object.entries(entry.factor_context).map(([fid, items]) => (
            <div key={fid} className="space-y-1">
              <h3 className="text-sm font-medium text-white">{RUBRIC.factors.find((f) => f.id === fid)?.label ?? fid}</h3>
              <ul className="space-y-1.5 text-[13px] text-slate-200">
                {items.map((c) => (
                  <li key={c.text} className="max-w-3xl">
                    {c.text}{" "}
                    <a href={c.url} className="text-slate-300 underline decoration-white/30 underline-offset-2 hover:text-white" rel="noopener" target="_blank">
                      source
                    </a>
                    <span className="text-slate-400"> · {fmtDate(c.date)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {entry.watches_for ? (
        <section aria-label="Watches for" className="rounded-xl border border-white/20 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">Watches for</div>
          <p className="mt-1 text-[15px] text-slate-100">{entry.watches_for}</p>
        </section>
      ) : null}

      <section aria-labelledby="after" className="space-y-3">
        <div>
          <h2 id="after" className={h2}>
            After the deal
          </h2>
          <p className="text-[13px] text-slate-300">Tracked separately. Not part of the grade.</p>
        </div>
        <ol className="grid gap-3 md:grid-cols-3">
          <li className="rounded-xl border border-white/10 p-3">
            <div className="text-sm font-medium text-white">T0 · at announcement</div>
            <div className="text-[13px] text-slate-300">{fmtDate(sale.announced_on)}</div>
            {entry.baseline?.length ? (
              <ul className="mt-1 space-y-1 text-[13px] text-slate-200">
                {entry.baseline.map((b) => (
                  <li key={b.text}>
                    {b.text}{" "}
                    <a href={b.url} className="text-slate-300 underline decoration-white/30" rel="noopener" target="_blank">
                      source
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
          {horizons(sale.announced_on).map((h) => {
            const vals = landed.filter((a) => a.horizon === h.horizon);
            return (
              <li key={h.horizon} className="rounded-xl border border-white/10 p-3">
                <div className="text-sm font-medium text-white">{h.horizon}</div>
                {vals.length ? (
                  <ul className="mt-1 space-y-1 text-[13px] text-slate-200">
                    {vals.map((v) => (
                      <li key={v.market_metric}>
                        {v.market_metric}: {v.value}{" "}
                        <a href={v.source_uri} className="text-slate-300 underline decoration-white/30" rel="noopener" target="_blank">
                          source
                        </a>{" "}
                        <span className="text-slate-400">· recorded {fmtDate(v.recorded_on)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-[13px] text-slate-300">Lands {fmtMonthYear(h.lands)}</div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {sources.length ? (
        <section aria-labelledby="sources" className="space-y-3">
          <div className="hidden md:block">
            <h2 id="sources" className={h2}>
              Sources ({sources.length})
            </h2>
            <div className="mt-3">{sourceList}</div>
          </div>
          <details className="md:hidden">
            <summary className="cursor-pointer text-lg font-semibold text-white">Sources ({sources.length})</summary>
            <div className="mt-3">{sourceList}</div>
          </details>
        </section>
      ) : null}

      {entry.related.length ? (
        <section aria-labelledby="related" className="space-y-3">
          <h2 id="related" className={h2}>
            Related
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {entry.related.map((r) => (
              <Link key={r.href} href={r.href} className="rounded-xl border border-white/10 p-3 text-sm text-slate-100 hover:border-white/25">
                {r.label} →
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
