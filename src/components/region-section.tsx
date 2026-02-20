import { TopicGroup } from "@/lib/queries";
import { SourceBlock } from "./source-card";

const REGION_LABELS: Record<string, string> = {
  birmingham: "Birmingham",
  huntsville: "Huntsville",
  mobile: "Mobile",
  montgomery: "Montgomery",
  tuscaloosa: "Tuscaloosa",
  auburn: "Auburn",
};

export function RegionSection({
  topics,
  geo,
}: {
  topics: TopicGroup[];
  geo: string;
}) {
  const regionName = REGION_LABELS[geo] || geo;

  return (
    <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-xl sm:text-2xl font-bold text-warm-900 mb-8">
        News from {regionName}
      </h1>

      {topics.map((topic) => (
        <div key={topic.slug} className="mb-10">
          {/* Topic label — just a visual grouping, not navigable */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-crimson-500 text-xs">&loz;</span>
            <h2 className="font-display text-sm font-semibold text-porch-brown uppercase tracking-wider">
              {topic.name}
            </h2>
            <div className="h-px flex-1 bg-porch-tan/40" />
          </div>

          {/* All sources for this topic, flat list */}
          {topic.sources.map((source) => (
            <SourceBlock
              key={source.id}
              source={source}
              headlineLimit={topic.headlineLimit}
            />
          ))}
        </div>
      ))}

      {topics.length === 0 && (
        <p className="text-porch-brown text-sm">
          No headlines available for {regionName} right now.
        </p>
      )}
    </div>
  );
}
