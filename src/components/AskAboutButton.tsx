import Link from "next/link";
import { askAboutHref, type ChatScope } from "@/lib/chat-scope";

/**
 * "Ask about this": opens Chat scoped to this page's item (shown there as a removable chip).
 * Outline style, at least 44px tall, a plain link (works without JS, keyboard focusable).
 */
export function AskAboutButton({ scope, label, className = "" }: { scope: ChatScope; label: string; className?: string }) {
  return (
    <Link
      href={askAboutHref(scope)}
      aria-label={`Ask about ${label} in Chat`}
      className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white hover:border-white/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 ${className}`}
    >
      Ask about this
    </Link>
  );
}
