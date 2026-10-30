/**
 * Swipe deck card builder (lib/tuesday-trends-swipe.ts): 3+ moves gate, cap at 4, sentence picking, flat omission.
 * Run: npx tsx scripts/tuesday-trends/test-swipe.ts   (pure, no DB, no network)
 */
import assert from "node:assert/strict";
import { WHAT_IT_MEANS, buildSwipeCards, clampCard, whatItMeans, swipeAskHref, type SwipeMoveCard } from "../../src/lib/tuesday-trends-swipe";
import type { TTMove } from "../../src/lib/tuesday-trends-shared";
import { ttIssue } from "../../src/lib/tuesday-trends";

let n = 0;
const t = (name: string, fn: () => void) => {
  fn();
  n++;
  console.log(`ok ${n} - ${name}`);
};

const mv = (p: Partial<TTMove>): TTMove => ({
  market: "las-vegas",
  marketName: "Las Vegas",
  slug: "las-vegas",
  horizon: "7d",
  stay: "weekend",
  pct: 76.3,
  nPairs: 46,
  prev: 163,
  now: 276,
  checkIn: "2026-11-06",
  checkOut: "2026-11-08",
  ...p,
});

t("fewer than 3 moves: no deck", () => {
  assert.equal(buildSwipeCards([], { hasWow: true }), null);
  assert.equal(buildSwipeCards([mv({}), mv({ market: "b" })], { hasWow: true }), null);
  assert.equal(buildSwipeCards(null, { hasWow: true }), null);
});

t("no week-over-week: no deck even with 3 moves", () => {
  assert.equal(buildSwipeCards([mv({}), mv({ market: "b" }), mv({ market: "c" })], { hasWow: false }), null);
});

t("3 moves: 3 move cards + closing card", () => {
  const c = buildSwipeCards([mv({}), mv({ market: "b" }), mv({ market: "c" })], { hasWow: true })!;
  assert.equal(c.length, 4);
  assert.deepEqual(c.map((x) => x.kind), ["move", "move", "move", "end"]);
  assert.equal(c[3].kind === "end" && c[3].text, "That's this week's 3 biggest moves outside holiday weeks.");
});

t("more than 4 moves: first 4 only, never padded", () => {
  const c = buildSwipeCards(["a", "b", "c", "d", "e", "f"].map((m) => mv({ market: m })), { hasWow: true })!;
  assert.equal(c.length, 5);
  assert.deepEqual(c.slice(0, 4).map((x) => (x as SwipeMoveCard).key.split("-")[0]), ["a", "b", "c", "d"]);
});

t("sentence picking: horizon x direction", () => {
  assert.equal(whatItMeans("7d", 12), WHAT_IT_MEANS.nearUp);
  assert.equal(whatItMeans("30d", -4), WHAT_IT_MEANS.nearDown);
  assert.equal(whatItMeans("91d", 3), WHAT_IT_MEANS.farUp);
  assert.equal(whatItMeans("182d", 69.9), WHAT_IT_MEANS.farUp);
  assert.equal(whatItMeans("325d", -18), WHAT_IT_MEANS.farDown);
});

t("flat or missing direction: line omitted", () => {
  assert.equal(whatItMeans("7d", 0), null);
  assert.equal(whatItMeans("7d", 0.04), null); // shows as "0%"
  assert.equal(whatItMeans("7d", -0.01), null);
  assert.equal(whatItMeans("7d", null), null);
  assert.equal(whatItMeans("7d", undefined), null);
  assert.equal(whatItMeans("7d", Number.NaN), null);
  assert.equal(whatItMeans(undefined, 5), null);
  const c = buildSwipeCards([mv({ pct: 0 }), mv({ market: "b" }), mv({ market: "c" })], { hasWow: true })!;
  assert.equal((c[0] as SwipeMoveCard).meaning, null);
  assert.equal((c[0] as SwipeMoveCard).change, "0%");
});

t("card copy: basis, change, rates, based-on, action", () => {
  const c = buildSwipeCards([mv({}), mv({ market: "b", pct: -18.2 }), mv({ market: "c" })], { hasWow: true })! as SwipeMoveCard[];
  assert.equal(c[0].basis, "1 wk out · Weekend Nov 6–8");
  assert.equal(c[0].change, "+76%");
  assert.equal(c[0].rates, "$163 → $276 a night (median)");
  assert.equal(c[0].basedOn, "Same 46 hotels, cheapest refundable, pre-tax");
  assert.equal(c[0].action.label, "Ask about this");
  assert.equal(c[0].action.href, "/chat?about=market%3Alas-vegas&via=tt-swipe");
  assert.equal(c[1].change, "−18%");
  assert.equal(swipeAskHref("bad slug!"), null);
  const bad = buildSwipeCards([mv({ slug: "bad slug!" }), mv({ market: "b" }), mv({ market: "c" })], { hasWow: true })! as SwipeMoveCard[];
  assert.deepEqual(bad[0].action, { label: "Open market", href: "/markets/bad slug!", aria: "Open Las Vegas" });
});

t("card URL value clamps to 1", () => {
  assert.equal(clampCard("3", 4), 3);
  assert.equal(clampCard("9", 4), 1);
  assert.equal(clampCard("0", 4), 1);
  assert.equal(clampCard("x", 4), 1);
  assert.equal(clampCard("2.5", 4), 1);
  assert.equal(clampCard(null, 4), 1);
});

t("committed issues: Oct 27 has a 4-card deck, Oct 20 none", () => {
  const oct27 = ttIssue("2026-10-27");
  const oct20 = ttIssue("2026-10-20");
  assert.ok(oct27 && oct20);
  const c = buildSwipeCards(oct27.moves(), { hasWow: oct27.hasWow })! as SwipeMoveCard[];
  assert.equal(c.length, 4);
  assert.deepEqual(c.slice(0, 3).map((x) => [x.market, x.change, x.meaning]), [
    ["Las Vegas", "+76%", WHAT_IT_MEANS.nearUp],
    ["Washington DC", "+70%", WHAT_IT_MEANS.farUp],
    ["Boston", "+65%", WHAT_IT_MEANS.nearUp],
  ]);
  assert.equal(buildSwipeCards(oct20.moves(), { hasWow: oct20.hasWow }), null);
});

console.log(`\n${n} passed`);
