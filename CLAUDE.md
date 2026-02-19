# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Efficiency Rules (Read First)

**These rules minimize token usage and speed up each iteration:**

### File Path Patterns (Don't Search, Go Direct)

| Need | Path Pattern |
|------|--------------|
| Page | `src/app/page.tsx` or `src/app/{route}/page.tsx` |
| Layout | `src/app/layout.tsx` or `src/app/{route}/layout.tsx` |
| API Route | `src/app/api/{name}/route.ts` |
| Component | `src/components/{name}.tsx` |
| DB Schema | `src/db/schema.ts` |
| DB Client | `src/db/index.ts` |
| DB Seed | `src/db/seed.ts` |
| Queries | `src/lib/queries.ts` |
| Fetcher | `src/lib/fetchers/{name}.ts` |
| Global CSS | `src/app/globals.css` |
| Tailwind Config | `tailwind.config.ts` |
| Drizzle Config | `drizzle.config.ts` |
| Vercel Config | `vercel.json` |
| Assets | `public/{filename}` |
| Env | `.env.local` |

### Skip These Actions
- **Don't explore** -- if the path pattern above matches, use it directly
- **Don't read completed tasks** -- jump to first `- [ ]` in TODO.md
- **Don't re-read CLAUDE.md** -- you already have this context
- **Don't run excessive git commands** -- single `git add -A && git commit` suffices

### Minimal Output
- Keep status output brief
- Don't explain what you're about to do, just do it
- Don't list files you're creating, just create them

---

## Auto-Build Mode (Loop Protocol)

**CRITICAL: This is a loop. You MUST EXIT after completing ONE task.**

When running inside the automated build loop (`build_loop.sh`), execute these steps IN ORDER, then EXIT:

### Step 1: Find your task
- Read `TODO.md` -- find the FIRST unchecked task (`- [ ]`)
- If it has a `<!-- SKIPPED -->` comment, skip to the next unchecked task
- This is your ONE task for this iteration

### Step 2: Implement the task
- Read `PROJECT_PLAN.md` for detailed specs as needed
- Create necessary files, write clean working code
- Run linting if a linter is installed

### Step 3: Mark task complete
- Edit TODO.md: change `- [ ]` to `- [x]` for the completed task
- Append a completion entry to COMPLETED.md with the task ID and summary

### Step 4: Commit
```bash
git add -A && git commit -m "task: <description>"
```

### Step 5: EXIT
- **STOP GENERATING TEXT** after the commit
- **DO NOT** start the next task
- **DO NOT** ask questions -- make reasonable decisions and proceed
- **EXIT** -- the external loop will restart you for the next task

### If a task fails:
1. Add `<!-- SKIPPED: reason -->` comment after the task line in TODO.md
2. Do NOT mark it as done
3. Commit what you have and EXIT (the loop will move to the next task)

---

## Auto-Build Rules Summary

| Rule | Description |
|------|-------------|
| ONE TASK | Complete exactly one `- [ ]` task |
| NO QUESTIONS | Make decisions, don't ask |
| ALWAYS COMMIT | Every task gets a commit |
| FAIL FORWARD | Log errors, skip, move on |
| EXIT AFTER COMMIT | Stop generating after commit |

---

## Project Overview

**Alabamy** is a Next.js news aggregator for the state of Alabama, pulling headlines from 44 sources (30 RSS + 14 Firecrawl) and displaying them grouped by region/category. Think Alltop, but for Alabama.

Full specification: [PROJECT_PLAN.md](PROJECT_PLAN.md)
Build task list: [TODO.md](TODO.md)
Completion log: [COMPLETED.md](COMPLETED.md)

---

## Tech Stack

- **Framework**: Next.js 15+ (App Router) / TypeScript
- **Database**: Turso (libSQL) via `@libsql/client` + Drizzle ORM
- **RSS Parsing**: `rss-parser`
- **Web Scraping**: `@mendable/firecrawl-js` (for 14 sources without RSS)
- **Styling**: Tailwind CSS v4
- **Fonts**: Inter (body/UI) + Raleway (display/headings) via `next/font/google`
- **Hosting**: Vercel (with cron)
- **Domain**: alabamy.com

---

## Common Commands

```bash
# Development
npm install                          # Install dependencies
npm run dev                          # Start dev server (localhost:3000)
npm run build                        # Production build (verify no errors)

# Database
npx drizzle-kit push                 # Push schema to Turso
npx tsx src/db/seed.ts               # Seed all 44 sources

# Testing the cron
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/fetch-feeds
```

---

## Architecture

### App Router Structure
```
src/app/
  layout.tsx          # Root: fonts, metadata, Header + Footer
  page.tsx            # Homepage: server component, ISR revalidate=3600
  globals.css         # Tailwind layers + custom utilities
  api/cron/fetch-feeds/route.ts  # Cron: RSS -> Firecrawl -> prune -> revalidate
```

### Data Flow
1. **Cron** (daily 6 AM CT via Vercel) hits `/api/cron/fetch-feeds`
2. **RSS Fetcher** batches 30 feeds (10 at a time via `Promise.allSettled`)
3. **Firecrawl Fetcher** sequentially scrapes 14 sites, extracts headlines from markdown
4. **Pruner** keeps max 20 headlines per source, deletes older
5. **Homepage** server component calls `getHeadlinesByCategory()`, renders all 10 categories
6. **ISR** revalidates every 1 hour

### Categories (Display Order)
1. Statewide News
2. Birmingham Metro
3. Huntsville & North Alabama
4. Mobile & Gulf Coast
5. Montgomery & Central Alabama
6. Tuscaloosa & West Alabama
7. Auburn & East Alabama
8. Sports
9. Government & Education
10. Public Radio & NPR

### Database
- **sources** table: 44 rows, each with name, slug, url, feed_url, feed_type, category
- **headlines** table: title + url (unique for dedup) + source_id + timestamps

---

## Color Palette

Custom Tailwind colors for the aggregator UI:

| Name | Hex | Usage |
|------|-----|-------|
| `cream` | `#FAFAF8` | Page background |
| `cream-dark` | `#F0EDE7` | Hover states, alternate sections |
| `card-border` | `#EBE8E2` | Card borders |
| `ink` | `#1A1A18` | Primary text |
| `ink-secondary` | `#4A4A46` | Secondary text |
| `ink-muted` | `#8A8A84` | Muted text, timestamps |
| `crimson` | `#C41E3A` | Alabama crimson accent — source labels, category borders |
| `crimson-dark` | `#A01830` | Hover on crimson elements |
| `header-bg` | `#111111` | Dark header background |
| `header-text` | `#FAFAF8` | Header text |

---

## UI Theme Guide

### Layout Context
- **Body background**: `bg-cream` (`#FAFAF8`)
- **Header**: `bg-header-bg` (dark, sticky)
- **Max width**: `max-w-7xl` (1280px) centered
- **Content padding**: `px-4 sm:px-6 lg:px-8`

### Header
```html
<header class="sticky top-0 z-50 bg-[#111111] border-b border-white/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <img src="/alabamy-wordmark.png" alt="Alabamy" class="h-8" />
  </div>
</header>
```

### Category Nav Pills
```html
<nav class="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
  <a class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-crimson text-white">Statewide</a>
  <a class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium bg-cream-dark text-ink-secondary hover:bg-card-border">Birmingham</a>
</nav>
```

### Category Section Headers
```html
<div class="border-b-2 border-crimson pb-2 mb-6">
  <h2 class="font-display text-2xl font-semibold text-ink tracking-tight">Statewide News</h2>
</div>
```

### Source Cards
```html
<div class="bg-white rounded-lg border border-card-border p-5 hover:shadow-md transition-shadow">
  <h3 class="text-sm font-semibold uppercase tracking-wider text-crimson mb-3">Alabama Reflector</h3>
  <ul class="space-y-2">
    <!-- HeadlineItems here -->
  </ul>
</div>
```

### Headline Items
```html
<li>
  <a href="..." target="_blank" rel="noopener" class="group block">
    <span class="text-[15px] leading-snug font-serif text-ink group-hover:text-crimson transition-colors">
      Headline text here
    </span>
    <span class="block text-xs text-ink-muted mt-0.5">2h ago</span>
  </a>
</li>
```

### Footer
```html
<footer class="bg-[#111111] text-cream py-8 mt-12">
  <div class="max-w-7xl mx-auto px-4 flex items-center gap-6">
    <img src="/alabamy-icon.png" alt="Alabamy" class="w-10 h-10" />
    <div class="text-sm text-ink-muted">
      <p>mike@alabamy.com | 205-687-TALK</p>
      <p>&copy; 2026 Alabamy. Boundless.</p>
    </div>
  </div>
</footer>
```

### Responsive Grid (Source Cards)
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  <!-- SourceCards -->
</div>
```
