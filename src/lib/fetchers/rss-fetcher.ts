import Parser from "rss-parser";
import { db } from "@/db";
import { sources, headlines } from "@/db/schema";
import { eq } from "drizzle-orm";

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "Alabamy/1.0 (https://alabamy.com)",
  },
});

type RssSource = typeof sources.$inferSelect;

async function fetchSingleFeed(source: RssSource): Promise<number> {
  if (!source.feed_url) return 0;

  const feed = await parser.parseURL(source.feed_url);
  let inserted = 0;

  for (const item of feed.items) {
    if (!item.title || !item.link) continue;

    const result = await db
      .insert(headlines)
      .values({
        source_id: source.id,
        title: item.title.trim(),
        url: item.link.trim(),
        published_at: item.isoDate ?? item.pubDate ?? null,
      })
      .onConflictDoNothing({ target: headlines.url })
      .returning({ id: headlines.id });

    if (result.length > 0) inserted++;
  }

  await db
    .update(sources)
    .set({ last_fetched_at: new Date().toISOString() })
    .where(eq(sources.id, source.id));

  return inserted;
}

export async function fetchRssFeeds(
  rssSources: RssSource[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Batch 10 at a time
  for (let i = 0; i < rssSources.length; i += 10) {
    const batch = rssSources.slice(i, i + 10);
    const results = await Promise.allSettled(
      batch.map((source) => fetchSingleFeed(source))
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        success++;
      } else {
        failed++;
        console.error("RSS fetch failed:", result.reason);
      }
    }
  }

  return { success, failed };
}
