import FirecrawlApp from "@mendable/firecrawl-js";
import { db } from "@/db";
import { sources, headlines } from "@/db/schema";
import { eq } from "drizzle-orm";

type FirecrawlSource = typeof sources.$inferSelect;

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY ?? "",
});

// Common nav/footer link patterns to filter out
const SKIP_PATTERNS = [
  /^(home|about|contact|privacy|terms|subscribe|sign in|log in|menu|search|close|skip|back to top)$/i,
  /^(facebook|twitter|instagram|youtube|linkedin|tiktok|x)$/i,
  /^(cookie|advertis|careers|faq|help|sitemap|rss)/i,
  /^\s*$/,
  /^[<>←→↑↓►▶▼▲•·|—–-]+$/,
  /^(next|prev|previous|more|read more|see all|view all|load more|show more)$/i,
];

// Links pointing to these paths are likely nav, not headlines
const SKIP_URL_PATTERNS = [
  /\/(about|contact|privacy|terms|subscribe|login|signup|careers|advertis|faq|help)\b/i,
  /\/(facebook|twitter|instagram|youtube)\.com/i,
  /#$/,
  /^mailto:/i,
  /^tel:/i,
  /^javascript:/i,
];

function isHeadlineLink(text: string, url: string): boolean {
  // Too short to be a headline
  if (text.length < 15) return false;
  // Too long to be a headline
  if (text.length > 300) return false;

  for (const pattern of SKIP_PATTERNS) {
    if (pattern.test(text)) return false;
  }
  for (const pattern of SKIP_URL_PATTERNS) {
    if (pattern.test(url)) return false;
  }

  return true;
}

function extractHeadlines(
  markdown: string,
  sourceUrl: string
): { title: string; url: string }[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const seen = new Set<string>();
  const results: { title: string; url: string }[] = [];

  let match;
  while ((match = linkRegex.exec(markdown)) !== null) {
    const text = match[1].trim();
    let url = match[2].trim();

    // Resolve relative URLs
    if (url.startsWith("/")) {
      try {
        const base = new URL(sourceUrl);
        url = `${base.origin}${url}`;
      } catch {
        continue;
      }
    }

    // Skip non-http links
    if (!url.startsWith("http")) continue;

    // Deduplicate by URL
    if (seen.has(url)) continue;
    seen.add(url);

    if (isHeadlineLink(text, url)) {
      results.push({ title: text, url });
    }
  }

  return results;
}

async function fetchSingleFirecrawl(source: FirecrawlSource): Promise<number> {
  const response = await firecrawl.scrape(source.url, {
    formats: ["markdown"],
  });

  if (!response.markdown) {
    throw new Error(`Firecrawl failed for ${source.slug}: no markdown returned`);
  }

  const extracted = extractHeadlines(response.markdown, source.url);
  let inserted = 0;

  for (const item of extracted) {
    const result = await db
      .insert(headlines)
      .values({
        source_id: source.id,
        title: item.title,
        url: item.url,
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

export async function fetchFirecrawlFeeds(
  firecrawlSources: FirecrawlSource[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  // Sequential processing to respect API rate limits
  for (const source of firecrawlSources) {
    try {
      await fetchSingleFirecrawl(source);
      success++;
    } catch (error) {
      failed++;
      console.error(`Firecrawl fetch failed for ${source.slug}:`, error);
    }
  }

  return { success, failed };
}
