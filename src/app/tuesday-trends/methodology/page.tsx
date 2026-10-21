import Link from "next/link";
import type { Metadata } from "next";
import {
  HORIZONS,
  THIN_BELOW,
  SOLD_OUT_DOT_AT,
  LIST_SIZE,
  TT_CAPTURED_LABEL,
  TT_CAPTURE_TIME_LABEL,
  TT_LIST_LABEL,
  fmtStayRange,
  stayYear,
  ttHotelLists,
  ttStays,
} from "@/lib/tuesday-trends";

export const metadata: Metadata = {
  title: "Tuesday Trends methodology · Bungah Capital Intel",
  description: "How Tuesday Trends measures indicative Google Hotels rates: hotels, horizons, stays, medians and data states.",
};

const SECTIONS = [
  { id: "what-this-is", title: "What this is" },
  { id: "what-we-measure", title: "What we measure" },
  { id: "horizons", title: "Horizons and stays" },
  { id: "hotel-lists", title: "Hotel lists" },
  { id: "data-states", title: "Data states" },
  { id: "is-and-isnt", title: "What it is and isn’t" },
  { id: "archive", title: "Archive and change log" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-semibold tracking-tight text-white">
      {children}
    </h2>
  );
}

const p = "text-[15px] leading-relaxed text-slate-200";

export default function MethodologyPage() {
  const stays = ttStays();
  const lists = ttHotelLists();
  const range = (h: string, s: "weekday" | "weekend") => {
    const c = stays.find((x) => x.horizon === h && x.stay === s)!;
    return { text: fmtStayRange(c.checkIn, c.checkOut), year: stayYear(c.checkIn), nights: c.nights };
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/tuesday-trends" className="text-xs text-slate-300 hover:text-white">
          ← Tuesday Trends
        </Link>
        <h1 className="mt-2 t-h1">Tuesday Trends methodology</h1>
        <p className="mt-2 max-w-3xl t-lead">
          How the weekly rate board is built, what each number means, and where it stops being useful.
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-20">
            <div className="text-xs font-medium uppercase tracking-wider text-slate-300">On this page</div>
            <ul className="mt-3 space-y-2 text-sm">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-slate-200 hover:text-white">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="max-w-3xl space-y-10">
          <section className="space-y-3">
            <H2 id="what-this-is">What this is</H2>
            <p className={p}>
              Tuesday Trends is a weekly read of what hotel rooms are listed for in 17 US markets. Every Tuesday
              evening we take Google Hotels prices for the same {LIST_SIZE} hotels per market, at five distances
              into the future, for a weekday stay and a weekend stay. The board shows the median for each market,
              so you can see where rates sit now and, from the second week, how they move.
            </p>
            <p className={p}>
              The current board was captured {TT_CAPTURED_LABEL}, {TT_CAPTURE_TIME_LABEL}. A handful of rows (30
              of 8,500, for three hotels added when the lists were revised) were priced the next morning, Wed, Oct
              21, for the same stay dates.
            </p>
          </section>

          <section className="space-y-3">
            <H2 id="what-we-measure">What we measure</H2>
            <ul className={`${p} list-disc space-y-2 pl-5`}>
              <li>
                <span className="font-medium text-white">Refundable: cheapest refundable rate (the default).</span> For each
                hotel, the lowest nightly rate from a seller offering free cancellation. The board shows the median
                across the hotels that have one. Not every hotel does, so this median covers about 3 in 4 hotels at
                1 week out and about 1 in 3 at ~11 months.
              </li>
              <li>
                <span className="font-medium text-white">Any rate.</span> Google&apos;s headline nightly price
                for each hotel, refundable or not. Its median covers every priced hotel.
              </li>
              <li>
                <span className="font-medium text-white">Basis.</span> Nightly, in US dollars, for 2 adults, before
                taxes and fees. A tax-inclusive view is coming soon; we will add it once the tax figures are
                consistent across markets.
              </li>
              <li>
                <span className="font-medium text-white">Coverage.</span> Each cell reports how many of the{" "}
                {LIST_SIZE} hotels had a price for the rate shown, for example &ldquo;38/50 priced&rdquo;. On the
                board it sits in the cell&apos;s tooltip.
              </li>
              <li>
                <span className="font-medium text-white">Week-over-week (from next Tuesday).</span> Changes will
                compare the same hotels in both weeks: the median of each hotel&apos;s own change, so hotels
                dropping in or out of coverage can&apos;t move the figure. A change is shown only when at least{" "}
                {THIN_BELOW} hotels can be compared.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <H2 id="horizons">Horizons and stays</H2>
            <p className={p}>
              Each week the horizons are counted from the capture date: 7, 30, 91, 182 and about 325 days out. For
              each one we take the nearest Monday-to-Thursday stay (check in Monday, out Thursday, 3 nights) and the
              nearest Friday-to-Sunday stay (in Friday, out Sunday, 2 nights). Google prices out about 330 days,
              so the last horizon stops just inside that limit. This week&apos;s stays:
            </p>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-slate-300">
                    <th scope="col" className="px-4 py-2.5 font-medium">Horizon</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Weekday (Mon–Thu)</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Weekend (Fri–Sun)</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums text-slate-100">
                  {HORIZONS.map((h) => {
                    const wd = range(h.key, "weekday");
                    const we = range(h.key, "weekend");
                    return (
                      <tr key={h.key} className="border-b border-white/[0.06] last:border-b-0">
                        <th scope="row" className="px-4 py-2.5 font-medium text-white">
                          {h.label}
                        </th>
                        <td className="px-4 py-2.5">
                          {wd.text}, {wd.year}
                        </td>
                        <td className="px-4 py-2.5">
                          {we.text}, {we.year}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <H2 id="hotel-lists">Hotel lists</H2>
            <p className={p}>
              Each market tracks a fixed list of {LIST_SIZE} hotels, so week-to-week changes come from prices, not
              from a changing mix. Each list draws on the market&apos;s core visitor districts and includes hotels
              only: no vacation rentals, hostels, extended-stay or timeshare properties, and 3 stars and up (a few hotels Google doesn&apos;t star-rate are included). Hotels are ranked by Google review count
              times rating, weighted toward 4- and 5-star hotels, with a small number added or excluded by hand.
              Orlando includes the Walt Disney World and Universal resorts. Lists change only with a new version,
              recorded in the change log below.
            </p>
            <p className="text-sm text-slate-300">List {TT_LIST_LABEL}</p>
            <div className="divide-y divide-white/[0.08] rounded-xl border border-white/10 bg-white/[0.03]">
              {lists.map((l) => (
                <details key={l.key} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-medium text-white hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
                    <span>{l.name}</span>
                    <span className="flex items-center gap-2 text-xs font-normal text-slate-300">
                      {l.hotels.length} hotels
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-4 w-4 transition-transform group-open:rotate-180"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </summary>
                  <ol className="list-decimal columns-1 gap-8 px-4 pb-4 pl-9 text-sm leading-relaxed text-slate-200 sm:columns-2">
                    {l.hotels.map((h, i) => (
                      <li key={i} className="break-inside-avoid">
                        {h}
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <H2 id="data-states">Data states</H2>
            <dl className={`${p} space-y-3`}>
              <div>
                <dt className="font-medium text-white">Thin</dt>
                <dd>
                  Fewer than {THIN_BELOW} of {LIST_SIZE} hotels priced for the rate shown. The cell shows
                  &ldquo;— thin&rdquo; instead of a median.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-white">Sold out</dt>
                <dd>
                  Google returned the requested dates with no price and no sellers. This can&apos;t be told apart
                  from Google simply showing no rates for those dates, so treat it as a signal, not a count of full
                  hotels. The board shows the count 1 week out, where sell-outs are real, with a dot at{" "}
                  {SOLD_OUT_DOT_AT} or more of {LIST_SIZE}; hovering shows all five horizons. Further out, and at
                  ~11 months especially, most sold-outs reflect Google&apos;s ~330-day pricing limit.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-white">No price</dt>
                <dd>Google listed sellers for the dates but no nightly price. The hotel is left out of the median.</dd>
              </div>
              <div>
                <dt className="font-medium text-white">No match</dt>
                <dd>
                  Google returned prices for different dates than we asked for. Those prices are discarded, never
                  counted. None occurred this week.
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3">
            <H2 id="is-and-isnt">What it is and isn&apos;t</H2>
            <ul className={`${p} list-disc space-y-2 pl-5`}>
              <li>It is decision support: an indicative, repeatable read of listed rates across markets and horizons.</li>
              <li>It is not a quote. Rates change by the hour, and what you can book depends on room type, seller and terms.</li>
              <li>
                It is not occupancy, ADR or RevPAR. Listed rates are what hotels ask, not what guests paid; use the
                cited market data on each market page for performance.
              </li>
              <li>
                It is not a full market. Fifty prominent hotels per market skew toward large, well-reviewed
                properties.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <H2 id="archive">Archive and change log</H2>
            <p className={p}>
              Each Tuesday&apos;s capture is kept unchanged. Past weeks will be listed here as they build up.
            </p>
            <ul className={`${p} space-y-2`}>
              <li>
                <span className="font-medium tabular-nums text-white">Oct 21, 2026</span>: hotel lists revised to v2
                before first publication (core visitor districts; Orlando adds Walt Disney World and Universal
                resorts).
              </li>
              <li>
                <span className="font-medium tabular-nums text-white">Oct 20, 2026</span>: first capture.
                Week-over-week changes start with the Oct 27 capture.
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  );
}
