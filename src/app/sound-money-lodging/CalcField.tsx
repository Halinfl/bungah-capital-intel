"use client";

/** Blank numeric input used by the Sound Asset Lodging calculators. */
export function CalcField({
  id,
  label,
  hint,
  value,
  onChange,
  suffix,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
}) {
  return (
    <label htmlFor={id} className="block space-y-1">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <input
          id={id}
          name={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/25"
        />
        {suffix ? <span className="shrink-0 text-xs text-slate-300">{suffix}</span> : null}
      </div>
      <span className="block text-xs leading-snug text-slate-300">{hint}</span>
    </label>
  );
}

/** Parse a user-typed number; commas and $ allowed. Blank or invalid → null. */
export function num(v: string): number | null {
  const t = v.replace(/[$,\s]/g, "");
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export const pct = (x: number, d = 1) => `${(x * 100).toFixed(d)}%`;
export const xx = (x: number) => `${x.toFixed(2)}x`;
export const usd = (x: number) =>
  x.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
