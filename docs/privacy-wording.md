# Draft Chat privacy notice — Chat and Groq

Status: **draft only**, under legal review. This text is also on the preview `/privacy` page. It is a Chat privacy notice, not a complete website privacy policy, and it is not on bungah.io production.

Last updated for review: November 15, 2026 (America/New_York).

## Proposed page title

Chat privacy notice · Bungah Capital Intel

## Proposed body

Bungah Capital Intel (bungah.io) is operated by Bungah Capital LLC. This Chat privacy notice explains how Chat handles your questions. It is not a complete website privacy policy. It supplements our [Trust Contract](/trust).

### What you type into Chat

When AI answers are turned on, Chat questions (signed-in or signed-out) are sent to Groq, a US-based inference provider, so a model can draft an answer from the public and derived facts we already hold. Groq processes that request in the United States.

We configure Groq for Zero Data Retention (ZDR). With ZDR on, Groq does not retain your prompts or the model's outputs for reliability or abuse monitoring. Groq may still keep usage metadata that does not include the text of your question or the answer (for example, token counts).

Do not enter confidential, personal, or login information into Chat.

Signed-in (private) Chat uses the same AI path as signed-out Chat. The question, recent turns in that thread, and any cited facts we retrieve are sent to Groq in the United States to generate a reply. Groq Zero Data Retention is on for our inference. The thread itself stays private: owner-only, never written into public question logs, and kept until you delete it or your account. We do not use signed-in Chat conversations to train or improve Chat. If we ever offer an opt-in, we'll update this notice first and it will be off by default.

Chat is not intended for anyone under 18.

### Who processes Chat data

These processors handle Chat-related data:

- **Vercel** — hosts the site and application.
- **Clerk** — provides sign-in, when you use an account.
- **Neon** — hosts the database where Chat threads and logs are stored.
- **Groq** — processes Chat questions, signed-in and signed-out, in the United States when AI answers are turned on.

Chat data is stored in the United States.

When live web search is turned on, a short search query based on your question (not your full thread) is sent to free, official open sources: the Wikimedia APIs (Wikipedia and Wikidata) and, for news headlines, the GDELT Project DOC API, plus official U.S. government RSS feeds when the question is about the FAA, the Federal Reserve, or BLS. We do not use Groq's paid browser search. Wikipedia text is available under CC BY-SA; GDELT requires a citation and a link to https://www.gdeltproject.org/. The query may include words from your question, so the warning not to enter confidential, personal, or login information into Chat also applies to live search.

Ideas you share to improve Chat — through the "Share an idea" control, or a signed-out message that is clearly feedback — are stored as idea records (the text, optional thread id, whether you were signed out or signed in, and the time). Signed-out ideas are kept for 12 months, then deleted automatically. Signed-in ideas are saved only when you explicitly share them; we do not scrape private threads for ideas. Signed-in shared ideas are kept until you delete them or your account.

We do not currently use a third-party analytics product on this site. Cookies we actually use for Chat:

- **Clerk session cookies**, when you are signed in.
- **`bci_anon`**, an HttpOnly cookie that identifies a signed-out conversation in this browser for up to 180 days (the conversation itself may be removed sooner if it is inactive; see retention below).

### What we log on our side

- **Signed-out Chat.** We keep a question log (the question, the answer, citations, and ordinary technical metadata such as time and whether the answer came from the model or from our cited templates). We may use signed-out questions and answers to improve and evaluate Chat. Those signed-out question logs are deleted automatically after 12 months.
- **Signed-in private threads.** When you are signed in, your conversation is stored as a private thread. You can delete a conversation from Chat. Deleting your account removes your private threads, private messages, saved items, private log rows, and Chat settings. Signed-in threads are kept until you delete them or your account.

Inactive signed-out threads may be removed after 90 days; signed-out log rows follow the 12-month retention.

### What we do not do

We do not sell your Chat questions. We do not put secrets, passwords, or payment details into Chat prompts.

### Retention and your choices

You can delete a signed-in conversation at any time in Chat. You can close a signed-out session; the `bci_anon` cookie expires after 180 days if you do not return. For any other privacy request, contact halvespucci@gmail.com.

### Sources and answers

Chat answers may be AI-generated. They may be wrong or out of date. They are for information only, not investment, legal, or tax advice. Check the cited sources before relying on any figure.

When AI answers are enabled, they are generated using OpenAI's gpt-oss-120b model, hosted by Groq. This is a text-only credit; no logos are used.

## Counsel notes (not for the public page)

- Code check: signed-in Chat uses the same Groq path as signed-out Chat (`allowLlm = range === "all"` in `src/lib/chat-llm.ts`). Private threads remain owner-only; public log rows store `[private]` rather than the question or answer; signed-in conversations are not used to train or improve Chat. Account deletion removes private threads and related private records (`deleteUserData` in `src/lib/chat-store.ts`). Groq Zero Data Retention is on at the org (Inference ZDR Enabled; Batch and Fine-tuning Off).
- Live search (`freeLiveSearch` in `src/lib/chat-web-search.ts`) sends only a short query string derived from the current question to Wikimedia, GDELT, and official government RSS. Prior turns are not sent to those providers. They may be sent to Groq, with ZDR, as thread context for inference.
- Neon project `fragrant-cell-74825853` is in `aws-us-east-2` (United States), confirmed 15 Nov 2026 via the Neon project record. The public sentence "Chat data is stored in the United States." follows from that.
- The public notice no longer describes an in-product training opt-in. If one is offered later, update this notice first; it must be off by default.
- 12-month signed-out log and idea deletion is implemented in code (`purgeSignedOutLogs` / `purgeSignedOutIdeas`). The job must be declared in `vercel.json` (`/api/cron/chat-purge`) so it actually runs in Production. As of 15 Nov 2026, `vercel crons list` for bungah/bungah-capital-intel returned no scheduled jobs; the entry is in the branch's `vercel.json` and will take effect when Production is shipped. Do not treat a preview-only ship as having scheduled Production cron.
- This page still should not go live on production until Harvey and Hal say so.
- Hal confirmed (15 Nov 2026): legal entity Bungah Capital LLC; signed-out logs retained 12 months; privacy contact halvespucci@gmail.com.
