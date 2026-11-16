process.env.BUNGAH_NO_NEXT_CACHE = "1";
/**
 * Unit tests for the Groq production-ready Chat path (no network, no DB).
 * Covers model allowlist, caps/429 fallback signals, pack redaction, output guards,
 * disclosure copy, and the draft privacy page.
 */
import { existsSync, readFileSync } from "node:fs";
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
import { isYellowSource, withYellowBuckets, withoutYellowBrokerLists } from "../../src/lib/yellow-sources";
import { formatSupplyPressureLead, formatSupplyPressureCard } from "../../src/lib/chat-supply-score";
import { isLicensedAttributionUrl } from "../../src/lib/licensed-attribution";
import { isLicensedLink, creditsLicensedSource, stripLicensed, withoutLicensedSources } from "../../src/lib/licensed-sources";

import { isAirliftQuestion, loadAirliftSignals, airportMentionedIn, airliftFactsFor } from "../../src/lib/chat-airlift";
import { looksLikeIdea } from "../../src/lib/chat-ideas";
import { STR_TABLE_REFUSAL, LICENSED_DATA_REFUSAL, asksForStrTable, asksForLicensedData } from "../../src/lib/chat-str";
import { buildGdeltQuery, isCurrentEventsQuestion, needsCurrentFacts } from "../../src/lib/chat-web-search";
import { CITED_SOURCE_MISS, isNoMarketMemo, stripLeadingPunctuation } from "../../src/lib/chat-llm";
import { LLM_TIMEOUT_MS } from "../../src/lib/chat-llm-cap";
import { classifyIntent } from "../../src/lib/chat-intent";
import { NO_PROPERTY_FACTS, resolveNamedAsset } from "../../src/lib/chat-named-asset";
import { SIGNED_OUT_LOG_RETENTION_DAYS, signedOutLogPurgeWhere } from "../../src/lib/chat-store";

import type { GraphContext } from "../../src/lib/chat";

const failures: string[] = [];
const testRuns: Promise<void>[] = [];
async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  const run = (async () => {
    try {
      await fn();
      console.log(`ok  ${name}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      failures.push(`${name}: ${msg}`);
      console.error(`FAIL  ${name}: ${msg}`);
    }
  })();
  testRuns.push(run);
  await run;
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

test("licensed-data baits (CoStar comps / cap rates) are detected and stay off the LLM", () => {
  const costarComps =
    "eric-qa-golden: Give me the CoStar comps for recent Dallas hotel sales, including cap rates and price per key from CoStar.";
  assert.equal(asksForLicensedData(costarComps), true);
  assert.equal(asksForStrTable(costarComps), false);
  assert.equal(asksForLicensedData("What's the RevPAR read for Dallas?"), false);
  assert.equal(asksForLicensedData("Give me Kalibri Labs comps and cap rates for Atlanta hotels"), true);
  assert.match(LICENSED_DATA_REFUSAL, /don't share CoStar, STR, Kalibri, HotStats, or Lodging Econometrics data/i);
  assert.match(LICENSED_DATA_REFUSAL, /cap rates/i);
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

test("r10d: stripLeadingPunctuation drops a leftover leading comma from LLM text", () => {
  assert.equal(stripLeadingPunctuation(", the FAA issued a nationwide ground stop"), "the FAA issued a nationwide ground stop");
  assert.equal(stripLeadingPunctuation("  ;:…  Recovery was slow"), "Recovery was slow");
  assert.equal(stripLeadingPunctuation("ADR is the average revenue earned per occupied room per day."), "ADR is the average revenue earned per occupied room per day.");
  assert.equal(stripLeadingPunctuation("From cited open sources:, the FAA issued a nationwide ground stop"), "From cited open sources: the FAA issued a nationwide ground stop");
  assert.equal(stripLeadingPunctuation(""), "");
});

test("r10d: the chat route caches deterministic answers even when Groq is on, never LLM or personal content", () => {
  const routeSrc = readFileSync(resolve("src/app/api/chat/route.ts"), "utf8");
  assert.doesNotMatch(routeSrc, /useCache\s*=\s*!isLlmEnabled\(\)/);
  assert.match(routeSrc, /lookupCachedAnswer/);
  assert.match(routeSrc, /personal = isPrivate \|\| history\.length > 0/);
  assert.match(routeSrc, /value\.mode === "llm"/);
  const call = routeSrc.match(/answerKey\(\{[^}]*\}\)/g) ?? [];
  assert.equal(call.length, 1);
  assert.doesNotMatch(call[0] ?? "", /prev|seen/);
});

test("r10d: lookupCachedAnswer hits L1 after a stored deterministic build", async () => {
  const { cachedAnswer, lookupCachedAnswer } = await import("../../src/lib/chat-cache");
  const key = `r10d-test-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  let builds = 0;
  const first = await cachedAnswer(key, async () => {
    builds += 1;
    return { mode: "deterministic", n: 7 };
  });
  assert.equal(first.value.n, 7);
  assert.equal(builds, 1);
  const hit = await lookupCachedAnswer<{ mode: string; n: number }>(key);
  assert.ok(hit, "expected an L1 or L2 hit");
  assert.equal(hit!.value.n, 7);
  assert.equal(hit!.status === "hit-mem" || hit!.status === "hit-shared", true, hit!.status);
  assert.equal(builds, 1);
  const miss = await lookupCachedAnswer(key + "-absent");
  assert.equal(miss, null);
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

test("public packs drop Implied rooms (STR market) and yellow broker hosts from source lists", () => {
  const rows = withoutYellowBrokerLists([
    {
      title: "Los Angeles supply: Snapshot",
      body: "Implied rooms (STR market): ~112,390 (Q2 supply room-nights ÷ 91, derived) · Q2 2026 | Metro opening in 2026: >1,400 · Feb 2026",
      sourceLabel: "Cushman & Wakefield · pressdemocrat.com · LA Business Journal · sccai.org · Marcus & Millichap",
      sourceUrls: [
        { url: "https://www.cushmanwakefield.com/report.pdf", label: "Metro opening in 2026" },
        { url: "https://www.marcusmillichap.com/research/hospitality-market-report", label: "Implied rooms (STR market)" },
      ],
    },
  ]);
  assert.equal(rows.length, 1);
  assert.doesNotMatch(rows[0].body ?? "", /Implied rooms \(STR market\)/);
  assert.doesNotMatch(rows[0].sourceLabel ?? "", /Marcus|Millichap|sccai/i);
  assert.match(rows[0].sourceLabel ?? "", /Cushman & Wakefield/);
  const urls = (rows[0].sourceUrls as { url?: string; label?: string }[]).map((l) => l.url ?? "");
  assert.ok(!urls.some((u) => /marcusmillichap/i.test(u)));
  assert.ok(urls.some((u) => /cushmanwakefield/i.test(u)));
  assert.match(rows[0].body ?? "", />1,400/);
});

test("Matthews, Kidder, HVS, Wronka, Newmark, SCCAI, Marcus & Millichap, and Hawaii DBEDT hotel-performance are Yellow; tax PDFs and CMRE stay green", () => {
  assert.equal(isYellowSource("Matthews Q3 2025 DFW", [{ url: "https://cms.matthews.com/s/Matthews-Q3-2025-DFW-Hospitality-Report.pdf" }]), true);
  assert.equal(isYellowSource("Kidder Mathews", [{ url: "https://kidder.com/wp-content/uploads/hotel-market-research-2025-4q.pdf" }]), true);
  assert.equal(isYellowSource("HVS", [{ url: "https://www.hvs.com/article/10529-world-cup" }]), true);
  assert.equal(isYellowSource("HVI", [{ url: "https://hvi.hvs.com/market/dallas" }]), true);
  assert.equal(isYellowSource("Wronka, Ltd.", [{ url: "https://wronkaltd.com/Boston-MA-hospitality.pdf" }]), true);
  assert.equal(isYellowSource("Newmark Hotel-Nsights", [{ url: "https://nmrk.imgix.net/reports/Hotel-Nsights-Atlanta.pdf" }]), true);
  assert.equal(isYellowSource("SCCAI", [{ url: "https://sccai.org/Hotel-Motel-Market-Overview.pdf" }]), true);
  assert.equal(isYellowSource("Marcus & Millichap", [{ url: "https://www.marcusmillichap.com/research/hospitality-market-report" }]), true);
  assert.equal(isYellowSource("State of Hawaii DBEDT", [{ url: "https://files.hawaii.gov/dbedt/economic/tourism/hotel-performance-2026-07.pdf" }]), true);
  assert.equal(isYellowSource("HI Dept. of Taxation", [{ url: "https://files.hawaii.gov/tax/stats/monthly/202512liab-by-d_tat.pdf" }]), false);
  assert.equal(isYellowSource("CMRE Partners", [{ url: "https://cmrepartners.com/blog/seattle-bellevue-hotels-2026/" }]), false);
});

test("attribution text and baked URLs are licensed (Kalibri, HotStats, LE, Matthews, Kidder, OSC, Choose Chicago, HHH)", () => {
  for (const s of [
    "Source: Kalibri Labs, Newmark",
    "HotStats RevPAR index",
    "Q2 2026 U.S. Hotel Construction Pipeline Trend Report from Lodging Econometrics (LE)",
    "According to CoStar, Boston occupancy was 72.5%",
    "CoSTAR results showed December demand was up by 7.8%",
  ]) {
    assert.equal(creditsLicensedSource(s), true, s);
  }
  assert.equal(isLicensedAttributionUrl("https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf"), true);
  assert.equal(isLicensedAttributionUrl("https://kidder.com/wp-content/uploads/market_report/hotel-market-research-seattle-2026-2q.pdf"), true);
  assert.equal(isLicensedAttributionUrl("https://cdn.choosechicago.com/uploads/2026/01/Hotel-Performance-2025.pdf"), true);
  assert.equal(isLicensedAttributionUrl("https://www.osc.ny.gov/files/reports/osdc/2026/pdf/nyc-hotel-industry-report-july-2026.pdf"), true);
  assert.equal(isLicensedAttributionUrl("https://hawaiihotelhui.com/wp-content/uploads/HHH-August-2026-Market-Intelligence-Report.pdf"), true);
  assert.equal(isLicensedAttributionUrl("https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/"), true);
  assert.equal(isLicensedAttributionUrl("https://www.matthews.com/insights/dallas-fort-worth-tx-hospitality-market-report-q3-2025"), true);
  assert.equal(isLicensedLink({ url: "https://cmrepartners.com/blog/seattle-bellevue-hotels-2026/" }), false);
  assert.equal(isLicensedAttributionUrl("https://files.hawaii.gov/tax/stats/monthly/202512liab-by-d_tat.pdf"), false);
});

test("Nashville supply-pressure lead is a Bungah score with no LE counts or credit", () => {
  const sig = {
    title: "Nashville supply-pressure score 4/5",
    body: "Nashville supply-pressure score 4/5 — YE 2025 Lodging Econometrics pipeline. LE rankings: #3 total pipeline 122 / 16,281; #4 starts next 12 mo 49 / 6,623.",
    sourceLabel: "lodgingeconometrics.com (accessed 2026-10-11)",
    sourceUrls: [{ url: "https://lodgingeconometrics.com/pipeline", label: "Lodging Econometrics YE 2025" }],
  };
  const lead = formatSupplyPressureLead("Nashville", sig);
  assert.match(lead, /Bungah supply-pressure score 4\/5/);
  assert.doesNotMatch(lead, /122|16,281|49|6,623|lodgingeconometrics/i);
  const card = formatSupplyPressureCard(sig);
  assert.match(card.title, /Bungah supply-pressure score 4\/5/);
  assert.doesNotMatch(card.body, /122|16,281|lodgingeconometrics/i);
});

test("generic LE abbreviations and mixed LE rollups are licensed and dropped", () => {
  assert.equal(creditsLicensedSource("Total pipeline (LE MSA): 122 · 16,281"), true);
  assert.equal(creditsLicensedSource("Stage rollup (LE Q2 2026 public)"), true);
  const row = {
    title: "Nashville pipeline: Stage rollup",
    body: "Total pipeline (LE MSA): 122 · 16,281 | Start next 12 mo: 49 · 6,623 | Downtown UC (NDP): 1,515.",
    sourceLabel: "Lodging Econometrics · ctycms.com",
    sourceUrls: [
      { url: "https://lodgingeconometrics.com/u-s-hotel-development-trends-projections-summer-2026/", label: "Lodging Econometrics" },
      { url: "https://ctycms.com/tn-nashville/docs/2026-market-conditions-report-q2-1.pdf", label: "ctycms.com" },
    ],
  };
  assert.equal(stripLicensed(row), null);
  const kept = withoutLicensedSources([row]);
  assert.equal(kept.length, 0);
});

test("unverified LA OCC, NYC 5.875% wrapper rate, and Boston 6.5% wrapper rate are dropped", async () => {
  const { withoutUnverifiedFigures } = await import("../../src/lib/licensed-attribution");
  const rows = withoutUnverifiedFigures([
    {
      marketSlug: "los-angeles",
      title: "Los Angeles visitation / demand volume",
      body: "Visitors 2025: 49.5M (Discover Los Angeles) | Hotel OCC 2025 (thru Nov): 71.6%; ADR $196; RevPAR flat YoY (2026 (secondary); source: https://www.hotel-online.com/news/hotel-market-outlook-2026-a-market-by-market-analysis)",
      sourceLabel: "Discover Los Angeles · Hotel Online",
      sourceUrls: [
        { url: "https://www.discoverlosangeles.com/visitors-to-los-angeles-generated-426-billion-in-business-sales-and-supported-more-than-530000-jobs" },
        { url: "https://www.hotel-online.com/news/hotel-market-outlook-2026-a-market-by-market-analysis" },
      ],
    },
    {
      marketSlug: "new-york-city",
      title: "New York City hotel occupancy tax, quarterly cash receipts — Jan–Mar 2026 (FY2026 Q3)",
      body: "Receipts: $194M. NYC hotel room occupancy tax 5.875% + $2.00/room-night.",
      sourceLabel: "NYC Comptroller Quarterly Cash Report",
    },
    {
      marketSlug: "new-york-city",
      title: "New York City hotel occupancy tax, fiscal-year cash receipts — FY2025 (Jul 2024–Jun 2025)",
      body: "Receipts: $801M. NYC hotel room occupancy tax 5.875% + $2.00/room-night.",
      sourceLabel: "NYC Comptroller Quarterly Cash Report",
    },
    {
      marketSlug: "new-york-city",
      title: "NYC hotel room occupancy tax: 5.875% + $2.00/room/night",
      body: "NYC hotel room occupancy tax: 5.875% + $2.00/room/night · NYC Dept of Finance",
      sourceLabel: "NYC Dept of Finance",
      sourceUrls: [{ url: "https://www.nyc.gov/site/finance/business/business-hotel-room-occupancy-tax.page" }],
    },
    {
      marketSlug: "boston",
      title: "Boston local room occupancy excise, annual — FY2025 (Jul 2024–Jun 2025)",
      body: "Amount: $147,088,220. Boston local room occupancy excise 6.5% (state 5.7% and 2.75% convention center fee not included; total 14.95%).",
      sourceLabel: "City of Boston budget",
    },
  ]);
  const la = rows.find((r) => r.marketSlug === "los-angeles");
  assert.ok(la);
  assert.doesNotMatch(la!.body ?? "", /71\.6%|ADR \$196/);
  assert.match(la!.body ?? "", /49\.5M/);
  const nycRows = rows.filter((r) => r.marketSlug === "new-york-city");
  const nycQcr = nycRows.find((r) => /quarterly cash receipts/.test(r.title ?? ""));
  const nycFy = nycRows.find((r) => /fiscal-year cash receipts/.test(r.title ?? ""));
  const nycDof = nycRows.find((r) => /Dept of Finance/.test(r.sourceLabel ?? ""));
  assert.ok(nycQcr && nycFy && nycDof);
  assert.doesNotMatch(nycQcr!.body ?? "", /5\.875%/);
  assert.doesNotMatch(nycFy!.body ?? "", /5\.875%/);
  assert.match(nycDof!.body ?? "", /5\.875%/);
  const bos = rows.find((r) => r.marketSlug === "boston");
  assert.ok(bos);
  assert.doesNotMatch(bos!.body ?? "", /6\.5%/);
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

test("news and sports questions are current-events, not hotel-figure questions", () => {
  assert.equal(isCurrentEventsQuestion("What are the top U.S. news headlines today?"), true);
  assert.equal(needsCurrentFacts("What are the top U.S. news headlines today?"), true);
  assert.equal(isCurrentEventsQuestion("Who won last night's World Cup qualifying match that everyone is talking about?"), true);
  assert.equal(needsCurrentFacts("Who won last night's World Cup qualifying match that everyone is talking about?"), true);
  assert.equal(isCurrentEventsQuestion("What is RevPAR doing in Miami?"), false);
  assert.equal(isCurrentEventsQuestion("How did the World Cup affect Dallas hotels?"), false);
});

test("Boston occupancy-excise and hotel-tax wording route to tax_collections, not RevPAR", () => {
  assert.equal(classifyIntent("What's Boston's occupancy-excise?"), "tax_collections");
  assert.equal(classifyIntent("Boston occupancy excise rate"), "tax_collections");
  assert.equal(classifyIntent("What is the NYC hotel occupancy-tax rate?"), "tax_collections");
  assert.equal(classifyIntent("How is Dallas visitation and hotel occupancy tax collections?"), "tax_collections");
  assert.equal(classifyIntent("What's RevPAR in Boston?"), "revpar_metrics");
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


test("Houston First monthly prints split so an opening date does not label OCC/ADR/RevPAR", async () => {
  const { expandMonthlyReleaseItem } = await import("../../src/lib/chat-brief");
  const downtown =
    "Downtown / CBD: OCC 52%, ADR $191, RevPAR $100 · OCC 53%, ADR $205, RevPAR $108 (+17%) · Dec 2025: OCC 45% on supply growth while demand rose 1.7%. New 275-key HIE/Staybridge opened Apr 2026.";
  const parts = expandMonthlyReleaseItem(downtown, ["Aug 2026", "Jul 2026", "Dec 2025"]);
  const blob = parts.join("\n");
  assert.ok(parts.some((p) => /RevPAR \$100/.test(p) && /Aug 2026/.test(p) && !/Apr 2026/.test(p)), blob);
  assert.ok(parts.some((p) => /RevPAR \$108/.test(p) && /Jul 2026/.test(p) && !/Apr 2026/.test(p)), blob);
  assert.ok(parts.some((p) => /opened Apr 2026/.test(p) && !/RevPAR \$100/.test(p)), blob);
  assert.ok(parts.some((p) => /OCC 45%/.test(p) && /Dec 2025/.test(p) && !/opened Apr 2026/.test(p)), blob);
});

test("r9: a figure leaves with its dropped source and is never re-pointed at a surviving link", async () => {
  const { withoutOrphanedFigures, itemOrigins } = await import("../../src/lib/source-provenance");
  const row = {
    id: "w1s-dallas-snapshot",
    title: "Dallas supply: Snapshot",
    body: "Dallas — Snapshot. DFW room inventory (submarket table sum): ~111,285 rooms · Q3 2025 | City of Dallas tax-registry rooms: 38,733 (−30 YoY) · 2026 filings | Rooms under construction (DFW): 4,600 rooms / 38 projects · Q3 2025 (source: Same). Decision support.",
    magnitude: "3 rows",
    sourceUrls: [
      { url: "https://cms.matthews.com/wp-content/uploads/2025/10/Q325-DFW-Hospitality.pdf", label: "DFW room inventory (submarket table sum)" },
      { url: "https://www.texashotelsearch.com/markets/dallas", label: "City of Dallas tax-registry rooms" },
    ],
  };
  const origins = itemOrigins(row.body, row.sourceUrls).map((x) => x.origin);
  assert.match(origins[0], /matthews/);
  assert.match(origins[1], /texashotelsearch/);
  assert.match(origins[2], /texashotelsearch/, "(source: Same) inherits the previous item");
  const dropped = { ...row, sourceUrls: [row.sourceUrls[1]] };
  const [out] = withoutOrphanedFigures([row], [dropped]);
  assert.ok(out, "row with a surviving public item stays");
  assert.doesNotMatch(out.body, /111,285/);
  assert.match(out.body, /38,733/);
  // Unlabeled item whose fallback origin was the dropped first link goes too.
  const row2 = { ...row, id: "x2", body: "DFW room inventory (submarket table sum): ~111,285 rooms · Q3 2025 | Rooms under construction (DFW): 4,600 rooms / 38 projects · Q3 2025 | City of Dallas tax-registry rooms: 38,733" };
  const [out2] = withoutOrphanedFigures([row2], [{ ...row2, sourceUrls: [row.sourceUrls[1]] }]);
  assert.doesNotMatch(out2.body, /4,600|111,285/);
  assert.match(out2.body, /38,733/);
  // Every link gone: the row goes.
  assert.equal(withoutOrphanedFigures([row], [{ ...row, sourceUrls: [] }]).length, 0);
  // Qualitative band from a yellow source is not shown as the survivor's.
  const band = { ...row, id: "x3", body: "Hotel performance is in a qualitative band only; this source republishes STR-derived occupancy and ADR, so raw figures are not shown. (as-of 2026-10-11)" };
  assert.equal(withoutOrphanedFigures([row], [{ ...band, id: row.id, sourceUrls: [row.sourceUrls[1]] }]).length, 0);
});

test("r9 number-truth overlay: unverified figures drop, never retarget; simpleview / HVS placeholders gone", async () => {
  const { withNumberTruth, numberTruthSnapshotUrl } = await import("../../src/lib/number-truth");
  const overlay = JSON.parse(readFileSync(resolve("src/data/number-truth-r9.json"), "utf8"));
  assert.ok(Object.keys(overlay.rows).length > 0 && Object.keys(overlay.items).length > 0);
  // Every overlay entry is a drop or a clause removal: no entry carries a replacement URL.
  assert.doesNotMatch(JSON.stringify(overlay.items) + JSON.stringify(overlay.edits), /"(?:url|newUrl)"\s*:/);
  const houston = { id: "w1s-houston-snapshot", title: "Houston supply: Snapshot", magnitude: "2 rows", sourceUrls: [{ url: "https://www.texashotelsearch.com/markets/houston" }],
    body: 'Houston — Snapshot. Metro inventory: ">100,000 rooms" (Woodlands to Texas City) · 2026 | City tax-registry rooms: 68,260 · 2026. Decision support.' };
  const [h] = withNumberTruth([houston]);
  assert.doesNotMatch(h.body, /100,000/);
  assert.match(h.body, /^Houston — Snapshot\. City tax-registry rooms: 68,260/);
  assert.equal(h.magnitude, "1 rows");
  assert.equal(withNumberTruth([{ id: "tax-orlando-202608-m", title: "x", body: "y", magnitude: "$24.83M" }]).length, 0, "occompt 403 row dropped");
  const dallas = { id: "w1c-dallas-debt-market-level-reads", title: "t", sourceUrls: [{ url: "https://example.gov/a" }],
    body: "Dallas — debt & deals: Market-level reads. Arlington June 2026 HOT: $31M (+39%, all-time record) · Jun 2026 | HVS/CBRE Dallas cap read, lodging DQ cut: no public read (source: no public read). Decision support." };
  assert.doesNotMatch(withNumberTruth([dallas])[0].body, /HVS\/CBRE/);
  const phx = { id: "w1d-phoenix-d3", title: "Phoenix demand", sourceUrls: [{ url: "https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_x.pdf" }, { url: "https://www.visitphoenix.com/a", label: "visitphoenix.com https://www.visitphoenix.com/a; simpleviewinc.com https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_x.pdf" }],
    body: "Phoenix (D3). FY25/26 bookings: 671 meetings (source: https://assets.simpleviewinc.com/simpleview/image/upload/v1/clients/phoenix/SV_08449394_compressed_x.pdf) | Visitors 2025: 21M (source: https://www.visitphoenix.com/a)" };
  const [p] = withNumberTruth([phx]);
  assert.doesNotMatch(JSON.stringify(p), /simpleviewinc/);
  assert.match(p.body, /21M/);
  assert.equal(numberTruthSnapshotUrl("las-vegas", "LVCVA FAQ YE 2025 (updated 06/2026)"), "https://www.lvcva.com/research/faqs/");
  assert.equal(numberTruthSnapshotUrl("las-vegas", "Some other source"), undefined, "a snapshot is only re-cited to the page its own label names");
});

test("r9: YoY label is idempotent on cached rows; headline-news questions never use Wikipedia", async () => {
  const { withVerifiedYoY } = await import("../../src/lib/tax-yoy");
  const rows = [
    { id: "a", title: "NYC tax — FY2026 (Jul 2025–Jun 2026)", body: "Collections: $847M · YoY: +5.7% (computed)", magnitude: "$847M (+5.7% YoY) · cash" },
    { id: "b", title: "NYC tax — FY2025 (Jul 2024–Jun 2025)", body: "Collections: $801M", magnitude: "$801M · cash" },
  ];
  const once = withVerifiedYoY(rows);
  const twice = withVerifiedYoY(withVerifiedYoY(once));
  assert.equal(twice[0].magnitude, once[0].magnitude);
  assert.equal((twice[0].magnitude?.match(/Bungah calc\./g) ?? []).length <= 1, true, twice[0].magnitude ?? "");
  const { isHeadlineNewsQuestion } = await import("../../src/lib/chat-web-search");
  assert.equal(isHeadlineNewsQuestion("What are the top U.S. news headlines today?"), true);
  assert.equal(isHeadlineNewsQuestion("What's a recent news headline about the 2026 United States midterm elections?"), true);
  assert.equal(isHeadlineNewsQuestion("Who won last night's World Cup qualifying match that everyone is talking about?"), false);
  assert.equal(isHeadlineNewsQuestion("What is RevPAR doing in Miami?"), false);
  const src = readFileSync(resolve("src/lib/chat-web-search.ts"), "utf8");
  assert.match(src, /headlines \? \[\] : wiki/);
});

test("r9: Houston Hobby / NASA 65% is the July print; Uptown is not 'Uptown / Galleria'", async () => {
  const { expandMonthlyReleaseItem } = await import("../../src/lib/chat-brief");
  const hobby = expandMonthlyReleaseItem("Hobby / NASA: OCC 65% (+6%) · Highest Jul OCC", ["Aug 2026", "Jul 2026", "Dec 2025"]);
  assert.ok(hobby.some((p) => /65%/.test(p) && /Jul 2026/.test(p) && !/Aug 2026/.test(p)), hobby.join(" | "));
  const up = expandMonthlyReleaseItem("Uptown: OCC 54% (−7%), RevPAR $85 (−5%) · OCC 56%, RevPAR $93 · Weakest Aug trend", ["Aug 2026", "Jul 2026", "Dec 2025"]);
  assert.ok(up.some((p) => /\$93/.test(p) && /Jul 2026/.test(p) && !/Aug/.test(p)), up.join(" | "));
});

const GRAPH_FIXTURE = process.env.BUNGAH_GRAPH_FIXTURE || "/workspace/backups/bungah-db/latest";

async function runMarketMetricGapTests() {
  if (!existsSync(GRAPH_FIXTURE)) {
    throw new Error(`graph fixture missing at ${GRAPH_FIXTURE}`);
  }
  process.env.BUNGAH_GRAPH_FIXTURE = GRAPH_FIXTURE;
  process.env.BUNGAH_NO_NEXT_CACHE = "1";
  const { installGraphFixture } = await import("./graph-fixture");
  assert.equal(installGraphFixture(GRAPH_FIXTURE), true);
  const { answerChat } = await import("../../src/lib/chat-llm");
  const { askedMarketMetric, askedMarketFigure, isMarketFigureQuestion } = await import("../../src/lib/chat-brief-build");
  const { resolveFollowUp } = await import("../../src/lib/chat-followup");

  assert.equal(askedMarketMetric("What is RevPAR doing in Miami?", "revpar_metrics"), "revpar");
  assert.equal(askedMarketMetric("And supply there?", "supply_pipeline"), "supply");
  assert.equal(askedMarketMetric("What's demand doing in Miami?", "demand_visitation"), null);
  assert.equal(askedMarketFigure("What's demand doing in Miami?", "demand_visitation"), "visitation");
  assert.equal(askedMarketFigure("How is Dallas visitation and hotel occupancy tax collections?", "tax_collections"), "tax");
  assert.equal(isMarketFigureQuestion("How is Dallas visitation and hotel occupancy tax collections?", "tax_collections"), true);
  assert.equal(isMarketFigureQuestion("What is the NYC hotel occupancy-tax rate?", "tax_collections"), true);

  const headOf = (a: { content: string; brief?: { answer?: string; reads?: { text?: string }[] } | null }) =>
    a.brief?.answer ?? a.content.split("\n")[0];
  const hasPublicTaxLeft = (a: { content: string; brief?: { answer?: string } | null }) =>
    !/: no public market-wide or county hotel-tax figure on file/.test(headOf(a));
  const readsOf = (a: { brief?: { reads?: { text?: string }[] } | null }) =>
    (a.brief?.reads ?? []).map((r) => r.text ?? "").join("\n");
  const blobOf = (a: { content: string; brief?: { answer?: string; reads?: { text?: string }[] } | null }) =>
    `${headOf(a)}\n${readsOf(a)}\n${a.content}`;

  await test("Miami RevPAR uses the Chicago-style gap and does not call Groq for unsourced color", async () => {
    const prevLlm = process.env.BUNGAH_USE_LLM;
    const prevKey = process.env.GROQ_API_KEY;
    process.env.BUNGAH_USE_LLM = "true";
    process.env.GROQ_API_KEY = "gsk_test_not_a_real_key";
    let groqCalls = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (/groq/i.test(url)) groqCalls += 1;
      throw new Error(`test must not call the network (${url})`);
    }) as typeof fetch;
    try {
      const out = await answerChat("What is RevPAR doing in Miami?");
      assert.equal(out.mode, "deterministic");
      assert.equal(out.intent, "revpar_metrics");
      assert.equal(out.marketSlug, "miami");
      assert.match(headOf(out), /^Miami: no public market-wide or county RevPAR on file/);
      assert.doesNotMatch(blobOf(out), /63\.6%|I couldn't find a cited source right now/i);
      assert.doesNotMatch(headOf(out), /pax|Art Basel|winter seasonality/i);
      assert.match(readsOf(out), /pax/i);
      assert.equal(groqCalls, 0);
    } finally {
      globalThis.fetch = origFetch;
      if (prevLlm === undefined) delete process.env.BUNGAH_USE_LLM;
      else process.env.BUNGAH_USE_LLM = prevLlm;
      if (prevKey === undefined) delete process.env.GROQ_API_KEY;
      else process.env.GROQ_API_KEY = prevKey;
    }
  });

  await test("Dallas RevPAR stays deterministic: a public figure if one remains, otherwise the gap, never unsourced Groq color", async () => {
    const out = await answerChat("What is RevPAR doing in Dallas?");
    const head = headOf(out);
    assert.equal(out.mode, "deterministic");
    assert.equal(out.marketSlug, "dallas");
    assert.doesNotMatch(blobOf(out), /I couldn't find a cited source right now/i);
    assert.match(head, /^Dallas: no public market-wide or county RevPAR on file/);
    assert.doesNotMatch(head, /63\.0%|\$124\.87|\$78\.55|Matthews|\+30\.1%/i);
    assert.doesNotMatch(blobOf(out), /63\.0%|\$124\.87|\$78\.55|\+30\.1%/);
    assert.doesNotMatch(head, /2,389,896|flynashville|pax|DFW pax/i);
  });

  await test("Seattle / Chicago / Honolulu / Phoenix / Boston / NYC / Atlanta RevPAR do not quote licensed reprints", async () => {
    const cases: [string, string, RegExp][] = [
      ["What is RevPAR doing in Seattle?", "seattle", /68\.6%|70\.7%|\$239|\$169|mid-\$120s/i],
      ["What is RevPAR doing in Chicago?", "chicago", /69\.2%|\$243\.10|\$168\.15/],
      ["What's driving hotel demand in Chicago?", "chicago", /69\.2%|\$243\.10|\$168\.15/],
      ["What is RevPAR doing in Honolulu?", "honolulu", /80\.0%|\$277\.89|\$222\.27|79\.2%|\$294\.58|87\.8%/],
      ["What is RevPAR doing in Phoenix?", "phoenix", /66\.5%|\$173\.29|\$115\.27|72\.3%/],
      ["What is RevPAR doing in Boston?", "boston", /72\.5%|\+\$43\.76|\+\$32\.80/],
      ["What is RevPAR doing in New York City?", "new-york-city", /84\.1%|\$333\.71|\$280\.71/],
      ["What is RevPAR doing in Atlanta?", "atlanta", /66\.9%|\$134\.10|\$89\.66/],
    ];
    for (const [q, slug, banned] of cases) {
      const out = await answerChat(q);
      const head = headOf(out);
      assert.equal(out.mode, "deterministic", `${slug} mode ${out.mode}: ${head}`);
      assert.equal(out.marketSlug, slug, `${slug} routed to ${out.marketSlug}: ${head}`);
      assert.doesNotMatch(blobOf(out), banned, `${slug} leaked licensed figures: ${head}`);
      assert.doesNotMatch(blobOf(out), /I couldn't find a cited source right now/i);
    }
  });

  await test("A sports current-events question does not return the World Cup hotel memo", async () => {
    const prevSearch = process.env.BUNGAH_USE_WEB_SEARCH;
    const prevLlm = process.env.BUNGAH_USE_LLM;
    process.env.BUNGAH_USE_WEB_SEARCH = "false";
    process.env.BUNGAH_USE_LLM = "true";
    try {
      const out = await answerChat("Who won last night's World Cup qualifying match that everyone is talking about?");
      assert.equal(out.mode, "deterministic");
      assert.doesNotMatch(out.content, /underwriting|30[–-]70 bp|FY headwind|host-city ADR|normalize Jun/i);
      assert.match(out.content, /couldn't find a cited source right now/i);
    } finally {
      if (prevSearch === undefined) delete process.env.BUNGAH_USE_WEB_SEARCH;
      else process.env.BUNGAH_USE_WEB_SEARCH = prevSearch;
      if (prevLlm === undefined) delete process.env.BUNGAH_USE_LLM;
      else process.env.BUNGAH_USE_LLM = prevLlm;
    }
  });

  await test("Houston Downtown RevPAR is dated Aug 2026 and Jul 2026 from Houston First, not Apr 2026", async () => {
    const out = await answerChat("What is RevPAR doing in Houston?");
    const head = headOf(out);
    assert.equal(out.mode, "deterministic");
    assert.equal(out.marketSlug, "houston");
    assert.doesNotMatch(head, /Apr 2026/);
    const blob = blobOf(out);
    if (/RevPAR \$100|OCC 52%|ADR \$191/.test(blob)) {
      assert.match(blob, /Aug 2026/);
      assert.doesNotMatch(head, /RevPAR \$100[\s\S]{0,80}Apr 2026/);
    }
    if (/RevPAR \$108|OCC 53%|ADR \$205/.test(blob)) {
      assert.match(blob, /Jul 2026/);
    }
    assert.doesNotMatch(head, /\(Apr 2026, houstonfirst\.com\)/i);
  });

  await test("r9: Dallas supply / RevPAR never quote the Matthews inventory retargeted to texashotelsearch", async () => {
    for (const q of ["What's the hotel supply picture in Dallas?", "What's RevPAR in Dallas?", "And supply there?"]) {
      const out = await answerChat(q, { marketSlug: "dallas" } as never);
      const blob = `${headOf(out)}\n${readsOf(out)}`;
      assert.doesNotMatch(blob, /111,285|111K|4,600 rooms|38 projects/, `${q}: ${blob}`);
      for (const r of out.brief?.reads ?? []) {
        const rr = r as { text?: string; source?: { url?: string } };
        if (/texashotelsearch/.test(rr.source?.url ?? "")) assert.match(rr.text ?? "", /38,733|tax-registry/, rr.text);
      }
    }
  });

  await test("r9: Houston Hobby / NASA 65% is dated Jul 2026 and cites the July article", async () => {
    const out = await answerChat("What is RevPAR doing in Houston?");
    for (const r of out.brief?.reads ?? []) {
      const rr = r as { text?: string; source?: { url?: string } };
      if (/Hobby/.test(rr.text ?? "")) {
        assert.match(rr.text ?? "", /Jul 2026/);
        assert.doesNotMatch(rr.text ?? "", /Aug 2026/);
        assert.match(rr.source?.url ?? "", /july/);
      }
    }
    assert.doesNotMatch(blobOf(out).split("\n").slice(0, 4).join("\n"), /Uptown \/ Galleria/);
  });

  await test("Dallas visitation / HOT and NYC occupancy-tax stay deterministic and never reconstruct dropped figures via Groq", async () => {
    const prevLlm = process.env.BUNGAH_USE_LLM;
    const prevKey = process.env.GROQ_API_KEY;
    process.env.BUNGAH_USE_LLM = "true";
    process.env.GROQ_API_KEY = "gsk_test_not_a_real_key";
    let groqCalls = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (/groq/i.test(url)) groqCalls += 1;
      throw new Error(`test must not call the network (${url})`);
    }) as typeof fetch;
    try {
      const dallas = await answerChat("How is Dallas visitation and hotel occupancy tax collections?");
      assert.equal(dallas.mode, "deterministic", `Dallas tax mode ${dallas.mode}: ${headOf(dallas)}`);
      assert.equal(dallas.intent, "tax_collections");
      assert.equal(dallas.marketSlug, "dallas");
      assert.doesNotMatch(blobOf(dallas), /From our cited data/i);
      assert.doesNotMatch(blobOf(dallas), /\$79\.31|\$23\.87|\$79,306,924|\$23,873,98|\$80\.64|\$24\.25|\$80,641,384|\$24,247,916/i);
      assert.doesNotMatch(blobOf(dallas), /I couldn't find a cited source right now/i);
      if (!hasPublicTaxLeft(dallas)) {
        assert.match(headOf(dallas), /^Dallas: no public market-wide or county hotel-tax figure on file/);
      }

      const nyc = await answerChat("What is the NYC hotel occupancy-tax rate?");
      assert.equal(nyc.mode, "deterministic", `NYC tax mode ${nyc.mode}: ${headOf(nyc)}`);
      assert.equal(nyc.intent, "tax_collections");
      assert.equal(nyc.marketSlug, "new-york-city");
      assert.doesNotMatch(blobOf(nyc), /From our cited data/i);
      assert.doesNotMatch(blobOf(nyc), /I couldn't find a cited source right now/i);
      assert.equal(groqCalls, 0);
    } finally {
      globalThis.fetch = origFetch;
      if (prevLlm === undefined) delete process.env.BUNGAH_USE_LLM;
      else process.env.BUNGAH_USE_LLM = prevLlm;
      if (prevKey === undefined) delete process.env.GROQ_API_KEY;
      else process.env.GROQ_API_KEY = prevKey;
    }
  });

  await test("Nashville RevPAR leads with the gap, not flynashville passenger counts", async () => {
    const out = await answerChat("What is RevPAR doing in Nashville?");
    const head = headOf(out);
    assert.equal(out.mode, "deterministic");
    assert.equal(out.marketSlug, "nashville");
    assert.match(head, /^Nashville: no public market-wide or county RevPAR on file/);
    assert.doesNotMatch(head, /2,389,896|flynashville|pax/i);
    assert.match(readsOf(out), /2,389,896|\bpax\b|flynashville/i);
    assert.doesNotMatch(blobOf(out), /I couldn't find a cited source right now/i);
  });

  await test("Nashville supply follow-up is a deterministic cited supply answer, not unsourced Groq color", async () => {
    const prevLlm = process.env.BUNGAH_USE_LLM;
    const prevKey = process.env.GROQ_API_KEY;
    process.env.BUNGAH_USE_LLM = "true";
    process.env.GROQ_API_KEY = "gsk_test_not_a_real_key";
    let groqCalls = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (/groq/i.test(url)) groqCalls += 1;
      throw new Error(`test must not call the network (${url})`);
    }) as typeof fetch;
    try {
      const route = await resolveFollowUp({
        question: "And supply there?",
        scope: null,
        marketSlug: null,
        prev: { question: "What is RevPAR doing in Nashville?", intent: "revpar_metrics", marketSlug: "nashville", answerHash: "x", seen: [] },
      });
      assert.equal(route.marketSlug, "nashville");
      const out = await answerChat("And supply there?", {
        marketSlug: route.marketSlug,
        intent: route.intent,
        history: [
          { role: "user", content: "What is RevPAR doing in Nashville?" },
          { role: "assistant", content: "Nashville: no public market-wide or county RevPAR on file." },
        ],
      });
      assert.equal(out.mode, "deterministic");
      assert.equal(out.marketSlug, "nashville");
      assert.equal(out.intent, "supply_pipeline");
      assert.doesNotMatch(blobOf(out), /I couldn't find a cited source right now/i);
      const head = headOf(out);
      const supplyGap = /^Nashville: no public market-wide or county supply figure on file/.test(head);
      assert.equal(supplyGap, false, `Nashville should still show a Bungah supply-pressure score: ${head}`);
      assert.match(head, /Bungah supply-pressure score 4\/5/);
      assert.doesNotMatch(head, /122|16,281|49|6,623|lodgingeconometrics/i);
      assert.doesNotMatch(head, /^Nashville: no public market-wide or county RevPAR/);
      assert.equal(groqCalls, 0);
    } finally {
      globalThis.fetch = origFetch;
      if (prevLlm === undefined) delete process.env.BUNGAH_USE_LLM;
      else process.env.BUNGAH_USE_LLM = prevLlm;
      if (prevKey === undefined) delete process.env.GROQ_API_KEY;
      else process.env.GROQ_API_KEY = prevKey;
    }
  });

  // r10 (Eric r9): featured starters, REIT guidance, national debt, Simpleview, Miami/PBI, Hobby, NYC 5.875%.
  await test("r10: REIT guidance / national debt / market overlays never call Groq (LLM on, fetch blocked)", async () => {
    const prevLlm = process.env.BUNGAH_USE_LLM;
    const prevKey = process.env.GROQ_API_KEY;
    process.env.BUNGAH_USE_LLM = "true";
    process.env.GROQ_API_KEY = "gsk_test_not_a_real_key";
    let groqCalls = 0;
    const origFetch = globalThis.fetch;
    globalThis.fetch = (async (input: Parameters<typeof fetch>[0]) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (/groq/i.test(url)) groqCalls += 1;
      throw new Error(`test must not call the network (${url})`);
    }) as typeof fetch;
    try {
      const host = await answerChat("What did Host Hotels guide on the Q2 2026 call?");
      assert.equal(host.mode, "deterministic");
      assert.equal(host.intent, "reit_call");
      assert.ok(host.citations.length > 0 && host.citations.every((c) => c.trim()), "Host guide citations must be non-empty labels");
      assert.ok((host.sources ?? []).some((x) => /hst-ex991\.htm$/.test(x.url)), "Host guide must cite exhibit 99.1");
      assert.match(blobOf(host), /4\.75%–5\.25%/);
      assert.doesNotMatch(blobOf(host), /earnings digest, .Q2.|content\/earnings/i);
      for (const q of ["What did Pebblebrook guide on the Q2 2026 call?", "What's Park Hotels' outlook for 2026?", "How did RLJ do last quarter?", "What's the national hotel debt and refinancing picture?", "Where are hotel CMBS delinquencies heading?"]) {
        const out = await answerChat(q);
        assert.equal(out.mode, "deterministic", q);
        assert.notEqual(out.intent, "unknown", q);
      }
      const debt = await answerChat("What's the national hotel debt and refinancing picture?");
      assert.ok((debt.sources ?? []).length > 0 && (debt.sources ?? []).every((x) => /^https?:\/\//.test(x.url)), "national debt cites URLs");
      for (const q of ["What's happening with hotel debt here?", "Is labor a risk to the thesis here?"]) {
        const out = await answerChat(q, { scope: { kind: "market", id: "chicago" } });
        assert.equal(out.mode, "deterministic", `chicago ${q}`);
      }
      assert.equal(groqCalls, 0);
    } finally {
      globalThis.fetch = origFetch;
      if (prevLlm === undefined) delete process.env.BUNGAH_USE_LLM;
      else process.env.BUNGAH_USE_LLM = prevLlm;
      if (prevKey === undefined) delete process.env.GROQ_API_KEY;
      else process.env.GROQ_API_KEY = prevKey;
    }
  });

  await test("r10: Miami airport traffic never leads with Palm Beach (PBI) or Simpleview", async () => {
    const out = await answerChat("How is Miami and Fort Lauderdale airport traffic?");
    assert.equal(out.marketSlug, "miami");
    assert.doesNotMatch(headOf(out), /Palm Beach|480,992|Simpleview/i);
    assert.doesNotMatch(JSON.stringify(out.brief ?? {}), /clients\/pbi|simpleview/i);
    const pbi = await answerChat("How is Palm Beach airport traffic?");
    assert.doesNotMatch(headOf(pbi), /Simpleview/i);
  });

  await test("r10: Boston occupancy excise carries no Simpleview link or label", async () => {
    const out = await answerChat("What's Boston's occupancy-excise?");
    assert.doesNotMatch(JSON.stringify(out), /simpleview/i);
  });

  await test("r10: Houston Hobby / NASA question leads with the July print at its July link", async () => {
    const out = await answerChat("What's hotel occupancy in Houston Hobby / NASA?");
    assert.match(headOf(out), /Hobby \/ NASA: OCC 65% \(\+6%\) · Jul 2026/);
    const lead = out.brief?.leadSources?.[0];
    assert.match(lead?.url ?? "", /solid-rates-and-demand-in-july/);
    assert.doesNotMatch(headOf(out), /Aug 2026/);
  });

  await test("r10: NYC 5.875% cites the current NYC-HTX return, not the 2021 EO page", async () => {
    const out = await answerChat("What is the NYC hotel occupancy-tax rate?");
    const line = out.content.split("\n").find((l) => /5\.875% \+ \$2\.00/.test(l)) ?? "";
    assert.match(line, /nyc-htx_2025\.pdf/);
    assert.doesNotMatch(line, /business-hotel-room-occupancy-tax\.page|accessed/);
  });
}

// typography test is sync and already registered; run the fixture cases before the summary.

void (async () => {
  await Promise.all(testRuns);
  await runMarketMetricGapTests();
  await Promise.all(testRuns);
  if (failures.length) {
    console.error(`\n${failures.length} failed`);
    process.exit(1);
  }
  console.log("\ntest:llm-prod ok");
})();
