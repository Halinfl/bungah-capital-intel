/**
 * Bring the current conversation back after a reload (r4), and keep a signed-out conversation through sign-in.
 *
 * The browser keeps one small marker per chat scope in localStorage: the id of the conversation on screen
 * (or null after "New chat" / "Delete conversation", so there is nothing to restore), and whether it was
 * started signed in. No question or answer text is stored in the browser. On load the client turns the
 * marker into one action; the server decides what the caller may read (owner only, same 404 for anyone else).
 */
export const RESTORE_KEY_PREFIX = "bci_chat_current:";
/** Same window as the server's claim rule: a signed-out conversation is claimed on sign-in within 24h, once. */
export const CLAIM_WINDOW_MS = 24 * 60 * 60 * 1000;

export type RestoreMarker = { id: string | null; signedIn: boolean; at: number };
export type RestorePlan =
  | { kind: "none" }
  /** Signed out → signed in, same browser, ≤24h: claim it, then read it as the new owner. */
  | { kind: "claim"; id: string }
  /** Read this conversation with the owner GET (404 → nothing to show). */
  | { kind: "get"; id: string }
  /** No marker in this browser: the caller's most recent owned conversation (signed in), or this browser's
   *  signed-out conversation, from GET /api/chat/threads/current. */
  | { kind: "current" };

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;

export function restoreKey(scopeId: string): string {
  return `${RESTORE_KEY_PREFIX}${scopeId || "general"}`;
}

export function parseMarker(raw: string | null | undefined): RestoreMarker | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<RestoreMarker>;
    if (!v || typeof v !== "object" || typeof v.signedIn !== "boolean" || typeof v.at !== "number" || !Number.isFinite(v.at)) return null;
    if (v.id !== null && !(typeof v.id === "string" && ID_RE.test(v.id))) return null;
    return { id: v.id, signedIn: v.signedIn, at: v.at };
  } catch {
    return null;
  }
}

export function serializeMarker(id: string | null, signedIn: boolean, now = Date.now()): string {
  return JSON.stringify({ id: id && ID_RE.test(id) ? id : null, signedIn, at: now } satisfies RestoreMarker);
}

/**
 * What to do on load. `canRestore` is false when the page asks a question of its own (?q= / ?market= link):
 * that starts a fresh conversation as before.
 */
export function planRestore(marker: RestoreMarker | null, signedIn: boolean, opts: { now?: number; canRestore?: boolean; general?: boolean } = {}): RestorePlan {
  const now = opts.now ?? Date.now();
  if (opts.canRestore === false) return { kind: "none" };
  // Only the general chat falls back to the server's latest conversation (a scoped chat needs its own marker).
  if (!marker) return opts.general === false ? { kind: "none" } : { kind: "current" };
  if (!marker.id) return { kind: "none" }; // "New chat" or "Delete conversation": nothing to bring back
  if (marker.signedIn) return signedIn ? { kind: "get", id: marker.id } : { kind: "none" }; // signed out since: never shown
  if (!signedIn) return { kind: "get", id: marker.id };
  return now - marker.at <= CLAIM_WINDOW_MS ? { kind: "claim", id: marker.id } : { kind: "none" };
}

export type StoredMessage = { role: string; content: string; citations?: string | null };
export type RestoredMessage = { role: "user" | "assistant"; content: string; question?: string; citations?: string[] };

/** The owner GET's messages → chat messages (question text kept on the answer for "Try again"/re-ask). */
export function messagesFromThread(msgs: StoredMessage[] | null | undefined): RestoredMessage[] {
  const out: RestoredMessage[] = [];
  let lastQ: string | undefined;
  for (const m of msgs ?? []) {
    if (!m || typeof m.content !== "string") continue;
    if (m.role === "user") {
      lastQ = m.content;
      out.push({ role: "user", content: m.content, question: m.content });
    } else if (m.role === "assistant") {
      let citations: string[] = [];
      try {
        const c = m.citations ? JSON.parse(m.citations) : [];
        citations = Array.isArray(c) ? c.filter((x): x is string => typeof x === "string") : [];
      } catch {
        citations = [];
      }
      out.push({ role: "assistant", content: m.content, question: lastQ, citations });
    }
  }
  return out;
}

/**
 * r4 (S4) "Try again": the list without the failed answer at `i` and the question right before it (when it is
 * the same question), so the resend shows the question once.
 */
export function withoutFailedTurn<T extends { role: string; question?: string; failed?: boolean }>(msgs: T[], i: number): T[] {
  const failed = msgs[i];
  if (!failed?.failed) return msgs;
  const asked = msgs[i - 1];
  const dropQ = asked?.role === "user" && asked.question === failed.question;
  return msgs.filter((_, j) => j !== i && !(dropQ && j === i - 1));
}
