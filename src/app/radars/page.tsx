import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { cleanSourceLabel, scrubInternal } from "@/lib/public-text";
import { citedFindings, publicRadarDescription } from "@/lib/format";
import { leadStat, sourceUrlFor, unverifiedFiguresIn } from "@/lib/radar-stats";
import { RunRadarsButton } from "./RunRadarsButton";
import {
  CITY_CENTER_RADAR,
  CITY_ROWS,
  CITY_TABLE_NOTE,
  CITY_TABLE_SOURCES,
  NATIONAL_RADAR,
  PREVIEW_CHECKED,
  SUPERSEDED_RADAR_SLUGS,
  THIN_CITIES_LINE,
  nationalRadarsVisible,
  type CityRow,
  type PreviewRadar,
  type PreviewSource,
} from "@/lib/radars-preview";

export const dynamic = "force-dynamic";

function marketName(slug: string): string {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Finding.createdAt is when the radar recorded the finding; shown as the card date (ET). */
function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" });
}

const DOT: Record<string, string> = {
  alert: "bg-rose-400",
  watch: "bg-amber-400",
  active: "bg-emerald-400",
};

function StatusPill({ status }: { status: string }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-2.5 text-xs font-medium text-slate-100">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOT[status] ?? "bg-sky-400"}`} />
      {label}
    </span>
  );
}

/** Split a source line on ";" outside parentheses, so "(a; b)" stays with its source. */
function splitSources(label: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = "";
  for (const ch of label) {
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === ";" && depth === 0) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter(Boolean);
}

function Sources({ label }: { label: string }) {
  const parts = splitSources(cleanSourceLabel(label).replace(/https?:\/\/\S+/g, ""));
  return <SourceList items={parts.map((p) => ({ label: p, url: sourceUrlFor(p) ?? undefined }))} />;
}

function SourceList({ items, title = "Sources" }: { items: { label: string; url?: string; flag?: string }[]; title?: string }) {
  return (
    <details className="group text-xs text-slate-200">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded text-slate-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
        {title} ({items.length})
      </summary>
      <ul className="mt-2 space-y-1 border-l border-white/10 pl-3 leading-snug">
        {items.map((p, i) => (
          <li key={i}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline-offset-2 hover:underline">
                {p.label} ↗
              </a>
            ) : (
              p.label
            )}
            {p.flag ? <span className="ml-1.5 text-amber-200">[{p.flag}]</span> : null}
          </li>
        ))}
      </ul>
    </details>
  );
}

function RadarFooter({ chatHref, marketSlug, marketLabel, signedIn }: { chatHref: string; marketSlug?: string | null; marketLabel?: string; signedIn: boolean }) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {marketSlug ? (
          <Link href={`/markets/${marketSlug}`} className="font-medium text-emerald-300 hover:underline">
            {marketLabel} market page →
          </Link>
        ) : null}
        <Link href={chatHref} className="font-medium text-emerald-300 hover:underline">
          Ask Chat about this
        </Link>
      </div>
      {!signedIn ? (
        <Link
          href="/signup"
          className="rounded-md border border-white/25 px-2.5 py-1 text-xs font-medium text-slate-100 hover:border-white/50 hover:bg-white/5"
        >
          Get alerts for this radar
        </Link>
      ) : null}
    </div>
  );
}

function RadarHeader({ tag, status, name, description }: { tag: string; status: string; name: string; description: string }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-6 items-center rounded-md border border-white/15 px-1.5 text-xs font-medium uppercase tracking-[0.1em] text-slate-200">
          {tag}
        </span>
        <StatusPill status={status} />
      </div>
      <h2 className="mt-2 text-xl font-semibold text-white sm:mt-3">{name}</h2>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">{description}</p>
    </>
  );
}

/** Code-defined radar (National / City-center); same card design as the database radars. */
function PreviewRadarSection({ radar, signedIn, children }: { radar: PreviewRadar; signedIn: boolean; children?: ReactNode }) {
  return (
    <section id={radar.slug} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <RadarHeader tag={radar.tag} status={radar.status} name={radar.name} description={radar.description} />
      <h3 className="mt-4 text-xs font-medium sm:mt-5 uppercase tracking-wider text-slate-300">Recent findings</h3>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {radar.findings.map((f) => (
          <article key={f.id} className="flex flex-col rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-300">Updated {PREVIEW_CHECKED}</span>
              <StatusPill status={f.severity} />
            </div>
            <div className="mt-3">
              <StatCard size="flat" label={f.stat.label} value={f.stat.value} hint={f.stat.hint} change={f.stat.change} />
            </div>
            <h4 className="mt-3 text-base font-medium leading-snug text-white">{f.title}</h4>
            <p className="mt-1 text-[14px] leading-[1.5] text-slate-200">{f.summary}</p>
            <p className="mt-2 text-[14px] leading-[1.5] text-slate-200">
              <span className="font-medium text-white">For capital: </span>
              {f.capital}
            </p>
            <div className="mt-auto pt-3 sm:pt-4">
              <div className="border-t border-white/10 pt-3">
                <SourceList items={f.sources} />
              </div>
            </div>
          </article>
        ))}
      </div>
      {children}
      <RadarFooter chatHref={`/chat?${new URLSearchParams({ q: radar.chatQuestion }).toString()}`} signedIn={signedIn} />
    </section>
  );
}

const CITY_COLS: { key: keyof Pick<CityRow, "metro" | "other" | "distress" | "trades" | "labor">; label: string }[] = [
  { key: "metro", label: "Metro, Q2 2026" },
  { key: "other", label: "Downtown and other reads" },
  { key: "distress", label: "Debt and distress" },
  { key: "trades", label: "Trades" },
  { key: "labor", label: "Labor" },
];

function CityTable({ rows, sources }: { rows: CityRow[]; sources: PreviewSource[] }) {
  return (
    <div className="mt-6 border-t border-white/10 pt-4 sm:mt-7">
      <h3 className="text-xs font-medium uppercase tracking-wider text-slate-300">Cities we track</h3>
      <p className="mt-2 max-w-3xl text-[13px] leading-relaxed text-slate-300">{CITY_TABLE_NOTE}</p>

      {/* Desktop: table */}
      <div className="mt-4 hidden lg:block">
        <table className="w-full table-fixed border-collapse text-left text-[13px] leading-snug">
          <caption className="sr-only">City-center coverage: metro performance, distress, trades and labor by city</caption>
          <colgroup>
            <col className="w-[11%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[21%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/15 text-xs uppercase tracking-wider text-slate-300">
              <th scope="col" className="py-2 pr-3 font-medium">City</th>
              {CITY_COLS.map((c) => (
                <th key={c.key} scope="col" className="py-2 pr-3 font-medium">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.city} className="border-b border-white/10 align-top">
                <th scope="row" className="py-3 pr-3 font-medium text-white">
                  <div>{r.city}</div>
                  <div className="mt-1.5"><StatusPill status={r.status} /></div>
                  <div className="mt-1.5 text-xs font-normal text-slate-300">Coverage: {r.coverage}</div>
                </th>
                {CITY_COLS.map((c) => (
                  <td key={c.key} className="py-3 pr-3 text-slate-200">{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile and tablet: stacked rows */}
      <ul className="mt-4 space-y-3 lg:hidden">
        {rows.map((r) => (
          <li key={r.city} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-base font-medium text-white">{r.city}</span>
              <StatusPill status={r.status} />
            </div>
            <div className="mt-0.5 text-xs text-slate-300">Coverage: {r.coverage}</div>
            <dl className="mt-2 space-y-2 text-[13px] leading-snug">
              {CITY_COLS.map((c) => (
                <div key={c.key}>
                  <dt className="text-xs uppercase tracking-wider text-slate-300">{c.label}</dt>
                  <dd className="mt-0.5 text-slate-200">{r[c.key]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>

      <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-slate-200">{THIN_CITIES_LINE}</p>
      <div className="mt-3">
        <SourceList items={sources} title="Table sources" />
      </div>
    </div>
  );
}

export default async function RadarsPage() {
  const { userId } = await auth();
  const allRadars = await prisma.radar.findMany({
    orderBy: { name: "asc" },
    include: {
      findings: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });
  // Signed-out visitors only see radars with cited findings; empty radars and the run control are
  // for signed-in workspaces.
  const marketRadars = allRadars.filter((r) => !SUPERSEDED_RADAR_SLUGS.includes(r.slug));
  const radars = userId ? marketRadars : marketRadars.filter((r) => citedFindings(r.findings).length > 0);
  // National first, then City-center, then the market radars (preview-gated; see radars-preview.ts).
  const showNational = nationalRadarsVisible();

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h1 className="t-h1">Radars</h1>
          {userId ? (
            <RunRadarsButton />
          ) : (
            <Link
              href="/signup"
              className="shrink-0 rounded-md border border-white/25 px-3 py-1.5 text-sm font-medium text-slate-100 hover:border-white/50 hover:bg-white/5"
            >
              Get radar alerts
            </Link>
          )}
        </div>
        <p className="mt-2 max-w-2xl t-lead">
          Quiet monitors over the Capital Graph. Material, cited findings only, so you see what
          changed without a firehose.
        </p>
      </div>

      <div className="grid gap-6">
        {showNational ? <PreviewRadarSection radar={NATIONAL_RADAR} signedIn={!!userId} /> : null}
        {showNational ? (
          <PreviewRadarSection radar={CITY_CENTER_RADAR} signedIn={!!userId}>
            <CityTable rows={CITY_ROWS} sources={CITY_TABLE_SOURCES} />
          </PreviewRadarSection>
        ) : null}
        {radars.map((r) => {
          const findings = citedFindings(r.findings);
          const used = new Set<string>();
          const marketLabel = r.marketSlug ? marketName(r.marketSlug) : "National";
          return (
            <section key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <RadarHeader
                tag={r.marketSlug ? `Market · ${marketLabel}` : "National / cross-market"}
                status={r.status}
                name={r.name}
                description={scrubInternal(publicRadarDescription(r.description))}
              />

              <h3 className="mt-4 text-xs font-medium sm:mt-5 uppercase tracking-wider text-slate-300">Recent findings</h3>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {findings.map((f) => {
                  const stat = unverifiedFiguresIn(r.marketSlug, f.title).length
                    ? leadStat(r.marketSlug, f.title, "", used)
                    : leadStat(r.marketSlug, f.title, f.summary, used);
                  return (
                    <article key={f.id} className="flex flex-col rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-300">Updated {fmtDate(f.createdAt)}</span>
                        <StatusPill status={f.severity} />
                      </div>
                      {stat ? (
                        <div className="mt-3">
                          <StatCard size="flat" label={stat.label} value={stat.value} hint={stat.hint} change={stat.change} />
                        </div>
                      ) : null}
                      <h4 className="mt-3 text-base font-medium leading-snug text-white">{scrubInternal(f.title)}</h4>
                      <p className="mt-1 text-[14px] leading-[1.5] text-slate-200">{scrubInternal(f.summary)}</p>
                      <div className="mt-auto pt-3 sm:pt-4">
                        <div className="border-t border-white/10 pt-3">
                          <Sources label={f.sourceLabel} />
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!findings.length ? <p className="text-sm text-slate-300">No cited findings yet.</p> : null}
              </div>

              <RadarFooter
                chatHref={`/chat?${new URLSearchParams({
                  ...(r.marketSlug ? { market: r.marketSlug } : {}),
                  q: `What should an investor take from the ${r.name} findings${r.marketSlug ? ` for ${marketLabel}` : ""}?`,
                }).toString()}`}
                marketSlug={r.marketSlug}
                marketLabel={marketLabel}
                signedIn={!!userId}
              />
            </section>
          );
        })}
      </div>
    </div>
  );
}
