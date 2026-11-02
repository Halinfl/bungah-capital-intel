# Recent Deals data (spec v3 §6)

Files in the repo, never DB tables (the prod DB is shared).

| File | Spec table | Notes |
|---|---|---|
| `rubric-v1.json` / `rubric-v1.md` | rubric | Committed before any grade. Lower bands derived; top bands set by Hal. |
| `rubric-v1.1.json` / `rubric-v1.1.md` | rubric | Current (approved by Hal 2026-11-01). One-line changelog in `rubric-v1.1.md`. Pages import v1.1; v1 grades stay as originals. |
| `graded_sales.json` | graded_sales | One row per entry. Every number cites `source_uris`. |
| `sale_grades.json` | sale_grades | Written only by `scripts/deals/grade.ts --write`. Never hand-edit. Empty until the team inputs land. |
| `grade_log.csv` | (log) | Append-only. One row per grade or re-grade event (from/to rubric, overall, factor changes). Never edit rows. |
| `sale_anniversaries.json` | sale_anniversaries | T+1 / T+2 values once they land. Never part of the grade. |
| `deal_log.csv` | deal_log | Append-only. Every qualifying deal seen. After editing, run `node scripts/deals/build-deal-log.mjs` to refresh `deal_log.json`, which is what the pages import. |
| `entries.json` | (editorial) | Tape, financing tags, watches-for, related links, sources. `null` = not written yet; the page shows nothing rather than filler. |

Test fixtures for the grader live OUTSIDE the repo and are refused by `--write`.

## Revisions and citations (2026-11-01)

- A corrected grade under the same rubric version is appended as a new revision (`grade.ts --revision N`); nothing in sale_grades.json is edited or deleted. Pages show the latest revision of each rubric version. Each revision gets an `event=revision` row in grade_log.csv.
- citations.json holds public citation lines for report-type sources. The data credit is one field (`data_credit`); set it to "" to drop the parenthetical.
- Source kind `report` is a public body's own research publication (Choose Chicago, LVCVA), listed after records and before press.
