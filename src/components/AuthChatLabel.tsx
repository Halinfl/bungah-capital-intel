"use client";

import { useAuth } from "@clerk/nextjs";
import { chatLabel } from "@/lib/chat-label";

/**
 * Chat trust label for statically rendered pages (the home page is ISR so it costs no function time per view).
 * The cached HTML carries the signed-out label; it switches to the signed-in label once Clerk loads in the
 * browser. Signed-out visitors therefore never see "Private", not even for a frame.
 */
export function AuthChatLabel() {
  const { isLoaded, isSignedIn } = useAuth();
  return <>{chatLabel(Boolean(isLoaded && isSignedIn))}</>;
}
