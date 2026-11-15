/** Licensed STR (Smith Travel Research) data is never shared in Chat. */

export const STR_TABLE_REFUSAL =
  "We don't share STR data. Occupancy, ADR, and RevPAR figures from STR (or reprints of STR) are licensed and are not included in this chat.";

export function asksForStrTable(question: string): boolean {
  const q = question.toLowerCase();
  const namesStr = /\bstr\b/.test(q) || /\bsmith travel\b/.test(q);
  const wantsTable =
    /\b(table|workbook|spreadsheet|export|dataset|raw data|full .*(occupancy|adr|revpar)|occupancy,?\s*adr|adr,?\s*(and|&)\s*revpar)\b/.test(
      q
    ) || /\b(send|give|show|share|provide).{0,40}\b(table|workbook|data)\b/.test(q);
  return namesStr && wantsTable;
}
