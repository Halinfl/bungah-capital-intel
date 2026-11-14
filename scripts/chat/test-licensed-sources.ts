/**
 * Licensed-source and brand-framing guard (Hal, Nov 13 2026, Chat Batch 1 r3):
 *   1. Unit: isLicensedText matches the STR company / CoStar forms and never bare "STR" meaning short-term rentals;
 *      stripLicensed drops / strips the known rows; neutralBrandText removes the Hilton-vs-Marriott framing.
 *   2. Graph: every fixture row through the filter: no kept title / body / label / link carries a licensed citation;
 *      the short-term-rental rows (LA STR TOT, Nashville STR share, Atlanta STR hotel tax, Dallas STR share, KC STR
 *      listings) survive with their STR wording; the market page filter (publicRows) does the same.
 *   3. Answers: every market × question type plus national questions through answerChat and sourcesForAnswer: no
 *      STR/CoStar citation, link or known STR/CoStar figure in any string or URL; no debt answer is led by a brand
 *      comparison, and no "outpaces" brand framing anywhere.
 * Needs BUNGAH_GRAPH_FIXTURE.
 */
export {};
process.env.BUNGAH_NO_NEXT_CACHE = "1";
process.env.BUNGAH_USE_LLM = "";

async function main() {
  const { isLicensedText, isLicensedLink, stripLicensed, withoutLicensedSources } = await import("@/lib/licensed-sources");
  const { neutralBrandText, isBrandCompare, BRAND_COMPARE } = await import("@/lib/brand-neutral");
  const fails: string[] = [];
  let checks = 0;
  const check = (ok: boolean, msg: string) => {
    checks++;
    if (!ok) fails.push(msg);
  };

  // 1. Unit.
  for (const t of ["C&W Q2 2026 (STR/CoStar): OCC 71.7%", "CoStar wk ending 2026-08-08", "Choose Chicago PDF (cdn.choosechicago.com; STR Inc)", "Visit Orlando Q3 2025 (Simpleview PDF; STR)", "GMCVB Industry Updates (STR)", "per STR, OCC rose", "data from str.com", "Implied rooms (STR market)", "STR forecast (Oʻahu): 2026F OCC 78.9%", "STR Jan–Jul 2025 (DDC cite)", "STR pipeline (UC + final planning)", "Lodging Magazine (CoStar)", "STR, Inc. data"])
    check(isLicensedText(t), `licensed: ${t}`);
  for (const t of ["Dallas STR ordinance upheld", "STR TOT (3114): $3,342,998", "STR revenue $540M = 21% of lodging revenue", "hotel vs STR remit scope varies", "city hotel tax $18.24M + STR hotel tax $3.59M", "(STR/short-term rental share 8.7%)", "STR listings ~+80%, STR OCC ~−20%", "Aerolux (121) is an STR-unit building", "Los Angeles city TOT (hotel + STR)", "oversupply was STR, not hotel keys", "Cottage/STR is the primary bed-base", "Underwrite against STR competition", "streets", "STRATEGY"])
    check(!isLicensedText(t), `not licensed (short-term rental / other): ${t}`);
  check(isLicensedLink({ url: "https://costar-na-prod.acquia.dshrp.com/products/str-benchmark/x" }) && isLicensedLink({ url: "https://www.cushmanwakefield.com/-/media/cw/marketbeat-pdfs/2026/q2/us-reports/national/national-hospitality-marketbeat-q2-2026.pdf" }) && !isLicensedLink({ url: "https://roadgenius.com/x", label: "County YTD" }), "licensed links");
  const pulse = stripLicensed({
    title: "Nashville supply: Latest pulse",
    body: "Nashville — Latest pulse (D2). County YTD: OCC 69.4% | C&W Q2 2026 (STR/CoStar): RevPAR $133 | CoStar wk ending 2026-08-08: ADR −4.1% | Event weekends 2026: CMA Fest 89.4%. Decision support.",
    sourceLabel: "roadgenius.com · Cushman & Wakefield · CoStar · fort-nash.com (accessed 2026-10-11)",
    sourceUrls: [{ url: "https://roadgenius.com/a", label: "County YTD" }, { url: "https://www.cushmanwakefield.com/national-hospitality-marketbeat-q2-2026.pdf", label: "C&W Q2 2026 (STR/CoStar)" }, { url: "https://costar-na-prod.acquia.dshrp.com/x", label: "CoStar wk ending 2026-08-08" }, { url: "https://www.fort-nash.com/p", label: "Event weekends 2026" }],
    magnitude: "4 rows",
  });
  check(pulse?.body === "Nashville — Latest pulse (D2). County YTD: OCC 69.4% | Event weekends 2026: CMA Fest 89.4%. Decision support." && pulse?.sourceLabel === "roadgenius.com · fort-nash.com (accessed 2026-10-11)" && (pulse?.sourceUrls as unknown[]).length === 2 && pulse?.magnitude === "2 rows", `pulse strip: ${JSON.stringify(pulse)}`);
  check(stripLicensed({ title: "Nashville Q2 2026 (C&W MarketBeat, STR/CoStar): OCC 71.7%", body: "x", sourceLabel: "C&W", sourceUrls: [] }) === null, "STR/CoStar title row dropped");
  check(stripLicensed({ title: "Miami August", body: "OCC 63.6%; week RevPAR −8.5%.", sourceLabel: "Miami Business; Lodging Magazine (CoStar)", sourceUrls: [{ url: "https://miamibusiness.com/a", label: "Miami Business" }, { url: "https://lodgingmagazine.com/costar-u-s-hotel", label: "Lodging Magazine" }] }) === null, "CoStar-cited row with no separable item dropped");
  // A licensed print republished by another publisher (same market's rows) goes too, rounded or not.
  const rep = withoutLicensedSources([
    { title: "Chicago supply: Latest pulse", body: "Chicago — Latest pulse (D2). CoStar wk ending Aug 8: ADR +15.2% to $206.21 | Other: x", sourceLabel: "CoStar", sourceUrls: [{ url: "https://costar.com/a", label: "CoStar wk ending Aug 8" }, { url: "https://x.org", label: "Other" }] },
    { title: "Chicago week", body: "Week Aug 2–8, 2026: ADR +15.2% to $206.21 (largest of Top 25) | CBD 2025: ADR $293.7 | Host comparable RevPAR +2.0%", sourceLabel: "htrends.com", sourceUrls: [{ url: "https://htrends.com/a", label: "Week Aug 2–8, 2026" }] },
  ], ["GMCVB Industry Updates (STR) — ADR $293.67"]);
  check(rep.length === 2 && rep[1].body === "Host comparable RevPAR +2.0%" && !/206\.21/.test(rep[0].body ?? ""), `republished licensed figures removed: ${JSON.stringify(rep.map((r) => r.body))}`);
  const la = { title: "Los Angeles city TOT (hotel + STR)", body: "Hotel TOT: $26M · STR TOT: $3.3M", sourceLabel: "LA Controller", sourceUrls: [{ url: "https://controller.lacity.gov/x", label: "LA Controller" }] };
  check(stripLicensed(la) === la, "LA STR TOT row untouched");
  const trepp = neutralBrandText("Trepp brand cut: Hilton-flagged CMBS distress outpaces Marriott");
  check(!/outpaces|distress/i.test(trepp) && isBrandCompare({ text: trepp }), `brand title neutral and still flagged: ${trepp}`);
  const treppBody = neutralBrandText("Trepp brand cut (via CRE Daily, Oct 1): Hilton-flagged non-performing rate 11.73% vs Marriott 7.23%; Hilton full-service 16.17% (Palmer House $328.9M in foreclosure); Marriott limited-service 16.66% vs Hilton limited-service 3.59%.");
  check(!/outpaces|\bvs\b|distress|brand cut/i.test(treppBody) && /11\.73%/.test(treppBody) && /7\.23%/.test(treppBody), `brand body neutral: ${treppBody}`);
  const palmer = neutralBrandText("Palmer House Hilton's $328.9M CMBS loan is in foreclosure (Trepp brand cut: Hilton-flagged full-service NPL 16.17%). It is also on strike.");
  check(palmer === "Palmer House Hilton's $328.9M CMBS loan is in foreclosure (Trepp via CRE Daily, Oct 1). It is also on strike.", `Palmer House neutral: ${palmer}`);

  // 2. Graph.
  if (!process.env.BUNGAH_GRAPH_FIXTURE) throw new Error("set BUNGAH_GRAPH_FIXTURE");
  const { readFileSync } = await import("node:fs");
  const { gunzipSync } = await import("node:zlib");
  const { join } = await import("node:path");
  type Raw = { id: string; marketId: string | null; kind: string; title: string; body: string; sourceLabel: string; sourceUrls: unknown; magnitude: string | null };
  const raw = gunzipSync(readFileSync(join(process.env.BUNGAH_GRAPH_FIXTURE, "Signal.jsonl.gz"))).toString("utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) as Raw[];
  const linksOf = (r: { sourceUrls: unknown }) => (Array.isArray(r.sourceUrls) ? (r.sourceUrls as { url?: string; label?: string }[]) : []);
  const rowText = (r: Raw) => [r.title, r.body, r.sourceLabel, r.magnitude ?? "", ...linksOf(r).map((l) => `${l.label ?? ""} ${l.url ?? ""}`)].join(" \n ");
  const LIC_ANY = /\bco-?star\b|str-benchmark|\bstr\.com\b|national-hospitality-marketbeat/i;
  const before = raw.filter((r) => LIC_ANY.test(rowText(r)) || isLicensedText(rowText(r))).length;
  const kept = withoutLicensedSources(raw);
  const keptBad = kept.filter((r) => LIC_ANY.test(rowText(r)) || isLicensedText(rowText(r)));
  check(before > 50, `fixture has STR/CoStar rows to filter (${before})`);
  check(keptBad.length === 0, `kept rows with STR/CoStar: ${keptBad.slice(0, 5).map((r) => `${r.id}: ${rowText(r).match(/.{0,40}(?:co-?star|STR\b|marketbeat).{0,40}/i)?.[0]}`).join(" || ")}`);
  const byId = new Map(kept.map((r) => [r.id, r]));
  for (const id of ["w1-nash-cw-q2", "w1-dal-cw-q2", "sweep-20261011-us-costar-aug"]) check(!byId.has(id), `${id} dropped`);
  const nashPulse = byId.get("w1s-nashville-latest-pulse");
  check(Boolean(nashPulse && /County YTD through Sep 12 2026: OCC 69\.4%/.test(nashPulse.body) && !/\$133|71\.7%|158\.12/.test(nashPulse.body)), `Nashville pulse keeps county YTD only: ${nashPulse?.body.slice(0, 200)}`);
  // Short-term rentals survive with their STR wording.
  const strRows: [string, RegExp][] = [["w1x-nash-str-share", /STR revenue \$540M/], ["tax-los-angeles-202506-fy", /STR TOT/], ["w1c-atlanta-tax-collections-and-dmo-budget", /STR hotel tax/], ["w1s-dallas-latest-monthly-weekly-pulse", /STR\/short-term rental share 8\.7%/], ["wc2026-kansas-city", /STR listings ~\+80%/], ["w1d-nashville-d3", /STR share: \$540M/]];
  for (const [id, re] of strRows) {
    const rid = [...byId.keys()].find((k) => k === id || k.startsWith(id));
    check(Boolean(rid && re.test(byId.get(rid)!.body + " " + byId.get(rid)!.title)), `short-term-rental row survives: ${id} ${re}`);
  }
  const dallasOrd = raw.filter((r) => /\bSTR\b/.test(r.title + r.body) && /ordinance/i.test(r.title + r.body));
  for (const r of dallasOrd) check(byId.has(r.id) && /\bSTR\b/.test(byId.get(r.id)!.title + byId.get(r.id)!.body), `STR ordinance row survives: ${r.id}`);
  // The market page filter (format.ts publicRows) applies the same rules.
  const { publicRows } = await import("@/lib/format");
  const page = publicRows(raw.filter((r) => r.marketId) as never[]) as unknown as Raw[];
  check(page.length > 0 && page.every((r) => !LIC_ANY.test(rowText(r)) && !isLicensedText(rowText(r))), "market pages: no STR/CoStar row or link");
  check(page.every((r) => !/outpaces Marriott|Hilton-flagged CMBS distress|Trepp brand cut/.test(rowText(r))), "market pages: no brand framing");

  // 3. Answers.
  const { installGraphFixture } = await import("./graph-fixture");
  installGraphFixture();
  const { retrieveGraphContext, sourcesForAnswer } = await import("@/lib/chat");
  const { answerChat } = await import("@/lib/chat-llm");
  const { markets } = await retrieveGraphContext("markets");
  const QS = ["How is {m} doing?", "What's the RevPAR and occupancy read for {m}?", "How has RevPAR moved in {m} over the last 12 months?", "Why are rates up in {m}?", "Why is occupancy down in {m}?", "What's driving hotel demand in {m}?", "What's the supply pipeline in {m}?", "What's the hotel debt and refinancing picture in {m}?", "{m} debt and deals", "Is there a staffing greenlight in {m}?", "What events are coming up in {m}?", "What should I know before underwriting in {m}?", "What did the World Cup do to hotels in {m}?", "Are short-term rentals a factor in {m}?"];
  const NATIONAL = ["What's the national RevPAR and occupancy picture?", "How is US hotel RevPAR trending?", "What's the national hotel debt and refinancing picture?", "How are rates affecting hotel debt?", "Which hotel brands have the most CMBS distress?", "Is Hilton or Marriott doing worse on CMBS?", "What did the World Cup do to hotel demand nationally?", "Which markets have the heaviest supply?", "Compare Nashville vs Charlotte", "Compare Dallas vs Houston", "What's the national hotel labor picture?", "Where is the 10-year Treasury?"];
  // Known STR/CoStar figures (Nashville / Dallas C&W, CoStar weeklies, CoStar US August): none may appear.
  const FIGS = [/RevPAR \$133\b/, /OCC 71\.7%/, /\$158\.12/, /RevPAR \$95\b/, /OCC 68\.4%/, /\$144\.41/, /\$96\.81/, /OCC 66\.4%/, /\$161\.78/, /\$107\.43/, /\$218\.37/, /RevPAR \$149\b/, /\$206\.21/, /\$243\.10/, /\$168\.15/, /\$293\.67?\b/];
  const strings = (o: unknown, out: string[] = []): string[] => {
    if (typeof o === "string") out.push(o);
    else if (Array.isArray(o)) o.forEach((x) => strings(x, out));
    else if (o && typeof o === "object") for (const v of Object.values(o)) strings(v, out);
    return out;
  };
  const name = (m: { name: string }) => m.name.split(/[–—,]/)[0].trim();
  const qs = [...markets.flatMap((m) => QS.map((q) => q.replace("{m}", name(m)))), ...NATIONAL];
  const bad: string[] = [];
  const brandLead: string[] = [];
  let answers = 0;
  let debtAnswers = 0;
  let strSeen = 0;
  for (const q of qs) {
    const a = await answerChat(q);
    const src = await sourcesForAnswer(a.content);
    answers++;
    for (const s of [...strings(a), ...strings(src)]) {
      if (LIC_ANY.test(s) || isLicensedText(s)) bad.push(`${q}: ${s.match(/.{0,50}(?:co-?star|STR\b|marketbeat).{0,40}/i)?.[0] ?? s.slice(0, 80)}`);
      for (const f of FIGS) if (f.test(s)) bad.push(`${q}: STR/CoStar figure ${f} — ${s.slice(0, 100)}`);
      if (/outpaces Marriott|Hilton-flagged CMBS distress|brand cut/i.test(s)) brandLead.push(`${q}: brand framing — ${s.slice(0, 100)}`);
      if (/\bSTR\b/.test(s)) strSeen++;
    }
    const b = a.brief as { answer?: string } | null | undefined;
    if (a.intent === "debt_overlay" || a.intent === "rates" || /debt|CMBS/i.test(q)) {
      debtAnswers++;
      const lead = b?.answer ?? a.content.split("\n").find((l) => l.trim() && !l.startsWith("**")) ?? "";
      if (BRAND_COMPARE.test(lead)) brandLead.push(`${q}: brand comparison leads — ${lead.slice(0, 120)}`);
    }
  }
  check(bad.length === 0, `answers with STR/CoStar: ${[...new Set(bad)].slice(0, 8).join(" || ")}`);
  check(brandLead.length === 0, `brand lead / framing: ${[...new Set(brandLead)].slice(0, 6).join(" || ")}`);
  check(strSeen > 0, `short-term-rental "STR" lines still appear in answers (${strSeen} strings)`);
  const nat = await answerChat("What's the national hotel debt and refinancing picture?");
  const natB = nat.brief as { answer?: string; reads?: { text: string }[] } | null;
  check(Boolean(natB?.answer && !BRAND_COMPARE.test(natB.answer)), `national debt lead: ${natB?.answer}`);
  check(Boolean(natB?.reads?.some((r) => /by brand flag/.test(r.text) && /Hilton-flagged 11\.73%, Marriott-flagged 7\.23%/.test(r.text))), `brand-flag read kept lower, neutral: ${natB?.reads?.map((r) => r.text).join(" | ")}`);
  const nash = await answerChat("What's the RevPAR and occupancy read for Nashville?");
  const nashB = nash.brief as { answer?: string } | null;
  check(Boolean(nashB?.answer && /county|roadgenius/i.test(nashB.answer) && !/STR|CoStar|C&W/.test(nashB.answer)), `Nashville leads with county/public numbers: ${nashB?.answer}`);
  console.log(`licensed scan: ${before} fixture rows cite STR/CoStar, ${raw.length - kept.length} dropped, ${kept.filter((r, i) => r !== raw[i]).length >= 0 ? "" : ""}${answers} answers (${markets.length} markets × ${QS.length} questions + ${NATIONAL.length} national), ${debtAnswers} debt answers checked`);
  for (const f of fails) console.log(`FAIL ${f}`);
  console.log(`licensed-source test: ${checks - fails.length}/${checks} checks pass`);
  process.exit(fails.length ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
