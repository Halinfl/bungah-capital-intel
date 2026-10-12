import { prisma } from "@/lib/prisma";
import { SourceChip } from "@/components/SourceChip";
import { SignalCard } from "@/components/SignalCard";
import { SourceNote } from "@/components/SourceNote";
import { URL_RE, isOriginalUrl } from "@/lib/source-links";
import { scrubInternal } from "@/lib/public-text";
import { severityClass, citedFindings, publicRadarDescription } from "@/lib/format";
import { RunRadarsButton } from "./RunRadarsButton";

export const dynamic = "force-dynamic";

export default async function RadarsPage() {
  const radars = await prisma.radar.findMany({
    orderBy: { name: "asc" },
    include: {
      findings: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Radars</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Plain-language monitors over the Capital Graph. Findings are decision support — no auto capital
            actions.
          </p>
        </div>
        <RunRadarsButton />
      </div>

      <div className="grid gap-6">
        {radars.map((r) => (
          <section key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{r.name}</h2>
                <p className="mt-1 text-sm text-slate-400">{scrubInternal(publicRadarDescription(r.description))}</p>
              </div>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                {r.status}
              </span>
            </div>
            {r.marketSlug ? (
              <p className="mt-2 text-xs text-slate-500">Market focus: {r.marketSlug}</p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">National / cross-market</p>
            )}

            <h3 className="mt-5 text-xs font-medium uppercase tracking-wider text-slate-500">
              Recent findings
            </h3>
            <div className="mt-2 space-y-2">
              {citedFindings(r.findings).map((f) => {
                const u = f.sourceLabel.match(URL_RE)?.[0];
                return (
                  <SignalCard
                    key={f.id}
                    primaryUrl={u && isOriginalUrl(u) ? u : null}
                    tone={severityClass(f.severity)}
                    title={scrubInternal(f.title)}
                    meta={<span className="text-[11px] uppercase tracking-wider opacity-80">{f.severity}</span>}
                  >
                    <p className="mt-1 text-sm opacity-90">{scrubInternal(f.summary)}</p>
                    <div className="mt-2">
                      {u && isOriginalUrl(u) ? <SourceChip label={f.sourceLabel} /> : <SourceNote label={f.sourceLabel} />}
                    </div>
                  </SignalCard>
                );
              })}
              {!citedFindings(r.findings).length ? (
                <p className="text-sm text-slate-500">No findings yet — run radars.</p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
