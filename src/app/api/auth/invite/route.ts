import { NextResponse } from "next/server";
import {
  getWorkspaceProfile,
  updateWorkspaceProfile,
  SEATS_MAX,
  type Role,
} from "@/lib/workspace-profile";

export async function POST(req: Request) {
  const existing = await getWorkspaceProfile();
  if (!existing) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!existing.orgName) {
    return NextResponse.json({ error: "Create an org first" }, { status: 400 });
  }

  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const seatsUsed = existing.seatsUsed ?? 1;
  const seatsMax = existing.seatsMax ?? SEATS_MAX;
  if (seatsUsed >= seatsMax) {
    return NextResponse.json(
      { error: `This team is full (${seatsMax} members). Ask an admin to make room.` },
      { status: 400 },
    );
  }

  const role: Role = body.role === "Admin" ? "Admin" : "Member";
  const token = Buffer.from(
    JSON.stringify({ org: existing.orgName, email, role, t: Date.now() }),
  ).toString("base64url");

  const nextSeats = seatsUsed + 1;
  await updateWorkspaceProfile({ seatsUsed: nextSeats });

  const invitePath = `/invite/${token}`;
  return NextResponse.json({
    ok: true,
    invitePath,
    remaining: seatsMax - nextSeats,
    note: "Invite link chrome — no email send until provider. Copy link below.",
  });
}
