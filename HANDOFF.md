# HANDOFF — Bungah Capital Intel → Hal / Cursor / GitHub

Exact steps to open this app in Cursor and push to GitHub.

## 1. Open in Cursor

1. Open Cursor.
2. **File → Open Folder** → select:

   ```
   /workspace/bungah-capital-intel
   ```

   If you copied the folder elsewhere, open that path instead.

3. In Cursor’s terminal:

   ```bash
   npm install
   npx prisma db push
   npm run db:seed
   npm run build
   npm run dev
   ```

4. Confirm [http://localhost:3000](http://localhost:3000) shows **Bungah Capital Intel** (not Neo).

## 2. Verify success criteria

```bash
npm install && npx prisma db push && npm run db:seed && npm run build
```

Must exit 0. Spot-check:

- `/markets` — Orlando + Las Vegas with source chips
- `/markets/orlando` — which-Orlando nuance callout
- `/chat` — “Which Orlando is scarce?” returns cited answer
- `/radars` — 3 radars; **Run radars** writes findings
- `/artifacts` — generate IC one-pager for a market

## 3. Create / push GitHub repo

Target: **https://github.com/Halinfl/bungah-capital-intel**

On a machine where you are logged into GitHub:

```bash
cd /workspace/bungah-capital-intel   # or your local copy

# If git not initialized yet:
git init
git add .
git status   # confirm .env is NOT staged (should be gitignored)
git commit -m "Initial Bungah Capital Intel v0.1 — Capital Graph, Radars, Chat, Artifacts"

git branch -M main
git remote add origin https://github.com/Halinfl/bungah-capital-intel.git

# Create empty repo on GitHub first (gh or web UI), then:
git push -u origin main
```

Using GitHub CLI (if authenticated):

```bash
gh repo create Halinfl/bungah-capital-intel --private --source=. --remote=origin --push
```

**Note:** This build environment intentionally skips `git push` / `gh` auth. Push from your authenticated machine.

## 4. Deploy (optional)

1. Vercel → Import `Halinfl/bungah-capital-intel`
2. Set `DATABASE_URL` to Postgres
3. Switch Prisma `provider` to `postgresql` (see README)
4. Deploy · run seed once against prod DB

## 5. Branding check

Search the repo for `Neo` as a product name — UI, README title, and metadata must say **Bungah Capital Intel** only.

## Paths

| Item | Path |
| --- | --- |
| App root | `/workspace/bungah-capital-intel` |
| SQLite DB | `/workspace/bungah-capital-intel/prisma/dev.db` |
| Schema | `/workspace/bungah-capital-intel/prisma/schema.prisma` |
| Seed | `/workspace/bungah-capital-intel/prisma/seed.ts` |
| Radar CLI | `/workspace/bungah-capital-intel/scripts/run-radars.ts` |
| This handoff | `/workspace/bungah-capital-intel/HANDOFF.md` |
