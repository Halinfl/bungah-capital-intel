import { SourceChip } from "@/components/SourceChip";
import { callCiteLabel, fmtDate, fmtQuarter, type QuarterCall } from "@/lib/reits";

/**
 * One REIT's latest earnings call in a few plain, cited sentences: results, guidance, deals and capital,
 * the company's stated reasons, and the outlook. Every line carries its source chip (release, 10-Q or call).
 */
export function QuarterCallCard({ call }: { call: QuarterCall }) {
  const q = fmtQuarter(call.quarter);
  return (
    <section id="latest-call" aria-labelledby="latest-call-h" className="scroll-mt-24 space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id="latest-call-h" className="text-lg font-semibold text-white">
          {q} {call.callDate ? "call" : "results"}
        </h2>
        <span className="text-xs text-slate-300">
          {call.callDate ? `Call held ${fmtDate(call.callDate, { year: true })}` : "Results release only; no call held"}
        </span>
      </div>
      <dl className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        {call.items.map((i) => (
          <div key={i.label} className="space-y-1.5">
            <dt className="text-[12px] font-medium uppercase tracking-wider text-slate-300">{i.label}</dt>
            <dd className="space-y-1.5">
              <p className="text-[15px] leading-relaxed text-slate-100">{i.text}</p>
              <SourceChip label={callCiteLabel(call, i.cite)} />
            </dd>
          </div>
        ))}
        {call.quote ? (
          <div className="space-y-1.5 border-t border-white/10 pt-4">
            <dt className="text-[12px] font-medium uppercase tracking-wider text-slate-300">
              {call.quote.cite === "call" ? "From the call" : "From the release"}
            </dt>
            <dd className="space-y-1.5">
              <blockquote className="border-l-2 border-emerald-300/60 pl-3 text-[15px] italic leading-relaxed text-slate-100">
                “{/^[a-z]/.test(call.quote.text) ? "…" : ""}{call.quote.text}”
              </blockquote>
              <p className="text-[13px] text-slate-300">{call.quote.speaker}</p>
              <SourceChip label={callCiteLabel(call, [call.quote.cite])} />
            </dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}
