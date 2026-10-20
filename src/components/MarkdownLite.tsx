/** Minimal markdown-ish renderer for chat / artifacts (no external deps). */
export function MarkdownLite({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-200">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines[0]?.startsWith("| ") && lines.some((l) => l.includes("---"))) {
          return <Table key={i} lines={lines} />;
        }
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("  "))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-slate-300">
              {lines
                .filter((l) => l.startsWith("- "))
                .map((l, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: inline(l.slice(2)) }} />
                ))}
            </ul>
          );
        }
        if (lines[0]?.startsWith("### ")) {
          return (
            <h3 key={i} className="text-base font-semibold text-white">
              {lines[0].slice(4)}
            </h3>
          );
        }
        if (lines[0]?.startsWith("## ")) {
          return (
            <h2 key={i} className="text-lg font-semibold text-white">
              {lines[0].slice(3)}
            </h2>
          );
        }
        if (lines[0]?.startsWith("# ")) {
          return (
            <h1 key={i} className="text-xl font-semibold text-white">
              {lines[0].slice(2)}
            </h1>
          );
        }
        return (
          <p
            key={i}
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: inline(block) }}
          />
        );
      })}
    </div>
  );
}

function inline(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(
      /\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g,
      "<a href='$2' class='text-slate-100 underline underline-offset-2 hover:text-white'>$1</a>"
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
    .replace(/_(.+?)_/g, "<em class='text-slate-300'>$1</em>");
}

function Table({ lines }: { lines: string[] }) {
  const rows = lines.filter((l) => l.startsWith("|"));
  const body = rows.filter((l) => !l.includes("---"));
  if (!body.length) return null;
  const header = body[0];
  const rest = body.slice(1);
  const cells = (row: string) =>
    row
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-left text-xs">
        <thead className="bg-white/5 text-slate-300">
          <tr>
            {cells(header).map((c, i) => (
              <th key={i} className="px-3 py-2 font-medium" dangerouslySetInnerHTML={{ __html: inline(c) }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {rest.map((row, i) => (
            <tr key={i} className="border-t border-white/5 text-slate-200">
              {cells(row).map((c, j) => (
                <td key={j} className="px-3 py-2 tabular-nums" dangerouslySetInnerHTML={{ __html: inline(c) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
