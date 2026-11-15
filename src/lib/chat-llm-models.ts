/**
 * Groq models allowed for Chat when BUNGAH_USE_LLM is on.
 * Harvey: Production (non-preview / non-Beta) models only.
 * llama-3.3-70b-versatile was shut down for Free/Developer on 2026-08-16.
 */
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
export const GROQ_OVERFLOW_MODEL = "openai/gpt-oss-20b";

/** Groq Production text models we will call. Preview models (e.g. qwen/qwen3.8-27b) are refused. */
export const PRODUCTION_GROQ_MODELS = new Set([
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
]);

/** Normalize aliases and drop anything that is not a Production Groq model we allow. */
export function resolveGroqModelId(raw?: string | null): string | null {
  const id = (raw ?? DEFAULT_GROQ_MODEL).trim();
  if (!id) return DEFAULT_GROQ_MODEL;
  const bare = id.includes("/") ? id.slice(id.lastIndexOf("/") + 1) : id;
  const normalized =
    bare === "gpt-oss-120b"
      ? "openai/gpt-oss-120b"
      : bare === "gpt-oss-20b"
        ? "openai/gpt-oss-20b"
        : id;
  return PRODUCTION_GROQ_MODELS.has(normalized) ? normalized : null;
}
