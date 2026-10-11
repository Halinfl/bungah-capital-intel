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
    <div className="mx-auto max-w-5xl space-y-6">
      <SessionStatus profile={profile} />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Choose how you use the Capital Graph
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
          Same plan family. Upgrade anytime. Plans never unlock booking writes or outreach.
        </p>
      </div>
      <PlanClient currentPlan={profile.plan} />
      <p className="text-xs text-slate-600">
        <Link href="/trust" className="hover:text-slate-400">
          Trust Contract
        </Link>
        {" · "}decision support · citations · never write bookings
      </p>
    </div>
  );
}
