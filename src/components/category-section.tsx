import { TopicGroup } from "@/lib/queries";
import { SourceCard } from "./source-card";

export function CategorySection({ topic }: { topic: TopicGroup }) {
  return (
    <section id={topic.slug} className="scroll-mt-36">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-crimson-500 rounded-full" />
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-warm-950 tracking-tight">
          {topic.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {topic.sources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            headlineLimit={topic.headlineLimit}
          />
        ))}
      </div>
    </section>
  );
}
