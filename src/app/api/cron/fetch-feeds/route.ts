import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { sources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchRssFeeds } from "@/lib/fetchers/rss-fetcher";
import { fetchFirecrawlFeeds } from "@/lib/fetchers/firecrawl-fetcher";
import { pruneHeadlines } from "@/lib/fetchers/pruner";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Verify CRON_SECRET Bearer auth
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active sources
    const allSources = await db
      .select()
      .from(sources)
      .where(eq(sources.active, 1));

    const rssSources = allSources.filter((s) => s.feed_type === "rss");
    const firecrawlSources = allSources.filter(
      (s) => s.feed_type === "firecrawl"
    );

    // Fetch RSS feeds
    const rssResult = await fetchRssFeeds(rssSources);

    // Fetch Firecrawl feeds
    const firecrawlResult = await fetchFirecrawlFeeds(firecrawlSources);

    // Prune old headlines
    const pruneResult = await pruneHeadlines();

    // Revalidate homepage
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      rss: rssResult,
      firecrawl: firecrawlResult,
      pruned: pruneResult.deletedCount,
      sourceCounts: {
        rss: rssSources.length,
        firecrawl: firecrawlSources.length,
        total: allSources.length,
      },
    });
  } catch (error) {
    console.error("Cron fetch-feeds error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
