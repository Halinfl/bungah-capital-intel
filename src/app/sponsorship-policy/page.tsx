import type { Metadata } from "next";
import { DraftNote } from "@/components/sound-assets/DraftNote";

export const metadata: Metadata = {
  title: "Sponsorship policy · Bungah Capital Intel",
  description: "Who may sponsor Bungah Capital Intel, who may not, and how any sponsorship would be disclosed.",
};

export default function SponsorshipPolicyPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="t-h1">Sponsorship policy</h1>
        <p className="max-w-3xl t-lead">We currently have no sponsors.</p>
        <DraftNote>Policy copy for Hal to edit and confirm.</DraftNote>      </header>
      <section className="max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">Rules</h2>
        <ol className="list-decimal space-y-1.5 pl-5 text-[15px] text-slate-200">
          <li>No sponsorship from bitcoin-industry companies.</li>
          <li>No sponsor may review, shape or pre-approve any data, call, score or essay.</li>
          <li>
            If a sponsorship is ever accepted, it is disclosed at the top of every page it touches, in the same size as the
            page text, never in fine print, and logged here with its start date.
          </li>
          <li>Data products (Markets, Tuesday Trends, REITs, Ledger) carry no sponsored content.</li>
        </ol>
      </section>
      <section className="max-w-3xl space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-white">Sponsors</h2>
        <p className="text-[15px] text-slate-200">None.</p>
      </section>
    </div>
  );
}
