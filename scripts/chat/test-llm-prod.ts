/**
 * Unit tests for the Groq production-ready Chat path (no network, no DB).
 * Covers model allowlist, caps/429 fallback signals, pack redaction, output guards,
 * disclosure copy, and the draft privacy page.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { DEFAULT_GROQ_MODEL, GROQ_OVERFLOW_MODEL, resolveGroqModelId } from "../../src/lib/chat-llm-models";
import {
  checkLlmCap,
  groqIsCoolingDown,
  isGroqRateLimitError,
  markGroqRateLimited,
  parseRetryAfter,
  reserveLlmCall,
  resetLlmCapsForTests,
  LLM_USER_DAILY_CAP,
} from "../../src/lib/chat-llm-cap";
import { serializeLlmPack, LLM_PACK_MAX_FACTS } from "../../src/lib/chat-llm-pack";
import { inspectLlmAnswer, scrubShowboatForeclosure } from "../../src/lib/chat-llm-guard";
import { CHAT_AI_DISCLOSURE, CHAT_AI_LABEL, CHAT_PRIVACY_HREF, CHAT_PRIVACY_LINK_LABEL } from "../../src/lib/chat-llm-disclosure";
import { citationsUsedInAnswer, stripCitationBrackets } from "../../src/lib/chat-llm-citations";
import { isYellowSource, withYellowBuckets } from "../../src/lib/yellow-sources";
import { isAirliftQuestion, loadAirliftSignals, airportMentionedIn, airliftFactsFor } from "../../src/lib/chat-airlift";
import { looksLikeIdea } from "../../src/lib/chat-ideas";
import { STR_TABLE_REFUSAL, asksForStrTable } from "../../src/lib/chat-str";
import { buildGdeltQuery } from "../../src/lib/chat-web-search";
import { CITED_SOURCE_MISS, isNoMarketMemo } from "../../src/lib/chat-llm";
import { LLM_TIMEOUT_MS } from "../../src/lib/chat-llm-cap";
import { classifyIntent } from "../../src/lib/chat-intent";
import { NO_PROPERTY_FACTS, resolveNamedAsset } from "../../src/lib/chat-named-asset";
import { SIGNED_OUT_LOG_RETENTION_DAYS, signedOutLogPurgeWhere } from "../../src/lib/chat-store";

import type { GraphContext } from "../../src/lib/chat";

const failures: string[] = [];
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok  ${name}`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    failures.push(`${name}: ${msg}`);
    console.error(`FAIL  ${name}: ${msg}`);
  }
}

test("default and overflow are Production gpt-oss ids", () => {
  assert.equal(DEFAULT_GROQ_MODEL, "openai/gpt-oss-120b");
  assert.equal(GROQ_OVERFLOW_MODEL, "openai/gpt-oss-20b");
  assert.equal(resolveGroqModelId(null), "openai/gpt-oss-120b");
  assert.equal(resolveGroqModelId("gpt-oss-120b"), "openai/gpt-oss-120b");
  assert.equal(resolveGroqModelId("openai/gpt-oss-20b"), "openai/gpt-oss-20b");
});

test("retired Llama and Preview models are refused", () => {
  assert.equal(resolveGroqModelId("llama-3.3-70b-versatile"), null);
  assert.equal(resolveGroqModelId("meta/llama-3.3-70b"), null);
  assert.equal(resolveGroqModelId("qwen/qwen3.8-27b"), null);
  assert.equal(resolveGroqModelId("openai/gpt-oss-safeguard-20b"), null);
});

test("daily per-user cap then skips with cap_user", () => {
  resetLlmCapsForTests();
  const id = "user-a";
  for (let i = 0; i < LLM_USER_DAILY_CAP; i++) {
    const c = checkLlmCap(id);
    assert.equal(c.ok, true, `request ${i} should pass`);
    reserveLlmCall(id, 100);
  }
  const blocked = checkLlmCap(id);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.equal(blocked.reason, "cap_user");
  // A different user still has room.
  assert.equal(checkLlmCap("user-b").ok, true);
});

test("429 cooldown skips with rate_limited and honors retry-after", () => {
  resetLlmCapsForTests();
  markGroqRateLimited(30);
  assert.equal(groqIsCoolingDown(), true);
  const c = checkLlmCap("user-a");
  assert.equal(c.ok, false);
  if (!c.ok) assert.equal(c.reason, "rate_limited");
  assert.equal(isGroqRateLimitError(new Error("429 Too Many Requests retry-after: 7")), true);
  assert.equal(parseRetryAfter(new Error("retry-after: 7")), 7);
});

function packCtx(signals: object[], extra: Partial<GraphContext> = {}): GraphContext {
  const market = {
    id: "m1",
    name: "Nashville",
    slug: "nashville",
    region: "South",
    summary: "",
    nuanceNote: null,
    sourceLabel: "Visit Music City",
    occupancy: 70,
    adr: 200,
    visitorsM: null,
    roomsK: null,
    midweekOcc: null,
    weekendOcc: null,
    signals,
    assets: [],
  };
  return {
    question: "What's RevPAR in Nashville?",
    intent: "revpar_metrics",
    preferredMarketSlug: "nashville",
    markets: [market],
    matched: market,
    secondary: [],
    nationalSignals: [],
    radars: [],
    ...extra,
  } as unknown as GraphContext;
}

test("pack drops STR/CoStar raw rows and does not send snapshot OCC/ADR tables", () => {
  const ctx = packCtx([
    {
      title: "Downtown occupancy (STR)",
      body: "CBD occupancy 69.2%, ADR $243.10 (STR)",
      sourceLabel: "CoStar / STR",
      sourceUrls: [{ url: "https://www.str.com/report", label: "STR" }],
      magnitude: "69.2%",
      asOf: "2025",
      kind: "demand",
    },
    {
      title: "Hotel tax collections",
      body: "County hotel tax receipts rose in FY2025.",
      sourceLabel: "Davidson County Trustee",
      sourceUrls: [{ url: "https://www.nashville.gov/tax.pdf", label: "Trustee" }],
      magnitude: "FY2025",
      asOf: "2025-06-30",
      kind: "tax",
    },
  ]);
  const pack = serializeLlmPack(ctx);
  assert.equal(pack.pack.includes("69.2%"), false, "licensed figure must not appear");
  assert.equal(pack.pack.includes("$243.10"), false);
  assert.equal(/OCC%=/.test(pack.pack), false, "no metrics table");
  assert.match(pack.pack, /Davidson County Trustee/);
  assert.match(pack.pack, /https:\/\/www\.nashville\.gov\/tax\.pdf/);
  assert.match(pack.pack, /as-of 2025-06-30/);
  assert.equal(pack.factCount, 1);
  assert.ok(pack.factCount <= LLM_PACK_MAX_FACTS);
});

test("pack skips a red republication-prohibited factor and says so", () => {
  const ctx = packCtx([
    {
      title: "Pipeline total",
      body: "4,200 rooms under construction. Notice: republication prohibited.",
      sourceLabel: "Visit Phoenix deck",
      sourceUrls: [{ url: "https://example.org/phoenix-deck.pdf", label: "Visit Phoenix" }],
      magnitude: "4,200",
      asOf: "2025-02",
      kind: "supply",
    },
  ]);
  const pack = serializeLlmPack(ctx);
  assert.equal(pack.pack.includes("4,200"), false);
  assert.ok(pack.redSkipped.length >= 1);
  assert.match(pack.pack, /restricts republication/);
});

test("output guard catches licensed figures, buy\/sell, empty, and Showboat foreclosure", () => {
  assert.equal(inspectLlmAnswer(""), "empty");
  assert.equal(
    inspectLlmAnswer("Chicago CBD occupancy is 69.2% with ADR $243.10 (STR). A longer cited sentence follows here."),
    "licensed_figures"
  );
  assert.equal(
    inspectLlmAnswer("This is a strong buy. You should buy Host Hotels shares today based on the cited card."),
    "buy_sell"
  );
  assert.equal(
    inspectLlmAnswer("The Atlantic City Showboat is in foreclosure after the reported lender action last year."),
    "showboat_foreclosure"
  );
  const scrubbed = scrubShowboatForeclosure(
    "The Atlantic City Showboat is in foreclosure after the reported lender action last year."
  );
  assert.doesNotMatch(scrubbed, /\bin foreclosure\b/i);
  assert.equal(inspectLlmAnswer(scrubbed), null);
  assert.equal(
    inspectLlmAnswer(
      "Nashville hotel tax receipts rose in FY2025 (Davidson County Trustee, https://www.nashville.gov/tax.pdf, as-of 2025-06-30). Decision support only."
    ),
    null
  );
});

test("disclosure copy is exact and wired into ChatClient and the privacy draft", () => {
  assert.match(CHAT_AI_DISCLOSURE, /AI-generated answers from public and licensed sources/);
  assert.match(CHAT_AI_DISCLOSURE, /not investment, legal, or tax advice/);
  assert.match(CHAT_AI_DISCLOSURE, /Don't enter confidential or personal information/);
  assert.equal(CHAT_AI_LABEL, "AI-generated");
  assert.equal(CHAT_PRIVACY_HREF, "/privacy");
  assert.equal(CHAT_PRIVACY_LINK_LABEL, "Chat privacy notice");
  const client = readFileSync(resolve("src/app/chat/ChatClient.tsx"), "utf8");
  assert.match(client, /CHAT_AI_DISCLOSURE/);
  assert.match(client, /data-chat-ai-disclosure/);
  assert.match(client, /data-chat-ai-label/);
  assert.match(client, /CHAT_PRIVACY_HREF/);
  // r4 (merged from chat-foundation): composer uses the 2px slate focus-visible ring, not focus:outline-none.
  assert.match(client, /focus-visible:outline-2/);
  assert.doesNotMatch(client, /focus:outline-none/);
  const privacySource = readFileSync(resolve("src/app/privacy/page.tsx"), "utf8");
  const privacy = privacySource.replace(/\s+/g, " ");
  assert.match(privacy, /Draft — under legal review/);
  assert.match(privacy, /Chat privacy notice/);
  assert.match(privacy, /not a complete website privacy policy/);
  assert.match(privacy, /Bungah Capital LLC/);
  assert.match(privacy, /sent to Groq, a US-based/);
  assert.match(privacy, /zero data retention/i);
  assert.doesNotMatch(privacy, /pre-launch step|counsel has signed off|ZDR toggle/);
  assert.match(privacy, /Chat questions \(signed-in or signed-out\)/);
  assert.match(privacy, /processes Chat questions, signed-in and signed-out, in the United States when AI answers are turned on/);
  assert.match(privacy, /Signed-in \(private\) Chat uses the same AI path/);
  assert.match(privacy, /When AI answers are turned on, we use Groq with zero data retention enabled/);
  assert.doesNotMatch(privacy, /Groq Zero Data Retention is on/);
  assert.doesNotMatch(privacy, /We configure Groq for Zero Data Retention/);
  assert.match(privacy, /never written into public question logs/);
  assert.match(privacy, /We do not use signed-in Chat conversations to train or improve Chat/);
  assert.match(privacy, /If we ever offer an opt-in/);
  assert.match(privacy, /update this notice first and it will be off by default/);
  assert.match(privacy, /a short search query based on your question \(not your full thread\)/);
  assert.match(privacy, /query may include words from your question/);
  assert.match(privacy, /deleted automatically after 12 months/);
  assert.match(privacy, /Deleting your account removes/);
  assert.match(privacy, /kept until you delete them or your account/);
  assert.match(privacy, /Chat data is stored in the United States/);
  assert.match(privacy, /Inactive signed-out threads may be removed after 90 days/);
  assert.doesNotMatch(privacy, /unless you opt in/);
  assert.doesNotMatch(privacy, /trainOptIn|\/api\/chat\/prefs|\/api\/cron\/chat-purge|user\.deleted|in this preview/);
  assert.doesNotMatch(privacy, /Private question-log rows/);
  assert.doesNotMatch(privacy, /When you are signed in, we may send your question/);
  assert.match(privacy, /12 months/);
  assert.match(privacy, /halvespucci@gmail.com/);
  assert.match(privacy, /not intended for anyone under 18/);
  assert.match(privacy, /Vercel/);
  assert.match(privacy, /Clerk/);
  assert.match(privacy, /Neon/);
  assert.match(privacy, /bci_anon/);
  assert.match(privacy, /gpt-oss-120b/);
  assert.match(privacy, /text-only credit; no logos are used/);
  assert.doesNotMatch(privacy, /<img/i);
  const wording = readFileSync(resolve("docs/privacy-wording.md"), "utf8");
  const publicMd = (wording.split("## Proposed body")[1]?.split("## Counsel notes")[0] ?? "").replace(/\s+/g, " ");
  assert.match(wording, /Bungah Capital LLC/);
  assert.match(wording, /12 months/);
  assert.match(wording, /halvespucci@gmail.com/);
  assert.match(publicMd, /Chat questions \(signed-in or signed-out\)/);
  assert.match(publicMd, /processes Chat questions, signed-in and signed-out, in the United States when AI answers are turned on/);
  assert.match(publicMd, /Chat data is stored in the United States/);
  assert.match(publicMd, /a short search query based on your question \(not your full thread\)/);
  assert.match(publicMd, /We do not use signed-in Chat conversations to train or improve Chat/);
  assert.match(publicMd, /We do not sell your Chat questions\. We do not put secrets, passwords, or payment details into Chat prompts/);
  assert.doesNotMatch(publicMd, /trainOptIn|\/api\/chat\/prefs|\/api\/cron\/chat-purge|user\.deleted|in this preview/);
  assert.doesNotMatch(publicMd, /Private question-log rows/);
  assert.doesNotMatch(wording, /this wording should not go live until that confirmation/);
  // Page prose matches the proposed body (same required sentences).
  for (const needle of [
    "Chat questions (signed-in or signed-out)",
    "processes Chat questions, signed-in and signed-out, in the United States when AI answers are turned on",
    "Chat data is stored in the United States",
    "a short search query based on your question (not your full thread)",
    "We do not use signed-in Chat conversations to train or improve Chat",
    "We do not sell your Chat questions. We do not put secrets, passwords, or payment details into Chat prompts",
  ]) {
    assert.match(privacy, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("citations array keeps only sources the answer used, and 【】 markers are stripped", () => {
  const cleaned = stripCitationBrackets("Host lifted FY 2026 comparable RevPAR guidance to 4.75%–5.25%【】 (Q2 2026 8-K earnings release).");
  assert.doesNotMatch(cleaned, /\u3010|\u3011|【|】/);
  assert.match(cleaned, /8-K earnings release/);
  const used = citationsUsedInAnswer(cleaned, [
    "Q2 2026 8-K earnings release",
    "FRED, Federal Reserve Bank of St. Louis (DGS10, from the Fed's H.15 release)",
    "Hilton Q2 transcript (goodmoat, third-party)",
  ]);
  assert.deepEqual(used, ["Q2 2026 8-K earnings release"]);
});

test("roadgenius OCC/ADR is treated as Yellow and reduced to a bucket", () => {
  assert.equal(isYellowSource("roadgenius.com", [{ url: "https://roadgenius.com/statistics/tourism/usa/tennessee/nashville/" }]), true);
  const rows = withYellowBuckets([
    {
      title: "Nashville 2025 county hotel performance",
      body: "OCC 67.0% / ADR $199.20 (ADR -1.3%); RevPAR -2.1%",
      sourceLabel: "roadgenius.com",
      sourceUrls: [{ url: "https://roadgenius.com/statistics/tourism/usa/tennessee/nashville/" }],
      magnitude: "67.0% / $199.20",
      asOf: "2025",
    },
  ]);
  assert.match(rows[0].magnitude ?? "", /bucket/i);
  assert.doesNotMatch(rows[0].body ?? "", /67\.0%|\$199\.20/);
  const pack = serializeLlmPack({
    question: "What's the RevPAR and occupancy read for Nashville?",
    intent: "revpar_metrics",
    preferredMarketSlug: "nashville",
    markets: [],
    matched: null,
    secondary: [],
    nationalSignals: rows as never,
    radars: [],
  });
  assert.doesNotMatch(pack.pack, /67\.0%|\$199\.20/);
  assert.match(pack.pack, /bucket/i);
});

test("FAA / airlift questions classify to demand_visitation", () => {
  assert.equal(isAirliftQuestion("What are trends currently effecting the market after the FAA issue on Friday"), true);
  assert.equal(isAirliftQuestion("How were Dulles (IAD) passengers in July 2026?"), true);
  assert.equal(isAirliftQuestion("What's the O'Hare passenger count?"), true);
  assert.equal(isAirliftQuestion("DCA Reagan National traffic"), true);
  assert.equal(airportMentionedIn("Dulles passengers", "IAD"), true);
  const dulles = airliftFactsFor("How were Dulles (IAD) passengers in July 2026?");
  assert.ok(dulles.market.some((f) => /dulles|IAD/i.test(f.title) || /IAD/i.test(f.body)), "Dulles/IAD rows are attached");
  assert.equal(classifyIntent("What are trends currently effecting the market after the FAA issue on Friday"), "demand_visitation");
  assert.equal(classifyIntent("How is airlift into Nashville?"), "demand_visitation");
});

test("a named asset with no retrieved facts uses the fixed sentence and does not echo foreclosure", () => {
  const empty = {
    question: "Is the Showboat in foreclosure?",
    intent: "unknown" as const,
    preferredMarketSlug: null,
    markets: [],
    matched: null,
    secondary: [],
    nationalSignals: [],
    radars: [],
  };
  const hit = resolveNamedAsset("Is the Showboat in foreclosure?", empty);
  assert.ok(hit && !hit.hasFacts);
  assert.doesNotMatch(NO_PROPERTY_FACTS, /foreclosure/i);
  assert.match(NO_PROPERTY_FACTS, /I don't have cited information on that property/);
});

test("signed-out log purge where clause is 12 months and never includes private rows", () => {
  assert.equal(SIGNED_OUT_LOG_RETENTION_DAYS, 365);
  const now = new Date("2026-11-15T16:00:00-05:00");
  const where = signedOutLogPurgeWhere(now, SIGNED_OUT_LOG_RETENTION_DAYS);
  assert.equal(where.isPrivate, false);
  assert.equal(where.userId, null);
  const cutoff = (where.createdAt as { lt: Date }).lt;
  assert.equal(cutoff.toISOString(), new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString());
});

test("airlift pack loads the national FAA ground-stop fact", () => {
  const rows = loadAirliftSignals();
  assert.ok(rows.length >= 34, `expected at least 34 airlift rows, got ${rows.length}`);
  assert.ok(rows.some((r) => /ground stop/i.test(r.headline)));
  assert.equal(isAirliftQuestion("What are trends currently effecting the market after the FAA issue on Friday"), true);
  const ids = new Set(rows.map((r) => r.id).filter(Boolean));
  assert.ok(ids.has("airlift-was-003"), "batch 2 Washington replacement is present");
  assert.ok(ids.has("airlift-orl-004"), "batch 2 Orlando replacement is present");
  assert.equal(ids.has("airlift-was-001"), false, "was-001 is superseded");
  assert.equal(ids.has("airlift-orl-002"), false, "orl-002 is superseded");
});

test("STR table prompts are detected and the refusal names STR", () => {
  assert.equal(asksForStrTable("Can you send me the full STR occupancy, ADR, and RevPAR table for Nashville?"), true);
  assert.equal(asksForStrTable("What's the RevPAR read for Nashville?"), false);
  assert.match(STR_TABLE_REFUSAL, /don't share STR data/i);
});

test("idea detector catches feedback and ignores a plain market question", () => {
  assert.equal(looksLikeIdea("You should add a comparison of two markets side by side"), true);
  assert.equal(looksLikeIdea("What's the RevPAR read for Nashville?"), false);
});

test("GDELT query builder drops question-words and quotes a topic", () => {
  const q = buildGdeltQuery("What's a recent news headline about the 2026 United States midterm elections? Cite a source.");
  assert.match(q, /sourcelang:english/);
  assert.doesNotMatch(q, /\bWhat's\b|\bCite\b|\bheadline\b|\bsource\b/i);
  assert.match(q, /midterm/i);
  assert.match(q, /2026/);
  assert.ok(q.includes('"'), q);
});

test("live-search style answers still fail the licensed-text guard when they quote STR", () => {
  const leaked = "From cited open sources:\n\nNashville occupancy was 67.0% (STR data, as-of 2026).";
  assert.equal(inspectLlmAnswer(leaked), "licensed_figures");
});

test("the canned no-market memo is recognized, and the soft fallback never uses it", () => {
  assert.equal(isNoMarketMemo("Chat answers from the cited Capital Graph: named markets, the national debt wall, talent signals, and active radars. This question didn't match a market we cover."), true);
  assert.equal(isNoMarketMemo(CITED_SOURCE_MISS), false);
  assert.match(CITED_SOURCE_MISS, /couldn't find a cited source right now/i);
  assert.ok(LLM_TIMEOUT_MS >= 12000, `timeout floor should be >= 12s, got ${LLM_TIMEOUT_MS}`);
});

test("Miami Business / GMCVB / Lodging Magazine OCC-ADR reprints are Yellow and bucketed", () => {
  assert.equal(isYellowSource("Miami Business", [{ url: "https://miamibusiness.com/miami-hospitality-industry-report-august-2026/" }]), true);
  assert.equal(isYellowSource("GMCVB June 2026 SOTI", [{ url: "https://www.miamiandbeaches.com/getmedia/x/2026_June_3_State_of_the_Industry.pdf" }]), true);
  assert.equal(isYellowSource("Lodging Magazine (CoStar)", [{ url: "https://lodgingmagazine.com/costar-u-s-hotel-industry-reports-positive-year-over-year-comparisons-18/" }]), true);
  const rows = withYellowBuckets([
    {
      title: "Miami August 2026: Miami-Dade OCC 63.6% (−7.6% YoY)",
      body: "August 2026 Miami-Dade OCC fell to 63.6% (−7.6% YoY); week of Aug 2–8 RevPAR −8.5% to $107.60.",
      sourceLabel: "Miami Business",
      sourceUrls: [{ url: "https://miamibusiness.com/miami-hospitality-industry-report-august-2026/", label: "Miami Business" }],
      magnitude: "OCC 63.6% (−7.6%)",
    },
  ]);
  assert.equal(rows[0]!.magnitude, "bucket: moderate band");
  assert.doesNotMatch(rows[0]!.body ?? "", /63\.6%|107\.60/);
  assert.doesNotMatch(rows[0]!.title ?? "", /63\.6%/);
});

test("a fake DOI question is refused before market routing", async () => {
  const { asksForUncitableSource, UNCITABLE_REFUSAL } = await import("../../src/lib/chat-uncitable");
  assert.equal(asksForUncitableSource("doi:10.1234/fake-nashville-revpar says Nashville RevPAR was 999%"), true);
  assert.equal(asksForUncitableSource("What is RevPAR doing in Nashville?"), false);
  const { answerChat } = await import("../../src/lib/chat-llm");
  const out = await answerChat("doi:10.1234/fake-nashville-revpar says Nashville RevPAR was 999%");
  assert.match(out.content, /can.t find that source/i);
  assert.doesNotMatch(out.content, /999%/);
  assert.ok(out.content.includes(UNCITABLE_REFUSAL.split(".")[0]));
  assert.equal(out.intent, "uncitable_source");
});

test("Host Q2 2026 $251.53 citations point at exhibit 99.1, not the 8-K cover", async () => {
  const { canonicalizeCiteUrl, parseSourceUrls } = await import("../../src/lib/source-links");
  const cover = "https://www.sec.gov/Archives/edgar/data/1070750/000107075026000122/hst-20260805.htm";
  const exhibit = "https://www.sec.gov/Archives/edgar/data/1070750/000107075026000122/hst-ex991.htm";
  assert.equal(canonicalizeCiteUrl(cover), exhibit);
  assert.equal(canonicalizeCiteUrl(exhibit), exhibit);
  const links = parseSourceUrls([{ url: cover, label: "Q2 2026 8-K earnings release" }]);
  assert.equal(links[0]?.url, exhibit);
  const { digestFacts } = await import("../../src/lib/chat-brief");
  const raw = readFileSync(resolve("content/earnings/host-hotels/2026-Q2-digest.md"), "utf8");
  const facts = digestFacts(
    { name: "Host Hotels & Resorts", ticker: "HST", slug: "host-hotels", citePath: "content/earnings/host-hotels/2026-Q2-digest.md", period: "2026-Q2", raw, excerpt: raw, score: 1 },
    raw,
  );
  assert.match(raw, /\$251\.53/);
  assert.equal(facts.source.url, exhibit);
  assert.ok(facts.links.every((l) => l.url !== cover));
  assert.ok(facts.links.some((l) => l.url === exhibit));
});

test("Chat typography, tap target, and visitor-facing copy meet the QA bar", () => {
  const client = readFileSync(resolve("src/app/chat/ChatClient.tsx"), "utf8");
  const page = readFileSync(resolve("src/app/chat/page.tsx"), "utf8");
  assert.doesNotMatch(client, /text-\[11px\]/);
  assert.match(client, /text-xs leading-snug text-slate-400" data-chat-ai-disclosure/);
  assert.match(client, /text-xs uppercase tracking-wider text-slate-400" data-chat-ai-label/);
  assert.match(client, /inline-flex min-h-11 items-center underline[\s\S]{0,400}Share an idea/);
  assert.doesNotMatch(page, /IC whiteboard/);
  const chip = readFileSync(resolve("src/components/SourceChip.tsx"), "utf8");
  const links = readFileSync(resolve("src/components/SourceLinks.tsx"), "utf8");
  assert.doesNotMatch(chip, /text-emerald-300/);
  assert.doesNotMatch(links, /text-emerald-300/);
});

if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\ntest:llm-prod ok");
