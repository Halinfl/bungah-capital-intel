/**
 * Live web-search fallback for Chat, using Groq's built-in browser_search on the Production
 * model openai/gpt-oss-120b (powered by Exa; existing GROQ_API_KEY; no new signup).
 *
 * Compound / compound-mini were decommissioned 21 Sep 2026. This is the remaining Groq path.
 * Enabled only when BUNGAH_USE_WEB_SEARCH is the exact string `true` (preview per-deployment).
 * Filter: no social sites, no STR/CoStar. Caps sit beside the LLM caps.
 */
import { isLicensedLink, isLicensedText } from "./licensed-sources";

export function isWebSearchEnabled(): boolean {
  return process.env.BUNGAH_USE_WEB_SEARCH?.trim().toLowerCase() === "true";
}

const SOCIAL =
  /(?:^|\.)((?:linkedin|twitter|facebook|instagram|tiktok|reddit|threads|x|bsky|bluesky|truthsocial|snapchat|pinterest|whatsapp|telegram)\.com|x\.com|bsky\.app|t\.co)$/i;

export function isBlockedSearchHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./i, "");
    if (SOCIAL.test(host) || SOCIAL.test("." + host)) return true;
    if (isLicensedLink({ url, label: host })) return true;
    return false;
  } catch {
    return true;
  }
}

const CURRENT_FACT =
  /\b(today|tonight|yesterday|this (week|month|year)|latest|breaking|news|current|right now|as of|what happened|ground stop|FAA|interest rates?)\b/i;

export function needsCurrentFacts(question: string): boolean {
  return CURRENT_FACT.test(question);
}

export const SEARCH_DAILY_CAP = Number(process.env.BUNGAH_SEARCH_DAILY_CAP || 40);
export const SEARCH_USER_DAILY_CAP = Number(process.env.BUNGAH_SEARCH_USER_DAILY_CAP || 8);
export const SEARCH_TIMEOUT_MS = Number(process.env.BUNGAH_SEARCH_TIMEOUT_MS || 20_000);

type Bucket = { day: string; org: number; users: Map<string, number> };
let bucket: Bucket = { day: "", org: 0, users: new Map() };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
function roll(): Bucket {
  const d = today();
  if (bucket.day !== d) bucket = { day: d, org: 0, users: new Map() };
  return bucket;
}

export function checkSearchCap(subject: string): { ok: true } | { ok: false; reason: "cap_org" | "cap_user" } {
  const b = roll();
  if (b.org >= SEARCH_DAILY_CAP) return { ok: false, reason: "cap_org" };
  if ((b.users.get(subject) ?? 0) >= SEARCH_USER_DAILY_CAP) return { ok: false, reason: "cap_user" };
  return { ok: true };
}

export function reserveSearch(subject: string): void {
  const b = roll();
  b.org += 1;
  b.users.set(subject, (b.users.get(subject) ?? 0) + 1);
}

export type WebSearchHit = {
  content: string;
  citations: string[];
  usedSearch: boolean;
};

const SEARCH_SYSTEM = `You are Bungah Capital Intel's chat. You may use the browser_search tool to find current, citable facts.

Rules:
- Only a few facts, in your own words. Never invent a figure, a source, a URL, or a date.
- Every figure must have a source name, URL, and as-of or published date from a page you actually opened.
- If you cannot find a good source, say so. Do not guess.
- Do not use LinkedIn, X/Twitter, Facebook, Instagram, TikTok, Reddit, or other social sites. Do not use STR or CoStar or reprints of their hotel-performance figures.
- Prefer government, company IR and SEC filings, airports, CVBs, and established news outlets.
- Never give a buy, sell, or hold recommendation, and never recommend a deal.
- Never say a property is "in foreclosure"; use only "the subject of reported lender or court proceedings" if a cited source supports a legal proceeding, otherwise say you don't have cited information on that property.
- Never name internal team or agent names.
- Do not use 【】 citation markers. Cite in prose.
- Start the answer with a short line: "From a live web search:"`;

export async function groqBrowserSearch(opts: {
  question: string;
  packSummary?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  apiKey: string;
  model?: string;
}): Promise<WebSearchHit | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);
  try {
    const history = (opts.history ?? []).slice(-8).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 1500),
    }));
    const user = [
      opts.packSummary ? `Our cited data pack did not fully answer this. Pack context (do not invent from it):\n${opts.packSummary.slice(0, 2000)}\n` : "",
      `Question: ${opts.question}`,
    ]
      .filter(Boolean)
      .join("\n");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: opts.model || "openai/gpt-oss-120b",
        temperature: 0.2,
        max_completion_tokens: 800,
        reasoning_effort: "low",
        tool_choice: "auto",
        tools: [{ type: "browser_search" }],
        messages: [{ role: "system", content: SEARCH_SYSTEM }, ...history, { role: "user", content: user }],
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      console.error("[chat-web-search] groq status", res.status, err.slice(0, 200));
      return null;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    let content = (data.choices?.[0]?.message?.content ?? "").trim();
    if (!content) return null;
    // Drop blocked hosts if the model cited them as raw URLs.
    const urls = content.match(/https?:\/\/[^\s)\]>'"]+/g) ?? [];
    const blocked = urls.filter((u) => isBlockedSearchHost(u) || isLicensedText(u));
    if (blocked.length) {
      for (const u of blocked) content = content.replaceAll(u, "[source omitted]");
    }
    if (isLicensedText(content)) return null;
    const citations = [...new Set(urls.filter((u) => !isBlockedSearchHost(u) && !isLicensedText(u)))];
    if (!/^from a live web search/i.test(content)) content = `From a live web search:\n\n${content}`;
    return { content, citations, usedSearch: true };
  } catch (e) {
    console.error("[chat-web-search] failed", e instanceof Error ? e.message : "error");
    return null;
  } finally {
    clearTimeout(t);
  }
}
