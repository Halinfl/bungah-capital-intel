/**
 * Grade every deal in src/data/deals/grader-inputs/ under the live rubric (v1), and the PROPOSED v1.1 side-by-side.
 *
 *   npx tsx scripts/deals/grade-all.ts [--graded-on YYYY-MM-DD] [--write]
 *
 * Without --write it prints a summary. With --write it rebuilds
 *   src/data/deals/sale_grades.json                (rubric v1, live)
 *   (v1.1 PROPOSED side-by-side is printed to the console only; it is never written to the site data)
 * Inputs carry `proposed_v1_1.debt_context` only where v1.1 would score that factor differently; otherwise the v1
 * input is reused. Test fixtures are refused. No DB access, no network.
 */
import fs from "node:fs";
import path from "node:path";
import { gradeDeal, type DealInputs, type GradeResult, type Rubric } from "../../src/lib/deals-grade";

const arg = (n: string) => {
  const i = process.argv.indexOf(`--${n}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const root = process.cwd();
const dir = path.join(root, "src/data/deals/grader-inputs");
const rubric = JSON.parse(fs.readFileSync(path.join(root, "src/data/deals/rubric-v1.json"), "utf8")) as Rubric;
const gradedOn = arg("graded-on") ?? new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });

type Inputs = DealInputs & { log_id?: string; proposed_v1_1?: { debt_context?: DealInputs["factors"]["debt_context"] } };
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const v1: (GradeResult & { log_id?: string })[] = [];
const v11: (GradeResult & { log_id?: string; changed_factors: string[] })[] = [];
for (const f of files) {
  const inp = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Inputs;
  if (inp.fixture || /fixture|test/i.test(f)) throw new Error(`refused: fixture ${f}`);
  const g = { log_id: inp.log_id, ...gradeDeal(rubric, inp, gradedOn) };
  v1.push(g);
  const alt = inp.proposed_v1_1?.debt_context;
  const altInputs: DealInputs = alt ? { ...inp, factors: { ...inp.factors, debt_context: alt } } : inp;
  const g2 = { log_id: inp.log_id, ...gradeDeal(rubric, altInputs, gradedOn), rubric_version: "v1.1-proposed", changed_factors: [] as string[] };
  g2.changed_factors = g2.factor_scores.filter((r, i) => r.score !== g.factor_scores[i].score).map((r) => r.factor);
  v11.push(g2);
}
const byLog = (a: { log_id?: string }, b: { log_id?: string }) => (a.log_id ?? "").localeCompare(b.log_id ?? "");
v1.sort(byLog);
v11.sort(byLog);

for (const g of v1) {
  const alt = v11.find((x) => x.sale_id === g.sale_id)!;
  const sc = g.factor_scores.map((r) => (r.graded ? r.score : "-")).join(" ");
  console.log(`${g.log_id} ${g.sale_id.padEnd(42)} [${sc}] ${g.overall_label.padEnd(24)} v1.1: ${alt.overall_label}${alt.changed_factors.length ? " *" : ""}`);
}
if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(root, "src/data/deals/sale_grades.json"), JSON.stringify(v1, null, 2) + "\n");
  console.error(`wrote ${v1.length} v1 grades (v1.1-proposed is printed only, never written)`);
}
