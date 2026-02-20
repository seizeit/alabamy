import {
  getHeadlinesByCategory,
  getLastUpdatedAt,
  CategoryGroup,
} from "@/lib/queries";
import Header from "@/components/header";
import { CategorySection } from "@/components/category-section";
import { LastUpdated } from "@/components/last-updated";

export const revalidate = 3600;

export default async function Home() {
  let categories: CategoryGroup[] = [];
  let lastUpdatedAt: string | null = null;

  try {
    [categories, lastUpdatedAt] = await Promise.all([
      getHeadlinesByCategory(),
      getLastUpdatedAt(),
    ]);
  } catch {
    // DB unavailable (e.g. during build without credentials)
  }

  const navCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
  }));

  return (
    <>
      <Header categories={navCategories} />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-2">
              Alabama&apos;s News, All in One Place
            </h1>
            <LastUpdated fetchedAt={lastUpdatedAt} />
          </div>

          <div className="space-y-8 sm:space-y-12">
            {categories.map((category) => (
              <CategorySection key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
