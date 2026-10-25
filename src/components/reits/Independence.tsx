import { INDEPENDENCE_LINE } from "@/lib/reits-shared";

export function Independence({ className = "" }: { className?: string }) {
  return <p className={`text-[13px] text-slate-300 ${className}`}>{INDEPENDENCE_LINE}</p>;
}
