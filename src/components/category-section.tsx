import { TopicGroup } from "@/lib/queries";
import { SourceBlock } from "./source-card";

export function CategorySection({
  topic,
  alternate = false,
}: {
  topic: TopicGroup;
  alternate?: boolean;
}) {
  const bgClass = alternate ? "bg-porch-warm" : "bg-porch-cream";

  return (
    <section
      id={topic.slug}
      className={`scroll-mt-16 ${bgClass} -mx-4 px-4 sm:-mx-6 sm:px-6 py-10 sm:py-12`}
    >
      <div className="max-w-[960px] mx-auto">
        {/* Decorative section header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-porch-tan" />
          <h2 className="font-display text-lg sm:text-xl font-semibold text-warm-900 tracking-tight flex items-center gap-2">
            <span className="text-crimson-500">&loz;</span>
            {topic.name}
            <span className="text-crimson-500">&loz;</span>
          </h2>
          <div className="h-px flex-1 bg-porch-tan" />
        </div>

        {/* Sources — two column on desktop, single on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
          {topic.sources.map((source, i) => (
            <SourceBlock
              key={source.id}
              source={source}
              headlineLimit={topic.headlineLimit}
              isAnchor={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
