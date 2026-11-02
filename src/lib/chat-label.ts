/**
 * The chat trust label. Signed-out questions are logged and may feed the training set
 * (src/app/api/chat/route.ts: trainEligible = !userId), so "Private" is only shown to
 * signed-in (Clerk) users, whose questions are stored as "[private]" and never train-exported.
 * Callers decide `signedIn` on the server (auth() from @clerk/nextjs/server), so the first
 * HTML already carries the right label: no flash of "Private" for signed-out visitors.
 */
export const CHAT_LABEL_SIGNED_OUT = "Cited · Decision support";
export const CHAT_LABEL_SIGNED_IN = "Private · Cited · Decision support";

export function chatLabel(signedIn: boolean): string {
  return signedIn ? CHAT_LABEL_SIGNED_IN : CHAT_LABEL_SIGNED_OUT;
}
