import { SourceWithHeadlines } from "@/lib/queries";
import { HeadlineItem } from "./headline-item";

export function SourceBlock({
  source,
  headlineLimit = 5,
  isAnchor = false,
}: {
  source: SourceWithHeadlines;
  headlineLimit?: number;
  isAnchor?: boolean;
}) {
  const visibleHeadlines = source.headlines.slice(0, headlineLimit);

  return (
    <div className={`py-5 border-b border-dashed border-porch-tan last:border-b-0 ${isAnchor ? "md:col-span-2" : ""}`}>
      {isAnchor && (
        <div className="border-l-4 border-crimson-500 pl-4 mb-1">
          <h3 className="text-sm font-sans font-bold uppercase tracking-wider text-crimson-500">
            {source.name}
          </h3>
        </div>
      )}
      {!isAnchor && (
        <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-porch-brown mb-2">
          {source.name}
        </h3>
      )}
      <ul className={`space-y-2 ${isAnchor ? "pl-4 border-l-4 border-crimson-500 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 space-y-0" : ""}`}>
        {visibleHeadlines.map((headline) => (
          <HeadlineItem
            key={headline.id}
            headline={headline}
            large={isAnchor}
          />
        ))}
      </ul>
    </div>
  );
}
