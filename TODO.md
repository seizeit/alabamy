# TODO

## Phase 1: Project Setup
- [x] **1.01** Scaffold Next.js project with `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` — answer prompts non-interactively, preserve existing files (CLAUDE.md, PROJECT_PLAN.md, TODO.md, COMPLETED.md, build_loop.sh, public/ assets)
- [x] **1.02** Install dependencies: `npm install drizzle-orm @libsql/client rss-parser @mendable/firecrawl-js` and `npm install -D drizzle-kit tsx`
- [x] **1.03** Create `.env.local` with TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, FIRECRAWL_API_KEY, and CRON_SECRET placeholders. Verify assets exist in `public/` (alabamy-wordmark.png, alabamy-icon.png, apple-touch-icon.png, favicon-32x32.png, favicon-16x16.png)
- [x] **1.04** Configure Tailwind theme — extend with custom colors (cream, cream-dark, card-border, ink, ink-secondary, ink-muted, crimson, crimson-dark, header-bg, header-text), add Inter + Raleway fonts via next/font/google with CSS variables, set font-serif to Georgia
- [x] **1.05** Write `src/app/globals.css` with Tailwind directives, custom font-face variables, scrollbar-hide utility, and base body styles (bg-cream, text-ink, font-sans)

## Phase 2: Database & Data Layer
- [x] **2.01** Create `src/db/schema.ts` — Drizzle table definitions for `sources` (id, name, slug, url, feed_url, feed_type, category, active, last_fetched_at, created_at) and `headlines` (id, source_id, title, url, published_at, fetched_at) with indexes and relations
- [x] **2.02** Create `src/db/index.ts` — Turso client via `@libsql/client` using env vars, export Drizzle instance
- [x] **2.03** Create `drizzle.config.ts` pointing to Turso, run `npx drizzle-kit push` to create tables
- [x] **2.04** Create `src/db/seed.ts` with all 44 sources from PROJECT_PLAN.md source registry, run `npx tsx src/db/seed.ts` to populate sources table
- [x] **2.05** Create `src/lib/queries.ts` — export `getHeadlinesByCategory()` that returns sources grouped by 10 categories in display order, each source with up to 5 most recent headlines, only active sources with at least 1 headline

## Phase 3: Feed Fetching
- [x] **3.01** Create `src/lib/fetchers/rss-fetcher.ts` — parse RSS feeds with rss-parser, batch 10 at a time via `Promise.allSettled`, insert headlines with `onConflictDoNothing` on url, update source last_fetched_at
- [x] **3.02** Create `src/lib/fetchers/firecrawl-fetcher.ts` — scrape with Firecrawl SDK (`@mendable/firecrawl-js`), extract headlines from markdown using regex for `[text](url)` patterns, filter out nav/footer links, sequential processing, insert with onConflictDoNothing
- [x] **3.03** Create `src/lib/fetchers/pruner.ts` — for each source keep max 20 most recent headlines (by fetched_at), delete older ones
- [x] **3.04** Create `src/app/api/cron/fetch-feeds/route.ts` — GET handler with CRON_SECRET Bearer auth, orchestrates: fetch RSS sources → fetch Firecrawl sources → prune → revalidatePath("/"), returns JSON summary, set maxDuration=300
- [x] **3.05** Create `vercel.json` with cron schedule `"0 11 * * *"` (6 AM CT) pointing to `/api/cron/fetch-feeds`
- [x] **3.06** Test cron endpoint manually with curl, verify headlines populate in database — if no Turso credentials configured yet, verify the code compiles with `npm run build`

## Phase 4: Frontend Components
- [ ] **4.01** Create `src/app/layout.tsx` — load Inter + Raleway via next/font/google, set metadata (title "Alabamy | Alabama News", description, OG tags), favicon links, render Header + children + Footer
- [ ] **4.02** Create `src/components/header.tsx` — sticky header with dark bg (#111111), alabamy-wordmark.png logo linking to /, CategoryNav below
- [ ] **4.03** Create `src/components/category-nav.tsx` — horizontal scrollable row of pill buttons for 10 categories, linking to #anchor IDs, crimson active state, scrollbar-hide
- [ ] **4.04** Create `src/components/category-section.tsx` — receives category data, renders heading with crimson border-b-2 + responsive grid (1/2/3 cols) of SourceCards
- [ ] **4.05** Create `src/components/source-card.tsx` — white card with border, source name in crimson uppercase, up to 5 HeadlineItems in a list
- [ ] **4.06** Create `src/components/headline-item.tsx` — anchor link opening in new tab, Georgia serif headline text with hover:text-crimson, relative timestamp below (2h ago, yesterday, 3d ago)
- [ ] **4.07** Create `src/components/footer.tsx` — dark bg, alabamy-icon.png, contact info (mike@alabamy.com, 205-687-TALK), copyright 2026 Alabamy Boundless
- [ ] **4.08** Create `src/components/last-updated.tsx` — small badge showing "Last updated: [relative time]" using most recent headline fetched_at

## Phase 5: Homepage
- [ ] **5.01** Create `src/app/page.tsx` — server component with `export const revalidate = 3600`, call getHeadlinesByCategory(), render hero text "Alabama's News, All in One Place" + LastUpdated + all CategorySections in order
- [ ] **5.02** Verify full page renders — run `npm run build` to check for errors, verify all 10 categories would display correctly in the markup

## Phase 6: Polish
- [ ] **6.01** Final build verification — run `npm run build`, fix any TypeScript or build errors, ensure all links use target="_blank", verify sticky header markup, check category nav has horizontal scroll on mobile, no console errors
- [ ] **6.02** Add `public/robots.txt` (allow all, sitemap reference) and `public/sitemap.xml` (basic with homepage URL https://alabamy.com)
