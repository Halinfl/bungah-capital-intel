"use client";

/** Segmented toggle (radio-like). Neutral styling; the selected option is a lighter chip. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  options: { value: T; label: string; sub?: string; aria?: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: "md" | "sm";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex shrink-0 rounded-lg border border-white/15 bg-white/[0.03] p-0.5">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={o.aria}
            onClick={() => onChange(o.value)}
            className={`whitespace-nowrap rounded-md font-medium transition-colors ${
              size === "sm" ? "px-2 py-1 text-[13px]" : "px-3 py-1.5 text-sm"
            } ${on ? "bg-white/[0.14] text-white" : "text-slate-300 hover:text-white"}`}
          >
            {o.label}
            {o.sub ? <span className={`ml-1 ${on ? "text-slate-200" : "text-slate-300"}`}>({o.sub})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
