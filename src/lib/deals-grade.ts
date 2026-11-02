/**
 * Recent Deals grader. Pure, deterministic, no I/O: reads a rubric (rubric-v1.json or rubric-v1.1.json) and one deal's inputs,
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
  basis_rule?: {
    cap_rate_basis?: string;
    /** v1.1: every basis that qualifies (month-end TTM before announcement includes the quarter-end basis). */
    accepted_cap_rate_bases?: string[];
    /** v1.1: a company's published NOI definition may be applied to its published hotel EBITDA. */
    company_noi_definition?: { allowed: boolean; label: string };
    treasury_date?: string;
    statistic?: string;
    land?: string;
    /** v1.1: "first_confirmed_price" lets price per key use the first confirmed price when only a range was public. */
    price_range_rule?: string;
  };
  measure_rule?: { primary: string; fallback: string };
  source_rule?: { single_source_required: boolean; required_stage: string; net_of_closures?: boolean };
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
  changelog?: { version: string; date: string; line: string }[];
};

export type FactorId = "replacement_cost" | "spread" | "supply" | "demand" | "debt_context";

/** `cite_id` points at src/data/deals/citations.json; pages render the citation (and any data credit) from there. */
export type AlsoSource = { label: string; url: string; date: string; cite_id?: string };
/**
 * Shared fields. `also_sources` lists every further public source behind the factor's numbers (e.g. the filing that
 * gives the price, or the Treasury file); each must be dated on or before the announcement. `label` is a short tag
 * printed with the input (e.g. "preliminary", "NOI unaudited, seller-provided").
 */
type Common = { as_of: string; source_uri: string; source_label?: string; note?: string; also_sources?: AlsoSource[]; label?: string };
/** One factor's input. Omit a factor, or pass { missing: reason }, to leave it ungraded. */
export type FactorInput =
  | { missing: string }
  | (Common & {
      price_per_key: number;
      replacement_cost_per_key?: number;
      replacement_basis: string;
      total_keys?: number;
      components?: { label: string; hvs_class: string; keys: number; median_per_key: number }[];
      /** v1.1 price-range rule: the range public at announcement, and the date the price was first confirmed. */
      price_range_at_announcement?: string;
      price_confirmed_on?: string;
    })
  | (Common & {
      cap_rate_pct?: number;
      cap_rate_basis: string;
      cap_rate_period_end: string;
      results_public_note?: string;
      treasury_10y_pct: number;
      treasury_as_of: string;
      treasury_source_uri: string;
      /** v1.1: cap rate computed by applying the company's published NOI definition to its published hotel EBITDA. */
      noi_calc?: NoiCalc;
    })
  | (Common & {
      pipeline_pct_of_rooms: number;
      pipeline_definition: string;
      single_source: boolean;
      stage: string;
      net_of_closures?: boolean;
      /** The source lists closures but not their room count: the pipeline is graded gross and the entry says so. */
      closures_unquantified?: string;
      /** The share (and any total) is our arithmetic on the source's figures. */
      our_calculation?: boolean;
    })
  | (Common & {
      tax_receipts_yoy_pct: number;
      period: string;
      measure: "ttm_vs_prior_ttm" | "fytd_vs_prior_fytd";
      latest_month_end: string;
      fallback_reason?: string;
      /** Name of the series as the source labels it (default "Lodging tax receipts"). */
      measure_label?: string;
      our_calculation?: boolean;
    })
  | (Common & { category: string });

export type NoiCalc = {
  company: string;
  hotel_ebitda_usd: number;
  total_revenue_usd: number;
  reserve_pct_of_revenue: number;
  price_usd: number;
  definition_text: string;
  definition_source_uri: string;
  definition_date: string;
};

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
  also_sources?: AlsoSource[];
  label?: string | null;
};

export type GradeResult = {
  sale_id: string;
  rubric_version: string;
  /** Revision within a rubric version (1 when absent). A later revision is appended, never written over the earlier one. */
  revision?: number;
  graded_on: string;
  public_data_as_of: string;
  factor_scores: FactorResult[];
  factors_graded: number;
  factors_total: number;
  overall: number | null;
  overall_label: string;
  output_text: string;
};

const NO_CAP = "No trailing-12-month cap rate or NOI disclosed.";
/** Calendar quarter-end immediately before the given quarter-end (YYYY-MM-DD). */
export function priorQuarterEnd(qe: string): string {
  const [y, m] = qe.split("-").map(Number);
  if (m === 3) return `${y - 1}-12-31`;
  const pm = m - 3;
  return `${y}-${String(pm).padStart(2, "0")}-${pm === 6 ? "30" : pm === 9 ? "30" : "31"}`;
}
/** Last calendar quarter-end strictly before the date (YYYY-MM-DD). */
export function lastQuarterEnd(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const ends = [[y - 1, 12, 31], [y, 3, 31], [y, 6, 30], [y, 9, 30], [y, 12, 31]];
  let best = ends[0];
  for (const e of ends) if (e[1] < m || (e[1] === m && e[2] < d)) best = e;
  return `${best[0]}-${String(best[1]).padStart(2, "0")}-${String(best[2]).padStart(2, "0")}`;
}
const isDate = (s: unknown) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
/** True when the ISO date is the last day of its calendar month. */
const isMonthEnd = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m, 0)).getUTCDate() === d;
};
/** Round half up to one decimal, robust to binary float error (e.g. 4.25 -> 4.3, not 4.2). */
/** "a" or "an" before a spoken number: an 8, an 11, an 18, an 80-89, an 800... */
const article = (n: number) => (/^8/.test(String(n)) || n === 11 || n === 18 ? "an" : "a");
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** House date format for rendered text: 2026-06-30 -> "Jun 30, 2026". Non-ISO strings pass through. */
const humanDate = (iso: unknown) => {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return String(iso);
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
};
const round1 = (x: number) => Math.round(Number((x * 10).toFixed(6))) / 10;

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

function measure(f: RubricFactor, inp: FactorInput, anchor: string): { value: number | string; text: string } | { error: string } {
  const a = inp as Record<string, unknown>;
  const num = (k: string) => (typeof a[k] === "number" && Number.isFinite(a[k]) ? (a[k] as number) : null);
  switch (f.id) {
    case "replacement_cost": {
      const p = num("price_per_key");
      // Hal 2026-10-25: HVS median incl. land, blended by keys across the deal's HVS classes.
      const comps = Array.isArray(a.components) ? (a.components as { label: string; hvs_class: string; keys: number; median_per_key: number }[]) : null;
      let r = num("replacement_cost_per_key");
      if (a.price_confirmed_on !== undefined) {
        // v1.1 (Hal 2026-11-01): only a range was public at announcement -> first confirmed price, dated to its confirmation.
        if (f.basis_rule?.price_range_rule !== "first_confirmed_price")
          return { error: "Only a price range was public at announcement; price per key isn't graded under this rubric version." };
        if (!isDate(a.price_confirmed_on) || !a.price_range_at_announcement)
          return { error: "First-confirmed-price input needs the range public at announcement and the confirmation date." };
      }
      if (comps && comps.length) {
        if (comps.some((c) => !(c.keys > 0) || !(c.median_per_key > 0))) return { error: "Replacement-cost components need keys and a median per key." };
        const k = comps.reduce((t, c) => t + c.keys, 0);
        r = comps.reduce((t, c) => t + c.keys * c.median_per_key, 0) / k;
        if (num("total_keys") !== null && num("total_keys") !== k) return { error: "Component keys don't add up to the deal's keys." };
      }
      if (p === null || r === null || r <= 0) return { error: "Missing price per key or replacement cost per key." };
      const prem = ((p - r) / r) * 100;
      // One rounding rule everywhere (Hal, 2026-10-26): the stored one-decimal value, rounded half up to a whole percent,
      // so -67.47 -> -67.5 -> "68%" in both the factor line and the output line.
      const pct = Math.round(Math.abs(round1(prem)));
      const dir = prem < 0 ? "below" : "above";
      const confirmed = a.price_confirmed_on
        ? `. First confirmed price, ${humanDate(a.price_confirmed_on)}; only ${a.price_range_at_announcement} was public at announcement`
        : "";
      return { value: round1(prem), text: `${usdK(p)} per key vs ${usdK(r)} replacement cost per key (${a.replacement_basis}); ${pct}% ${dir}${confirmed}` };
    }
    case "spread": {
      let c = num("cap_rate_pct");
      const t = num("treasury_10y_pct");
      let calcLabel = "";
      const nc = a.noi_calc as NoiCalc | undefined;
      if (nc) {
        const allow = f.basis_rule?.company_noi_definition;
        if (!allow?.allowed) return { error: "Cap rate calculated from hotel EBITDA isn't a disclosed NOI under this rubric version; recorded, not graded." };
        const ok = [nc.hotel_ebitda_usd, nc.total_revenue_usd, nc.reserve_pct_of_revenue, nc.price_usd].every((x) => typeof x === "number" && Number.isFinite(x)) && nc.price_usd > 0;
        if (!ok || !nc.company || !nc.definition_source_uri || !isDate(nc.definition_date) || !nc.definition_text)
          return { error: "NOI calculation needs the company's hotel EBITDA, revenue, reserve, price and a dated, cited NOI definition." };
        if (nc.definition_date > anchor) return { error: "The company's NOI definition was published after the announcement; not used." };
        const noi = nc.hotel_ebitda_usd - (nc.reserve_pct_of_revenue / 100) * nc.total_revenue_usd;
        c = Math.round((noi / nc.price_usd) * 10000) / 100;
        calcLabel = allow.label.replace("{company}", nc.company);
      }
      if (c === null) return { error: NO_CAP };
      if (t === null) return { error: "Missing 10-year yield." };
      if (!isDate(a.treasury_as_of) || !a.treasury_source_uri) return { error: "10-year yield lacks a date or source." };
      // Amendment A: cap rate on trailing-12-month NOI through the last quarter before announcement;
      // 10-year from the last trading day BEFORE the announcement.
      const rule = f.basis_rule;
      const accepted = rule?.accepted_cap_rate_bases ?? (rule?.cap_rate_basis ? [rule.cap_rate_basis] : []);
      const monthEndRule = accepted.includes("ttm_month_end_before_announcement");
      if (rule && !accepted.includes(a.cap_rate_basis as string))
        return {
          error: monthEndRule
            ? `Cap rate basis "${String(a.cap_rate_basis)}" isn't a trailing 12 months ending at a month-end before the announcement; recorded, not graded.`
            : `Cap rate basis "${String(a.cap_rate_basis)}" isn't the rubric basis (trailing 12 months through the last quarter before announcement); recorded, not graded.`,
        };
      // Rule as applied 2026-10-26 (wording pending Hal's confirmation): the last quarter-end whose results were
      // public by the announcement date. That is the last calendar quarter-end before the announcement, or the one
      // before it when the later quarter's results weren't out yet (the input must say so in results_public_note).
      if (rule && monthEndRule) {
        // v1.1 (Hal 2026-11-01): a trailing 12 months ending at any calendar month-end strictly before the announcement.
        const pe = a.cap_rate_period_end as string;
        if (!isDate(pe) || !isMonthEnd(pe) || pe >= anchor)
          return { error: "Cap rate period must be a trailing 12 months ending at a calendar month-end before the announcement." };
      } else if (rule) {
        const pe = a.cap_rate_period_end as string;
        const lq = lastQuarterEnd(anchor);
        const ok = isDate(pe) && (pe === lq || (pe === priorQuarterEnd(lq) && typeof a.results_public_note === "string" && a.results_public_note.length > 0));
        if (!ok)
          return { error: `Cap rate period must end at the last quarter-end whose results were public by the announcement (${humanDate(lq)}, or ${humanDate(priorQuarterEnd(lq))} if ${humanDate(lq)} results weren't out yet).` };
      }
      // Hal 2026-10-25: 10-year = close on the announcement date (prior trading day only if the market was closed).
      if (rule && rule.treasury_date === "announcement_date_close" && (a.treasury_as_of as string) > anchor)
        return { error: "10-year must be the close on the announcement date." };
      const bp = Math.round((c - t) * 100);
      const calc = nc
        ? `, ${calcLabel}: hotel EBITDA ${usdK(nc.hotel_ebitda_usd)} less a ${nc.reserve_pct_of_revenue}% reserve on ${usdK(nc.total_revenue_usd)} revenue = NOI ${usdK(nc.hotel_ebitda_usd - (nc.reserve_pct_of_revenue / 100) * nc.total_revenue_usd)}, over ${usdK(nc.price_usd)}`
        : "";
      return { value: bp, text: `${c.toFixed(2)}% cap rate (trailing 12 months to ${humanDate(a.cap_rate_period_end)}${calc}) vs ${t.toFixed(2)}% 10-year (${humanDate(a.treasury_as_of)} close); ${bp}bp spread${nc ? " (our calculation)" : ""}` };
    }
    case "supply": {
      const v = num("pipeline_pct_of_rooms");
      if (v === null) return { error: "Missing pipeline share of rooms." };
      // Amendment C: one public source giving the total pipeline (under construction plus planned); never stitched.
      if (f.source_rule) {
        if (a.single_source !== true)
          return { error: "No single public source gives the total pipeline as a share of existing rooms; figures aren't combined across sources or stages." };
        if (a.stage !== f.source_rule.required_stage)
          return { error: "Only partial pipeline stages are public (not under construction plus planned); shown as context, not graded." };
        const unq = typeof a.closures_unquantified === "string" && a.closures_unquantified.length > 0;
        if (f.source_rule.net_of_closures && a.net_of_closures !== true && !unq)
          return { error: "Pipeline share isn't stated net of closures; shown as context, not graded." };
      }
      const calc = a.our_calculation ? " (our calculation)" : "";
      const basis = !f.source_rule?.net_of_closures ? "" : a.net_of_closures === true ? ", net of closures" : `, gross: ${a.closures_unquantified}`;
      return { value: v, text: `Pipeline ${v}% of existing rooms${calc}${basis} (${a.pipeline_definition})` };
    }
    case "demand": {
      const v = num("tax_receipts_yoy_pct");
      if (v === null) return { error: "Missing tax receipts change." };
      // Amendment B: trailing 12 vs prior 12 months; fiscal YTD only as a stated fallback; single months never scored.
      const mr = f.measure_rule;
      if (mr) {
        if (a.measure !== mr.primary && a.measure !== mr.fallback)
          return { error: `Demand measure "${String(a.measure)}" isn't scored (trailing 12 months, or fiscal year to date as a fallback).` };
        if (a.measure === mr.fallback && !a.fallback_reason)
          return { error: "Fiscal-year-to-date fallback used without saying why trailing 12 months couldn't be built." };
        if (!isDate(a.latest_month_end) || (a.latest_month_end as string) > anchor)
          return { error: "Latest month must be published by the announcement date." };
      }
      const label = a.measure === "fytd_vs_prior_fytd" ? "fiscal year to date vs prior" : "trailing 12 months vs prior 12";
      const name = typeof a.measure_label === "string" && a.measure_label ? a.measure_label : "Lodging tax receipts";
      return { value: v, text: `${name} ${v > 0 ? "+" : ""}${v}%${a.our_calculation ? " (our calculation)" : ""} (${label}, ${a.period})` };
    }
    case "debt_context": {
      const cat = a.category;
      if (typeof cat !== "string" || !f.bands.some((b) => b.category === cat)) return { error: "Unknown or missing context category." };
      return { value: cat, text: typeof a.summary === "string" && a.summary ? a.summary : f.bands.find((b) => b.category === cat)!.text };
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
    // No look-ahead: every dated input must be public on or before the announcement. v1.1 price-range rule: price per key
    // is dated to the first confirmed price instead (only when the rubric allows it; measure() rejects it otherwise).
    const confirmedOn = (inp as { price_confirmed_on?: string }).price_confirmed_on;
    const fAnchor =
      f.id === "replacement_cost" && isDate(confirmedOn) && f.basis_rule?.price_range_rule === "first_confirmed_price" && confirmedOn! > anchor ? confirmedOn! : anchor;
    const nc = (inp as { noi_calc?: NoiCalc }).noi_calc;
    const dates = [c.as_of, (inp as { treasury_as_of?: string }).treasury_as_of, nc?.definition_date, ...(c.also_sources ?? []).map((x) => x.date)].filter(Boolean) as string[];
    if (dates.some((d) => d > fAnchor)) {
      return {
        ...base,
        as_of: c.as_of,
        source_uri: c.source_uri,
        graded: false,
        reason: fAnchor === anchor ? `Input dated after the announcement (${humanDate(anchor)}); not used.` : `Input dated after the price was confirmed (${humanDate(fAnchor)}); not used.`,
      };
    }
    const m = measure(f, inp, anchor);
    if ("error" in m) return { ...base, as_of: c.as_of, source_uri: c.source_uri, graded: false, reason: m.error };
    const score =
      f.id === "debt_context"
        ? f.bands.find((b) => b.category === m.value)!.score
        : scoreFromCuts(m.value as number, f.cuts!.thresholds);
    if (score === null) return { ...base, graded: false, reason: "Value fell outside every band." };
    const band = f.bands.find((b) => b.score === score)!;
    // Print a qualifier like "preliminary" once: skip the suffix when the measured text already says it.
    const text = c.label && !m.text.toLowerCase().includes(c.label.toLowerCase()) ? `${m.text} (${c.label})` : m.text;
    return { ...base, graded: true, score, value: m.value, input_text: text, band_text: `${score} = ${band.text}`, as_of: c.as_of, source_uri: c.source_uri, also_sources: c.also_sources ?? [], label: c.label ?? null, reason: null };
  });

  const graded = rows.filter((r) => r.graded);
  const wSum = graded.reduce((s, r) => s + r.weight, 0);
  for (const r of graded) r.effective_weight = Math.round((r.weight / wSum) * 1000) / 1000;
  const enough = graded.length >= rubric.missing_factor_rule.min_factors_graded;
  // Integer weights (percent) avoid float drift in the weighted mean.
  const wInt = graded.reduce((s, r) => s + Math.round(r.weight * 100), 0);
  const overall = enough ? round1(graded.reduce((s, r) => s + (r.score as number) * Math.round(r.weight * 100), 0) / wInt) : null;

  const rep = rows.find((r) => r.factor === "replacement_cost")!;
  const spr = rows.find((r) => r.factor === "spread")!;
  const repText = rep.graded
    ? (rep.value as number) === 0
      ? "Underwritten at replacement cost"
      : `Underwritten at ${article(Math.round(Math.abs(rep.value as number)))} ${Math.round(Math.abs(rep.value as number))}% ${(rep.value as number) < 0 ? "discount" : "premium"} to replacement`
    : `Underwritten with ${rubric.output_template.ungraded_replacement}`;
  const sprCalc = spr.graded && /bp spread \(our calculation\)$/.test(spr.input_text ?? "") ? " (our calculation)" : "";
  const sprText = spr.graded ? `with a ${spr.value}bp spread${sprCalc}` : /cap rate or NOI/i.test(spr.reason ?? "") ? rubric.output_template.ungraded_spread : "spread not graded";
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
    overall_label: enough ? `${overall!.toFixed(1)} of ${rubric.scale.max}` : rubric.missing_factor_rule.insufficient_label,
    output_text,
  };
}
