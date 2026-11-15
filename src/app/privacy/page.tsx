import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat privacy notice (draft) · Bungah Capital Intel",
  description:
    "Draft Chat privacy notice: how questions are processed, who processes them, what we log, and when training is allowed. Under legal review. Not a complete website privacy policy.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-wider text-amber-200/90">Draft — under legal review. Not a live production policy.</p>
        <h1 className="t-h1">Chat privacy notice</h1>
        <p className="max-w-2xl t-lead">
          Bungah Capital Intel (bungah.io) is operated by Bungah Capital LLC. This Chat privacy notice explains how Chat
          handles your questions. It is not a complete website privacy policy. It supplements our{" "}
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
          include the text of your question or the answer (for example, token counts).
        </p>
        <p className="max-w-2xl text-slate-200">Do not enter confidential, personal, or login information into Chat.</p>
        <p className="max-w-2xl text-slate-200">
          Signed-in (private) Chat uses the same AI path as signed-out Chat. The question, recent turns in that thread,
          and any cited facts we retrieve are sent to Groq in the United States to generate a reply. Groq Zero Data
          Retention is on for our inference. The thread itself stays private: owner-only, never written into public
          question logs, not used to train or improve Chat unless you opt in, and deleted when you delete the
          conversation or your account.
        </p>
        <p className="max-w-2xl text-slate-200">Chat is not intended for anyone under 18.</p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">Who processes Chat data</h2>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-slate-200">
          <li>
            <strong className="text-slate-100">Vercel</strong> hosts the site and application.
          </li>
          <li>
            <strong className="text-slate-100">Clerk</strong> provides sign-in, when you use an account.
          </li>
          <li>
            <strong className="text-slate-100">Neon</strong> hosts the database where Chat threads and logs are stored.
          </li>
          <li>
            <strong className="text-slate-100">Groq</strong> processes signed-out Chat questions in the United States
            when AI answers are turned on, as described above.
          </li>
        </ul>
        <p className="max-w-2xl text-slate-200">
          When live web search is turned on, a search query for a current fact that is not in our cited data is
          sent to free, official open sources: the Wikimedia APIs (Wikipedia and Wikidata) and, for news headlines,
          the GDELT Project DOC API, plus official U.S. government RSS feeds when the question is about the FAA,
          the Federal Reserve, or BLS. We do not use Groq&apos;s paid browser search. Wikipedia text is available
          under CC BY-SA; GDELT requires a citation and a link to https://www.gdeltproject.org/. Those providers
          receive the search query, not your full private thread.
        </p>
        <p className="max-w-2xl text-slate-200">
          Ideas you share to improve Chat — through the &quot;Share an idea&quot; control, or a signed-out message
          that is clearly feedback — are stored as idea records (the text, optional thread id, whether you were
          signed out or signed in, and the time). Signed-out ideas are kept for 12 months, then deleted. Signed-in
          ideas are saved only when you explicitly share them; we do not scrape private threads for ideas.
        </p>
        <p className="max-w-2xl text-slate-200">
          We do not currently use a third-party analytics product on this site. Cookies we actually use for Chat: Clerk
          session cookies when you are signed in, and <code className="text-slate-100">bci_anon</code>, an HttpOnly cookie
          that identifies a signed-out conversation in this browser for up to 180 days (the conversation itself may be
          removed sooner if it is inactive; see retention below).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">What we log on our side</h2>
        <ul className="max-w-2xl list-disc space-y-2 pl-5 text-slate-200">
          <li>
            <strong className="text-slate-100">Signed-out Chat.</strong> We keep a question log (the question, the
            answer, citations, and ordinary technical metadata such as time and whether the answer came from the model
            or from our cited templates). We may use signed-out questions and answers to improve and evaluate Chat. We
            keep those signed-out question logs for 12 months, then delete them.
          </li>
          <li>
            <strong className="text-slate-100">Signed-in private threads.</strong> When you are signed in, your
            conversation is stored as a private thread. Private question-log rows do not keep the question or answer
            text for training. You can delete a conversation from Chat. Deleting your account through our sign-in
            provider (Clerk) removes your private threads, private messages, saved items, private log rows, and Chat
            settings.
          </li>
          <li>
            <strong className="text-slate-100">Training.</strong> We do not use signed-in private Chat to train models
            unless you opt in. Opt-in is off by default. It can be turned on through a signed-in API; there is not yet
            a Chat settings toggle in the user interface. There is no training on Groq; Groq is not permitted to use
            our prompts or outputs to train its models.
          </li>
        </ul>
        <p className="max-w-2xl text-slate-200">
          Signed-out conversations (the thread in your browser) with nothing saved may also be removed after 90 days of
          inactivity. That does not shorten the 12-month question-log retention: a public log row can remain, unlinked
          from a deleted thread, until it is 12 months old.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">What we do not do</h2>
        <p className="max-w-2xl text-slate-200">
          We do not sell your Chat questions. When you are signed in, we may send your question (and recent turns in that private thread, plus any cited facts we retrieve) to Groq in the United States to generate a reply. Groq Zero Data Retention is on for our inference. Your thread stays private: it is owner-only, it is never written into public question logs, it is not used to train or improve Chat unless you opt in, and it is deleted when you delete the conversation or your account. We do not put secrets,
          passwords, or payment details into Chat prompts.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">Retention and your choices</h2>
        <p className="max-w-2xl text-slate-200">
          You can delete a signed-in conversation at any time in Chat. You can close a signed-out session; the{" "}
          <code className="text-slate-100">bci_anon</code> cookie expires after 180 days if you do not return. For any
          other privacy request, contact{" "}
          <a href="mailto:halvespucci@gmail.com" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">
            halvespucci@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="t-h2">Sources and answers</h2>
        <p className="max-w-2xl text-slate-200">
          Chat answers may be AI-generated. They may be wrong or out of date. They are for information only, not
          investment, legal, or tax advice. Check the cited sources before relying on any figure.
        </p>
        <p className="max-w-2xl text-slate-200">
          When AI answers are enabled, they are generated using OpenAI&apos;s gpt-oss-120b model, hosted by Groq. This
          is a text-only credit; no logos are used.
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
