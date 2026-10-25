/**
 * Sub-tabs for the REITs section, mirroring Markets | Tuesday Trends. A Hypotheses tab is added only
 * once hypotheses are registered and committed; until then there is no route and no tab.
 */
export function reitsTabs() {
  return [
    { key: "reits", href: "/reits", label: "REITs" },
    { key: "board", href: "/reits/board", label: "Board" },
    { key: "methodology", href: "/reits/methodology", label: "Methodology" },
  ];
}
