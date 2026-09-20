export function fmtPct(n: number | null | undefined, digits = 1): string {
  if (n == null) return "—";
  return `${n.toFixed(digits)}%`;
}

export function fmtUsd(n: number | null | undefined, digits = 0): string {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function fmtVisitorsM(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}M`;
}

export function fmtRoomsK(n: number | null | undefined): string {
  if (n == null) return "—";
  return `${n.toFixed(1)}k`;
}

export function severityClass(severity: string): string {
  switch (severity) {
    case "alert":
      return "text-rose-300 bg-rose-500/10 border-rose-500/30";
    case "watch":
      return "text-amber-300 bg-amber-500/10 border-amber-500/30";
    default:
      return "text-sky-300 bg-sky-500/10 border-sky-500/30";
  }
}
