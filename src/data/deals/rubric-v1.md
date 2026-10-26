# Recent Deals: Rubric v1

**Status: draft for Hal. Lower bands derived; Hal set top bands.**
Drafted 2026-10-25. Machine-readable copy: `rubric-v1.json` (same content; the grading script reads the JSON).

Factors and weights: spec v3 §4 (carried from v2), approved by Hal. Top bands (score 5): Hal, 2026-10-25.
Every band marked *derived* is a draft that steps down evenly from Hal's top band. Hal needs to sign off on these.

Public-data underwrite. The buyer's information set was larger.

## Scale
Each factor is scored as a whole number from 1 to 5.

## Factors and weights

| # | Factor | Weight | Metric | Source (public only) | As-of rule |
|---|---|---|---|---|---|
| 1 | Price/key vs replacement cost/key | 30% | % above (+) or below (−) replacement cost | HVS US Hotel Development Cost Survey (free); class and edition stated; land excluded | Latest edition published before announcement |
| 2 | Implied cap rate vs 10-yr spread | 25% | cap rate − 10-yr, in bp | Disclosed cap rate, or disclosed NOI ÷ price; 10-yr from Treasury daily par yield curve | 10-yr on announcement date (or prior business day) |
| 3 | Supply backdrop | 15% | market pipeline as % of existing rooms | Public CBRE/PwC outlooks plus Bungah supply radars | Published before announcement |
| 4 | Demand trajectory | 15% | lodging tax receipts, YoY % | Published tax receipts; Tuesday Trends forward curve for deals from Oct 2026 | Only data that existed before announcement |
| 5 | Debt/transaction context | 15% | category | Filings, court and receiver records, public loan notices, press | Public before announcement |

## Bands (exact cut points)

### 1. Price/key vs replacement cost (30%)
premium = (price/key − replacement cost/key) ÷ replacement cost/key. Negative means below replacement cost.

| Score | Cut | Set by |
|---|---|---|
| 5 | 40% or more below (premium ≤ −40%) | **Hal** |
| 4 | 20% to 40% below (−40% < premium ≤ −20%) | derived |
| 3 | within ±20% (−20% < premium < +20%) | derived |
| 2 | 20% to 40% above (+20% ≤ premium ≤ +40%) | derived |
| 1 | more than 40% above (premium > +40%) | derived |

### 2. Cap rate vs 10-year spread (25%)
spread_bp = (cap rate − 10-yr yield) × 100. Stated as a plain number of basis points. No cap rate or NOI disclosed = "not gradeable".

| Score | Cut | Set by |
|---|---|---|
| 5 | ≥ 400bp | **Hal** |
| 4 | 300bp to < 400bp | derived |
| 3 | 200bp to < 300bp | derived |
| 2 | 100bp to < 200bp | derived |
| 1 | < 100bp | derived |

Step: 100bp.

### 3. Supply backdrop (15%)
Market (MSA) pipeline rooms ÷ existing rooms. The cited source's pipeline definition (e.g. under construction) is recorded with the input.

| Score | Cut | Set by |
|---|---|---|
| 5 | < 2% of existing rooms | **Hal** |
| 4 | 2% to < 4% | derived |
| 3 | 4% to < 6% | derived |
| 2 | 6% to < 8% | derived |
| 1 | ≥ 8% | derived |

Step: 2 percentage points.

### 4. Demand trajectory (15%)
YoY change in published lodging (tourist development) tax receipts, latest period published before announcement. Group context (e.g. convention center) is shown beside the score but doesn't change it.

| Score | Cut | Set by |
|---|---|---|
| 5 | ≥ +5% YoY | **Hal** |
| 4 | 0% to < +5% | derived |
| 3 | −5% to < 0% | derived |
| 2 | −10% to < −5% | derived |
| 1 | < −10% | derived |

Step: 5 percentage points.

### 5. Debt and transaction context (15%)
Categorical. If more than one category applies, the lowest score applies.

| Score | Category | Set by |
|---|---|---|
| 5 | Clean arm's-length sale, no distress | **Hal** |
| 4 | Arm's-length, no distress, but the structure blurs the price signal: portfolio-allocated price, loan assumption or seller financing, earn-out/contingent consideration, partial interest or JV recap | derived |
| 3 | Pressured seller without formal distress (publicly flagged maturity within 12 months, watchlist, fund wind-down), or a related-party / non-arm's-length deal | derived |
| 2 | Formal distress: loan in special servicing, notice of default, lender-negotiated sale (discounted payoff, deed in lieu) | derived |
| 1 | Forced or receiver sale: receivership, foreclosure, bankruptcy (§363) or court-ordered sale | derived |

## Missing-factor rule
A factor without qualifying public input is not graded and shows "not graded yet" (or "not gradeable" for spread when no cap rate or NOI was disclosed). Its weight is spread pro rata across the graded factors (weight ÷ sum of graded weights), and the entry shows coverage: "k of 5 factors graded". **With fewer than 3 of 5 graded there's no overall grade: "Insufficient public data".**

## Overall grade (derived, for Hal)
Weighted mean of the graded factor scores using the renormalized weights, rounded to one decimal, shown as "X.X of 5".

## No-look-ahead rule
Every input must have been public on or before the announcement date.
- Replacement cost: latest HVS edition published before announcement.
- 10-yr: Treasury daily par yield curve on the announcement date, or the prior business day.
- Supply and demand: published before announcement. (Grande Lakes, announced Aug 10, 2026, predates Tuesday Trends, so its demand factor uses tax receipts and OCCC group context published by Aug 10.)
- An input dated after announcement is rejected and that factor stays ungraded.
- Later data (closing, resale, RevPAR, tax receipts) goes only to the anniversary tracker (T+1, T+2), never into the grade.

## Inclusion rule (Hal, 2026-10-25)
A deal is added if EITHER:
- (a) one of the 13 tracked hotel REITs (AHT, APLE, BHR, CLDT, DRH, HST, INN, PEB, PK, RHP, RLJ, SHO, XHR) is buyer or seller, at any size; OR
- (b) it's a US hotel sale with a disclosed price of $100M or more.

Every qualifying deal is logged, including ones not yet graded. Unpriced deals in non-disclosure states are listed as unpriced and never estimated; they're graded only if they qualify under (a). Event date = announcement date; a later close is a status update on the same entry.

## Output line (mechanical)
"Underwritten at a {X}% {discount|premium} to replacement with a {N}bp spread; {k} of 5 factors graded."
Ungraded pieces read "replacement cost not graded" / "spread not gradeable (no cap rate or NOI disclosed)".

## Other rules
- Public data only. No Trepp loan-level, CoStar, STR or CBRE Horizons. No paid sources.
- Grade deals, never buyers. Spread in plain bp; no comparative framing against Treasuries; no internal IC thresholds.
- Versioned: a rubric change re-grades every entry and shows both versions.
