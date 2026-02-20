import { SourceWithHeadlines } from "@/lib/queries";
import { HeadlineItem } from "./headline-item";

export function SourceCard({ source }: { source: SourceWithHeadlines }) {
  return (
    <div className="bg-white rounded-lg border border-card-border p-4 sm:p-5 hover:shadow-md transition-shadow">
      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-crimson mb-3">
        {source.name}
      </h3>
      <ul className="space-y-2">
        {source.headlines.map((headline) => (
          <HeadlineItem key={headline.id} headline={headline} />
        ))}
      </ul>
    </div>
  );
}
