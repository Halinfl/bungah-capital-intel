export default function PodcastPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Relationship engine
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Podcast</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
          Conversations with people who move hospitality capital — not influencer travel chat.
          Episode hub coming; companion briefs will land here beside the Capital Graph.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10 text-center text-sm text-slate-500">
        No episodes published yet. Cadence stays quiet on purpose.
      </div>
    </div>
  );
}
