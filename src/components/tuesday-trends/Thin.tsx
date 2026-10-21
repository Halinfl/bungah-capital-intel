/** Plain gray "— thin" marker for cells under the coverage threshold. */
export function Thin({ size = "md" }: { size?: "md" | "lg" }) {
  return <span className={`whitespace-nowrap text-slate-300 ${size === "lg" ? "text-[18px]" : "text-[15px]"}`}>— thin</span>;
}
