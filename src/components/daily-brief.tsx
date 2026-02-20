import { DailyBriefData } from "@/lib/queries";

export function DailyBrief({ brief }: { brief: DailyBriefData | null }) {
  if (!brief) return null;

  const paragraphs = brief.summary
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  return (
    <section className="mb-12 pb-12 border-b border-dashed border-gray-200">
      <h2 className="font-display text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">
        Today&apos;s Briefing
      </h2>
      <div className="max-w-[720px]">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-serif text-[17px] leading-relaxed text-gray-800 mb-4 last:mb-0"
          >
            {p.trim()}
          </p>
        ))}
        <p className="text-xs text-gray-400 mt-4">
          Based on {brief.headline_count} headlines
        </p>
      </div>
    </section>
  );
}
