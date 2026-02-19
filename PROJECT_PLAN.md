# PROJECT_PLAN.md — Alabamy News Aggregator

## Overview

Alabamy is an Alltop-style news aggregator for the state of Alabama. It pulls headlines from 44 news sources (30 RSS + 14 Firecrawl) and displays them grouped by 10 regional/topical categories. Built with Next.js, Turso, and deployed on Vercel.

**Domain**: alabamy.com
**Tagline**: "Boundless."
**Contact**: mike@alabamy.com | 205-687-TALK

---

## Source Registry (44 sources)

### 1. Statewide News (8 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 1 | Alabama Reflector | `alabama-reflector` | `https://alabamareflector.com` | `https://alabamareflector.com/feed/` | rss | statewide |
| 2 | Alabama Political Reporter | `al-political-reporter` | `https://www.alreporter.com` | `https://www.alreporter.com/feed/` | rss | statewide |
| 3 | Yellowhammer News | `yellowhammer-news` | `https://yellowhammernews.com` | `https://yellowhammernews.com/feed/` | rss | statewide |
| 4 | Alabama Daily News | `al-daily-news` | `https://aldailynews.com` | `https://aldailynews.com/feed/` | rss | statewide |
| 5 | This Is Alabama | `this-is-alabama` | `https://tdalabamamag.com` | `https://tdalabamamag.com/feed/` | rss | statewide |
| 6 | Made in Alabama | `made-in-alabama` | `https://madeinalabama.com` | `https://madeinalabama.com/feed/` | rss | statewide |
| 7 | 1819 News | `1819-news` | `https://1819news.com` | — | firecrawl | statewide |
| 8 | Reckon News | `reckon-news` | `https://www.reckon.news` | — | firecrawl | statewide |

### 2. Birmingham Metro (7 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 9 | AL.com Birmingham | `alcom-birmingham` | `https://www.al.com/birmingham` | `https://www.al.com/arc/outboundfeeds/rss/category/news/birmingham/` | rss | birmingham |
| 10 | BhamNow | `bhamnow` | `https://bhamnow.com` | `https://bhamnow.com/feed/` | rss | birmingham |
| 11 | Village Living | `village-living` | `https://villagelivingonline.com` | `https://villagelivingonline.com/api/rss/content.rss` | rss | birmingham |
| 12 | Alabama News Center | `al-news-center` | `https://alabamanewscenter.com` | — | firecrawl | birmingham |
| 13 | Birmingham Business Journal | `bham-biz-journal` | `https://www.bizjournals.com/birmingham` | — | firecrawl | birmingham |
| 14 | WBRC FOX6 | `wbrc-fox6` | `https://www.wbrc.com` | — | firecrawl | birmingham |
| 15 | WVTM 13 | `wvtm-13` | `https://www.wvtm13.com` | — | firecrawl | birmingham |

### 3. Huntsville & North Alabama (5 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 16 | AL.com Huntsville | `alcom-huntsville` | `https://www.al.com/huntsville` | `https://www.al.com/arc/outboundfeeds/rss/category/news/huntsville/` | rss | huntsville |
| 17 | Huntsville Business Journal | `hsv-biz-journal` | `https://huntsvillebusinessjournal.com` | `https://huntsvillebusinessjournal.com/feed/` | rss | huntsville |
| 18 | Decatur Daily | `decatur-daily` | `https://www.decaturdaily.com` | `https://www.decaturdaily.com/search/?f=rss` | rss | huntsville |
| 19 | WHNT News 19 | `whnt-19` | `https://whnt.com` | `https://whnt.com/feed/` | rss | huntsville |
| 20 | WAFF 48 | `waff-48` | `https://www.waff.com` | — | firecrawl | huntsville |

### 4. Mobile & Gulf Coast (4 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 21 | AL.com Mobile | `alcom-mobile` | `https://www.al.com/mobile` | `https://www.al.com/arc/outboundfeeds/rss/category/news/mobile/` | rss | mobile |
| 22 | WKRG News 5 | `wkrg-5` | `https://www.wkrg.com` | `https://www.wkrg.com/feed/` | rss | mobile |
| 23 | Lagniappe Mobile | `lagniappe` | `https://lagniappemobile.com` | — | firecrawl | mobile |
| 24 | WSFA 12 | `wsfa-12` | `https://www.wsfa.com` | — | firecrawl | mobile |

### 5. Montgomery & Central Alabama (4 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 25 | AL.com Montgomery | `alcom-montgomery` | `https://www.al.com/montgomery` | `https://www.al.com/arc/outboundfeeds/rss/category/news/montgomery/` | rss | montgomery |
| 26 | Montgomery Advertiser | `montgomery-advertiser` | `https://www.montgomeryadvertiser.com` | — | firecrawl | montgomery |
| 27 | Dothan Eagle | `dothan-eagle` | `https://dothaneagle.com` | `https://dothaneagle.com/search/?f=rss` | rss | montgomery |
| 28 | Opelika-Auburn News | `opelika-auburn-news` | `https://oanow.com` | `https://oanow.com/search/?f=rss` | rss | montgomery |

### 6. Tuscaloosa & West Alabama (3 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 29 | Tuscaloosa News | `tuscaloosa-news` | `https://www.tuscaloosanews.com` | — | firecrawl | tuscaloosa |
| 30 | TimesDaily | `timesdaily` | `https://www.timesdaily.com` | `https://www.timesdaily.com/search/?f=rss` | rss | tuscaloosa |
| 31 | Anniston Star | `anniston-star` | `https://www.annistonstar.com` | `https://www.annistonstar.com/search/?f=rss` | rss | tuscaloosa |

### 7. Auburn & East Alabama (3 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 32 | Auburn Villager | `auburn-villager` | `https://auburnvillager.com` | `https://auburnvillager.com/search/?f=rss` | rss | auburn |
| 33 | Sand Mountain Reporter | `sand-mountain-reporter` | `https://www.sandmountainreporter.com` | `https://www.sandmountainreporter.com/search/?f=rss` | rss | auburn |
| 34 | Gadsden Times | `gadsden-times` | `https://www.gadsdentimes.com` | — | firecrawl | auburn |

### 8. Sports (4 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 35 | AL.com Bama Sports | `alcom-bama-sports` | `https://www.al.com/alabamacrimsontidesports` | `https://www.al.com/arc/outboundfeeds/rss/category/sports/alabama/` | rss | sports |
| 36 | AL.com Auburn Sports | `alcom-auburn-sports` | `https://www.al.com/auburntigers` | `https://www.al.com/arc/outboundfeeds/rss/category/sports/auburn/` | rss | sports |
| 37 | Saturday Down South | `saturday-down-south` | `https://www.saturdaydownsouth.com` | `https://www.saturdaydownsouth.com/feed/` | rss | sports |
| 38 | Auburn Newsroom | `auburn-newsroom` | `https://auburntigers.com` | — | firecrawl | auburn |

**Note**: Auburn Newsroom is listed under Sports for feed purposes but categorized as `auburn` in the database since it primarily covers Auburn athletics and university news. Display it in the Sports section.

### 9. Government & Education (3 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 39 | Office of the Governor | `governor-alabama` | `https://governor.alabama.gov` | `https://governor.alabama.gov/feed/` | rss | government |
| 40 | Alabama Legislature | `al-legislature` | `https://www.legislature.state.al.us` | `https://www.legislature.state.al.us/rss/rss.aspx` | rss | government |
| 41 | UA News | `ua-news` | `https://news.ua.edu` | `https://news.ua.edu/feed/` | rss | government |

### 10. Public Radio & NPR (3 sources)

| # | Name | Slug | URL | Feed URL | Type | Category |
|---|------|------|-----|----------|------|----------|
| 42 | WBHM 90.3 Birmingham | `wbhm` | `https://wbhm.org` | `https://wbhm.org/feed/` | rss | radio |
| 43 | WLRH 89.3 Huntsville | `wlrh` | `https://wlrh.org` | `https://wlrh.org/feed/` | rss | radio |
| 44 | Alabama Public Radio | `al-public-radio` | `https://apr.org` | — | firecrawl | radio |

---

## Category Display Order

The homepage renders categories in this exact order. Each category has a display name and a slug used in the database:

| Order | Display Name | DB Category Slug | Source Count |
|-------|-------------|-----------------|--------------|
| 1 | Statewide News | `statewide` | 8 |
| 2 | Birmingham Metro | `birmingham` | 7 |
| 3 | Huntsville & North Alabama | `huntsville` | 5 |
| 4 | Mobile & Gulf Coast | `mobile` | 4 |
| 5 | Montgomery & Central Alabama | `montgomery` | 4 |
| 6 | Tuscaloosa & West Alabama | `tuscaloosa` | 3 |
| 7 | Auburn & East Alabama | `auburn` | 3 (+1 Auburn Newsroom displayed in Sports) |
| 8 | Sports | `sports` | 4 (3 AL.com/SDS + Auburn Newsroom) |
| 9 | Government & Education | `government` | 3 |
| 10 | Public Radio & NPR | `radio` | 3 |

---

## Database Schema

### `sources` table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | integer | PK, autoincrement | |
| `name` | text | NOT NULL | Display name |
| `slug` | text | NOT NULL, UNIQUE | URL-safe identifier |
| `url` | text | NOT NULL | Homepage URL |
| `feed_url` | text | nullable | RSS feed URL (null for Firecrawl sources) |
| `feed_type` | text | NOT NULL, default `'rss'` | `'rss'` or `'firecrawl'` |
| `category` | text | NOT NULL | Category slug from table above |
| `active` | integer | NOT NULL, default `1` | 1=active, 0=disabled |
| `last_fetched_at` | text | nullable | ISO timestamp of last successful fetch |
| `created_at` | text | default `datetime('now')` | |

### `headlines` table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | integer | PK, autoincrement | |
| `source_id` | integer | NOT NULL, FK → sources(id) | |
| `title` | text | NOT NULL | Headline text |
| `url` | text | NOT NULL, UNIQUE | Deduplication key |
| `published_at` | text | nullable | ISO timestamp from feed |
| `fetched_at` | text | default `datetime('now')` | When we fetched it |

### Indexes
- `idx_headlines_source` on `headlines(source_id, published_at DESC)`
- `idx_headlines_fetched` on `headlines(fetched_at DESC)`

---

## Component Specs

### `src/app/layout.tsx` — Root Layout
- Load Inter (weights 400,500,600,700) + Raleway (weights 300,400,500,600,700) via `next/font/google`
- Set `<html lang="en">` with font CSS variables
- Metadata: title "Alabamy | Alabama News", description, OG image, Twitter card
- Favicon references: `/favicon-32x32.png`, `/favicon-16x16.png`, `/apple-touch-icon.png`
- Render `<Header />` + `{children}` + `<Footer />`

### `src/components/header.tsx` — Sticky Header
- Sticky top, dark background (`#111111`), border-bottom with white/10 opacity
- Logo: `<img src="/alabamy-wordmark.png" />` height 32px, links to `/`
- Below logo: `<CategoryNav />` component with horizontal scrolling pills

### `src/components/category-nav.tsx` — Category Navigation
- Horizontal scrollable row of pill buttons
- Each pill links to `#category-slug` anchor on the page
- Active/first pill: crimson background, white text
- Other pills: cream-dark background, ink-secondary text, hover:card-border bg
- Hide scrollbar (`scrollbar-hide` utility)

### `src/components/category-section.tsx` — Category Group
- `id={category-slug}` for anchor linking
- Category heading: Raleway font, 2xl, semibold, with crimson bottom border (2px)
- Below heading: responsive grid of `<SourceCard />` components
- Grid: 3 columns desktop (lg), 2 columns tablet (md), 1 column mobile
- Gap: 1.25rem (gap-5)
- Margin bottom between sections: 3rem (mb-12)

### `src/components/source-card.tsx` — Source Card
- White background, rounded-lg, border card-border, padding 1.25rem
- Hover: shadow-md transition
- Source name: uppercase, tracking-wider, text-sm, font-semibold, text-crimson, mb-3
- Contains up to 5 `<HeadlineItem />` components in a `<ul>` with space-y-2

### `src/components/headline-item.tsx` — Single Headline
- `<li>` containing an `<a>` with `target="_blank" rel="noopener"`
- Headline text: 15px, leading-snug, font-serif (Georgia), text-ink, hover:text-crimson
- Timestamp below: text-xs, text-ink-muted, showing relative time ("2h ago", "yesterday", "3d ago")
- Use a helper function to compute relative time from `published_at` or `fetched_at`

### `src/components/last-updated.tsx` — Updated Badge
- Small badge showing "Last updated: [time]"
- Uses the most recent `fetched_at` from headlines
- Positioned in the hero area or just below header

### `src/components/footer.tsx` — Footer
- Dark background (`#111111`), cream text
- Alabamy icon (40x40), contact info, copyright
- Layout: flex row, icon left, text right
- Contact: mike@alabamy.com | 205-687-TALK
- Copyright: (c) 2026 Alabamy. Boundless.

---

## Cron Endpoint Spec

### `src/app/api/cron/fetch-feeds/route.ts`

**Authentication**: Check `Authorization: Bearer <CRON_SECRET>` header. Return 401 if missing/wrong.

**Flow**:
1. Get all active sources from DB
2. **RSS sources** (feed_type === 'rss'):
   - Batch 10 at a time using `Promise.allSettled`
   - For each: parse feed with `rss-parser`, extract title + link + pubDate
   - Insert headlines with `onConflictDoNothing` (url is unique key)
   - Update source `last_fetched_at`
3. **Firecrawl sources** (feed_type === 'firecrawl'):
   - Process sequentially (respect API rate limits)
   - For each: scrape homepage URL with Firecrawl SDK
   - Extract headlines from markdown: look for `[link text](url)` patterns
   - Filter to keep only headlines (skip nav links, footer links, etc.)
   - Insert with `onConflictDoNothing`
   - Update source `last_fetched_at`
4. **Prune**: For each source, keep max 20 most recent headlines, delete older
5. **Revalidate**: Call `revalidatePath("/")` to bust ISR cache
6. Return JSON summary: `{ rss: { success: N, failed: N }, firecrawl: { success: N, failed: N }, pruned: N }`

**Timeout**: Set `maxDuration` to 300 (5 minutes) for Vercel.

### `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-feeds",
      "schedule": "0 11 * * *"
    }
  ]
}
```
Schedule: `0 11 * * *` = 11:00 UTC = 6:00 AM Central Time

---

## Design Direction

### Fonts
- **Display/Headings**: Raleway (300-700 weight range)
- **Body/UI**: Inter (400-700 weight range)
- **Headlines in cards**: Georgia (serif) via Tailwind `font-serif`

### Color Palette
- **Background**: `#FAFAF8` (warm cream)
- **Cards**: white `#FFFFFF` with `#EBE8E2` border
- **Primary text**: `#1A1A18` (near-black ink)
- **Secondary text**: `#4A4A46`
- **Muted text**: `#8A8A84` (timestamps, meta)
- **Accent**: `#C41E3A` (Alabama Crimson) — source labels, category borders, hover states
- **Header/Footer**: `#111111` with cream text

### Layout
- Max width: 1280px (`max-w-7xl`)
- Content padding: `px-4 sm:px-6 lg:px-8`
- Category sections: `mb-12` between sections
- Card grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`

### Responsive Breakpoints
- **Mobile** (< 768px): 1 column cards, horizontal scroll nav
- **Tablet** (768-1024px): 2 column cards
- **Desktop** (> 1024px): 3 column cards

---

## Homepage (`src/app/page.tsx`)

Server component with `export const revalidate = 3600` (1 hour ISR).

### Structure:
1. **Hero area**: Tagline "Alabama's News, All in One Place" + LastUpdated badge
2. **Category sections**: Loop through categories in defined order, render `<CategorySection>` for each
3. Each category section gets its sources with up to 5 headlines each

### Data query:
```typescript
// src/lib/queries.ts
export async function getHeadlinesByCategory() {
  // Returns: Array of { category, displayName, sources: [{ name, slug, url, headlines: [{ title, url, publishedAt }] }] }
  // Categories in defined display order
  // Each source limited to 5 most recent headlines
  // Only active sources with at least 1 headline
}
```

---

## Environment Variables

Create `.env.local` with:
```
TURSO_DATABASE_URL=libsql://alabamy-<org>.turso.io
TURSO_AUTH_TOKEN=eyJ...
FIRECRAWL_API_KEY=fc-737e1937acc347f6b8c4fe45d910a275
CRON_SECRET=<generate-random-32-char-string>
```

---

## Existing Assets

These files already exist in `public/` (copied from branding):
- `alabamy-wordmark.png` — full logo wordmark (white on transparent)
- `alabamy-icon.png` — icon/emblem only
- `apple-touch-icon.png` — 180x180 for iOS
- `favicon-32x32.png`
- `favicon-16x16.png`

---

## File Structure

```
alabamy/
├── CLAUDE.md
├── PROJECT_PLAN.md
├── TODO.md
├── COMPLETED.md
├── build_loop.sh
├── vercel.json
├── drizzle.config.ts
├── tailwind.config.ts (or extended via CSS in v4)
├── .env.local
├── public/
│   ├── alabamy-wordmark.png
│   ├── alabamy-icon.png
│   ├── apple-touch-icon.png
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── db/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── lib/
│   │   ├── queries.ts
│   │   └── fetchers/
│   │       ├── rss-fetcher.ts
│   │       ├── firecrawl-fetcher.ts
│   │       └── pruner.ts
│   ├── components/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── category-nav.tsx
│   │   ├── category-section.tsx
│   │   ├── source-card.tsx
│   │   ├── headline-item.tsx
│   │   └── last-updated.tsx
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── globals.css
│       └── api/
│           └── cron/
│               └── fetch-feeds/
│                   └── route.ts
```
