# The Wade, Option B (Insufficient): prepared, NOT applied

**Status:** Option A is still the default on ship-nov2. The Wade shows **4.8 of 5 · 3 of 5 factors graded**, with the history line "Earlier v1.1 grade 4.0 (supply scored 1; withdrawn Nov 1: room count unavailable)".

Option B is a prepared patch that nothing applies yet. No DB writes were made and none are needed: grades come from repo JSON (`src/data/deals/sale_grades.json`), not Neon.

- Patch in the repo: `scripts/deals/pending/wade-option-b.patch` (committed on ship-nov2, not applied)
- Copy: `/workspace/bungah-audit/ship-nov2/wade-option-b.patch`
- sha256: bf47063628f51fcedaf7433ca0c0a2257fd4851e8cc8683f5a5edccaee034c42
- `git apply --check` passes on the ship-nov2 head.

## The one-line switch

```bash
cd /workspace/bci-ship-nov2 && git apply scripts/deals/pending/wade-option-b.patch
```

Then verify, commit and preview as usual:

```bash
npx tsc --noEmit -p .
npx tsx scripts/deals/test-headline.ts
env -u DATABASE_URL -u BUNGAH_USE_LLM BUNGAH_NO_NEXT_CACHE=1 BUNGAH_GRAPH_FIXTURE=/workspace/backups/bungah-db/latest npx tsx scripts/chat/test-deal-match.ts
# plus the follow-up and leak suites, then predeploy (SMOKE_PORT=3193), then: vercel deploy --scope bungah --yes   (preview)
git -c user.name="Hal Vespucci" -c user.email="hal@bungah.io" commit -am "Wade Option B: v1.1 revision 5, overall withheld (Insufficient public data)"
```

**Revert before committing:** `git apply -R scripts/deals/pending/wade-option-b.patch`. After a commit, use `git revert <sha>`. The grade data is append-only, so a revert is a new commit and never a rewrite.

## What the patch does

The patch follows the append-only rule. The grade row is written by the grader (`scripts/deals/grade.ts --revision 5 --write`), not by hand.

1. **Grader inputs** (`src/data/deals/grader-inputs/the-wade-chicago-2026.json`) get a stated decision:
   `"withhold_overall": {"reason": "supply withdrawn for lack of a room count, leaving only the rubric minimum", "decided_by": "Hal Vespucci (Wade Option B)", "decided_on": "2026-11-02"}`
2. **Grader code** (`src/lib/deals-grade.ts`): this is inert for every deal without `withhold_overall`.
   - `gradeDeal` withholds the overall when a reason is stated. It leaves every factor row unchanged and records `withheld_reason`.
   - `headlineText` adds the reason after "insufficient public data".
   - `revisionHistoryLine` adds "overall withheld <date>: <reason>".
3. **Appended `sale_grades.json` row**: the-wade-chicago-2026, v1.1 **revision 5**, graded_on 2026-11-02.
   - overall `null`, overall_label "Insufficient public data", factors_graded 3 of 5.
   - The factor scores are identical to revision 4: RC 5, demand 4, debt context 5; spread and supply not graded.
   - `withheld_reason` is set. Revisions 1 to 4 are kept unchanged.
4. **Appended `grade_log.csv` row**:
   `2026-11-02,DL-2026-005,the-wade-chicago-2026,revision,v1.1,v1.1,4.8 of 5,Insufficient public data,none,"v1.1 revision 4->5 (Option B, decided by Hal 2026-11-02): overall withheld. Room count unavailable, so supply was withdrawn at revision 4, leaving only the minimum 3 of 5 factors (RC 5, demand 4, debt context 5). Factor scores unchanged; the 3-of-5 rule alone gives 4.8 of 5, so this is a stated decision recorded as withhold_overall in the grader inputs. Shown as Insufficient public data."`
5. **Chat** (`src/lib/chat-items.ts`):
   - A grade question about a deal with a withheld overall now answers "no overall grade" with the reason. Without this, "How was The Wade graded?" fell through to the generic "didn't match a market" reply.
   - The advice brief says "overall withheld (<reason>)" and states the factor count only once.
   - Deals that are Insufficient for having under 3 factors (Midway) are unchanged.
6. **Tests** are updated to the Option B expectations:
   - `test-headline`: Wade label, line, card and history.
   - `test-deal-match`: the Wade grade card and advice lead read Insufficient, with no 4.8; the 4.8 grade-card checks move to Hotel Zags.

**Why this needs a stated decision:** under rubric v1.1, `missing_factor_rule.min_factors_graded` is 3, and The Wade has exactly 3 of 5 factors graded. The rule on its own gives 4.75, shown as 4.8. Option B is therefore a logged override and not a rubric outcome. The reason, who decided and the date go in the inputs, the grade row and the log.

## What readers would see after the flip (checked in a scratch worktree, then discarded)

- **Deal page grade:** "Insufficient public data"
- **Deal page line:** "Underwritten at a 90% discount to replacement; spread not graded (no trailing-12-month cap rate or NOI disclosed); supply not graded (closures listed without room counts); 3 of 5 factors graded; insufficient public data (supply withdrawn for lack of a room count, leaving only the rubric minimum)."
- **History line:** "Earlier v1.1 grade 4.8 (overall withheld Nov 2: supply withdrawn for lack of a room count, leaving only the rubric minimum)"
  - It names only the latest earlier grade that differs (4.8). The earlier 4.0 with supply scored 1 stays in `sale_grades.json` and `grade_log.csv`, but drops off the page line.
- **Index card:** "Insufficient · 3 of 5 factors graded · Not graded: spread, supply"
- **Chat, "Tell me about The Wade" / "How was The Wade graded?":** "The Wade, Chicago, IL: no overall grade (rubric v1.1, Nov 2, 2026). Underwritten at a 90% discount to replacement; …; 3 of 5 factors graded; insufficient public data (supply withdrawn for lack of a room count, leaving only the rubric minimum)."
- **Chat, "Should I buy The Wade?":** the decline, then "The Wade, Chicago, IL: Insufficient public data · 3 of 5 factors graded (rubric v1.1, graded Nov 2, 2026). Underwritten at a 90% discount to replacement; spread not graded (…); supply not graded (closures listed without room counts); overall withheld (supply withdrawn for lack of a room count, leaving only the rubric minimum)."

**Scratch results with the patch applied:**
- tsc 0
- test-headline: all passed
- test-deal-match: all passed

Run the full follow-up and leak suites again after a real flip.

## Hotel Zags: what B means for it

Hotel Zags (hotel-zags-portland-2026, v1.1 revision 2) has **the same profile** as The Wade:
- 4.8 of 5 on 3 of 5 factors: RC 5 (50%), demand 4 (25%), debt context 5 (25%).
- Spread is not graded (trailing NOI was negative).
- Supply is not graded ("No dated room count or single-source pipeline share for central Portland was public by Oct 9, 2026").

The only difference is history. Zags never had a supply score to withdraw; The Wade had supply scored 1 and withdrawn at revision 4.

**Option B for The Wade only (what the patch does):**
- Zags stays at 4.8 of 5.
- The reason is Wade-specific ("supply withdrawn …"), so the policy is defensible as "a factor withdrawn after publication leaves a grade at the bare minimum".
- But readers will see two deals with identical factor scores, one graded 4.8 and one Insufficient. That is the consistency cost.

**Option B as a policy ("3 of 5 with supply missing for lack of a room count means no overall"):**
- Zags would also need a stated decision: v1.1 **revision 3** via the same mechanism.
- Steps:
  1. After applying the Wade patch, add `withhold_overall` to `src/data/deals/grader-inputs/hotel-zags-portland-2026.json`, with a reason such as "supply not graded for lack of a room count, leaving only the rubric minimum".
  2. Run `npx tsx scripts/deals/grade.ts --inputs src/data/deals/grader-inputs/hotel-zags-portland-2026.json --rubric src/data/deals/rubric-v1.1.json --graded-on <date> --revision 3 --write`.
  3. Append a DL-2026-012 `revision` row to `grade_log.csv` (4.8 of 5 → Insufficient public data).
  4. In `test-headline.ts` and `test-deal-match.ts`, move the Zags expectations to Insufficient. The "4.8 grade card" check would then need another graded deal, e.g. Embassy Suites Las Vegas at 3.6.
- The cleaner long-term version is a rubric change (e.g. v1.2, `min_factors_graded: 4`). That would affect every deal graded on 3 of 5, which today is five deals: The Wade 4.8, Hotel Zags 4.8, Embassy Suites Dulles Airport 4.3, Embassy Suites Philadelphia Airport 4.3 and Tideline Palm Beach 3.0. A rubric change is therefore a much bigger step than a Wade/Zags decision.

This Zags patch has not been prepared or applied.

## Not done (by design)

- Not applied, not deployed, no DB writes.
- Option A stays live on the ship-nov2 preview.
