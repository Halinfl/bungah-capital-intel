/**
 * Cookie-stub auth retired — Clerk is live.
 * Prefer @/lib/workspace-profile for plan/org chrome and @clerk/nextjs for identity.
 * This file remains only so accidental imports fail loudly at typecheck time...
 * Re-export types during migration; do not use cookie session helpers.
 */
export type { Plan, Role, WorkspaceProfile as Session } from "./workspace-profile";
export {
  SEATS_MAX,
  getWorkspaceProfile as getSession,
  requireLoginRedirect as requireSessionRedirect,
} from "./workspace-profile";
