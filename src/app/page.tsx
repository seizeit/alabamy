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
import { LastUpdated } from "@/components/last-updated";

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
      getTopStories(activeGeo, 6),
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
      <Header categories={navCategories} activeGeo={activeGeo} />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-warm-950 tracking-tight mb-1">
              Alabama&apos;s News, All in One Place
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-warm-600">
                Headlines from 44 sources across the state
              </p>
              <LastUpdated fetchedAt={lastUpdatedAt} />
            </div>
          </div>

          {/* Zone 1: Top Stories */}
          <Suspense>
            <TopStories stories={topStories} />
          </Suspense>

          {/* Zone 2: Topic Sections */}
          <div className="space-y-10 sm:space-y-12">
            {topics.map((topic) => (
              <CategorySection key={topic.slug} topic={topic} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
