# Completed Tasks

## 1.01 — Scaffold Next.js project
- Manually scaffolded Next.js 16 with TypeScript, Tailwind CSS v4, ESLint, App Router, src dir, and @/* import alias
- Created: package.json, tsconfig.json, next.config.ts, postcss.config.mjs, eslint.config.mjs, .gitignore, src/app/layout.tsx, src/app/page.tsx, src/app/globals.css
- All existing files preserved (CLAUDE.md, PROJECT_PLAN.md, TODO.md, COMPLETED.md, build_loop.sh, public/ assets)
- Build verified: `npm run build` passes successfully

## 1.02 — Install dependencies
- Installed runtime: drizzle-orm, @libsql/client, rss-parser, @mendable/firecrawl-js
- Installed dev: drizzle-kit, tsx
- All packages added successfully

## 1.03 — Create .env.local and verify assets
- Created `.env.local` with placeholders for TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, FIRECRAWL_API_KEY, CRON_SECRET
- Verified all 5 public assets exist: alabamy-wordmark.png, alabamy-icon.png, apple-touch-icon.png, favicon-32x32.png, favicon-16x16.png
- Confirmed `.env*.local` is in `.gitignore`

## 1.04 — Configure Tailwind theme with custom colors and fonts
- Added 10 custom colors to Tailwind v4 `@theme` block in globals.css (cream, cream-dark, card-border, ink, ink-secondary, ink-muted, crimson, crimson-dark, header-bg, header-text)
- Configured Inter (sans) and Raleway (display) via `next/font/google` with CSS variables in layout.tsx
- Set font-serif to Georgia in @theme
- Build verified: `npm run build` passes

## 1.05 — Write globals.css with full styles
- Added scrollbar-hide utility using @utility directive (hides scrollbar cross-browser)
- Added base layer with body styles: bg-cream, text-ink, font-sans, antialiased
- Preserved existing @theme block with custom colors and font stacks
- Build verified: `npm run build` passes

## 2.01 — Create database schema
- Created `src/db/schema.ts` with Drizzle ORM table definitions
- `sources` table: id, name, slug (unique), url, feed_url, feed_type, category, active, last_fetched_at, created_at
- `headlines` table: id, source_id (FK → sources), title, url (unique for dedup), published_at, fetched_at
- Added indexes: `idx_headlines_source` on (source_id, published_at), `idx_headlines_fetched` on (fetched_at)
- Defined relations: sources hasMany headlines, headlines belongsTo source

## 2.02 — Create database client
- Created `src/db/index.ts` with Turso client via `@libsql/client` using TURSO_DATABASE_URL and TURSO_AUTH_TOKEN env vars
- Exported Drizzle ORM instance with schema for type-safe queries

## 2.03 — Create Drizzle config
- Created `drizzle.config.ts` with Turso dialect, schema path, and dbCredentials from env vars
- `npx drizzle-kit push` correctly requires real Turso credentials (placeholders in .env.local)
- Config validated: TypeScript compiles cleanly with no errors

## 2.04 — Create seed script with all 44 sources
- Created `src/db/seed.ts` with all 44 sources from PROJECT_PLAN.md source registry
- Sources span 10 categories: statewide (8), birmingham (7), huntsville (5), mobile (4), montgomery (4), tuscaloosa (3), auburn (3), sports (4), government (3), radio (3)
- 30 RSS sources with feed_url, 14 Firecrawl sources with feed_url=null
- Uses `onConflictDoNothing` for idempotent seeding
- Runtime requires real Turso credentials (placeholders in .env.local); code compiles cleanly

## 2.05 — Create queries module
- Created `src/lib/queries.ts` with `getHeadlinesByCategory()` function
- Returns sources grouped by 10 categories in display order (statewide → radio)
- Each source includes up to 5 most recent headlines, ordered by fetched_at desc
- Only returns active sources with at least 1 headline
- Handles Auburn Newsroom special case: stored as category "auburn" but displayed in Sports
- Uses Drizzle relational queries with proper typing
- TypeScript compiles cleanly

## 3.01 — Create RSS fetcher
- Created `src/lib/fetchers/rss-fetcher.ts` with rss-parser integration
- Exports `fetchRssFeeds()` that batches 10 feeds at a time via `Promise.allSettled`
- Inserts headlines with `onConflictDoNothing` on url for deduplication
- Updates source `last_fetched_at` after successful fetch
- Returns `{ success, failed }` counts for reporting

## 3.02 — Create Firecrawl fetcher
- Created `src/lib/fetchers/firecrawl-fetcher.ts` with `@mendable/firecrawl-js` SDK
- Scrapes homepage URLs, extracts headlines from markdown using `[text](url)` regex
- Filters out nav/footer links via text length checks and skip patterns (social, nav terms, non-http)
- Resolves relative URLs to absolute using source URL origin
- Sequential processing to respect Firecrawl API rate limits
- Inserts with `onConflictDoNothing` on url, updates `last_fetched_at`
- Returns `{ success, failed }` counts

## 3.03 — Create pruner
- Created `src/lib/fetchers/pruner.ts` with `pruneHeadlines()` function
- For each source, keeps max 20 most recent headlines by fetched_at
- Deletes older headlines beyond the limit
- Returns `{ deletedCount }` for reporting

## 3.04 — Create cron API route
- Created `src/app/api/cron/fetch-feeds/route.ts` with GET handler
- Bearer auth via CRON_SECRET environment variable
- Orchestrates: query active sources → fetchRssFeeds → fetchFirecrawlFeeds → pruneHeadlines → revalidatePath("/")
- Returns JSON summary with RSS/Firecrawl results, prune count, and source counts
- Sets `maxDuration = 300` for Vercel long-running function support
- Error handling returns 500 with logged error

## 3.05 — Create vercel.json with cron schedule
- Created `vercel.json` with cron config targeting `/api/cron/fetch-feeds`
- Schedule: `0 11 * * *` (11:00 UTC = 6:00 AM CT daily)

## 3.06 — Verify build compiles with all feed fetching code
- Fixed Firecrawl SDK method: `scrapeUrl` → `scrape` (API changed in newer SDK version)
- Removed `success`/`error` response wrapper checks (SDK returns Document directly)
- `npm run build` passes successfully with all Phase 1–3 code compiling cleanly

## 4.01 — Create layout with metadata, favicons, Header + Footer
- Updated `src/app/layout.tsx` with full metadata: title "Alabamy | Alabama News", description, OG tags, Twitter card
- Added favicon links (32x32, 16x16, apple-touch-icon)
- Imports and renders Header + `<main>` children + Footer
- Created stub `src/components/header.tsx` (sticky dark header with wordmark)
- Created stub `src/components/footer.tsx` (dark footer with icon, contact, copyright)
- Build verified: `npm run build` passes

## 4.02 — Create header component with CategoryNav
- Enhanced `src/components/header.tsx` with Next.js Image + Link components
- Sticky dark header (#111111) with alabamy-wordmark.png logo linking to /
- Image uses priority loading, proper width/height attributes
- Created `src/components/category-nav.tsx` stub with all 10 category pill links
- CategoryNav renders horizontally scrollable pills with anchor links to #category sections
- Build verified: `npm run build` passes

## 4.03 — Create category-nav with active state
- Implemented `src/components/category-nav.tsx` as client component
- Horizontal scrollable row of 10 category pill buttons with scrollbar-hide
- Pills link to #anchor IDs matching category slugs
- IntersectionObserver tracks visible section, highlights active pill with bg-crimson text-white
- Inactive pills use bg-cream-dark with hover:bg-card-border
- Build verified: `npm run build` passes

## 4.04 — Create category-section component
- Created `src/components/category-section.tsx` with CategoryGroup props from queries.ts
- Renders category heading with Raleway font, crimson border-b-2 bottom border
- Responsive grid: 1 col mobile, 2 cols tablet (md), 3 cols desktop (lg), gap-5
- Section uses `id={slug}` for anchor linking with `scroll-mt-24` offset for sticky header
- Created stub `src/components/source-card.tsx` for build compatibility
- Build verified: `npm run build` passes

## 4.05 — Create source-card component
- Updated `src/components/source-card.tsx` with full implementation
- White card with rounded-lg border, hover:shadow-md transition
- Source name in crimson uppercase with tracking-wider
- Renders up to 5 HeadlineItems from source.headlines array
- Created stub `src/components/headline-item.tsx` for build compatibility
- Build verified: `npm run build` passes

## 4.06 — Create headline-item component
- Updated `src/components/headline-item.tsx` with full implementation
- Anchor link opens in new tab with rel="noopener", group hover behavior
- Georgia serif headline text (font-serif, text-[15px]) with hover:text-crimson transition
- Relative timestamp helper: just now, Xm ago, Xh ago, yesterday, Xd ago, or "Mon D" for 30+ days
- Uses published_at with fallback to fetched_at for timestamp display
- Build verified: `npm run build` passes
