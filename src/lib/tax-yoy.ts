/**
 * Number-truth r9 (Eric r8): a tax-series YoY that Bungah computed (the release prints levels, not the change) is shown
 * only when the prior-year row of the same series is on file and the two levels reproduce it; it then reads
 * "Bungah calc." so it is never attributed to the cited page. Rate-neutral "base" changes have no level on display,
 * so they are dropped. Display layer only; DB rows unchanged.
 */
type Row = { id: string; title: string; body: string; magnitude?: string | null };

const MULT: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

export function levelOf(mag: string): number | null {
  const m = mag.match(/\$\s?(\d[\d,]*(?:\.\d+)?)\s?([KMB])?\b/);
  if (!m) return null;
  return Number(m[1].replace(/,/g, "")) * (m[2] ? MULT[m[2]] : 1);
}

export function priorPeriod(p: string): string {
  return p
    .replace(/(?<!\d)(20\d{2})-(\d{2})(?!\d)/g, (_, a, b) => `${Number(a) - 1}-${String(Number(b) - 1).padStart(2, "0")}`)
    .replace(/(?<!\d)((?:19|20)\d{2})(?!\d)(?!-\d{2}(?!\d))/g, (y) => String(Number(y) - 1));
}

const PAIR = /(\$\s?\d[\d,]*(?:\.\d+)?\s?[KMB]?)\s*\(([+\-−]\d+(?:\.\d+)?)%(\s+YoY)?/g;

function levelsOf(mag: string): number[] {
  return [...mag.matchAll(/\$\s?\d[\d,]*(?:\.\d+)?\s?[KMB]?\b/g)].map((m) => levelOf(m[0]) ?? NaN);
}

export function withVerifiedYoY<T extends Row>(rows: T[]): T[] {
  const byKey = new Map<string, T>();
  for (const r of rows) byKey.set(r.title, r);
  return rows.map((r) => {
    const mag0 = r.magnitude ?? "";
    // Idempotent: cached graph rows can pass through here on every request.
    if (!mag0 || /Bungah calc\./.test(mag0)) return r;
    let mag = mag0
      .replace(/[;,]\s*base\s+[+\-−]?\d+(?:\.\d+)?%/gi, "")
      .replace(/rate-driven\s+\d+(?:\.\d+)?%\s*→\s*\d+(?:\.\d+)?%/g, "rate-driven (2026 TAT rate step)")
      .replace(/,?\s*includes\s+\d+(?:\.\d+)?%\s*→\s*\d+(?:\.\d+)?%\s*rate step/g, ", includes the 2026 TAT rate step");
    const computed = /\bYoY(?: \(computed\))?:\s*[+\-−]\d/.test(r.body) && !/YoY \(published\)/i.test(r.body);
    if (computed && / — /.test(r.title)) {
      const [key, ...rest] = r.title.split(" — ");
      const pp = priorPeriod(rest.join(" — "));
      const prior = byKey.get(`${key} — ${pp}`);
      const before = prior ? levelsOf(prior.magnitude ?? "") : [];
      let n = -1;
      mag = mag.replace(PAIR, (whole, lvl: string, pct: string, yoy?: string) => {
        n += 1;
        const a = levelOf(lvl);
        const b = before[n];
        const shown = Number(pct.replace("−", "-"));
        const ok = a != null && b != null && Number.isFinite(b) && b > 0 && Math.abs(100 * (a / b - 1) - shown) <= 0.15;
        if (ok) return `${lvl} (${pct}%${yoy ? " YoY" : " YoY"}, Bungah calc. vs ${pp.replace(/\s*\(.*$/, "")}`;
        return `${lvl} (`;
      });
    }
    mag = mag.replace(/\(\s*[;,]\s*/g, "(").replace(/\s*\(\s*\)/g, "").replace(/\(\s*·/g, "·").replace(/\s{2,}/g, " ").trim();
    return mag === mag0 ? r : { ...r, magnitude: mag };
  });
}
