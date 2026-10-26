import type { Metadata } from "next";
import { NOINDEX } from "@/lib/seo";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Start a private workspace · Bungah Capital Intel",
  description: "Create a free private Capital Graph workspace for hotel investors.",
  robots: NOINDEX,
};

export default async function SignupPage() {
  const { userId } = await auth();
  if (userId) redirect("/workspace");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="t-h1">
          Start a private workspace
        </h1>
        <p className=" t-lead">
          Free to start. Cited market data, Chat and Radars for hotel owners, investors, asset
          managers and developers.
        </p>
      </div>
      <div className="flex justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <SignUp
          routing="path"
          path="/signup"
          signInUrl="/login"
          forceRedirectUrl="/workspace"
          appearance={clerkAppearance}
        />
      </div>
      <p className="text-center text-sm text-slate-300">
        <Link href="/trust" className="underline decoration-white/30 underline-offset-4 hover:text-white">
          Trust Contract
        </Link>
      </p>
    </div>
  );
}
