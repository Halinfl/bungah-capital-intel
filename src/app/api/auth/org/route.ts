import { NextResponse } from "next/server";
import {
  getWorkspaceProfile,
  updateWorkspaceProfile,
  SEATS_MAX,
  type Role,
} from "@/lib/workspace-profile";

const ROLES: Role[] = ["Owner", "Brand", "AM", "Developer", "CVB"];

export async function POST(req: Request) {
  const existing = await getWorkspaceProfile();
  if (!existing) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  let body: { orgName?: string; orgRole?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orgName = (body.orgName || "").trim();
  if (!orgName) {
    return NextResponse.json({ error: "Org name required" }, { status: 400 });
  }
  const orgRole = (ROLES.includes(body.orgRole as Role) ? body.orgRole : "Owner") as Role;

  await updateWorkspaceProfile({
    plan: "company",
    orgName,
    orgRole,
    seatsUsed: 1,
    seatsMax: SEATS_MAX,
  });

  return NextResponse.json({ ok: true, next: "/workspace" });
}
