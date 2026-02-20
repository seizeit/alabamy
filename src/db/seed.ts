import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sources } from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

const allSources = [
  // Statewide News (8)
  { name: "Alabama Reflector", slug: "alabama-reflector", url: "https://alabamareflector.com", feed_url: "https://alabamareflector.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "Alabama Political Reporter", slug: "al-political-reporter", url: "https://www.alreporter.com", feed_url: "https://www.alreporter.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "Yellowhammer News", slug: "yellowhammer-news", url: "https://yellowhammernews.com", feed_url: "https://yellowhammernews.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "Alabama Daily News", slug: "al-daily-news", url: "https://aldailynews.com", feed_url: "https://aldailynews.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "This Is Alabama", slug: "this-is-alabama", url: "https://tdalabamamag.com", feed_url: "https://tdalabamamag.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "Made in Alabama", slug: "made-in-alabama", url: "https://madeinalabama.com", feed_url: "https://madeinalabama.com/feed/", feed_type: "rss", category: "statewide" },
  { name: "1819 News", slug: "1819-news", url: "https://1819news.com", feed_url: null, feed_type: "firecrawl", category: "statewide" },
  { name: "Reckon News", slug: "reckon-news", url: "https://www.reckon.news", feed_url: null, feed_type: "firecrawl", category: "statewide" },

  // Birmingham Metro (7)
  { name: "AL.com Birmingham", slug: "alcom-birmingham", url: "https://www.al.com/birmingham", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/birmingham/", feed_type: "rss", category: "birmingham" },
  { name: "BhamNow", slug: "bhamnow", url: "https://bhamnow.com", feed_url: "https://bhamnow.com/feed/", feed_type: "rss", category: "birmingham" },
  { name: "Village Living", slug: "village-living", url: "https://villagelivingonline.com", feed_url: "https://villagelivingonline.com/api/rss/content.rss", feed_type: "rss", category: "birmingham" },
  { name: "Alabama News Center", slug: "al-news-center", url: "https://alabamanewscenter.com", feed_url: null, feed_type: "firecrawl", category: "birmingham" },
  { name: "Birmingham Business Journal", slug: "bham-biz-journal", url: "https://www.bizjournals.com/birmingham", feed_url: null, feed_type: "firecrawl", category: "birmingham" },
  { name: "WBRC FOX6", slug: "wbrc-fox6", url: "https://www.wbrc.com", feed_url: null, feed_type: "firecrawl", category: "birmingham" },
  { name: "WVTM 13", slug: "wvtm-13", url: "https://www.wvtm13.com", feed_url: null, feed_type: "firecrawl", category: "birmingham" },

  // Huntsville & North Alabama (5)
  { name: "AL.com Huntsville", slug: "alcom-huntsville", url: "https://www.al.com/huntsville", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/huntsville/", feed_type: "rss", category: "huntsville" },
  { name: "Huntsville Business Journal", slug: "hsv-biz-journal", url: "https://huntsvillebusinessjournal.com", feed_url: "https://huntsvillebusinessjournal.com/feed/", feed_type: "rss", category: "huntsville" },
  { name: "Decatur Daily", slug: "decatur-daily", url: "https://www.decaturdaily.com", feed_url: "https://www.decaturdaily.com/search/?f=rss", feed_type: "rss", category: "huntsville" },
  { name: "WHNT News 19", slug: "whnt-19", url: "https://whnt.com", feed_url: "https://whnt.com/feed/", feed_type: "rss", category: "huntsville" },
  { name: "WAFF 48", slug: "waff-48", url: "https://www.waff.com", feed_url: null, feed_type: "firecrawl", category: "huntsville" },

  // Mobile & Gulf Coast (4)
  { name: "AL.com Mobile", slug: "alcom-mobile", url: "https://www.al.com/mobile", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/mobile/", feed_type: "rss", category: "mobile" },
  { name: "WKRG News 5", slug: "wkrg-5", url: "https://www.wkrg.com", feed_url: "https://www.wkrg.com/feed/", feed_type: "rss", category: "mobile" },
  { name: "Lagniappe Mobile", slug: "lagniappe", url: "https://lagniappemobile.com", feed_url: null, feed_type: "firecrawl", category: "mobile" },
  { name: "WSFA 12", slug: "wsfa-12", url: "https://www.wsfa.com", feed_url: null, feed_type: "firecrawl", category: "mobile" },

  // Montgomery & Central Alabama (4)
  { name: "AL.com Montgomery", slug: "alcom-montgomery", url: "https://www.al.com/montgomery", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/montgomery/", feed_type: "rss", category: "montgomery" },
  { name: "Montgomery Advertiser", slug: "montgomery-advertiser", url: "https://www.montgomeryadvertiser.com", feed_url: null, feed_type: "firecrawl", category: "montgomery" },
  { name: "Dothan Eagle", slug: "dothan-eagle", url: "https://dothaneagle.com", feed_url: "https://dothaneagle.com/search/?f=rss", feed_type: "rss", category: "montgomery" },
  { name: "Opelika-Auburn News", slug: "opelika-auburn-news", url: "https://oanow.com", feed_url: "https://oanow.com/search/?f=rss", feed_type: "rss", category: "montgomery" },

  // Tuscaloosa & West Alabama (3)
  { name: "Tuscaloosa News", slug: "tuscaloosa-news", url: "https://www.tuscaloosanews.com", feed_url: null, feed_type: "firecrawl", category: "tuscaloosa" },
  { name: "TimesDaily", slug: "timesdaily", url: "https://www.timesdaily.com", feed_url: "https://www.timesdaily.com/search/?f=rss", feed_type: "rss", category: "tuscaloosa" },
  { name: "Anniston Star", slug: "anniston-star", url: "https://www.annistonstar.com", feed_url: "https://www.annistonstar.com/search/?f=rss", feed_type: "rss", category: "tuscaloosa" },

  // Auburn & East Alabama (3)
  { name: "Auburn Villager", slug: "auburn-villager", url: "https://auburnvillager.com", feed_url: "https://auburnvillager.com/search/?f=rss", feed_type: "rss", category: "auburn" },
  { name: "Sand Mountain Reporter", slug: "sand-mountain-reporter", url: "https://www.sandmountainreporter.com", feed_url: "https://www.sandmountainreporter.com/search/?f=rss", feed_type: "rss", category: "auburn" },
  { name: "Gadsden Times", slug: "gadsden-times", url: "https://www.gadsdentimes.com", feed_url: null, feed_type: "firecrawl", category: "auburn" },

  // Sports (4 — Auburn Newsroom categorized as 'auburn' but displayed in Sports)
  { name: "AL.com Bama Sports", slug: "alcom-bama-sports", url: "https://www.al.com/alabamacrimsontidesports", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/sports/alabama/", feed_type: "rss", category: "sports" },
  { name: "AL.com Auburn Sports", slug: "alcom-auburn-sports", url: "https://www.al.com/auburntigers", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/sports/auburn/", feed_type: "rss", category: "sports" },
  { name: "Saturday Down South", slug: "saturday-down-south", url: "https://www.saturdaydownsouth.com", feed_url: "https://www.saturdaydownsouth.com/feed/", feed_type: "rss", category: "sports" },
  { name: "Auburn Newsroom", slug: "auburn-newsroom", url: "https://auburntigers.com", feed_url: null, feed_type: "firecrawl", category: "sports" },

  // Government & Education (3)
  { name: "Office of the Governor", slug: "governor-alabama", url: "https://governor.alabama.gov", feed_url: "https://governor.alabama.gov/feed/", feed_type: "rss", category: "government" },
  { name: "Alabama Legislature", slug: "al-legislature", url: "https://www.legislature.state.al.us", feed_url: "https://www.legislature.state.al.us/rss/rss.aspx", feed_type: "rss", category: "government" },
  { name: "UA News", slug: "ua-news", url: "https://news.ua.edu", feed_url: "https://news.ua.edu/feed/", feed_type: "rss", category: "government" },

  // Public Radio & NPR (3)
  { name: "WBHM 90.3 Birmingham", slug: "wbhm", url: "https://wbhm.org", feed_url: "https://wbhm.org/feed/", feed_type: "rss", category: "radio" },
  { name: "WLRH 89.3 Huntsville", slug: "wlrh", url: "https://wlrh.org", feed_url: "https://wlrh.org/feed/", feed_type: "rss", category: "radio" },
  { name: "Alabama Public Radio", slug: "al-public-radio", url: "https://apr.org", feed_url: null, feed_type: "firecrawl", category: "radio" },
];

async function seed() {
  console.log(`Seeding ${allSources.length} sources...`);

  for (const source of allSources) {
    await db.insert(sources).values(source).onConflictDoNothing();
  }

  console.log("Done seeding sources.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
