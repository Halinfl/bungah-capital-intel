import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy (draft) · Bungah Capital Intel",
  description:
    "Draft privacy wording for Chat: how questions are processed, what we log, and when training is allowed. Under legal review.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-amber-200/90">Draft — under legal review. Not a live production policy.</p>
        <h1 className="t-h1">Privacy</h1>
        <p className="max-w-2xl t-lead">
          Bungah Capital Intel (bungah.io) is operated by Bungah Capital. This page explains how Chat handles your
          questions. It supplements our{" "}
          <Link href="/trust" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">
            Trust Contract
          </Link>
          .
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="t-h2">What you type into Chat</h2>
        <p className="max-w-2xl text-slate-200">
          When AI answers are turned on, questions you submit in public (signed-out) Chat are sent to Groq, a US-based
          inference provider, so a model can draft an answer from the public and derived facts we already hold. Groq
          processes that request in the United States.
        </p>
        <p className="max-w-2xl text-slate-200">
          We configure Groq for Zero Data Retention (ZDR). With ZDR on, Groq does not retain your prompts or the
          model&apos;s outputs for reliability or abuse monitoring. Groq may still keep usage metadata that does not
          include the text of your question or the answer (for example, token counts). Enabling and confirming the live
          ZDR toggle is a pre-launch step; this wording should not be treated as a production promise until that
          confirmation is on file and counsel has signed off.
        </p>
        <p className="max-w-2xl text-slate-200">Do not enter confidential, personal, or login information into Chat.</p>
        <p className="max-w-2xl text-slate-200">
          Signed-in (private) Chat is not sent to Groq. Those questions stay on our systems and are answered from the
          same cited, deterministic path used when AI is off.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">What we log on our side</h2>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-slate-200">
          <li>
            <strong className="text-slate-100">Signed-out Chat.</strong> We keep a question log (the question, the
            answer, citations, and ordinary technical metadata such as time and whether the answer came from the model
            or from our cited templates). We use this to improve coverage and to operate the product.
          </li>
          <li>
            <strong className="text-slate-100">Signed-in private threads.</strong> When you are signed in, your
            conversation is stored as a private thread. Private question-log rows do not keep the question or answer
            text for training. You can delete a conversation from Chat. Deleting your account removes your private
            threads and related private records.
          </li>
          <li>
            <strong className="text-slate-100">Training.</strong> We do not use signed-in private Chat to train models
            unless you opt in. There is no training on Groq; Groq is not permitted to use our prompts or outputs to
            train its models.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">What we do not do</h2>
        <p className="max-w-2xl text-slate-200">
          We do not sell your Chat questions. We do not send signed-in private threads to Groq. We do not put secrets,
          passwords, or payment details into Chat prompts.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">Retention and your choices</h2>
        <p className="max-w-2xl text-slate-200">
          You can delete a signed-in conversation at any time in Chat. You can close a signed-out session and, if we
          have issued a short-lived anonymous cookie, it expires. For any other privacy request, contact us at the
          address published on bungah.io.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">Sources and answers</h2>
        <p className="max-w-2xl text-slate-200">
          Chat answers may be AI-generated. They may be wrong or out of date. They are for information only, not
          investment, legal, or tax advice. Check the cited sources before relying on any figure.
        </p>
        <p className="text-sm text-slate-300">
          <Link href="/chat" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">
            Back to Chat
          </Link>
        </p>
      </section>
    </div>
  );
}
