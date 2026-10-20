// Order: hotel-capital conversations first. The Erik Cason episode stays on the page (title unchanged)
// but is never the first card or above the fold (Hal, 2026-10-20).
const episodes = [
  {
    title: "CIO of Host Hotels, Nate Tyrrell, on Creating Value in the Hotel Industry",
    guest: "Nate Tyrrell · CIO, Host Hotels & Resorts",
    why: "Capital-allocation tape on buy / sell discipline, transformational CapEx, scarcity, and EBITDA per key as an owner north star.",
    links: [
      ["Spotify", "https://open.spotify.com/episode/5RsxMUcpde0XXdRihOJr9T"],
      ["YouTube", "https://www.youtube.com/watch?v=RU2gliRaghI"],
      [
        "Apple",
        "https://podcasts.apple.com/us/podcast/not-done-with-sloan-dean/id1834186585",
      ],
    ],
  },
  {
    title:
      "Head of Travel Research at Morgan Stanley on How the K-Shaped Economy Is Reshaping Hospitality Investment Opportunities",
    guest: "Stephen Grambling, CFA · Morgan Stanley",
    why: "A street-research lens on hotel stocks, REIT undervaluation, brand proliferation, and K-shaped demand for public-market comps.",
    links: [
      [
        "Apple",
        "https://podcasts.apple.com/us/podcast/not-done-with-sloan-dean/id1834186585",
      ],
      ["Spotify", "https://open.spotify.com/show/2imKO2ZH6mRFOX0ZsMuLJO"],
    ],
  },
  {
    title: "To buy or not to buy? CEO of Hunter Advisors weighs in",
    guest: "Teague Hunter · President & CEO, Hunter Advisors",
    why: "A transaction and debt-maturity frame for deploy versus wait — including deferred CapEx, catalysts for sales, and where buyers are looking.",
    links: [
      [
        "Apple",
        "https://podcasts.apple.com/us/podcast/not-done-with-sloan-dean/id1834186585",
      ],
    ],
  },
  {
    title:
      "F**k the State: Bitcoin, Open-Source AI, and Ending the Pedo-Cabal | Erik Cason",
    guest: "Erik Cason · THE Bitcoin Podcast with Walker",
    why: "Sound-money ideology for capital allocators — Crypto Sovereignty, open-source AI that stays yours, and why Bitcoin is political with a capital P. Natural shelf-mate for Sound Asset Lodging.",
    links: [
      ["Spotify", "https://open.spotify.com/episode/4Jcjv7KJ3iGT4rkWGBuq4R"],
      ["YouTube", "https://www.youtube.com/watch?v=9C1gBr40Hh0"],
      ["Fountain", "https://fountain.fm/episode/u4FB6afx6ZwNcCrIWHjO"],
      [
        "Apple",
        "https://podcasts.apple.com/us/podcast/the-bitcoin-podcast/id1694392423",
      ],
    ],
  },
] as const;

type Episode = (typeof episodes)[number];

function renderEpisode(episode: Episode) {
  return (
            <article
              key={episode.title}
              className="flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full border border-sky-400/20 bg-sky-400/[0.06] px-2 py-1 text-xs font-medium uppercase tracking-[0.12em] text-sky-200">
                  External
                </span>
                <span className="text-xs text-slate-400">Not Bungah</span>
              </div>
              <h3 className="mt-4 text-base font-medium leading-snug text-white">{episode.title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-300">{episode.guest}</p>
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <p className="text-sm font-medium text-slate-400">
                  Why listen
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{episode.why}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                {episode.links.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-300 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white/50"
                  >
                    Listen on {label}
                  </a>
                ))}
              </div>
              <p className="mt-auto border-t border-white/[0.06] pt-4 text-xs leading-relaxed text-slate-400">
                External · Not produced by Bungah Capital Intel
              </p>
            </article>
  );
}

const hotelEpisodes = episodes.filter((e) => !e.title.includes("Erik Cason"));
const moreEpisodes = episodes.filter((e) => e.title.includes("Erik Cason"));

export default function PodcastPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-slate-400">
          Listening
        </p>
        <h1 className="mt-2 t-h1">Podcast</h1>
        <p className="mt-3 t-lead">
          Conversations with people who move hospitality capital — not influencer travel chat.
          Listening shelf for operator and capital voices we respect — clearly marked external until Bungah records its own.
        </p>
      </header>

      <section aria-labelledby="worth-hearing" className="space-y-5">
        <div className="max-w-2xl">
          <h2
            id="worth-hearing"
            className="t-h2"
          >
            Worth hearing in the space
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">
            External conversations on hotel capital, ownership, and sound money — not Bungah episodes. We link
            them because they speak the language of deploy, hold, and underwrite.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {hotelEpisodes.map((episode) => renderEpisode(episode))}
        </div>
      </section>

      {/* Sound-money conversation sits below the hotel-capital shelf, never first or above the fold. */}
      {moreEpisodes.length ? (
        <section aria-labelledby="more-sound-money" className="space-y-5 pt-6">
          <h2 id="more-sound-money" className="t-h2">
            More on sound money
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {moreEpisodes.map((episode) => renderEpisode(episode))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
