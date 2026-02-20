import { db } from "@/db";
import { sources, headlines } from "@/db/schema";
import { eq, desc, max } from "drizzle-orm";

const CATEGORY_ORDER = [
  { slug: "statewide", name: "Statewide News" },
  { slug: "birmingham", name: "Birmingham Metro" },
  { slug: "huntsville", name: "Huntsville & North Alabama" },
  { slug: "mobile", name: "Mobile & Gulf Coast" },
  { slug: "montgomery", name: "Montgomery & Central Alabama" },
  { slug: "tuscaloosa", name: "Tuscaloosa & West Alabama" },
  { slug: "auburn", name: "Auburn & East Alabama" },
  { slug: "sports", name: "Sports" },
  { slug: "government", name: "Government & Education" },
  { slug: "radio", name: "Public Radio & NPR" },
] as const;

// Auburn Newsroom (slug "auburn-newsroom") is stored with category "auburn"
// but should display in the Sports section
const SPORTS_OVERRIDE_SLUGS = ["auburn-newsroom"];

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
  headlines: HeadlineItem[];
};

export type CategoryGroup = {
  slug: string;
  name: string;
  sources: SourceWithHeadlines[];
};

export async function getHeadlinesByCategory(): Promise<CategoryGroup[]> {
  // Fetch all active sources with their headlines (up to 5 per source, most recent first)
  const allSources = await db.query.sources.findMany({
    where: eq(sources.active, 1),
    with: {
      headlines: {
        orderBy: [desc(headlines.fetched_at)],
        limit: 5,
      },
    },
  });

  // Group sources by category, respecting display order
  const grouped = new Map<string, SourceWithHeadlines[]>();
  for (const cat of CATEGORY_ORDER) {
    grouped.set(cat.slug, []);
  }

  for (const source of allSources) {
    // Skip sources with no headlines
    if (source.headlines.length === 0) continue;

    // Determine display category
    let displayCategory = source.category;
    if (SPORTS_OVERRIDE_SLUGS.includes(source.slug)) {
      displayCategory = "sports";
    }

    const bucket = grouped.get(displayCategory);
    if (bucket) {
      bucket.push({
        id: source.id,
        name: source.name,
        slug: source.slug,
        url: source.url,
        headlines: source.headlines.map((h) => ({
          id: h.id,
          title: h.title,
          url: h.url,
          published_at: h.published_at,
          fetched_at: h.fetched_at,
        })),
      });
    }
  }

  // Return only categories that have at least one source with headlines
  return CATEGORY_ORDER.filter((cat) => {
    const bucket = grouped.get(cat.slug);
    return bucket && bucket.length > 0;
  }).map((cat) => ({
    slug: cat.slug,
    name: cat.name,
    sources: grouped.get(cat.slug)!,
  }));
}

export async function getLastUpdatedAt(): Promise<string | null> {
  const result = await db
    .select({ latest: max(headlines.fetched_at) })
    .from(headlines);
  return result[0]?.latest ?? null;
}
