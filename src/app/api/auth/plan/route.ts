import { NextResponse } from "next/server";
import {
  getWorkspaceProfile,
  updateWorkspaceProfile,
  type Plan,
} from "@/lib/workspace-profile";

/** Plan chrome — never charges. Stripe Phase 1b. Auth via Clerk. */
export async function POST(req: Request) {
  const existing = await getWorkspaceProfile();
  if (!existing) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: { plan?: string; waitlist?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const plan = body.plan as Plan | undefined;
  if (plan !== "free" && plan !== "pro" && plan !== "company") {
    return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
  }

  if ((plan === "pro" || plan === "company") && body.waitlist) {
    return NextResponse.json({
      ok: true,
      waitlist: true,
      message: "Billing comes in Phase 1b — you’re on the waitlist. No charge.",
    });
  }

  await updateWorkspaceProfile({ plan });

  return NextResponse.json({
    ok: true,
    plan,
    message:
      plan === "free"
        ? "Staying on Free."
        : "Chrome preview only — billing Phase 1b. No charge.",
  });
}
