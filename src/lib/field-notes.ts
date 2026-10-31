/** Published field notes: outbound articles that work an example through the Sound Asset Lodging framework. */
export type FieldNote = {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  /** Publish timestamp as Substack reports it (UTC). */
  published_at: string;
  /**
   * Fixed display date, shown as-is (never derived from published_at). Set to match the date printed on
   * the publisher's own page so readers see the same date in both places.
   */
  display_date: string;
  url: string;
  summary: [string, string];
  image: { srcWebp800: string; srcWebp1600: string; srcJpg1600: string; width: number; height: number; alt: string };
  caption: string;
  /** The art's table as real HTML (the art itself is hidden on phones). Values recomputed from the cited inputs. */
  table?: { caption: string; headers: string[]; rows: string[][] };
  /** Recent Deals sale_id this note works through, if any. */
  sale_id?: string;
};

export const FIELD_NOTES: FieldNote[] = [
  {
    id: "feed-the-pip-first",
    title: "Feed the PIP First: What a Bitcoin per key could look like at Midway (Not a prediction)",
    subtitle:
      "Endeavor Hotels just bought RLJ's seven-hotel Midway campus at about $64,300 a key with a $90 million loan. Here's how I'd think through a Bitcoin Reserve Strategy for an owner-operator.",
    publisher: "The Turndown Report",
    published_at: "2026-10-31T02:30:00Z",
    // Site owner's call (2026-10-30): show Oct 31, 2026, matching the date on Substack's own post page.
    // (The post went live Oct 30, 10:30 PM ET; Substack prints the UTC calendar date.) Fixed string, so no
    // timezone formatting can move it.
    display_date: "Oct 31, 2026",
    url: "https://theturndownreport.substack.com/p/feed-the-pip-first-what-a-bitcoin",
    summary: [
      "Endeavor Hotels bought RLJ's seven-hotel, 1,057-key Midway campus for $68M, about $64,300 a key, with a $90M loan.",
      "The piece walks through what a Bitcoin reserve measured as Bitcoin per key would mean, and why the guest, the PIP and debt service come first.",
    ],
    image: {
      srcWebp800: "/field-notes/midway-bitcoin-per-key-800.webp",
      srcWebp1600: "/field-notes/midway-bitcoin-per-key-1600.webp",
      srcJpg1600: "/field-notes/midway-bitcoin-per-key-1600.jpg",
      width: 1600,
      height: 900,
      alt: "Bitcoin per Key at Midway: reserve sizes from 0.005 to 0.1 BTC per key, with campus BTC, dollar value, share of the $90M loan, and value after a 76.7% drawdown",
    },
    caption: "BTC at the Oct 29, 2026 Coinbase close via FRED. Thought experiment, not Endeavor's plan. Art is an illustration.",
    // BTC $77,938.86 (Coinbase close, Oct 29, 2026, FRED CBBTCUSD) x 1,057 keys; share of the $90M loan;
    // value after the 76.7% drawdown (Nov 8, 2021 to Nov 21, 2022, FRED). Matches the published table.
    table: {
      caption: "Bitcoin per key at Midway: 1,057 keys, $68M price, $90M loan. BTC at the Oct 29, 2026 Coinbase close of $77,938.86 via FRED.",
      headers: ["BTC per key", "Campus BTC", "Dollar value", "Share of loan", "After a 76.7% drop"],
      rows: [
        ["0.005", "5.3", "$0.41M", "0.5%", "$0.10M"],
        ["0.01", "10.6", "$0.82M", "0.9%", "$0.19M"],
        ["0.025", "26.4", "$2.06M", "2.3%", "$0.48M"],
        ["0.05", "52.9", "$4.12M", "4.6%", "$0.96M"],
        ["0.1", "105.7", "$8.24M", "9.2%", "$1.92M"],
      ],
    },
    sale_id: "midway-portfolio-chicago-2026",
  },
];

export function fieldNotesForSale(saleId: string): FieldNote[] {
  return FIELD_NOTES.filter((n) => n.sale_id === saleId);
}
