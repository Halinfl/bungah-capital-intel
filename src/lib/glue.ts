/**
 * Line-break glue for public copy: a middle-dot separator never starts a line (no-break space before
 * "·"), and "City, ST" never splits between the comma and the state code. Display only; data unchanged.
 */
const STATES =
  "AL|AK|AZ|AR|CA|CO|CT|DE|DC|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY";
const CITY_ST = new RegExp(`([A-Za-z.'’)-]),[ \\t]+(${STATES})\\b`, "g");

export function glueText(s: string): string {
  return s.replace(/[ \t]+·(?=\s)/g, "\u00a0·").replace(CITY_ST, "$1,\u00a0$2");
}

/** Same glue for an HTML string (spaces only; tags and attributes contain no " · " or ", ST"). */
export function glueHtml(html: string): string {
  return html.replace(/[ \t]+·(?=\s)/g, "&nbsp;·").replace(CITY_ST, "$1,&nbsp;$2");
}
