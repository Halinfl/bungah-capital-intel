import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionStatus } from "@/components/SessionStatus";
import {
  getWorkspaceProfile,
  requireLoginRedirect,
  SEATS_MAX,
} from "@/lib/workspace-profile";
import { InviteForm } from "./InviteForm";

export const metadata: Metadata = {
  title: "Invite to org graph · Bungah Capital Intel",
  robots: NOINDEX,
};

export default async function InvitePage() {
  const profile = await getWorkspaceProfile();
  if (!profile) redirect(requireLoginRedirect("/account/org/invite"));
  if (!profile.orgName) redirect("/account/org");

  const seatsMax = profile.seatsMax ?? SEATS_MAX;
  const seatsUsed = profile.seatsUsed ?? 1;
  const remaining = Math.max(0, seatsMax - seatsUsed);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <SessionStatus profile={profile} />
      <div className="space-y-2">
        <h1 className="t-h2">
          Invite people to the org graph
        </h1>
        <p className="text-sm text-slate-300">{profile.orgName}</p>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <InviteForm remaining={remaining} seatsMax={seatsMax} />
      </div>
      <p className="text-xs text-slate-300">
        <Link href="/account/org" className="hover:text-slate-300">
          Back to org
        </Link>
      </p>
    </div>
  );
}
