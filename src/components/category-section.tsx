import { CategoryGroup } from "@/lib/queries";
import { SourceCard } from "./source-card";

export function CategorySection({ category }: { category: CategoryGroup }) {
  return (
    <section id={category.slug} className="scroll-mt-28 sm:scroll-mt-24">
      <div className="border-b-2 border-crimson pb-2 mb-4 sm:mb-6">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight">
          {category.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {category.sources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>
    </section>
  );
}
