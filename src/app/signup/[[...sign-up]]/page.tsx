import type { Metadata } from "next";
import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Start a private workspace · Bungah Capital Intel",
  description: "Create a free private Capital Graph workspace for hotel investors.",
};

export default async function SignupPage() {
  const { userId } = await auth();
  if (userId) redirect("/workspace");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Start a private workspace
        </h1>
        <p className="text-sm leading-relaxed text-slate-400">
          One picture of hospitality capital — markets, debt, talent gates. Learn and grow the
          portfolio under decision support + citations.
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
      <p className="text-center text-xs text-slate-600">
        <Link href="/trust" className="hover:text-slate-400">
          Trust Contract
        </Link>
        {" · "}we never write bookings
      </p>
    </div>
  );
}
