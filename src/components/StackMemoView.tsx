import { Fragment, type ReactNode } from "react";

/**
 * Renders a Stack memo. A bullet with links becomes a whole-row link to its first source (stretched
 * overlay; other links sit above it). `{tag: …}` renders as a chip, `> ` lines as caution callouts,
 * and the "Holdability read" section is collapsed by default.
 */
export function StackMemoView({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  const out: ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const lines = block.split("\n");
    const first = lines[0] ?? "";
    if (first.startsWith("### Holdability read")) {
      const body = blocks[i + 1] ?? "";
      i++;
      out.push(
        <details key={i} className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2">
          <summary className="cursor-pointer text-xs font-medium text-slate-300">{first.slice(4)}</summary>
          <List lines={body.split("\n")} plain />
        </details>
      );
      continue;
    }
    if (lines.every((l) => l.startsWith("- "))) {
      out.push(<List key={i} lines={lines} />);
    } else if (first.startsWith("# ")) {
      out.push(<h1 key={i} className="text-lg font-semibold text-white">{first.slice(2)}</h1>);
    } else if (first.startsWith("## ")) {
      out.push(<h2 key={i} className="pt-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-300">{first.slice(3)}</h2>);
    } else if (first.startsWith("### ")) {
      out.push(<h3 key={i} className="text-xs font-medium text-slate-400">{first.slice(4)}</h3>);
    } else if (first.startsWith("> ")) {
      out.push(
        <div key={i} className="rounded-md border-l-2 border-amber-400/60 bg-amber-400/[0.06] px-3 py-2 text-[13px] leading-snug text-amber-100"
          dangerouslySetInnerHTML={{ __html: inline(lines.map((l) => l.replace(/^> /, "")).join(" ")) }} />
      );
    } else if (/^\d+\. /.test(first)) {
      out.push(
        <ol key={i} className="list-decimal space-y-1 pl-5 text-[13px] text-slate-300">
          {lines.map((l, j) => <li key={j} dangerouslySetInnerHTML={{ __html: inline(l.replace(/^\d+\. /, "")) }} />)}
        </ol>
      );
    } else if (first === "---") {
      out.push(<hr key={i} className="border-white/10" />);
      if (lines.length > 1) out.push(<p key={`${i}f`} className="text-[11px] text-slate-500" dangerouslySetInnerHTML={{ __html: inline(lines.slice(1).join(" ")) }} />);
    } else {
      out.push(<p key={i} className="text-[13px] leading-snug text-slate-400" dangerouslySetInnerHTML={{ __html: inline(block) }} />);
    }
  }
  return <div className="space-y-2.5">{out.map((n, k) => <Fragment key={k}>{n}</Fragment>)}</div>;
}

const LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

function List({ lines, plain = false }: { lines: string[]; plain?: boolean }) {
  return (
    <ul className="space-y-1">
      {lines
        .filter((l) => l.startsWith("- "))
        .map((l, j) => {
          const body = l.slice(2);
          const first = plain ? null : [...body.matchAll(LINK)][0];
          if (!first) {
            return (
              <li key={j} className="px-2 py-1 text-[13px] leading-snug text-slate-300"
                dangerouslySetInnerHTML={{ __html: inline(body) }} />
            );
          }
          return (
            <li key={j} data-row-link={first[2]}
              className="group relative rounded-md border border-white/[0.06] px-2 py-1.5 text-[13px] leading-snug text-slate-200 transition-colors hover:border-emerald-400/40 hover:bg-white/[0.04]">
              <a href={first[2]} target="_blank" rel="noopener noreferrer" aria-label={`Open source: ${first[1]}`}
                className="absolute inset-0 rounded-md outline-none focus-visible:ring-1 focus-visible:ring-emerald-400/60" />
              <span dangerouslySetInnerHTML={{ __html: inline(body, true) }} />
            </li>
          );
        })}
    </ul>
  );
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function inline(s: string, raised = false): string {
  const z = raised ? " relative z-10" : "";
  return esc(s)
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      `<a href='$2' target='_blank' rel='noopener noreferrer' class='text-emerald-300/90 underline-offset-2 hover:underline${z}'>$1</a>`
    )
    .replace(/\{tag: ([^}]+)\}/g, (_m, t: string) => {
      const tone = /watch|negative leverage/i.test(t)
        ? "border-rose-400/40 text-rose-200"
        : /secondary|self-reported/i.test(t)
          ? "border-amber-400/40 text-amber-200"
          : "border-white/15 text-slate-400";
      return `<span class='ml-1 inline-block rounded border px-1 py-px text-[10px] uppercase tracking-wide ${tone}'>${t}</span>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-semibold text-white'>$1</strong>")
    .replace(/(^|\s)\*(.+?)\*(?=\s|$)/g, "$1<em class='text-slate-500'>$2</em>");
}
