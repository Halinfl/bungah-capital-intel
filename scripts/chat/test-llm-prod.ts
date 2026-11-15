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
import { isAirliftQuestion } from "../../src/lib/chat-airlift";
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
  const privacy = readFileSync(resolve("src/app/privacy/page.tsx"), "utf8");
  assert.match(privacy, /Draft — under legal review/);
  assert.match(privacy, /Chat privacy notice/);
  assert.match(privacy, /not a complete website privacy policy/);
  assert.match(privacy, /Bungah Capital LLC/);
  assert.match(privacy, /sent to Groq, a US-based/);
  assert.match(privacy, /Zero Data Retention/);
  assert.doesNotMatch(privacy, /pre-launch step|counsel has signed off|ZDR toggle/);
  assert.match(privacy, /Signed-in \(private\) Chat is not sent to Groq/);
  assert.match(privacy, /unless you opt in/);
  assert.match(privacy, /off by default/);
  assert.match(privacy, /not yet\s+a Chat settings toggle/);
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
  assert.match(wording, /Bungah Capital LLC/);
  assert.match(wording, /12 months/);
  assert.match(wording, /halvespucci@gmail.com/);
  assert.doesNotMatch(wording, /this wording should not go live until that confirmation/);
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

if (failures.length) {
  console.error(`\n${failures.length} failed`);
  process.exit(1);
}
console.log("\ntest:llm-prod ok");
