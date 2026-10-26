"use client";

/** Last-resort boundary (root layout itself failed). Must render its own <html>/<body>; inline styles only. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", background: "#2f333c", color: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "96px 24px", textAlign: "center" }} data-testid="global-error">
          <p style={{ fontSize: 14, color: "#cbd5e1" }}>Bungah Capital Intel</p>
          <h1 style={{ fontSize: 28, margin: "8px 0 12px" }}>We&apos;ll be right back</h1>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            The site is having a temporary problem. Please try again in a few minutes.
          </p>
          <p style={{ marginTop: 24 }}>
            <button onClick={() => reset()} style={{ padding: "8px 16px", borderRadius: 8, border: 0, cursor: "pointer" }}>
              Try again
            </button>{" "}
            {/* Full reload on purpose: the app shell itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ color: "#f1f5f9", marginLeft: 12 }}>Home</a>
          </p>
          {error.digest ? <p style={{ fontSize: 12, color: "#94a3b8" }}>Reference: {error.digest}</p> : null}
        </main>
      </body>
    </html>
  );
}
