import { db } from "@/db";
import { sources, sourceTopics, headlines } from "@/db/schema";
import { eq, desc, max, and, or, inArray } from "drizzle-orm";

// Fixed list of all topics — used for nav (never changes based on filter)
export const ALL_TOPICS = [
  { slug: "politics", name: "Politics & Government" },
  { slug: "crime", name: "Crime & Courts" },
  { slug: "sports", name: "Sports" },
  { slug: "business", name: "Business & Economy" },
  { slug: "education", name: "Education" },
  { slug: "faith", name: "Faith & Religion" },
  { slug: "health", name: "Health & Science" },
  { slug: "military", name: "Military & Defense" },
  { slug: "culture", name: "Culture & Life" },
  { slug: "weather", name: "Weather & Environment" },
] as const;

const TOPIC_ORDER = ALL_TOPICS;

// Tier determines how many headlines to show per source
const TIER_1_TOPICS = new Set(["politics", "crime", "sports"]);
const TIER_2_TOPICS = new Set(["business", "education", "faith"]);
// Tier 3 is everything else

export { GEO_OPTIONS } from "./constants";

export type HeadlineItem = {
  id: number;
  title: string;
  url: string;
  published_at: string | null;
  fetched_at: string | null;
};

export type SourceWithHeadlines = {
  id: number;
  name: string;
  slug: string;
  url: string;
  geo: string;
  headlines: HeadlineItem[];
};

export type TopicGroup = {
  slug: string;
  name: string;
  tier: number;
  headlineLimit: number;
  sources: SourceWithHeadlines[];
};

export type TopStory = {
  id: number;
  title: string;
  url: string;
  published_at: string | null;
  fetched_at: string | null;
  source_name: string;
  source_slug: string;
};

function getTier(topic: string): number {
  if (TIER_1_TOPICS.has(topic)) return 1;
  if (TIER_2_TOPICS.has(topic)) return 2;
  return 3;
}

function getHeadlineLimit(topic: string): number {
  const tier = getTier(topic);
  if (tier === 1) return 5;
  if (tier === 2) return 4;
  return 3;
}

export async function getHeadlinesByTopic(
  geoFilter?: string
): Promise<TopicGroup[]> {
  // Fetch all active sources with headlines and topic tags
  const allSources = await db.query.sources.findMany({
    where: eq(sources.active, 1),
    with: {
      headlines: {
        orderBy: [desc(headlines.fetched_at)],
        limit: 5,
      },
      topics: true,
    },
  });

  // Apply geo filter: region = only that region's sources (no statewide mixing)
  const filteredSources = geoFilter && geoFilter !== "all"
    ? allSources.filter((s) => s.geo === geoFilter)
    : allSources;

  // Group by topic
  const topicMap = new Map<string, SourceWithHeadlines[]>();
  for (const topic of TOPIC_ORDER) {
    topicMap.set(topic.slug, []);
  }

  for (const source of filteredSources) {
    if (source.headlines.length === 0) continue;

    const sourceData: SourceWithHeadlines = {
      id: source.id,
      name: source.name,
      slug: source.slug,
      url: source.url,
      geo: source.geo,
      headlines: source.headlines.map((h) => ({
        id: h.id,
        title: h.title,
        url: h.url,
        published_at: h.published_at,
        fetched_at: h.fetched_at,
      })),
    };

    // Add source to each topic it belongs to
    const sourceTopicSlugs = source.topics.map((t) => t.topic);
    for (const topicSlug of sourceTopicSlugs) {
      const bucket = topicMap.get(topicSlug);
      if (bucket && !bucket.some((s) => s.id === source.id)) {
        bucket.push(sourceData);
      }
    }
  }

  // Sort within each topic: primary-tagged sources first
  for (const source of filteredSources) {
    for (const topic of source.topics || []) {
      const bucket = topicMap.get(topic.topic);
      if (bucket) {
        bucket.sort((a, b) => {
          const aIsPrimary = filteredSources
            .find((s) => s.id === a.id)
            ?.topics.find((t) => t.topic === topic.topic)?.is_primary;
          const bIsPrimary = filteredSources
            .find((s) => s.id === b.id)
            ?.topics.find((t) => t.topic === topic.topic)?.is_primary;
          return (bIsPrimary || 0) - (aIsPrimary || 0);
        });
      }
    }
  }

  // Return topics with content
  return TOPIC_ORDER.filter((topic) => {
    const bucket = topicMap.get(topic.slug);
    return bucket && bucket.length > 0;
  }).map((topic) => ({
    slug: topic.slug,
    name: topic.name,
    tier: getTier(topic.slug),
    headlineLimit: getHeadlineLimit(topic.slug),
    sources: topicMap.get(topic.slug)!,
  }));
}

export async function getTopStories(
  geoFilter?: string,
  limit: number = 6
): Promise<TopStory[]> {
  // Get recent headlines with source info
  const allSources = await db.query.sources.findMany({
    where: eq(sources.active, 1),
    with: {
      headlines: {
        orderBy: [desc(headlines.fetched_at)],
        limit: 1,
      },
    },
  });

  // Apply geo filter: region = only that region's sources
  const filtered = geoFilter && geoFilter !== "all"
    ? allSources.filter((s) => s.geo === geoFilter)
    : allSources;

  // Flatten to individual headlines with source info
  const allHeadlines: TopStory[] = [];
  for (const source of filtered) {
    for (const h of source.headlines) {
      allHeadlines.push({
        id: h.id,
        title: h.title,
        url: h.url,
        published_at: h.published_at,
        fetched_at: h.fetched_at,
        source_name: source.name,
        source_slug: source.slug,
      });
    }
  }

  // Sort by most recent and take top N
  allHeadlines.sort((a, b) => {
    const aTime = a.published_at || a.fetched_at || "";
    const bTime = b.published_at || b.fetched_at || "";
    return bTime.localeCompare(aTime);
  });

  return allHeadlines.slice(0, limit);
}

export async function getLastUpdatedAt(): Promise<string | null> {
  const result = await db
    .select({ latest: max(headlines.fetched_at) })
    .from(headlines);
  return result[0]?.latest ?? null;
}
