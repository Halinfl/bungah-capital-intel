/**
 * Post-generation checks for Groq Chat answers.
 * Failed checks fall back to the deterministic answer. Provenance markers are not stripped.
 */
import { isLicensedText } from "./licensed-sources";

const BUY_SELL_OUTPUT =
  /\b(I (?:would )?recommend (?:you )?(?:buy|sell|hold)|this is a (?:strong )?buy|price target|you should (?:buy|sell|hold|invest in)|we recommend (?:buying|selling|holding))\b/i;

/** Standing public-content rule: never say Showboat is "in foreclosure". */
const SHOWBOAT_FORECLOSURE = /\bshowboat\b[\s\S]{0,80}\bin foreclosure\b|\bin foreclosure\b[\s\S]{0,80}\bshowboat\b/i;

const INVENTED_SOURCE_HINT =
  /\((?:source|according to|via)\s*:\s*(?:unknown|n\/a|redacted|internal)\)/i;

export type LlmGuardFail = "licensed_figures" | "buy_sell" | "showboat_foreclosure" | "empty";

export function inspectLlmAnswer(text: string): LlmGuardFail | null {
  const t = (text ?? "").trim();
  if (t.length < 20) return "empty";
  if (SHOWBOAT_FORECLOSURE.test(t)) return "showboat_foreclosure";
  if (BUY_SELL_OUTPUT.test(t)) return "buy_sell";
  if (isLicensedText(t)) return "licensed_figures";
  void INVENTED_SOURCE_HINT;
  return null;
}

/**
 * Neutral Showboat wording if the model slipped. We do not invent a court status —
 * we only remove the forbidden phrase and leave the rest of the cited sentence.
 */
export function scrubShowboatForeclosure(text: string): string {
  if (!SHOWBOAT_FORECLOSURE.test(text)) return text;
  return text.replace(/\bin foreclosure\b/gi, "the subject of reported lender or court proceedings");
}
