import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">Chat</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Deterministic answers from the Capital Graph — no paid LLM keys. Every reply cites seed
          sources. Propose-only.
        </p>
      </div>
      <ChatClient />
    </div>
  );
}
