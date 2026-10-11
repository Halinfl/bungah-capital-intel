# Training / eval corpus (legal + privacy rules)

Export of **Bungah Capital Intel** chat Q&A for future fine-tune or eval.
This folder is **not** a live fine-tune job — RAG remains the production path (`src/lib/chat-llm.ts` + `chat-retrieve.ts`).

## Public vs private (Hal rule)

| Path | Clerk | `isPrivate` | `trainEligible` | Bodies in `ChatQuestionLog` | In train export |
| --- | --- | --- | --- | --- | --- |
| Public chat (`/chat`, signed out) | no `userId` | `false` | `true` | Full Q&A + citations | **Yes** (JSONL) |
| Encrypted / logged-in private workspace | signed in | `true` | `false` | Redacted (`question="[private]"`, no `answerText`) | **Never** |

- **Use public questions to train** the internal LLM corpus.
- **Unless** the user is in an encrypted / logged-in private chat → `trainEligible=false`.
- Private threads **may still save** to `ChatThread` / `ChatMessage` for the user product.
- `scripts/export-train-corpus.ts` queries **only** `trainEligible=true` (and `isPrivate=false`). Private rows are skipped even if bodies were present.

## Allowed sources

| Allowed | Notes |
| --- | --- |
| Our chat answers | Rows from `ChatQuestionLog.answerText` where `trainEligible=true` |
| Public Capital Graph facts | Markets / signals / assets / radars already in Prisma |
| Authored digests | `content/earnings/**/*-digest.md` (Hal/Neo summaries of public IR) |
| Ideology notes | `content/ideology/*.md` |

## Forbidden

- **Private workspace message bodies** — never export `trainEligible=false` / `isPrivate=true`
- **No CSP** — customer / private capital-sourcing profiles, CRM, deal rooms
- **No STR licensed raw** — CoStar / STR competitive-set dumps, paywalled indices
- **No bulk IR transcript training** — do not scrape or train on full earnings-call transcripts or `_raw/` IR HTML; digests cite public headlines only
- Secrets, API keys, `.env`, Clerk tokens

## Export

```bash
npm run train:export
```

Writes `data/train/bungah-chat-corpus.jsonl` (gitignored when large). Keep this README, the export script (`scripts/export-train-corpus.ts`), and `sample-record.jsonl`.

## Record shape

```json
{
  "messages": [
    { "role": "system", "content": "<hotel IC analyst rules: cite-only, propose-only>" },
    { "role": "user", "content": "<question>" },
    { "role": "assistant", "content": "<our answer>" }
  ],
  "meta": {
    "intent": "which_submarket",
    "marketSlug": "orlando",
    "citations": ["Visit Orlando illustrative seed", "content/earnings/hilton/2026-Q2-digest.md"],
    "source": "llm",
    "modelUsed": "llm",
    "trainEligible": true,
    "isPrivate": false
  }
}
```

`meta.source` / `modelUsed` is `llm` or `memo`. Empty / error / private rows are skipped.

## Schema fields (`ChatQuestionLog`)

`question`, `answerText`, `citationsJson` (citations), `intent`, `marketSlug`, `modelUsed`, `trainEligible`, `isPrivate`, `userId?`, `answerSnippet`, `answeredWell`, `threadId`, `createdAt`.
