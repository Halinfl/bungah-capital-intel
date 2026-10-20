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
        <h1 className="t-h1">
          Sign in to your Capital Graph
        </h1>
        <p className=" t-lead">
          Your private workspace for cited hotel capital research.
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
      <p className="text-center text-sm text-slate-300">
        <Link href="/trust" className="underline decoration-white/30 underline-offset-4 hover:text-white">
          Trust Contract
        </Link>
      </p>
    </div>
  );
}
