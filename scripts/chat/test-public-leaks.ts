/**
 * Public-text leak guard (Eric QA r4 must-fix, Nov 1 2026): no filesystem path, code file, dataset ID used as a label,
 * query-string fragment or internal code ("(D3)") in any public answer, citation or page text.
 *   1. Unit: stripLeaks / findLeaks / guardPublic / cleanSourceLabel / scrubInternal on the known leaks and on lookalikes
 *      that must survive ("1000-room", "I-35", "FY25-FY26", URLs).
 *   2. Every market's page text (titles, bodies, magnitudes, source labels, link labels) as the market page renders it.
 *   3. Every market × a question set through answerChat (deterministic), plus national questions: every string in the
 *      answer (content, brief, citations, sources) except URLs.
 * Needs BUNGAH_GRAPH_FIXTURE for 2–3.
 */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";

async function main() {
  const { stripLeaks, findLeaks, guardPublic, cleanSourceLabel, scrubInternal } = await import("@/lib/public-text");
  const fails: string[] = [];
  let checks = 0;
  const check = (ok: boolean, msg: string) => {
    checks++;
    if (!ok) fails.push(msg);
  };

  // 1. Unit.
  const DALLAS_ROW = "City of Dallas HOT FY2025 (registry): Ch.351 7% / $79.31M; Ch.334 venue 2% / $23.87M (tax proxy, not RevPAR) (2026-09-28; source: /workspace/bungah-capital-intel/src/data/msa-registry.ts (Texas HOT SODA er34-v24h))";
  const d = stripLeaks(DALLAS_ROW);
  check(d === "City of Dallas HOT FY2025: Ch.351 7% / $79.31M; Ch.334 venue 2% / $23.87M (tax proxy, not RevPAR) (2026-09-28; source: Texas Comptroller hotel occupancy tax data (Local HOT Reporting, FY2025) → https://data.texas.gov/dataset/Local-Hotel-Occupancy-Tax-Reporting-2025/er34-v24h)", `Dallas registry row → public Comptroller citation: ${d}`);
  check(stripLeaks("Dallas visitation / demand volume (D3). Dallas visitors 2024") === "Dallas visitation / demand volume. Dallas visitors 2024", "(D3) removed");
  check(stripLeaks("Washington DC — 3. Operator bench (D11). Donohoe") === "Washington DC — 3. Operator bench. Donohoe", "(D11) removed");
  check(stripLeaks("x (matrix D2): y") === "x: y", "(matrix D2) removed");
  const nyc = stripLeaks("TY2024 total rent $11.777B (2025-07; source: msa-registry.ts / https://www.nyc.gov/assets/finance/downloads/pdf/reports/reports_htx/2024_htx_report.pdf)");
  check(nyc === "TY2024 total rent $11.777B (2025-07; source: https://www.nyc.gov/assets/finance/downloads/pdf/reports/reports_htx/2024_htx_report.pdf)", `NYC file prefix dropped, URL kept: ${nyc}`);
  check(stripLeaks("Texas Comptroller Local HOT Reporting 2025 SODA er34-v24h (data.texas.gov); city=San Antonio type=city") === "Texas Comptroller of Public Accounts (data.texas.gov) — Local Hotel Occupancy Tax Reporting, FY2025", "dataset-ID source label → publisher + period");
  check(cleanSourceLabel("Texas Comptroller Local HOT Reporting 2025 SODA er34-v24h (data.texas.gov); city=Dallas type=city") === "Texas Comptroller of Public Accounts (data.texas.gov) — Local Hotel Occupancy Tax Reporting, FY2025", "cleanSourceLabel runs the guard");
  check(stripLeaks("legacy SODA vmy5-jctb lacked City of Dallas rows") === "legacy dataset lacked City of Dallas rows", "bare dataset ID dropped");
  for (const leak of ["see /home/box/.secrets/neon.env", "from src/lib/chat.ts", "per scripts/ops/predeploy.sh", "msa-registry.ts", "notes.md", "dataset ifh4-9tpn", "city=Dallas type=city", "(D7)", "~/bungah/x.json", "/tmp/out.csv"]) {
    const out = stripLeaks(`Row ${leak} end`);
    check(findLeaks(out).length === 0, `leak survived: ${JSON.stringify(leak)} → ${JSON.stringify(out)}`);
    check(findLeaks(`Row ${leak} end`).length > 0, `findLeaks missed ${JSON.stringify(leak)}`);
    check(findLeaks(scrubInternal(`Row ${leak} end`)).length === 0, `scrubInternal let through ${JSON.stringify(leak)}`);
  }
  for (const ok of ["A 1000-room hotel near I-35 (FY25-FY26).", "RevPAR +6.3% (Q2 2026, Cushman & Wakefield)", "See https://data.texas.gov/resource/er34-v24h.json?type=city&name=Dallas", "Under construction: 38 · 4,184", "  - nested list item", "Ch.351 7% / $79.31M"]) {
    check(stripLeaks(ok) === ok, `clean text changed: ${JSON.stringify(ok)} → ${JSON.stringify(stripLeaks(ok))}`);
    check(findLeaks(ok).length === 0, `false positive: ${JSON.stringify(ok)} → ${findLeaks(ok).join(", ")}`);
  }
  const g = guardPublic({ content: "x (D3). y", brief: { reads: [{ text: "a (registry): 1", source: { url: "https://x.org/a/b.md", label: "src/data/x.ts" } }] }, citations: ["Texas Comptroller Local HOT Reporting 2025 SODA er34-v24h (data.texas.gov); city=Dallas type=city"], answerHash: "0123456789abcdef", intent: "tax_collections" });
  check(g.content === "x. y" && g.brief.reads[0].text === "a: 1" && g.brief.reads[0].source.url === "https://x.org/a/b.md" && g.brief.reads[0].source.label === "" && !/SODA|er34/.test(g.citations[0]) && g.answerHash === "0123456789abcdef", `guardPublic deep: ${JSON.stringify(g)}`);

  if (!process.env.BUNGAH_GRAPH_FIXTURE) throw new Error("set BUNGAH_GRAPH_FIXTURE");
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { retrieveGraphContext } = await import("@/lib/chat");
  const { answerChat } = await import("@/lib/chat-llm");
  const { briefLine } = await import("@/lib/public-text");
  const { parseSourceUrls } = await import("@/lib/source-links");
  const { markets } = await retrieveGraphContext("markets");
  // The raw graph had leaks (sanity: the scan below would see them if the guard were off).
  // Every signal row in the fixture dump (the DB as of the snapshot), read straight from the file.
  const { readFileSync } = await import("node:fs");
  const { gunzipSync } = await import("node:zlib");
  const { join } = await import("node:path");
  const raw = gunzipSync(readFileSync(join(process.env.BUNGAH_GRAPH_FIXTURE, "Signal.jsonl.gz")))
    .toString("utf8")
    .split("\n")
    .filter(Boolean)
    .map((l) => JSON.parse(l)) as { title: string; body: string; sourceLabel: string }[];
  const rawLeaks = raw.filter((s) => findLeaks(`${s.title} ${s.body} ${s.sourceLabel}`).length).length;
  check(rawLeaks > 0, "fixture has no raw leaks (scan would be vacuous)");

  // 2. Market page text, as src/app/markets/[slug]/page.tsx renders it (scrubInternal / briefLine / cleanSourceLabel).
  let pageStrings = 0;
  const pageBad: string[] = [];
  for (const m of raw as unknown as { title: string; body: string; sourceLabel: string; magnitude: string | null; sourceUrls: unknown }[]) {
    const parts = [scrubInternal(m.title), briefLine(scrubInternal(m.title), m.body), scrubInternal(m.body), scrubInternal(m.magnitude), cleanSourceLabel(m.sourceLabel), ...parseSourceUrls(m.sourceUrls).map((l) => scrubInternal(l.label))];
    for (const p of parts) {
      pageStrings++;
      const l = findLeaks(p);
      if (l.length) pageBad.push(`${m.title.slice(0, 50)}: ${l.join(", ")}`);
    }
  }
  check(pageBad.length === 0, `market-page text leaks: ${pageBad.slice(0, 5).join(" || ")}`);

  // 3. Every market × questions, plus national.
  const QS = ["How is {m} doing?", "What's the RevPAR and occupancy read for {m}?", "What are the hotel tax collections in {m}?", "How many visitors does {m} get?", "What's the supply pipeline in {m}?", "{m} debt and deals", "Who are the operators in {m}?", "What events are coming up in {m}?", "{m} airport traffic", "Should I buy a hotel in {m}?", "Why is occupancy down in {m}?", "Why are rates up in {m}?"];
  const NATIONAL = ["Why is SOFR up?", "Where is the 10-year Treasury?", "What's the national hotel debt and refinancing picture?", "What's the national RevPAR and ADR picture?", "Which markets have the heaviest supply?", "Compare Nashville vs Charlotte", "Compare Dallas vs Houston"];
  const strings = (o: unknown, key = "", out: string[] = []): string[] => {
    if (typeof o === "string") {
      if (!["url", "href", "answerHash", "id"].includes(key)) out.push(o);
    } else if (Array.isArray(o)) o.forEach((x) => strings(x, key, out));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) strings(v, k, out);
    return out;
  };
  let answers = 0;
  const bad: string[] = [];
  const name = (m: { name: string }) => m.name.split(/[–—,]/)[0].trim();
  const qs = [...markets.flatMap((m) => QS.map((q) => q.replace("{m}", name(m)))), ...NATIONAL];
  for (const q of qs) {
    const a = await answerChat(q);
    answers++;
    for (const s of strings(a)) {
      const l = findLeaks(s);
      if (l.length) bad.push(`${q}: ${l.join(", ")}`);
    }
  }
  check(bad.length === 0, `answer leaks: ${[...new Set(bad)].slice(0, 8).join(" || ")}`);
  console.log(`leak scan: ${rawLeaks} raw signals with leaks in the graph; ${pageStrings} market-page strings and ${answers} answers (${markets.length} markets × ${QS.length} questions + ${NATIONAL.length} national) scanned`);
  console.log(`public-leak test: ${checks - fails.length}/${checks} checks pass`);
  for (const f of fails) console.log("FAIL", f);
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
