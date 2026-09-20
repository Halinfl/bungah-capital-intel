import { prisma } from "@/lib/prisma";
import { ArtifactStudio } from "./ArtifactStudio";
import { SourceChip } from "@/components/SourceChip";
import { MarkdownLite } from "@/components/MarkdownLite";

export const dynamic = "force-dynamic";

export default async function ArtifactsPage({
  searchParams,
}: {
  searchParams: Promise<{ market?: string }>;
}) {
  const sp = await searchParams;
  const markets = await prisma.market.findMany({ orderBy: { name: "asc" } });
  const artifacts = await prisma.artifact.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { market: true },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Artifacts</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Generate IC one-pager markdown for a market from the Capital Graph. Propose-only —
          citations embedded.
        </p>
      </div>

      <ArtifactStudio
        markets={markets.map((m) => ({ slug: m.slug, name: m.name }))}
        initialSlug={sp.market ?? markets[0]?.slug ?? ""}
      />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Recent artifacts</h2>
        {artifacts.map((a) => (
          <article key={a.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-medium text-white">{a.title}</h3>
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
              <MarkdownLite text={a.markdown} />
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-300">
                Raw markdown
              </summary>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-black/40 p-3 text-[11px] text-slate-400">
                {a.markdown}
              </pre>
            </details>
          </article>
        ))}
        {!artifacts.length ? (
          <p className="text-sm text-slate-500">No artifacts yet — generate one above.</p>
        ) : null}
      </section>
    </div>
  );
}
