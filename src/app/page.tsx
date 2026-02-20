import { Suspense } from "react";
import {
  getHeadlinesByTopic,
  getTopStories,
  getLastUpdatedAt,
  ALL_TOPICS,
  TopicGroup,
  TopStory,
} from "@/lib/queries";
import Header from "@/components/header";
import { TopStories } from "@/components/top-stories";
import { CategorySection } from "@/components/category-section";
import { RegionSection } from "@/components/region-section";

export const revalidate = 3600;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ geo?: string }>;
}) {
  const { geo } = await searchParams;
  const activeGeo = geo || "all";
  const isStatewide = activeGeo === "all";

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

  // Count total headlines
  const headlineCount = topics.reduce(
    (sum, t) => sum + t.sources.reduce((s, src) => s + src.headlines.length, 0),
    0
  );

  const sourceCount = new Set(
    topics.flatMap((t) => t.sources.map((s) => s.id))
  ).size;

  return (
    <>
      <Header
        categories={ALL_TOPICS}
        activeGeo={activeGeo}
        headlineCount={headlineCount}
        sourceCount={sourceCount}
      />
      <main>
        {isStatewide ? (
          /* STATEWIDE: Top Stories + Topic Sections with nav anchors */
          <>
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
          </>
        ) : (
          /* REGION: One flat scrollable page, all content, no nav */
          <RegionSection topics={topics} geo={activeGeo} />
        )}
      </main>
    </>
  );
}
