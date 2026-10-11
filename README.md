# Bungah Capital Intel

Silvia-style **hospitality capital intelligence** — Capital Graph + Radars + Chat + Sound Asset Lodging.

- **Propose-only** (no auto-executing capital)
- **Citations required** on every number shown in the UI
- **Not** a booking product · **Not** meeting sourcing
- Build in public

Product name everywhere: **Bungah Capital Intel** (never brand as Neo).

## Stack

- Next.js 15 App Router · TypeScript · Tailwind CSS v4
- Prisma + **PostgreSQL** (Neon / Docker / any Postgres) via `DATABASE_URL`
- Auth: stub / skipped for v0.1

## Quick start

1. Copy `.env.example` → `.env` and set a Postgres `DATABASE_URL` (Neon, Docker, or other).
2. Install, push schema, seed, run:

```bash
cd bungah-capital-intel
cp .env.example .env   # then edit DATABASE_URL
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Local Postgres options:** create a free DB at [neon.new](https://neon.new) (claimable, no login), or run Docker:

```bash
docker run --name bungah-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=bungah_capital_intel -p 5432:5432 -d postgres:16
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bungah_capital_intel?schema=public"
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build (no db push) |
| `npm start` | Serve production build |
| `npm run db:push` | Push Prisma schema to Postgres |
| `npm run db:seed` | Seed ~50 US travel markets + radars/signals |
| `npm run radars:run` | Write fresh Findings from radars |
| `npm run db:reset` | Force-reset DB + reseed |
| `postinstall` | `prisma generate` (runs after `npm install`) |

## Pages

| Path | What |
| --- | --- |
| `/` | Landing — value prop, lead with numbers |
| `/markets` | Market list |
| `/markets/[slug]` | Detail + which-Orlando nuance |
| `/chat` | Graph + authored earnings digests RAG (LLM if keyed; else memo) |
| `/radars` | 3 radars + findings (+ Run radars) |
| `/sound-money-lodging` | Sound Asset Lodging — hotel Bitcoin stack + memo studio |

## Seed facts (cited in UI)

**Orlando (YE 2025)** — Visit Orlando Data & Trends / PR Newswire:

- ~76.7M visitors · ~132.7k rooms · OCC ~71.4% · ADR ~$203
- **Impact ≠ scarcity** at MSA averages — ask *which Orlando* (Grande Lakes / Gaylord-class can be scarce)

**Las Vegas (YE 2025)** — LVCVA FAQ:

- ~38.5M visitors (soft) · OCC ~80.3% · midweek ~76.6% · weekend ~88.8%

**National stubs:** lodging debt-wall / CMBS maturity narrative; talent staffing greenlight gate.

## Database (PostgreSQL)

Prisma `provider` is **postgresql**. Set `DATABASE_URL` in `.env` (see `.env.example`).

After changing the URL: `npx prisma db push && npm run db:seed`.

Do **not** commit real credentials — `.env`, `.env.local`, and `.env.production.local` are gitignored.

## Push to GitHub

Repo target: `https://github.com/Halinfl/bungah-capital-intel`

```bash
cd bungah-capital-intel
git init
git add .
git commit -m "Initial Bungah Capital Intel v0.1"
git branch -M main
git remote add origin https://github.com/Halinfl/bungah-capital-intel.git
git push -u origin main
```

Requires GitHub auth on your machine (`gh auth login` or HTTPS credentials). This workspace skips remote push.

See **HANDOFF.md** for Cursor steps.

## Vercel notes

1. Import the GitHub repo in Vercel.
2. Framework preset: Next.js (default build uses `prisma generate && next build` — **no** `db push` during build).
3. Env: set `DATABASE_URL` to a Postgres URL (Neon pooled URL recommended for serverless).
4. Separately (once): `npx prisma db push` and `npm run db:seed` against that URL (local machine or one-off job).
5. Never put real `DATABASE_URL` secrets in git.


## Memory loop (Phase 1) + graph-grounded chat LLM

Vision: **questions → intents → graph coverage** so Bungah chat becomes the hotel-industry insight source.

1. Every `/api/chat` POST writes `ChatQuestionLog` (`question`, `answerText`, `citationsJson`, `intent`, `marketSlug`, `modelUsed`, `trainEligible`, `isPrivate`, `createdAt`, …).
2. **Train gating (Hal):** Clerk `auth()` — signed-out public → `trainEligible=true`, `isPrivate=false`, full Q&A logged for corpus. Signed-in private workspace → `isPrivate=true`, `trainEligible=false`, bodies redacted in the log (`question="[private]"`). Export: `npm run train:export` → JSONL **only** `trainEligible=true` (see `data/train/README.md`).
3. Deterministic intent classifier maps text → `revpar_metrics` | `supply_pipeline` | `demand_visitation` | `which_submarket` | `talent_greenlight` | `debt_overlay` | `compare_markets` | `general_thesis` | `unknown`.
4. Retrieval packs markets / signals / assets / national debt+talent / radars from Prisma + `content/earnings` digests / ideology via `chat-retrieve.ts`.
5. **LLM path** (Vercel AI SDK): if `AI_GATEWAY_API_KEY` or `OPENAI_API_KEY` is set, `generateText` answers the user’s question as a hotel IC analyst citing only the pack (propose-only, never invent STR).
6. **Fallback:** no key or LLM error → intent-branched deterministic memos (`formatMarketMemo`) — same styles work for any matched market (e.g. Nashville supply vs talent leads differ).
7. Deep-link `/chat?market=&q=` still works; `marketSlug` is logged from query or match.

Prod: after schema change, run `npx prisma db push` against the prod `DATABASE_URL` (not during Vercel build). Add `AI_GATEWAY_API_KEY` on Vercel for live LLM. Parent deploys — do not `vercel deploy` from this workspace unless asked.

## Trust contract

- Citations on every seed number in UI (`sourceLabel`)
- Chat is LLM-free retrieval + templates over DB
- Radars write Findings only — humans decide capital actions


## Allowed chat corpus

Retrieval is **graph-grounded + authored digests only** (`src/lib/chat-retrieve.ts`):

- Prisma Capital Graph (markets / signals / assets / national)
- `content/earnings/*/…-digest.md` (Hilton, Host, Pebblebrook) — public IR digests we wrote
- `content/ideology/talent-human-touch.md` (Hal/Neo excerpt) when talent/staffing/greenlight asked

Forbidden: licensed STR/CoStar raw, customer CSP, paywalled transcript train sets. No fine-tuning — `generateText` + RAG only. Set `AI_GATEWAY_API_KEY` (preferred) or `OPENAI_API_KEY`; without keys, chat falls back to intent memos (+ digest headlines when issuer-matched).
