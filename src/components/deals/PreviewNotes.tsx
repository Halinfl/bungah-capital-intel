import Link from "next/link";
import { RUBRIC, fmtOverall, gradesFor, proposedAll, sales } from "@/lib/deals";

/**
 * PREVIEW ONLY (rendered when VERCEL_ENV !== "production"): the rubric v1.1 PROPOSED side-by-side and the open
 * questions for Hal. v1 is the live rubric; nothing here changes a grade.
 */
export function PreviewNotes() {
  const all = sales();
  const v1 = all.map((s) => ({ s, g: gradesFor(s.sale_id)[0] })).filter((x) => x.g);
  const insufficient = v1.filter((x) => x.g.overall === null).length;
  const changed = proposedAll()
    .filter((p) => p.changed_factors.length)
    .map((p) => {
      const s = all.find((x) => x.sale_id === p.sale_id)!;
      const g = gradesFor(p.sale_id)[0];
      const cur = g.factor_scores.find((r) => r.factor === "debt_context");
      const alt = p.factor_scores.find((r) => r.factor === "debt_context");
      return { s, g, p, cur, alt };
    });
  const th = "py-2 pr-3 font-medium";
  const td = "py-2 pr-3 align-top";
  return (
    <section aria-labelledby="preview-notes" className="space-y-4 rounded-xl border border-dashed border-white/30 p-4">
      <div className="space-y-1">
        <h2 id="preview-notes" className="text-xl font-semibold tracking-tight text-white">
          Preview notes for Hal
        </h2>
        <p className="text-[13px] text-slate-300">
          Shown on this preview only, not on bungah.io. Grades above use rubric {RUBRIC.rubric_version}, the live rubric. Decision support, not a
          recommendation. {v1.length} deals graded: {v1.length - insufficient} with an overall grade, {insufficient} &ldquo;
          {RUBRIC.missing_factor_rule.insufficient_label}&rdquo; (fewer than 3 of 5 factors graded).
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-white">Proposed v1.1 (not applied): distress only on documented triggers</h3>
        <p className="max-w-3xl text-[13px] text-slate-300">
          Triggers: foreclosure or receivership, a lender-directed sale or proceeds to the lender, an impairment tied by name to the hotel, or the
          company calling the sale distressed, dated on or before the announcement. A loss against book value or a prior price is cited context only.
          v1.1 doesn&rsquo;t say which band a trigger takes; below, a trigger is scored at v1&rsquo;s lender-negotiated band (2). Only the deals
          whose grade would change are listed.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-300">
              <tr className="border-b border-white/10">
                <th className={th}>Deal</th>
                <th className={th}>Debt/transaction, v1 → v1.1</th>
                <th className={th}>Overall, v1 → v1.1</th>
                <th className={th}>Why</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {changed.map(({ s, g, p, cur, alt }) => (
                <tr key={s.sale_id} className="border-b border-white/[0.06]">
                  <td className={td}>
                    <Link href={`/deals/${s.slug}`} className="underline decoration-white/30 underline-offset-2 hover:text-white">
                      {s.property}
                    </Link>
                    <span className="block text-[12px] text-slate-300">{s.log_id}</span>
                  </td>
                  <td className={`${td} tabular-nums`}>
                    {cur?.score ?? "n/a"} → {alt?.score ?? "n/a"}
                  </td>
                  <td className={`${td} tabular-nums`}>
                    {fmtOverall(g)} → {fmtOverall(p)}
                  </td>
                  <td className={`${td} text-[13px] text-slate-300`}>
                    {alt?.input_text}{" "}
                    {alt?.source_uri ? (
                      <a href={alt.source_uri} className="underline decoration-white/30 underline-offset-2 hover:text-white" rel="noopener" target="_blank">
                        source
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="max-w-3xl text-[13px] text-slate-300">
          Note on Embassy Suites Dulles: the v1.1 draft lists its ~$20.6M lender paydown as a trigger, but that paydown was first disclosed in the
          closing 8-K of Aug 27, 2026, after the Aug 12 announcement, so the side-by-side doesn&rsquo;t count it. If it counted, v1.1 would score that
          factor 2 and the overall would be 4.0 of 5.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-white">Questions for Hal</h3>
        <ol className="max-w-3xl list-[lower-alpha] space-y-2 pl-5 text-[14px] text-slate-200">
          <li>Adopt v1.1 for debt/transaction context (documented triggers only)? If yes, which band does each trigger take?</li>
          <li>
            Should a trailing 12 months ending August count for the cap rate? It affects the Four Seasons Scottsdale (printed after the announcement),
            The Bellmoor (8.6% at announcement) and The Hotel Zags (negative NOI). Under v1 all three are ungraded on the spread.
          </li>
          <li>
            Confirm the wording &ldquo;the last quarter-end whose results were public by the announcement date&rdquo; for the cap-rate period. The
            published v1 text says &ldquo;the last quarter before the announcement&rdquo;. They differ when a deal is announced after a quarter-end but
            before that quarter&rsquo;s results are out (for example The Bellmoor on Oct 8: Sep 30 vs Jun 30).
          </li>
          <li>
            Airlift and drive: rubric v1 has no airlift or drive factor and no weight for them, and their method is defined only in our working
            notes so far. They&rsquo;re shown on each deal page as cited context and don&rsquo;t enter any grade. Should they become a factor (with
            what weight and bands), feed demand, or stay context?
          </li>
        </ol>
      </div>
    </section>
  );
}
