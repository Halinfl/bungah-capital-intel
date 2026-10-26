import { src } from "@/lib/sound-assets";

/** Neutral evidence link (same treatment for every asset and every direction). */
export function SourceLink({ id, short = false }: { id: string; short?: boolean }) {
  const s = src(id);
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${s.title} (${s.publisher}), accessed ${s.accessed}`}
      className="relative z-10 text-slate-200 underline decoration-white/30 underline-offset-2 hover:text-white hover:decoration-white"
    >
      {short ? s.publisher : s.title} ↗
    </a>
  );
}
