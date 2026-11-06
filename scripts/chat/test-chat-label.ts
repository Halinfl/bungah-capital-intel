/**
 * Chat trust label: "Private" only for signed-in users (signed-out questions are logged and may be train-exported).
 * Checks the label function, that no page hardcodes the label, and that each render site is auth-aware
 * on the server (no flash of "Private" for signed-out visitors). Run: npm run test:chat-label
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { chatLabel, CHAT_LABEL_SIGNED_IN, CHAT_LABEL_SIGNED_OUT } from "../../src/lib/chat-label";

let failed = 0;
const check = (name: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
};

check("signed-out label", chatLabel(false) === "Cited · Decision support", chatLabel(false));
check("signed-in label", chatLabel(true) === "Private · Cited · Decision support", chatLabel(true));
check("signed-out label has no 'Private'", !/private/i.test(CHAT_LABEL_SIGNED_OUT));
check("constants match", CHAT_LABEL_SIGNED_IN === chatLabel(true) && CHAT_LABEL_SIGNED_OUT === chatLabel(false));

// No hardcoded label anywhere in src (it must come from chatLabel()).
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|mdx?)$/.test(f) ? [p] : [];
  });
const hard = walk("src").filter((f) => !f.endsWith("chat-label.ts") && /Private\s*·\s*Cited/.test(readFileSync(f, "utf8")));
check("no hardcoded 'Private · Cited' outside src/lib/chat-label.ts", hard.length === 0, hard.join(", "));

// Render sites: server pages read auth() and pass signedIn; the client component defaults to signed-out.
const home = readFileSync("src/app/page.tsx", "utf8");
check("home: server auth() + chatLabel(signedIn)", /await auth\(\)/.test(home) && /chatLabel\(signedIn\)/.test(home));
const chatPage = readFileSync("src/app/chat/page.tsx", "utf8");
check("/chat page: server auth() passed as signedIn", /await auth\(\)/.test(chatPage) && /signedIn=\{Boolean\(userId\)\}/.test(chatPage));
const client = readFileSync("src/app/chat/ChatClient.tsx", "utf8");
check("ChatClient: signedIn defaults to false and renders chatLabel(signedIn)", /signedIn = false/.test(client) && /\{chatLabel\(signedIn\)\}/.test(client));

console.log(failed ? `chat-label: ${failed} failed` : "chat-label: all passed");
process.exit(failed ? 1 : 0);
