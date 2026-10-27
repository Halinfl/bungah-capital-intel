import type { Metadata } from "next";
import { ChatClient, type ChatScopeProp } from "./ChatClient";
import { parseScope } from "@/lib/chat-scope";
import { marketLabel, startersFor } from "@/lib/chat-starters";
import { dealName, reitName } from "@/lib/chat-items";
import { saleBySlug } from "@/lib/deals";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat · Bungah Capital Intel",
  description:
    "Put a capital question to the Capital Graph: hotel markets, debt, supply and labor. The answer leads with the number and the so-what, then the sources.",
  alternates: { canonical: "/chat" },
};

function titleCase(slug: string): string {
  return slug.replaceAll("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Chip label for the item: market name from its slug, REIT name and ticker, the sale's short name. */
function scopeProp(about: string | undefined): ChatScopeProp {
  const s = parseScope(about);
  if (!s) return null;
  if (s.kind === "market") return { ...s, label: marketLabel(s.id) ?? titleCase(s.id) };
  if (s.kind === "reit") {
    const name = reitName(s.id);
    return name ? { ...s, label: `${name} (${s.id})` } : null;
  }
  const sale = saleBySlug(s.id);
  if (!sale) return null;
  const base = sale.market_slug && sale.slug.endsWith(`-${sale.market_slug}`) ? sale.slug.slice(0, -(sale.market_slug.length + 1)) : sale.slug;
  return { ...s, label: dealName(s.id) ? titleCase(base) : s.id };
}

export default async function ChatPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const about = typeof sp.about === "string" ? sp.about : undefined;
  const scope = scopeProp(about);
  // Only build-time-verified starters (scripts/chat/verify-starters.ts); a legacy ?market= link shows none.
  const starters = scope ? startersFor(scope) : typeof sp.market === "string" ? [] : startersFor(null);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-slate-300">
          IC whiteboard
        </p>
        <h1 className="mt-2 t-h1">Chat</h1>
        <p className="mt-2 max-w-2xl t-lead">
          Put a capital question to the Capital Graph: hotel markets, debt, supply and labor. You get
          the number and the so-what first, then the sources.
        </p>
      </div>
      <ChatClient key={scope ? `${scope.kind}:${scope.id}` : "general"} scope={scope} starters={starters} />
    </div>
  );
}
