import { CategoryGroup } from "@/lib/queries";
import { SourceCard } from "./source-card";

export function CategorySection({ category }: { category: CategoryGroup }) {
  return (
    <section id={category.slug} className="scroll-mt-24">
      <div className="border-b-2 border-crimson pb-2 mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink tracking-tight">
          {category.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </section>
  );
}
