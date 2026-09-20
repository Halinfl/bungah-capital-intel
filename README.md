# Bungah Capital Intel

Silvia-style **hospitality capital intelligence** — Capital Graph + Radars + Chat + Artifacts.

- **Propose-only** (no auto-executing capital)
- **Citations required** on every number shown in the UI
- **Not** a booking product · **Not** meeting sourcing
- Build in public

Product name everywhere: **Bungah Capital Intel** (never brand as Neo).

## Stack

- Next.js 15 App Router · TypeScript · Tailwind CSS v4
- Prisma + **SQLite** (`prisma/dev.db`) for local demo
- Auth: stub / skipped for v0.1

## Quick start

```bash
cd bungah-capital-intel
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + production build |
| `npm start` | Serve production build |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:seed` | Seed Orlando + Vegas + radars/signals |
| `npm run radars:run` | Write fresh Findings from radars |
| `npm run db:reset` | Force-reset DB + reseed |

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

## Switching to Postgres

1. Change `prisma/schema.prisma` datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Set `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/bungah_capital_intel?schema=public"
```

3. Run `npx prisma db push && npm run db:seed`.

SQLite remains the default for zero-config local demo.

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
2. Framework preset: Next.js.
3. Env: set `DATABASE_URL` to a Postgres URL (Vercel Postgres / Neon / Supabase).
4. Build command: `prisma generate && prisma db push && next build` (or run migrations in a release step).
5. After first deploy, run seed once (Vercel CLI / one-off job): `npx tsx prisma/seed.ts` with `DATABASE_URL` set.
6. SQLite file DB is **not** durable on serverless — use Postgres in production.

## Trust contract

- Citations on every seed number in UI (`sourceLabel`)
- Chat is LLM-free retrieval + templates over DB
- Radars write Findings only — humans decide capital actions
