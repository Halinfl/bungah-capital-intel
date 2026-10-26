#!/usr/bin/env python3
"""Build src/data/stack-memo-tier1.json from the QA-cleared Tier 1 research files.

Deterministic: parses the memo block specs (supply / demand / capital / operations) and the
files they point to. Re-run right before deploying; the caution-line QA checks run here.
"""
import json, re, sys, os
from datetime import date

ROOT = "/workspace/neo-capital-intel"
SPEC = f"{ROOT}/product/bitcoin-hotel-stack"
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.environ.get("STACK_MEMO_OUT") or os.path.join(REPO, "src", "data", "stack-memo-tier1.json")

TIER1 = ["washington-dc", "san-diego", "houston", "boston", "atlanta", "phoenix", "seattle",
         "san-francisco-bay", "dallas", "nashville", "los-angeles", "honolulu", "new-york-city",
         "miami", "chicago"]
MARKET_COL = {  # Market column labels in the 90-day citywide table
    "washington-dc": "Washington DC", "san-diego": "San Diego", "houston": "Houston", "boston": "Boston",
    "atlanta": "Atlanta", "phoenix": "Phoenix", "seattle": "Seattle", "san-francisco-bay": "SF Bay",
    "dallas": "Dallas", "nashville": "Nashville", "los-angeles": "Los Angeles", "honolulu": "Honolulu",
    "new-york-city": "New York City", "miami": "Miami", "chicago": "Chicago"}
WC_HOSTS = {"atlanta", "boston", "dallas", "houston", "los-angeles", "miami", "new-york-city",
            "san-francisco-bay", "seattle"}
SECONDARY_DOMAINS = ("cornovuscapital.com", "cmre", "headtopics.com", "stayinthenew.com")
TEAM = re.compile(r"\b(Ledger|Atlas|Vectra|Herald|Quill|Callbook|Neo)\b(?!n)|wave 1|depth-w1|\bw1\b", re.I)
LOG = []

INTERNAL_TAG = "[INTERNAL, strip from pages]"

def drop_internal(text):
    """Drop every paragraph tagged [INTERNAL, strip from pages]. A tagged heading drops its whole
    section (to the next heading of the same or higher level); any other tagged line drops its
    blank-line-delimited paragraph (including a list that follows it without a blank line)."""
    if INTERNAL_TAG not in text:
        return text
    out, lines, i = [], text.split("\n"), 0
    while i < len(lines):
        ln = lines[i]
        if INTERNAL_TAG not in ln:
            out.append(ln); i += 1; continue
        h = re.match(r"^(#{1,6})\s", ln)
        if h:
            lv = len(h.group(1)); i += 1
            while i < len(lines):
                m = re.match(r"^(#{1,6})\s", lines[i])
                if m and len(m.group(1)) <= lv:
                    break
                i += 1
        else:
            while out and out[-1].strip():   # paragraph start
                out.pop()
            while i < len(lines) and lines[i].strip():
                i += 1
        LOG.append(f"dropped {INTERNAL_TAG} paragraph: {ln.strip()[:80]}")
    return "\n".join(out)

def read(p):
    with open(p, encoding="utf-8") as f:
        return drop_internal(f.read())

URL_RE = re.compile(r"https?://[^\s)\]|<>\"']+")

DEAD = {  # verified 404 at build time; never linked
    "https://www.morningstar.com/news/pr-newswire/20260505la48357/davidson-hospitality-group-tapped-to-manage-cadillac-hotel-beach-club-autograph-collection",
}

def urls_in(s):
    out = []
    for u in URL_RE.findall(s or ""):
        u = u.rstrip(".,;:*_")
        if "/_src/" in u or "neo-capital-intel" in u or u in DEAD:
            continue
        if u not in out:
            out.append(u)
    return out

def is_secondary(cell, urls):
    if re.search(r"secondary", cell or "", re.I):
        return True
    return any(d in u for u in urls for d in SECONDARY_DOMAINS)

def clean(s):
    s = s or ""
    s = re.sub(r"\[([^\]]+)\]\((https?://[^)]+)\)", r"\1", s)        # md links -> label
    s = re.sub(r"\((?:via |per |see )?`[^`]*`[^)]*\)", "", s)        # (via `path`)
    s = re.sub(r"`[^`]*`", "", s)                                      # bare `paths`
    s = re.sub(r"\.?\s*Debt yield is held until the cash-flow figures reconcile\s*\(QA [^)]*\)", ". No debt yield is shown until the cash-flow figures reconcile", s)
    s = re.sub(r"\s*\((?:[A-Z][a-z]+ )?QA \d{4}-\d{2}-\d{2}\)", "", s)        # internal QA stamps
    s = URL_RE.sub("", s)
    s = re.sub(r"\(via [^)]*\)", "", s)
    s = re.sub(r"\bAtlas derivation\b", "derivation", s)
    s = re.sub(r"\b(?:per|via) (?:Herald|Atlas|Ledger|Vectra|Quill)\b[^;,.)]*", "", s)
    s = re.sub(r"\((?:Herald|Atlas|Ledger|Vectra|Quill)\b[^)]*\)", "", s)
    s = re.sub(r"\bHerald file\b", "", s)
    s = re.sub(r"\s*—\s*flag Atlas \([^)]*\)", "", s)
    s = re.sub(r"\bthe Wave 1 ", "the covered ", s)
    s = re.sub(r"\b(?:Atlas|Herald|Ledger|Vectra|Quill)(?: lists| says| notes|:|'s)\s*", "", s)
    s = re.sub(r"\*secondary\*:?", "", s)
    s = s.replace("**", "").replace("*", "")
    s = re.sub(r"\s*·\s*(?=·|$)", "", s)
    s = re.sub(r"\(\s*[;,]?\s*\)", "", s)
    s = re.sub(r"\s+([,;.)])", r"\1", s)
    s = re.sub(r"\s{2,}", " ", s).strip(" ;,·—-")
    return s.strip()

def check_team(s, where):
    if TEAM.search(s):
        LOG.append(f"TEAM-NAME in {where}: {s}")
        return False
    return True

def section(text, head_re, level=2):
    """Body of the first heading matching head_re until the next heading of same-or-higher level."""
    lines = text.split("\n")
    out, on = [], False
    for ln in lines:
        m = re.match(r"^(#{1,6})\s+(.*)", ln)
        if m:
            lv = len(m.group(1))
            if on and lv <= level:
                break
            if not on and lv == level and re.search(head_re, m.group(2)):
                on = True
                continue
        if on:
            out.append(ln)
    return "\n".join(out)

def tables(body):
    """All markdown tables in body -> list of (header, rows[dict])."""
    res, cur = [], None
    for ln in body.split("\n"):
        if ln.strip().startswith("|"):
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if cur is None:
                cur = (cells, [])
            elif all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                continue
            else:
                cur[1].append(dict(zip(cur[0], cells + [""] * (len(cur[0]) - len(cells)))))
        else:
            if cur is not None:
                res.append(cur)
                cur = None
    if cur is not None:
        res.append(cur)
    return res

def col(row, *names):
    for k in row:
        for n in names:
            if re.search(n, k, re.I):
                return row[k]
    return ""

FILE_ROWS = []  # (row text, urls) of the file being parsed, for "X above" references

def resolve_links(cell, prev):
    us = urls_in(cell)
    if not us and re.search(r"\b(same|above)\b", cell or "", re.I):
        us = list(prev)
        m = re.search(r"([A-Z][\w.&-]+)[^|]*\babove\b", cell or "")
        if m:
            hit = next((u for t, u in FILE_ROWS if m.group(1).lower() in t.lower() and u), None)
            if hit:
                us = hit
    return us

MONTHS = {m: i + 1 for i, m in enumerate(["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"])}

def date_key(s):
    s = s or ""
    m = re.search(r"(20\d\d)-(\d\d)-(\d\d)", s)
    if m:
        return int(m.group(1)) * 10000 + int(m.group(2)) * 100 + int(m.group(3))
    m = re.search(r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(?:\d{1,2},?\s+)?(20\d\d)", s, re.I)
    if m:
        return int(m.group(2)) * 10000 + MONTHS[m.group(1).lower()] * 100 + 15
    m = re.search(r"\b(20\d\d)\b", s)
    if m:
        return int(m.group(1)) * 10000 + 701
    return 0

def fmt_keys(keys):
    k = clean(keys)
    if not k or k in ("—", "-") or re.search(r"no (public )?(read|key)|no key", k, re.I):
        return "keys: no public read"
    m2 = re.match(r"^([~\d,–\-]+)\s*\((.*suites?.*)\)$", k)
    if m2:
        return f"{m2.group(1)} keys ({m2.group(2)})"
    if re.search(r"key|room|suite", k, re.I):
        return k
    m = re.match(r"^([~\d,–\-]+(?:\s*\(proposed\))?)(.*)$", k)
    if m:
        return f"{m.group(1).strip()} keys{(' ' + m.group(2).strip()) if m.group(2).strip() else ''}"
    return k

def row(text, links, secondary=False, date_s="", where=""):
    t = clean(text)
    if not t or not check_team(t, where):
        return None
    return {"t": t, "u": links, "sec": bool(secondary), "d": clean(date_s)}

# ---------------- caution lines (re-read the specs) ----------------
def spec_table(fname, cols):
    out = {}
    for hdr, rows in tables(read(f"{SPEC}/{fname}")):
        if not hdr or hdr[0] != "Slug":
            continue
        for r in rows:
            slug = r["Slug"].strip("`")
            out[slug] = {k: r.get(v, "") for k, v in cols.items()}
    return out

sup_spec = spec_table("04-stack-memo-supply-block.md", {"score": "Score", "caution": "Caution line (D14)"})
dem_spec = spec_table("05-stack-memo-demand-block.md", {"caution": "Caution line"})
cap_spec = spec_table("06-stack-memo-capital-block.md", {"caution": "Capital caution line (verbatim)"})
ops_spec = spec_table("07-stack-memo-operations-block.md", {"caution": "Caution line (no numbers)", "flag": "Contract / transition flag to surface"})

OMITTED = []
def qa(slug, block, line):
    """QA-pending lines: omit if the flagged wording is still there."""
    if slug == "phoenix" and block == "demand" and re.search(r"Southwest capacity", line):
        OMITTED.append("Phoenix demand caution (still says 'Southwest capacity is down')"); return None
    if slug == "nashville" and block == "capital" and re.search(r"Event-driven tax growth", line, re.I):
        OMITTED.append("Nashville capital caution (still 'Event-driven tax growth')"); return None
    if slug == "honolulu" and block == "ops" and re.search(r"highest in Tier 1", line, re.I):
        OMITTED.append("Honolulu operations caution (still 'highest in Tier 1' wording)"); return None
    if slug == "chicago" and block == "flag" and "46-hotel" in line and not re.search(r"\b6 hotels\b.*within a 46-hotel dispute", line):
        OMITTED.append("Chicago contract flag (still '46-hotel dispute' without the 6 struck hotels)"); return None
    if slug == "phoenix" and block == "capital" and "secondary" not in line:
        OMITTED.append("Phoenix capital caution (lost its secondary tag)"); return None
    return line

# ---------------- supply ----------------
def supply(slug):
    txt = read(f"{ROOT}/markets/depth-w1-{slug}-supply.md")
    m = re.search(r"Supply-pressure score: \*\*(\d) / 5\*\*", txt)
    score = int(m.group(1)) if m else None
    spec_score = int(sup_spec[slug]["score"])
    if score != spec_score:
        LOG.append(f"{slug}: supply score file {score} vs spec {spec_score}")
    caution = sup_spec[slug]["caution"].replace("**", "")
    rows = []
    body = section(txt, r"^Supply-pressure score")
    for hdr, trs in tables(body):
        prev = []
        for r in trs:
            layer = col(r, "Layer")
            if layer not in ("UC intensity", "Submarket concentration", "Openings"):
                continue
            us = resolve_links(col(r, "Source"), prev)
            prev = us or prev
            if not us:
                continue
            x = row(f"{layer}: {col(r, 'Read')}", us, is_secondary(col(r, "Source"), us), where=f"{slug} supply")
            if x:
                x["k"] = layer
                rows.append(x)
    # pipeline
    ptxt = read(f"{ROOT}/pipeline/depth-w1-{slug}-pipeline.md")
    header_src = ""
    hm = re.search(r"^Source for every row unless noted:.*$", ptxt, re.M)
    if hm:
        header_src = hm.group(0)
    projects, rollup = [], []
    named = "\n".join(section(ptxt, h) for h in [r"^Named projects"]) 
    # Miami has two "Named projects" sections
    named_all = []
    for h in re.findall(r"^## (Named projects.*)$", ptxt, re.M):
        named_all.append((h, section(ptxt, re.escape(h))))
    for h, body in named_all:
        stage_default = "UC" if "under construction" in h.lower() else ("Final planning" if "final planning" in h.lower() else "")
        for hdr, trs in tables(body):
            prev = urls_in(header_src)
            for r in trs:
                name = col(r, "^Project")
                stage = col(r, "^Stage") or stage_default
                timing = col(r, "^Timing")
                sub = col(r, "^Submarket")
                keys = col(r, "^Keys")
                src = col(r, "^Source") or timing
                us = urls_in(src) or (resolve_links(src, prev) if col(r, "^Source") else []) or urls_in(header_src)
                if col(r, "^Source"):
                    prev = us or prev
                low = (stage + " " + timing + " " + name).lower()
                if re.search(r"opened|delivered|\bopen\b|existing|demand anchor", low) and "opening" not in low.replace("opened", ""):
                    continue
                if re.search(r"opened|delivered|demand anchor|existing", low):
                    continue
                tk = date_key(timing)
                if tk and tk < 20261011 and not re.search(r"\bUC\b|under construction", stage, re.I) and not re.search(r"slip", timing, re.I):
                    continue
                if not us:
                    continue
                k = fmt_keys(keys)
                tm = clean(timing)
                if "—" in timing and len(timing.strip()) <= 3 or not tm:
                    tm = "timing: no public read"
                elif tm.startswith("—"):
                    tm = "timing: no public read"
                if tm == clean(re.sub(r"https?://\S+", "", timing)) and " — " in timing:
                    tm = clean(timing.split(" — ")[0])
                parts = [clean(name), k, clean(stage), clean(sub), tm]
                t = " · ".join(p for p in parts if p and p not in ("—", "-"))
                x = row(t, us, is_secondary(src + name, us), where=f"{slug} pipeline")
                if x:
                    projects.append(x)
    if not named_all or not projects:
        body = section(ptxt, r"^Stage rollup")
        for hdr, trs in tables(body):
            for r in trs:
                us = urls_in(col(r, "Source"))
                if not us:
                    continue
                vals = [clean(r[c]) for c in hdr if not re.match("Source", c) and r.get(c) not in ("", "—")]
                x = row(": ".join([vals[0], " · ".join(vals[1:])]), us, is_secondary(col(r, "Source"), us), where=f"{slug} rollup")
                if x:
                    rollup.append(x)
    return {"score": score, "caution": caution, "rows": rows, "projects": projects, "rollup": rollup}

# ---------------- demand ----------------
CTF = "ctfassets.net/2pnrhs9eukyp"  # Harry Reid (LAS) traffic PDFs: never outside Las Vegas (qiecpoxp4bka is GOAA / Orlando)
def demand_rows(body, slug, where, limit=None):
    out = []
    for hdr, trs in tables(body):
        prev = []
        for r in trs:
            src = col(r, "^Source")
            us = resolve_links(src, prev)
            if us:
                prev = us
            if slug != "las-vegas":
                us = [u for u in us if CTF not in u]
            first = r[hdr[0]]
            if "4,149,332" in " ".join(r.values()):
                continue
            val = col(r, "^Value") or (r[hdr[1]] if len(hdr) > 1 else "")
            nopr = re.search(r"no public read", val, re.I)
            if not us and not nopr:
                continue
            x = row(f"{clean(first)}: {val}", [] if nopr and not us else us, is_secondary(src + val, us), col(r, "^Date"), where)
            if x:
                x["k"] = clean(first)
                out.append(x)
    return out[:limit] if limit else out

def demand(slug):
    txt = read(f"{ROOT}/demand/depth-w1-{slug}.md")
    FILE_ROWS.clear()
    for ln in txt.split("\n"):
        if ln.startswith("|") and urls_in(ln):
            FILE_ROWS.append((ln, urls_in(ln)))
    d3 = demand_rows(section(txt, r"^D3"), slug, f"{slug} D3")
    d6 = demand_rows(section(txt, r"^D6"), slug, f"{slug} D6")
    d7 = demand_rows(section(txt, r"^D7"), slug, f"{slug} D7")
    d8 = demand_rows(section(txt, r"^D8"), slug, f"{slug} D8")
    visitation = next((r for r in d3 if r["u"] and re.search(r"visit|room nights|room-night", r["k"], re.I)), None) or next((r for r in d3 if r["u"]), None)
    if visitation and re.search(r"economic impact", visitation["t"], re.I):
        visitation["t"] += " (economic impact is not demand)"
    d6 = [r for r in d6 if not re.search(r"thesis", r["k"], re.I)]
    seat = [r for r in d6 if re.search(r"seat|schedule|capacity", r["k"], re.I)][:1]
    rest = [r for r in d6 if r not in seat]
    linked = [r for r in rest if r["u"]]
    carrier = next((r for r in linked if re.search(r"^carrier|carrier (share|mix)|^american|^delta|^united|^southwest|^spirit", r["k"], re.I)), None)
    airlift = [r for r in linked if r is not carrier][:3 if carrier else 4]
    if carrier:
        airlift.append(carrier)
    if not linked:
        airlift = rest[:2]
    anchors = [r for r in d8 if re.search(r"anchor|attraction|drive|feeder", r["k"], re.I) and r["u"]][:2]
    pace = next((r for r in d7 if re.search(r"pace|booked|gains|losses", r["k"], re.I)), None)
    # 90-day citywides (memo date filters at render time)
    cw = section(read(f"{ROOT}/demand/_compression-90d.md"), r"^Wave 1 markets")
    events = []
    for hdr, trs in tables(cw):
        for r in trs:
            if r.get("Market", "").strip() != MARKET_COL[slug]:
                continue
            ds = r["Approx dates"].replace("**", "")
            dd = re.findall(r"20\d\d-\d\d-\d\d", ds)
            start = dd[0] if dd and not ds.strip().startswith("→") else None
            end = dd[1] if len(dd) > 1 else (dd[0] if dd else None)
            status = r.get("Confirmation status", "")
            us = [u for u in urls_in(status) if CTF not in u]
            att = re.search(r"([~\d,]+\+? (?:listed|projected|attendees|annual attendees)|[~]?\d[\d,]*\+? annual attendees|\d[\d,]+ attendance)", r["Event (as listed publicly)"] + " " + status + " " + r.get("Next pull", ""))
            ev = clean(r["Event (as listed publicly)"])
            probe = URL_RE.sub("", r["Event (as listed publicly)"] + " " + status + " " + r.get("Next pull", ""))
            probe = re.sub(r"20\d\d-\d\d-\d\d", "", probe)
            if not re.search(r"~?\d{1,3},\d{3}\+?(?! exhibitors)", probe):
                ev = f"{ev} · attendance: no public read"
            x = row(f"{ds.strip()} · {ev}", us, is_secondary(status, us), where=f"{slug} D7cw")
            if x:
                x["start"], x["end"] = start, end
                x["gap"] = not us
                events.append(x)
    if not pace:
        pace = {"t": "2027 citywide pace: no public read", "u": [], "sec": False, "d": ""}
    normalize = None
    if slug in WC_HOSTS:
        normalize = "World Cup host: strip Jun 11–Jul 19, 2026 from the T12 (normalize T12)."
    if slug == "chicago":
        normalize = "Not a host, but 2026 carries meetings displaced by the World Cup: normalize T12."
    if slug == "los-angeles":
        normalize = "World Cup host and Feb 2027 Super Bowl: strip both windows (normalize T12)."
    if slug == "san-francisco-bay":
        normalize = "World Cup host (Santa Clara): read by window and by city, then normalize T12."
    if slug == "honolulu":
        normalize = None
    cau = qa(slug, "demand", dem_spec[slug]["caution"])
    return {"caution": cau, "visitation": visitation, "airlift": airlift, "seats": seat,
            "anchors": anchors, "events": events, "pace": pace, "normalize": normalize}

# ---------------- capital ----------------
def capital(slug):
    txt = read(f"{ROOT}/capital/depth-w1-{slug}.md")
    d9 = section(txt, r"^D9")
    comps = []
    for hdr, trs in tables(section(d9, r"^Named hotel transactions", 3)):
        for r in trs:
            src = col(r, "^Source$") or col(r, "^Source")
            us = urls_in(src)
            if not us:
                continue
            cap = col(r, "^Cap")
            capm = re.search(r"(\d+(?:\.\d+)?)%", cap)
            capv = float(capm.group(1)) if capm and not re.search(r"not disclosed", cap.split(".")[0], re.I) else None
            if re.match(r"\s*cap not disclosed", cap, re.I):
                capv = None
            parts = [col(r, "^Property"), col(r, "^Date"), col(r, "^Price"), (col(r, "^Keys") + " keys") if re.match(r"^[~\d]", col(r, "^Keys")) else col(r, "^Keys"),
                     col(r, r"^\$/key"), (clean(cap) if re.match(r"\s*\**cap\b", cap, re.I) else "cap " + clean(cap)) if capv is not None else "cap not disclosed"]
            x = row(" · ".join(clean(p) for p in parts if clean(p) and clean(p) not in ("n/a", "—")), us,
                    is_secondary(src + cap, us), col(r, "^Date"), where=f"{slug} comps")
            if x:
                x["cap"] = capv
                x["dk"] = date_key(col(r, "^Date")) or date_key(col(r, "Source date"))
                comps.append(x)
    comps.sort(key=lambda r: -r["dk"])
    loans = []
    cm = re.search(r"^### (CMBS.*)$", d9, re.M)
    if cm:
        for hdr, trs in tables(section(d9, re.escape(cm.group(1)), 3)):
            for r in trs:
                src = col(r, "^Source$") or col(r, "^Source")
                us = urls_in(src)
                status = col(r, "^Status")
                nopr = re.search(r"no public read", status + src, re.I)
                if not us and not nopr:
                    continue
                if nopr and re.search(r"historical only", src):
                    us = []
                bal = col(r, "^Balance")
                parts = [col(r, "^Loan"), bal if bal not in ("—", "n/a") else "", status]
                x = row(" · ".join(clean(p) for p in parts if clean(p)), us if not nopr or us else [],
                        is_secondary(src, us), col(r, "^Date"), where=f"{slug} loans")
                if x:
                    x["watch"] = bool(us) and bool(re.search(r"foreclos|receiv|special servic|\bSS\b|default|\bDQ\b|delinquen|\bREO\b|lender-owned|lender took|auction|at-risk|bankrupt", x["t"], re.I))
                    loans.append(x)
    hold = section(d9, r"^Holdability read", 3).strip()
    hold = re.sub(r"\(Herald[^)]*\)", "", hold)
    hold = re.sub(r"Herald `[^`]*`;?\s*", "", hold)
    hold = re.sub(r"\bHerald\b[^;)\n]*\.md;?\s*", "", hold)
    hold = re.sub(r"\*\*Supply \((?:Atlas )?`[^`]*`\):", "**Supply:", hold)
    hold = re.sub(r"the Atlas supply score", "the supply score", hold)
    hold = re.sub(r"\*\*Labor \(Herald, `[^`]*`; ", "**Labor (", hold)
    hold = re.sub(r"`people/notes/[^`]*`\s*\(Philadelphia\)", "Philadelphia (no public link)", hold)
    hold = re.sub(r"`[^`]*`", "", hold)
    hold = re.sub(r"\(\s*;\s*", "(", hold)
    hold = re.sub(r";\s*\)", ")", hold)
    hold = re.sub(r"[ \t]{2,}", " ", hold)
    check_team(hold, f"{slug} holdability")
    raw = cap_spec[slug]["caution"]
    cau = qa(slug, "capital", raw)
    cau_sec = "*secondary*" in raw
    if cau:
        cau = re.sub(r"\s*\(\*secondary\*\)", "", cau).replace("*", "")
    if slug == "phoenix":
        coh = next((l for l in loans if "11 hotel CMBS loans" in l["t"]), None)
        if not coh or not coh["sec"]:
            OMITTED.append("Phoenix 11 maturing / 9 at-risk loan row (secondary tag missing)")
            loans = [l for l in loans if l is not coh]
            cau = None
    return {"caution": cau, "cautionSecondary": cau_sec, "comps": comps[:5], "loans": loans, "holdability": hold}

# ---------------- operations ----------------
def operations(slug):
    txt = read(f"{ROOT}/deepen/talent/depth-w1-{slug}.md")
    wage = []
    for hdr, trs in tables(section(txt, r"^1\. Wage floor")):
        if hdr[0] != "Item":
            continue
        for r in trs:
            src = col(r, "^Source")
            us = urls_in(src)
            val = col(r, "^Value")
            nopr = re.search(r"no public read|not checked", val, re.I)
            if not us and not nopr:
                continue
            x = row(f"{col(r, '^Item')}: {val}", us, is_secondary(src + val, us), col(r, "^Date"), where=f"{slug} wage")
            if x:
                x["k"] = clean(col(r, "^Item"))
                x["union"] = bool(re.search(r"union|local \d|contract|strike|CBA|agreement|bargain", x["t"], re.I))
                x["gap"] = not us
                wage.append(x)
    # OEWS median (TX/GA/TN floor markets)
    oews = None
    if slug in ("houston", "dallas", "atlanta", "nashville"):
        body = section(txt, r"^1\.1 BLS OEWS", 3)
        us = [u for u in urls_in(body) if "oes" in u and not u.endswith(".zip")]
        for hdr, trs in tables(body):
            for r in trs:
                if "37-2012" in r[hdr[0]] and us:
                    oews = {"t": clean(f"OEWS housekeeping median {col(r, 'Median')}/hr (all-industry MSA, May 2025 estimates)"), "u": us[:1], "sec": False, "d": "May 2025"}
    build = None
    for hdr, trs in tables(section(txt, r"^2\. Build talent")):
        for r in trs:
            us = urls_in(col(r, "^Source"))
            if us:
                build = row(f"{col(r, '^Signal')}: {col(r, '^Value')}", us, False, col(r, "^Date"), where=f"{slug} build")
                break
        break
    ops = []
    for hdr, trs in tables(section(txt, r"^3\. Operator bench")):
        for r in trs:
            src = col(r, "^Source")
            us = urls_in(src)
            mand = col(r, "^Mandate")
            if not us or not re.search(r"\bM\b|manage|operator", mand, re.I) or re.search(r"brand|developer|venue", mand, re.I):
                continue
            ev = col(r, "evidence")
            x = row(f"{col(r, '^Operator')}: {ev}", us, is_secondary(src, us), where=f"{slug} ops")
            if x:
                ops.append(x)
    s31 = section(txt, r"^3\.1", 3)
    change = None
    change_inline = []
    bl = [b for b in s31.split("\n") if b.strip().startswith("-")]
    if bl:
        raw31 = bl[0].lstrip("- ")
        change_inline = [u for u in urls_in(raw31) if u not in DEAD and "/_src/" not in u]
        # inline source links move to the link list; keep the line's own text unchanged
        change = clean(re.sub(r";?\s*\[[^\]]*\]\((https?://[^)]+)\)", "", raw31))
        if not check_team(change, f"{slug} 3.1"):
            change = None
    change_links = []
    if change and not re.search(r"^no ", change, re.I) and (change_inline or not re.search(r"no public read", change, re.I)):
        city = {"Dallas", "Houston", "Seattle", "Miami", "Chicago", "Boston", "Atlanta", "Phoenix", "Nashville", "Honolulu", "Diego", "Francisco", "Angeles", "York", "Washington", "Beach", "Center", "Market", "Downtown"}
        # per item: its own inline link if it has one, else the operator-row link matched by property tokens
        for item in re.split(r"(?<=\))\s*;\s+(?=[A-Z])", raw31):
            own = [u for u in urls_in(item) if u not in DEAD and "/_src/" not in u]
            if own:
                change_links += [u for u in own if u not in change_links]
                continue
            first = re.split(r"→|:", clean(item))[0]
            ptoks = [t for t in re.findall(r"[A-Z][A-Za-z]{3,}|\b\d{3,}\b", first) if t not in city and t not in ("Hotel", "Hotels")]
            for r in ops:
                if ptoks and any(re.search(r"\b" + re.escape(t) + r"\b", r["t"]) for t in ptoks):
                    change_links += [u for u in r["u"][:1] if u not in change_links]
    if change:
        change = re.sub(r";\s*see above", "", change)
    pre = []
    s32 = section(txt, r"^3\.2", 3)
    s32_src = urls_in("\n".join(l for l in s32.split("\n") if l.startswith("Sources:")))
    for hdr, trs in tables(s32):
        for r in trs:
            name = r[hdr[0]]
            lead = col(r, "Operator|Leadership")
            timing = col(r, "^Open|^Timing")
            keys = col(r, "^Keys")
            src_cells = " ".join(r.values())
            us = urls_in(src_cells)
            if not us:
                slugw = set(slug.split("-")) | {"hotel", "hotels", "beach", "resort", "suites", "miami", "downtown"}
                toks = [w.lower() for w in re.findall(r"[A-Za-z]{5,}", clean(name)) if w.lower() not in slugw]
                us = [u for u in s32_src if any(t in u.lower() for t in toks)]
            if not us:
                continue
            lead_c = clean(lead) or "no public read"
            t = f"{clean(name)} · {fmt_keys(keys)} · {clean(timing)} · leadership: {lead_c}"
            x = row(t, us, is_secondary(src_cells, us), where=f"{slug} preopen")
            if x:
                pre.append(x)
    gaps = []
    for hdr, trs in tables(section(txt, r"^5\. Gaps")):
        for r in trs:
            g = clean(r[hdr[0]])
            if g and check_team(g, f"{slug} gaps"):
                gaps.append(g)
    cau = qa(slug, "ops", ops_spec[slug]["caution"])
    flag = qa(slug, "flag", ops_spec[slug]["flag"])
    flag_links = []
    if flag:
        stop = {"None", "Hotel", "Hotels", "Resort", "Beach", "public", "contract", "contracts", "under", "within", "since", "ends", "steps", "through", "Hospitality", "standard", "deepest"}
        locs = re.findall(r"Local \d+", flag)
        toks = locs + [t for t in re.findall(r"[A-Z][A-Za-z]{3,}", flag) if t not in stop and t not in ("Local", "Houston")]
        for r in [w for w in wage if w["u"]] + pre:
            if any(re.search(r"\b" + re.escape(t) + r"\b", r["t"], re.I) for t in toks):
                for u in r["u"][:1]:
                    if u not in flag_links:
                        flag_links.append(u)
            if len(flag_links) >= 3:
                break
    return {"caution": cau, "flag": flag, "flagLinks": flag_links, "wage": wage, "oews": oews, "build": build,
            "operators": ops[:3], "change": change, "changeLinks": change_links[:4], "preopen": pre[:3], "gaps": gaps[:4]}

data = {"generated": date.today().isoformat(), "markets": {}}
for slug in TIER1:
    data["markets"][slug] = {"supply": supply(slug), "demand": demand(slug), "capital": capital(slug), "ops": operations(slug)}
# Orlando + Las Vegas: checked blocks assembled from their own research files (re-verified 2026-10-20).
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stack_memo_orl_lv import MARKETS as ORL_LV
for slug, blocks in ORL_LV.items():
    for b in ("supply", "demand", "capital", "ops"):
        txt = json.dumps(blocks[b], ensure_ascii=False)
        if TEAM.search(txt) or re.search(r"illustrative|propose-only|placeholder|\bDY\b|\.md\b|/_src/", txt, re.I):
            raise SystemExit(f"internal term in {slug} {b}")
        if slug != "las-vegas" and (CTF in txt or "4,149,332" in txt):
            raise SystemExit(f"Las Vegas airport PDF outside Las Vegas: {slug}")
    data["markets"][slug] = blocks
# ---------------- hand data fixes (committed 2026-10-20, 4cb2cfa / a8f7539) ----------------
# The research files still carry the pre-fix figures; re-apply the approved fixes so a regen never reverts them.
DATA_FIXES = [
    ("boston", "The Godfrey Hotel (505 Washington St, Downtown Crossing) · closed 2026-04-27 · $124.5M (B&T, LWHA). CRE Direct: $124M · 242 keys · $514,460 (LWHA) · cap not disclosed",
     "The Godfrey Hotel (505 Washington St, Downtown Crossing) · closed 2026-04-27 · $124M (CRE Direct) · 242 keys · $512,397 (CRE Direct) · cap not disclosed"),
    ("boston", "Boston trades priced at $390–515K/key", "Boston trades priced at $390–512K/key"),
    ("chicago", "Royal Sonesta River North → Hotel 505 River North (505 N State) · reported 2026-10-08 · $21.0M (−62% vs the $55M 2019 price) · 261 keys · ~$85K · cap not disclosed",
     "Royal Sonesta River North → Hotel 505 River North (505 N State) · reported 2026-10-08 · $21.0M / 261 keys (−62% vs the $55M 2019 price) · cap not disclosed"),
]
# Rows that appeared in the research files after the last reviewed build; held out until reviewed on their own.
HOLD_ROWS = [("miami", "Mandarin Oriental Miami (North Tower")]

# ---------------- IC frame strip (Hal's standing lock) ----------------
# Internal investment-committee thresholds (takeout rate, debt-yield target / flag / hard watch, the rate
# lock) never render on public pages, and nothing is framed against Treasuries. Each rewrite removes the
# frame and keeps the cited figures; no replacement thresholds are introduced.
IC_REWRITES = [
    ("The one clean cap (7.5% on NOI, 5.6% after capex) carries negative leverage against the ≥7.5–8.0% takeout once the PIP is counted.",
     "The one clean cap is 7.5% on NOI and 5.6% after capex."),
    ("so a 2025–26 T12 needs a federal-demand haircut before DY is tested. Assume the **≤9% flag** for older CBD full-service until a normalized T12 clears 10%.",
     "so a 2025–26 T12 needs a federal-demand haircut before debt yield is tested."),
    ("Without a cap, none can be tested against a ≥7.5–8.0% conduit takeout.", "Without a cap, none can be benchmarked on yield."),
    ("Underwrite at these floors, never offset by FTE cuts, and treat a sub-10% normalized DY as the **≤9% flag** zone until a T12 shows otherwise.",
     "Underwrite at these floors, never offset by FTE cuts, and test debt yield on a normalized T12."),
    ("a refi at ≥7.5–8.0% will size to DY ≥10% only on normalized NOI. Assume most older full-service product sits in the **≤9% flag** band until a normalized T12 shows otherwise.",
     "a refinance will size only on normalized NOI."),
    ("At or above the ≥7.5–8.0% conduit takeout, a T12 that includes June–July 2026 will overstate debt yield. Underwrite on a Cup-stripped T12 and treat **≤9% as the flag**.",
     "A T12 that includes June–July 2026 will overstate debt yield. Underwrite on a Cup-stripped T12."),
    (" Use the house frame: a ≥7.5–8.0% takeout against a DY target ≥10%.", ""),
    ("implies the market already prices sub-8% DY risk; treat it as the **≤9% flag** zone.", "implies the market already prices in debt-yield risk."),
    ("is trophy pricing and carries negative leverage against the house ≥7.5–8.0% takeout. At 60% LTV it would imply a DY of only ~10.3%",
     "is trophy pricing. At 60% LTV it would imply a debt yield of ~10.3%"),
    ("Treat those as **flag ≤9% DY until shown otherwise**: no public loan-level DY read exists, and",
     "No public loan-level debt-yield read exists for those, and"),
    (", roughly at the ≥7.5–8.0% takeout. That leaves only thin positive leverage, and only for waterfront/cruise-adjacent assets.",
     ", a read that applies only to waterfront/cruise-adjacent assets."),
    ("The DY test has to clear ≥10% with that payroll in place, not by trimming FTE. Treat a normalized DY ≤9% as the flag.",
     "Debt yield has to be tested with that payroll in place, not by trimming FTE."),
    ("That is a recovery bet on basis, deeply negative leverage against the ≥7.5–8.0% conduit takeout. On in-place NOI, the debt-yield math cannot reach the ≥10% target, so this sits at the **≤8% hard-watch** level.",
     "That is a recovery bet on basis, not on in-place yield."),
    ("That clears the ≥7.5–8.0% takeout on paper and fails once the PIP is added.", "That reads well on paper and weakens once the PIP is added."),
    ("Underwrite to a Cup-stripped T12, test DY at ≥10%, and treat ≤9% as the flag for downtown convention hotels through the convention-center construction.",
     "Underwrite downtown convention hotels to a Cup-stripped T12 through the convention-center construction."),
    ("assume new product needs DY ≥10% on stabilized (not ramp) NOI.", "test new product on stabilized (not ramp) NOI."),
    ("**4.6–5.9% NOI caps**, deeply negative leverage against the ≥7.5–8.0% conduit takeout.", "**4.6–5.9% NOI caps**."),
    (" On in-place NOI these sit at the **≤8% hard-watch** debt-yield level unless equity is sized to it.", ""),
    ("holdability can't be benchmarked to the ≥7.5–8.0% takeout.", "holdability can't be benchmarked."),
    ("Treat any normalized DY ≤9% as the flag, with labor at contract.", "Test debt yield on a normalized T12, with labor at contract."),
    ("(arithmetic), so with a conduit takeout of ≥7.5–8.0% (10Y ~5.18–5.24%, SOFR ~3.90%) a Cup-inflated T12 will overstate debt yield. Underwrite a Cup-stripped T12 against DY ≥10%, flag ≤9%, hard watch ≤8%.",
     "(arithmetic), and a Cup-inflated T12 will overstate debt yield. Underwrite a Cup-stripped T12."),
    ("Against the ≥7.5–8.0% conduit takeout (10Y ~5.18–5.24%, SOFR ~3.90%), a Cup-inflated T12 will overstate debt yield, and after August's 63.6% occupancy anything that only clears on the Cup window sits at or below the ≤9% flag. Underwrite a stripped T12 against DY ≥10%.",
     "A Cup-inflated T12 will overstate debt yield, and after August's 63.6% occupancy anything that only clears on the Cup window stays watch. Underwrite a stripped T12."),
    ("Against the ≥7.5–8.0% conduit takeout (10Y ~5.18–5.24%, SOFR ~3.90%), a 2026 T12", "A 2026 T12"),
    ("Normalize it, and treat anything that only reaches ≥10% DY on the 2026 T12 as a ≤9% flag.", "Normalize it before testing debt yield."),
]
IC_GUARD = re.compile(
    r"house frame|\bhouse\b[^.]{0,40}(?:takeout|DY|debt yield)|hard[- ]watch|(?<!four-conduit )takeout|7\.5[–-]8\.0|"
    r"DY target|debt[- ]yield target|[≤≥]\s*\d+(?:\.\d+)?%\s*(?:DY|flag|as the flag|target)|(?:DY|flag|target)\s*[≤≥]|≤\s*[89]%|≥\s*10%|"
    r"sub-(?:8|10)% (?:normalized )?DY|\bIC (?:frame|pack|threshold)|below Treasur|at the lock|re-price wire|10Y ~5\.18|SOFR ~3\.90",
    re.I)

def strip_ic(slug, mk):
    for s_, a, b in DATA_FIXES:
        if s_ == slug:
            for blk in mk.values():
                _replace_in(blk, a, b)
    for s_, pre in HOLD_ROWS:
        if s_ == slug:
            for blk in mk.values():
                for k, v in list(blk.items()):
                    if isinstance(v, list):
                        kept = [r for r in v if not (isinstance(r, dict) and str(r.get("t", "")).startswith(pre))]
                        if len(kept) != len(v):
                            LOG.append(f"held row {slug}: {pre}")
                        blk[k] = kept
    for a, b in IC_REWRITES:
        for blk in mk.values():
            _replace_in(blk, a, b)

def _replace_in(o, a, b):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, str):
                o[k] = v.replace(a, b)
            else:
                _replace_in(v, a, b)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            if isinstance(v, str):
                o[i] = v.replace(a, b)
            else:
                _replace_in(v, a, b)

for slug, mk in data["markets"].items():
    strip_ic(slug, mk)
    hits = sorted({m.group(0) for m in IC_GUARD.finditer(json.dumps(mk, ensure_ascii=False))})
    if hits:
        raise SystemExit(f"IC frame left in {slug}: {hits} (add a rewrite to IC_REWRITES)")

data["omitted"] = OMITTED
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)
print("\n".join(LOG))
print("OMITTED:", OMITTED)
