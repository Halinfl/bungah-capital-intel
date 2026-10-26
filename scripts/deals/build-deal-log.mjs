// Mirrors src/data/deals/deal_log.csv (append-only source of truth) into deal_log.json for the pages to import.
// Run after every append: node scripts/deals/build-deal-log.mjs   (add --check to fail if the mirror is stale)
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "src/data/deals");
const csv = fs.readFileSync(path.join(dir, "deal_log.csv"), "utf8");

function parse(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); if (row.some((x) => x !== "")) rows.push(row); }
  return rows;
}

const [header, ...body] = parse(csv);
const out = body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
const json = JSON.stringify(out, null, 2) + "\n";
const target = path.join(dir, "deal_log.json");
if (process.argv.includes("--check")) {
  const cur = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "";
  if (cur !== json) { console.error("deal_log.json is stale: run node scripts/deals/build-deal-log.mjs"); process.exit(1); }
  console.log(`deal_log.json up to date (${out.length} rows)`);
} else {
  fs.writeFileSync(target, json);
  console.log(`wrote deal_log.json (${out.length} rows)`);
}
