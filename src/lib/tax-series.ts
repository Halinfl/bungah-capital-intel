/**
 * Hotel-tax collection series (one signal per published period, ids tax-<slug>-<yyyymm>-<series>).
 * The yyyymm period end in the id is the newest-first sort key; 000000 marks the market's gap note.
 */
type Row = { id: string };

const KEY = /^tax-.+?-(\d{6})-([a-z]+)(\d*)$/;

export function isTaxSeries(s: Row): boolean {
  return KEY.test(s.id);
}

export function taxPeriodKey(s: Row): number {
  return Number(s.id.match(KEY)?.[1] ?? 0);
}

/** Newest period first; within a period, monthly/quarterly before fiscal-year and cross-check rows. */
const SERIES_RANK: Record<string, number> = {
  m: 0,
  q: 0,
  sw: 1,
  city: 1,
  ytd: 1,
  cdt: 0,
  tdt: 1,
  fy: 2,
  swfy: 3,
  mc: 3,
  tx: 0,
  hf: 1,
  cy: 0,
  sco: 4,
  oth: 5,
};
export function sortTaxNewest<T extends Row>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const d = taxPeriodKey(b) - taxPeriodKey(a);
    if (d) return d;
    const sa = a.id.match(KEY)!,
      sb = b.id.match(KEY)!;
    return (
      (SERIES_RANK[sa[2]] ?? 9) - (SERIES_RANK[sb[2]] ?? 9) ||
      a.id.localeCompare(b.id)
    );
  });
}

/** Split a market's signals into (other signals, tax series newest first). */
export function splitTaxSeries<T extends Row>(
  rows: T[],
): { other: T[]; tax: T[] } {
  return {
    other: rows.filter((r) => !isTaxSeries(r)),
    tax: sortTaxNewest(rows.filter(isTaxSeries)),
  };
}
