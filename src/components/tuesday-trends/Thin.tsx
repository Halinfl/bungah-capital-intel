/** Plain gray "— thin" marker for cells under the coverage threshold. */
export function Thin({ className = "" }: { className?: string }) {
  return <span className={`whitespace-nowrap text-[15px] text-slate-300 ${className}`}>— thin</span>;
}
