# Alabamy — Project Status & Documentation

**Last updated:** February 20, 2026
**Live site:** https://alabamy.com
**Repository:** https://github.com/seizeit/alabamy
**Hosting:** Vercel (auto-deploys on push to main)

---

## What Is Alabamy?

Alabamy is a news aggregator for the state of Alabama. It pulls headlines from 83 sources — traditional news outlets, TV stations, Reddit communities, and YouTube channels — and displays them organized by topic category with geographic filtering. Think Alltop or Drudge Report, but for Alabama.

**Tagline:** "Boundless."
**Contact:** mike@alabamy.com | 205-687-TALK

---

## Current Source Count: 83

### By Type
| Type | Count | Method |
|------|-------|--------|
| RSS feeds | 55 | Standard RSS parser, batched 10 at a time |
| Firecrawl scrapes | 28 | Mendable Firecrawl SDK, sequential processing |

### By Category
| Region/Category | Sources |
|-----------------|---------|
| Statewide | 10 (Alabama Reflector, AL Political Reporter, Yellowhammer News, AL Daily News, This Is Alabama, Made in Alabama, 1819 News, Reckon News, Business Alabama, Alabama Magazine) |
| Birmingham | 9 (AL.com Birmingham, BhamNow, Village Living, Alabama News Center, Birmingham Business Journal, WBRC FOX6, WVTM 13, ABC 33/40, CBS 42) |
| Huntsville | 6 (AL.com Huntsville, Huntsville Business Journal, Decatur Daily, WHNT 19, WAFF 48, WAAY 31) |
| Mobile | 6 (AL.com Mobile, WKRG 5, Lagniappe, WSFA 12, WPMI NBC 15, FOX10 Mobile) |
| Montgomery | 4 (AL.com Montgomery, Montgomery Advertiser, Opelika-Auburn News, WAKA Action 8) |
| Tuscaloosa | 5 (Tuscaloosa News, TimesDaily, Anniston Star, Selma Times-Journal, Black Belt News Network) |
| Auburn | 4 (Auburn Villager, Sand Mountain Reporter, Gadsden Times, JSU Chanticleer) |
| Cullman | 2 (Cullman Times, Cullman Tribune) |
| Dothan | 3 (Dothan Eagle, Wiregrass Daily News, WTVY News 4) |
| Sports | 4 (AL.com Bama Sports, AL.com Auburn Sports, Saturday Down South, Auburn Newsroom) |
| Government & Education | 5 (Office of the Governor, AL Legislature, UA News, UAB News, USA South Alabama) |
| Public Radio | 3 (WBHM 90.3, WLRH 89.3, Alabama Public Radio) |
| Reddit | 7 (r/Alabama, r/Birmingham, r/HuntsvilleAlabama, r/auburn, r/MobileAL, r/tuscaloosa, r/Montgomery) |
| YouTube | 15 (AL.com, ABC 33/40, WBRC FOX6, WVTM 13, CBS 42, FOX10, WKRG 5, WAAY 31, FOX54, WHNT 19, WAFF 48, WSFA 12, WVUA 23, WTVY 4, Yellowhammer News) |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.9.3 |
| React | React | 19.2.4 |
| Database | Turso (libSQL) | Remote, hosted on AWS us-east-1 |
| ORM | Drizzle ORM | 0.45.1 |
| RSS Parsing | rss-parser | 3.13.0 |
| Web Scraping | Firecrawl (@mendable/firecrawl-js) | 4.13.0 |
| Styling | Tailwind CSS v4 | 4.2.0 |
| Fonts | Inter (UI), Outfit (display), Lora (editorial) | Google Fonts via next/font |
| Hosting | Vercel | Free tier |
| Cron | Vercel Cron | Daily at 11:00 UTC (6 AM CT) |

---

## Architecture

### How Data Flows

```
Vercel Cron (daily 6 AM CT)
  |
  v
/api/cron/fetch-feeds (Bearer auth via CRON_SECRET)
  |
  |--> RSS Fetcher: 55 feeds, batched 10 at a time via Promise.allSettled
  |--> Firecrawl Fetcher: 28 sites, sequential (rate limit), extracts links from markdown
  |--> Pruner: keeps max 20 headlines per source, deletes older
  |--> revalidatePath("/") to bust ISR cache
  |
  v
Homepage (server component, ISR revalidate=3600)
  |
  |--> getHeadlinesByTopic(geoFilter) — groups sources by topic, tiered headline counts
  |--> getTopStories(geoFilter, 5) — most recent headline per source, sorted by time
  |
  v
Rendered HTML (static for 1 hour, then regenerated on next request)
```

### Database Schema

**3 tables:**

1. **sources** — 83 rows
   - `id`, `name`, `slug` (unique), `url`, `feed_url` (nullable for Firecrawl), `feed_type` ("rss" | "firecrawl"), `geo` (region slug), `active`, `last_fetched_at`, `created_at`

2. **source_topics** — many-to-many join
   - `source_id`, `topic` (slug), `is_primary` (1 = primary topic, 0 = secondary)
   - Each source has 1 primary topic and 0-3 secondary topics
   - Sources appear in every topic section they're tagged for

3. **headlines** — the actual news items
   - `source_id`, `title`, `url` (unique for dedup), `published_at`, `fetched_at`
   - Max 20 per source after pruning

### Topic Categories (11)

| Slug | Display Name | Nav Short Name | Tier | Headlines/Source |
|------|-------------|----------------|------|-----------------|
| politics | Politics & Government | Politics | 1 | 5 |
| crime | Crime & Courts | Crime | 1 | 5 |
| sports | Sports | Sports | 1 | 5 |
| business | Business & Economy | Business | 2 | 4 |
| education | Education | Education | 2 | 4 |
| faith | Faith & Religion | Faith | 2 | 4 |
| health | Health & Science | Health | 3 | 3 |
| military | Military & Defense | Military | 3 | 3 |
| culture | Culture & Life | Culture | 3 | 3 |
| weather | Weather & Environment | Weather | 3 | 3 |
| social | Social & Community | Social | 3 | 3 |

### Geographic Regions (9 + Statewide)

Statewide, Birmingham, Huntsville, Mobile, Montgomery, Tuscaloosa, Auburn, Cullman, Dothan

When a user selects a region from the dropdown, only sources tagged with that region's `geo` value are shown. The topic nav tabs and content both change to reflect that region's coverage. "Statewide" is the default and shows all sources.

### File Structure

```
src/
  app/
    layout.tsx              -- Root: fonts, metadata, favicons, Footer
    page.tsx                -- Homepage: server component, ISR, geo filter
    globals.css             -- Tailwind v4 @theme, color palette, fonts
    api/cron/fetch-feeds/
      route.ts              -- Cron endpoint: RSS -> Firecrawl -> Prune -> Revalidate
  components/
    header.tsx              -- Logo bar + sticky nav (dropdown + topic tabs)
    category-nav.tsx        -- Topic tabs with IntersectionObserver active highlighting
    geo-filter.tsx          -- Region dropdown (client component, URL-based navigation)
    category-section.tsx    -- Topic section with decorative header, 2-col source grid
    source-card.tsx         -- Source block with headline list (anchor sources get special treatment)
    headline-item.tsx       -- Individual headline link with relative timestamp
    top-stories.tsx         -- Lead story strip at top of page
    footer.tsx              -- Dark footer with icon, tagline, contact info
    last-updated.tsx        -- Timestamp badge (exists but not currently rendered)
    region-section.tsx      -- Flat region view (exists but not currently used)
    smart-nav.tsx           -- Hide-on-scroll nav (exists but removed from header)
  db/
    index.ts                -- Turso client + Drizzle instance
    schema.ts               -- Table definitions + relations
    seed.ts                 -- All 83 sources + topic mappings
  lib/
    constants.ts            -- GEO_OPTIONS (shared between server and client)
    queries.ts              -- ALL_TOPICS, getHeadlinesByTopic, getTopStories, getLastUpdatedAt
    fetchers/
      rss-fetcher.ts        -- Batch RSS parsing (10 at a time)
      firecrawl-fetcher.ts  -- Sequential Firecrawl scraping with link extraction
      pruner.ts             -- Keep max 20 headlines per source
public/
  alabamy-wordmark.png      -- White wordmark for dark header
  alabamy-icon.png          -- Icon/logo mark
  apple-touch-icon.png      -- iOS home screen icon
  favicon-32x32.png         -- Browser tab favicon
  favicon-16x16.png         -- Small favicon
  robots.txt
  sitemap.xml
```

---

## Build History

The project was built using the **Ralph Loop** technique — an iterative AI build methodology where the same prompt is fed to Claude Code repeatedly, and it builds one task per iteration, commits, then the loop restarts.

### Phase 1: Initial Build (Ralph Loop, ~25 iterations)
- Scaffolded Next.js 16 project with TypeScript and Tailwind v4
- Created database schema, seed script, all 44 original sources
- Built RSS fetcher (batch), Firecrawl fetcher (sequential), pruner
- Created cron endpoint with Bearer auth
- Built all frontend components: header, nav, category sections, source cards, headlines, footer
- Added SEO basics (robots.txt, sitemap.xml, OG tags)
- Deployed to Vercel with daily cron

### Phase 2: Redesign Attempt — "The Porch"
- Ran 5 AI research agents in parallel:
  - **UX Research Agent** — user behavior patterns for news aggregators
  - **Design System Agent** — comprehensive design token system
  - **Prototype Directions Agent** — 3 complete design directions (The Porch won)
  - **New Sources Agent** — identified 32+ additional sources
  - **Reddit/YouTube Agent** — identified 8 subreddits + 15 YouTube channels
- Migrated from single `category` field to many-to-many `sourceTopics` join table
- Added 10 topic categories with tiered headline density
- Implemented geo-based filtering via URL params
- Changed color palette from generic to warm Porch tones (later shifted browns to black)
- Multiple iterations on navigation (6+ attempts to get right):
  - Geo dropdown on left, topic tabs on right
  - Both change together when region selected
  - Tabs wrap on mobile with smaller text
  - IntersectionObserver highlights active section on scroll
  - Sticky nav stays visible at all times

### Phase 3: Source Expansion
- Added 39 new sources (44 -> 83 total)
- 15 new traditional sources (TV stations, regional papers, university outlets, niche publications)
- 7 Reddit subreddits with RSS feeds mapped to regions
- 15 YouTube channel RSS feeds mapped to regions
- New "Social & Community" topic category
- Added Cullman and Dothan as standalone regions
- Triggered cron to populate all new source headlines

### Phase 4: Polish
- Replaced all brown color tones with black/dark neutral
- Fixed mobile horizontal overflow (removed negative margins on category sections)
- Updated metadata to reflect 80+ sources

---

## What Works

- 83 sources being fetched daily at 6 AM CT
- RSS feeds (including Reddit and YouTube) processed in batches
- Firecrawl scraping for 28 sites without RSS
- Headline deduplication via unique URL constraint
- Automatic pruning (max 20 headlines per source)
- ISR caching (1 hour) with manual revalidation after cron
- Geographic filtering (9 regions + statewide)
- 11 topic categories with tiered headline density
- IntersectionObserver-based nav highlighting
- Mobile responsive layout
- Proper favicons and Apple touch icon
- Auto-deploy to Vercel on push to main

---

## What Needs Work

### Design (Priority: High)

The current design is functional but needs a complete overhaul. The user's own assessment: **"IT STILL SUCKS AND WE WILL HAVE TO REDO IT ALL."**

Specific issues:
- **Generic/boring appearance** — looks like a default template, not a distinctive Alabama publication
- **No visual identity** — the "Front Porch" concept from the design agents was never fully realized
- **Typography needs refinement** — Lora/Outfit/Inter are loaded but not used with enough intention
- **Color palette is flat** — shifted from warm brown to plain black; needs a more considered palette
- **Category sections are repetitive** — every section looks the same, no visual hierarchy between important vs. secondary topics
- **Source cards lack personality** — just lists of links with no visual distinction
- **Top Stories section is underwhelming** — lead story doesn't command enough attention
- **No imagery anywhere** — pure text makes for a dense, uninviting experience
- **Mobile experience is cramped** — works but doesn't feel designed for mobile

**What the design agents recommended but was NOT implemented:**
- Dark warm hero with atmospheric presence
- Generous whitespace and breathing room
- Decorative typographic ornaments and dividers with more character
- Alternating section backgrounds with stronger contrast
- Source hierarchy with clear anchor/featured sources getting dramatically different treatment
- Editorial magazine-style layout (think Garden & Gun, Southern Living)
- Warm, inviting "sitting on the porch reading the paper" feeling

**The 3 agent research outputs should be re-read and faithfully implemented next time:**
1. **Prototype Directions Agent** — "The Porch" full component specs
2. **UX Research Agent** — user behavior patterns and navigation best practices
3. **Design System Agent** — complete token system with spacing, typography scale, colors

### Content / Sources

- **7 failed RSS feeds** from last cron run — need investigation (likely broken/changed feed URLs)
- **Tuscaloosa News** — behind paywall/block, Firecrawl may not be extracting well
- **Podcast sources** — identified by agents but not yet added (Capitol Journal, Alabama Politics This Week, etc.)
- **Food/lifestyle sources** — Eating Alabama (Instagram-only, no RSS), Alabama Foodie Magazine
- **Firecrawl credit usage** — 28 scrapes/day = ~840/month, free tier is 3,000/cycle. Monitor usage.
- **Reddit feeds** — Reddit RSS may have rate limiting or bot detection. Monitor for failures.
- **YouTube feeds** — only returns video titles, which may not be useful as "news headlines"

### Technical

- **`region-section.tsx`** and **`smart-nav.tsx`** — dead code, never rendered. Should be removed.
- **`relativeTime()` duplicated** — exists in both `headline-item.tsx` and `top-stories.tsx`. Should be extracted to a shared util.
- **No error boundaries** — if DB is down, page renders empty with no user-facing message
- **No loading states** — Suspense boundary exists but no fallback UI
- **No analytics** — no tracking of user behavior, popular sections, or region usage
- **No search** — users can't search across headlines
- **SEO** — sitemap.xml is static with just the homepage; should include category anchors

---

## Ideas for Taking This Further with AI

### 1. AI-Powered Headline Summarization
Use Claude or another LLM to generate brief summaries of each topic section. Instead of just listing headlines, provide a 2-3 sentence "briefing" at the top of each category: *"Birmingham crime saw a spike this week with three major incidents reported by AL.com and WBRC. Business news was dominated by a new downtown development project."*

### 2. AI-Generated Daily Digest
Generate a daily email or on-site "morning briefing" that synthesizes the top stories across all sources into a readable narrative. Like the Skimm or Morning Brew, but for Alabama. Could use Claude to read all headlines and write a 500-word digest.

### 3. AI Topic Detection & Auto-Categorization
Instead of manually mapping sources to topics in the seed file, use AI to read each headline and classify it into the appropriate topic(s). This would:
- Catch stories that cross categories (a crime story with political implications)
- Handle new sources without manual topic mapping
- Improve accuracy over static mappings

### 4. AI-Powered Deduplication / Story Clustering
Multiple sources often cover the same story. Use embedding-based similarity to cluster headlines about the same event, then present them as a single story with multiple source links: *"Governor signs education bill (covered by: Alabama Reflector, AL.com, Yellowhammer News)"*

### 5. Sentiment & Bias Analysis
Run headlines through a sentiment classifier to tag stories as positive/negative/neutral. Show a "mood of Alabama" dashboard or bias indicators per source. Could also detect partisan framing differences between sources covering the same story.

### 6. AI-Curated "Top Stories" Selection
Instead of just picking the most recent headline from each source, use AI to evaluate newsworthiness, recency, and diversity to select the actual top stories that matter most to Alabama readers.

### 7. Personalized Feeds
Let users create accounts and select their regions/topics of interest. Use AI to learn their reading patterns and surface stories they're most likely to care about. "Because you read Birmingham crime stories, here's a related development in Tuscaloosa..."

### 8. AI-Assisted Source Discovery
Periodically run an AI agent to search for new Alabama news sources, verify their feeds work, and suggest additions. Keep the source list growing automatically.

### 9. Breaking News Detection
Monitor feed frequency — if a source that normally publishes 5 stories/day suddenly publishes 15 in an hour, flag it as breaking news. Use AI to synthesize the breaking story from multiple rapid-fire headlines.

### 10. Voice / Audio Briefing
Generate a daily audio briefing using text-to-speech, reading the top 10 headlines with AI-written transitions. Publish as a podcast or integrate with Alexa/Google Home.

### 11. AI-Powered Q&A
Add a chat interface: "What's happening in Birmingham today?" or "What did the governor do this week?" — answered by searching recent headlines and generating a natural language response.

### 12. Social Media Auto-Posting
Use AI to select the most interesting headlines daily and auto-generate Twitter/X and Facebook posts for an @AlabamyNews account, driving traffic back to the site.

### 13. Newsletter Generation
Weekly AI-generated newsletter that picks the biggest stories by region, writes editorial transitions, and sends via email. Different editions for different regions.

### 14. Competitive Intelligence for Local Journalists
Track which stories are getting covered by which outlets. Alert when a story is only being covered by one source (exclusive/underreported). Useful for newsrooms as a monitoring tool.

### 15. Historical Trend Analysis
Over time, analyze what topics dominate Alabama news. Create monthly/quarterly reports: "Crime coverage up 15% in Mobile region" or "Education stories peaked during legislative session."

---

## Environment Variables

Set in Vercel project settings and `.env.local` for local dev:

| Variable | Purpose |
|----------|---------|
| `TURSO_DATABASE_URL` | Turso database connection string |
| `TURSO_AUTH_TOKEN` | Turso auth JWT |
| `FIRECRAWL_API_KEY` | Mendable Firecrawl API key |
| `CRON_SECRET` | Bearer token for authenticating cron endpoint |

---

## Common Commands

```bash
# Local development
npm run dev                     # Start dev server at localhost:3000
npm run build                   # Production build (verify no errors)

# Database
npx drizzle-kit push            # Push schema changes to Turso
# To run seed (needs env vars):
source <(grep -v '^#' .env.local | sed 's/^/export /') && npx tsx src/db/seed.ts

# Trigger cron manually
curl -H "Authorization: Bearer $CRON_SECRET" "https://www.alabamy.com/api/cron/fetch-feeds"

# Git (IMPORTANT: email must be mike@the.day for this repo)
git config user.email           # Verify before committing
git config user.email "mike@the.day"  # Fix if wrong
```

---

## Cost Profile

| Service | Usage | Cost |
|---------|-------|------|
| Vercel | 1 cron job, ~1K page views/day (estimate) | Free tier |
| Turso | ~1 MB storage, low read volume | Free tier (9 GB limit) |
| Firecrawl | 28 scrapes/day = ~840/month | Free tier (3,000/cycle) |
| Domain | alabamy.com | Registered separately |
| Total | | ~$0/month on free tiers |
