/** Published field notes: outbound articles that work an example through the Sound Asset Lodging framework. */
export type FieldNote = {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  /** Publish date, ISO (America/New_York calendar date). */
  date: string;
  url: string;
  summary: [string, string];
  image: { srcWebp800: string; srcWebp1600: string; srcJpg1600: string; width: number; height: number; alt: string };
  caption: string;
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
    date: "2026-10-30",
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
    sale_id: "midway-portfolio-chicago-2026",
  },
];

export function fieldNotesForSale(saleId: string): FieldNote[] {
  return FIELD_NOTES.filter((n) => n.sale_id === saleId);
}
