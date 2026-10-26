#!/usr/bin/env python3
"""Export a REIT property panel capture (summary JSON + rates CSV from the Tuesday capture) into the slim static file the
REIT pages read: src/data/reits/panel-summary.json. No database reads or writes.

Usage: python3 scripts/reits/export_panel_summary.py <summary-<date>-reit-panel-....json> <rates-<date>-reit-panel-....csv> [--out PATH]

Until the first real capture the committed file is `null` and the pages keep their pre-capture state.
Thin-coverage rules are the Tuesday Trends ones, carried in the summary (thin_data / thin_refundable: fewer than 15 rows used);
a thin median is exported as null with thin = true, never as a number.
"""
import csv, json, os, statistics, sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
out = os.path.join(REPO, "src", "data", "reits", "panel-summary.json")
if "--out" in sys.argv:
    out = sys.argv[sys.argv.index("--out") + 1]
    args = [a for a in args if a != out]
summ = json.load(open(args[0]))
rows = list(csv.DictReader(open(args[1])))
if summ.get("panel") != "reit":
    sys.exit("not a REIT panel summary")
tru = lambda v: str(v) == "True"
hh, hs = summ["headline_cell"].split() if "headline_cell" in summ else ("30d", "weekday")
cells_by = {}
for c in summ["cells"]:
    cells_by.setdefault(c["ticker"], []).append({
        "horizon": c["horizon"], "stay": c["stay_type"], "checkIn": c["check_in"], "checkOut": c["check_out"], "nights": c["nights"],
        "refundable": None if c["thin_refundable"] else c["median_cheapest_refundable_pretax"], "nRefundable": c["n_refundable"],
        "lowest": None if c["thin_data"] else c["median_headline_pretax"], "nUsed": c["n_used_in_medians"],
        "nPriced": c["n_priced"], "nList": c["n_list"], "thin": bool(c["thin_refundable"]),
    })
# per-hotel rate on the headline stay (cheapest refundable, pre-tax), low-confidence rows left out as in the medians
hotel_rates = {}
for r in rows:
    if r["horizon"] == hh and r["stay_type"] == hs and r["status"] == "priced" and not tru(r["low_confidence"]) \
            and r["cheapest_refundable_price"] not in ("", None):
        hotel_rates.setdefault(r["ticker"], {}).setdefault(r["hotel_name"], []).append(round(float(r["cheapest_refundable_price"])))
# a name that appears on two rows of one REIT (two hotels filed under one name) is ambiguous: no per-hotel rate
hotel_rates = {t: {n: v[0] for n, v in d.items() if len(v) == 1} for t, d in hotel_rates.items()}
reits = {}
for t, v in summ["reits"].items():
    h = v["headline"] or {}
    reits[t] = {
        "medianRate": h.get("median_cheapest_refundable_pretax"), "thin": bool(h.get("thin_refundable", True)),
        "nUsed": h.get("n_refundable", 0), "priced": v["hotels_priced_any_cell"], "of": v["current_hotels"],
        "panelHotels": v["panel_hotels"], "cells": cells_by.get(t, []), "hotelRates": hotel_rates.get(t, {}),
    }
first = next(iter(summ["reits"].values()))["headline"] or {}
data = {
    "captureDate": summ["capture_date"], "methodVersion": summ["method_version"], "listVersion": summ["list_version"],
    "methodUrl": "/reits/methodology#captures",
    "headline": {"horizon": hh, "stay": hs, "checkIn": first.get("check_in"), "checkOut": first.get("check_out"), "nights": first.get("nights")},
    "thinBelow": 15, "reits": reits,
}
json.dump(data, open(out, "w"), indent=1, ensure_ascii=False)
print(f"wrote {out}: {len(reits)} REITs, capture {data['captureDate']}")
