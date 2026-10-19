/**
 * Pure formulas for the Sound Asset Lodging calculators.
 * No defaults, no market data: every input comes from the user.
 */

/** Annual mortgage constant for a fully amortizing loan (monthly pay). */
export function mortgageConstant(annualRate: number, years: number): number {
  const m = annualRate / 12;
  const n = years * 12;
  if (m === 0) return 1 / years;
  return (12 * m) / (1 - Math.pow(1 + m, -n));
}

export type SleeveInputs = {
  noi: number; // normalized annual NOI, USD
  loan: number; // total loan balance, USD (includes dollars that bought BTC)
  btc: number; // loan dollars used to buy BTC, USD
  rate: number; // coupon, decimal (0.08 = 8%)
  amortYears?: number; // optional, for amortizing DSCR
  value?: number; // optional hotel value, USD, for LTV
  holdYears?: number; // optional, for breakeven
  borrowerShare?: number; // optional, decimal share of BTC gain the borrower keeps at exit
};

export type SleeveOutputs = {
  debtYield: number;
  dyStatus: "pass" | "below-floor" | "flag";
  dscrIO: number;
  dscrAmort: number | null;
  dscrIOWithoutSleeve: number | null;
  btcCarry: number;
  btcCarryShareOfNoi: number;
  ltv: number | null;
  breakevenCagr: number | null;
  stress: { cut: number; debtYield: number; dyStatus: SleeveOutputs["dyStatus"] }[];
};

export function dyStatus(dy: number): SleeveOutputs["dyStatus"] {
  // Compare at the displayed precision (two decimals of a percent) so 9.00% always flags.
  const r = Math.round(dy * 10000) / 10000;
  if (r <= 0.09) return "flag";
  if (r < 0.1) return "below-floor";
  return "pass";
}

export function sleeve(i: SleeveInputs): SleeveOutputs {
  const dy = i.noi / i.loan;
  const dsIO = i.loan * i.rate;
  const dscrAmort =
    i.amortYears && i.amortYears > 0
      ? i.noi / (i.loan * mortgageConstant(i.rate, i.amortYears))
      : null;
  const loanNoSleeve = i.loan - i.btc;
  const btcCarry = i.btc * i.rate;
  // Breakeven: s * B0 * ((1+g)^N - 1) = B0 * r * N  =>  g = (1 + rN/s)^(1/N) - 1
  let breakevenCagr: number | null = null;
  if (i.holdYears && i.holdYears > 0 && i.borrowerShare && i.borrowerShare > 0 && i.btc > 0) {
    breakevenCagr =
      Math.pow(1 + (i.rate * i.holdYears) / i.borrowerShare, 1 / i.holdYears) - 1;
  }
  return {
    debtYield: dy,
    dyStatus: dyStatus(dy),
    dscrIO: i.noi / dsIO,
    dscrAmort,
    dscrIOWithoutSleeve: loanNoSleeve > 0 && i.btc > 0 ? i.noi / (loanNoSleeve * i.rate) : null,
    btcCarry,
    btcCarryShareOfNoi: btcCarry / i.noi,
    ltv: i.value && i.value > 0 ? i.loan / i.value : null,
    breakevenCagr,
    stress: [0.1, 0.2, 0.3].map((cut) => {
      const d = (i.noi * (1 - cut)) / i.loan;
      return { cut, debtYield: d, dyStatus: dyStatus(d) };
    }),
  };
}

export type RentInputs = {
  noi: number;
  rent: number; // current annual ground rent
  escalator: number; // decimal per year
  noiGrowth?: number; // decimal per year, optional (0 if blank)
};

export function rentCoverage(i: RentInputs, years = [1, 10, 20, 30]) {
  const g = i.noiGrowth ?? 0;
  return years.map((y) => {
    const rent = i.rent * Math.pow(1 + i.escalator, y - 1);
    const noi = i.noi * Math.pow(1 + g, y - 1);
    return { year: y, rent, coverage: noi / rent, coverageStressed: (noi * 0.8) / rent };
  });
}
