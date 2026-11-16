/** Licensed STR / CoStar / Kalibri / HotStats / Lodging Econometrics data is never shared in Chat. */

export const STR_TABLE_REFUSAL =
  "We don't share STR data. Occupancy, ADR, and RevPAR figures from STR (or reprints of STR) are licensed and are not included in this chat.";

export const LICENSED_DATA_REFUSAL =
  "We don't share CoStar, STR, Kalibri, HotStats, or Lodging Econometrics data — including sale comps, cap rates, and price per key from those sources. They are licensed and are not included in this chat.";

export function asksForStrTable(question: string): boolean {
  const q = question.toLowerCase();
  const namesStr = /\bstr\b/.test(q) || /\bsmith travel\b/.test(q);
  const wantsTable =
    /\b(table|workbook|spreadsheet|export|dataset|raw data|full .*(occupancy|adr|revpar)|occupancy,?\s*adr|adr,?\s*(and|&)\s*revpar)\b/.test(
      q
    ) || /\b(send|give|show|share|provide).{0,40}\b(table|workbook|data)\b/.test(q);
  return namesStr && wantsTable;
}

/** True when the visitor asks for licensed vendor comps, cap rates, or performance tables. */
export function asksForLicensedData(question: string): boolean {
  if (asksForStrTable(question)) return true;
  const q = question.toLowerCase();
  const namesVendor =
    /\bcostar\b/.test(q) ||
    /\bstr\b/.test(q) ||
    /\bsmith travel\b/.test(q) ||
    /\bkalibri\b/.test(q) ||
    /\bhotstats\b/.test(q) ||
    /\blodging econometrics\b/.test(q) ||
    /\bmatthews\b/.test(q);
  const wantsLicensed =
    /\b(comps?|comparables?|cap rates?|price per key|per key|p\/?key|sale comps?|by the numbers|hotel performance(?: pdf)?|workbook|spreadsheet|dataset)\b/.test(
      q
    );
  return namesVendor && wantsLicensed;
}
