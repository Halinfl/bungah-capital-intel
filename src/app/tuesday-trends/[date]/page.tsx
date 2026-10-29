import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IssueView } from "@/components/tuesday-trends/IssueView";
import { ttIssue, ttIssues } from "@/lib/tuesday-trends";

/** One static page per committed issue; any other date is a 404. */
export const dynamicParams = false;
export function generateStaticParams() {
  return ttIssues().map((i) => ({ date: i.date }));
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const issue = ttIssue(date);
  if (!issue) return {};
  return {
    title: `Tuesday Trends, ${issue.capturedLabel} · Bungah Capital Intel`,
    description: `Indicative Google Hotels rates captured ${issue.capturedLabel} for ${issue.markets().length} US markets: median cheapest refundable nightly rate, 2 adults, pre-tax, five horizons.`,
    alternates: { canonical: `/tuesday-trends/${issue.date}` },
  };
}

export default async function TuesdayTrendsIssuePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const issue = ttIssue(date);
  if (!issue) notFound();
  return <IssueView issue={issue} permalink />;
}
