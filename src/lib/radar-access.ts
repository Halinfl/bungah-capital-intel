/** Who may POST /api/radars/run (writes findings). Server-only allowlist; deny by default. */
export function canRunRadars(userId: string): boolean {
  const allowed = (process.env.RADARS_RUN_USER_IDS ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  return allowed.includes(userId);
}
