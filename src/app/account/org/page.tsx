import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionStatus } from "@/components/SessionStatus";
import {
  getWorkspaceProfile,
  requireLoginRedirect,
  SEATS_MAX,
} from "@/lib/workspace-profile";
import { OrgForm } from "./OrgForm";

export const metadata: Metadata = {
  title: "Org Capital Graph · Bungah Capital Intel",
};

export default async function OrgPage() {
  const profile = await getWorkspaceProfile();
  if (!profile) redirect(requireLoginRedirect("/account/org"));

  const hasOrg = Boolean(profile.orgName);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <SessionStatus profile={profile} />
      <div className="space-y-2">
        <h1 className="t-h2">
          {hasOrg ? profile.orgName : "Create an org Capital Graph"}
        </h1>
        <p className="text-sm leading-relaxed text-slate-300">
          Shared picture for your brand, owner, AM, developer, or CVB team.
        </p>
      </div>

      {hasOrg ? (
        <div className="space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-sm text-slate-300">
            Role: <span className="text-white">{profile.orgRole || "Owner"}</span>
          </p>
          <p className="text-sm text-slate-300">
            Team: {profile.seatsUsed ?? 1} of {profile.seatsMax ?? SEATS_MAX} members
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/account/org/invite"
              className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
            >
              Invite people
            </Link>
            <Link
              href="/workspace"
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:border-white/20 hover:text-white"
            >
              Open shared graph
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <OrgForm />
        </div>
      )}

      <p className="text-xs text-slate-300">
        <Link href="/trust" className="hover:text-slate-300">
          Trust Contract
        </Link>
      </p>
    </div>
  );
}
