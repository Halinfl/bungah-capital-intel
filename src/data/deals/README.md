# Recent Deals data (spec v3 §6)

Files in the repo, never DB tables (the prod DB is shared).

| File | Spec table | Notes |
|---|---|---|
| `rubric-v1.json` / `rubric-v1.md` | rubric | Committed before any grade. Lower bands derived; top bands set by Hal. |
| `graded_sales.json` | graded_sales | One row per entry. Every number cites `source_uris`. |
| `sale_grades.json` | sale_grades | Written only by `scripts/deals/grade.ts --write`. Never hand-edit. Empty until the team inputs land. |
| `sale_anniversaries.json` | sale_anniversaries | T+1 / T+2 values once they land. Never part of the grade. |
| `deal_log.csv` | deal_log | Append-only. Every qualifying deal seen. After editing, run `node scripts/deals/build-deal-log.mjs` to refresh `deal_log.json`, which is what the pages import. |
| `entries.json` | (editorial) | Tape, financing tags, watches-for, related links, sources. `null` = not written yet; the page shows nothing rather than filler. |

Test fixtures for the grader live OUTSIDE the repo and are refused by `--write`.
