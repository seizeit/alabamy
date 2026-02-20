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
