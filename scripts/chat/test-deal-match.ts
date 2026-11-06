/**
 * Unscoped deal-name matching for Chat (r5): full names match, common words don't, and the deal card comes back.
 *   npx tsx scripts/chat/test-deal-match.ts
 */
import { dealAliases, matchDealName, MARKET_TOPIC } from "../../src/lib/chat-deal-match";
import { dealAdviceBrief, dealBrief, dealLens } from "../../src/lib/chat-items";
import { isSocialUrl, stripSocial, stripSocialMarkdown, withoutSocial } from "../../src/lib/social-sources";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { publisherName } from "../../src/lib/public-text";
import { fixMemoCopy } from "../../src/lib/memo-copy";
import { glueText, glueHtml } from "../../src/lib/glue";
import { rowHtml } from "../../src/components/StackMemoView";
import { isOriginalUrl, parseSourceUrls } from "../../src/lib/source-links";

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
  ["Fairmont Scottsdale Princess", null],
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
for (const slug of ["the-wade-chicago", "hotel-zags-portland-or", "midway-portfolio-chicago", "embassy-suites-las-vegas"]) {
  const a = dealAdviceBrief(slug, DECLINE);
  const b = a?.brief;
  check(a?.intent === "advice_declined" && b?.decline === DECLINE, `${slug}: advice brief keeps the decline`);
  check(/(\d\.\d of 5|Insufficient public data) · \d of 5 factors graded/.test(b?.answer ?? ""), `${slug}: meta line in answer: ${(b?.answer ?? "").slice(0, 110)}`);
  check(/Scored using an estimated |Underwritten with /.test(b?.answer ?? ""), `${slug}: grade line in answer`);
  check((b?.answer.match(/factors graded/g) ?? []).length === 1, `${slug}: count stated once`);
  check((b?.reads ?? []).some((r) => /^(Price |Announced )/.test(r.text) && !!r.source.url), `${slug}: cited price read`);
  check((b?.span?.sources ?? 0) >= 1 && b!.sections.some((x) => x.id === "sources" && x.count >= 1), `${slug}: sources section (${b?.span?.sources})`);
  check(!/Below are the relevant cited facts/.test(JSON.stringify(b ?? {})), `${slug}: no empty 'facts below' promise`);
}
const wadeAdv = dealAdviceBrief("the-wade-chicago", DECLINE)!.brief;
check(/^The Wade, Chicago, IL: 4\.8 of 5 · 3 of 5 factors graded/.test(wadeAdv.answer), "Wade advice answer leads with 4.8 of 5 · 3 of 5 factors graded");
{
  const pr = wadeAdv.reads.find((r) => r.text.startsWith("Price $25M for 520 keys"));
  check(!!pr && /first confirmed Oct 25, 2026 \(announced Sep 17, 2026\)/.test(pr.text) && /vishal-thakkar/.test(pr.source.url ?? ""), `Wade advice: price read cites the Oct 25 confirmation (${pr?.text} · ${pr?.source.label})`);
}

// r6: LinkedIn / social posts are never sources (display-layer filter).
check(isSocialUrl("https://www.linkedin.com/posts/x") && !isSocialUrl("https://www.costar.com/article/1"), "isSocialUrl: linkedin yes, costar no");
check(stripSocial({ title: "t", body: "Only row (CoStar, via LinkedIn)", sourceLabel: "CoStar post https://www.linkedin.com/posts/x", sourceUrls: [{ url: "https://www.linkedin.com/posts/x", label: "CoStar post" }] }) === null, "stripSocial: signal resting only on a LinkedIn post is dropped");
{
  const s = stripSocial({ title: "t", body: "Lead. A row (STR) | Host post row | Sun-Times row", magnitude: "3 rows", sourceLabel: "STR · LinkedIn · Host · Chicago Sun-Times (accessed 2026-10-11)", sourceUrls: [{ url: "https://str.com/a", label: "A row" }, { url: "https://www.linkedin.com/posts/host", label: "Host post" }, { url: "https://chicago.suntimes.com/b", label: "Sun-Times" }] });
  check(!!s && !/linkedin|Host post/i.test(JSON.stringify(s)) && s.magnitude === "2 rows" && /STR/.test(s.sourceLabel) && /\(accessed 2026-10-11\)$/.test(s.sourceLabel), `stripSocial: only the LinkedIn row goes (${s?.sourceLabel} | ${s?.body})`);
}

{
  // A row a non-social link also backs keeps its text (only the post link goes); "N changes" follows the rows left.
  const both = stripSocial({ title: "t", body: "Lead. Evo: managing Hotel Z | Bartell: owner", magnitude: "2 rows", sourceLabel: "x", sourceUrls: [{ url: "https://www.hoteldive.com/a", label: "Evo — hoteldive.com" }, { url: "https://www.linkedin.com/posts/a_b", label: "Evo — linkedin.com" }, { url: "https://bartell.com/", label: "Bartell" }] });
  check(!!both && both.body.includes("Evo: managing Hotel Z") && both.magnitude === "2 rows" && !/linkedin/.test(JSON.stringify(both)), `stripSocial keeps a row a non-social link also backs (${both?.body})`);
  const ch = stripSocial({ title: "t", body: "Lead. A moved (PRWeb). | B adds hotels (self-reported). | C wins (BW).", magnitude: "3 changes", sourceLabel: "PRWeb · B on LinkedIn · BW", sourceUrls: [{ url: "https://prweb.com/a", label: "A moved — PRWeb" }, { url: "https://www.linkedin.com/posts/b_c", label: "B adds hotels — B on LinkedIn (self-reported)" }, { url: "https://businesswire.com/x", label: "C wins — BW" }] });
  check(!!ch && ch.magnitude === "2 changes" && !/B adds/.test(ch.body), `stripSocial: "3 changes" -> "${ch?.magnitude}", post-only change dropped`);
}

// r7d: line-break glue on market pages and Sound Asset Lodging: a "·" never starts a line, "City, ST" never splits.
{
  const g = glueText("CBD supply: 46,901 → 47,583 · Aug 2026 · Rancho Bernardo/San Diego, CA");
  check(g === "CBD supply: 46,901 → 47,583\u00a0· Aug 2026\u00a0· Rancho Bernardo/San Diego,\u00a0CA", `glueText: ${JSON.stringify(g)}`);
  const h = glueHtml("<a href='https://sec.gov/x'>SEC EDGAR</a> · <a href='https://y.com'>Y</a> Austin, TX");
  check(h === "<a href='https://sec.gov/x'>SEC EDGAR</a>&nbsp;· <a href='https://y.com'>Y</a> Austin,&nbsp;TX", `glueHtml: ${h}`);
}

// r7e: source-link groups (2+ links after a data row) stack as 44px block rows below 640px, no "·".
{
  const two = rowHtml("LAS YTD (Aug 2026 report) · [Harry Reid International Airport ↗](https://a.example/x.pdf) · [Las Vegas Review-Journal ↗](https://rj.example/y) {tag: self-reported}");
  check(/<span class='src-group'>/.test(two) && (two.match(/class='src-link /g) ?? []).length === 2 && (two.match(/class='src-sep'/g) ?? []).length === 2 && /self-reported/.test(two), "rowHtml: 2 trailing links -> one src-group, 2 src-link rows, separators hideable");
  const one = rowHtml("One read · [SEC ↗](https://sec.example/a)");
  check(!/src-group/.test(one) && /&nbsp;· <a /.test(one), "rowHtml: a single trailing link stays inline");
  const css = readFileSync(join(__dirname, "../../src/app/globals.css"), "utf8");
  check(/@media \(max-width: 639\.98px\)[\s\S]*\.src-group \.src-link \{[^}]*min-height: 44px[^}]*padding: 0/.test(css) && /\.src-group \.src-sep \{\s*display: none/.test(css), "globals.css: .src-group rows are block, >=44px, no padding overlap, separators hidden below 640px");
}

// r7c: memo copy. The LinkedIn-only +11.6% figure and "No greenlight." never reach a memo, saved or new.
{
  const saved = "Downtown trades. A 2026 T12 carrying the +11.6% displaced-meeting lift (CoStar, Sep 2026) overstates debt yield. Labor at contract. No greenlight.";
  const out = fixMemoCopy(saved);
  check(out === "Downtown trades. A 2026 T12 carrying World Cup-displaced meetings overstates debt yield. Labor at contract. Debt test not yet cleared.", `fixMemoCopy rewrites saved memos: ${out}`);
  const t1 = readFileSync(join(__dirname, "../../src/data/stack-memo-tier1.json"), "utf8");
  const sm = readFileSync(join(__dirname, "../../src/lib/stack-memo.ts"), "utf8");
  check(!/11\.6%/.test(t1) && !/No greenlight/.test(t1) && /World Cup-displaced meetings overstates debt yield/.test(t1) && (t1.match(/Debt test not yet cleared\./g) ?? []).length === 15, "tier1 JSON: no 11.6%, no 'No greenlight.', 15 'Debt test not yet cleared.'");
  check(/a PIP can come due in a Bitcoin drawdown \(house rule\)\./.test(sm), "stack-memo.ts: capex rule ends '(house rule)'");
  const oldLine = "- The apartment claim that Bitcoin covers capex and debt maturities does not carry over: the franchisor sets PIP timing, and a PIP can come due in a Bitcoin drawdown (claim dated 2026-09-11) · [X ↗](https://x.com/GrantCardone/status/2098437260072853935) {tag: self-reported}";
  const md = stripSocialMarkdown(fixMemoCopy(`## Hotel\n\n- First row.\n${oldLine}\n- Last row.`));
  check(/a PIP can come due in a Bitcoin drawdown \(house rule\)\./.test(md) && !/x\.com|apartment claim/.test(md), `saved memo: old X capex line renders as the house rule (${md.replace(/\n/g, " | ")})`);
}

// r7: the citations field lists each cited link once, matching the Sources section.
for (const slug of ["the-wade-chicago", "hotel-zags-portland-or", "midway-portfolio-chicago", "embassy-suites-las-vegas"]) {
  const a = dealAdviceBrief(slug, DECLINE)!;
  const src = a.brief.sections.find((x) => x.id === "sources");
  check(!!src && a.citations.length === src.count, `${slug}: citations ${a.citations.length} = Sources ${src?.count}`);
}

// r7: public pages. Memo markdown, publisher labels and source links never carry a social post.
{
  const md = [
    "- Rule with no source.",
    "- Claim resting on a post (2026-09-11) · [x.com ↗](https://x.com/someone/status/1) {tag: self-reported}",
    "- Two sources · [Hotel Dive ↗](https://www.hoteldive.com/a) · [linkedin.com ↗](https://www.linkedin.com/posts/a_b)",
    "- Inline html <a href='https://www.linkedin.com/posts/c_d'>post</a>",
  ].join("\n");
  const out = stripSocialMarkdown(md);
  check(out.split("\n").length === 2 && out.includes("Rule with no source.") && out.includes("[Hotel Dive ↗](https://www.hoteldive.com/a)") && !/linkedin|x\.com/i.test(out), `stripSocialMarkdown keeps sourced/unsourced rows, drops post-only rows: ${JSON.stringify(out)}`);
  check(!/via LinkedIn/.test(publisherName("https://www.linkedin.com/posts/costar_top-us-hotel-markets-activity-1")) && publisherName("https://www.linkedin.com/posts/costar_x-1") !== "CoStar", `publisherName(linkedin post) is not "CoStar, via LinkedIn": ${publisherName("https://www.linkedin.com/posts/costar_x-1")}`);
  check(!isOriginalUrl("https://x.com/a/status/1") && isOriginalUrl("https://www.costar.com/article/1"), "isOriginalUrl: social posts are not original sources");
  check(parseSourceUrls([{ url: "https://www.linkedin.com/posts/a_b" }, { url: "https://www.str.com/x", label: "STR" }]).map((l) => l.label).join() === "STR", "parseSourceUrls drops social links");
  check(withoutSocial([{ title: "a", body: "b", sourceLabel: "Post https://www.linkedin.com/posts/a_b", sourceUrls: [{ url: "https://www.linkedin.com/posts/a_b" }] }, { title: "c", body: "d", sourceLabel: "STR", sourceUrls: [{ url: "https://str.com/" }] }]).length === 1, "withoutSocial drops a row resting only on a post");
}
{
  // The Stack memo generator and its Tier 1 data carry no social links.
  const tier1 = readFileSync(join(__dirname, "../../src/data/stack-memo-tier1.json"), "utf8");
  const memoSrc = readFileSync(join(__dirname, "../../src/lib/stack-memo.ts"), "utf8");
  check(!/https?:\/\/(?:[a-z0-9-]+\.)*(?:linkedin\.com|lnkd\.in|x\.com|twitter\.com|facebook\.com|instagram\.com|threads\.net|tiktok\.com)\//i.test(tier1 + memoSrc), "stack-memo-tier1.json and stack-memo.ts cite no social posts");
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
