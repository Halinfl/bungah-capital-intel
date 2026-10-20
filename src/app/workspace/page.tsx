import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SessionStatus } from "@/components/SessionStatus";
import {
  getWorkspaceProfile,
  requireLoginRedirect,
} from "@/lib/workspace-profile";

export const metadata: Metadata = {
  title: "Private workspace · Bungah Capital Intel",
  description: "Your private Capital Graph — decision support, cited.",
};

const CAPITAL_PROMPTS = [
  {
    key: "deploy",
    title: "Deploy?",
    href: "/chat",
    hint: "Should we put capital into Orlando this cycle — and which Orlando?",
  },
  {
    key: "hold",
    title: "Hold?",
    href: "/chat",
    hint: "What would have to change before CapEx or refinance stress?",
  },
  {
    key: "flag",
    title: "Flag?",
    href: "/chat",
    hint: "Flag the demand, supply, debt, or labor risk most likely to break.",
  },
] as const;

export default async function WorkspacePage() {
  const { userId } = await auth();
  if (!userId) redirect(requireLoginRedirect("/workspace"));

  const profile = await getWorkspaceProfile();
  if (!profile) redirect(requireLoginRedirect("/workspace"));

  return (
    <div className="space-y-8">
      <SessionStatus profile={profile} showUpsell />

      <section className="space-y-3">
        <p className="text-sm font-medium text-slate-300">
          Capital Graph
        </p>
        <h1 className="t-h1">
          {profile.orgName
            ? `${profile.orgName} · shared org graph`
            : `Welcome, ${profile.name.split(" ")[0] || "investor"}`}
        </h1>
        <p className="max-w-2xl t-lead">
          Your Capital Graph · decision support · citations ·{" "}
          <Link href="/trust" className="text-slate-300 underline-offset-2 hover:underline">
            Trust
          </Link>
        </p>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-300">
          Markets, assets, debt, and talent/operator quality — humans make hospitality feel right.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/markets", label: "Markets", desc: "Browse markets" },
          { href: "/chat", label: "Chat", desc: "IC whiteboard ideate" },
          { href: "/radars", label: "Radars", desc: "Quiet monitors" },
          { href: "/sound-money-lodging", label: "Sound Asset", desc: "Hotel Bitcoin stack memos" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.03]"
          >
            <div className="text-sm font-medium text-white">{l.label}</div>
            <p className="mt-1 text-xs text-slate-300">{l.desc}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border border-white/[0.08] bg-[#262a32] p-5 sm:p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-medium tracking-tight text-white">
            Ideate on capital here — we don’t execute.
          </h2>
          <p className="text-sm text-slate-300">
            Deploy / Hold / Flag · private to your workspace.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {CAPITAL_PROMPTS.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div className="text-sm font-medium text-white">{c.title}</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">{c.hint}</p>
            </Link>
          ))}
        </div>
        <Link
          href="/chat"
          className="inline-flex rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Open Chat · Capital question…
        </Link>
      </section>

      <p className="text-xs leading-relaxed text-slate-300">
                <Link href="/trust" className="hover:text-slate-300">
          Trust Contract
        </Link>
      </p>
    </div>
  );
}
