import Link from "next/link";
import type { WorkspaceProfile } from "@/lib/workspace-profile";

type Props = {
  profile: WorkspaceProfile;
};

export function SessionStatus({ profile }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300">
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-slate-300">
            Private workspace
          </span>
          <span className="text-slate-300">·</span>
          <span>Signed in</span>
          <span className="text-slate-300">·</span>
          <span>Decision support</span>
          <span className="text-slate-300">·</span>
          <Link
            href="/trust"
            className="text-slate-300 underline-offset-2 hover:text-slate-200 hover:underline"
          >
            Trust
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="truncate max-w-[12rem]" title={profile.email}>
            {profile.name || profile.email}
          </span>
          <Link href="/account/org" className="hover:text-slate-200">
            Org
          </Link>
        </div>
      </div>
    </div>
  );
}
