/**
 * $0 live-search fallback. Groq browser_search is paid ($5/1000) and is never called.
 *
 * Route (preview): Wikimedia APIs (Wikipedia + Wikidata) and, for news, the GDELT DOC 2.0
 * API, plus official U.S. government RSS when the question is about FAA / Fed / BLS.
 *
 * Terms (checked 15 Nov 2026):
 * - Wikimedia: official APIs; automated use allowed if we send a descriptive User-Agent,
 *   respect rate limits, and attribute CC BY-SA content
 *   (https://foundation.wikimedia.org/wiki/Policy:Terms_of_Use,
 *   https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_API_Usage_Guidelines,
 *   https://wikitech.wikimedia.org/wiki/Robot_policy).
 * - GDELT: official DOC API, no key, "unlimited and unrestricted use for any academic,
 *   commercial, or governmental use of any kind without fee"; redistribution must cite
 *   the GDELT Project and link https://www.gdeltproject.org/
 *   (https://www.gdeltproject.org/about.html).
 * - Official U.S. government feeds are published for syndication; works of the U.S.
 *   federal government are generally public domain.
 *
 * Rejected for automated/commercial use: Groq browser_search (paid); DuckDuckGo HTML
 * scraping (not authorized); DuckDuckGo Instant Answer API (commercial use needs email
 * approval); Google News RSS and Bing News RSS (personal, non-commercial feed-reader use only).
 */
import { isLicensedText } from "./licensed-sources";

const UA = "BungahChatBot/1.0 (https://bungah.io/privacy; halvespucci@gmail.com)";

export function isWebSearchEnabled(): boolean {
  return process.env.BUNGAH_USE_WEB_SEARCH?.trim().toLowerCase() === "true";
}

const SOCIAL =
  /(?:^|\.)((?:linkedin|twitter|facebook|instagram|tiktok|reddit|threads|x|bsky|bluesky|truthsocial|snapchat|pinterest|whatsapp|telegram)\.com|x\.com|bsky\.app|t\.co)$/i;

export function isBlockedSearchHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (SOCIAL.test(host) || SOCIAL.test("." + host)) return true;
    if (/(^|\.)(str\.com|costar\.com|costargroup\.com)$/i.test(host)) return true;
    return false;
  } catch {
    return true;
  }
}

const CURRENT_FACT =
  /\b(today|tonight|yesterday|last night|this (week|month|year)|latest|breaking|news|current|recent|right now|as of|what happened|ground stop|FAA|interest rates?|who (is|won|won'?s)|when (were|was)|elected|headlines?|qualifying match)\b/i;

export function needsCurrentFacts(question: string): boolean {
  return CURRENT_FACT.test(question);
}

const HOTEL_FIGURE = /\b(hotel|hotels|revpar|occupancy|adr|underwriting|pipeline|lodging tax|supply-pressure|room rates?)\b/i;
const NEWS_OR_SPORT =
  /\b(news headlines?|top .{0,40}headlines?|breaking news|who won|last night'?s|qualifying match|sports? (score|headline|news)|match that everyone)\b/i;

/** General news or sports questions that should use free open search, not a hotel World Cup memo. */
export function isCurrentEventsQuestion(question: string): boolean {
  if (NEWS_OR_SPORT.test(question)) return true;
  if (needsCurrentFacts(question) && /\b(news|headlines?|breaking|elected|who won|last night|qualifying)\b/i.test(question) && !HOTEL_FIGURE.test(question)) return true;
  return false;
}

export const SEARCH_DAILY_CAP = Number(process.env.BUNGAH_SEARCH_DAILY_CAP || 40);
export const SEARCH_USER_DAILY_CAP = Number(process.env.BUNGAH_SEARCH_USER_DAILY_CAP || 8);
export const SEARCH_TIMEOUT_MS = Number(process.env.BUNGAH_SEARCH_TIMEOUT_MS || 8_000);

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
  const n = b.users.get(subject) ?? 0;
  if (n >= SEARCH_USER_DAILY_CAP) return { ok: false, reason: "cap_user" };
  return { ok: true };
}

export function reserveSearch(subject: string): void {
  const b = roll();
  b.org += 1;
  b.users.set(subject, (b.users.get(subject) ?? 0) + 1);
}

export type LiveSourceFact = {
  label: string;
  url: string;
  asOf: string;
  text: string;
  license?: string;
};

export type LiveSearchHit = {
  facts: LiveSourceFact[];
  pack: string;
  citations: string[];
};

function retrievedOn(): string {
  return new Date().toISOString().slice(0, 10);
}

async function getJson(url: string, timeoutMs = SEARCH_TIMEOUT_MS): Promise<unknown | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function getText(url: string, timeoutMs = SEARCH_TIMEOUT_MS): Promise<{ status: number; text: string } | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/rss+xml, application/xml, text/xml, application/json, */*" },
      signal: ctrl.signal,
    });
    const text = await res.text();
    return { status: res.status, text };
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function cleanSnippet(html: string, max = 500): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

async function wikipediaFacts(question: string): Promise<LiveSourceFact[]> {
  const out: LiveSourceFact[] = [];
  const asOf = retrievedOn();
  const searchUrl =
    "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&utf8=1&srlimit=3&srsearch=" +
    encodeURIComponent(question);
  const search = (await getJson(searchUrl)) as { query?: { search?: { title: string; snippet?: string }[] } } | null;
  const hits = search?.query?.search ?? [];
  const titles = hits.map((h) => h.title).filter(Boolean).slice(0, 2);
  for (const title of titles) {
    const exUrl =
      "https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageprops&exintro=1&explaintext=1&ppprop=wikibase_item&format=json&titles=" +
      encodeURIComponent(title);
    const page = (await getJson(exUrl)) as {
      query?: { pages?: Record<string, { title?: string; extract?: string; pageprops?: { wikibase_item?: string }; missing?: unknown }> };
    } | null;
    const rec = Object.values(page?.query?.pages ?? {})[0];
    if (!rec || rec.missing || !rec.extract) continue;
    const url = "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"));
    if (isBlockedSearchHost(url) || isLicensedText(rec.extract)) continue;
    out.push({
      label: `Wikipedia, ${title}`,
      url,
      asOf,
      text: rec.extract.slice(0, 800),
      license: "CC BY-SA 4.0",
    });
    const qid = rec.pageprops?.wikibase_item;
    if (qid) {
      const office = await wikidataOfficeholder(qid);
      if (office) out.push(office);
    }
  }
  return out;
}

function timeValue(v: unknown): string | null {
  if (v && typeof v === "object" && "time" in (v as object)) {
    const t = String((v as { time: string }).time);
    const m = t.match(/([+-]?\d{4}-\d{2}-\d{2})/);
    return m ? m[1].replace(/^\+/, "") : t;
  }
  return null;
}

async function wikidataOfficeholder(qid: string): Promise<LiveSourceFact | null> {
  const url = `https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(qid)}.json`;
  const data = (await getJson(url)) as {
    entities?: Record<string, { claims?: Record<string, { rank?: string; mainsnak?: { datavalue?: { value?: { id?: string } } }; qualifiers?: Record<string, { datavalue?: { value?: unknown } }[]> }[]> }>;
  } | null;
  const claims = data?.entities?.[qid]?.claims;
  if (!claims) return null;
  const props = ["P1308", "P6", "P35", "P169"]; // officeholder, head of government, head of state, chief executive
  let chosen: { id: string; start?: string | null } | null = null;
  for (const pid of props) {
    const sts = claims[pid] ?? [];
    const preferred = sts.filter((s) => s.rank === "preferred");
    const pool = preferred.length ? preferred : sts.filter((s) => s.rank !== "deprecated");
    const current = pool.filter((s) => !(s.qualifiers?.P582 && s.qualifiers.P582.length));
    const st = current[0] ?? pool[0];
    const id = st?.mainsnak?.datavalue?.value?.id;
    if (!id) continue;
    const start = st?.qualifiers?.P580?.[0]?.datavalue?.value;
    chosen = { id, start: timeValue(start) };
    break;
  }
  if (!chosen) return null;
  const person = (await getJson(`https://www.wikidata.org/wiki/Special:EntityData/${encodeURIComponent(chosen.id)}.json`)) as {
    entities?: Record<string, { labels?: { en?: { value?: string } } }>;
  } | null;
  const name = person?.entities?.[chosen.id]?.labels?.en?.value;
  if (!name) return null;
  const asOf = chosen.start || retrievedOn();
  return {
    label: `Wikidata, current officeholder (${qid})`,
    url: `https://www.wikidata.org/wiki/${chosen.id}`,
    asOf,
    text: `Current officeholder: ${name}${chosen.start ? ` (in office from ${chosen.start})` : ""}.`,
  };
}

const GDELT_STOP = new Set(
  "what what's who whom when where why how which a an the about cite source sources citation citations headline headlines please can you tell me give send latest current today tonight yesterday this week month year recent news breaking right now as of were was elected is are was a for with from that those these into your our their its and the".split(
    /\s+/
  )
);
const GDELT_WEAK = new Set(["united", "states", "american", "national", "question"]);

/** Build a GDELT DOC query: drop question-function words, quote a short topic phrase, require English. */
export function buildGdeltQuery(question: string): string {
  const raw = question.replace(/[?!:;,./]+/g, " ").replace(/\s+/g, " ").trim();
  const tokens = raw
    .split(" ")
    .map((w) => w.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9']+$/g, ""))
    .filter((w) => w.length >= 3 && !GDELT_STOP.has(w.toLowerCase()));
  if (!tokens.length) return "";
  const topic = tokens.slice(0, 8);
  const years = topic.filter((w) => /^\d{4}$/.test(w));
  const distinctive = topic.filter((w) => !/^\d{4}$/.test(w) && !GDELT_WEAK.has(w.toLowerCase()));
  const phraseWords = (distinctive.length ? distinctive : topic).slice(0, 2);
  const used = new Set([...phraseWords, ...years].map((w) => w.toLowerCase()));
  const extra = topic.filter((w) => !used.has(w.toLowerCase())).join(" ");
  const phrase = phraseWords.length >= 2 ? `"${phraseWords.join(" ")}"` : phraseWords[0];
  return [phrase, ...years, extra, "sourcelang:english"].filter(Boolean).join(" ").trim();
}

let lastGdeltAt = 0;
async function fetchGdeltJson(query: string): Promise<{ articles?: { url?: string; title?: string; seendate?: string; domain?: string }[] } | null> {
  const url =
    "https://api.gdeltproject.org/api/v2/doc/doc?mode=ArtList&format=json&maxrecords=8&timespan=14d&sort=DateDesc&query=" +
    encodeURIComponent(query);
  const wait = 8000 - (Date.now() - lastGdeltAt);
  if (wait > 0 && lastGdeltAt) await new Promise((r) => setTimeout(r, wait));
  lastGdeltAt = Date.now();
  const raw = await getText(url, 20_000);
  if (!raw) return null;
  if (raw.status === 429 || /limit requests to one every/i.test(raw.text)) {
    await new Promise((r) => setTimeout(r, 20_000));
    lastGdeltAt = Date.now();
    const retry = await getText(url, 20_000);
    if (!retry || retry.status === 429 || /limit requests to one every/i.test(retry.text)) return null;
    try {
      return JSON.parse(retry.text) as { articles?: { url?: string; title?: string; seendate?: string; domain?: string }[] };
    } catch {
      return null;
    }
  }
  try {
    return JSON.parse(raw.text) as { articles?: { url?: string; title?: string; seendate?: string; domain?: string }[] };
  } catch {
    return null;
  }
}

export async function gdeltFacts(question: string): Promise<LiveSourceFact[]> {
  const q = buildGdeltQuery(question);
  if (q.length < 5) return [];
  const data = await fetchGdeltJson(q);
  const out: LiveSourceFact[] = [];
  for (const a of data?.articles ?? []) {
    const href = a.url ?? "";
    if (!href || isBlockedSearchHost(href) || isLicensedText(`${a.title ?? ""} ${href}`)) continue;
    const seen = a.seendate ? `${a.seendate.slice(0, 4)}-${a.seendate.slice(4, 6)}-${a.seendate.slice(6, 8)}` : retrievedOn();
    out.push({
      label: `GDELT Project / ${a.domain || "news"}, ${cleanSnippet(a.title || href, 160)}`,
      url: href,
      asOf: seen,
      text: `${cleanSnippet(a.title || "", 200)} (indexed by the GDELT Project, https://www.gdeltproject.org/).`,
    });
    if (out.length >= 5) break;
  }
  return out;
}

function parseRssItems(xml: string, limit = 4): { title: string; link: string; date: string }[] {
  const items: { title: string; link: string; date: string }[] = [];
  const parts = xml.split(/<item[\s>]/i).slice(1);
  for (const part of parts) {
    const title = cleanSnippet((part.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "", 200);
    const link = cleanSnippet((part.match(/<link[^>]*>([\s\S]*?)<\/link>/i) || [])[1] || "", 300);
    const date = cleanSnippet((part.match(/<(?:pubDate|updated|dc:date)[^>]*>([\s\S]*?)<\/(?:pubDate|updated|dc:date)>/i) || [])[1] || "", 80);
    if (!title || !link || !link.startsWith("http")) continue;
    if (isBlockedSearchHost(link)) continue;
    items.push({ title, link, date: date.slice(0, 16) || retrievedOn() });
    if (items.length >= limit) break;
  }
  return items;
}

async function govRssFacts(question: string): Promise<LiveSourceFact[]> {
  const q = question.toLowerCase();
  const feeds: { url: string; label: string; match: RegExp }[] = [
    { url: "https://www.federalreserve.gov/feeds/press_all.xml", label: "Board of Governors of the Federal Reserve System, press RSS", match: /\b(fed|fomc|interest rates?|federal reserve|fed funds)\b/i },
    { url: "https://www.bls.gov/feed/bls_latest.rss", label: "U.S. Bureau of Labor Statistics, latest RSS", match: /\b(bls|unemployment|cpi|payroll|jobs report|labor)\b/i },
    { url: "https://www.faa.gov/rss/news.xml", label: "Federal Aviation Administration, news RSS", match: /\b(faa|ground stop|airlift|air traffic|airport)\b/i },
  ];
  const out: LiveSourceFact[] = [];
  for (const feed of feeds) {
    if (!feed.match.test(q)) continue;
    const got = await getText(feed.url);
    if (!got || got.status !== 200 || !got.text.includes("<item")) continue;
    for (const it of parseRssItems(got.text)) {
      out.push({
        label: feed.label,
        url: it.link,
        asOf: it.date || retrievedOn(),
        text: it.title,
      });
    }
  }
  return out;
}

export async function freeLiveSearch(question: string): Promise<LiveSearchHit | null> {
  const [wiki, news, gov] = await Promise.all([
    wikipediaFacts(question).catch(() => [] as LiveSourceFact[]),
    needsCurrentFacts(question) || isCurrentEventsQuestion(question) || /\bnews\b/i.test(question)
      ? gdeltFacts(question).catch(() => [] as LiveSourceFact[])
      : Promise.resolve([] as LiveSourceFact[]),
    govRssFacts(question).catch(() => [] as LiveSourceFact[]),
  ]);
  const facts = [...wiki, ...gov, ...news].filter((f) => f.text && f.url && !isBlockedSearchHost(f.url));
  if (!facts.length) return null;
  const asOf = retrievedOn();
  const lines = facts.map((f) => {
    const lic = f.license ? `, ${f.license}` : "";
    return `- ${f.label} (${f.url}, as-of/retrieved ${f.asOf}${lic}): ${f.text}`;
  });
  const pack = [
    `=== CITED OPEN SOURCES (retrieved ${asOf}; paraphrase in your own words; each figure needs source, link, as-of) ===`,
    ...lines,
    "GDELT items, if any, must be cited to the GDELT Project (https://www.gdeltproject.org/) and the publisher URL.",
    "=== END CITED OPEN SOURCES ===",
  ].join("\n");
  const citations = [...new Set(facts.map((f) => `${f.label} (${f.url}, as-of ${f.asOf})`))];
  return { facts, pack, citations };
}
