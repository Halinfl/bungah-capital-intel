import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

/**
 * Workspace chrome profile (plan / org / seats) stored in Clerk publicMetadata.
 * Auth identity is Clerk — cookie stub retired.
 */

export type Plan = "free" | "pro" | "company";
export type Role = "Owner" | "Brand" | "AM" | "Developer" | "CVB" | "Member" | "Admin";

export type WorkspaceProfile = {
  userId: string;
  email: string;
  name: string;
  plan: Plan;
  orgName?: string;
  orgRole?: Role;
  seatsUsed?: number;
  seatsMax?: number;
};

export const SEATS_MAX = 20;

type ProfileMeta = {
  plan?: Plan;
  orgName?: string;
  orgRole?: Role;
  seatsUsed?: number;
  seatsMax?: number;
};

function displayName(user: {
  fullName: string | null;
  firstName: string | null;
  username: string | null;
  primaryEmailAddress?: { emailAddress: string } | null;
  emailAddresses: { emailAddress: string }[];
}): string {
  if (user.fullName?.trim()) return user.fullName.trim();
  if (user.firstName?.trim()) return user.firstName.trim();
  if (user.username?.trim()) return user.username.trim();
  const email =
    user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "";
  const local = email.split("@")[0] || "Investor";
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function requireLoginRedirect(nextPath: string): string {
  return `/login?redirect_url=${encodeURIComponent(nextPath)}`;
}

/** @deprecated Use requireLoginRedirect — kept for call-site migration */
export function requireSessionRedirect(nextPath: string): string {
  return requireLoginRedirect(nextPath);
}

export async function getWorkspaceProfile(): Promise<WorkspaceProfile | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const meta = (user.publicMetadata || {}) as ProfileMeta;
  const plan: Plan =
    meta.plan === "pro" || meta.plan === "company" || meta.plan === "free" ? meta.plan : "free";

  return {
    userId,
    email:
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress ||
      "",
    name: displayName(user),
    plan,
    orgName: meta.orgName,
    orgRole: meta.orgRole,
    seatsUsed: meta.seatsUsed,
    seatsMax: meta.seatsMax,
  };
}

export async function updateWorkspaceProfile(
  patch: Partial<Omit<WorkspaceProfile, "userId" | "email" | "name">>,
): Promise<WorkspaceProfile | null> {
  const existing = await getWorkspaceProfile();
  if (!existing) return null;

  const nextMeta: ProfileMeta = {
    plan: patch.plan ?? existing.plan,
    orgName: patch.orgName !== undefined ? patch.orgName : existing.orgName,
    orgRole: patch.orgRole !== undefined ? patch.orgRole : existing.orgRole,
    seatsUsed: patch.seatsUsed !== undefined ? patch.seatsUsed : existing.seatsUsed,
    seatsMax: patch.seatsMax !== undefined ? patch.seatsMax : existing.seatsMax,
  };

  // Clear org fields when leaving company
  if (nextMeta.plan && nextMeta.plan !== "company") {
    if (patch.plan && patch.plan !== "company") {
      nextMeta.orgName = undefined;
      nextMeta.orgRole = undefined;
      nextMeta.seatsUsed = undefined;
      nextMeta.seatsMax = undefined;
    }
  }

  const client = await clerkClient();
  // Replace (not deep-merge) so leaving company clears org fields.
  await client.users.replaceUserMetadata(existing.userId, {
    publicMetadata: nextMeta,
  });

  return {
    ...existing,
    plan: nextMeta.plan || "free",
    orgName: nextMeta.orgName,
    orgRole: nextMeta.orgRole,
    seatsUsed: nextMeta.seatsUsed,
    seatsMax: nextMeta.seatsMax,
  };
}
