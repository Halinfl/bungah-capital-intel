import Link from "next/link";
import type { WorkspaceProfile } from "@/lib/workspace-profile";
import { SoftProGate } from "./SoftProGate";

type Props = {
  profile: WorkspaceProfile;
  /** Soft dismissible upsell for Free plan */
  showUpsell?: boolean;
};

export function SessionStatus({ profile, showUpsell = false }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500">
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-slate-400">
            Private workspace
          </span>
          <span className="text-slate-700">·</span>
          <span>Clerk session</span>
          <span className="text-slate-700">·</span>
          <span>Decision support</span>
          <span className="text-slate-700">·</span>
          <Link
            href="/trust"
            className="text-slate-400 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            Trust
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="truncate max-w-[12rem]" title={profile.email}>
            {profile.name || profile.email}
          </span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 uppercase tracking-wider text-[10px] text-slate-500">
            {profile.plan}
          </span>
          <Link href="/account/plan" className="hover:text-slate-200">
            Plan
          </Link>
          <Link href="/account/org" className="hover:text-slate-200">
            Org & seats
          </Link>
        </div>
      </div>

      {showUpsell && profile.plan === "free" ? <SoftProGate /> : null}
    </div>
  );
}
