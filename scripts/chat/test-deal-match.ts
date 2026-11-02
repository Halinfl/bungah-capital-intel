/**
 * Unscoped deal-name matching for Chat (r5): full names match, common words don't, and the deal card comes back.
 *   npx tsx scripts/chat/test-deal-match.ts
 */
import { dealAliases, matchDealName, MARKET_TOPIC } from "../../src/lib/chat-deal-match";
import { dealBrief, dealLens } from "../../src/lib/chat-items";

let fail = 0;
const check = (ok: boolean, msg: string) => {
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
};
const cases: [string, string | null][] = [
  ["Tell me about The Wade", "the-wade-chicago"],
  ["tell me about the wade?", "the-wade-chicago"],
  ["How was The Wade graded?", "the-wade-chicago"],
  ["What did the W Chicago Lakeshore sell for?", "the-wade-chicago"],
  ["Tell me about The Hotel Zags", "hotel-zags-portland-or"],
  ["What about Hotel Zags", "hotel-zags-portland-or"],
  ["Fairmont Scottsdale Princess", "fairmont-scottsdale-princess"],
  ["Tell me about Embassy Suites Las Vegas", "embassy-suites-las-vegas"],
  ["Tell me about The Bellmoor", "bellmoor-rehoboth-beach"],
  ["Four Seasons Resort Scottsdale at Troon North price", "four-seasons-scottsdale-troon-north"],
  // no false positives on common words
  ["I want to wade into Chicago supply", null],
  ["Tell me about Wade", null],
  ["Tell me about Chicago", null],
  ["Tell me about Embassy Suites", null],
  ["What's happening in the hotel market", null],
  ["Las Vegas RevPAR", null],
  ["Tell me about Palm Beach", null],
  ["Tell me about Scottsdale", null],
  ["Tell me about Tideline Palm Beach", "tideline-palm-beach"],
  ["Should I buy The Wade?", "the-wade-chicago"],
];
for (const [q, want] of cases) check(matchDealName(q) === want, `"${q}" -> ${matchDealName(q)}`);
check(dealAliases("The Wade (former W Chicago Lakeshore)").every((a) => a.split(" ").length >= 2), "aliases are 2+ words");
check(MARKET_TOPIC.test("Chicago supply near The Wade"), "market topic words detected");

const q = "Tell me about The Wade";
const item = dealBrief(matchDealName(q)!, dealLens(q) ?? "grade");
check(item?.intent === "deal_grade", `deal card intent: ${item?.intent}`);
check(/The Wade/.test(item?.brief.answer ?? "") && /4\.8 of 5/.test(item?.brief.answer ?? ""), `answer: ${(item?.brief.answer ?? "").slice(0, 120)}`);
check(/spread not graded \(/.test(item?.brief.answer ?? ""), "answer uses 'not graded'");
check(!/\bSTR\b/.test(JSON.stringify(item?.brief ?? {})), "no 'STR' in the deal brief");
check(/no licensed data/.test(JSON.stringify(item?.brief ?? {})), "coverage says 'no licensed data'");

// End to end through answerChat, when a graph fixture is available (BUNGAH_GRAPH_FIXTURE, as for test:matcher).
async function e2e() {
  if (!process.env.BUNGAH_GRAPH_FIXTURE) {
    console.log("skip answerChat checks (set BUNGAH_GRAPH_FIXTURE to run them)");
    return;
  }
  const { installGraphFixture } = await import("./graph-fixture");
  if (!installGraphFixture()) throw new Error("graph fixture not installed");
  const { answerChat } = await import("../../src/lib/chat-llm");
  const a = await answerChat("Tell me about The Wade");
  check(a.intent === "deal_grade" && /4\.8 of 5/.test(a.brief?.answer ?? ""), `answerChat("Tell me about The Wade") -> ${a.intent}: ${(a.brief?.answer ?? a.content).slice(0, 90)}`);
  // Advice, market-topic and plain market questions fall through to the graph path; they are checked on the preview
  // (the local fixture can't serve that path).
  const e = await answerChat("What price did The Hotel Zags trade at?");
  check(e.intent === "deal_sale", `price question on a named deal -> ${e.intent}`);
}
e2e().then(() => {
  console.log(fail ? `\n${fail} failed` : "\nall passed");
  process.exit(fail ? 1 : 0);
});
