/** Shown when a page's live Capital Graph data could not be loaded (DB outage) and no cached copy exists. */
export default function DataUnavailableNotice({ what = "Live market data" }: { what?: string }) {
  return (
    <div
      role="status"
      data-testid="data-unavailable"
      className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100"
    >
      {what} is temporarily unavailable. The rest of the site is up; please check back in a few minutes.
    </div>
  );
}
