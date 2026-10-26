"use client";

import { useEffect } from "react";

/**
 * The scorecard renders two layouts (desktop matrix, mobile cards). Mobile cards carry the real ids;
 * desktop rows carry data-anchor. On load and on hash change, scroll to whichever target is visible.
 * Targets carry a scroll-margin-top equal to the sticky header height, so they land below it.
 */
export function AnchorScroll() {
  useEffect(() => {
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const els = [
        document.getElementById(id),
        ...Array.from(document.querySelectorAll<HTMLElement>(`[data-anchor="${CSS.escape(id)}"]`)),
      ].filter((e): e is HTMLElement => !!e && e.offsetParent !== null);
      els[0]?.scrollIntoView({ block: "start" });
    };
    go();
    window.addEventListener("hashchange", go);
    return () => window.removeEventListener("hashchange", go);
  }, []);
  return null;
}
