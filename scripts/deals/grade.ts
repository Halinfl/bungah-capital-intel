/**
 * Recent Deals grading script.
 *
 *   npx tsx scripts/deals/grade.ts --inputs <deal-inputs.json> [--rubric src/data/deals/rubric-v1.json] [--graded-on YYYY-MM-DD] [--write]
 *
 * Reads the rubric JSON and one deal's assembled inputs (see DealInputs in src/lib/deals-grade.ts), prints the
 * factor scores, coverage and the mechanical output line. With --write it appends the grade to
 * src/data/deals/sale_grades.json. --write refuses test fixtures (fixture: true, or a path containing
 * "fixture"/"test") and refuses to overwrite an existing grade for the same sale and rubric version
 * (a rubric change adds a new version; the original is never overwritten).
 * No DB access, no network.
 */
import fs from "node:fs";
import path from "node:path";
import { gradeDeal, type DealInputs, type Rubric } from "../../src/lib/deals-grade";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

const inputsPath = arg("inputs");
if (!inputsPath) {
  console.error("usage: tsx scripts/deals/grade.ts --inputs <file.json> [--rubric <rubric.json>] [--graded-on YYYY-MM-DD] [--write]");
  process.exit(2);
}
const rubricPath = arg("rubric") ?? path.join(process.cwd(), "src/data/deals/rubric-v1.json");
const gradedOn = arg("graded-on") ?? new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const rubric = JSON.parse(fs.readFileSync(rubricPath, "utf8")) as Rubric;
const inputs = JSON.parse(fs.readFileSync(inputsPath, "utf8")) as DealInputs;

const result = gradeDeal(rubric, inputs, gradedOn);
console.log(JSON.stringify(result, null, 2));
console.error(`\n${inputs.fixture ? "[TEST FIXTURE] " : ""}${result.output_text}  Overall: ${result.overall_label}`);

if (process.argv.includes("--write")) {
  if (inputs.fixture || /fixture|test/i.test(path.basename(inputsPath))) {
    console.error("refused: test fixtures are never written into public data");
    process.exit(1);
  }
  const target = path.join(process.cwd(), "src/data/deals/sale_grades.json");
  const all = JSON.parse(fs.readFileSync(target, "utf8")) as { sale_id: string; rubric_version: string }[];
  if (all.some((g) => g.sale_id === result.sale_id && g.rubric_version === result.rubric_version)) {
    console.error(`refused: ${result.sale_id} already has a ${result.rubric_version} grade (never overwritten)`);
    process.exit(1);
  }
  all.push(result);
  fs.writeFileSync(target, JSON.stringify(all, null, 2) + "\n");
  console.error(`appended to ${target}`);
}
