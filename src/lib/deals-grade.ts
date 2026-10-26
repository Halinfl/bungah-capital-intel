/**
 * Recent Deals grader. Pure, deterministic, no I/O: reads a rubric (rubric-v1.json) and one deal's inputs,
 * returns factor scores, coverage, the overall score (or none) and the mechanical output line.
 * Used by scripts/deals/grade.ts. Pages only render what that script wrote to sale_grades.json.
 */

export type Threshold = { score: number; min?: number; max?: number; min_inclusive?: boolean; max_inclusive?: boolean };
export type RubricBand = { score: number; text: string; set_by: string; rule?: string; category?: string };
export type RubricFactor = {
  id: FactorId;
  label: string;
  weight: number;
  metric: string;
  metric_definition: string;
  unit: string;
  bands: RubricBand[];
  cuts?: { direction: string; thresholds: Threshold[] };
};
export type Rubric = {
  rubric_version: string;
  status: string;
  drafted_on: string;
  scale: { min: number; max: number };
  factors: RubricFactor[];
  missing_factor_rule: { text: string; min_factors_graded: number; insufficient_label: string; ungraded_label: string };
  overall: { method: string; rounding: string; display: string };
  no_look_ahead_rule: { text: string; anchor: string };
  inclusion_rule: { text: string; tracked_reits: string[]; price_threshold_usd: number };
  output_template: { text: string; ungraded_replacement: string; ungraded_spread: string };
  versioning: string;
  disclaimer: string;
};

export type FactorId = "replacement_cost" | "spread" | "supply" | "demand" | "debt_context";

type Common = { as_of: string; source_uri: string; source_label?: string; note?: string };
/** One factor's input. Omit a factor, or pass { missing: reason }, to leave it ungraded. */
export type FactorInput =
  | { missing: string }
  | (Common & { price_per_key: number; replacement_cost_per_key: number; replacement_basis: string })
  | (Common & { cap_rate_pct: number; cap_rate_basis: string; treasury_10y_pct: number; treasury_as_of: string; treasury_source_uri: string })
  | (Common & { pipeline_pct_of_rooms: number; pipeline_definition: string })
  | (Common & { tax_receipts_yoy_pct: number; period: string })
  | (Common & { category: string });

export type DealInputs = {
  /** true for local test fixtures. The script refuses to write fixture grades into public data. */
  fixture?: boolean;
  sale_id: string;
  announced_on: string; // YYYY-MM-DD, the no-look-ahead anchor
  factors: Partial<Record<FactorId, FactorInput>>;
};

export type FactorResult = {
  factor: FactorId;
  weight: number;
  graded: boolean;
  score: number | null;
  value: number | string | null;
  input_text: string | null;
  band_text: string | null;
  effective_weight: number | null;
  reason: string | null;
  as_of: string | null;
  source_uri: string | null;
};

export type GradeResult = {
  sale_id: string;
  rubric_version: string;
  graded_on: string;
  public_data_as_of: string;
  factor_scores: FactorResult[];
  factors_graded: number;
  factors_total: number;
  overall: number | null;
  overall_label: string;
  output_text: string;
};

const isDate = (s: unknown) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
const round1 = (x: number) => Math.round(x * 10) / 10;

export function scoreFromCuts(value: number, thresholds: Threshold[]): number | null {
  for (const t of thresholds) {
    const okMin = t.min === undefined || (t.min_inclusive ? value >= t.min : value > t.min);
    const okMax = t.max === undefined || (t.max_inclusive ? value <= t.max : value < t.max);
    if (okMin && okMax) return t.score;
  }
  return null;
}

const usdK = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2).replace(/0$/, "")}M` : `$${Math.round(n / 1000).toLocaleString("en-US")}k`;

function measure(f: RubricFactor, inp: FactorInput): { value: number | string; text: string } | { error: string } {
  const a = inp as Record<string, unknown>;
  const num = (k: string) => (typeof a[k] === "number" && Number.isFinite(a[k]) ? (a[k] as number) : null);
  switch (f.id) {
    case "replacement_cost": {
      const p = num("price_per_key"), r = num("replacement_cost_per_key");
      if (p === null || r === null || r <= 0) return { error: "Missing price per key or replacement cost per key." };
      const prem = ((p - r) / r) * 100;
      const pct = Math.round(Math.abs(prem));
      const dir = prem < 0 ? "below" : "above";
      return { value: round1(prem), text: `${usdK(p)}/key vs ${usdK(r)} replacement (${a.replacement_basis}); ${pct}% ${dir}` };
    }
    case "spread": {
      const c = num("cap_rate_pct"), t = num("treasury_10y_pct");
      if (c === null) return { error: "No cap rate or NOI disclosed." };
      if (t === null) return { error: "Missing 10-year yield." };
      if (!isDate(a.treasury_as_of) || !a.treasury_source_uri) return { error: "10-year yield lacks a date or source." };
      const bp = Math.round((c - t) * 100);
      return { value: bp, text: `${c.toFixed(2)}% cap rate (${a.cap_rate_basis}) vs ${t.toFixed(2)}% 10-year on ${a.treasury_as_of}; ${bp}bp` };
    }
    case "supply": {
      const v = num("pipeline_pct_of_rooms");
      if (v === null) return { error: "Missing pipeline share of rooms." };
      return { value: v, text: `Pipeline ${v}% of existing rooms (${a.pipeline_definition})` };
    }
    case "demand": {
      const v = num("tax_receipts_yoy_pct");
      if (v === null) return { error: "Missing tax receipts change." };
      return { value: v, text: `Lodging tax receipts ${v > 0 ? "+" : ""}${v}% YoY (${a.period})` };
    }
    case "debt_context": {
      const cat = a.category;
      if (typeof cat !== "string" || !f.bands.some((b) => b.category === cat)) return { error: "Unknown or missing context category." };
      return { value: cat, text: f.bands.find((b) => b.category === cat)!.text };
    }
  }
}

export function gradeDeal(rubric: Rubric, inputs: DealInputs, gradedOn: string): GradeResult {
  if (!isDate(inputs.announced_on)) throw new Error("announced_on must be YYYY-MM-DD");
  const anchor = inputs.announced_on;
  const rows: FactorResult[] = rubric.factors.map((f) => {
    const base = { factor: f.id, weight: f.weight, effective_weight: null, score: null, value: null, input_text: null, band_text: null, as_of: null, source_uri: null };
    const inp = inputs.factors[f.id];
    if (!inp) return { ...base, graded: false, reason: "No public input yet." };
    if ("missing" in inp) return { ...base, graded: false, reason: inp.missing };
    const c = inp as Common;
    if (!isDate(c.as_of)) return { ...base, graded: false, reason: "Input has no publication date." };
    if (!c.source_uri) return { ...base, graded: false, reason: "Input has no source." };
    // No look-ahead: every dated input must be public on or before the announcement.
    const dates = [c.as_of, (inp as { treasury_as_of?: string }).treasury_as_of].filter(Boolean) as string[];
    if (dates.some((d) => d > anchor)) {
      return { ...base, as_of: c.as_of, source_uri: c.source_uri, graded: false, reason: `Input dated after the announcement (${anchor}); not used.` };
    }
    const m = measure(f, inp);
    if ("error" in m) return { ...base, as_of: c.as_of, source_uri: c.source_uri, graded: false, reason: m.error };
    const score =
      f.id === "debt_context"
        ? f.bands.find((b) => b.category === m.value)!.score
        : scoreFromCuts(m.value as number, f.cuts!.thresholds);
    if (score === null) return { ...base, graded: false, reason: "Value fell outside every band." };
    const band = f.bands.find((b) => b.score === score)!;
    return { ...base, graded: true, score, value: m.value, input_text: m.text, band_text: `${score} = ${band.text}`, as_of: c.as_of, source_uri: c.source_uri, reason: null };
  });

  const graded = rows.filter((r) => r.graded);
  const wSum = graded.reduce((s, r) => s + r.weight, 0);
  for (const r of graded) r.effective_weight = Math.round((r.weight / wSum) * 1000) / 1000;
  const enough = graded.length >= rubric.missing_factor_rule.min_factors_graded;
  const overall = enough ? round1(graded.reduce((s, r) => s + (r.score as number) * (r.weight / wSum), 0)) : null;

  const rep = rows.find((r) => r.factor === "replacement_cost")!;
  const spr = rows.find((r) => r.factor === "spread")!;
  const repText = rep.graded
    ? (rep.value as number) === 0
      ? "Underwritten at replacement cost"
      : `Underwritten at a ${Math.round(Math.abs(rep.value as number))}% ${(rep.value as number) < 0 ? "discount" : "premium"} to replacement`
    : `Underwritten with ${rubric.output_template.ungraded_replacement}`;
  const sprText = spr.graded ? `with a ${spr.value}bp spread` : spr.reason === "No cap rate or NOI disclosed." ? rubric.output_template.ungraded_spread : "spread not graded";
  const coverage = `${graded.length} of ${rows.length} factors graded`;
  const output_text = `${repText} ${spr.graded ? sprText : `; ${sprText}`}; ${coverage}${enough ? "" : `; ${rubric.missing_factor_rule.insufficient_label.toLowerCase()}`}.`.replace(" ;", ";");

  const asOfDates = graded.map((r) => r.as_of as string).sort();
  return {
    sale_id: inputs.sale_id,
    rubric_version: rubric.rubric_version,
    graded_on: gradedOn,
    public_data_as_of: asOfDates.length ? asOfDates[asOfDates.length - 1] : anchor,
    factor_scores: rows,
    factors_graded: graded.length,
    factors_total: rows.length,
    overall,
    overall_label: enough ? `${overall!.toFixed(1)} / ${rubric.scale.max}` : rubric.missing_factor_rule.insufficient_label,
    output_text,
  };
}
