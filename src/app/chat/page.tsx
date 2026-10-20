import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          IC whiteboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Chat</h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-400">
          Put a capital question to the Capital Graph: hotel markets, debt, supply and labor. You get
          the number and the so-what first, then the sources.
        </p>
      </div>
      <ChatClient />
    </div>
  );
}
