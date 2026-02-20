import { db } from "@/db";
import { sources, sourceTopics, headlines, dailyBriefs } from "@/db/schema";
import { eq, desc, max, and, isNotNull } from "drizzle-orm";

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
  { slug: "social", name: "Social & Community" },
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

export type DailyBriefData = {
  geo: string;
  date: string;
  summary: string;
  headline_count: number;
  generated_at: string | null;
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

  // Apply geo filter
  const filteredSources =
    geoFilter && geoFilter !== "all"
      ? allSources.filter((s) => s.geo === geoFilter)
      : allSources;

  // Build source primary topic fallback map
  const sourcePrimaryTopic = new Map<number, string>();
  for (const source of filteredSources) {
    const primary = source.topics.find((t) => t.is_primary === 1);
    if (primary) {
      sourcePrimaryTopic.set(source.id, primary.topic);
    } else if (source.topics.length > 0) {
      sourcePrimaryTopic.set(source.id, source.topics[0].topic);
    }
  }

  // Group headlines by their AI-assigned topic (or fallback to source topic)
  // Key: topic slug -> Map of source id -> { source info, headlines }
  const topicMap = new Map<
    string,
    Map<number, { source: typeof filteredSources[0]; headlines: HeadlineItem[] }>
  >();
  for (const topic of TOPIC_ORDER) {
    topicMap.set(topic.slug, new Map());
  }

  for (const source of filteredSources) {
    for (const h of source.headlines) {
      // Use the headline's AI-classified topic, or fall back to source's primary topic
      const topic = h.topic || sourcePrimaryTopic.get(source.id);
      if (!topic) continue;

      const bucket = topicMap.get(topic);
      if (!bucket) continue;

      if (!bucket.has(source.id)) {
        bucket.set(source.id, { source, headlines: [] });
      }
      bucket.get(source.id)!.headlines.push({
        id: h.id,
        title: h.title,
        url: h.url,
        published_at: h.published_at,
        fetched_at: h.fetched_at,
      });
    }
  }

  // Convert to TopicGroup format
  return TOPIC_ORDER.filter((topic) => {
    const bucket = topicMap.get(topic.slug);
    return bucket && bucket.size > 0;
  }).map((topic) => {
    const bucket = topicMap.get(topic.slug)!;
    const sourcesArr: SourceWithHeadlines[] = [];

    for (const [, entry] of bucket) {
      sourcesArr.push({
        id: entry.source.id,
        name: entry.source.name,
        slug: entry.source.slug,
        url: entry.source.url,
        geo: entry.source.geo,
        headlines: entry.headlines,
      });
    }

    // Sort: sources with primary topic tag first
    sourcesArr.sort((a, b) => {
      const aIsPrimary = filteredSources
        .find((s) => s.id === a.id)
        ?.topics.find((t) => t.topic === topic.slug)?.is_primary ?? 0;
      const bIsPrimary = filteredSources
        .find((s) => s.id === b.id)
        ?.topics.find((t) => t.topic === topic.slug)?.is_primary ?? 0;
      return bIsPrimary - aIsPrimary;
    });

    return {
      slug: topic.slug,
      name: topic.name,
      tier: getTier(topic.slug),
      headlineLimit: getHeadlineLimit(topic.slug),
      sources: sourcesArr,
    };
  });
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
  const filtered =
    geoFilter && geoFilter !== "all"
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

function getTodayCT(): string {
  const now = new Date();
  const ct = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  return ct.toISOString().split("T")[0];
}

export async function getDailyBrief(
  geo: string
): Promise<DailyBriefData | null> {
  const today = getTodayCT();
  const result = await db
    .select()
    .from(dailyBriefs)
    .where(and(eq(dailyBriefs.geo, geo), eq(dailyBriefs.date, today)))
    .limit(1);

  if (result.length === 0) return null;

  const row = result[0];
  return {
    geo: row.geo,
    date: row.date,
    summary: row.summary,
    headline_count: row.headline_count,
    generated_at: row.generated_at,
  };
}
