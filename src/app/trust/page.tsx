import Link from "next/link";

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          Quiet trust
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Trust Contract</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
          Bungah Capital Intel is decision support for hospitality capital — not a broker, not a
          booking engine, not meeting-sourcing.
        </p>
      </div>

      <ul className="space-y-4 text-sm leading-relaxed text-slate-300">
        <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <strong className="text-white">Propose-only.</strong> We never auto-execute capital actions.
          Humans Approve / Edit / Dismiss.
        </li>
        <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <strong className="text-white">Citations required.</strong> Numbers in the UI and chat carry
          source labels. Invented comps are product failure.
        </li>
        <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <strong className="text-white">Not booking.</strong> We do not sell rooms or consumer travel.
        </li>
        <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <strong className="text-white">Not meeting-sourcing.</strong> We do not run planner marketplaces.
        </li>
        <li className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
          <strong className="text-white">Quiet by default.</strong> Radars notify on material change —
          noise is a bug.
        </li>
      </ul>

      <p className="text-sm text-slate-500">
        Questions? Continue in{" "}
        <Link href="/chat" className="text-slate-300 underline-offset-2 hover:underline">
          Chat
        </Link>{" "}
        or return{" "}
        <Link href="/" className="text-slate-300 underline-offset-2 hover:underline">
          home
        </Link>
        .
      </p>
    </div>
  );
}
