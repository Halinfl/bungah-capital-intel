import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { cleanSourceLabel, scrubInternal } from "@/lib/public-text";
import { citedFindings, publicRadarDescription } from "@/lib/format";
import { leadStat, sourceUrlFor, unverifiedFiguresIn } from "@/lib/radar-stats";
import { RunRadarsButton } from "./RunRadarsButton";

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
  return (
    <details className="group text-xs text-slate-200">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded text-slate-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 [&::-webkit-details-marker]:hidden">
        <span aria-hidden="true" className="transition-transform group-open:rotate-90">›</span>
        Sources ({parts.length})
      </summary>
      <ul className="mt-2 space-y-1 border-l border-white/10 pl-3 leading-snug">
        {parts.map((p, i) => {
          const url = sourceUrlFor(p);
          return (
            <li key={i}>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline-offset-2 hover:underline">
                  {p} ↗
                </a>
              ) : (
                p
              )}
            </li>
          );
        })}
      </ul>
    </details>
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
  const radars = userId ? allRadars : allRadars.filter((r) => citedFindings(r.findings).length > 0);

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
        {radars.map((r) => {
          const findings = citedFindings(r.findings);
          const used = new Set<string>();
          const marketLabel = r.marketSlug ? marketName(r.marketSlug) : "National";
          return (
            <section key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex h-6 items-center rounded-md border border-white/15 px-1.5 text-xs font-medium uppercase tracking-[0.1em] text-slate-200">
                  {r.marketSlug ? `Market · ${marketLabel}` : "National / cross-market"}
                </span>
                <StatusPill status={r.status} />
              </div>
              <h2 className="mt-2 text-xl font-semibold text-white sm:mt-3">{r.name}</h2>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">
                {scrubInternal(publicRadarDescription(r.description))}
              </p>

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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {r.marketSlug ? (
                    <Link href={`/markets/${r.marketSlug}`} className="font-medium text-emerald-300 hover:underline">
                      {marketLabel} market page →
                    </Link>
                  ) : null}
                  <Link
                    href={`/chat?${new URLSearchParams({
                      ...(r.marketSlug ? { market: r.marketSlug } : {}),
                      q: `What should an investor take from the ${r.name} findings${r.marketSlug ? ` for ${marketLabel}` : ""}?`,
                    }).toString()}`}
                    className="font-medium text-emerald-300 hover:underline"
                  >
                    Ask Chat about this
                  </Link>
                </div>
                {!userId ? (
                  <Link
                    href="/signup"
                    className="rounded-md border border-white/25 px-2.5 py-1 text-xs font-medium text-slate-100 hover:border-white/50 hover:bg-white/5"
                  >
                    Get alerts for this radar
                  </Link>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
