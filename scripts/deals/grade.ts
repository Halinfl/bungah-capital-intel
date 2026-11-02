/**
 * Recent Deals grading script.
 *
 *   npx tsx scripts/deals/grade.ts --inputs <deal-inputs.json> [--rubric src/data/deals/rubric-v1.json] [--graded-on YYYY-MM-DD] [--revision N] [--write]
 *
 * Reads the rubric JSON and one deal's assembled inputs (see DealInputs in src/lib/deals-grade.ts; factors under
 * `versions["<rubric_version>"].factors` replace the base factors for that rubric version), prints the
 * factor scores, coverage and the mechanical output line. With --write it appends the grade to
 * src/data/deals/sale_grades.json. --write refuses test fixtures (fixture: true, or a path containing
 * "fixture"/"test") and refuses to overwrite an existing grade for the same sale and rubric version
 * (a rubric change adds a new version; the original is never overwritten). A corrected grade under the same rubric
 * version is appended with --revision N (N = previous + 1); pages show the latest revision of each rubric version.
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
const raw = JSON.parse(fs.readFileSync(inputsPath, "utf8")) as DealInputs & {
  log_id?: string;
  /** Per-rubric-version factor inputs that replace the base ones (e.g. "v1.1"). The base factors stay as graded under v1. */
  versions?: Record<string, { factors: DealInputs["factors"] }>;
};
const override = raw.versions?.[rubric.rubric_version]?.factors;
const inputs: DealInputs = override ? { ...raw, factors: { ...raw.factors, ...override } } : raw;

const revision = Number(arg("revision") ?? "1");
if (!Number.isInteger(revision) || revision < 1) {
  console.error("--revision must be a whole number >= 1");
  process.exit(2);
}
const graded = gradeDeal(rubric, inputs, gradedOn);
const result = { ...(raw.log_id ? { log_id: raw.log_id } : {}), ...graded, ...(revision > 1 ? { revision } : {}) };
console.log(JSON.stringify(result, null, 2));
console.error(`\n${inputs.fixture ? "[TEST FIXTURE] " : ""}${result.output_text}  Overall: ${result.overall_label}`);

if (process.argv.includes("--write")) {
  if (inputs.fixture || /fixture|test/i.test(path.basename(inputsPath))) {
    console.error("refused: test fixtures are never written into public data");
    process.exit(1);
  }
  const target = path.join(process.cwd(), "src/data/deals/sale_grades.json");
  const all = JSON.parse(fs.readFileSync(target, "utf8")) as { sale_id: string; rubric_version: string; revision?: number }[];
  const same = all.filter((g) => g.sale_id === result.sale_id && g.rubric_version === result.rubric_version);
  if (same.some((g) => (g.revision ?? 1) === revision)) {
    console.error(`refused: ${result.sale_id} already has a ${result.rubric_version} revision ${revision} grade (never overwritten; append with --revision ${Math.max(...same.map((g) => g.revision ?? 1)) + 1})`);
    process.exit(1);
  }
  if (revision > 1 && !same.some((g) => (g.revision ?? 1) === revision - 1)) {
    console.error(`refused: no ${result.rubric_version} revision ${revision - 1} for ${result.sale_id}`);
    process.exit(1);
  }
  all.push(result);
  fs.writeFileSync(target, JSON.stringify(all, null, 2) + "\n");
  console.error(`appended to ${target}`);
}
