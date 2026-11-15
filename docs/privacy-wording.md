# Draft privacy-policy wording — Chat and Groq

Status: **draft only**. Harvey reviews this before anything is live. This text is also on the preview `/privacy` page, marked as a draft. It is not on bungah.io production.

Last updated for review: November 15, 2026 (America/New_York).

## Proposed page title

Privacy · Bungah Capital Intel

## Proposed body

Bungah Capital Intel (bungah.io) is operated by Bungah Capital. This page explains how Chat handles your questions. It supplements our [Trust Contract](/trust).

### What you type into Chat

When AI answers are turned on, questions you submit in public (signed-out) Chat are sent to Groq, a US-based inference provider, so a model can draft an answer from the public and derived facts we already hold. Groq processes that request in the United States.

We configure Groq for Zero Data Retention (ZDR). With ZDR on, Groq does not retain your prompts or the model's outputs for reliability or abuse monitoring. Groq may still keep usage metadata that does not include the text of your question or the answer (for example, token counts). Enabling and confirming the live ZDR toggle in Groq's Data Controls is a pre-launch step for Hal; this wording should not go live until that confirmation is in hand and counsel has signed off.

Do not enter confidential, personal, or login information into Chat.

Signed-in (private) Chat is not sent to Groq. Those questions stay on our systems and are answered from the same cited, deterministic path used when AI is off.

### What we log on our side

- **Signed-out Chat.** We keep a question log (the question, the answer, citations, and ordinary technical metadata such as time and whether the answer came from the model or from our cited templates). We use this to improve coverage and to operate the product. These rows can be used to train or evaluate our own systems only when that use is allowed under this policy.
- **Signed-in private threads.** When you are signed in, your conversation is stored as a private thread. Private question-log rows do not keep the question or answer text for training. You can delete a conversation from Chat. Deleting your account removes your private threads and related private records.
- **Training.** We do not use signed-in private Chat to train models unless you opt in. Signed-out questions may be used to improve Chat only as described above. There is no training on Groq; Groq is not permitted to use our prompts or outputs to train its models.

### What we do not do

We do not sell your Chat questions. We do not send signed-in private threads to Groq. We do not put secrets, passwords, or payment details into Chat prompts.

### Retention and your choices

You can delete a signed-in conversation at any time in Chat. You can close a signed-out session and, if we have issued a short-lived anonymous cookie, it expires. For any other privacy request, contact us at halvespucci@gmail.com (or the address published on bungah.io at launch).

### Sources and answers

Chat answers may be AI-generated. They may be wrong or out of date. They are for information only, not investment, legal, or tax advice. Check the cited sources before relying on any figure.

## Counsel notes (not for the public page)

- Do not publish this page on production until: (1) Hal has turned on ZDR in Groq Data Controls and saved a screenshot, (2) Harvey has confirmed this wording, and (3) the live Chat path matches it (private threads stay off Groq; opt-in is honored).
- If ZDR cannot be confirmed on the free org, do not claim zero data retention. Substitute: "Groq does not retain prompts or outputs by default, but may keep them for up to 30 days for reliability or abuse monitoring unless Zero Data Retention is enabled."
- The public disclosure under the Chat input uses Harvey's required sentence and links here.
