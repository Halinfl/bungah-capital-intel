import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SessionStatus } from "@/components/SessionStatus";
import {
  getWorkspaceProfile,
  requireLoginRedirect,
} from "@/lib/workspace-profile";
import { PlanClient } from "./PlanClient";

export const metadata: Metadata = {
  title: "Choose your plan · Bungah Capital Intel",
};

export default async function PlanPage() {
  const profile = await getWorkspaceProfile();
  if (!profile) redirect(requireLoginRedirect("/account/plan"));

  return (
    <div className="space-y-6">
      <SessionStatus profile={profile} />
      <div className="space-y-2">
        <h1 className="t-h1">
          Choose how you use the Capital Graph
        </h1>
        <p className="max-w-2xl t-lead">
          Same plan family. Upgrade anytime. Plans never unlock booking writes or outreach.
        </p>
      </div>
      <PlanClient currentPlan={profile.plan} />
      <p className="text-xs text-slate-300">
        <Link href="/trust" className="hover:text-slate-300">
          Trust Contract
        </Link>
              </p>
    </div>
  );
}
