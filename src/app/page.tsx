import { Suspense } from "react";
import {
  getHeadlinesByTopic,
  getTopStories,
  getLastUpdatedAt,
  TopicGroup,
  TopStory,
} from "@/lib/queries";
import Header from "@/components/header";
import { TopStories } from "@/components/top-stories";
import { CategorySection } from "@/components/category-section";

export const revalidate = 3600;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;
  const activeGeo = geo || "all";

  let topics: TopicGroup[] = [];
  let topStories: TopStory[] = [];
  let lastUpdatedAt: string | null = null;

  try {
    [topics, topStories, lastUpdatedAt] = await Promise.all([
      getHeadlinesByTopic(activeGeo),
      getTopStories(activeGeo, 5),
      getLastUpdatedAt(),
    ]);
  } catch {
    // DB unavailable during build
  }

  const navCategories = topics.map((t) => ({
    name: t.name,
    slug: t.slug,
  }));

  return (
    <>
      <Header
        categories={navCategories}
        activeGeo={activeGeo}
      />
      <main>
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <Suspense>
            <TopStories stories={topStories} />
          </Suspense>
        </div>

        {topics.map((topic, i) => (
          <CategorySection
            key={topic.slug}
            topic={topic}
            alternate={i % 2 === 1}
          />
        ))}
      </main>
    </>
  );
}
