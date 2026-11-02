/**
 * Market-matcher regression test (deterministic, read-only, no model).
 * Market names must be named as whole words or curated aliases; generic fragments
 * ("last", "new", "city", "west coast", "beach") must not silently pick a market.
 *
 * Run: BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest npx tsx scripts/chat/test-market-matcher.ts
 *      add `--dump <file.json>` to also write every typical question's resolution + answer headline
 *      (used to diff before/after a matcher change).
 * Exit 1 on any failed assertion.
 */
process.env.BUNGAH_NO_NEXT_CACHE = "1";
import fs from "node:fs";
import crypto from "node:crypto";

/** Questions that name no market: must resolve to none. */
const NO_MARKET = [
  "How is RevPAR in the last 12 months?",
  "hotel deals in the last 90 days",
  "How is demand in the last 90 days?",
  "how was hotel occupancy last year?",
  "Which market has the most new supply?",
  "How is new supply looking?",
  "how are city hotels doing?",
  "how is RevPAR on the west coast?",
  "how are beach hotels doing?",
  "how are lake resorts doing?",
  "how are palm-lined resort hotels doing?",
  "what's the outlook for san-style mission hotels?",
  "key takeaways on hotel supply?",
  "what's the long-run RevPAR trend?",
  "how are ski hotels doing?",
  "how are Disney-area hotels doing?",
  "how are hotels near the strip mall doing?",
  "is labor a risk?",
  "what's going on?",
  "hotels",
  "how are luxury hotels doing?",
  "what is the national debt wall?",
  "how are la quinta hotels doing?",
  "how many rooms are in the north region?",
  "how are resorts in the mountain west doing?",
  // "worth" alone is not Dallas–Fort Worth (only "Fort Worth" / "DFW" as a phrase).
  "Is it worth it?",
  "Is a hotel worth buying right now?",
  "what is a hotel worth per key?",
  "is RevPAR growth worth the supply risk?",
];

/** Questions that name a market (short name, alias or abbreviation): expected slug. */
const NAMED: [string, string][] = [
  ["how are hotels doing in LA?", "los-angeles"],
  ["how are hotels doing in SF?", "san-francisco-bay"],
  ["how is demand in SF?", "san-francisco-bay"],
  ["DC hotel supply?", "washington-dc"],
  ["How is Washington, D.C. doing?", "washington-dc"],
  ["What's the RevPAR read in Las Vegas?", "las-vegas"],
  ["how is Vegas doing?", "las-vegas"],
  ["How is New Orleans doing?", "new-orleans"],
  ["NOLA demand?", "new-orleans"],
  ["how is NYC doing?", "new-york-city"],
  ["How is New York doing?", "new-york-city"],
  ["How is Kansas City doing?", "kansas-city"],
  ["How is Salt Lake City doing?", "salt-lake-city"],
  ["How is Key West doing?", "florida-keys"],
  ["How is the Florida Keys market?", "florida-keys"],
  ["How is Myrtle Beach doing?", "myrtle-beach"],
  ["How is Virginia Beach doing?", "virginia-beach-norfolk"],
  ["How is Palm Springs doing?", "palm-springs"],
  ["How is West Palm Beach doing?", "palm-beach"],
  ["How is Palm Beach doing?", "palm-beach"],
  ["How is Fort Lauderdale doing?", "fort-lauderdale"],
  ["How is Lake Tahoe doing?", "reno-tahoe"],
  ["How is San Diego doing?", "san-diego"],
  ["How is San Antonio doing?", "san-antonio"],
  ["How is the Bay Area doing?", "san-francisco-bay"],
  ["How is Fort Worth doing?", "dallas"],
  ["DFW hotel supply?", "dallas"],
  ["Dallas–Fort Worth RevPAR", "dallas"],
  ["Is Nashville worth it?", "nashville"],
  ["How is St. Louis doing?", "st-louis"],
  ["How is Grand Canyon doing?", "sedona-grand-canyon"],
  ["How is Pigeon Forge doing?", "gatlinburg-pigeon-forge"],
  ["How are the Outer Banks doing?", "outer-banks"],
  ["How is wine country doing?", "napa-sonoma"],
  ["How is Orange County doing?", "anaheim-orange-county"],
  ["How is Long Beach doing?", "los-angeles"],
  ["How is Waikiki doing?", "honolulu"],
  ["How is Honolulu doing?", "honolulu"],
  ["how are hotels on the Las Vegas Strip doing?", "las-vegas"],
  ["What's the RevPAR and occupancy read for Nashville?", "nashville"],
];

/** Comparison questions: the matched + secondary markets, as a set. */
const COMPARE: [string, string[]][] = [
  ["Compare Nashville and Austin", ["nashville", "austin"]],
  ["Orlando vs Las Vegas RevPAR", ["orlando", "las-vegas"]],
  ["Miami vs Fort Lauderdale vs West Palm Beach", ["miami", "fort-lauderdale", "palm-beach"]],
  ["How do NYC and Boston compare?", ["new-york-city", "boston"]],
  ["LA vs SF supply", ["los-angeles", "san-francisco-bay"]],
];

const TEMPLATES = [
  (x: string) => `How is ${x} doing?`,
  (x: string) => `What's the RevPAR and occupancy read for ${x}?`,
  (x: string) => `How much new supply is coming in ${x}?`,
  (x: string) => `What's demand doing in ${x}?`,
  (x: string) => `What's the capital thesis for ${x}?`,
  (x: string) => `hotel deals in ${x}`,
];

async function main() {
  const { installGraphFixture } = await import("./graph-fixture");
  if (!installGraphFixture()) throw new Error("set BUNGAH_GRAPH_FIXTURE");
  const { retrieveGraphContext } = await import("@/lib/chat");
  const { shortName } = await import("@/lib/chat-brief-build");
  const all = (await retrieveGraphContext("markets")).markets;
  const fails: string[] = [];
  const res = async (q: string) => (await retrieveGraphContext(q, null)).matched?.slug ?? null;

  for (const q of NO_MARKET) {
    const got = await res(q);
    if (got) fails.push(`NO_MARKET  ${JSON.stringify(q)} → ${got}`);
  }
  for (const [q, want] of NAMED) {
    const got = await res(q);
    if (got !== want) fails.push(`NAMED      ${JSON.stringify(q)} → ${got} (want ${want})`);
  }
  for (const [q, want] of COMPARE) {
    const c = await retrieveGraphContext(q, null);
    const got = [c.matched?.slug, ...c.secondary.map((m) => m.slug)].filter(Boolean).sort();
    if (got.join() !== [...want].sort().join()) fails.push(`COMPARE    ${JSON.stringify(q)} → ${got.join(", ")} (want ${want.join(", ")})`);
  }
  // Every market, by its short name, in every template.
  const typical: { q: string; want: string }[] = [];
  for (const m of all) for (const t of TEMPLATES) typical.push({ q: t(shortName(m)), want: m.slug });
  for (const { q, want } of typical) {
    const got = await res(q);
    if (got !== want) fails.push(`SHORTNAME  ${JSON.stringify(q)} → ${got} (want ${want})`);
  }
  const n = NO_MARKET.length + NAMED.length + COMPARE.length + typical.length;
  console.log(`market matcher: ${n - fails.length}/${n} pass (${NO_MARKET.length} no-market, ${NAMED.length} named, ${COMPARE.length} compare, ${typical.length} short-name × template)`);
  for (const f of fails) console.log("FAIL", f);

  const di = process.argv.indexOf("--dump");
  if (di > 0) {
    const { answerChat } = await import("@/lib/chat-llm");
    const out: Record<string, unknown> = {};
    const qs = [...NO_MARKET, ...NAMED.map((x) => x[0]), ...typical.map((x) => x.q)];
    for (const q of qs) {
      const ctx = await retrieveGraphContext(q, null);
      const a = (await answerChat(q, {})) as unknown as Record<string, unknown>;
      const brief = a.brief as Record<string, unknown> | undefined;
      const body = String(brief?.answer ?? a.content ?? "");
      out[q] = {
        matched: ctx.matched?.slug ?? null,
        secondary: ctx.secondary.map((m) => m.slug),
        intent: a.intent,
        marketSlug: a.marketSlug ?? null,
        head: body.slice(0, 140),
        sha: crypto.createHash("sha1").update(JSON.stringify(a)).digest("hex").slice(0, 10),
      };
    }
    fs.writeFileSync(process.argv[di + 1], JSON.stringify(out, null, 1));
    console.log(`dumped ${qs.length} → ${process.argv[di + 1]}`);
  }
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
