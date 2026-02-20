# Alabamy Information Architecture Redesign
## UX Research & Recommendations

**Research Date**: February 19, 2026
**Product**: Alabamy (alabamy.com) -- Alabama News Aggregator
**Scope**: Reorganize from geographic-first to subject-matter-first navigation
**Current State**: 44 sources, 10 geographic categories, flat pill navigation

---

## Table of Contents

1. [Analysis of Current State](#1-analysis-of-current-state)
2. [Subject-Matter Category Taxonomy](#2-subject-matter-category-taxonomy)
3. [Geographic Filter Model](#3-geographic-filter-model)
4. [Homepage Layout Hierarchy](#4-homepage-layout-hierarchy)
5. [Navigation Patterns](#5-navigation-patterns)
6. [Content Density](#6-content-density)
7. [Source-to-Category Mapping](#7-source-to-category-mapping)
8. [Schema Changes Required](#8-schema-changes-required)
9. [Wireframes](#9-wireframes)
10. [Implementation Priority](#10-implementation-priority)

---

## 1. Analysis of Current State

### What Exists Today

The current Alabamy homepage renders 10 sections in fixed order. Each section contains source cards (white cards with 5 headlines each) in a responsive 1/2/3-column grid. A horizontal pill bar in the sticky header provides anchor-link navigation to each section.

**Current categories (in display order):**
1. Statewide News (8 sources)
2. Birmingham Metro (7 sources)
3. Huntsville & North Alabama (5 sources)
4. Mobile & Gulf Coast (4 sources)
5. Montgomery & Central Alabama (4 sources)
6. Tuscaloosa & West Alabama (3 sources)
7. Auburn & East Alabama (3 sources)
8. Sports (4 sources)
9. Government & Education (3 sources)
10. Public Radio & NPR (3 sources)

### Problems with the Current Model

**Problem 1: Geographic-first is wrong for a news aggregator.**
When a reader opens a news site, they think in terms of "what happened" not "where is the outlet located." A Birmingham resident who cares about Alabama politics has to scan across Statewide, Birmingham, Montgomery, and Government sections to find political coverage. The geographic model forces users to know which outlets cover which topics.

**Problem 2: Ten pills do not scale on mobile.**
The `category-nav.tsx` renders 10 horizontally-scrolling pills. On a 375px iPhone screen, only 3-4 pills are visible at a time. Users must horizontally scroll to discover the remaining 6-7 categories. This violates the "visible is findable" principle -- users cannot navigate to what they cannot see.

**Problem 3: No filtering or personalization.**
A Mobile reader has no way to filter the entire page to show only Gulf Coast sources. They must scroll past Birmingham, Huntsville, and other regions to reach their local section. There is no way to combine interests (e.g., "politics from Mobile sources").

**Problem 4: Misleading category names.**
"Public Radio & NPR" and "Government & Education" are source-type labels, not topic labels. WBHM covers Birmingham news broadly, not just radio content. UA News covers university research, not just government. The labels conflate source identity with content type.

**Problem 5: Flat hierarchy gives all sections equal weight.**
Statewide News (8 sources, high-traffic outlets) receives the same visual treatment as Auburn & East Alabama (3 sources). There is no "top stories" or editorial prominence. Everything is the same visual weight, which means nothing is emphasized.

### What the Current Architecture Gets Right

- **Source cards with 5 headlines** are an effective information-dense format for an aggregator. Each card provides enough headlines to establish what a source covers without overwhelming the reader.
- **The Alltop model** (source name + headline list) is proven and efficient for power users.
- **Relative timestamps** help users assess freshness quickly.
- **The visual design** (warm cream background, crimson accent, Georgia serif headlines) is distinctive and appropriate for Alabama.

---

## 2. Subject-Matter Category Taxonomy

### Research Basis

Alabama news readers' primary interests, based on analysis of the 44 source outlets' actual content and Alabama cultural context:

- **Politics**: Alabama has an active state legislature, the Governor's office generates daily news, and federal representation (Tuberville, Britt) drives national attention. The Alabama Reflector, Alabama Political Reporter, and Yellowhammer News exist solely for this beat.
- **Sports**: College athletics are the dominant cultural force in Alabama. The Iron Bowl rivalry between Alabama and Auburn is among the most intense in American sports. There are 4 dedicated sports sources already. This is not optional -- it is essential.
- **Crime and Public Safety**: Every TV station (WBRC, WVTM, WHNT, WAFF, WKRG, WSFA) leads with crime and courts coverage. It is consistently the highest-traffic local news category nationwide.
- **Business and Economy**: Alabama's economy includes aerospace/defense (Huntsville), automotive manufacturing (Mercedes, Hyundai, Honda), steel/banking (Birmingham), and port commerce (Mobile). Huntsville Business Journal and Birmingham Business Journal are dedicated business sources.
- **Faith and Religion**: Alabama is tied for the second-most religious state in America. 58% of the population attends church regularly. Southern Baptist Convention, United Methodist, and Churches of Christ are the dominant denominations. This is a category that would feel conspicuously absent to Alabama readers if omitted.
- **Education**: Three major university systems (UA, Auburn, UAB) plus K-12 public education drive constant coverage. UA News is already a source.
- **Military and Defense**: Redstone Arsenal has a $36.2 billion annual economic impact and 143,000+ jobs. Fort Novosel (formerly Fort Rucker) is the Army's primary aviation training center. Maxwell Air Force Base is in Montgomery. This topic is deeply relevant to large portions of the state.
- **Culture and Entertainment**: "This Is Alabama" and "Made in Alabama" cover lifestyle, culture, food, music, and entertainment. Alabama has significant cultural exports (music, food, civil rights history).
- **Health**: Healthcare is a major employer and policy issue in Alabama. UAB is a nationally ranked medical center. Rural health access is a persistent statewide concern.
- **Environment and Weather**: Severe weather (tornadoes, hurricanes) is a life-and-death concern in Alabama. Environmental issues around the Gulf Coast, coal ash, and industrial pollution generate ongoing coverage.
- **Real Estate and Development**: Birmingham, Huntsville, and Mobile are all experiencing significant growth and development. Real estate and construction stories are high-interest for local readers.

### Recommended Taxonomy: 10 Subject-Matter Categories

| # | Category | Slug | Rationale |
|---|----------|------|-----------|
| 1 | **Politics & Government** | `politics` | Combines state politics, legislature, governor's office, federal delegation. Alabama's most politically engaged news topic. |
| 2 | **Crime & Courts** | `crime` | Criminal justice, public safety, police, courts. Consistently highest-traffic category on local news sites. |
| 3 | **Sports** | `sports` | College athletics (Bama, Auburn), high school sports, professional connections. Cultural heartbeat of the state. |
| 4 | **Business & Economy** | `business` | Jobs, employers, economic development, manufacturing, ports, automotive, startups. |
| 5 | **Education** | `education` | K-12, higher education (UA, Auburn, UAB), school boards, policy. Separated from Government because it has enough dedicated coverage. |
| 6 | **Faith & Religion** | `faith` | Church news, denominational developments, faith community events. Authentically Alabama -- omitting this would be tone-deaf. |
| 7 | **Health & Science** | `health` | Healthcare access, UAB medical research, public health policy, mental health, COVID aftereffects. |
| 8 | **Military & Defense** | `military` | Redstone Arsenal, Fort Novosel, Maxwell AFB, defense contracting, veterans issues. A $36B+ economic engine. |
| 9 | **Culture & Life** | `culture` | Food, music, arts, entertainment, lifestyle, civil rights history, tourism. What makes Alabama Alabama. |
| 10 | **Weather & Environment** | `weather` | Severe weather, tornadoes, hurricanes, environmental policy, outdoor recreation. Life-safety relevance. |

### Categories Considered and Rejected

| Rejected Category | Reason |
|---|---|
| **Technology/Innovation** | Too narrow. Huntsville space/defense tech fits under Military & Defense. Other tech stories fit under Business. |
| **Real Estate/Development** | Fits naturally under Business & Economy. Not enough dedicated source coverage to justify standalone. |
| **Opinion/Editorial** | Aggregators should not editorialize. Opinion content from sources flows naturally into the topic it addresses. |
| **Breaking News** | This is a temporal designation, not a topic. Handled via the homepage hero zone (see Section 4). |
| **Public Radio/NPR** | Source type, not topic. WBHM stories should appear in whatever topic they cover. |

### Why 10 Categories (Not 8, Not 12)

- **Fewer than 8** would force awkward merges (combining Faith with Culture loses both audiences).
- **More than 12** creates the same mobile navigation problem we are solving. The new pill bar must show 5-6 items on first view with the remainder reachable via scroll.
- **10 categories** matches the current count, meaning the nav bar complexity stays the same while the organizational model fundamentally improves.

---

## 3. Geographic Filter Model

### Options Evaluated

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| A. Persistent filter bar/dropdown | Filters all content at once, clear mental model | Extra UI chrome, mobile space concerns | **Recommended** |
| B. Per-category filter button | Granular control per topic | Too many controls, high interaction cost | Rejected |
| C. Separate "Local" pages per city | Clean URLs, SEO benefits | Fragments the experience, requires page loads | Rejected |
| D. Sidebar checkboxes | Familiar filter pattern | Sidebars collapse on mobile, adds layout complexity | Rejected |
| E. URL-based geographic routes | `/birmingham`, `/huntsville` | Forces single-geography view, loses topic organization | Rejected |

### Recommendation: Sticky Geographic Filter Chip Bar

**Pattern**: A single row of geographic filter chips positioned immediately below the topic navigation pills, within the sticky header. One chip is active at a time. The default state is "All Alabama" (no filter applied).

**Chips**:
| Label | Filter Slug | Sources Affected |
|---|---|---|
| All Alabama | `all` | Shows all 44 sources (default) |
| Birmingham | `birmingham` | 7 Birmingham sources + 8 Statewide sources |
| Huntsville | `huntsville` | 5 Huntsville sources + 8 Statewide sources |
| Mobile | `mobile` | 4 Mobile sources + 8 Statewide sources |
| Montgomery | `montgomery` | 4 Montgomery sources + 8 Statewide sources |
| Tuscaloosa | `tuscaloosa` | 3 Tuscaloosa sources + 8 Statewide sources |
| Auburn | `auburn` | 3 Auburn sources + 8 Statewide sources |

**Critical UX decision: Statewide sources ALWAYS show regardless of geographic filter.** The Alabama Reflector, Yellowhammer News, etc. cover the whole state. Filtering to "Birmingham" should show Birmingham-specific sources plus statewide sources. This prevents the filtered view from feeling empty and ensures users always see the major outlets.

**Implementation behavior**:
- Tapping a geographic chip filters all topic sections simultaneously.
- Topic sections with zero sources in the filtered geography collapse/hide entirely.
- The active chip gets the crimson treatment; others stay in the muted cream style.
- Filter state persists via URL query parameter (`?geo=birmingham`) for shareability and bookmarkability.
- Tapping the active chip again (or tapping "All Alabama") removes the filter.

**Why this pattern wins**:
1. **Low interaction cost**: One tap filters everything. No per-section controls.
2. **Discoverable**: Always visible in the header. Users understand immediately that geographic filtering is available.
3. **Mobile-friendly**: Chips are horizontally scrollable, just like the topic pills. Two rows in the header is acceptable because the geographic row is smaller/secondary.
4. **Reversible**: The "All Alabama" default is always one tap away.
5. **Shareable**: URL query parameter means a Birmingham reader can bookmark their filtered view.

### Visual Differentiation from Topic Nav

The geographic chips must be visually distinct from the topic pills to prevent confusion:

- **Topic pills**: Larger (px-4 py-1.5), rounded-full, bold weight, positioned on top row
- **Geo chips**: Smaller (px-3 py-1), rounded-full, regular weight, positioned on bottom row, prefixed with a small map-pin icon or subtle location indicator
- **Color**: Inactive geo chips use a slightly different tone (e.g., a very light crimson tint rather than cream-dark) to further distinguish the two rows
- **Label**: A tiny "Location:" label or map pin before the chips clarifies purpose

---

## 4. Homepage Layout Hierarchy

### The Problem with Equal Weight

Currently, every category section is rendered identically: a crimson-bordered heading followed by a card grid. This creates a monotonous scroll experience where nothing stands out. News sites universally use visual hierarchy to signal importance and recency.

### Recommended Homepage Structure (Top to Bottom)

```
+----------------------------------------------------------+
|  [STICKY HEADER]                                         |
|  Logo: Alabamy                          Last updated: 2h |
|  Topic: [Politics] [Crime] [Sports] [Business] [...]     |
|  Geo:   [All AL] [Bham] [HSV] [Mobile] [Montg] [...]    |
+----------------------------------------------------------+

+----------------------------------------------------------+
|                    HERO ZONE (Zone 1)                     |
|  "Alabama's News, All in One Place"                      |
|                                                          |
|  +--------------------------------------------------+   |
|  |  TOP STORIES -- 4-6 headline cards, larger format |   |
|  |  Mixed from across all categories + geographies   |   |
|  |  2-column on desktop, 1-column on mobile          |   |
|  |  Each card: Source name, Headline, Excerpt, Time  |   |
|  +--------------------------------------------------+   |
+----------------------------------------------------------+

+----------------------------------------------------------+
|              TOPIC SECTIONS (Zone 2)                      |
|                                                          |
|  [POLITICS & GOVERNMENT] ============================    |
|  +----------+ +----------+ +----------+                  |
|  | Source A  | | Source B  | | Source C  |                |
|  | * head 1  | | * head 1  | | * head 1  |              |
|  | * head 2  | | * head 2  | | * head 2  |              |
|  | * head 3  | | * head 3  | | * head 3  |              |
|  +----------+ +----------+ +----------+                  |
|                                                          |
|  [CRIME & COURTS] ===================================    |
|  +----------+ +----------+ +----------+                  |
|  | Source D  | | Source E  | | Source F  |                |
|  | ...       | | ...       | | ...       |               |
|  +----------+ +----------+ +----------+                  |
|                                                          |
|  [SPORTS] ============================================   |
|  (expanded -- more prominent)                            |
|  +----------+ +----------+ +----------+                  |
|  | AL Bama  | | AL Auburn | | Sat Down  |               |
|  | ...       | | ...       | | South ... |               |
|  +----------+ +----------+ +----------+                  |
|                                                          |
|  [...remaining categories...]                            |
+----------------------------------------------------------+

+----------------------------------------------------------+
|                    FOOTER                                 |
+----------------------------------------------------------+
```

### Zone 1: Hero / Top Stories

**Purpose**: Give users an immediate reason to stay. Surface the most compelling recent headlines regardless of topic or geography.

**Content**: The 4-6 most recently published headlines across all sources, deduplicated and selected based on recency. This is NOT editorially curated -- it is algorithmically determined by freshness (most recent `published_at` timestamps across all headlines).

**Layout**:
- Desktop: 2-column grid with the first card spanning full width as a "lead story"
- Mobile: Single column, lead story on top

**Card format for Top Stories (richer than standard source cards)**:
```
+-------------------------------------------+
|  ALABAMA REFLECTOR            2 hours ago  |
|                                           |
|  Legislature passes sweeping education    |
|  funding overhaul in late-night session   |
|                                           |
|  [First 120 chars of excerpt if avail]    |
+-------------------------------------------+
```

**Data requirement**: This requires storing or having access to a publication timestamp. The current schema has `published_at` (from RSS feeds) which works. For Firecrawl sources without publication dates, `fetched_at` serves as the fallback.

### Zone 2: Topic Sections (Weighted)

Not all topic sections should receive equal visual prominence. The section order and visual weight should reflect reader interest in Alabama.

**Tier 1 -- High Prominence (shown first, larger cards)**:
1. Politics & Government
2. Crime & Courts
3. Sports

**Tier 2 -- Standard Prominence**:
4. Business & Economy
5. Education
6. Faith & Religion

**Tier 3 -- Standard Prominence (lower position)**:
7. Health & Science
8. Military & Defense
9. Culture & Life
10. Weather & Environment

**Visual distinction by tier**:
- Tier 1 sections: Show up to 5 headlines per source card, 3-column grid
- Tier 2 sections: Show up to 4 headlines per source card, 3-column grid
- Tier 3 sections: Show up to 3 headlines per source card, 3-column grid (or shift to a denser 2-column layout)

This graduated density means users see the most important categories in full detail at the top of the page, while less-trafficked categories still appear but consume less vertical space. The page gets progressively denser as users scroll deeper.

### Why Not a "Breaking News" Banner?

A breaking news banner implies editorial judgment and real-time curation. Alabamy is an automated aggregator that fetches once daily (6 AM CT). A "BREAKING" label on a headline from 6 hours ago would feel stale and damage credibility. Instead, the "Top Stories" zone achieves the same goal (surfacing fresh content) without the editorial promise of "breaking."

If fetch frequency increases in the future (e.g., every 2 hours), a "Just In" label on headlines less than 2 hours old would be appropriate. But that is a future enhancement, not a launch feature.

---

## 5. Navigation Patterns

### Mobile-First Navigation Architecture

The navigation has three layers, all operating within the sticky header:

**Layer 1: Identity (fixed)**
- Alabamy wordmark logo (links to homepage)
- "Last updated" timestamp

**Layer 2: Topic Navigation (primary)**
- Horizontally scrollable pill bar
- 10 topic categories
- Active pill highlighted in crimson
- Scrolls to corresponding section via anchor links
- `scroll-padding-top` accounts for sticky header height

**Layer 3: Geographic Filter (secondary)**
- Horizontally scrollable chip bar (smaller than topic pills)
- 7 options: All Alabama + 6 metro areas
- Active chip in crimson
- Filters entire page content
- Query parameter for bookmarkability

### Mobile Considerations

**Header height budget**: On a 375px-wide iPhone, the header must not exceed ~120px total to preserve content viewport.

```
+-- Header Budget Breakdown --+
| Logo row:     44px          |
| Topic pills:  36px          |
| Geo chips:    32px          |
| Bottom border: 1px          |
| Total:        ~113px        |
+-----------------------------+
```

This is acceptable. The two-row navigation pattern is common on news sites (CNN, BBC, NPR all use it). The geographic row can collapse/hide on scroll-down and reappear on scroll-up (a "smart header" pattern) to reclaim space.

**Smart header behavior (recommended)**:
- Scroll down: Only logo row remains sticky. Topic and geo rows scroll away.
- Scroll up (any amount): Full header reappears with both nav rows.
- This preserves vertical viewport while keeping navigation one swipe away.

### Topic-to-Topic Navigation

**On-page**: Tapping a topic pill smooth-scrolls to that section. The IntersectionObserver pattern already in `category-nav.tsx` correctly highlights the active section as the user scrolls.

**Direct URL**: Each topic section has an `id` attribute for anchor linking. A URL like `alabamy.com/#sports` deep-links directly to the Sports section. Combined with geographic filtering: `alabamy.com/?geo=huntsville#sports` shows Huntsville-filtered content scrolled to Sports.

### User Flow Examples

**Flow 1: Birmingham sports fan**
1. Lands on homepage, sees Top Stories zone
2. Taps "Birmingham" geo chip -- page filters to Birmingham + statewide sources
3. Taps "Sports" topic pill -- scrolls to Sports section
4. Sees AL.com Bama Sports, AL.com Auburn Sports, Saturday Down South (statewide), plus any Birmingham-tagged sports sources
5. Bookmarks `alabamy.com/?geo=birmingham#sports`

**Flow 2: Huntsville defense worker**
1. Lands on homepage
2. Taps "Huntsville" geo chip
3. Scans through filtered sections: Politics, Business, Military & Defense all show Huntsville + statewide sources
4. Taps into a headline from Huntsville Business Journal

**Flow 3: Casual statewide reader**
1. Lands on homepage, no filter applied
2. Reads Top Stories zone
3. Scrolls through topic sections naturally
4. Never needs to interact with either nav bar

---

## 6. Content Density

### The Current Alltop Model

Each source card shows:
- Source name (crimson, uppercase, small)
- Up to 5 headline links (Georgia serif, 15px)
- Relative timestamp per headline

This model works well for its purpose. Each card occupies roughly 200-250px of vertical space and communicates "here is what this outlet is reporting right now" efficiently.

### Evaluation of Alternatives

| Format | Pros | Cons | Verdict |
|---|---|---|---|
| **5 headlines per card (current)** | High density, scannability, shows source breadth | No context beyond headline, no images | **Keep for standard sections** |
| **3 headlines + images** | More engaging, magazine feel | 3x the bandwidth, slower load, images from RSS are unreliable | Reject for aggregator model |
| **Dense link-list (Drudge style)** | Maximum information per pixel | Ugly, hard to scan, no source identity | Reject |
| **1 headline + excerpt per card** | Rich context per story | Dramatically reduces content density, loses the "scan all sources" value | Reject for standard sections |
| **Enriched format for Top Stories only** | Best of both worlds | Requires two card components | **Recommended hybrid** |

### Recommended Hybrid Approach

**Top Stories zone (Zone 1)**: Richer cards with source name, headline, excerpt (first 120 characters), and timestamp. No images (images from RSS feeds are unreliable and inconsistent -- some are thumbnails, some are missing, some are ads). The enriched text format provides context without the image reliability problem.

**Topic sections (Zone 2)**: Keep the current Alltop model of source name + 5 headlines + timestamps. This is the right format for "let me scan what everyone is reporting."

**Tiered headline counts by section priority**:
- Tier 1 topics (Politics, Crime, Sports): 5 headlines per source
- Tier 2 topics (Business, Education, Faith): 4 headlines per source
- Tier 3 topics (Health, Military, Culture, Weather): 3 headlines per source

This graduated approach means the page gets denser (more links per vertical pixel) as users scroll into less-trafficked sections. Total page length is shorter while still surfacing all sources.

### Content Density Math

**Current state**: 44 sources x 5 headlines = 220 headlines displayed, in 10 sections of equal size. Estimated page height: ~8000px on desktop (very long).

**Proposed state**:
- Top Stories: 6 headlines (enriched format): ~400px
- Tier 1 (3 sections, ~20 sources, 5 headlines each): ~3000px
- Tier 2 (3 sections, ~12 sources, 4 headlines each): ~1500px
- Tier 3 (4 sections, ~12 sources, 3 headlines each): ~1200px
- Estimated total: ~6100px on desktop

The redesign reduces page length by roughly 25% while improving scannability through visual hierarchy. With geographic filtering active, page length reduces further (roughly 50-60% of sources hidden).

---

## 7. Source-to-Category Mapping

### The Multi-Topic Challenge

The fundamental challenge of moving from geographic to topic-based categories is that **most news sources cover multiple topics**. AL.com Birmingham covers politics, crime, business, sports, and more. Assigning each source to a single topic category would be just as reductive as the current geographic model.

### Recommended Approach: Primary + Secondary Topic Tags

Each source receives a **primary topic** (its main beat or strongest coverage area) and one or more **secondary topics**. Sources appear in all sections matching their tags, but the primary tag determines where they appear most prominently.

**Source-to-Topic Mapping (44 sources)**:

| Source | Geo | Primary Topic | Secondary Topics |
|---|---|---|---|
| Alabama Reflector | statewide | politics | education |
| AL Political Reporter | statewide | politics | -- |
| Yellowhammer News | statewide | politics | business, faith |
| Alabama Daily News | statewide | politics | business |
| This Is Alabama | statewide | culture | faith |
| Made in Alabama | statewide | business | culture |
| 1819 News | statewide | politics | faith, culture |
| Reckon News | statewide | politics | culture |
| AL.com Birmingham | birmingham | crime | politics, business |
| BhamNow | birmingham | culture | business, education |
| Village Living | birmingham | culture | -- |
| Alabama News Center | birmingham | business | culture |
| Birmingham Biz Journal | birmingham | business | -- |
| WBRC FOX6 | birmingham | crime | weather, politics |
| WVTM 13 | birmingham | crime | weather, sports |
| AL.com Huntsville | huntsville | crime | politics, business |
| Huntsville Biz Journal | huntsville | business | military |
| Decatur Daily | huntsville | crime | politics |
| WHNT News 19 | huntsville | crime | weather |
| WAFF 48 | huntsville | crime | weather, military |
| AL.com Mobile | mobile | crime | politics, business |
| WKRG News 5 | mobile | crime | weather |
| Lagniappe Mobile | mobile | politics | culture, business |
| WSFA 12 | mobile | crime | weather, politics |
| AL.com Montgomery | montgomery | politics | crime |
| Montgomery Advertiser | montgomery | crime | politics |
| Dothan Eagle | montgomery | crime | politics |
| Opelika-Auburn News | montgomery | crime | sports, education |
| Tuscaloosa News | tuscaloosa | crime | sports, education |
| TimesDaily | tuscaloosa | crime | politics |
| Anniston Star | tuscaloosa | crime | politics |
| Auburn Villager | auburn | culture | education, sports |
| Sand Mountain Reporter | auburn | crime | politics |
| Gadsden Times | auburn | crime | politics |
| AL.com Bama Sports | statewide | sports | -- |
| AL.com Auburn Sports | statewide | sports | -- |
| Saturday Down South | statewide | sports | -- |
| Auburn Newsroom | auburn | sports | education |
| Governor's Office | statewide | politics | -- |
| AL Legislature | statewide | politics | -- |
| UA News | statewide | education | health, military |
| WBHM 90.3 | birmingham | politics | culture, health |
| WLRH 89.3 | huntsville | culture | politics, military |
| Alabama Public Radio | statewide | politics | education, culture |

### Display Logic

A source appears in a topic section if:
- Its primary topic matches the section, OR
- Any of its secondary topics match the section

When a source appears via secondary topic, it could be visually marked (e.g., slightly dimmed, or shown at end of the section card grid) to indicate it is not the source's primary beat. However, for launch, treating all matching sources equally is simpler and acceptable.

### Sources Per Topic Section (Estimated)

| Topic | Primary Sources | + Secondary Sources | Total |
|---|---|---|---|
| Politics & Government | 14 | +10 | ~24 |
| Crime & Courts | 14 | +4 | ~18 |
| Sports | 4 | +3 | ~7 |
| Business & Economy | 4 | +8 | ~12 |
| Education | 1 | +6 | ~7 |
| Faith & Religion | 0 | +4 | ~4 |
| Health & Science | 0 | +3 | ~3 |
| Military & Defense | 0 | +4 | ~4 |
| Culture & Life | 3 | +8 | ~11 |
| Weather & Environment | 0 | +6 | ~6 |

**Note on sparse categories**: Faith, Health, Military, and Weather have zero primary-topic sources. This is expected -- these are not beats covered by dedicated outlets in the current 44-source registry. They receive coverage via secondary-topic tagging from general-interest outlets. As the source list grows over time, dedicated sources for these beats could be added (e.g., Baptist Press Alabama, UAB Medicine News, Redstone Rocket newsletter).

### Handling Sparse Sections

For categories with fewer than 3 sources (after geographic filtering), the section should still render but with a smaller layout. A section with 1-2 cards should use a 1-column or 2-column layout rather than the 3-column grid to avoid visual emptiness.

An alternative for very sparse sections: group Tier 3 categories into a combined "More News" zone with a tab-switch between Health, Military, Culture, and Weather. This preserves the taxonomy while reducing visual clutter from near-empty sections.

---

## 8. Schema Changes Required

### Current Schema

```
sources: id, name, slug, url, feed_url, feed_type, category, active, last_fetched_at, created_at
headlines: id, source_id, title, url, published_at, fetched_at
```

The current `category` field on `sources` stores a single geographic slug (`statewide`, `birmingham`, etc.).

### Required Schema Changes

**Option A: Multi-tag via new join table (recommended)**

```sql
-- Rename existing category column for clarity
ALTER TABLE sources RENAME COLUMN category TO geo;

-- New table for topic tagging
CREATE TABLE source_topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source_id INTEGER NOT NULL REFERENCES sources(id),
  topic TEXT NOT NULL,        -- e.g., 'politics', 'crime', 'sports'
  is_primary INTEGER NOT NULL DEFAULT 0,  -- 1 = primary topic, 0 = secondary
  UNIQUE(source_id, topic)
);
CREATE INDEX idx_source_topics_topic ON source_topics(topic);
CREATE INDEX idx_source_topics_source ON source_topics(source_id);
```

This approach:
- Preserves the existing `category` column (renamed to `geo`) for geographic identity
- Adds a many-to-many relationship between sources and topics
- Supports primary vs. secondary topic distinction
- Allows future expansion (add new topics without schema change)
- Query for a topic section: `SELECT ... FROM sources JOIN source_topics ON ... WHERE topic = 'politics'`

**Option B: JSON array column (simpler, less flexible)**

```sql
ALTER TABLE sources ADD COLUMN topics TEXT DEFAULT '[]';  -- JSON array
ALTER TABLE sources ADD COLUMN primary_topic TEXT;
ALTER TABLE sources RENAME COLUMN category TO geo;
```

This stores topics as a JSON array on the source row. Simpler to implement but harder to query efficiently and loses relational integrity.

**Recommendation**: Option A (join table). The overhead is minimal and the query flexibility is substantially better, especially for building topic-filtered views efficiently.

### Query Changes

The current `getHeadlinesByCategory()` function groups by geographic `category`. The new version needs to:

1. Accept optional `geo` filter parameter
2. Group by topic instead of geography
3. Join through `source_topics` to determine section membership
4. Return sources ordered by primary-topic-first within each section

```typescript
// New query signature
export async function getHeadlinesByTopic(
  geoFilter?: string
): Promise<TopicGroup[]> {
  // 1. Fetch all active sources with headlines and topic tags
  // 2. If geoFilter provided, filter to sources where geo = geoFilter OR geo = 'statewide'
  // 3. Group sources by topic in display order
  // 4. Within each topic, sort primary-tagged sources first
  // 5. Return topic groups with sources and headlines
}
```

---

## 9. Wireframes

### Mobile Wireframe (375px width)

```
+---------------------------------------+
| [A] Alabamy           Updated: 2h ago |  <- 44px
|---------------------------------------|
| [Politics] [Crime] [Sports] [Biz] >>> |  <- 36px (scrollable)
|---------------------------------------|
| [pin] [All AL] [Bham] [HSV] [Mob] >> |  <- 32px (scrollable)
+=======================================+

+---------------------------------------+
|         TOP STORIES                   |
|                                       |
| +-----------------------------------+ |
| | ALABAMA REFLECTOR       2h ago    | |
| | Legislature passes sweeping       | |
| | education funding overhaul        | |
| | in late-night session             | |
| | First 120 chars of excerpt text   | |
| | that provides context...          | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | WBRC FOX6               3h ago    | |
| | Two arrested in connection with   | |
| | downtown Birmingham shooting      | |
| | Police responded to the 2100...   | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | AL.COM BAMA SPORTS       4h ago   | |
| | Nick Saban Jr. named to coaching  | |
| | staff in surprise announcement    | |
| +-----------------------------------+ |
|                                       |
+---------------------------------------+

+---------------------------------------+
| POLITICS & GOVERNMENT                 |
| ====================================  |
|                                       |
| +-----------------------------------+ |
| | ALABAMA REFLECTOR                 | |
| | * Legislature passes education    | |
| |   funding overhaul      2h ago    | |
| | * Governor signs executive order  | |
| |   on workforce dev      5h ago    | |
| | * Britt introduces federal        | |
| |   immigration bill     12h ago    | |
| | * State budget surplus exceeds    | |
| |   projections             1d ago  | |
| | * Ethics commission opens new     | |
| |   investigation           2d ago  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | AL POLITICAL REPORTER             | |
| | * Senate committee advances tax   | |
| |   reform package        3h ago    | |
| | * Interview: Speaker's vision     | |
| |   for 2026 session      8h ago    | |
| | * Campaign finance reports reveal | |
| |   record fundraising      1d ago  | |
| | * Redistricting challenge moves   | |
| |   to federal court        2d ago  | |
| | * Poll: Governor approval rating  | |
| |   holds steady            3d ago  | |
| +-----------------------------------+ |
|                                       |
| +-----------------------------------+ |
| | YELLOWHAMMER NEWS                 | |
| | * [5 headlines]                   | |
| +-----------------------------------+ |
|                                       |
| [... more source cards ...]          |
|                                       |
+---------------------------------------+

+---------------------------------------+
| CRIME & COURTS                        |
| ====================================  |
|                                       |
| +-----------------------------------+ |
| | WBRC FOX6                         | |
| | * [5 headlines]                   | |
| +-----------------------------------+ |
|                                       |
| [... more source cards ...]          |
|                                       |
+---------------------------------------+

+---------------------------------------+
| SPORTS                                |
| ====================================  |
|                                       |
| [... sports source cards ...]        |
|                                       |
+---------------------------------------+

[... remaining topic sections ...]

+---------------------------------------+
|           FOOTER                      |
| [icon] mike@alabamy.com              |
|        205-687-TALK                   |
|        (c) 2026 Alabamy. Boundless.  |
+---------------------------------------+
```

### Desktop Wireframe (1280px width)

```
+------------------------------------------------------------------+
| [A] Alabamy                                   Updated: 2h ago    |
|------------------------------------------------------------------|
| [Politics] [Crime] [Sports] [Business] [Education] [Faith]       |
| [Health] [Military] [Culture] [Weather]                          |
|------------------------------------------------------------------|
| [pin] [All Alabama] [Birmingham] [Huntsville] [Mobile]           |
|       [Montgomery] [Tuscaloosa] [Auburn]                         |
+==================================================================+

+------------------------------------------------------------------+
|                      TOP STORIES                                  |
|                                                                  |
| +------------------------------+  +----------------------------+ |
| | ALABAMA REFLECTOR   2h ago   |  | WBRC FOX6         3h ago  | |
| |                              |  |                            | |
| | Legislature passes sweeping  |  | Two arrested in            | |
| | education funding overhaul   |  | connection with downtown   | |
| | in late-night session        |  | Birmingham shooting        | |
| |                              |  |                            | |
| | First 120 chars of excerpt   |  | Police responded to the   | |
| | text that provides...        |  | 2100 block of...          | |
| +------------------------------+  +----------------------------+ |
|                                                                  |
| +-------------------+ +-------------------+ +------------------+ |
| | AL BAMA SPORTS    | | YELLOWHAMMER      | | HUNTSVILLE BIZ   | |
| | 4h ago            | | 5h ago            | | 6h ago           | |
| | Nick Saban Jr.    | | Governor signs     | | NASA awards $2B  | |
| | named to staff    | | workforce order    | | contract to HSV  | |
| +-------------------+ +-------------------+ +------------------+ |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
| POLITICS & GOVERNMENT                                             |
| ================================================================  |
|                                                                  |
| +-------------------+ +-------------------+ +------------------+ |
| | AL REFLECTOR      | | AL POLITICAL RPT  | | YELLOWHAMMER     | |
| | * headline 1      | | * headline 1      | | * headline 1     | |
| | * headline 2      | | * headline 2      | | * headline 2     | |
| | * headline 3      | | * headline 3      | | * headline 3     | |
| | * headline 4      | | * headline 4      | | * headline 4     | |
| | * headline 5      | | * headline 5      | | * headline 5     | |
| +-------------------+ +-------------------+ +------------------+ |
|                                                                  |
| +-------------------+ +-------------------+ +------------------+ |
| | AL DAILY NEWS     | | 1819 NEWS         | | RECKON NEWS      | |
| | * headline 1      | | * headline 1      | | * headline 1     | |
| | * headline 2      | | * headline 2      | | * headline 2     | |
| | * headline 3      | | * headline 3      | | * headline 3     | |
| | * headline 4      | | * headline 4      | | * headline 4     | |
| | * headline 5      | | * headline 5      | | * headline 5     | |
| +-------------------+ +-------------------+ +------------------+ |
|                                                                  |
| +-------------------+ +-------------------+                      |
| | GOVERNOR'S OFFICE | | AL LEGISLATURE    |                      |
| | * headline 1      | | * headline 1      |                      |
| | * headline 2      | | * headline 2      |                      |
| | * headline 3      | | * headline 3      |                      |
| | * headline 4      | | * headline 4      |                      |
| | * headline 5      | | * headline 5      |                      |
| +-------------------+ +-------------------+                      |
+------------------------------------------------------------------+

| CRIME & COURTS                                                    |
| ================================================================  |
| [...3-column grid of crime-tagged sources...]                    |

| SPORTS                                                            |
| ================================================================  |
| [...3-column grid of sports sources...]                          |

[...remaining sections with graduated headline counts...]
```

### Filtered State Wireframe (Birmingham selected)

```
+------------------------------------------------------------------+
| [pin] [All Alabama] [*BIRMINGHAM*] [Huntsville] [Mobile] ...     |
+==================================================================+

| POLITICS & GOVERNMENT                                             |
| ================================================================  |
| Shows: AL Reflector, AL Political Reporter, Yellowhammer,        |
|        AL Daily News, 1819 News, Reckon News (statewide)         |
|        + WBHM 90.3, AL.com Birmingham (birmingham-tagged)        |
|        + Governor, Legislature (statewide)                        |

| CRIME & COURTS                                                    |
| ================================================================  |
| Shows: AL.com Birmingham, WBRC FOX6, WVTM 13 (birmingham)       |
|        + statewide crime sources                                  |

| SPORTS                                                            |
| ================================================================  |
| Shows: AL.com Bama Sports, AL.com Auburn Sports,                 |
|        Saturday Down South (statewide)                            |
|        + WVTM 13 secondary sports tag (birmingham)               |

| BUSINESS & ECONOMY                                                |
| ================================================================  |
| Shows: Made in Alabama (statewide), AL Daily News (statewide)    |
|        + AL News Center, Birmingham Biz Journal, BhamNow (bham)  |

| FAITH & RELIGION                                                  |
| ================================================================  |
| Shows: Yellowhammer, 1819 News, This Is Alabama (statewide)     |
| Note: Only 3-4 cards. Section still renders but in compact mode. |

| HEALTH & SCIENCE    -- May be HIDDEN if 0 sources after filter   |
| MILITARY & DEFENSE  -- May be HIDDEN if 0 sources after filter   |

| CULTURE & LIFE                                                    |
| Shows: This Is Alabama (statewide), BhamNow, Village Living     |

| WEATHER & ENVIRONMENT                                             |
| Shows: WBRC FOX6, WVTM 13 (secondary weather tag)              |
```

---

## 10. Implementation Priority

### Phase 1: Schema Migration (Prerequisite)
1. Add `source_topics` join table
2. Rename `category` to `geo` on `sources` table
3. Seed topic tags for all 44 sources (using the mapping from Section 7)
4. Update seed script

### Phase 2: Query Layer
1. Create `getHeadlinesByTopic(geoFilter?)` replacing `getHeadlinesByCategory()`
2. Create `getTopStories(geoFilter?, limit?)` for the hero zone
3. Update type exports (`TopicGroup` replacing `CategoryGroup`)

### Phase 3: Navigation Components
1. Redesign `category-nav.tsx` with topic slugs and labels
2. Create new `geo-filter.tsx` chip bar component
3. Update `header.tsx` to contain both navigation layers
4. Implement smart header show/hide behavior on scroll

### Phase 4: Homepage Layout
1. Create `top-stories.tsx` component with enriched card format
2. Update `page.tsx` to render Zone 1 (Top Stories) + Zone 2 (Topic Sections)
3. Update `category-section.tsx` to support tiered headline counts
4. Implement geographic filtering via URL query parameter and client-side state
5. Handle empty/sparse sections gracefully

### Phase 5: Polish
1. URL state management (`?geo=birmingham#sports`)
2. Scroll restoration on filter change
3. Smooth transitions when sections appear/disappear on filter toggle
4. Mobile testing and header height validation
5. Accessibility: ARIA labels on filter chips, keyboard navigation, screen reader support

### Estimated Implementation Effort

| Phase | Effort | Key Risk |
|---|---|---|
| Schema Migration | 1 day | Turso migration without data loss |
| Query Layer | 1 day | Performance with join table on 44 sources |
| Navigation Components | 2 days | Mobile header height, scroll behavior |
| Homepage Layout | 2 days | Top Stories selection algorithm, tiered density |
| Polish | 1-2 days | Edge cases with filtered empty sections |
| **Total** | **7-9 days** | |

---

## Appendix A: Research Sources

- [Information Architecture Trends for UX Design](https://slickplan.com/blog/information-architecture-trends) -- 2026 IA trends including AI-driven personalization
- [NN/Group Information Architecture](https://www.nngroup.com/topic/information-architecture/) -- Nielsen Norman Group IA research corpus
- [Mobile Filter UX Design Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-mobile-filters) -- Mobile filtering best practices
- [Mobile Navigation UX Best Practices 2026](https://www.designstudiouiux.com/blog/mobile-navigation-ux/) -- Mobile-first navigation patterns
- [Filtering UX/UI Design Patterns](https://blog.logrocket.com/ux-design/filtering-ux-ui-design-patterns-best-practices/) -- Filter pattern analysis
- [Pew Research: Religion in Alabama](https://www.pewresearch.org/religious-landscape-study/state/alabama/) -- Alabama religious demographics
- [Alabama Tied for 2nd Most Religious State](https://thealabamabaptist.org/alabama-tied-for-2nd-most-religious-state-in-us-new-survey-finds/) -- Faith relevance data
- [Redstone Arsenal Economic Impact](https://cityblog.huntsvilleal.gov/redstone-arsenal-driving-economic-impact-and-shaping-huntsvilles-future/) -- Military/defense economic data ($36.2B annual impact)
- [Bible Belt States 2026](https://worldpopulationreview.com/state-rankings/bible-belt-states) -- Cultural context for Faith category inclusion

## Appendix B: Key Files Affected

All paths are relative to `/Users/mikemccartin/Documents/Claude-Projects/claude-misc/alabamy/`:

| File | Change Type | Description |
|---|---|---|
| `src/db/schema.ts` | Modify | Add `source_topics` table, rename `category` to `geo` |
| `src/db/seed.ts` | Modify | Add topic tag seeding for all 44 sources |
| `src/lib/queries.ts` | Rewrite | New `getHeadlinesByTopic()` and `getTopStories()` |
| `src/components/category-nav.tsx` | Rewrite | Topic-based pills instead of geographic |
| `src/components/header.tsx` | Modify | Add geo-filter row |
| `src/components/geo-filter.tsx` | New | Geographic chip bar component |
| `src/components/top-stories.tsx` | New | Enriched hero zone cards |
| `src/components/category-section.tsx` | Modify | Support tiered headline counts |
| `src/app/page.tsx` | Rewrite | New layout with Zone 1 + Zone 2, filter state |
| `src/app/globals.css` | Minor | Any new utility classes needed |
| `PROJECT_PLAN.md` | Update | Reflect new architecture |
