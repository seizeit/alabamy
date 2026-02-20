import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { sources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchRssFeeds } from "@/lib/fetchers/rss-fetcher";
import { fetchFirecrawlFeeds } from "@/lib/fetchers/firecrawl-fetcher";
import { pruneHeadlines } from "@/lib/fetchers/pruner";
import { classifyHeadlines } from "@/lib/ai/classifier";
import { generateDailyBriefs } from "@/lib/ai/summarizer";

export const dynamic = "force-dynamic";
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

    // Classify headlines with AI (non-fatal)
    let classifyResult = { classified: 0, failed: 0 };
    try {
      classifyResult = await classifyHeadlines();
    } catch (err) {
      console.error("AI classification error (non-fatal):", err);
    }

    // Generate daily briefs with AI (non-fatal)
    let briefResult = { generated: 0, skipped: 0 };
    try {
      briefResult = await generateDailyBriefs();
    } catch (err) {
      console.error("AI brief generation error (non-fatal):", err);
    }

    // Prune old headlines
    const pruneResult = await pruneHeadlines();

    // Revalidate homepage
    revalidatePath("/");

    return NextResponse.json({
      ok: true,
      rss: rssResult,
      firecrawl: firecrawlResult,
      classified: classifyResult,
      summaries: briefResult,
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
