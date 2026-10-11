/**
 * Allowed-corpus retrieval for Bungah Capital Intel chat.
 *
 * ALLOWED: Prisma Capital Graph + authored digests under content/earnings +
 *          Hal/Neo ideology notes under content/ideology.
 * FORBIDDEN: licensed STR/CoStar raw, customer CSP, paywalled transcript training sets.
 *
 * Digests ship with the app (content/) so Vercel has the files at runtime.
 */
import { readFile, readdir } from "fs/promises";
import path from "path";
import corpusJson from "@/generated/allowed-corpus.json";

export type DigestHit = {
  /** Relative path used as citation, e.g. content/earnings/hilton/2026-Q2-digest.md */
  citePath: string;
  slug: string;
  ticker: string;
  name: string;
  period: string;
  /** Truncated markdown excerpt for model context */
  excerpt: string;
  score: number;
};

export type IdeologyHit = {
  citePath: string;
  excerpt: string;
  score: number;
};

export type CorpusPack = {
  digests: DigestHit[];
  ideology: IdeologyHit[];
  /** Serialized block for LLM prompt */
  pack: string;
  citations: string[];
};

type DigestMeta = {
  slug: string;
  ticker: string;
  name: string;
  /** Keywords that trigger this digest (matched against lowercased question) */
  keywords: string[];
  /** Relative to content/earnings */
  file: string;
};

const DIGEST_CATALOG: DigestMeta[] = [
  {
    slug: "hilton",
    ticker: "hlt",
    name: "Hilton Worldwide",
    keywords: [
      "hilton",
      "hlt",
      "nassetta",
      "undergraduate by hilton",
      "net unit growth",
      "hilton brand",
    ],
    file: "hilton/2026-Q2-digest.md",
  },
  {
    slug: "host-hotels",
    ticker: "hst",
    name: "Host Hotels & Resorts",
    keywords: [
      "host hotels",
      "host hotel",
      "hst",
      "risoleo",
      "comparable hotel revpar",
      "transformational capital",
      "four seasons orlando",
    ],
    file: "host-hotels/2026-Q2-digest.md",
  },
  {
    slug: "pebblebrook",
    ticker: "peb",
    name: "Pebblebrook Hotel Trust",
    keywords: [
      "pebblebrook",
      "peb",
      "bortz",
      "same-property",
      "same property",
      "lifestyle urban",
      "chamberlain",
      "san francisco recovery",
    ],
    file: "pebblebrook/2026-Q2-digest.md",
  },
];

/** Themes that pull all REIT/brand digests even without a named ticker. */
const THEME_TRIGGERS: RegExp[] = [
  /\breit\b/,
  /\breits\b/,
  /\bbrand(s|ed)?\b/,
  /\bfee platform\b/,
  /\bfranchise(e|or)?\b/,
  /\bearnings\b/,
  /\bguidance\b/,
  /\bpipeline\b/,
  /\bcapital return\b/,
  /\bbuyback\b/,
  /\bnet unit growth\b/,
  /\bnug\b/,
  /\blodging\b/,
  /\bhospitality capital\b/,
  /\bowner[- ]operator\b/,
  /\brevpar\b/,
];

const IDEOLOGY_TRIGGERS: RegExp[] = [
  /\btalent\b/,
  /\bstaff(ing)?\b/,
  /\bgreenlight\b/,
  /\bhuman[- ]touch\b/,
  /\bideolog/,
  /\blabor\b/,
  /\bgc\/mep\b/,
  /\bcrew\b/,
];

const MAX_DIGEST_CHARS = 4500;
const MAX_IDEOLOGY_CHARS = 2200;
const MAX_DIGESTS = 3;

function contentRoot(): string {
  // Prefer process.cwd()/content (Next + Vercel). Fallback for nested cwd.
  return path.join(process.cwd(), "content");
}

function scoreDigest(q: string, meta: DigestMeta, themeHit: boolean): number {
  let score = 0;
  for (const kw of meta.keywords) {
    if (q.includes(kw)) {
      score += kw.length >= 10 ? 6 : kw.includes(" ") ? 5 : 3;
    }
  }
  if (q.includes(meta.ticker)) score += 8;
  if (q.includes(meta.slug.replace(/-/g, " "))) score += 5;
  if (themeHit && score === 0) score += 2; // soft pull on capital themes
  if (themeHit && score > 0) score += 1;
  return score;
}

function truncateMarkdown(md: string, maxChars: number): string {
  if (md.length <= maxChars) return md;
  // Prefer cutting after a section boundary near the limit
  const slice = md.slice(0, maxChars);
  const lastBreak = Math.max(
    slice.lastIndexOf("\n## "),
    slice.lastIndexOf("\n---"),
    slice.lastIndexOf("\n\n")
  );
  const cut = lastBreak > maxChars * 0.5 ? lastBreak : maxChars;
  return (
    md.slice(0, cut).trimEnd() +
    "\n\n_[Excerpt truncated for context — cite file path for full digest.]_"
  );
}

const BUNDLED = corpusJson as Record<string, string>;

function readBundled(key: string): string | null {
  const v = BUNDLED[key];
  return typeof v === "string" && v.length > 0 ? v : null;
}

async function readDigestFile(meta: DigestMeta): Promise<string | null> {
  const bundled = readBundled(meta.file);
  if (bundled) return bundled;
  const full = path.join(contentRoot(), "earnings", meta.file);
  try {
    return await readFile(full, "utf8");
  } catch {
    console.warn("[chat-retrieve] missing digest", full);
    return null;
  }
}

/**
 * Pick relevant earnings digests for a question.
 * Triggers on Hilton / Host / Pebblebrook / REIT / brand / capital themes.
 */
export async function retrieveEarningsDigests(
  question: string
): Promise<DigestHit[]> {
  const q = question.toLowerCase().trim();
  if (!q) return [];

  const themeHit = THEME_TRIGGERS.some((re) => re.test(q));
  const forceAllReits =
    /\breit\b/.test(q) ||
    /\breits\b/.test(q) ||
    (/\bcompar(e|ison|ing)\b/.test(q) &&
      (/\bbrand\b/.test(q) || /\bearnings\b/.test(q) || /\blodging\b/.test(q)));
  // Named-issuer scores first (no theme soft-pull).
  const named = DIGEST_CATALOG.map((meta) => ({
    meta,
    score: scoreDigest(q, meta, false),
  }));
  const bestNamed = Math.max(0, ...named.map((x) => x.score));
  // Soft-pull all digests on REIT/brand themes when no issuer named, or explicit REIT ask.
  const allowThemeSoftPull = forceAllReits || (themeHit && bestNamed < 5);
  const scored = (
    allowThemeSoftPull
      ? named.map((x) => ({
          meta: x.meta,
          score: Math.max(x.score, scoreDigest(q, x.meta, true)),
        }))
      : named
  )
    .filter((x) => x.score >= (allowThemeSoftPull ? 2 : 5))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_DIGESTS);

  const hits: DigestHit[] = [];
  for (const { meta, score } of scored) {
    const raw = await readDigestFile(meta);
    if (!raw) continue;
    const periodMatch = raw.match(/\*\*Period:\*\*\s*(.+)/i);
    hits.push({
      citePath: `content/earnings/${meta.file}`,
      slug: meta.slug,
      ticker: meta.ticker.toUpperCase(),
      name: meta.name,
      period: periodMatch?.[1]?.trim() ?? "Q2 2026",
      excerpt: truncateMarkdown(raw, MAX_DIGEST_CHARS),
      score,
    });
  }
  return hits;
}

export async function retrieveIdeologyNotes(
  question: string
): Promise<IdeologyHit[]> {
  const q = question.toLowerCase().trim();
  if (!q || !IDEOLOGY_TRIGGERS.some((re) => re.test(q))) return [];

  const citePath = "content/ideology/talent-human-touch.md";
  const bundled = readBundled("ideology/talent-human-touch.md");
  let raw = bundled;
  if (!raw) {
    const full = path.join(contentRoot(), "ideology", "talent-human-touch.md");
    try {
      raw = await readFile(full, "utf8");
    } catch {
      console.warn("[chat-retrieve] missing ideology note", full);
      return [];
    }
  }
  return [
    {
      citePath,
      excerpt: truncateMarkdown(raw, MAX_IDEOLOGY_CHARS),
      score: 5,
    },
  ];
}

/** Build combined allowed-corpus pack for the LLM (digests + ideology). */
export async function retrieveAllowedCorpus(
  question: string
): Promise<CorpusPack> {
  const [digests, ideology] = await Promise.all([
    retrieveEarningsDigests(question),
    retrieveIdeologyNotes(question),
  ]);

  const citations: string[] = [];
  const chunks: string[] = [];

  if (digests.length) {
    chunks.push("### Authored earnings digests (cite by file path)");
    for (const d of digests) {
      citations.push(d.citePath);
      chunks.push(
        [
          `#### ${d.name} (${d.ticker}) — ${d.period}`,
          `Citation path: ${d.citePath}`,
          "",
          d.excerpt,
        ].join("\n")
      );
    }
  }

  if (ideology.length) {
    chunks.push("### Hal/Neo ideology notes (talent / human-touch)");
    for (const i of ideology) {
      citations.push(i.citePath);
      chunks.push(`Citation path: ${i.citePath}\n\n${i.excerpt}`);
    }
  }

  return {
    digests,
    ideology,
    pack: chunks.join("\n\n"),
    citations: [...new Set(citations)],
  };
}

/** List shipped digest paths (for tests / ops). */
export async function listShippedDigestPaths(): Promise<string[]> {
  const fromBundle = DIGEST_CATALOG.map(
    (m) => `content/earnings/${m.file}`
  ).sort();
  if (fromBundle.length) return fromBundle;
  const root = path.join(contentRoot(), "earnings");
  try {
    const dirs = await readdir(root, { withFileTypes: true });
    const out: string[] = [];
    for (const d of dirs) {
      if (!d.isDirectory() || d.name.startsWith("_")) continue;
      const files = await readdir(path.join(root, d.name));
      for (const f of files) {
        if (f.endsWith("-digest.md")) {
          out.push(`content/earnings/${d.name}/${f}`);
        }
      }
    }
    return out.sort();
  } catch {
    return [];
  }
}

/**
 * Deterministic short memo from digest Capital Headline when LLM is unavailable
 * but the question clearly names a covered issuer.
 */
export function formatDigestFallbackMemo(hits: DigestHit[]): string | null {
  if (!hits.length) return null;
  const parts = hits.map((d) => {
    const headline =
      d.excerpt.match(/## Capital headline\n\n([\s\S]*?)(?=\n## )/)?.[1]?.trim() ??
      d.excerpt.slice(0, 800);
    return [
      `**${d.name} (${d.ticker}) — authored digest excerpt**`,
      "",
      headline,
      "",
      `_Source: ${d.citePath}_`,
    ].join("\n");
  });
  return [
    ...parts,
    "",
    "_Decision support:_ digest facts are Hal/Neo authored summaries of public IR — not licensed STR. Pair with Capital Graph markets/signals before underwriting.",
  ].join("\n\n");
}
