#!/usr/bin/env python3
"""Export a REIT property panel capture (summary JSON + rates CSV from the Tuesday capture) into the slim static file the
REIT pages read: src/data/reits/panel-summary.json. No database reads or writes.

Usage: python3 scripts/reits/export_panel_summary.py <summary-<date>-reit-panel-....json> <rates-<date>-reit-panel-....csv> [--out PATH]

Until the first real capture the committed file is `null` and the pages keep their pre-capture state.
REIT thin rule (REIT view only; decided 2026-10-25): a REIT x horizon x stay median is shown when at least 8 hotels have a
refundable rate used in the median (n_refundable >= 8; same exclusions as the medians: priced, not low-confidence). Below 8 it is
exported as null with thin = true, never as a number. The capture summary keeps the Tuesday Trends market flags (< 15) untouched;
this export re-applies the REIT rule to the cell medians (which the summary keeps unrounded-by-rule in cells[]).
--thin-below N overrides the rule for a LOCAL render check only; never commit a file built with it.
"""
import csv, json, os, statistics, sys

REIT_THIN_BELOW = 8
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
out = os.path.join(REPO, "src", "data", "reits", "panel-summary.json")
if "--out" in sys.argv:
    out = sys.argv[sys.argv.index("--out") + 1]
    args = [a for a in args if a != out]
thin_below = REIT_THIN_BELOW
if "--thin-below" in sys.argv:
    tb = sys.argv[sys.argv.index("--thin-below") + 1]
    thin_below = int(tb)
    args = [a for a in args if a != tb]
    print(f"WARNING: thin rule overridden to < {thin_below} (local render check only; do not commit)", file=sys.stderr)
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
        "refundable": None if c["n_refundable"] < thin_below else c["median_cheapest_refundable_pretax"], "nRefundable": c["n_refundable"],
        "lowest": None if c["n_used_in_medians"] < thin_below else c["median_headline_pretax"], "nUsed": c["n_used_in_medians"],
        "nPriced": c["n_priced"], "nList": c["n_list"], "thin": c["n_refundable"] < thin_below,
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
    # headline = the REIT's 30d weekday cell, under the REIT thin rule (not the summary's 15-hotel flags)
    hc = next((c for c in cells_by.get(t, []) if c["horizon"] == hh and c["stay"] == hs), None)
    reits[t] = {
        "medianRate": hc["refundable"] if hc else None, "thin": hc["thin"] if hc else True,
        "nUsed": hc["nRefundable"] if hc else 0, "priced": v["hotels_priced_any_cell"], "of": v["current_hotels"],
        "panelHotels": v["panel_hotels"], "cells": cells_by.get(t, []), "hotelRates": hotel_rates.get(t, {}),
    }
first = next(iter(summ["reits"].values()))["headline"] or {}
data = {
    "captureDate": summ["capture_date"], "methodVersion": summ["method_version"], "listVersion": summ["list_version"],
    "methodUrl": "/reits/methodology#captures",
    "headline": {"horizon": hh, "stay": hs, "checkIn": first.get("check_in"), "checkOut": first.get("check_out"), "nights": first.get("nights")},
    "thinBelow": thin_below, "reits": reits,
}
json.dump(data, open(out, "w"), indent=1, ensure_ascii=False)
print(f"wrote {out}: {len(reits)} REITs, capture {data['captureDate']}")
