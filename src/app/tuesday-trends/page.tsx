import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IssueView } from "@/components/tuesday-trends/IssueView";
import { ttLatest } from "@/lib/tuesday-trends";

export const metadata: Metadata = {
  title: "Tuesday Trends · Bungah Capital Intel",
  description:
    "Weekly indicative Google Hotels rates for 17 US markets: median cheapest refundable nightly rate, 2 adults, pre-tax, five horizons. Decision support, not a quote.",
  alternates: { canonical: "/tuesday-trends" },
};

/** Always the latest issue (newest summary JSON). Past issues: /tuesday-trends/archive. */
export default function TuesdayTrendsPage() {
  const issue = ttLatest();
  if (!issue) notFound();
  return <IssueView issue={issue} />;
}
