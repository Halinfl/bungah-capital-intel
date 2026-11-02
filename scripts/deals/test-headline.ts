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
import { FACTOR_SHORT_NAME, headlineText, revisionHistoryLine, shortReason, type GradeResult, type Rubric } from "../../src/lib/deals-grade";

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
    const named = r.factor === "replacement_cost" ? "replacement cost not graded (" : r.factor === "spread" ? "spread not grade" : `${FACTOR_SHORT_NAME[r.factor]} not graded (`;
    check(line.includes(named), `${g.sale_id}: line names ${r.factor}`);
  }
  check(line.includes(`${g.factors_graded} of ${g.factors_total} factors graded`), `${g.sale_id}: coverage in line`);
}

const expect: Record<string, { label: string; line: string }> = {
  "the-wade-chicago-2026": {
    label: "4.8 of 5",
    line: "Underwritten at a 90% discount to replacement; spread not gradeable (no trailing-12-month cap rate or NOI disclosed); supply not graded (closures listed without room counts); 3 of 5 factors graded.",
  },
  "four-seasons-scottsdale-troon-north-2026": {
    label: "2.9 of 5",
    line: "Underwritten at a 10% premium to replacement with a 149bp spread (our calculation); supply not graded (only an under-construction share is public); 4 of 5 factors graded.",
  },
  "embassy-suites-las-vegas-2026": {
    label: "3.6 of 5",
    line: "Underwritten at a 58% discount to replacement; spread not gradeable (no trailing-12-month cap rate or NOI disclosed); 4 of 5 factors graded.",
  },
  "hotel-zags-portland-2026": {
    label: "4.8 of 5",
    line: "Underwritten at an 88% discount to replacement; spread not graded (trailing NOI was negative); supply not graded (no dated room count or pipeline share public); 3 of 5 factors graded.",
  },
  "bellmoor-rehoboth-beach-2026": {
    label: "4.5 of 5",
    line: "Underwritten at a 76% discount to replacement with a 338bp spread; supply not graded (no dated room count or pipeline share public); 4 of 5 factors graded.",
  },
  "fairmont-scottsdale-princess-2026": {
    label: "Insufficient public data",
    line: "Underwritten with replacement cost not graded (no price public at announcement); spread not gradeable (no trailing-12-month cap rate or NOI disclosed); supply not graded (only an under-construction share is public); 2 of 5 factors graded; insufficient public data.",
  },
  "midway-portfolio-chicago-2026": {
    label: "Insufficient public data",
    line: "Underwritten with replacement cost not graded (price includes a restaurant parcel with no public allocation); spread not gradeable (no trailing-12-month cap rate or NOI disclosed); supply not graded (no dated room count or pipeline share public); 2 of 5 factors graded; insufficient public data.",
  },
};
for (const [id, e] of Object.entries(expect)) {
  const g = latest.get(id);
  check(!!g && g.overall_label === e.label, `${id}: grade unchanged (${g?.overall_label})`);
  const line = g ? headlineText(rubric, g) : "";
  check(line === e.line, `${id}: line\n       ${line}`);
}

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

console.log(fail ? `\n${fail} failed` : "\nall passed");
process.exit(fail ? 1 : 0);
