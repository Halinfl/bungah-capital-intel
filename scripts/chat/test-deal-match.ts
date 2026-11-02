/**
 * Unscoped deal-name matching for Chat (r5): full names match, common words don't, and the deal card comes back.
 *   npx tsx scripts/chat/test-deal-match.ts
 */
import { dealAliases, matchDealName, MARKET_TOPIC } from "../../src/lib/chat-deal-match";
import { dealAdviceBrief, dealBrief, dealLens } from "../../src/lib/chat-items";
import { isSocialUrl, stripSocial } from "../../src/lib/social-sources";

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

// Advice about a named deal (r6): decline, then the deal's cited facts.
const DECLINE = "**We don't give buy or sell recommendations.** Here's what the data shows.";
for (const slug of ["the-wade-chicago", "hotel-zags-portland-or", "fairmont-scottsdale-princess", "midway-portfolio-chicago", "embassy-suites-las-vegas"]) {
  const a = dealAdviceBrief(slug, DECLINE);
  const b = a?.brief;
  check(a?.intent === "advice_declined" && b?.decline === DECLINE, `${slug}: advice brief keeps the decline`);
  check(/(\d\.\d of 5|Insufficient public data) · \d of 5 factors graded/.test(b?.answer ?? ""), `${slug}: meta line in answer: ${(b?.answer ?? "").slice(0, 110)}`);
  check(/Underwritten /.test(b?.answer ?? ""), `${slug}: grade line in answer`);
  check((b?.answer.match(/factors graded/g) ?? []).length === 1, `${slug}: count stated once`);
  check((b?.reads ?? []).some((r) => /^(Price |Announced )/.test(r.text) && !!r.source.url), `${slug}: cited price read`);
  check((b?.span?.sources ?? 0) >= 1 && b!.sections.some((x) => x.id === "sources" && x.count >= 1), `${slug}: sources section (${b?.span?.sources})`);
  check(!/Below are the relevant cited facts/.test(JSON.stringify(b ?? {})), `${slug}: no empty 'facts below' promise`);
}
const wadeAdv = dealAdviceBrief("the-wade-chicago", DECLINE)!.brief;
check(/^The Wade, Chicago, IL: 4\.8 of 5 · 3 of 5 factors graded/.test(wadeAdv.answer), "Wade advice answer leads with 4.8 of 5 · 3 of 5 factors graded");
check(wadeAdv.reads.some((r) => r.text.startsWith("Price $25M for 520 keys")), "Wade advice: price $25M read");

// r6: LinkedIn / social posts are never sources (display-layer filter).
check(isSocialUrl("https://www.linkedin.com/posts/x") && !isSocialUrl("https://www.costar.com/article/1"), "isSocialUrl: linkedin yes, costar no");
check(stripSocial({ title: "t", body: "Only row (CoStar, via LinkedIn)", sourceLabel: "CoStar post https://www.linkedin.com/posts/x", sourceUrls: [{ url: "https://www.linkedin.com/posts/x", label: "CoStar post" }] }) === null, "stripSocial: signal resting only on a LinkedIn post is dropped");
{
  const s = stripSocial({ title: "t", body: "Lead. A row (STR) | Host post row | Sun-Times row", magnitude: "3 rows", sourceLabel: "STR · LinkedIn · Host · Chicago Sun-Times (accessed 2026-10-11)", sourceUrls: [{ url: "https://str.com/a", label: "A row" }, { url: "https://www.linkedin.com/posts/host", label: "Host post" }, { url: "https://chicago.suntimes.com/b", label: "Sun-Times" }] });
  check(!!s && !/linkedin|Host post/i.test(JSON.stringify(s)) && s.magnitude === "2 rows" && /STR/.test(s.sourceLabel) && /\(accessed 2026-10-11\)$/.test(s.sourceLabel), `stripSocial: only the LinkedIn row goes (${s?.sourceLabel} | ${s?.body})`);
}

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
  for (const q of ["Should I buy The Wade?", "Is it worth buying The Wade?", "is The Wade worth buying"]) {
    const x = await answerChat(q);
    check(x.intent === "advice_declined" && /4\.8 of 5 · 3 of 5 factors graded/.test(x.brief?.answer ?? "") && (x.citations?.length ?? 0) > 0, `answerChat("${q}") -> ${x.intent}, ${x.citations?.length} citations`);
  }
  const z = await answerChat("Should I sell Hotel Zags?", { scope: { kind: "deal", id: "hotel-zags-portland-or" } });
  check(z.intent === "advice_declined" && /Hotel Zags/.test(z.brief?.answer ?? ""), `scoped advice -> ${z.intent}`);
  // Graph path (needs BUNGAH_NO_NEXT_CACHE=1 locally): no LinkedIn citation, no LinkedIn-only figure.
  for (const q of ["What's RevPAR in Chicago?", "How is Chicago doing?", "Chicago debt and deals", "Who are the operators in San Diego?", "Washington DC management changes"]) {
    const r = await answerChat(q);
    const j = JSON.stringify(r);
    check(!/linkedin/i.test(j) && !j.includes("11.6%"), `answerChat("${q}") -> no LinkedIn source, no 11.6% figure`);
  }
  // Advice with no deal or market facts: the decline doesn't promise cited facts it can't attach.
  const bare = await answerChat("Should I buy?");
  check(/advice/.test(bare.intent ?? "") && !/Below are the relevant cited facts/.test(bare.content), `answerChat("Should I buy?") -> ${bare.intent}, no "Below are the relevant cited facts"`);
  const e = await answerChat("What price did The Hotel Zags trade at?");
  check(e.intent === "deal_sale", `price question on a named deal -> ${e.intent}`);
}
e2e().then(() => {
  console.log(fail ? `\n${fail} failed` : "\nall passed");
  process.exit(fail ? 1 : 0);
});
