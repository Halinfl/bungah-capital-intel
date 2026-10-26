import { SHOW_DRAFTS } from "@/lib/sound-assets";

/** Marks page copy as a draft awaiting the author's edit. Renders only while publish-status drafts is true. */
export function DraftNote({ children = "Draft copy for Hal to edit." }: { children?: React.ReactNode }) {
  if (!SHOW_DRAFTS) return null;
  return (
    <p className="inline-flex items-center gap-2 rounded-md border border-dashed border-white/25 px-2 py-1 text-xs text-slate-300">
      <span className="font-semibold uppercase tracking-wider text-slate-200">Draft</span>
      <span>{children}</span>
    </p>
  );
}
