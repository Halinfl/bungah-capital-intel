"use client";

/**
 * "Swipe through this week" (mobile, optional): this issue's moves as full-screen cards. The board stays the default
 * and stays mounted underneath (inert). CSS scroll-snap only, no library. State lives in the URL (`?view=swipe&card=N`
 * on top of the board params): open = pushState, card changes = replaceState, so Back exits in one step.
 */
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TTMove } from "@/lib/tuesday-trends-shared";
import { FRESH_DAYS, ageDays, buildSwipeCards, clampCard, type SwipeCard } from "@/lib/tuesday-trends-swipe";

export type SwipeDeckProps = {
  moves: TTMove[];
  hasWow: boolean;
  /** Capture date, "2026-10-27". */
  date: string;
  /** "Tue, Oct 27, 2026" */
  capturedLabel: string;
  /** "Tue, Oct 20, 2026" */
  prevCapturedLabel: string;
  isLatest: boolean;
};

const PILL_ID = "tt-swipe-pill";
const BOARD_ID = "tt-board";

/** Survives the deck's open/close (and a round trip to Chat): where the reader was and how the deck was opened. */
const session = { openedInPage: false, scrollY: 0, toBoard: false };

function boardQuery(search: string, card: number | null): string {
  const q = new URLSearchParams(search);
  q.delete("view");
  q.delete("card");
  if (card != null) {
    q.set("view", "swipe");
    q.set("card", String(card));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

const noDate = (l: string) => l.replace(/^[A-Z][a-z]{2}, /, "").replace(/, \d{4}$/, "");

function pillName(n: number) {
  return `Swipe through this week's ${n} moves`;
}

const pillCls =
  "relative inline-flex h-8 flex-none items-center gap-1 rounded-full border border-white/45 px-3 text-sm font-medium text-white hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200 after:absolute after:-inset-x-1 after:-inset-y-1.5 after:content-[''] md:hidden";

function PillInner() {
  return (
    <>
      Swipe <span aria-hidden="true">›</span>
    </>
  );
}

/** Static pill (before hydration / no JS): a plain link to the deck at the default board view. */
export function SwipePillStatic({ count }: { count: number }) {
  return (
    <a id={PILL_ID} href="?view=swipe&card=1" aria-label={pillName(count)} className={pillCls}>
      <PillInner />
    </a>
  );
}

/** The entry pill on the H1 row (mobile only). A real link; with JS the click opens the deck in place (pushState). */
export function SwipePill({ count }: { count: number }) {
  const sp = useSearchParams();
  const href = boardQuery(sp.toString(), 1);
  return (
    <a
      id={PILL_ID}
      href={href}
      aria-label={pillName(count)}
      className={pillCls}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        session.openedInPage = true;
        session.scrollY = window.scrollY;
        session.toBoard = false;
        // State must be null so Next keeps useSearchParams in sync (same as the board filters).
        window.history.pushState(null, "", `${window.location.pathname}${boardQuery(window.location.search, 1)}`);
      }}
    >
      <PillInner />
    </a>
  );
}

function reducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads `view`/`card` from the URL and shows the deck; drops `view=swipe` silently when this issue has no deck. */
export function SwipeDeckUrl(props: SwipeDeckProps) {
  const sp = useSearchParams();
  const fresh = props.isLatest && ageDays(props.date) <= FRESH_DAYS;
  const cards = useMemo(() => buildSwipeCards(props.moves, { hasWow: props.hasWow, fresh: props.isLatest ? fresh : false }), [props.moves, props.hasWow, props.isLatest, fresh]);
  const wantOpen = sp.get("view") === "swipe";
  const open = wantOpen && !!cards;
  const cardParam = sp.get("card");

  useEffect(() => {
    if (wantOpen && !cards) window.history.replaceState(null, "", `${window.location.pathname}${boardQuery(window.location.search, null)}`);
  }, [wantOpen, cards]);

  // Closing (Close, Esc, Back or "Open the full board"): put the reader back where they were, focus on the pill.
  const wasOpen = useRef(false);
  useLayoutEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    const toBoard = session.toBoard;
    session.toBoard = false;
    session.openedInPage = false;
    const board = document.getElementById(BOARD_ID);
    const pill = document.getElementById(PILL_ID);
    const restore = () => {
      if (toBoard && board) {
        board.scrollIntoView({ block: "start", behavior: "auto" });
        board.focus({ preventScroll: true });
        return;
      }
      window.scrollTo({ top: session.scrollY, behavior: "auto" });
      const pillVisible = pill && pill.getClientRects().length > 0;
      (pillVisible ? pill : board)?.focus({ preventScroll: true });
    };
    restore();
    // Next may adjust scroll after a history step; settle once more on the next frames.
    requestAnimationFrame(() => requestAnimationFrame(restore));
  }, [open]);

  if (!open || !cards) return null;
  const kicker = !props.isLatest
    ? `Past issue · ${noDate(props.capturedLabel)}`
    : fresh
      ? `Tuesday Trends · ${noDate(props.capturedLabel)}`
      : `Latest · ${props.capturedLabel.replace(/, \d{4}$/, "")}`;
  const basis = `Google Hotels, ${props.capturedLabel.replace(/, \d{4}$/, "")} vs ${noDate(props.prevCapturedLabel)}`;
  return <Deck cards={cards} start={clampCard(cardParam, cards.length)} kicker={kicker} basis={basis} />;
}

function Deck({ cards, start, kicker, basis }: { cards: SwipeCard[]; start: number; kicker: string; basis: string }) {
  const total = cards.length;
  const [idx, setIdx] = useState(start - 1);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const headRefs = useRef<(HTMLElement | null)[]>([]);
  const idxRef = useRef(idx);
  idxRef.current = idx;
  /** While a button/key scroll is running, the observer doesn't overwrite the target card. */
  const targetRef = useRef<number | null>(null);

  // Portal host + page lock: the board stays mounted but inert; <html> overflow hidden keeps scrollY.
  useLayoutEffect(() => {
    if (!session.openedInPage) session.scrollY = window.scrollY;
    const el = document.createElement("div");
    el.setAttribute("data-tt-swipe", "");
    document.body.appendChild(el);
    const siblings = [...document.body.children].filter((c) => c !== el && !c.hasAttribute("inert")) as HTMLElement[];
    siblings.forEach((c) => c.setAttribute("inert", ""));
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    setHost(el);
    return () => {
      siblings.forEach((c) => c.removeAttribute("inert"));
      html.style.overflow = prevOverflow;
      el.remove();
    };
  }, []);

  const scrollToCard = useCallback((i: number, smooth: boolean) => {
    const track = trackRef.current;
    const card = cardRefs.current[i];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
  }, []);

  // Open: jump (no animation) to the starting card, focus its heading.
  useLayoutEffect(() => {
    if (!host) return;
    scrollToCard(idxRef.current, false);
    headRefs.current[idxRef.current]?.focus({ preventScroll: true });
  }, [host, scrollToCard]);

  // Which card is in view (swipes included).
  useEffect(() => {
    const track = trackRef.current;
    if (!host || !track) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || e.intersectionRatio < 0.6) continue;
          const i = cardRefs.current.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          if (targetRef.current != null && i !== targetRef.current) continue;
          if (targetRef.current === i) targetRef.current = null;
          setIdx(i);
        }
      },
      { root: track, threshold: [0.6] },
    );
    cardRefs.current.forEach((c) => c && io.observe(c));
    // A finger on the track cancels any pending button target.
    const release = () => (targetRef.current = null);
    track.addEventListener("pointerdown", release, { passive: true });
    track.addEventListener("touchstart", release, { passive: true });
    return () => {
      io.disconnect();
      track.removeEventListener("pointerdown", release);
      track.removeEventListener("touchstart", release);
    };
  }, [host]);

  // Rotation / resize: re-snap to the current card.
  useEffect(() => {
    if (!host) return;
    const onResize = () => scrollToCard(idxRef.current, false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [host, scrollToCard]);

  // Card changes: replaceState (no Back steps). Keep focus inside the dialog if its element just went inert/hidden.
  useEffect(() => {
    const url = `${window.location.pathname}${boardQuery(window.location.search, idx + 1)}`;
    if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", url);
    const a = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const lost = !a || a === document.body || !dialog.contains(a) || !!a.closest("[inert]") || a.getClientRects().length === 0 || getComputedStyle(a).visibility === "hidden";
    if (lost) headRefs.current[idx]?.focus({ preventScroll: true });
  }, [idx]);

  const go = useCallback(
    (i: number) => {
      const n = Math.max(0, Math.min(total - 1, i));
      targetRef.current = n;
      setIdx(n);
      scrollToCard(n, true);
    },
    [total, scrollToCard],
  );

  const close = useCallback((toBoard = false) => {
    session.toBoard = toBoard;
    if (session.openedInPage) window.history.back();
    else window.history.replaceState(null, "", `${window.location.pathname}${boardQuery(window.location.search, null)}`);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(idxRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(idxRef.current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0);
    } else if (e.key === "End") {
      e.preventDefault();
      go(total - 1);
    } else if (e.key === "Tab") {
      // Focus trap: cycle through the dialog's focusable, non-inert, visible elements.
      const dialog = dialogRef.current;
      if (!dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]')].filter(
        (x) => !x.closest("[inert]") && x.getClientRects().length > 0 && getComputedStyle(x).visibility !== "hidden",
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const a = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (a === first || !items.includes(a as HTMLElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (a === last || !items.includes(a as HTMLElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!host) return null;
  const cur = cards[idx];
  const navBtn =
    "inline-flex h-11 w-11 flex-none items-center justify-center rounded-lg border border-white/20 text-lg text-white hover:border-white/40 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200";
  const actionCls =
    "inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-lg border border-white/45 px-4 text-center text-[15px] font-medium text-white hover:border-white/60 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200";
  const textLink =
    "inline-flex min-h-11 items-center text-[13px] text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex bg-[#2f333c] md:items-center md:justify-center md:bg-black/70">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`This week's moves, ${kicker}`}
        onKeyDown={onKeyDown}
        className="flex h-full w-full flex-col bg-[#2f333c] pt-[env(safe-area-inset-top)] text-slate-100 md:h-[min(760px,calc(100dvh-48px))] md:w-[420px] md:rounded-xl md:border md:border-white/15 md:pt-0 md:shadow-2xl"
      >
        {/* Top bar: Close, kicker, counter; one 3px segment per card. */}
        <div className="flex flex-none items-center gap-2 px-2 pt-1">
          <button type="button" onClick={() => close()} aria-label="Back to board" className={`${navBtn} border-transparent`}>
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
          <p className="min-w-0 flex-1 truncate text-[12px] uppercase tracking-[0.02em] text-slate-300">{kicker}</p>
          <p className="flex-none pr-2 text-[13px] tabular-nums text-slate-200" aria-live="polite" aria-atomic="true">
            {idx + 1} of {total}
          </p>
        </div>
        <div className="flex flex-none gap-1 px-4 pb-2 pt-1" aria-hidden="true">
          {cards.map((c, i) => (
            <span
              key={c.key}
              className={`h-[3px] flex-1 rounded-full transition-colors motion-reduce:transition-none ${i <= idx ? "bg-slate-200" : "bg-white/20"}`}
            />
          ))}
        </div>

        {/* Track: native horizontal scroll-snap, one full-width card per stop. */}
        <div
          ref={trackRef}
          className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((c, i) => (
            <section
              key={c.key}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              inert={i !== idx}
              role="group"
              aria-roledescription="card"
              aria-label={`${i + 1} of ${total}`}
              className="h-full w-full flex-none snap-center snap-always overflow-y-auto px-5 pb-4 pt-3"
            >
              {c.kind === "move" ? (
                <div className="flex min-h-full flex-col">
                  <h2
                    ref={(el) => {
                      headRefs.current[i] = el;
                    }}
                    tabIndex={-1}
                    className="text-[18px] font-semibold leading-snug text-white outline-none [overflow-wrap:anywhere] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                  >
                    {c.market}
                  </h2>
                  <p className="mt-0.5 text-[12px] tabular-nums text-slate-300">{c.basis}</p>
                  <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="sr-only">{c.aria}</span>
                    <span aria-hidden="true" className="text-[32px] font-semibold leading-none tabular-nums text-slate-100">
                      {c.change}
                    </span>
                    <span aria-hidden="true" className="text-[13px] tabular-nums text-slate-300">
                      · {c.rates}
                    </span>
                  </p>
                  {c.meaning ? <p className="mt-4 text-[15px] leading-snug text-slate-200">{c.meaning}</p> : null}
                  <div className="mt-auto pt-6">
                    <p className="text-[12px] leading-relaxed text-slate-300">
                      {c.basedOn} · {basis}
                    </p>
                    <Link href="/tuesday-trends/methodology" className={textLink}>
                      Methodology
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-full flex-col">
                  <h2
                    ref={(el) => {
                      headRefs.current[i] = el;
                    }}
                    tabIndex={-1}
                    className="text-[18px] font-semibold leading-snug text-white outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200"
                  >
                    {c.text}
                  </h2>
                  <Link href="/tuesday-trends/archive" className={`${textLink} mt-3 text-[15px]`}>
                    Past issues
                  </Link>
                  <p className="mt-auto pt-6 text-[12px] text-slate-300">Decision support, not a quote.</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Bottom bar in the thumb zone: [‹] [one action] [›]; ends hide the arrow but keep its space. */}
        <div className="flex flex-none items-center gap-2 border-t border-white/10 px-3 pt-2 pb-[max(10px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => go(idx - 1)}
            aria-label="Previous card"
            className={`${navBtn} ${idx === 0 ? "invisible" : ""}`}
          >
            <span aria-hidden="true">‹</span>
          </button>
          {cur.kind === "move" ? (
            <Link href={cur.action.href} aria-label={cur.action.aria} className={actionCls}>
              {cur.action.label}
            </Link>
          ) : (
            <button type="button" onClick={() => close(true)} className={actionCls}>
              Open the full board
            </button>
          )}
          <button
            type="button"
            onClick={() => go(idx + 1)}
            aria-label="Next card"
            className={`${navBtn} ${idx === total - 1 ? "invisible" : ""}`}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
    </div>,
    host,
  );
}
