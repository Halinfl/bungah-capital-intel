# Earnings digests (shipped corpus)

editor-authored digests of **public** company IR / 8-K commentary for Bungah Capital Intel chat.

These files are committed under `content/earnings/` so Vercel serverless has them at runtime. Chat retrieval (`src/lib/chat-retrieve.ts`) loads matching digests into the LLM context and cites the file path.

## Coverage (v0)

| Slug | Ticker | File |
| --- | --- | --- |
| hilton | HLT | `hilton/2026-Q2-digest.md` |
| host-hotels | HST | `host-hotels/2026-Q2-digest.md` |
| pebblebrook | PEB | `pebblebrook/2026-Q2-digest.md` |

Upstream drafts live in `product/earnings/`. Prefer copying digests here over shipping `_raw/` IR HTML.

## Rules

- Cite-backed public sources only
- Never invent STR / competitive-set indices
- decision support Capital Graph signal proposals
- No fine-tuning on this corpus — RAG only
