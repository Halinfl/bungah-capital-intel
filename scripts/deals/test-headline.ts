/**
 * Output-line checks (no I/O beyond reading the data files):
 *  - every current-rubric grade names each ungraded factor, with a reason from the short-reason table (no fallback);
 *  - grades are unchanged (overall and factors graded per latest revision);
 *  - expected lines for named deals; The Wade history line;
 *  - the supply band definition carries the closures clarification verbatim;
 *  - v1 grades re-run under rubric-v1.json keep their stored line.
 *   npx tsx scripts/deals/test-headline.ts
 */
import fs from "node:fs";
import path from "node:path";
import { BASIS_UNVERIFIED, FACTOR_SHORT_NAME, cardMetaLine, headlineText, revisionHistoryLine, scoringBasisLine, shortReason, type GradeResult, type Rubric } from "../../src/lib/deals-grade";
import { dealLog, isPublicDeal, publicSales, saleBySlug } from "../../src/lib/deals";

const root = process.cwd();
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(root, "src/data/deals", f), "utf8"));
const rubric = read("rubric-v1.1.json") as Rubric;
const grades = read("sale_grades.json") as GradeResult[];
let fail = 0;
const check = (ok: boolean, msg: string) => {
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
};

const latest = new Map<string, GradeResult>();
for (const g of grades.filter((x) => x.rubric_version === rubric.rubric_version)) {
  const cur = latest.get(g.sale_id);
  if (!cur || (g.revision ?? 1) > (cur.revision ?? 1)) latest.set(g.sale_id, g);
}
for (const g of latest.values()) {
  const line = headlineText(rubric, g);
  for (const r of g.factor_scores.filter((x) => !x.graded)) {
    const sr = shortReason(r.factor, r.reason);
    check(sr.matched, `${g.sale_id}: ${r.factor} reason has a short form ("${sr.text}")`);
    const named = `${FACTOR_SHORT_NAME[r.factor]} not graded (`;
    check(line.includes(named), `${g.sale_id}: line names ${r.factor}`);
  }
  check(line.includes(`${g.factors_graded} of ${g.factors_total} factors graded`), `${g.sale_id}: coverage in line`);
  check(!/gradeable/i.test(line), `${g.sale_id}: one phrase ("not graded") for every ungraded factor`);
}

const expect: Record<string, { label: string; line: string }> = {
  "the-wade-chicago-2026": {
    label: "4.8 of 5",
    line: "Scored using an estimated 90% discount to replacement cost; spread not graded (no trailing-12-month cap rate or NOI disclosed); supply not graded (closures listed without room counts); 3 of 5 factors graded.",
  },
  "four-seasons-scottsdale-troon-north-2026": {
    label: "2.9 of 5",
    line: "Scored using an estimated 10% premium to replacement cost with a 149bp spread (our calculation); supply not graded (only an under-construction share is public); 4 of 5 factors graded.",
  },
  "embassy-suites-las-vegas-2026": {
    label: "3.6 of 5",
    line: "Scored using an estimated 58% discount to replacement cost; spread not graded (no trailing-12-month cap rate or NOI disclosed); 4 of 5 factors graded.",
  },
  "hotel-zags-portland-2026": {
    label: "4.8 of 5",
    line: "Scored using an estimated 88% discount to replacement cost; spread not graded (trailing NOI was negative); supply not graded (no dated room count or pipeline share public); 3 of 5 factors graded.",
  },
  "bellmoor-rehoboth-beach-2026": {
    label: "4.5 of 5",
    line: "Scored using an estimated 76% discount to replacement cost with a 338bp spread; supply not graded (no dated room count or pipeline share public); 4 of 5 factors graded.",
  },
  "fairmont-scottsdale-princess-2026": {
    label: "Insufficient public data",
    line: "Underwritten with replacement cost not graded (no price public at announcement); spread not graded (no trailing-12-month cap rate or NOI disclosed); supply not graded (only an under-construction share is public); 2 of 5 factors graded; insufficient public data.",
  },
  "midway-portfolio-chicago-2026": {
    label: "Insufficient public data",
    line: "Underwritten with replacement cost not graded (price includes a restaurant parcel with no public allocation); spread not graded (no trailing-12-month cap rate or NOI disclosed); supply not graded (no dated room count or pipeline share public); 2 of 5 factors graded; insufficient public data.",
  },
};
for (const [id, e] of Object.entries(expect)) {
  const g = latest.get(id);
  check(!!g && g.overall_label === e.label, `${id}: grade unchanged (${g?.overall_label})`);
  const line = g ? headlineText(rubric, g) : "";
  check(line === e.line, `${id}: line\n       ${line}`);
}

// Compact index-card line (r5): grade · coverage · Not graded: … (no reasons, count once).
const cards: Record<string, string> = {
  "the-wade-chicago-2026": "4.8 of 5 · 3 of 5 factors graded · Not graded: spread, supply",
  "four-seasons-scottsdale-troon-north-2026": "2.9 of 5 · 4 of 5 factors graded · Not graded: supply",
  "embassy-suites-las-vegas-2026": "3.6 of 5 · 4 of 5 factors graded · Not graded: spread",
  "hotel-zags-portland-2026": "4.8 of 5 · 3 of 5 factors graded · Not graded: spread, supply",
  "bellmoor-rehoboth-beach-2026": "4.5 of 5 · 4 of 5 factors graded · Not graded: supply",
  "fairmont-scottsdale-princess-2026": "Insufficient · 2 of 5 factors graded · Not graded: replacement cost, spread, supply",
  "midway-portfolio-chicago-2026": "Insufficient · 2 of 5 factors graded · Not graded: replacement cost, spread, supply",
};
for (const [id, want] of Object.entries(cards)) {
  const got = cardMetaLine(rubric, latest.get(id)!);
  check(got === want, `${id}: card line "${got}"`);
}
for (const g of latest.values()) {
  const line = cardMetaLine(rubric, g);
  check(line.split("factors graded").length === 2, `${g.sale_id}: card says "factors graded" once`);
  if (g.factors_graded === g.factors_total) check(!line.includes("Not graded"), `${g.sale_id}: no "Not graded" when all graded`);
}
const allGraded = { ...latest.get("bellmoor-rehoboth-beach-2026")!, factors_graded: 5 };
allGraded.factor_scores = allGraded.factor_scores.map((r) => ({ ...r, graded: true, score: r.score ?? 3 }));
check(!cardMetaLine(rubric, allGraded).includes("Not graded"), "synthetic all-graded card omits Not graded");

// entries.json context wording (r5)
const entriesText = fs.readFileSync(path.join(root, "src/data/deals/entries.json"), "utf8");
check(!/gradeable/i.test(entriesText), 'entries.json has no "gradeable"');
check((entriesText.match(/No qualifying cap rate, so no spread is computed\./g) ?? []).length === 8, "entries.json: 8 'No qualifying cap rate' lines");

// Scoring basis is the mechanical sentence when the stored rows support it. Same line on cards and deal pages.
const FROZEN_OVERALL: Record<string, number | null> = {
  "bellmoor-rehoboth-beach-2026": 4.5,
  "embassy-suites-dulles-airport-2026": 4.3,
  "embassy-suites-las-vegas-2026": 3.6,
  "embassy-suites-philadelphia-airport-2026": 4.3,
  "fairmont-scottsdale-princess-2026": null,
  "four-seasons-scottsdale-troon-north-2026": 2.9,
  "grande-lakes-orlando-2026": 3.2,
  "hotel-zags-portland-2026": 4.8,
  "midway-portfolio-chicago-2026": null,
  "the-wade-chicago-2026": 4.8,
  "tideline-palm-beach-2026": 3,
};
check(latest.size === Object.keys(FROZEN_OVERALL).length, `graded deal count unchanged (${latest.size})`);
for (const g of latest.values()) {
  check(g.overall === FROZEN_OVERALL[g.sale_id], `${g.sale_id}: overall unchanged (${g.overall})`);
  const basis = scoringBasisLine(rubric, g);
  const line = headlineText(rubric, g);
  check(basis.verified && basis.text === line, `${g.sale_id}: basis verified and equals the mechanical line`);
  check(!/\bpeer\b|\brank(?:ed|ing|s)?\b|\bpercentile\b|below Treasuries/i.test(basis.text), `${g.sale_id}: basis is not a peer rank`);
  for (const r of g.factor_scores) {
    if (!r.graded) check(basis.text.includes(`${FACTOR_SHORT_NAME[r.factor]} not graded`), `${g.sale_id}: basis does not treat ${r.factor} as graded`);
  }
}
const unverified = structuredClone(latest.get("the-wade-chicago-2026")!);
const rc = unverified.factor_scores.find((r) => r.factor === "replacement_cost")!;
rc.input_text = null;
const flagged = scoringBasisLine(rubric, unverified);
check(!flagged.verified && flagged.text === BASIS_UNVERIFIED, `missing input flags the basis ("${flagged.text}")`);

const fairmontRaw = (read("graded_sales.json") as { sale_id: string; public?: boolean; slug: string }[]).find((s) => s.sale_id === "fairmont-scottsdale-princess-2026");
check(fairmontRaw?.public === false && fairmontRaw.slug === "fairmont-scottsdale-princess", "Fairmont record stays on file with public: false");
check(saleBySlug("fairmont-scottsdale-princess") === undefined && !isPublicDeal(fairmontRaw ?? {}), "Fairmont is hidden from detail lookup and chat");
check(!publicSales().some((s) => s.slug === "fairmont-scottsdale-princess"), "Fairmont is off the public deals list");
check(!dealLog().some((r) => r.log_id === "DL-2026-009"), "Fairmont is off the public deal log");
check(publicSales().length === 10 && dealLog().length === 10, `public deals ${publicSales().length}, log ${dealLog().length}`);

const wade = latest.get("the-wade-chicago-2026")!;
const hist = revisionHistoryLine(wade, grades.filter((g) => g.sale_id === wade.sale_id));
check(hist === "Earlier v1.1 grade 4.0 (supply scored 1; withdrawn Nov 1: room count unavailable)", `Wade history line: ${hist}`);
for (const g of latest.values())
  if (g.sale_id !== wade.sale_id) check(revisionHistoryLine(g, grades.filter((x) => x.sale_id === g.sale_id)) === null, `${g.sale_id}: no history line`);

const RULE = "Supply: pipeline net of closures. If a source lists closures without a room count, supply isn't graded for that deal.";
const supply = rubric.factors.find((f) => f.id === "supply")!;
check(supply.metric_definition.includes(RULE), "supply metric_definition carries the closures rule verbatim");
check(rubric.changelog?.some((c) => c.line === RULE) ?? false, "changelog line matches");
const md = fs.readFileSync(path.join(root, "src/data/deals/rubric-v1.1.md"), "utf8");
check(md.includes(RULE), "rubric-v1.1.md carries the rule verbatim");

// v1 rubric has no ungraded_factor: stored v1 lines stay as written.
const v1 = read("rubric-v1.json") as Rubric;
check(!v1.output_template.ungraded_factor, "rubric-v1.json unchanged (no ungraded_factor)");
check(v1.output_template.ungraded_spread === "spread not gradeable (no trailing-12-month cap rate or NOI disclosed)", "rubric-v1.json keeps its v1 spread wording");
check(rubric.output_template.ungraded_spread === "spread not graded (no trailing-12-month cap rate or NOI disclosed)", "rubric-v1.1.json spread wording is \"not graded\"");
check(!/not gradeable/i.test(JSON.stringify(rubric)) && !/not gradeable/i.test(md), "no \"not gradeable\" left in rubric-v1.1 json/md");

console.log(fail ? `\n${fail} failed` : "\nall passed");
process.exit(fail ? 1 : 0);
