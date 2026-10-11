import type { Metadata } from "next";
import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { clerkAppearance } from "@/lib/clerk-appearance";

export const metadata: Metadata = {
  title: "Sign in · Bungah Capital Intel",
  description: "Sign in to your private Capital Graph workspace.",
};

export default async function LoginPage() {
  const { userId } = await auth();
  if (userId) redirect("/workspace");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Sign in to your Capital Graph
        </h1>
        <p className="text-sm leading-relaxed text-slate-400">
          Private workspace for hotel investors — cite-backed ideation, decision support.
        </p>
      </div>
      <div className="flex justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/signup"
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
