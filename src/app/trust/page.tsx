import Link from "next/link";

const promises = [
  {
    label: "Encrypt in transit and at rest",
    meaning: "TLS everywhere; database and backups encrypted (provider KMS).",
  },
  {
    label: "Secrets stay out of code",
    meaning: "API keys and tokens live in env/vault only — never in git or the browser.",
  },
  {
    label: "Read-only links first",
    meaning:
      "Connected data starts as scoped, user-authorized, read-only. We don’t scrape your devices.",
  },
  {
    label: "Decision support",
    meaning:
      "We recommend deploy / hold / exit / flag / convert with citations. We do not auto-move capital or sign contracts.",
  },
  {
    label: "Never write bookings",
    meaning:
      "No writes to PMS / CRS / OTA guest systems.",
  },
] as const;

const dataRows = [
  {
    title: "Public sources — always cited",
    body: "CVB stats, filings, and press are treated as public; answers and Sound Asset Lodging memos still carry source labels.",
  },
  {
    title: "Linked accounts — read-only defaults",
    body: "When connectors ship: OAuth or user-controlled upload, least-privilege scopes, read-only until you explicitly widen them.",
  },
  {
    title: "Encryption",
    body: "TLS in transit; encryption at rest on the primary store and backups via cloud KMS. Standard, proven encryption — no proprietary crypto.",
  },
  {
    title: "Access",
    body: "Service roles are least-privilege; human access to production data is gated and logged as controls mature.",
  },
  {
    title: "Retention / delete",
    body: "Portfolio-private data follows a documented retention path once connectors ship.",
  },
  {
    title: "Decision-support boundary",
    body: "Model output is decision support. You ship judgment.",
  },
] as const;

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-white">Trust Contract</h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-slate-400">
          What we promise about your data, our sources, and who makes the decisions. Plain
          words, no badges we haven&apos;t earned.
        </p>
        <p className="text-sm text-slate-500">
          <Link href="/chat" className="text-slate-300 underline-offset-2 hover:underline">
            Continue in Chat
          </Link>
          <span className="mx-2 text-slate-600">·</span>
          <Link href="/" className="text-slate-300 underline-offset-2 hover:underline">
            Return home
          </Link>
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          How we earn confidence
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {promises.map((p) => (
            <div
              key={p.label}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
            >
              <p className="text-sm font-medium text-white">{p.label}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h2 className="text-base font-medium text-white">What it is</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
            <li>Capital Graph · Radars · Chat · Sound Asset Lodging for hotel investors and operators</li>
            <li>Every material number cited — or marked as an estimate</li>
            <li>Humans Approve / Edit / Dismiss — we never auto-execute</li>
          </ul>
        </div>
        <div className="space-y-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <h2 className="text-base font-medium text-white">What we never do</h2>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-400">
            <li>Auto-execute capital, debt, or franchise decisions</li>
            <li>Write to PMS / CRS / OTA booking systems</li>
            <li>Sell scraped outreach lists or spam from this product</li>
            <li>Put secrets in the client or the repo</li>
            <li>Pretend chat memory is a substitute for a connected graph</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          How we handle data
        </h2>
        <div className="space-y-2">
          {dataRows.map((row) => (
            <details
              key={row.title}
              className="group rounded-xl border border-white/[0.08] bg-white/[0.02] open:bg-white/[0.03]"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-slate-200 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  {row.title}
                  <span className="text-xs text-slate-600 group-open:hidden">+</span>
                  <span className="hidden text-xs text-slate-600 group-open:inline">−</span>
                </span>
              </summary>
              <p className="border-t border-white/[0.06] px-4 py-3 text-sm leading-relaxed text-slate-500">
                {row.body}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
        <h2 className="text-base font-medium text-white">What&apos;s live today, and what comes next</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
          <li>
            <span className="font-medium text-slate-100">Live today:</span> encrypted connections and
            storage, secrets kept out of code, and private sign-in for workspaces.
          </li>
          <li>
            <span className="font-medium text-slate-100">Next:</span> read-only links to your own data,
            which you authorize and can switch off.
          </li>
          <li>
            <span className="font-medium text-slate-100">Later:</span> an independent security review.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          We only describe a safeguard here once it is actually in place.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/chat"
          className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-white"
        >
          Ideate in Chat
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-white/20 hover:text-white"
        >
          Back to Capital Graph
        </Link>
      </div>

    </div>
  );
}
