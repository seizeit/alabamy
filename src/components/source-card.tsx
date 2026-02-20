import { SourceWithHeadlines } from "@/lib/queries";
import { HeadlineItem } from "./headline-item";

export function SourceCard({
  source,
  headlineLimit = 5,
}: {
  source: SourceWithHeadlines;
  headlineLimit?: number;
}) {
  const visibleHeadlines = source.headlines.slice(0, headlineLimit);

  return (
    <div className="bg-white rounded-xl border border-warm-300 p-4 sm:p-5 hover:shadow-md transition-shadow">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-crimson-500 mb-3">
        {source.name}
      </h3>
      <ul className="space-y-2.5">
        {visibleHeadlines.map((headline) => (
          <HeadlineItem key={headline.id} headline={headline} />
        ))}
      </ul>
    </div>
  );
}
