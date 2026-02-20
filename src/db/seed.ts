import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { sources, sourceTopics } from "./schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

const allSources = [
  // ── Statewide News (8) ────────────────────────────────────────────────
  { name: "Alabama Reflector", slug: "alabama-reflector", url: "https://alabamareflector.com", feed_url: "https://alabamareflector.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "Alabama Political Reporter", slug: "al-political-reporter", url: "https://www.alreporter.com", feed_url: "https://www.alreporter.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "Yellowhammer News", slug: "yellowhammer-news", url: "https://yellowhammernews.com", feed_url: "https://yellowhammernews.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "Alabama Daily News", slug: "al-daily-news", url: "https://aldailynews.com", feed_url: "https://aldailynews.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "This Is Alabama", slug: "this-is-alabama", url: "https://tdalabamamag.com", feed_url: "https://tdalabamamag.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "Made in Alabama", slug: "made-in-alabama", url: "https://madeinalabama.com", feed_url: "https://madeinalabama.com/feed/", feed_type: "rss", geo: "statewide" },
  { name: "1819 News", slug: "1819-news", url: "https://1819news.com", feed_url: null, feed_type: "firecrawl", geo: "statewide" },
  { name: "Reckon News", slug: "reckon-news", url: "https://www.reckon.news", feed_url: null, feed_type: "firecrawl", geo: "statewide" },

  // ── Birmingham Metro (9) ──────────────────────────────────────────────
  { name: "AL.com Birmingham", slug: "alcom-birmingham", url: "https://www.al.com/birmingham", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/birmingham/", feed_type: "rss", geo: "birmingham" },
  { name: "BhamNow", slug: "bhamnow", url: "https://bhamnow.com", feed_url: "https://bhamnow.com/feed/", feed_type: "rss", geo: "birmingham" },
  { name: "Village Living", slug: "village-living", url: "https://villagelivingonline.com", feed_url: "https://villagelivingonline.com/api/rss/content.rss", feed_type: "rss", geo: "birmingham" },
  { name: "Alabama News Center", slug: "al-news-center", url: "https://alabamanewscenter.com", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },
  { name: "Birmingham Business Journal", slug: "bham-biz-journal", url: "https://www.bizjournals.com/birmingham", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },
  { name: "WBRC FOX6", slug: "wbrc-fox6", url: "https://www.wbrc.com", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },
  { name: "WVTM 13", slug: "wvtm-13", url: "https://www.wvtm13.com", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },
  // NEW: TV stations
  { name: "ABC 33/40", slug: "abc-3340", url: "https://abc3340.com", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },
  { name: "CBS 42", slug: "cbs-42", url: "https://www.cbs42.com", feed_url: null, feed_type: "firecrawl", geo: "birmingham" },

  // ── Huntsville & North Alabama (6) ────────────────────────────────────
  { name: "AL.com Huntsville", slug: "alcom-huntsville", url: "https://www.al.com/huntsville", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/huntsville/", feed_type: "rss", geo: "huntsville" },
  { name: "Huntsville Business Journal", slug: "hsv-biz-journal", url: "https://huntsvillebusinessjournal.com", feed_url: "https://huntsvillebusinessjournal.com/feed/", feed_type: "rss", geo: "huntsville" },
  { name: "Decatur Daily", slug: "decatur-daily", url: "https://www.decaturdaily.com", feed_url: "https://www.decaturdaily.com/search/?f=rss", feed_type: "rss", geo: "huntsville" },
  { name: "WHNT News 19", slug: "whnt-19", url: "https://whnt.com", feed_url: "https://whnt.com/feed/", feed_type: "rss", geo: "huntsville" },
  { name: "WAFF 48", slug: "waff-48", url: "https://www.waff.com", feed_url: null, feed_type: "firecrawl", geo: "huntsville" },
  { name: "WAAY 31", slug: "waay-31", url: "https://www.waaytv.com", feed_url: null, feed_type: "firecrawl", geo: "huntsville" },

  // ── Cullman & Northwest Alabama (2) ───────────────────────────────────
  { name: "Cullman Times", slug: "cullman-times", url: "https://cullmantimes.com", feed_url: "https://cullmantimes.com/feed/", feed_type: "rss", geo: "cullman" },
  { name: "Cullman Tribune", slug: "cullman-tribune", url: "https://www.cullmantribune.com", feed_url: "https://www.cullmantribune.com/feed/", feed_type: "rss", geo: "cullman" },

  // ── Mobile & Gulf Coast (6) ───────────────────────────────────────────
  { name: "AL.com Mobile", slug: "alcom-mobile", url: "https://www.al.com/mobile", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/mobile/", feed_type: "rss", geo: "mobile" },
  { name: "WKRG News 5", slug: "wkrg-5", url: "https://www.wkrg.com", feed_url: "https://www.wkrg.com/feed/", feed_type: "rss", geo: "mobile" },
  { name: "Lagniappe Mobile", slug: "lagniappe", url: "https://lagniappemobile.com", feed_url: null, feed_type: "firecrawl", geo: "mobile" },
  { name: "WSFA 12", slug: "wsfa-12", url: "https://www.wsfa.com", feed_url: null, feed_type: "firecrawl", geo: "mobile" },
  // NEW: TV stations
  { name: "WPMI NBC 15", slug: "wpmi-nbc15", url: "https://mynbc15.com", feed_url: null, feed_type: "firecrawl", geo: "mobile" },
  { name: "FOX10 News Mobile", slug: "fox10-mobile", url: "https://www.fox10tv.com", feed_url: null, feed_type: "firecrawl", geo: "mobile" },

  // ── Montgomery & Central Alabama (4) ──────────────────────────────────
  { name: "AL.com Montgomery", slug: "alcom-montgomery", url: "https://www.al.com/montgomery", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/news/montgomery/", feed_type: "rss", geo: "montgomery" },
  { name: "Montgomery Advertiser", slug: "montgomery-advertiser", url: "https://www.montgomeryadvertiser.com", feed_url: null, feed_type: "firecrawl", geo: "montgomery" },
  { name: "Opelika-Auburn News", slug: "opelika-auburn-news", url: "https://oanow.com", feed_url: "https://oanow.com/search/?f=rss", feed_type: "rss", geo: "montgomery" },
  { name: "WAKA Action 8", slug: "waka-action8", url: "https://www.waka.com", feed_url: null, feed_type: "firecrawl", geo: "montgomery" },

  // ── Dothan & Wiregrass (3) ────────────────────────────────────────────
  { name: "Dothan Eagle", slug: "dothan-eagle", url: "https://dothaneagle.com", feed_url: "https://dothaneagle.com/search/?f=rss", feed_type: "rss", geo: "dothan" },
  { name: "Wiregrass Daily News", slug: "wiregrass-daily", url: "https://wiregrassdailynews.com", feed_url: "https://wiregrassdailynews.com/feed/", feed_type: "rss", geo: "dothan" },
  { name: "WTVY News 4", slug: "wtvy-news4-dothan", url: "https://www.wtvy.com", feed_url: null, feed_type: "firecrawl", geo: "dothan" },

  // ── Tuscaloosa & West Alabama (5) ─────────────────────────────────────
  { name: "Tuscaloosa News", slug: "tuscaloosa-news", url: "https://www.tuscaloosanews.com", feed_url: null, feed_type: "firecrawl", geo: "tuscaloosa" },
  { name: "TimesDaily", slug: "timesdaily", url: "https://www.timesdaily.com", feed_url: "https://www.timesdaily.com/search/?f=rss", feed_type: "rss", geo: "tuscaloosa" },
  { name: "Anniston Star", slug: "anniston-star", url: "https://www.annistonstar.com", feed_url: "https://www.annistonstar.com/search/?f=rss", feed_type: "rss", geo: "tuscaloosa" },
  // NEW: Selma + Black Belt
  { name: "Selma Times-Journal", slug: "selma-times-journal", url: "https://www.selmatimesjournal.com", feed_url: null, feed_type: "firecrawl", geo: "tuscaloosa" },
  { name: "Black Belt News Network", slug: "black-belt-news", url: "https://www.blackbeltnewsnetwork.com", feed_url: null, feed_type: "firecrawl", geo: "tuscaloosa" },

  // ── Auburn & East Alabama (4) ─────────────────────────────────────────
  { name: "Auburn Villager", slug: "auburn-villager", url: "https://auburnvillager.com", feed_url: "https://auburnvillager.com/search/?f=rss", feed_type: "rss", geo: "auburn" },
  { name: "Sand Mountain Reporter", slug: "sand-mountain-reporter", url: "https://www.sandmountainreporter.com", feed_url: "https://www.sandmountainreporter.com/search/?f=rss", feed_type: "rss", geo: "auburn" },
  { name: "Gadsden Times", slug: "gadsden-times", url: "https://www.gadsdentimes.com", feed_url: null, feed_type: "firecrawl", geo: "auburn" },
  { name: "The Chanticleer (JSU)", slug: "jsu-chanticleer", url: "https://www.jsuchanticleer.com", feed_url: null, feed_type: "firecrawl", geo: "auburn" },

  // ── Sports (4) ────────────────────────────────────────────────────────
  { name: "AL.com Bama Sports", slug: "alcom-bama-sports", url: "https://www.al.com/alabamacrimsontidesports", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/sports/alabama/", feed_type: "rss", geo: "sports" },
  { name: "AL.com Auburn Sports", slug: "alcom-auburn-sports", url: "https://www.al.com/auburntigers", feed_url: "https://www.al.com/arc/outboundfeeds/rss/category/sports/auburn/", feed_type: "rss", geo: "sports" },
  { name: "Saturday Down South", slug: "saturday-down-south", url: "https://www.saturdaydownsouth.com", feed_url: "https://www.saturdaydownsouth.com/feed/", feed_type: "rss", geo: "sports" },
  { name: "Auburn Newsroom", slug: "auburn-newsroom", url: "https://auburntigers.com", feed_url: null, feed_type: "firecrawl", geo: "sports" },

  // ── Government & Education (5) ────────────────────────────────────────
  { name: "Office of the Governor", slug: "governor-alabama", url: "https://governor.alabama.gov", feed_url: "https://governor.alabama.gov/feed/", feed_type: "rss", geo: "government" },
  { name: "Alabama Legislature", slug: "al-legislature", url: "https://www.legislature.state.al.us", feed_url: "https://www.legislature.state.al.us/rss/rss.aspx", feed_type: "rss", geo: "government" },
  { name: "UA News", slug: "ua-news", url: "https://news.ua.edu", feed_url: "https://news.ua.edu/feed/", feed_type: "rss", geo: "government" },
  // NEW: University sources
  { name: "UAB News", slug: "uab-news", url: "https://www.uab.edu/news", feed_url: null, feed_type: "firecrawl", geo: "government" },
  { name: "USA News (South Alabama)", slug: "usa-south-alabama", url: "https://www.southalabama.edu/departments/publicrelations/pressreleases/", feed_url: null, feed_type: "firecrawl", geo: "government" },

  // ── Public Radio & NPR (3) ────────────────────────────────────────────
  { name: "WBHM 90.3 Birmingham", slug: "wbhm", url: "https://wbhm.org", feed_url: "https://wbhm.org/feed/", feed_type: "rss", geo: "radio" },
  { name: "WLRH 89.3 Huntsville", slug: "wlrh", url: "https://wlrh.org", feed_url: "https://wlrh.org/feed/", feed_type: "rss", geo: "radio" },
  { name: "Alabama Public Radio", slug: "al-public-radio", url: "https://apr.org", feed_url: null, feed_type: "firecrawl", geo: "radio" },

  // ── Specialized / Business (2) ────────────────────────────────────────
  { name: "Business Alabama", slug: "business-alabama", url: "https://businessalabama.com", feed_url: null, feed_type: "firecrawl", geo: "statewide" },
  { name: "Alabama Magazine", slug: "alabama-magazine", url: "https://www.alabama-magazine.com", feed_url: null, feed_type: "firecrawl", geo: "statewide" },

  // ── Reddit — Social & Community ───────────────────────────────────────
  { name: "r/Alabama", slug: "reddit-alabama", url: "https://www.reddit.com/r/Alabama/", feed_url: "https://www.reddit.com/r/Alabama/.rss", feed_type: "rss", geo: "statewide" },
  { name: "r/Birmingham", slug: "reddit-birmingham", url: "https://www.reddit.com/r/Birmingham/", feed_url: "https://www.reddit.com/r/Birmingham/.rss", feed_type: "rss", geo: "birmingham" },
  { name: "r/HuntsvilleAlabama", slug: "reddit-huntsville", url: "https://www.reddit.com/r/HuntsvilleAlabama/", feed_url: "https://www.reddit.com/r/HuntsvilleAlabama/.rss", feed_type: "rss", geo: "huntsville" },
  { name: "r/auburn", slug: "reddit-auburn", url: "https://www.reddit.com/r/auburn/", feed_url: "https://www.reddit.com/r/auburn/.rss", feed_type: "rss", geo: "auburn" },
  { name: "r/MobileAL", slug: "reddit-mobile", url: "https://www.reddit.com/r/MobileAL/", feed_url: "https://www.reddit.com/r/MobileAL/.rss", feed_type: "rss", geo: "mobile" },
  { name: "r/tuscaloosa", slug: "reddit-tuscaloosa", url: "https://www.reddit.com/r/tuscaloosa/", feed_url: "https://www.reddit.com/r/tuscaloosa/.rss", feed_type: "rss", geo: "tuscaloosa" },
  { name: "r/Montgomery", slug: "reddit-montgomery", url: "https://www.reddit.com/r/Montgomery/", feed_url: "https://www.reddit.com/r/Montgomery/.rss", feed_type: "rss", geo: "montgomery" },

  // ── YouTube — Social & Community ──────────────────────────────────────
  { name: "AL.com (YouTube)", slug: "yt-alcom", url: "https://www.youtube.com/@aldotcom", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCAEp26oeWu9jMo5E7tNB2kQ", feed_type: "rss", geo: "statewide" },
  { name: "ABC 33/40 (YouTube)", slug: "yt-abc3340", url: "https://www.youtube.com/@abc3340", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCIul30v9pU1JxKx6jlI7wBA", feed_type: "rss", geo: "birmingham" },
  { name: "WBRC FOX6 (YouTube)", slug: "yt-wbrc", url: "https://www.youtube.com/@WBRC6NewsOnYourSide", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCBzcofRMvb-Dao4OM-NnxdQ", feed_type: "rss", geo: "birmingham" },
  { name: "WVTM 13 (YouTube)", slug: "yt-wvtm13", url: "https://www.youtube.com/@WVTM13", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC7Vw6oq2LCbzAhdxF_UcIWg", feed_type: "rss", geo: "birmingham" },
  { name: "CBS 42 (YouTube)", slug: "yt-cbs42", url: "https://www.youtube.com/@CBS42", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCeR4TlbmojlqImgr-2SBkJQ", feed_type: "rss", geo: "birmingham" },
  { name: "FOX10 News (YouTube)", slug: "yt-fox10", url: "https://www.youtube.com/@FOX10.News.", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC_B1lpgj2DH_wO8T1jJnSYA", feed_type: "rss", geo: "mobile" },
  { name: "WKRG News 5 (YouTube)", slug: "yt-wkrg", url: "https://www.youtube.com/@WKRGNews", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCFOq-dKCPu3PcmaCMEGDzTA", feed_type: "rss", geo: "mobile" },
  { name: "WAAY 31 (YouTube)", slug: "yt-waay31", url: "https://www.youtube.com/@WAAYTV", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCpQiwFjomzBHJN-TpdLZxBg", feed_type: "rss", geo: "huntsville" },
  { name: "FOX54 Huntsville (YouTube)", slug: "yt-fox54", url: "https://www.youtube.com/@WZDXNewsFOX54", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCfUU-PZ6eodene7d8hAz67A", feed_type: "rss", geo: "huntsville" },
  { name: "WHNT 19 (YouTube)", slug: "yt-whnt19", url: "https://www.youtube.com/@Whntnews19huntsville", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCV8mxYCe-Tauwd09rS9cOVg", feed_type: "rss", geo: "huntsville" },
  { name: "WAFF 48 (YouTube)", slug: "yt-waff48", url: "https://www.youtube.com/@waff48news", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UC1N4BxXSO5EFsgj0zPC5LzA", feed_type: "rss", geo: "huntsville" },
  { name: "WSFA 12 (YouTube)", slug: "yt-wsfa12", url: "https://www.youtube.com/@wsfa12", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCJGMzEs9XnBRPcXH1ZE4K-A", feed_type: "rss", geo: "montgomery" },
  { name: "WVUA 23 (YouTube)", slug: "yt-wvua23", url: "https://www.youtube.com/@wvuatv", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCPGkAvcVZXmWOjWbS5F9ZFQ", feed_type: "rss", geo: "tuscaloosa" },
  { name: "WTVY News 4 (YouTube)", slug: "yt-wtvy", url: "https://www.youtube.com/@WTVYNews4", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCzWjzGQ5nHHNYB0ozw_DfuA", feed_type: "rss", geo: "montgomery" },
  { name: "Yellowhammer News (YouTube)", slug: "yt-yellowhammer", url: "https://www.youtube.com/@YHPolitics", feed_url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCMk7T9ijCgD_iX-SWjyzy7g", feed_type: "rss", geo: "statewide" },
];

// Topic mappings: slug -> { primary: topic, secondary: topic[] }
const topicMappings: Record<string, { primary: string; secondary: string[] }> = {
  // ── Statewide ─────────────────────────────────────────────────────────
  "alabama-reflector":    { primary: "politics", secondary: ["education"] },
  "al-political-reporter": { primary: "politics", secondary: [] },
  "yellowhammer-news":    { primary: "politics", secondary: ["business", "faith"] },
  "al-daily-news":        { primary: "politics", secondary: ["business"] },
  "this-is-alabama":      { primary: "culture", secondary: ["faith"] },
  "made-in-alabama":      { primary: "business", secondary: ["culture"] },
  "1819-news":            { primary: "politics", secondary: ["faith", "culture"] },
  "reckon-news":          { primary: "politics", secondary: ["culture"] },

  // ── Birmingham ────────────────────────────────────────────────────────
  "alcom-birmingham":     { primary: "crime", secondary: ["politics", "business"] },
  "bhamnow":              { primary: "culture", secondary: ["business", "education"] },
  "village-living":       { primary: "culture", secondary: [] },
  "al-news-center":       { primary: "business", secondary: ["culture"] },
  "bham-biz-journal":     { primary: "business", secondary: [] },
  "wbrc-fox6":            { primary: "crime", secondary: ["weather", "politics"] },
  "wvtm-13":              { primary: "crime", secondary: ["weather", "sports"] },
  "abc-3340":             { primary: "crime", secondary: ["weather", "politics"] },
  "cbs-42":               { primary: "crime", secondary: ["weather"] },

  // ── Huntsville ────────────────────────────────────────────────────────
  "alcom-huntsville":     { primary: "crime", secondary: ["politics", "business"] },
  "hsv-biz-journal":      { primary: "business", secondary: ["military"] },
  "decatur-daily":        { primary: "crime", secondary: ["politics"] },
  "whnt-19":              { primary: "crime", secondary: ["weather"] },
  "waff-48":              { primary: "crime", secondary: ["weather", "military"] },
  "waay-31":              { primary: "crime", secondary: ["weather", "military"] },
  "cullman-times":        { primary: "crime", secondary: ["sports", "culture"] },
  "cullman-tribune":      { primary: "culture", secondary: ["crime", "politics"] },

  // ── Mobile ────────────────────────────────────────────────────────────
  "alcom-mobile":         { primary: "crime", secondary: ["politics", "business"] },
  "wkrg-5":               { primary: "crime", secondary: ["weather"] },
  "lagniappe":            { primary: "politics", secondary: ["culture", "business"] },
  "wsfa-12":              { primary: "crime", secondary: ["weather", "politics"] },
  "wpmi-nbc15":           { primary: "crime", secondary: ["weather"] },
  "fox10-mobile":         { primary: "crime", secondary: ["weather"] },

  // ── Montgomery ────────────────────────────────────────────────────────
  "alcom-montgomery":     { primary: "politics", secondary: ["crime"] },
  "montgomery-advertiser": { primary: "crime", secondary: ["politics"] },
  "dothan-eagle":         { primary: "crime", secondary: ["politics"] },
  "opelika-auburn-news":  { primary: "crime", secondary: ["sports", "education"] },
  "waka-action8":         { primary: "crime", secondary: ["politics", "weather"] },
  "wiregrass-daily":      { primary: "crime", secondary: ["politics", "culture"] },

  // ── Tuscaloosa ────────────────────────────────────────────────────────
  "tuscaloosa-news":      { primary: "crime", secondary: ["sports", "education"] },
  "timesdaily":           { primary: "crime", secondary: ["politics"] },
  "anniston-star":        { primary: "crime", secondary: ["politics"] },
  "selma-times-journal":  { primary: "crime", secondary: ["politics", "culture"] },
  "black-belt-news":      { primary: "culture", secondary: ["politics", "education"] },

  // ── Auburn ────────────────────────────────────────────────────────────
  "auburn-villager":      { primary: "culture", secondary: ["education", "sports"] },
  "sand-mountain-reporter": { primary: "crime", secondary: ["politics"] },
  "gadsden-times":        { primary: "crime", secondary: ["politics"] },
  "wtvy-news4-dothan":    { primary: "crime", secondary: ["weather"] },
  "jsu-chanticleer":      { primary: "education", secondary: ["sports", "culture"] },

  // ── Sports ────────────────────────────────────────────────────────────
  "alcom-bama-sports":    { primary: "sports", secondary: [] },
  "alcom-auburn-sports":  { primary: "sports", secondary: [] },
  "saturday-down-south":  { primary: "sports", secondary: [] },
  "auburn-newsroom":      { primary: "sports", secondary: ["education"] },

  // ── Government & Education ────────────────────────────────────────────
  "governor-alabama":     { primary: "politics", secondary: [] },
  "al-legislature":       { primary: "politics", secondary: [] },
  "ua-news":              { primary: "education", secondary: ["health", "military"] },
  "uab-news":             { primary: "education", secondary: ["health"] },
  "usa-south-alabama":    { primary: "education", secondary: ["health"] },

  // ── Radio ─────────────────────────────────────────────────────────────
  "wbhm":                 { primary: "politics", secondary: ["culture", "health"] },
  "wlrh":                 { primary: "culture", secondary: ["politics", "military"] },
  "al-public-radio":      { primary: "politics", secondary: ["education", "culture"] },

  // ── Specialized / Business ────────────────────────────────────────────
  "business-alabama":     { primary: "business", secondary: ["culture"] },
  "alabama-magazine":     { primary: "culture", secondary: [] },

  // ── Reddit (all primary: social) ──────────────────────────────────────
  "reddit-alabama":       { primary: "social", secondary: ["politics", "culture"] },
  "reddit-birmingham":    { primary: "social", secondary: ["culture"] },
  "reddit-huntsville":    { primary: "social", secondary: ["culture"] },
  "reddit-auburn":        { primary: "social", secondary: ["sports", "education"] },
  "reddit-mobile":        { primary: "social", secondary: ["culture"] },
  "reddit-tuscaloosa":    { primary: "social", secondary: ["sports"] },
  "reddit-montgomery":    { primary: "social", secondary: ["politics"] },

  // ── YouTube (all primary: social) ─────────────────────────────────────
  "yt-alcom":             { primary: "social", secondary: ["politics", "crime"] },
  "yt-abc3340":           { primary: "social", secondary: ["crime", "weather"] },
  "yt-wbrc":              { primary: "social", secondary: ["crime", "weather"] },
  "yt-wvtm13":            { primary: "social", secondary: ["crime", "weather"] },
  "yt-cbs42":             { primary: "social", secondary: ["crime"] },
  "yt-fox10":             { primary: "social", secondary: ["crime", "weather"] },
  "yt-wkrg":              { primary: "social", secondary: ["crime", "weather"] },
  "yt-waay31":            { primary: "social", secondary: ["crime", "weather"] },
  "yt-fox54":             { primary: "social", secondary: ["crime"] },
  "yt-whnt19":            { primary: "social", secondary: ["crime", "weather"] },
  "yt-waff48":            { primary: "social", secondary: ["crime"] },
  "yt-wsfa12":            { primary: "social", secondary: ["crime", "politics"] },
  "yt-wvua23":            { primary: "social", secondary: ["education", "sports"] },
  "yt-wtvy":              { primary: "social", secondary: ["crime", "weather"] },
  "yt-yellowhammer":      { primary: "social", secondary: ["politics"] },
};

async function seed() {
  console.log(`Seeding ${allSources.length} sources...`);

  for (const source of allSources) {
    await db.insert(sources).values(source).onConflictDoNothing();
  }

  console.log("Done seeding sources.");

  // Seed topic mappings
  console.log("Seeding topic mappings...");
  const allDbSources = await db.select().from(sources);

  for (const dbSource of allDbSources) {
    const mapping = topicMappings[dbSource.slug];
    if (!mapping) {
      console.warn(`No topic mapping for ${dbSource.slug}`);
      continue;
    }

    // Primary topic
    await db
      .insert(sourceTopics)
      .values({
        source_id: dbSource.id,
        topic: mapping.primary,
        is_primary: 1,
      })
      .onConflictDoNothing();

    // Secondary topics
    for (const topic of mapping.secondary) {
      await db
        .insert(sourceTopics)
        .values({
          source_id: dbSource.id,
          topic,
          is_primary: 0,
        })
        .onConflictDoNothing();
    }
  }

  console.log("Done seeding topic mappings.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
