# Recent Deals: Rubric v1.1

**Status: Approved by Hal 2026-11-01.** Machine-readable copy: `rubric-v1.1.json` (the grading script reads the JSON). Supersedes `rubric-v1.md`, which stays as the record of v1; every v1 grade is kept in `sale_grades.json` as the original.

## Changelog
- **v1.1 (2026-11-01):** Same 5 factors, weights, bands and 3-of-5 cutoff; supply is net of closures, a CVB-defined downtown area can be the market for downtown hotels, and CoStar/STR pipeline totals republished free by a public body qualify (cited to that body); a company's published NOI definition can be applied to its hotel EBITDA; a month-end TTM ending before announcement qualifies; when only a price range was public at announcement, price per key uses the first confirmed price, dated to its confirmation.
- **v1.1 clarification (2026-11-01, approved by Hal):** Supply: pipeline net of closures. If a source lists closures without a room count, supply isn't graded for that deal.
- v1 (2026-10-25): first version, approved before any deal was graded (see `rubric-v1.md`).

Note: Hal's brief of 2026-11-01 says the brief's earlier "4 criteria" was wrong; v1.1 keeps the 5 factors as shipped. The earlier unapproved debt-context proposal printed by `grade-all.ts` as "v1.1-proposed" is **not** part of this v1.1; debt context is unchanged from v1.

## What changed vs v1 (Hal, 2026-11-01)
1. **Supply, net of closures.** The pipeline share counts rooms under construction plus planned, minus announced closures, over existing rooms, from one source. Supply: pipeline net of closures. If a source lists closures without a room count, supply isn't graded for that deal. (Clarification, Hal 2026-11-01.)
2. **Downtown market.** For a downtown hotel, a downtown area defined by the city's convention and visitors bureau (CVB) counts as the market (e.g. Choose Chicago's CBD).
3. **Public-body republication.** Vendor pipeline totals (CoStar/STR) that a public body (CVB, city, state) republishes for free can be graded, cited to that public body. Public pages name only the public body. Still one source, never stitched.
4. **Company NOI definition.** A company's own published NOI definition may be applied to its published hotel-level EBITDA. Shown as "our calculation using <company>'s NOI definition", with the EBITDA source and the definition source both cited and dated on or before announcement.
5. **Month-end TTM.** A trailing 12 months ending at any calendar month-end before the announcement qualifies (v1 required the last quarter-end).
6. **Price range at announcement.** When only a price range was public at announcement, price per key is graded on the first confirmed price, and that factor is dated to the confirmation date (stated on the entry). All other factors stay anchored to the announcement date. Deed prices still beat press prices.

Unchanged: factors and weights (30/25/15/15/15), all bands, the missing-factor rule (fewer than 3 of 5 graded = "Insufficient public data"), the weighted-mean overall, Treasury timing (announcement-date close), the demand measure, the HVS replacement-cost basis, the inclusion rule (50 states + DC), and the no-look-ahead rule apart from item 6.

## Grader
`src/lib/deals-grade.ts` reads the rule flags from the rubric JSON (`accepted_cap_rate_bases`, `company_noi_definition`, `price_range_rule`, `source_rule.net_of_closures`, `source_rule.closures_without_room_count`), so v1 grades re-run byte-identical under `rubric-v1.json`. v1.1 inputs live under `versions["v1.1"].factors` in each `grader-inputs/*.json`. Re-grades are appended with `npx tsx scripts/deals/grade.ts --inputs <file> --rubric src/data/deals/rubric-v1.1.json --graded-on 2026-11-01 --write` and logged in `grade_log.csv` (append-only).
