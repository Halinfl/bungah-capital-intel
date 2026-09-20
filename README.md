# Bungah Capital Intel

Silvia-style **hospitality capital intelligence** — Capital Graph + Radars + Chat + Artifacts.

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
| `/chat` | Deterministic cited chat over the graph |
| `/radars` | 3 radars + findings (+ Run radars) |
| `/artifacts` | Generate IC one-pager markdown |

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

## Trust contract

- Citations on every seed number in UI (`sourceLabel`)
- Chat is LLM-free retrieval + templates over DB
- Radars write Findings only — humans decide capital actions
