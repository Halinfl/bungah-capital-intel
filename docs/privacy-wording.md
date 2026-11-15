# Draft Chat privacy notice — Chat and Groq

Status: **draft only**, under legal review. This text is also on the preview `/privacy` page. It is a Chat privacy notice, not a complete website privacy policy, and it is not on bungah.io production.

Last updated for review: November 15, 2026 (America/New_York).

## Proposed page title

Chat privacy notice · Bungah Capital Intel

## Proposed body

Bungah Capital Intel (bungah.io) is operated by Bungah Capital LLC. This Chat privacy notice explains how Chat handles your questions. It is not a complete website privacy policy. It supplements our [Trust Contract](/trust).

### What you type into Chat

When AI answers are turned on, questions you submit in public (signed-out) Chat are sent to Groq, a US-based inference provider, so a model can draft an answer from the public and derived facts we already hold. Groq processes that request in the United States.

We configure Groq for Zero Data Retention (ZDR). With ZDR on, Groq does not retain your prompts or the model's outputs for reliability or abuse monitoring. Groq may still keep usage metadata that does not include the text of your question or the answer (for example, token counts).

Do not enter confidential, personal, or login information into Chat.

Signed-in (private) Chat uses the same AI path as signed-out Chat. The question, recent turns in that thread, and any cited facts we retrieve are sent to Groq in the United States to generate a reply. Groq Zero Data Retention is on for our inference. The thread itself stays private: owner-only, never written into public question logs, not used to train or improve Chat unless you opt in, and deleted when you delete the conversation or your account.

Chat is not intended for anyone under 18.

### Who processes Chat data

These processors handle Chat-related data:

- **Vercel** — hosts the site and application.
- **Clerk** — provides sign-in, when you use an account.
- **Neon** — hosts the database where Chat threads and logs are stored.
- **Groq** — processes signed-out Chat questions in the United States when AI answers are turned on, as described above.

When live web search is turned on, a search query for a current fact that is not in our cited data is sent to free, official open sources: the Wikimedia APIs (Wikipedia and Wikidata) and, for news headlines, the GDELT Project DOC API, plus official U.S. government RSS feeds when the question is about the FAA, the Federal Reserve, or BLS. We do not use Groq's paid browser search. Wikipedia text is available under CC BY-SA; GDELT requires a citation and a link to https://www.gdeltproject.org/. Those providers receive the search query, not your full private thread.

Ideas you share to improve Chat — through the "Share an idea" control, or a signed-out message that is clearly feedback — are stored as idea records (the text, optional thread id, whether you were signed out or signed in, and the time). Signed-out ideas are kept for 12 months, then deleted by the same cleanup job as signed-out question logs. Signed-in ideas are saved only when you explicitly share them; we do not scrape private threads for ideas.

We do not currently use a third-party analytics product on this site. Cookies we actually use for Chat:

- **Clerk session cookies**, when you are signed in.
- **`bci_anon`**, an HttpOnly cookie that identifies a signed-out conversation in this browser for up to 180 days (the conversation itself may be removed sooner if it is inactive; see retention below).

### What we log on our side

- **Signed-out Chat.** We keep a question log (the question, the answer, citations, and ordinary technical metadata such as time and whether the answer came from the model or from our cited templates). We may use signed-out questions and answers to improve and evaluate Chat. We keep those signed-out question logs for 12 months, then delete them. The cleanup job in this preview (`GET /api/cron/chat-purge`) performs that deletion.
- **Signed-in private threads.** When you are signed in, your conversation is stored as a private thread. Private question-log rows do not keep the question or answer text for training. You can delete a conversation from Chat. Deleting your account through our sign-in provider (Clerk) removes your private threads, private messages, saved items, private log rows, and Chat settings. That deletion is run by our Clerk `user.deleted` webhook.
- **Training.** We do not use signed-in private Chat to train models unless you opt in. Opt-in is off by default. It can be turned on through a signed-in API (`POST /api/chat/prefs` with `trainOptIn`); there is not yet a Chat settings toggle in the user interface. There is no training on Groq; Groq is not permitted to use our prompts or outputs to train its models.

Signed-out conversations (the thread in your browser) with nothing saved may also be removed after 90 days of inactivity. That does not shorten the 12-month question-log retention: a public log row can remain, unlinked from a deleted thread, until it is 12 months old.

### What we do not do

We do not sell your Chat questions. When you are signed in, we may send your question (and recent turns in that private thread, plus any cited facts we retrieve) to Groq in the United States to generate a reply. Groq Zero Data Retention is on for our inference. Your thread stays private: it is owner-only, it is never written into public question logs, it is not used to train or improve Chat unless you opt in, and it is deleted when you delete the conversation or your account. We do not put secrets, passwords, or payment details into Chat prompts.

### Retention and your choices

You can delete a signed-in conversation at any time in Chat. You can close a signed-out session; the `bci_anon` cookie expires after 180 days if you do not return. For any other privacy request, contact halvespucci@gmail.com.

### Sources and answers

Chat answers may be AI-generated. They may be wrong or out of date. They are for information only, not investment, legal, or tax advice. Check the cited sources before relying on any figure.

When AI answers are enabled, they are generated using OpenAI's gpt-oss-120b model, hosted by Groq. This is a text-only credit; no logos are used.

## Counsel notes (not for the public page)

- Code check (this preview branch): signed-in Chat uses the same Groq path as signed-out Chat (`allowLlm` is no longer blocked by `isPrivate`). Private threads remain owner-only; public log rows store `[private]` rather than the question or answer; training eligibility stays off unless the user has opted in; account deletion removes private threads and related private records (`deleteUserData` in `src/lib/chat-store.ts`, invoked from `src/app/api/webhooks/clerk/route.ts` on `user.deleted`). Groq Zero Data Retention is on at the org (Inference ZDR Enabled).
- ZDR is confirmed on (Inference ZDR Enabled; Batch and Fine-tuning Off). The public ZDR claim stays. This page still should not go live on production until Harvey and Hal say so.
- Hal confirmed (15 Nov 2026): legal entity Bungah Capital LLC; signed-out logs retained 12 months; privacy contact halvespucci@gmail.com.
- 12-month signed-out log deletion is implemented in code (`purgeSignedOutLogs`, called from the existing `/api/cron/chat-purge` job), not as a manual process. Vercel Cron typically fires against Production, which will not run this code until a production ship; on this preview the purge runs when that job is called against the preview deployment.
