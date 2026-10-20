import { ChatClient } from "./ChatClient";

export const dynamic = "force-dynamic";

export default function ChatPage() {
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
      <ChatClient />
    </div>
  );
}
