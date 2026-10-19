"use client";

import { useState } from "react";
import { rentCoverage } from "@/lib/sleeve-math";
import { CalcField, num, usd, xx } from "./CalcField";

/** Ground rent coverage: blank inputs, 30-year escalation, nothing stored. */
export function GroundRentCoverage() {
  const [f, setF] = useState({ noi: "", rent: "", esc: "", growth: "" });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const noi = num(f.noi);
  const rent = num(f.rent);
  const esc = num(f.esc);
  const ready = noi !== null && noi > 0 && rent !== null && rent > 0 && esc !== null && esc >= 0;
  const rows = ready
    ? rentCoverage({ noi: noi!, rent: rent!, escalator: esc! / 100, noiGrowth: (num(f.growth) ?? 0) / 100 })
    : null;

  return (
    <div id="ground-rent-coverage" className="scroll-mt-24 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="text-base font-medium text-white">Ground rent coverage</h3>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-400">
        Escalate the rent 30 years against your NOI, flat or growing, and a 20% NOI cut.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CalcField id="grc-noi" label="Hotel NOI before ground rent (USD)" hint="Normalized annual NOI." value={f.noi} onChange={set("noi")} />
        <CalcField id="grc-rent" label="Year-1 ground rent (USD)" hint="Your current or proposed rent." value={f.rent} onChange={set("rent")} />
        <CalcField id="grc-esc" label="Rent escalator" hint="Fixed annual step from the lease." value={f.esc} onChange={set("esc")} suffix="%/yr" />
        <CalcField id="grc-growth" label="NOI growth (optional)" hint="Blank = flat NOI." value={f.growth} onChange={set("growth")} suffix="%/yr" />
      </div>
      {rows ? (
        <table data-testid="grc-results" className="mt-5 w-full border-t border-white/[0.06] text-left text-sm">
          <thead className="text-xs text-slate-500">
            <tr>
              <th className="py-2 font-normal">Lease year</th>
              <th className="py-2 font-normal">Ground rent</th>
              <th className="py-2 font-normal">Coverage</th>
              <th className="py-2 font-normal">Coverage, NOI −20%</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {rows.map((r) => (
              <tr key={r.year} className="border-t border-white/[0.04]">
                <td className="py-1.5">{r.year}</td>
                <td className="py-1.5">{usd(r.rent)}</td>
                <td className="py-1.5">{xx(r.coverage)}</td>
                <td className={`py-1.5 ${r.coverageStressed < 1 ? "text-rose-300" : ""}`}>{xx(r.coverageStressed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-slate-500">
          Enter NOI, year-1 rent and escalator to see results.
        </p>
      )}
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Formulas: rent in year t = year-1 rent × (1 + escalator)^(t − 1) · NOI in year t = NOI ×
        (1 + growth)^(t − 1) · coverage = NOI ÷ rent. CPI or fair-market resets are not modeled.
        Coverage before debt service; your lender sizes on NOI after ground rent.
      </p>
    </div>
  );
}
