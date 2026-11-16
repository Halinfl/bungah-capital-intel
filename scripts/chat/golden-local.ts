/**
 * Generate golden.py fixtures from the local worktree (graph fixture, no Groq).
 * Usage:
 *   BUNGAH_NO_NEXT_CACHE=1 BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest \
 *     npx tsx scripts/chat/golden-local.ts
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { installGraphFixture } from "./graph-fixture";

const OUT = process.argv.includes("--out")
  ? process.argv[process.argv.indexOf("--out") + 1]
  : "/workspace/bungah-audit/chat-foundation-qa/recheck/local-fixtures";

const MARKET_NAMES: Record<string, string> = {
  "anaheim-orange-county": "Anaheim / Orange County",
  "aspen-vail": "Aspen / Vail",
  atlanta: "Atlanta",
  austin: "Austin",
  baltimore: "Baltimore",
  boston: "Boston",
  branson: "Branson",
  "charleston-sc": "Charleston",
  charlotte: "Charlotte",
  chicago: "Chicago",
  cincinnati: "Cincinnati",
  cleveland: "Cleveland",
  "columbus-oh": "Columbus",
  dallas: "Dallas",
  denver: "Denver",
  detroit: "Detroit",
  "florida-keys": "the Florida Keys",
  "fort-lauderdale": "Fort Lauderdale",
  "gatlinburg-pigeon-forge": "Gatlinburg / Pigeon Forge",
  honolulu: "Honolulu",
  houston: "Houston",
  indianapolis: "Indianapolis",
  jacksonville: "Jacksonville",
  "kansas-city": "Kansas City",
  "las-vegas": "Las Vegas",
  "los-angeles": "Los Angeles",
  miami: "Miami",
  minneapolis: "Minneapolis",
  "myrtle-beach": "Myrtle Beach",
  "napa-sonoma": "Napa / Sonoma",
  nashville: "Nashville",
  "new-orleans": "New Orleans",
  "new-york-city": "New York City",
  orlando: "Orlando",
  "outer-banks": "the Outer Banks",
  "palm-beach": "Palm Beach",
  "palm-springs": "Palm Springs",
  philadelphia: "Philadelphia",
  phoenix: "Phoenix",
  pittsburgh: "Pittsburgh",
  "portland-or": "Portland",
  raleigh: "Raleigh",
  "reno-tahoe": "Reno / Tahoe",
  "salt-lake-city": "Salt Lake City",
  "san-antonio": "San Antonio",
  "san-diego": "San Diego",
  "san-francisco-bay": "San Francisco Bay",
  savannah: "Savannah",
  seattle: "Seattle",
  "sedona-grand-canyon": "Sedona / Grand Canyon",
  "st-louis": "St. Louis",
  tampa: "Tampa",
  "virginia-beach-norfolk": "Virginia Beach / Norfolk",
  "washington-dc": "Washington, DC",
  "williamsburg-va": "Williamsburg",
};

type Case = {
  id: string;
  question?: string;
  market?: string;
  metric?: string;
  followup?: boolean;
  send_prev?: boolean;
  needs_llm?: boolean;
  /** r10 starter cases: "market:chicago", "reit:HST", "deal:<slug>" (null = plain /chat). */
  scope?: string | null;
  range?: "90d" | "12m" | "all";
  expect_http?: number;
  overlong_chars?: number;
};

async function main() {
  installGraphFixture();
  const { answerChat } = await import("@/lib/chat-llm");
  const { parseScope } = await import("@/lib/chat-scope");
  const spec = JSON.parse(readFileSync("/workspace/bungah-audit/chat-foundation-qa/recheck/golden.json", "utf8"));
  const cases: Case[] = [...(spec.cases || [])];
  const markets: string[] = spec.markets || [];
  const templates = spec.matrix?.templates || [];
  for (const slug of markets) {
    const name = MARKET_NAMES[slug] || slug.replace(/-/g, " ");
    for (const t of templates) {
      cases.push({
        id: `${t.id}-${slug}`,
        question: String(t.question).replaceAll("{name}", name).replaceAll("{slug}", slug),
        market: slug,
        metric: t.metric,
        followup: t.followup,
        send_prev: t.send_prev,
      });
    }
  }
  mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const c of cases) {
    if (c.needs_llm || c.expect_http || c.overlong_chars) continue;
    if (process.argv.includes("--starters") && !c.id.startsWith("starter-")) continue;
    const q = (c.question || "").trim();
    if (!q) continue;
    // r10: starter cases are POSTed the way the chip sends them: the exact string, its item scope and range.
    const out = c.scope !== undefined
      ? await answerChat(q, { scope: parseScope(c.scope), range: c.range ?? "all" })
      : await answerChat(q, { marketSlug: c.market || null, intent: undefined });
    writeFileSync(join(OUT, `${c.id}.json`), JSON.stringify(out, null, 2));
    n += 1;
  }
  console.log(`golden-local: wrote ${n} fixtures to ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
