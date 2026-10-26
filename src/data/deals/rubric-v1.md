# Recent Deals: Rubric v1

**Status: Approved by Hal 2026-10-25.**
Drafted 2026-10-25 and approved the same day, before any deal was graded. Machine-readable copy: `rubric-v1.json` (same content; the grading script reads the JSON).

Factors and weights: spec v3 §4 (carried from v2), approved by Hal. Top bands (score 5): set by Hal, 2026-10-25. Lower bands (4 to 1): derived by stepping down evenly from Hal's top bands, then approved as drafted by Hal on 2026-10-25.

Public-data underwrite. The buyer's information set was larger.

## Hal's decisions (2026-10-25)
1. **Lower bands and overall grade.** All derived lower bands approved as drafted. Also approved: the weighted-mean overall shown as "X.X of 5", pro-rata reweighting of ungraded factors, and "Insufficient public data" when fewer than 3 of 5 factors are graded.
2. **10-year Treasury.** The daily par yield curve close **on the announcement date** (or the prior trading day if the announcement date isn't a trading day). This overrides the Amendment A timing (prior trading day's close) and matches spec v3 §4.
3. **Cap rate.** NOI for the trailing 12 months through the last quarter before the announcement, divided by price, or a disclosed cap rate on that basis (approved). NOI as the company itself defines and discloses it counts (e.g. Adjusted EBITDAre minus FF&E reserve). EBITDA alone is not NOI.
4. **Demand.** Trailing 12 months vs the prior 12, with fiscal year to date as the fallback (approved).
5. **Replacement cost.** The HVS **median** total development cost per key, **including land**, blended by keys across the HVS classes of the hotels in the deal. Each hotel's class is stated on the entry.
6. **Geography.** US means the 50 states and DC. **Puerto Rico and other US territories are excluded.**
7. **Supply.** Amendment C approved. Partial pipeline figures from public press releases, CoStar's included, may appear only as cited, ungraded context.

## Scale
Each factor is scored as a whole number from 1 to 5.

## Factors and weights

| # | Factor | Weight | Metric | Source (public only) | As-of rule |
|---|---|---|---|---|---|
| 1 | Price/key vs replacement cost/key | 30% | % above (+) or below (−) replacement cost | HVS U.S. Hotel Development Cost Survey (free): median total cost per key **including land**, key-weighted across the deal's HVS classes; edition and classes stated | Latest edition published before announcement |
| 2 | Implied cap rate vs 10-yr spread | 25% | cap rate − 10-yr, in bp | Cap rate on trailing-12-month NOI through the last quarter before announcement (disclosed, or disclosed NOI ÷ price); 10-yr from the Treasury daily par yield curve | 10-yr close on the announcement date |
| 3 | Supply backdrop | 15% | total pipeline (under construction + planned) as % of existing rooms, one source | Public CBRE/PwC outlooks, other free publications, Bungah supply radars | Published before announcement |
| 4 | Demand trajectory | 15% | lodging tax receipts, trailing 12 vs prior 12 months (fallback: fiscal YTD) | Published tax receipts; Tuesday Trends forward curve as context for deals from Oct 2026 | Latest month published by the announcement date |
| 5 | Debt/transaction context | 15% | category (lowest applicable) | Filings, court and receiver records, public loan notices, press | Public before announcement |

## Bands (exact cut points)

### 1. Price/key vs replacement cost (30%)
premium = (price/key − replacement cost/key) ÷ replacement cost/key. Negative means below replacement cost. Replacement cost/key = Σ(keys × HVS class median incl. land) ÷ total keys.

| Score | Cut | Set by |
|---|---|---|
| 5 | 40% or more below (premium ≤ −40%) | Hal (top band) |
| 4 | 20% to 40% below (−40% < premium ≤ −20%) | derived, approved |
| 3 | within ±20% (−20% < premium < +20%) | derived, approved |
| 2 | 20% to 40% above (+20% ≤ premium ≤ +40%) | derived, approved |
| 1 | more than 40% above (premium > +40%) | derived, approved |

### 2. Cap rate vs 10-year spread (25%)
spread_bp = (cap rate − 10-yr yield) × 100, stated as a plain number of basis points. No trailing-12-month cap rate or NOI disclosed = "not gradeable". Cap rates on other bases are shown but not graded.

| Score | Cut | Set by |
|---|---|---|
| 5 | ≥ 400bp | Hal (top band) |
| 4 | 300bp to < 400bp | derived, approved |
| 3 | 200bp to < 300bp | derived, approved |
| 2 | 100bp to < 200bp | derived, approved |
| 1 | < 100bp | derived, approved |

### 3. Supply backdrop (15%)
Total market (MSA) pipeline (under construction plus planned) ÷ existing rooms, from ONE public source. No stitching across publishers or stages.

| Score | Cut | Set by |
|---|---|---|
| 5 | < 2% of existing rooms | Hal (top band) |
| 4 | 2% to < 4% | derived, approved |
| 3 | 4% to < 6% | derived, approved |
| 2 | 6% to < 8% | derived, approved |
| 1 | ≥ 8% | derived, approved |

### 4. Demand trajectory (15%)
Lodging (tourist development) tax receipts, trailing 12 months vs the prior 12, through the latest month published by the announcement date (fallback: fiscal year to date, with the reason stated). A single month is context only. Group context (e.g. convention center) is shown beside the score but doesn't change it.

| Score | Cut | Set by |
|---|---|---|
| 5 | ≥ +5% | Hal (top band) |
| 4 | 0% to < +5% | derived, approved |
| 3 | −5% to < 0% | derived, approved |
| 2 | −10% to < −5% | derived, approved |
| 1 | < −10% | derived, approved |

### 5. Debt and transaction context (15%)
Categorical. If more than one category applies, the lowest score applies.

| Score | Category | Set by |
|---|---|---|
| 5 | Clean arm's-length sale, no distress | Hal (top band) |
| 4 | Arm's-length, no distress, but the structure blurs the price signal: portfolio-allocated price, loan assumption or seller financing, earn-out/contingent consideration, partial interest or JV recap | derived, approved |
| 3 | Pressured seller without formal distress (publicly flagged maturity within 12 months, watchlist, fund wind-down), or a related-party / non-arm's-length deal | derived, approved |
| 2 | Formal distress: loan in special servicing, notice of default, lender-negotiated sale (discounted payoff, deed in lieu) | derived, approved |
| 1 | Forced or receiver sale: receivership, foreclosure, bankruptcy (§363) or court-ordered sale | derived, approved |

## Missing-factor rule
A factor without qualifying public input is not graded and shows "Not graded" with a reason. Its weight is spread pro rata across the graded factors (weight ÷ sum of graded weights), and the entry shows coverage: "k of 5 factors graded". **With fewer than 3 of 5 graded there's no overall grade: "Insufficient public data".**

## Overall grade
Weighted mean of the graded factor scores using the renormalized weights, rounded to one decimal, shown as "X.X of 5".

## No-look-ahead rule
Every input must have been public on or before the announcement date.
- Replacement cost: latest HVS edition published before announcement.
- 10-yr: Treasury daily par yield curve close on the announcement date.
- Cap rate: trailing-12-month NOI through the last quarter before announcement.
- Supply and demand: published on or before announcement.
- An input dated after announcement is rejected and that factor stays ungraded.
- Later data (closing, resale, RevPAR, tax receipts) goes only to the anniversary tracker (T+1, T+2), never into the grade.

## Inclusion rule (Hal, 2026-10-25)
A deal is added if EITHER:
- (a) one of the 13 tracked hotel REITs (AHT, APLE, BHR, CLDT, DRH, HST, INN, PEB, PK, RHP, RLJ, SHO, XHR) is buyer or seller, at any size; OR
- (b) it's a US hotel sale with a disclosed price of $100M or more.

US means the 50 states and DC; Puerto Rico and other US territories are excluded. Every qualifying deal is logged, including ones not yet graded. Unpriced deals in non-disclosure states are listed as unpriced and never estimated; they're graded only if they qualify under (a). Event date = announcement date; a later close is a status update on the same entry.

## Output line (mechanical)
"Underwritten at a {X}% {discount|premium} to replacement with a {N}bp spread; {k} of 5 factors graded."
Ungraded pieces read "replacement cost not graded" / "spread not gradeable (no trailing-12-month cap rate or NOI disclosed)".

## Other rules
- Public data only. No Trepp loan-level, CoStar, STR or CBRE Horizons data as grading inputs, and no paid sources. CoStar figures republished in free press releases may appear only as cited, ungraded supply context (Hal, 2026-10-25).
- Grade deals, never buyers. Spread in plain bp; no comparative framing against Treasuries; no internal IC thresholds.
- Versioned: a rubric change re-grades every entry and shows both versions.

## Record of amendments before any grade (2026-10-25)
- **A. Cap rate and Treasury timing.** Cap-rate basis approved. The proposed prior-trading-day Treasury close was **replaced by Hal** with the announcement-date close.
- **B. Demand measure.** Approved. Reasoning: a single month is noisy, and fiscal YTD varies with where the deal falls in the fiscal year. Trailing 12 vs prior 12 months is the same length for every deal and removes seasonality.
- **C. Supply source rule.** Approved. Reasoning: figures combined from different publishers and stages double-count some rooms and miss others. One source and one definition can't be steered by picking pieces. When the public record lacks the number, the honest result is "Not graded".
