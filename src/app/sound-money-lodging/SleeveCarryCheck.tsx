"use client";

import { useState } from "react";
import { sleeve } from "@/lib/sleeve-math";
import { CalcField, num, pct, usd, xx } from "./CalcField";

const DY_LABEL = {
  pass: "at or above the 10% floor",
  "below-floor": "below the 10% floor",
  flag: "flag: at or below 9%",
} as const;

const DY_TONE = {
  pass: "text-emerald-300",
  "below-floor": "text-amber-300",
  flag: "text-rose-300",
} as const;

/** Sleeve carry check: blank inputs, formulas shown, nothing stored. */
export function SleeveCarryCheck() {
  const [f, setF] = useState({
    noi: "",
    loan: "",
    btc: "",
    rate: "",
    amort: "",
    value: "",
    hold: "",
    share: "",
  });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const noi = num(f.noi);
  const loan = num(f.loan);
  const btc = num(f.btc);
  const rate = num(f.rate);
  const ready =
    noi !== null && noi > 0 && loan !== null && loan > 0 && btc !== null && btc >= 0 &&
    btc < loan && rate !== null && rate > 0;

  const out = ready
    ? sleeve({
        noi: noi!,
        loan: loan!,
        btc: btc!,
        rate: rate! / 100,
        amortYears: num(f.amort) ?? undefined,
        value: num(f.value) ?? undefined,
        holdYears: num(f.hold) ?? undefined,
        borrowerShare: num(f.share) !== null ? num(f.share)! / 100 : undefined,
      })
    : null;

  return (
    <div id="sleeve-carry-check" className="scroll-mt-24 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
      <h3 className="text-base font-medium text-white">Sleeve carry check</h3>
      <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-300">
        See what the BTC sleeve costs in coverage before it earns anything. Enter your own figures;
        nothing is pre-filled and nothing is saved.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CalcField id="scc-noi" label="Hotel NOI (annual, USD)" hint="Normalized, after management and franchise fees, FF&E reserve and full staffing." value={f.noi} onChange={set("noi")} />
        <CalcField id="scc-loan" label="Total loan (USD)" hint="The whole balance, including the dollars that buy BTC." value={f.loan} onChange={set("loan")} />
        <CalcField id="scc-btc" label="Loan dollars to BTC (USD)" hint="The BTC sleeve funded by the loan. Enter 0 for none." value={f.btc} onChange={set("btc")} />
        <CalcField id="scc-rate" label="Coupon" hint="Your quoted rate." value={f.rate} onChange={set("rate")} suffix="%" />
        <CalcField id="scc-amort" label="Amortization (years, optional)" hint="Leave blank for interest-only only." value={f.amort} onChange={set("amort")} />
        <CalcField id="scc-value" label="Hotel value (USD, optional)" hint="For LTV on the hotel alone." value={f.value} onChange={set("value")} />
        <CalcField id="scc-hold" label="Years held (optional)" hint="For the breakeven growth rate." value={f.hold} onChange={set("hold")} />
        <CalcField id="scc-share" label="Your share of BTC gain at exit (optional)" hint="From your term sheet." value={f.share} onChange={set("share")} suffix="%" />
      </div>

      {out ? (
        <dl data-testid="scc-results" className="mt-5 grid gap-3 border-t border-white/[0.06] pt-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-400">Debt yield, BTC excluded</dt>
            <dd data-testid="scc-dy" className={`font-medium ${DY_TONE[out.dyStatus]}`}>
              {pct(out.debtYield, 2)} · {DY_LABEL[out.dyStatus]}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-400">DSCR, interest-only</dt>
            <dd data-testid="scc-dscr-io" className={`font-medium ${out.dscrIO < 1 ? "text-rose-300" : "text-slate-200"}`}>
              {xx(out.dscrIO)}
              {out.dscrIOWithoutSleeve !== null ? (
                <span className="text-slate-400"> · {xx(out.dscrIOWithoutSleeve)} without the sleeve</span>
              ) : null}
            </dd>
          </div>
          {out.dscrAmort !== null ? (
            <div>
              <dt className="text-xs text-slate-400">DSCR, amortizing</dt>
              <dd data-testid="scc-dscr-am" className={`font-medium ${out.dscrAmort < 1 ? "text-rose-300" : "text-slate-200"}`}>
                {xx(out.dscrAmort)}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="text-xs text-slate-400">Yearly cost of the sleeve</dt>
            <dd data-testid="scc-carry" className="font-medium text-slate-200">
              {usd(out.btcCarry)} · {pct(out.btcCarryShareOfNoi)} of NOI
            </dd>
          </div>
          {out.ltv !== null ? (
            <div>
              <dt className="text-xs text-slate-400">LTV, hotel alone</dt>
              <dd data-testid="scc-ltv" className="font-medium text-slate-200">{pct(out.ltv)}</dd>
            </div>
          ) : null}
          {out.breakevenCagr !== null ? (
            <div>
              <dt className="text-xs text-slate-400">BTC growth needed to cover the cost</dt>
              <dd data-testid="scc-breakeven" className="font-medium text-slate-200">
                {pct(out.breakevenCagr)} a year
              </dd>
            </div>
          ) : null}
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-xs text-slate-400">Refinance on hotel NOI alone</dt>
            <dd data-testid="scc-stress" className="mt-1 flex flex-wrap gap-2">
              {out.stress.map((s) => (
                <span key={s.cut} className={`rounded-md border border-white/10 px-2 py-1 text-xs ${DY_TONE[s.dyStatus]}`}>
                  NOI −{Math.round(s.cut * 100)}%: DY {pct(s.debtYield, 1)}
                </span>
              ))}
            </dd>
          </div>
          {out.dyStatus !== "pass" || out.dscrIO < 1 ? (
            <p className="text-xs text-rose-300 sm:col-span-2 lg:col-span-3">
              This loan does not clear on the hotel alone. BTC does not cure a debt yield or DSCR
              shortfall.
            </p>
          ) : null}
        </dl>
      ) : (
        <p className="mt-5 border-t border-white/[0.06] pt-4 text-xs text-slate-400">
          Enter NOI, total loan, loan dollars to BTC and coupon to see results.
        </p>
      )}

      <div className="mt-4 space-y-1 text-xs leading-relaxed text-slate-400">
        <p>
          Formulas: debt yield = NOI ÷ total loan (BTC dollars count, BTC value does not) · DSCR
          interest-only = NOI ÷ (loan × coupon) · DSCR amortizing = NOI ÷ (loan × mortgage
          constant, monthly pay) · yearly sleeve cost = BTC dollars × coupon · breakeven growth g
          solves share × ((1 + g)^years − 1) = coupon × years (ignores fees, taxes and time
          value).
        </p>
        <p>
          Debt yield: 10% is the floor; at or below 9% is flagged. DSCR is shown as a value.
          Reference only: a hotel CMBS broker lists minimum DSCR of about 1.35x–1.40x by segment
          (
          <a
            href="https://peersense.com/cmbs-loans/hotel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            PeerSense, Jul 2026
          </a>
          ). Your lender&apos;s terms govern.
        </p>
      </div>
    </div>
  );
}
