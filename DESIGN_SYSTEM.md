# Alabamy Design System

**Date**: 2026-02-19
**Status**: Proposed
**Scope**: Complete visual identity and Tailwind-based design system for alabamy.com

---

## 1. Brand Asset Audit

### Wordmark (`/public/alabamy-wordmark.png`)

**What it is**: The word "Alabamy" in a dark charcoal/near-black geometric sans-serif on a transparent background. The image is wide-format (approximately 4.3:1 width-to-height ratio).

**Font identification**: The wordmark uses a geometric sans-serif with these distinctive characteristics:
- Pointed apex on the capital "A" (not flat-topped like Futura)
- Circular/geometric bowl on the lowercase "a" (single-story)
- Clean, even stroke width (low contrast)
- Generous letter-spacing
- Modern, friendly feel without being bubbly

This is most consistent with fonts in the **Urbanist** / **Outfit** / **Plus Jakarta Sans** family of modern geometric grotesques. The closest Google Font match is **Outfit** -- it has the same pointed A apex, circular lowercase bowls, consistent stroke width, and clean geometric construction. **Urbanist** is the second-closest match.

**Current problem**: The wordmark is rendered in dark charcoal (#333-ish), NOT white as stated in CLAUDE.md. On the `#111111` header background, this creates extremely low contrast -- the logo virtually disappears. This is the root cause of the "hard to read" issue.

**Fix options** (ranked):
1. **Generate a white version** of the wordmark for dark backgrounds (invert/recolor in image editor)
2. **Switch to a light/cream header** and use the existing dark wordmark
3. **Replace the PNG with a text-based logo** using Outfit font at the correct weight, giving full control over color via CSS

### Icon (`/public/alabamy-icon.png`)

**What it is**: A stylized Alabama state flag saltire (St. Andrew's cross / X pattern). The icon uses a dark charcoal saltire on a medium-dark gray field. It is NOT the traditional crimson-on-white -- it has been adapted into a monochrome dark treatment.

**Aspect ratio**: The image is a **landscape rectangle**, approximately **1200x800 pixels** (3:2 ratio). This matches the common Alabama flag proportion.

**Current problem**: In the footer, it is forced into a 40x40 square (`w-10 h-10`), which distorts the flag from its natural 3:2 rectangular proportion.

**Fix**: Display at correct 3:2 ratio. Recommended sizes:
- Footer: `w-[60px] h-[40px]` or `w-15 h-10` (Tailwind)
- Favicon/small: Use the existing square `apple-touch-icon.png` for square contexts
- Header (if used): `w-[48px] h-[32px]`

The Next.js Image component should use: `width={60} height={40}` with `className="w-auto h-10"` to maintain aspect ratio.

---

## 2. Font Recommendations

### The Problem

Three font families are in play but they have no visual relationship:
- **Wordmark**: Geometric sans-serif (Outfit-like)
- **Headings**: Raleway -- a thin elegant sans with distinctive "W" and decorative feel
- **Body**: Inter -- a neutral UI sans-serif
- **Headlines**: Georgia -- a traditional serif

Raleway's decorative character clashes with the wordmark's clean geometry. The result feels like three different design systems fighting each other.

### Recommended Font Stack

#### Primary: **Outfit** (Display / Headings / UI)
- **Role**: Page headings, category names, navigation pills, hero text, buttons
- **Why**: Closest match to the wordmark font. Creates visual continuity between the logo and the typographic hierarchy. Geometric but friendly. Excellent weight range (100-900).
- **Weights to load**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Google Fonts**: `Outfit`

#### Secondary: **Source Serif 4** (Headlines / Reading Text)
- **Role**: Headline text within source cards (replacing Georgia)
- **Why**: More refined than Georgia, optimized for screen rendering, excellent at 15-18px sizes. Has the editorial gravitas appropriate for news headlines without feeling dated. Variable font available.
- **Weights to load**: 400 (Regular), 600 (SemiBold)
- **Google Fonts**: `Source Serif 4`

#### Tertiary: **Inter** (Body / Small UI / Metadata)
- **Role**: Timestamps, meta text, footer content, any small utility text
- **Why**: Already in use, excellent for small sizes and UI elements. Keep it but demote it from body-level importance. Inter is the industry standard for UI text.
- **Weights to load**: 400 (Regular), 500 (Medium), 600 (SemiBold)
- **Google Fonts**: `Inter`

### Font Hierarchy Summary

| Element | Font | Weight | Size | Tracking |
|---------|------|--------|------|----------|
| Logo / brand | Outfit (or wordmark PNG) | 400 | 24-32px | +0.02em |
| Page title (H1) | Outfit | 700 | 30-36px | -0.025em |
| Section heading (H2) | Outfit | 600 | 24px | -0.01em |
| Source name label | Outfit | 600 | 13px | +0.08em (uppercase) |
| Nav pills | Outfit | 500 | 14px | 0 |
| Headline text (cards) | Source Serif 4 | 400 | 15-16px | 0 |
| Timestamp | Inter | 400 | 12px | 0 |
| Footer text | Inter | 400 | 14px | 0 |
| Buttons / CTAs | Outfit | 600 | 14px | +0.02em |
| Tagline "Boundless." | Outfit | 300 | 16px | +0.15em (uppercase) |

### Implementation in `layout.tsx`

```tsx
import { Inter, Outfit, Source_Serif_4 } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

// On <body>:
className={`${inter.variable} ${outfit.variable} ${sourceSerif.variable}`}
```

### Implementation in `globals.css`

```css
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-source-serif), Georgia, "Times New Roman", serif;
}
```

---

## 3. Expanded Color Palette

### Design Philosophy

The current palette is close but too narrow. It needs:
- More shades of crimson for hover states, backgrounds, and subtle accents
- A warm neutral scale that goes beyond just cream/ink
- A secondary accent color for variety (gold/amber to evoke Alabama warmth)
- Semantic colors for success/warning states (future-proofing)

### Full Palette

#### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `crimson-50` | `#FEF2F4` | Crimson tint background, subtle highlight |
| `crimson-100` | `#FDE6EA` | Light crimson wash, selected state bg |
| `crimson-200` | `#F9BCC6` | Crimson border on light backgrounds |
| `crimson-300` | `#F28A9B` | Lighter accent, tag backgrounds |
| `crimson-400` | `#E14D66` | Medium crimson, secondary buttons |
| `crimson-500` | `#C41E3A` | **Primary crimson** -- source labels, active nav, category borders |
| `crimson-600` | `#A01830` | Hover state on crimson elements |
| `crimson-700` | `#7D1225` | Pressed state, deep accent |
| `crimson-800` | `#5A0D1B` | Very dark crimson (text on light crimson bg) |
| `crimson-900` | `#3D0912` | Near-black crimson |

#### Warm Accent (Gold/Amber)

| Token | Hex | Usage |
|-------|-----|-------|
| `gold-50` | `#FFFBF0` | Gold tint background |
| `gold-100` | `#FFF3D6` | Light gold wash |
| `gold-200` | `#FFE4A8` | Gold highlight |
| `gold-300` | `#FFD074` | Medium gold accent |
| `gold-400` | `#F5B638` | **Primary gold** -- secondary accent, featured badges |
| `gold-500` | `#D99B1E` | Gold on white text |
| `gold-600` | `#B07D15` | Hover gold |

#### Neutral Scale (Warm)

| Token | Hex | Usage |
|-------|-----|-------|
| `warm-50` | `#FAFAF8` | **Page background** (existing "cream") |
| `warm-100` | `#F5F3EF` | Alternate section background |
| `warm-200` | `#F0EDE7` | **Hover states** (existing "cream-dark") |
| `warm-300` | `#EBE8E2` | **Card borders** (existing "card-border") |
| `warm-400` | `#D5D1C9` | Dividers, disabled borders |
| `warm-500` | `#B5B1A9` | Placeholder text |
| `warm-600` | `#8A8A84` | **Muted text** (existing "ink-muted") |
| `warm-700` | `#6A6A64` | Tertiary text |
| `warm-800` | `#4A4A46` | **Secondary text** (existing "ink-secondary") |
| `warm-900` | `#2A2A26` | Heavy secondary text |
| `warm-950` | `#1A1A18` | **Primary text** (existing "ink") |

#### Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-white` | `#FFFFFF` | Card backgrounds |
| `surface-cream` | `#FAFAF8` | Page background |
| `surface-dark` | `#1A1A18` | Dark header/footer background |
| `surface-darker` | `#111111` | Deepest dark (use sparingly) |

### Implementation in `globals.css`

```css
@theme {
  /* Crimson scale */
  --color-crimson-50: #FEF2F4;
  --color-crimson-100: #FDE6EA;
  --color-crimson-200: #F9BCC6;
  --color-crimson-300: #F28A9B;
  --color-crimson-400: #E14D66;
  --color-crimson-500: #C41E3A;
  --color-crimson-600: #A01830;
  --color-crimson-700: #7D1225;
  --color-crimson-800: #5A0D1B;
  --color-crimson-900: #3D0912;

  /* Gold accent */
  --color-gold-50: #FFFBF0;
  --color-gold-100: #FFF3D6;
  --color-gold-200: #FFE4A8;
  --color-gold-300: #FFD074;
  --color-gold-400: #F5B638;
  --color-gold-500: #D99B1E;
  --color-gold-600: #B07D15;

  /* Warm neutrals */
  --color-warm-50: #FAFAF8;
  --color-warm-100: #F5F3EF;
  --color-warm-200: #F0EDE7;
  --color-warm-300: #EBE8E2;
  --color-warm-400: #D5D1C9;
  --color-warm-500: #B5B1A9;
  --color-warm-600: #8A8A84;
  --color-warm-700: #6A6A64;
  --color-warm-800: #4A4A46;
  --color-warm-900: #2A2A26;
  --color-warm-950: #1A1A18;

  /* Semantic aliases (backward compatible) */
  --color-cream: #FAFAF8;
  --color-cream-dark: #F0EDE7;
  --color-card-border: #EBE8E2;
  --color-ink: #1A1A18;
  --color-ink-secondary: #4A4A46;
  --color-ink-muted: #8A8A84;
  --color-crimson: #C41E3A;
  --color-crimson-dark: #A01830;
  --color-header-bg: #1A1A18;
  --color-header-text: #FAFAF8;
}
```

**Note**: The backward-compatible semantic aliases ensure all existing component classes still work. New components should prefer the numbered scale (e.g., `crimson-500` instead of `crimson`).

---

## 4. Typography Scale

### Size Scale

Defined as Tailwind `@theme` tokens mapped to rem values. Based on a modular scale with 1rem = 16px base.

| Token | Size | px | Use |
|-------|------|----|-----|
| `--text-xs` | 0.75rem | 12px | Timestamps, badges, meta |
| `--text-sm` | 0.875rem | 14px | Nav pills, small labels, footer |
| `--text-base` | 1rem | 16px | Default body text |
| `--text-lg` | 1.125rem | 18px | Lead paragraphs, emphasis |
| `--text-xl` | 1.25rem | 20px | Subheadings |
| `--text-2xl` | 1.5rem | 24px | Section headings (H2) |
| `--text-3xl` | 1.875rem | 30px | Page titles mobile |
| `--text-4xl` | 2.25rem | 36px | Page titles desktop (H1) |
| `--text-5xl` | 3rem | 48px | Hero text (if needed) |

### Line Height Rules

| Context | Value | Reason |
|---------|-------|--------|
| Headings (display) | 1.15 - 1.25 | Tight, punchy, editorial |
| Body / UI text | 1.5 | Comfortable reading |
| Small text | 1.4 | Slightly tighter at small sizes |
| Headlines in cards | 1.35 | Between heading and body -- readable but compact |

### Weight Usage

| Weight | Name | Where |
|--------|------|-------|
| 300 | Light | Tagline "Boundless." treatment |
| 400 | Regular | Body text, headline card text, timestamps |
| 500 | Medium | Nav pills, interactive elements |
| 600 | SemiBold | Section headings, source labels, buttons |
| 700 | Bold | Page title (H1), strong emphasis |

### Practical Tailwind Classes

```html
<!-- H1: Page Title -->
<h1 class="font-display text-3xl sm:text-4xl font-bold text-warm-950 tracking-tight leading-[1.15]">

<!-- H2: Category Section Header -->
<h2 class="font-display text-2xl font-semibold text-warm-950 tracking-tight leading-[1.2]">

<!-- Source Name (uppercase label) -->
<h3 class="font-display text-[13px] font-semibold uppercase tracking-widest text-crimson-500">

<!-- Headline Text (serif) -->
<span class="font-serif text-[15px] leading-[1.35] text-warm-950">

<!-- Nav Pill -->
<span class="font-display text-sm font-medium">

<!-- Timestamp -->
<span class="text-xs text-warm-600">

<!-- Tagline -->
<span class="font-display text-base font-light uppercase tracking-[0.15em] text-warm-600">
```

---

## 5. Spacing & Layout Grid System

### Spacing Scale

Uses Tailwind's default 4px base unit. No custom tokens needed -- Tailwind v4 covers this natively.

| Purpose | Tailwind Class | Value |
|---------|----------------|-------|
| Inline tight | `gap-1` / `space-x-1` | 4px |
| Inline standard | `gap-2` / `space-x-2` | 8px |
| Component internal padding | `p-4` / `p-5` | 16px / 20px |
| Between related elements | `gap-3` / `mb-3` | 12px |
| Between components | `gap-5` | 20px |
| Section internal | `gap-6` / `mb-6` | 24px |
| Between sections | `gap-8` / `mb-8` | 32px |
| Major section spacing | `space-y-12` | 48px |
| Page top/bottom | `py-8` | 32px |

### Container System

```html
<!-- Standard page container -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

<!-- Narrow content container (for about pages, text content) -->
<div class="max-w-3xl mx-auto px-4 sm:px-6">

<!-- Full-bleed section with inner container -->
<section class="bg-warm-100 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

### Responsive Grid

```html
<!-- Source card grid (primary layout) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

<!-- Two-column layout -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

<!-- Sidebar layout (future) -->
<div class="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
```

### Breakpoints (Tailwind defaults, no overrides needed)

| Breakpoint | Min-width | Usage |
|------------|-----------|-------|
| (default) | 0px | Single column, mobile-first |
| `sm:` | 640px | Minor adjustments (padding, text size) |
| `md:` | 768px | Two-column card grid |
| `lg:` | 1024px | Three-column grid, sidebar layouts |
| `xl:` | 1280px | Matches max-w-7xl, minor refinements |

---

## 6. Component Patterns

### 6.1 Header

**Current issue**: Dark `#111111` background with dark charcoal wordmark = invisible logo.

**Recommended approach**: Warm cream header with a crimson accent line.

```html
<header class="sticky top-0 z-50 bg-warm-50 border-b border-warm-300 shadow-sm">
  <!-- Thin crimson accent line at very top -->
  <div class="h-0.5 bg-crimson-500"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between py-3">
      <!-- Logo area -->
      <a href="/" class="flex items-center gap-3">
        <img src="/alabamy-icon.png" alt="" class="h-8 w-auto" aria-hidden="true" />
        <img src="/alabamy-wordmark.png" alt="Alabamy" class="h-7 w-auto" />
      </a>

      <!-- Right side: tagline or utility links -->
      <span class="hidden sm:block font-display text-sm font-light uppercase tracking-[0.15em] text-warm-600">
        Boundless.
      </span>
    </div>

    <!-- Category navigation -->
    <nav class="flex gap-2 overflow-x-auto py-2 pb-3 scrollbar-hide">
      <!-- pills here -->
    </nav>
  </div>
</header>
```

**Why cream instead of dark**:
- The wordmark is dark charcoal on transparent -- it reads naturally on light backgrounds
- A light header feels warmer and more approachable (matches the "engaging, warm" goal)
- The thin crimson accent line gives visual distinction without heaviness
- News aggregators like Google News, Apple News, and Feedly all use light headers
- The dark header can move to the footer where it creates a strong bookend

**Alternative (if dark header is preferred)**: Generate a white version of the wordmark PNG, or render the logo as text using Outfit font in CSS (giving full color control).

### 6.2 Category Navigation Pills

```html
<!-- Active pill -->
<a class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-display font-medium
          bg-crimson-500 text-white shadow-sm transition-all">
  Statewide
</a>

<!-- Inactive pill -->
<a class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-display font-medium
          bg-warm-200 text-warm-800 hover:bg-warm-300 transition-all">
  Birmingham
</a>
```

### 6.3 Category Section Header

```html
<div class="flex items-center gap-3 border-b border-warm-300 pb-3 mb-6">
  <div class="w-1 h-6 bg-crimson-500 rounded-full"></div>
  <h2 class="font-display text-2xl font-semibold text-warm-950 tracking-tight">
    Statewide News
  </h2>
</div>
```

**Change from current**: Replace the full-width `border-b-2 border-crimson` with a vertical crimson bar accent on the left. This is more refined and creates a distinctive editorial look without the heaviness of a full crimson underline.

### 6.4 Source Card

```html
<article class="bg-white rounded-xl border border-warm-300 p-5
                hover:shadow-md hover:border-warm-400 transition-all duration-200">
  <!-- Source header -->
  <div class="flex items-center justify-between mb-4">
    <h3 class="font-display text-[13px] font-semibold uppercase tracking-widest text-crimson-500">
      Alabama Reflector
    </h3>
    <a href="https://alabamareflector.com"
       class="text-xs text-warm-600 hover:text-crimson-500 transition-colors"
       target="_blank" rel="noopener">
      Visit site
    </a>
  </div>

  <!-- Headlines list -->
  <ul class="space-y-2.5">
    <!-- HeadlineItems here -->
  </ul>
</article>
```

**Changes from current**:
- `rounded-lg` to `rounded-xl` -- slightly softer, more modern
- Added "Visit site" link for the source (useful for discovery)
- Slightly more spacing between headlines (2.5 vs 2)
- Border hover effect for tactile feedback

### 6.5 Headline Item

```html
<li>
  <a href="..." target="_blank" rel="noopener" class="group block py-0.5">
    <span class="font-serif text-[15px] leading-[1.35] text-warm-950
                 group-hover:text-crimson-500 transition-colors">
      Alabama lawmakers advance bill to expand broadband access
    </span>
    <span class="block text-xs text-warm-600 mt-1">
      3h ago
    </span>
  </a>
</li>
```

### 6.6 Footer

The footer becomes the "dark bookend" -- taking over the dark background treatment from the header.

```html
<footer class="bg-warm-950 text-warm-50 mt-16">
  <!-- Crimson accent line -->
  <div class="h-0.5 bg-crimson-500"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <!-- Brand -->
      <div class="flex items-center gap-4">
        <img src="/alabamy-icon.png" alt="" class="h-10 w-auto" aria-hidden="true" />
        <div>
          <span class="font-display text-lg font-medium text-warm-50">Alabamy</span>
          <span class="block font-display text-xs font-light uppercase tracking-[0.15em] text-warm-500 mt-0.5">
            Boundless.
          </span>
        </div>
      </div>

      <!-- Contact -->
      <div class="text-sm text-warm-500 space-y-1">
        <p>
          <a href="mailto:mike@alabamy.com" class="hover:text-warm-300 transition-colors">
            mike@alabamy.com
          </a>
          <span class="mx-2">|</span>
          <a href="tel:+12056878255" class="hover:text-warm-300 transition-colors">
            205-687-TALK
          </a>
        </p>
        <p>&copy; 2026 Alabamy. All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>
```

### 6.7 Hero Section

```html
<div class="pt-8 pb-6 sm:pt-10 sm:pb-8">
  <h1 class="font-display text-3xl sm:text-4xl font-bold text-warm-950 tracking-tight leading-[1.15] mb-3">
    Alabama's News, All in One Place
  </h1>
  <div class="flex items-center gap-4">
    <span class="inline-block text-xs text-warm-600 bg-warm-200 px-3 py-1 rounded-full">
      Last updated: 2h ago
    </span>
    <span class="text-sm text-warm-600">
      44 sources across 10 regions
    </span>
  </div>
</div>
```

---

## 7. Icon Aspect Ratio Fix

### The Problem

The icon (`alabamy-icon.png`) is a landscape rectangle (approximately 3:2 ratio, matching the Alabama state flag proportion). The current code forces it into a square:

```tsx
// CURRENT (broken):
<Image src="/alabamy-icon.png" alt="Alabamy" width={40} height={40} className="w-10 h-10" />
```

This squishes the horizontal dimension, making the saltire X look compressed.

### The Fix

```tsx
// CORRECT:
<Image
  src="/alabamy-icon.png"
  alt="Alabamy"
  width={60}
  height={40}
  className="h-10 w-auto"
/>
```

**Key points**:
- Set `height` to the desired display height (40px = h-10)
- Set `width` proportionally (60px for 3:2 ratio)
- Use `w-auto` so the browser calculates width from the intrinsic aspect ratio
- NEVER set both `w-` and `h-` to the same value for this non-square image

### Size guide by context

| Context | Height | Width (auto) | Tailwind |
|---------|--------|-------------|----------|
| Footer | 40px | ~60px | `h-10 w-auto` |
| Header (if used) | 32px | ~48px | `h-8 w-auto` |
| Large display | 64px | ~96px | `h-16 w-auto` |
| Favicon contexts | Use `apple-touch-icon.png` instead (already square) |

---

## 8. Aesthetic Direction: What Should Alabamy FEEL Like?

### The Vision

Alabamy should feel like **a well-curated front porch** -- a warm, welcoming place where Alabamians come to see what is happening across their state. Not a cold data dashboard. Not a flashy news app. A calm, trustworthy, comprehensive view.

### Aesthetic Principles

**1. Warm, not cold.**
The cream background, warm neutrals, and serif headlines create an inviting reading environment. This is the antithesis of dark-mode tech interfaces. It should feel like opening a quality morning newspaper -- familiar, trusted, warm.

**2. Editorial, not generic.**
The combination of a geometric display font (Outfit) with a quality serif (Source Serif 4) creates an editorial voice. Category sections with vertical crimson accents feel like a newspaper's section headers. Uppercase source labels read like bylines.

**3. Distinctly Alabama, not kitschy.**
The crimson palette directly references the state flag and university culture without turning into a fan site. The gold accent adds Southern warmth. The icon IS the state flag, reimagined in a modern monochrome treatment. "Boundless." as a tagline transforms the folk song reference into something aspirational.

**4. Clean, not cluttered.**
With 44 sources and hundreds of headlines, visual clarity is paramount. Generous whitespace, clear card boundaries, and a strong typographic hierarchy let readers scan quickly. The cream background and white cards create a natural content/surface distinction.

**5. Trustworthy, not flashy.**
No animations for the sake of animation. No gradients. No stock photography. The design earns trust through consistency, readability, and professionalism. It should feel as reliable as the morning news.

### Mood References

- **Google News** (layout density, clean cards)
- **Drudge Report** (headline focus, comprehensive coverage -- but with actual design)
- **The Athletic** (editorial serif usage, premium card layouts)
- **Apple News** (warm tones, typography-first approach)

### What NOT to Do

- Do not use the full Alabama state flag colors (crimson + white) as primary navigation colors -- it reads as a government site
- Do not use script/handwritten fonts for "Southern charm" -- it reads as a restaurant menu
- Do not use blue as an accent -- it conflicts with crimson and reads as generic tech
- Do not use dark mode as the default -- the warm cream establishes the brand personality
- Do not add stock photos of Alabama landmarks -- the content IS the attraction

---

## 9. Implementation Priority

### Phase 1: Foundation (No Visual Change Yet)
1. Add Outfit and Source Serif 4 to `layout.tsx` font imports
2. Update `globals.css` with expanded color palette and new font stacks
3. Verify build succeeds with new fonts loading

### Phase 2: Typography Swap
4. Replace `font-display` (Raleway) references with Outfit throughout components
5. Replace `font-serif` (Georgia) references with Source Serif 4
6. Adjust weights and tracking per the typography scale above

### Phase 3: Header Redesign
7. Switch header to light/cream background
8. Add crimson accent line
9. Fix icon aspect ratio in both header (if used) and footer
10. Add "Boundless." tagline placement

### Phase 4: Component Refinement
11. Update source cards (rounded-xl, hover border, spacing)
12. Update category section headers (vertical crimson bar)
13. Update nav pills to use Outfit
14. Refine footer with dark bookend pattern

### Phase 5: Color Expansion
15. Replace hardcoded hex values with new palette tokens
16. Add gold accent where appropriate (featured badges, secondary CTAs)
17. Ensure all hover/active/focus states use appropriate palette shades

---

## 10. File Changes Summary

### Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Add Outfit + Source Serif 4 imports, remove Raleway |
| `src/app/globals.css` | Expanded color palette, updated font stacks |
| `src/components/header.tsx` | Light background, crimson accent, icon fix |
| `src/components/footer.tsx` | Icon aspect ratio fix, refined layout |
| `src/components/category-section.tsx` | Vertical crimson bar heading style |
| `src/components/category-nav.tsx` | font-display class (now Outfit) |
| `src/components/source-card.tsx` | rounded-xl, refined spacing |
| `src/components/headline-item.tsx` | Updated color classes to warm-* scale |
| `src/components/last-updated.tsx` | Updated color classes |
| `src/app/page.tsx` | Hero section refinement |

### Files to Create

None -- all changes are to existing files.

### Assets Needed

| Asset | Action |
|-------|--------|
| `alabamy-wordmark.png` | **Optional**: Generate white version for dark contexts (OR use CSS text logo) |
| `alabamy-icon.png` | No change needed -- just fix display dimensions in code |

---

## Appendix A: Tailwind v4 `globals.css` Complete Reference

```css
@import "tailwindcss";

@theme {
  /* === COLORS === */

  /* Crimson scale */
  --color-crimson-50: #FEF2F4;
  --color-crimson-100: #FDE6EA;
  --color-crimson-200: #F9BCC6;
  --color-crimson-300: #F28A9B;
  --color-crimson-400: #E14D66;
  --color-crimson-500: #C41E3A;
  --color-crimson-600: #A01830;
  --color-crimson-700: #7D1225;
  --color-crimson-800: #5A0D1B;
  --color-crimson-900: #3D0912;

  /* Gold accent */
  --color-gold-50: #FFFBF0;
  --color-gold-100: #FFF3D6;
  --color-gold-200: #FFE4A8;
  --color-gold-300: #FFD074;
  --color-gold-400: #F5B638;
  --color-gold-500: #D99B1E;
  --color-gold-600: #B07D15;

  /* Warm neutrals */
  --color-warm-50: #FAFAF8;
  --color-warm-100: #F5F3EF;
  --color-warm-200: #F0EDE7;
  --color-warm-300: #EBE8E2;
  --color-warm-400: #D5D1C9;
  --color-warm-500: #B5B1A9;
  --color-warm-600: #8A8A84;
  --color-warm-700: #6A6A64;
  --color-warm-800: #4A4A46;
  --color-warm-900: #2A2A26;
  --color-warm-950: #1A1A18;

  /* Backward-compatible aliases */
  --color-cream: #FAFAF8;
  --color-cream-dark: #F0EDE7;
  --color-card-border: #EBE8E2;
  --color-ink: #1A1A18;
  --color-ink-secondary: #4A4A46;
  --color-ink-muted: #8A8A84;
  --color-crimson: #C41E3A;
  --color-crimson-dark: #A01830;
  --color-header-bg: #1A1A18;
  --color-header-text: #FAFAF8;

  /* === FONTS === */
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-source-serif), Georgia, "Times New Roman", serif;
}

@utility scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@layer base {
  body {
    @apply bg-warm-50 text-warm-950 font-sans antialiased;
  }
}
```

## Appendix B: Component Quick Reference

```
HEADER:     bg-warm-50 + border-b border-warm-300 + 0.5px crimson top accent
NAV PILLS:  font-display text-sm font-medium | active: bg-crimson-500 text-white
SECTION H2: font-display text-2xl font-semibold + vertical crimson bar
SOURCE:     font-display text-[13px] font-semibold uppercase tracking-widest text-crimson-500
HEADLINE:   font-serif text-[15px] leading-[1.35] text-warm-950 hover:text-crimson-500
TIMESTAMP:  text-xs text-warm-600
CARD:       bg-white rounded-xl border-warm-300 p-5 hover:shadow-md
FOOTER:     bg-warm-950 text-warm-50 + 0.5px crimson top accent
TAGLINE:    font-display text-base font-light uppercase tracking-[0.15em] text-warm-600
```
