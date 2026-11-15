/**
 * Where sign-in / sign-up lands. Only Chat may ask to come back (r4: a signed-out conversation is claimed and
 * shown right after sign-in); everything else keeps the workspace, so redirect_url is never an open redirect.
 */
export function afterSignInPath(redirectUrl: string | string[] | undefined): "/chat" | "/workspace" {
  return redirectUrl === "/chat" ? "/chat" : "/workspace";
}
