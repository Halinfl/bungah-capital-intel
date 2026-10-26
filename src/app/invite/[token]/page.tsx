import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Join Capital Graph · Bungah Capital Intel",
  robots: NOINDEX,
};

type Props = { params: Promise<{ token: string }> };

function parseToken(token: string): { org?: string; email?: string } {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    return JSON.parse(json) as { org?: string; email?: string };
  } catch {
    return {};
  }
}

export default async function AcceptInvitePage({ params }: Props) {
  const { token } = await params;
  const parsed = parseToken(token);
  const org = parsed.org || "an org";

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="t-h2">
          Join {org}’s Capital Graph on Bungah
        </h1>
        <p className="text-sm leading-relaxed text-slate-300">
          Shared hotel-investing workspace — decision support, cited, private.
        </p>
        <p className="text-sm text-slate-300">
          <Link href="/trust" className="text-slate-300 underline-offset-2 hover:underline">
            Trust Contract
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <Link
          href={`/signup?redirect_url=${encodeURIComponent("/workspace")}`}
          className="rounded-lg bg-slate-100 px-4 py-2.5 text-center text-sm font-medium text-slate-900 hover:bg-white"
        >
          Create account and join
        </Link>
        <Link
          href={`/login?redirect_url=${encodeURIComponent("/workspace")}`}
          className="rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm text-slate-300 hover:border-white/20 hover:text-white"
        >
          Sign in and join
        </Link>
        <p className="text-xs text-slate-300">
          If the team is full, ask an admin to make room.
        </p>
      </div>
    </div>
  );
}
