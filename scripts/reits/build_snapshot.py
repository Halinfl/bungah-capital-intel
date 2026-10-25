#!/usr/bin/env python3
"""Build the site-ready REITs snapshot (JSON) from the REIT cohort CSVs.

Usage: python3 scripts/reits/build_snapshot.py <cohort_dir>
Writes src/data/reits/snapshot.json, src/data/reits/market-owners.json and
src/data/reits/tt-owner-badges.json, and prints a coverage / matching report to stdout.
Only values with a source URL are kept. Nothing is estimated or filled in.
"""
import csv, json, os, re, sys, datetime, collections, difflib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from market_map import CITY_TO_MARKET, NAME_CITY_HINTS, STATE_NAMES

SRC = sys.argv[1]
DATA = os.path.join(SRC, "data")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(REPO, "src", "data", "reits")
TICKERS = ["HST", "RHP", "PK", "APLE", "DRH", "SHO", "XHR", "PEB", "RLJ", "INN", "CLDT", "AHT", "BHR"]
NAMES = {
    "HST": "Host Hotels & Resorts", "RHP": "Ryman Hospitality Properties", "PK": "Park Hotels & Resorts",
    "APLE": "Apple Hospitality REIT", "DRH": "DiamondRock Hospitality", "SHO": "Sunstone Hotel Investors",
    "XHR": "Xenia Hotels & Resorts", "PEB": "Pebblebrook Hotel Trust", "RLJ": "RLJ Lodging Trust",
    "INN": "Summit Hotel Properties", "CLDT": "Chatham Lodging Trust", "AHT": "Ashford Hospitality Trust",
    "BHR": "Braemar Hotels & Resorts",
}
PEER = {"HST": "luxury", "PK": "luxury", "PEB": "luxury", "DRH": "luxury", "SHO": "luxury", "XHR": "luxury", "BHR": "luxury",
        "APLE": "select", "INN": "select", "CLDT": "select", "RHP": "other", "RLJ": "other", "AHT": "other"}
MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
SITE_MARKETS = set(v for v in CITY_TO_MARKET.values())


def rd(name):
    p = os.path.join(DATA, name)
    return list(csv.DictReader(open(p, encoding="utf-8"))) if os.path.exists(p) else []


def fdate(iso):
    if not iso:
        return ""
    parts = iso.split("-")
    if len(parts) == 2:
        return f"{MON[int(parts[1]) - 1]} {parts[0]}"
    y, m, d = map(int, parts[:3])
    return f"{MON[m - 1]} {d}, {y}"


def form_label(doc_type):
    if doc_type.startswith("EX-99"):
        return f"8-K exhibit {doc_type[3:]}"
    return doc_type


BASIS = {"same_store": "Comparable hotels", "total": "All hotels"}


def src_label(r, basis=True):
    b = BASIS.get(r.get("same_store_flag", ""), "") if basis else ""
    filed = f", filed {fdate(r['filing_date'])}" if r.get("filing_date") else ""
    return f"{b + ' · ' if b else ''}{form_label(r['doc_type'])}{filed}"


def num(s):
    try:
        return float(str(s).replace(",", ""))
    except Exception:
        return None


# ---------- checks: values that failed a hand review or a sanity check stay off the site ----------
# (review_queue.csv is the hand spot-check sample; only rows marked as failed are excluded.)
flagged = set()
for q in rd("review_queue.csv"):
    if (q.get("review_result") or "").strip().lower() in ("fail", "failed", "wrong", "reject", "rejected", "mismatch"):
        flagged.add((q["ticker"], q["quarter"], q["metric"]))
flagged_basis = set()
sp = os.path.join(SRC, "checks", "sanity_results.csv")
if os.path.exists(sp):
    for c in csv.DictReader(open(sp, encoding="utf-8")):
        if c["result"] == "fail" and c["check"] == "revpar_eq_adr_x_occ":
            for m in ("revpar", "adr", "occupancy"):
                flagged_basis.add((c["ticker"], c["quarter"], m, c["scope"]))

metrics = [m for m in rd("reit_quarterly_metrics.csv") if m["source_uri"].startswith("http")]
quarters_all = json.load(open(os.path.join(DATA, "target_quarters.json")))["quarters"]
DOC_PREF = {"EX-99.1": 0, "EX-99.2": 1, "10-Q": 2, "10-K": 3, "10-Q/A": 4}


def pick_series(t, metric, prefer):
    """One value per quarter, on one basis for the whole series where possible."""
    rows = [m for m in metrics if m["ticker"] == t and m["metric"] == metric and (t, m["quarter"], metric) not in flagged]
    by_basis = collections.defaultdict(dict)
    for m in sorted(rows, key=lambda m: DOC_PREF.get(m["doc_type"], 9)):
        b = m["same_store_flag"] if m["same_store_flag"] in ("same_store", "total") else "other"
        by_basis[b].setdefault(m["quarter"], m)
    if not by_basis:
        return {}, None
    order = sorted(by_basis, key=lambda b: (-len(by_basis[b]), prefer.index(b) if b in prefer else 9))
    best = order[0]
    series = dict(by_basis[best])
    return series, best


def pick_perf(t):
    """RevPAR, ADR and occupancy per quarter, all three on the same basis within a quarter
    (comparable hotels first, then all hotels, then as reported). A quarter with no common basis
    keeps whatever single-basis values exist, each labelled with its own basis."""
    rows = [m for m in metrics if m["ticker"] == t and m["metric"] in ("revpar", "adr", "occupancy")
            and (t, m["quarter"], m["metric"]) not in flagged
            and (t, m["quarter"], m["metric"], m["same_store_flag"]) not in flagged_basis]
    idx = collections.defaultdict(dict)
    for m in sorted(rows, key=lambda m: DOC_PREF.get(m["doc_type"], 9)):
        b = m["same_store_flag"] if m["same_store_flag"] in ("same_store", "total") else "other"
        idx[(m["quarter"], b)].setdefault(m["metric"], m)
    rv, ad, oc = {}, {}, {}
    bases = collections.Counter()
    for q in quarters_all:
        full = [b for b in ("same_store", "total", "other") if len(idx.get((q, b), {})) == 3]
        if full:
            d = idx[(q, full[0])]; bases[full[0]] += 1
            rv[q], ad[q], oc[q] = d["revpar"], d["adr"], d["occupancy"]
        else:
            for b in ("same_store", "total", "other"):
                d = idx.get((q, b), {})
                if "revpar" in d: rv.setdefault(q, d["revpar"])
                if "adr" in d: ad.setdefault(q, d["adr"])
                if "occupancy" in d: oc.setdefault(q, d["occupancy"])
    return rv, ad, oc, dict(bases)


def cited(m, value=None, basis=True):
    if not m:
        return None
    v = num(m["value"]) if value is None else value
    if v is None:
        return None
    return {"value": v, "url": m["source_uri"], "source": src_label(m, basis)}


# ---------- properties ----------
props_all = rd("properties.csv")
props = [p for p in props_all if p["status"] in ("owned", "pending_disposition") and p["source_uri"].startswith("http")
         and p["name"].strip()]
unnamed = [p for p in props_all if p["status"] in ("owned", "pending_disposition") and not p["name"].strip()]
match_log = collections.Counter()
unmatched_examples = collections.defaultdict(list)


def norm_state(s):
    s = (s or "").strip()
    if s in STATE_NAMES:
        return STATE_NAMES[s]
    if s in ("D.C.", "-"):
        return "DC"
    return s.upper()


def clean_name(n):
    return re.sub(r"\s*[⁽(]\s*[\d¹²³⁴⁵⁶⁷⁸⁹⁰]+\s*[⁾)]\s*", " ", n).strip()


def market_for(city, state, name, schedule_section=""):
    """Returns (slug or None, how) where how is 'city' or 'name'."""
    st = norm_state(state) or STATE_NAMES.get(schedule_section, "")
    c = (city or "").strip().lower()
    if c:
        key = (c, st)
        if key in CITY_TO_MARKET:
            return CITY_TO_MARKET[key], "city"
        if (c, "") in CITY_TO_MARKET:
            return CITY_TO_MARKET[(c, "")], "city"
        c2 = re.sub(r"\s*\(.*\)$", "", c)
        if (c2, st) in CITY_TO_MARKET:
            return CITY_TO_MARKET[(c2, st)], "city"
        return None, "city-unmapped"
    nl = (name or "").lower()
    for hint, hst, slug in NAME_CITY_HINTS:
        if hst == st and re.search(r"\b" + re.escape(hint) + r"\b", nl):
            return slug, "name"
    return None, "no-city"


def prop_view(p):
    st = norm_state(p["state"]) or STATE_NAMES.get(p["schedule_section"], "")
    return {
        "name": clean_name(p["name"]) or "(unnamed in schedule)",
        "city": re.sub(r"\s*\(.*\)$", "", p["city"]).split(",")[0].strip() or None,
        "state": st or None,
        "rooms": int(num(p["rooms"])) if num(p["rooms"]) else None,
        "url": p["source_uri"],
        "source": f"Property schedule, {'10-K' if p['schedule_as_of'].endswith('12-31') else 'filing'} as of {fdate(p['schedule_as_of'])}",
    }


STATE_LABEL = {v: k for k, v in STATE_NAMES.items()}
market_names = {}
with open(os.path.join(REPO, "scripts", "reits", "market_names.json")) as f:
    market_names = json.load(f)

owners_by_market = collections.defaultdict(list)
reit_markets = collections.defaultdict(lambda: collections.defaultdict(list))
for p in props:
    if not p["name"].strip():
        match_log["no-name"] += 1
    slug, how = market_for(p["city"], p["state"], p["name"], p["schedule_section"])
    match_log[how if slug else how] += 1
    v = prop_view(p)
    if slug:
        owners_by_market[slug].append({**v, "ticker": p["ticker"], "match": how})
        reit_markets[p["ticker"]][("m", slug)].append(v)
    else:
        if len(unmatched_examples[how]) < 12:
            unmatched_examples[how].append(f"{p['ticker']} {p['name']} | {p['city']} {p['state']}")
        if v["city"] and v["state"]:
            reit_markets[p["ticker"]][("c", f"{v['city']}, {v['state']}")].append(v)
        elif v["state"]:
            reit_markets[p["ticker"]][("s", STATE_LABEL.get(v["state"], v["state"]))].append(v)
        else:
            reit_markets[p["ticker"]][("s", "Location not stated")].append(v)

# ---------- portfolio changes ----------
changes = [c for c in rd("reit_portfolio_changes.csv") if c["source_uri"].startswith("http")]


def tx_view(c):
    price = num(c["price"])
    if price is not None and "million" not in c["price_units"].lower():
        price = None
    st = norm_state(c["state"])
    city = re.sub(r"\s*\(\d+\)\s*$", "", c["city"]).strip() or None
    kind = "acquisition" if c["event_type"] == "acquisition" else "disposition"
    hotel = c["property_name"].strip()
    if hotel in ("", "N/A"):
        hotel = f"Hotel in {city}" if city else "Hotel"
    return {
        "date": c["transaction_date"], "kind": kind, "pending": c["event_type"].endswith("pending"), "hotel": clean_name(hotel),
        "city": city, "state": st or None, "counterparty": c["counterparty"].strip() or None,
        "priceUsdM": price, "rooms": int(num(c["rooms"])) if num(c["rooms"]) else None,
        "url": c["source_uri"],
        "source": (f"SEC filing for {c['fiscal_quarter_of_source'][4:]} {c['fiscal_quarter_of_source'][:4]}"
                   if c.get("fiscal_quarter_of_source") else "SEC filing"),
    }


comps_by_market = collections.defaultdict(list)
for c in changes:
    slug, how = market_for(c["city"], c["state"], c["property_name"])
    if slug:
        comps_by_market[slug].append({**tx_view(c), "ticker": c["ticker"], "match": how})

# ---------- filings: earnings releases ----------
filings = rd("reit_filings.csv")
releases = collections.defaultdict(dict)
for f in filings:
    if f["role"] == "earnings_8k" and f["doc_type"] == "EX-99.1":
        releases[f["ticker"]].setdefault(f["fiscal_quarter"], {
            "quarter": f["fiscal_quarter"], "filingDate": f["filing_date"], "url": f["doc_uri"],
            "source": f"8-K exhibit 99.1, filed {fdate(f['filing_date'])}",
        })

# ---------- guidance ----------
guid = [g for g in rd("reit_guidance.csv") if g["source_uri"].startswith("http") and g["guidance_vintage"] == "current"]
GMET = {"revpar_growth": "RevPAR growth", "adjusted_ebitdare": "Adj. EBITDAre", "adjusted_ffo_per_share": "Adj. FFO per share"}


def guidance_for(t):
    rows = [g for g in guid if g["ticker"] == t and g["metric"] in GMET and g["units"] in ("percent", "USD millions", "USD per share")]
    out = collections.OrderedDict()
    for g in sorted(rows, key=lambda g: g["release_date"]):
        key = (g["release_date"], g["guided_period"])
        e = out.setdefault(key, {"date": g["release_date"], "period": g["guided_period"], "url": g["source_uri"],
                                 "source": f"{form_label(g['doc_type'])}, released {fdate(g['release_date'])}", "items": []})
        if any(i["metric"] == g["metric"] for i in e["items"]):
            continue
        lo, hi = num(g["low"]), num(g["high"])
        if lo is None and hi is None:
            continue
        e["items"].append({"metric": g["metric"], "label": GMET[g["metric"]], "low": lo, "high": hi, "units": g["units"]})
    res = [e for e in out.values() if e["items"]]
    # change vs the previous release for the same period (computed from the two cited ranges)
    last = {}
    for e in res:
        for i in e["items"]:
            k = (e["period"], i["metric"])
            if k in last:
                pm = (last[k]["low"] + last[k]["high"]) / 2 if last[k]["low"] is not None and last[k]["high"] is not None else None
                cm = (i["low"] + i["high"]) / 2 if i["low"] is not None and i["high"] is not None else None
                if pm is not None and cm is not None:
                    i["change"] = "raised" if cm > pm + 1e-9 else "lowered" if cm < pm - 1e-9 else "maintained"
            last[k] = i
    return res


# ---------- capital: debt maturities, repurchases ----------
debt = [d for d in rd("reit_debt_maturities.csv") if d["source_uri"].startswith("http") and d["units"] == "USD millions"]
BUCKET_ORDER = ["remainder_of_year", "next_12_months", "year_2", "year_3", "year_4", "year_5", "after_year_5"]


def debt_for(t):
    rows = [d for d in debt if d["ticker"] == t]
    if not rows:
        return None
    asof = max(d["as_of"] for d in rows)
    rows = sorted([d for d in rows if d["as_of"] == asof], key=lambda d: BUCKET_ORDER.index(d["bucket"]) if d["bucket"] in BUCKET_ORDER else 9)
    seen = set(); items = []
    for d in rows:
        if d["maturity_year"] in seen:
            continue
        seen.add(d["maturity_year"])
        items.append({"label": d["maturity_year"], "value": num(d["value"])})
    form = "10-K" if asof.endswith("12-31") else "10-Q"
    return {"asOf": asof, "url": rows[0]["source_uri"], "source": f"Debt maturity schedule, {form} as of {fdate(asof)} (filed {fdate(rows[0]['filing_date'])})", "items": items}


reps = [r for r in rd("reit_share_repurchases.csv") if r["source_uri"].startswith("http") and r["units"] == "USD millions"]


def buybacks_for(t):
    out = []
    for metric in ("repurchase_value", "repurchase_cash_paid"):
        rows = [r for r in reps if r["ticker"] == t and r["metric"] == metric and r["period_type"] == "ytd"]
        if not rows:
            continue
        by_year = {}
        for r in sorted(rows, key=lambda r: r["period_end"]):
            by_year[r["period_end"][:4]] = r
        for y, r in sorted(by_year.items())[-3:]:
            v = num(r["value"])
            if v is None:
                continue
            full = r["period_end"].endswith("12-31")
            out.append({"label": f"{y}{'' if full else ' through ' + fdate(r['period_end']).rsplit(',', 1)[0]}", "value": v,
                        "url": r["source_uri"], "source": f"{'10-K' if full else '10-Q'} filed {fdate(r['filing_date'])}"})
        break
    return out


# ---------- earnings calendar ----------
cal = {c["ticker"]: c for c in rd("earnings_calendar.csv")}


def next_call(t):
    c = cal.get(t)
    if not c or not c["source_url"].startswith("http"):
        return None
    est = "est" in c["status"].lower()
    src = re.sub(r"\s*\+?\s*(release PDF\s*)?https?://\S+", "", c["notes"].split(";")[0]).strip() or c["source_kind"]
    if c["call_date"]:
        hh, mm = (c["call_time_et"] or ":").split(":")[:2] if c["call_time_et"] else ("", "")
        time = ""
        if hh:
            h = int(hh); time = f"{(h - 1) % 12 + 1}:{mm} {'a.m.' if h < 12 else 'p.m.'} ET"
        return {"kind": "call", "date": c["call_date"], "estimated": est, "time": time or None, "url": c["source_url"],
                "source": f"{src}, announced {fdate(c['announced_on'])}" if c["announced_on"] else src,
                "releaseDate": c["release_date"] or None, "releaseTiming": c["release_timing"] or None}
    if c["release_date"]:
        src = "company press release (results date; no call announced)"
        return {"kind": "release", "date": c["release_date"], "estimated": est, "time": None, "url": c["source_url"],
                "source": f"{src}, announced {fdate(c['announced_on'])}" if c["announced_on"] else src,
                "releaseDate": c["release_date"], "releaseTiming": c["release_timing"] or None}
    return None


# ---------- HST call history (dates and links only) ----------
def call_history(t):
    p = os.path.join(SRC, "contrib", "earnings-calls", f"{t}.md")
    if not os.path.exists(p):
        return {}
    txt = open(p, encoding="utf-8").read()
    out = {}
    for m in re.finditer(r"^### Q(\d) (\d{4})[^,\n]*, call \w{3} (\d{4}-\d{2}-\d{2})\s*\n- \*\*Links:\*\*(.*)$", txt, re.M):
        q = f"{m.group(2)}Q{m.group(1)}"
        links = dict((lbl.strip(), url) for lbl, url in re.findall(r"\[([^\]]+)\]\((https?://[^)]+)\)", m.group(4)))
        ev = next((u for l, u in links.items() if "webcast" in l.lower() or "event" in l.lower()), None)
        out[q] = {"callDate": m.group(3), "eventUrl": ev}
    return out


# ---------- dividends (reit_dividends.csv, final file) ----------
def dividends_for(t):
    out = []
    for d in rd("reit_dividends.csv"):
        if d["ticker"] != t or not d["source_uri"].startswith("http"):
            continue
        v = num(d["dividend_per_common_share"])
        if v is None:
            continue
        how = "SEC XBRL" if d["extraction_method"] == "xbrl" else ("8-K earnings release" if d["source_kind"] == "press_release" else "filing text")
        filed = f", filed {fdate(d['filing_date'])}" if d["filing_date"] else ""
        out.append({"value": v, "url": d["source_uri"], "source": how + filed, "quarter": d["quarter"],
                    "special": d.get("release_mentions_special", "") == "yes"})
    return sorted(out, key=lambda x: x["quarter"])


# ---------- assemble ----------
excl = {(e["ticker"], e["metric"]): e for e in rd("coverage_exclusions.csv")}
reits = []
coverage = {}
for t in TICKERS:
    rv, ad, oc, rb = pick_perf(t)
    hc, _ = pick_series(t, "hotel_count", ["total", "other", "same_store"])
    rc, _ = pick_series(t, "room_count", ["total", "other", "same_store"])
    dv, _ = pick_series(t, "dividend_declared_per_share", ["other", "total", "same_store"])
    qs = [q for q in quarters_all if q in rv or q in ad or q in oc]
    latest_q = max([q for q in quarters_all if q in rv or q in ad or q in oc] or [None], key=lambda x: x or "")
    lq_h = max(hc) if hc else None
    lq_r = max(rc) if rc else None
    hist = call_history(t)
    rel = []
    for q, e in sorted(releases[t].items()):
        h = hist.get(q, {})
        rel.append({**e, "callDate": h.get("callDate"), "eventUrl": h.get("eventUrl")})
    markets = []
    for (kind, key), plist in sorted(reit_markets[t].items(), key=lambda kv: (kv[0][0] != "m", -len(kv[1]), kv[0][1])):
        label = market_names.get(key, key) if kind == "m" else key
        markets.append({"slug": key if kind == "m" else None, "label": label,
                        "properties": sorted(plist, key=lambda p: -(p["rooms"] or 0))})
    tprops = sorted([prop_view(p) for p in props if p["ticker"] == t], key=lambda p: p["name"])
    r = {
        "ticker": t, "name": NAMES[t], "peer": PEER[t], "latestQuarter": latest_q,
        "latest": {
            "revpar": cited(rv.get(latest_q)), "adr": cited(ad.get(latest_q)), "occupancy": cited(oc.get(latest_q)),
            "hotels": cited(hc.get(lq_h), basis=False) if lq_h else None,
            "rooms": cited(rc.get(lq_r), basis=False) if lq_r else None,
        },
        "countsQuarter": lq_h,
        "quarters": [{"quarter": q, "revpar": cited(rv.get(q)), "adr": cited(ad.get(q)), "occupancy": cited(oc.get(q))} for q in qs],
        "properties": tprops,
        "markets": markets,
        "dividends": dividends_for(t),
        # Per the cohort data report: the transaction record is known to be incomplete for these REITs.
        "txIncomplete": t in ("HST", "PK", "SHO", "CLDT"),
        "dividendNote": ({"text": "No common dividends declared in this period. The 10-K distribution policy: no common dividends until accumulated preferred dividends are paid.",
                          "url": excl[(t, "dividend_declared_per_share")]["evidence_uri"], "source": "10-K, Distribution Policy"}
                         if (t, "dividend_declared_per_share") in excl and excl[(t, "dividend_declared_per_share")]["evidence_uri"].startswith("http") else None),
        "transactions": sorted([tx_view(c) for c in changes if c["ticker"] == t], key=lambda x: x["date"], reverse=True),
        "guidance": guidance_for(t),
        "debt": debt_for(t),
        "buybacks": buybacks_for(t),
        "releases": rel,
        "nextCall": next_call(t),
    }
    reits.append(r)
    coverage[t] = {
        "quarters_with_revpar_adr_occ": sum(1 for q in quarters_all if q in rv and q in ad and q in oc),
        "missing_quarters": [q for q in quarters_all if not (q in rv and q in ad and q in oc)],
        "basis": rb, "latest": latest_q, "hotels_q": lq_h, "rooms_q": lq_r,
        "properties": len(tprops), "props_in_site_markets": sum(len(v) for (k, _), v in reit_markets[t].items() if k == "m"),
        "transactions": len(r["transactions"]), "guidance_releases": len(r["guidance"]), "debt": bool(r["debt"]),
        "buybacks": len(r["buybacks"]), "releases": len(rel), "next": (r["nextCall"] or {}).get("kind"),
    }

# Universe totals count every current row (owned or pending_disposition), including the unnamed schedule rows
# that are not listed by name on the pages.
cur_rows = [p for p in props_all if p["status"] in ("owned", "pending_disposition")]
hotels_total = len(cur_rows)
snap = {
    "built": datetime.datetime.now().isoformat(timespec="seconds"),
    "as_of_label": fdate(max(f["filing_date"] for f in filings)) if filings else "",
    "target_quarters": quarters_all,
    "first_capture": "2026-10-27",
    "captured": None,
    "universe": {"hotels": hotels_total, "rooms": sum(int(num(p["rooms"]) or 0) for p in cur_rows),
                 "hotels_source": "FY2025 10-K property schedules, rolled forward for later purchases and sales"},
    "reits": reits,
}
os.makedirs(OUT, exist_ok=True)
json.dump(snap, open(os.path.join(OUT, "snapshot.json"), "w"), indent=1, ensure_ascii=False)
mo = {slug: {"hotels": sorted(h, key=lambda x: (x["ticker"], x["name"])),
             "comps": sorted(comps_by_market.get(slug, []), key=lambda x: x["date"], reverse=True)}
      for slug, h in owners_by_market.items()}
for slug, c in comps_by_market.items():
    mo.setdefault(slug, {"hotels": [], "comps": sorted(c, key=lambda x: x["date"], reverse=True)})
json.dump(mo, open(os.path.join(OUT, "market-owners.json"), "w"), indent=1, ensure_ascii=False)

print("== coverage"); [print(t, v) for t, v in coverage.items()]
print("== property market matching", dict(match_log), "unnamed rows left out:", [(p["ticker"], p["state"], p["rooms"]) for p in unnamed])
for k, v in unmatched_examples.items():
    print(" unmatched", k, v[:8])
print("== market owners", {s: (len(v["hotels"]), len(v["comps"])) for s, v in sorted(mo.items())})
print("== name-derived matches", sum(1 for v in mo.values() for h in v["hotels"] if h["match"] == "name"))

# ---------- Tuesday Trends lists: which listed hotels a REIT owns ----------
import glob
AFFIL = [r"an official walt disney world hotel", r"disney springs area", r"the unbound collection by hyatt",
         r"a luxury collection (hotel|resort)", r"curio collection by hilton", r"curio collection", r"autograph collection",
         r"a tribute portfolio (hotel|resort)", r"tribute portfolio", r"lxr hotels (and|&) resorts", r"a hilton hotel",
         r"by (hyatt|hilton|marriott|ihg|wyndham)"]
GENERIC = {"the", "a", "an", "hotel", "hotels", "resort", "resorts", "and", "spa", "by", "at", "of", "on", "in", "convention", "center"}
BRAND_EXTRA = {"kimpton", "hotel"}


def toks(n):
    n = clean_name(n).lower().replace("&", " and ").replace("’", "'")
    for a in AFFIL:
        n = re.sub(a.replace("(and|&)", "(and|&)"), " ", n)
    n = re.sub(r"[^a-z0-9' ]+", " ", n)
    return {w for w in n.split() if w not in GENERIC}


tt_badges = {}
tt_low = []
tt_counts = {}
lists_dir = os.path.join(REPO, "src", "data", "tuesday-trends", "lists")
latest_list = sorted(glob.glob(os.path.join(lists_dir, "v*")))[-1]
for f in sorted(glob.glob(os.path.join(latest_list, "*.json"))):
    L = json.load(open(f))
    mk = L["market"]
    hits = {}
    for h in L["hotels"]:
        addr = h.get("address") or ""
        m = re.search(r",\s*([^,]+),\s*([A-Z]{2})\s*\d{5}", addr)
        hcity, hst = (m.group(1).strip().lower(), m.group(2)) if m else (None, None)
        ht = toks(h["name"])
        cands = []
        for p in props:
            pst = norm_state(p["state"]) or STATE_NAMES.get(p["schedule_section"], "")
            if hst and pst and pst != hst:
                continue
            pt = toks(p["name"])
            if not pt or not ht:
                continue
            pc = re.sub(r"\s*\(.*\)$", "", p["city"]).strip().lower()
            city_ok = (not pc) or bool(hcity and (pc == hcity or pc in hcity or hcity in pc))
            j = len(ht & pt) / len(ht | pt)
            small, big = (pt, ht) if len(pt) <= len(ht) else (ht, pt)
            subset_ok = small <= big and len(small) >= 3 and (big - small) <= BRAND_EXTRA and "/" not in h["name"]
            high = city_ok and p["name_constructed"] != "yes" and (ht == pt or subset_ok)
            cands.append((high, j, p, city_ok))
        if not cands:
            continue
        cands.sort(key=lambda c: (c[0], c[1]), reverse=True)
        high, j, p, city_ok = cands[0]
        if high and sum(1 for c in cands if c[0]) == 1:
            hits[h["hotel_id"]] = {"ticker": p["ticker"], "hotel": h["name"], "matched": clean_name(p["name"]), "url": p["source_uri"]}
        elif j >= 0.5:
            tt_low.append(f"{mk}: '{h['name']}' ~ {p['ticker']} '{clean_name(p['name'])}' ({p['city'] or '-'}, {p['state']}) j={j:.2f}{' constructed-name' if p['name_constructed']=='yes' else ''}{'' if city_ok else ' city-mismatch'}")
    used = collections.Counter(x["matched"] + x["ticker"] for x in hits.values())
    for k in [k for k, x in hits.items() if used[x["matched"] + x["ticker"]] > 1]:
        x = hits.pop(k)
        tt_low.append(f"{mk}: '{x['hotel']}' ~ {x['ticker']} '{x['matched']}' (two list hotels matched one property)")
    tt_badges[mk] = hits
    tt_counts[mk] = len(hits)
json.dump(tt_badges, open(os.path.join(OUT, "tt-owner-badges.json"), "w"), indent=1, ensure_ascii=False)
print("== TT list matches (high confidence, shown)", tt_counts, "total", sum(tt_counts.values()))
for mk, v in tt_badges.items():
    for k, x in v.items():
        print("   ", mk, "|", x["hotel"], "=>", x["ticker"], x["matched"])
print("== TT low-confidence (not shown)", len(tt_low))
for l in tt_low:
    print("   ", l)
