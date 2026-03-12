# Implementation Plan: V1 Aesthetic Port to V2 SvelteKit Architecture

## Overview

Port the v1 Subfracture website's visual DNA -- clean white surfaces, system-ui sans-serif typography, yellow selection accent, full-bleed video hero, and clients "lips reveal" animation -- onto the v2 SvelteKit build while preserving all existing section components, Lenis smooth scroll, GSAP animation infrastructure, and Tailwind CSS 4 styling. The v2's editorial cream/Playfair serif aesthetic will be replaced with v1's minimal white/sans-serif sharpness.

## Requirements

- Replace design tokens (cream/parchment to white, serif to sans-serif, terracotta to neutral/yellow)
- Replace typographic fracture hero with full-bleed video hero + watermark + header block
- Create new clients "lips reveal" component ported from v1
- Update all 28 component files that reference design tokens
- Update global styles and color chapter classes
- Update navigation to v1's glass blur style
- Update footer to v1's sticky black footer style
- Preserve all v2 section components (ProblemsSolved, Services, ClosingStatement, Portfolio, Team, Contact)
- Preserve Lenis smooth scroll + GSAP infrastructure
- Preserve SvelteKit routing, Tailwind CSS 4, TypeScript

## Architecture Changes

- `/home/dom/subfracture-website/src/lib/styles/tokens.css` -- Full token overhaul (colors, fonts, hero tokens)
- `/home/dom/subfracture-website/src/app.css` -- Global style updates (body font, selection, color chapters)
- `/home/dom/subfracture-website/src/routes/+layout.svelte` -- Remove self-hosted font imports, update skip-link styles
- `/home/dom/subfracture-website/src/lib/components/hero/Hero.svelte` -- Replace with video hero
- `/home/dom/subfracture-website/src/lib/components/hero/HeroContent.svelte` -- Replace with header block
- `/home/dom/subfracture-website/src/lib/components/hero/ClientsReveal.svelte` -- NEW component
- `/home/dom/subfracture-website/src/routes/+page.svelte` -- Insert ClientsReveal between Hero and ProblemsSolved
- All 28 component files with token references -- Font family and color adjustments
- `/home/dom/subfracture-website/src/lib/components/navigation/Navigation.svelte` -- Glass blur nav
- `/home/dom/subfracture-website/src/lib/components/layout/Footer.svelte` -- Sticky black footer per v1
- `/home/dom/subfracture-website/package.json` -- Remove fontsource packages

## Implementation Steps

### Phase 1: Design Tokens Overhaul (Foundation)

**All subsequent work depends on this phase. It must be completed first.**

#### 1.1 Update tokens.css
**File:** `/home/dom/subfracture-website/src/lib/styles/tokens.css`
- **Action:** Replace all color and font tokens with v1 values:
  - `--color-surface: #ffffff` (was `#f5f0e8`)
  - `--color-surface-warm: #f7f7f7` (was `#ede6d8`)
  - `--color-bone: #eeeeee` (was `#e8e0d4`)
  - `--color-text: #0b0b0b` (was `#1a1a1a`)
  - `--color-text-muted: rgba(11, 11, 11, 0.75)` (was `#4a4a4a`)
  - `--color-primary: #0b0b0b` (was `#c55a3d`)
  - `--color-primary-dark: #000000` (was `#a84830`)
  - Remove `--color-botanical` and `--color-burgundy`
  - Add `--color-yellow: #ffef6a` -- v1 selection/accent color
  - `--font-serif` becomes `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
  - `--font-sans` becomes same system stack
  - `--font-mono` becomes `ui-monospace, "SF Mono", Monaco, Consolas, monospace`
  - Remove all hero-specific GEPA tunables (hero-meta-*, hero-annotation-*, hero-scroll-*, hero-rule-*, hero-tagline-*)
- **Dependencies:** None
- **Risk:** Medium

#### 1.2 Update app.css
**File:** `/home/dom/subfracture-website/src/app.css`
- **Action:**
  - Update selection styling: `::selection { background-color: var(--color-yellow); color: var(--color-text); }`
  - Update `.chapter-cream` to use `--color-surface` (now white)
  - Update `.chapter-warm` to use `--color-surface-warm` (now light grey)
  - `.chapter-dark` stays as `--color-text` (now `#0b0b0b`)
  - Update `:focus-visible` outline to `--color-text` instead of `--color-primary`
- **Dependencies:** Step 1.1
- **Risk:** Low

#### 1.3 Update layout.svelte (remove font imports)
**File:** `/home/dom/subfracture-website/src/routes/+layout.svelte`
- **Action:**
  - Remove all fontsource imports (lines 3-8)
  - Update `.skip-link` border from `--color-primary` to `--color-text`
  - Remove the `main-content { padding-top: 5rem }` (hero will be full-bleed, nav sits over it)
- **Dependencies:** Step 1.1
- **Risk:** Low

#### 1.4 Remove fontsource from package.json
**File:** `/home/dom/subfracture-website/package.json`
- **Action:** Remove from dependencies:
  - `@fontsource-variable/playfair-display`
  - `@fontsource/ibm-plex-mono`
  - `@fontsource/source-sans-3`
- **Dependencies:** Step 1.3
- **Risk:** Low

### Phase 2: Hero Replacement

#### 2.1 Create VideoHero.svelte (replaces HeroContent.svelte)
**File:** `/home/dom/subfracture-website/src/lib/components/hero/VideoHero.svelte`
- **Action:** Create new component with:
  - Sticky video section (`75vh` height) containing:
    - `<video>` element: autoplay, muted, playsinline, loop pointing to `https://subfrac.com/wp-content/uploads/2026/01/Subfracture_Sizzle_Reel_MASTER_NoTitles_250916_Corrected.mp4`
    - SVG watermark (`<img>`) positioned absolute, bleeding below the video fold: `https://subfrac.com/wp-content/themes/mkrst-child/assets/media/subfracture.svg`
  - Port v1's CSS structure: `.hero { height: 75vh; overflow: visible; }`, `.hero__sticky { position: sticky; top: 0; height: 75vh; overflow: hidden; }`, `.hero__video { object-fit: cover; }`, `.hero__watermark { position: absolute; bottom: -7em; width: 100vw; }`
  - Responsive watermark positioning from v1's responsive.css
  - GSAP entrance: watermark fade-in with scroll parallax
  - Reduced motion: static display, no parallax
- **Dependencies:** Phase 1
- **Risk:** High -- video loading performance, watermark positioning across viewports

#### 2.2 Create HeaderBlock.svelte
**File:** `/home/dom/subfracture-website/src/lib/components/hero/HeaderBlock.svelte`
- **Action:** Create new component positioned below the video hero:
  - CSS Grid layout matching v1: `grid-template-columns: 1fr 3fr; grid-template-rows: auto auto; height: 25vh;`
  - Logo (Subfracture SVG or text)
  - Dual city clocks (Brisbane/LA) -- live updating with `setInterval`
  - Tagline: "Built on Intelligence. Powered by Humans."
  - Scroll indicator: "(Scroll)" text
  - Responsive: mobile collapses to single column
- **Dependencies:** Phase 1
- **Risk:** Medium

#### 2.3 Rewire Hero.svelte
**File:** `/home/dom/subfracture-website/src/lib/components/hero/Hero.svelte`
- **Action:**
  - Replace `HeroContent` import with `VideoHero` and `HeaderBlock`
  - Remove fixed editorial elements (annotation, scroll indicator)
  - Remove scroll-progress tracking and fixedOpacity logic
  - New structure: `<section class="hero"><VideoHero /><HeaderBlock /></section>`
  - Remove `margin-top: -5rem` offset
- **Dependencies:** Steps 2.1, 2.2
- **Risk:** Low

#### 2.4 Archive old HeroContent.svelte
**File:** `/home/dom/subfracture-website/src/lib/components/hero/HeroContent.svelte`
- **Action:** Move to `_archive/hero-v2-typographic/HeroContent.svelte`
- **Dependencies:** Step 2.3
- **Risk:** Low

### Phase 3: Clients Lips Reveal

#### 3.1 Create ClientsReveal.svelte
**File:** `/home/dom/subfracture-website/src/lib/components/hero/ClientsReveal.svelte`
- **Action:** Port v1's clients reveal as a Svelte 5 component:
  - **HTML structure** (from v1 index.html lines 84-105):
    - `.clients-reveal` wrapper with `display: grid; grid-template-rows: 0fr`
    - `.clients-reveal__content` with logo grid inside
    - `.clients-reveal__lips` absolute container with top lip, crack, bottom lip
  - **Logo grid**: Nike, Sprite, BMW, Sennheiser, Jimmy Choo, QLD Gov, Sennheiser variant, Verizon
  - **CSS** (port from v1 `effects.css` lines 871-1213):
    - Grid collapse mechanism: `grid-template-rows: 0fr` animated to `1fr`
    - Lip panels: absolute positioned, `transform-origin: 50% 0%` (top) and `50% 100%` (bottom)
    - Crack: hairline at 50% with purple glow states
    - `perspective: 1200px` on lips container
    - Inner shadows, will-change management
    - `is-animating`, `is-revealed`, `is-building`, `is-glowing` state classes
  - **GSAP ScrollTrigger logic** (port from v1 `main.js`):
    - Crack anticipation, purple flash, grid animation, lip rotation, logo choreography
  - **Reduced motion**: Grid at `1fr`, lips hidden, logos visible
  - Use Svelte 5 runes (`$state`, `$effect`)
- **Dependencies:** Phase 1, Phase 2
- **Risk:** High -- most complex animation, fragile CSS grid collapse + 3D transforms
- **Key gotchas:**
  - `min-height` on content prevents grid collapse (only apply after reveal)
  - `overflow: hidden` on grid children required for collapse
  - `perspective` and `overflow: hidden` are CSS-incompatible (lips container must be absolute)

#### 3.2 Wire ClientsReveal into page
**File:** `/home/dom/subfracture-website/src/routes/+page.svelte`
- **Action:** Import and insert `<ClientsReveal />` between `<Hero />` and `<ProblemsSolved />`
- **Dependencies:** Step 3.1
- **Risk:** Low

### Phase 4: Component Token Updates (Systematic Sweep)

#### 4.1 Contact components -- fix hardcoded cream RGBA values
**Files:**
- `src/lib/components/contact/ContactForm.svelte`
- `src/lib/components/contact/ContactSection.svelte`
- `src/lib/components/portfolio/PortfolioCard.svelte`
- **Action:** Replace all `rgba(245, 240, 232, ...)` (hardcoded cream) with `rgba(255, 255, 255, ...)` (white)
- **Dependencies:** Phase 1
- **Risk:** Low

#### 4.2 Section backgrounds -- verify token propagation
**Files:**
- `src/lib/components/content/ProblemsSolved.svelte`
- `src/lib/components/content/Services.svelte`
- `src/lib/components/content/ClosingStatement.svelte`
- `src/lib/components/team/TeamSection.svelte`
- `src/routes/work/[slug]/+page.svelte`
- **Action:** Verify visual result with new tokens. No code changes expected.
- **Dependencies:** Phase 1
- **Risk:** Low

#### 4.3 Accent color audit -- primary was terracotta, now black
**Files using `--color-primary`:**
- SectionHeading, ServicePillar, ServiceProgress, ProblemsSolved, Services
- PortfolioSection, TeamSection, ContactSection
- InlineCTA, NavLink, ScrollProgress
- CarouselCard, CarouselDots, ScrollCarousel
- ContactForm, Footer
- **Action:**
  - Section numbers/labels: change from `--color-primary` to `--color-text-muted` (v1 used opacity-reduced black)
  - Interactive states: use `--color-yellow` for selection, focus rings
  - `InlineCTA.svelte`: text color → `--color-text` with underline
  - `ScrollProgress.svelte`: progress bar → black at low opacity
  - Focus rings: `--color-text` instead of `--color-primary`
- **Dependencies:** Phase 1
- **Risk:** Medium

#### 4.4 Footer overhaul
**File:** `src/lib/components/layout/Footer.svelte`
- **Action:** Restyle to match v1's `.sf-closer`:
  - `position: sticky; bottom: 0; z-index: -1;` -- footer reveals as content scrolls past
  - Black background (`--color-text`)
  - Grid: offices left, mark right, tagline spanning, large wordmark at bottom
  - Tagline: "A culture studio. Art and systems, flowing together."
  - Large "SUBFRACTURE" wordmark at bottom
  - Office headings: uppercase, 0.75rem, 0.5 opacity
- **Dependencies:** Phase 1
- **Risk:** Medium -- sticky footer z-index with Lenis/GSAP

#### 4.5 Navigation glass blur update
**File:** `src/lib/components/navigation/Navigation.svelte`
- **Action:** `background: rgba(255, 255, 255, 0.78); backdrop-filter: blur(6px);`
- **Dependencies:** Phase 1
- **Risk:** Low

#### 4.6-4.11 Remaining component updates
- NavLink, MobileMenu, Carousel components, ScrollCarousel, Container, SectionHeading
- Scroll animation components (ScrubTextReveal, CharacterCascade, SectionDivider)
- Portfolio components (PortfolioReveal, PortfolioBgText, PortfolioCard)
- TeamMember, Work detail page
- **Action:** Mostly auto-propagated via token changes. Verify and fix edge cases.
- **Dependencies:** Phase 1
- **Risk:** Low

### Phase 5: Polish and Integration

#### 5.1 Update layout padding for full-bleed hero
- Remove `padding-top: 5rem` from `.main-content`
- Add `z-index: 2; position: relative;` to `.main-content` (for sticky footer layering)

#### 5.2 Verify Tailwind utility class references
- Grep for `bg-surface`, `text-text`, `text-primary`, `font-serif` in Tailwind classes
- Verify `@theme` resolves correctly with updated tokens

#### 5.3 Visual regression testing
- All sections render correctly with new palette
- Hero video plays, watermark positions correctly
- Clients reveal triggers and completes
- Navigation glass blur over hero video
- Mobile responsive at 375px, 768px, 1024px
- Reduced motion fallbacks

#### 5.4 Performance check
- Video: `preload="metadata"`, width/height attributes, poster frame
- Logo images: `loading="lazy"`
- `npm run build` succeeds
- `npm run check` passes

## Key Files Reference

**Modified files:**
- `src/lib/styles/tokens.css`
- `src/app.css`
- `src/routes/+layout.svelte`
- `src/routes/+page.svelte`
- `src/lib/components/hero/Hero.svelte`
- `src/lib/components/navigation/Navigation.svelte`
- `src/lib/components/navigation/NavLink.svelte`
- `src/lib/components/navigation/MobileMenu.svelte`
- `src/lib/components/layout/Footer.svelte`
- `src/lib/components/ui/SectionHeading.svelte`
- `src/lib/components/ui/InlineCTA.svelte`
- `src/lib/components/contact/ContactForm.svelte`
- `src/lib/components/contact/ContactSection.svelte`
- `src/lib/components/team/TeamMember.svelte`
- `src/lib/components/portfolio/PortfolioCard.svelte`
- `src/lib/components/content/ServiceProgress.svelte`
- `src/lib/components/carousel/CarouselCard.svelte`
- `src/lib/components/carousel/CarouselDots.svelte`
- `src/lib/components/content/ProblemsSolved.svelte`
- `src/lib/components/content/Services.svelte`
- `package.json`

**New files:**
- `src/lib/components/hero/VideoHero.svelte`
- `src/lib/components/hero/HeaderBlock.svelte`
- `src/lib/components/hero/ClientsReveal.svelte`

**Archived files:**
- `src/lib/components/hero/HeroContent.svelte` → `_archive/hero-v2-typographic/`

**V1 reference files (read-only):**
- `_archive/v1/assets/css/main.css` -- v1 root variables and base styles
- `_archive/v1/assets/css/custom.css` -- v1 hero, header-block, footer CSS
- `_archive/v1/assets/css/effects.css` -- v1 clients reveal CSS (lines 871-1213)
- `_archive/v1/assets/css/sections.css` -- v1 section styling patterns
- `_archive/v1/assets/css/responsive.css` -- v1 responsive breakpoints
- `_archive/v1/assets/js/main.js` -- v1 clients reveal JS
- `_archive/v1/index.html` -- v1 HTML structure reference
- `_archive/v1/HANDOVER-CLIENTS-REVEAL.md` -- v1 lips reveal documentation

## Success Criteria

- [ ] Design tokens reflect v1 palette: white surfaces, black text, system-ui fonts, yellow selection
- [ ] Full-bleed video hero with watermark bleeding below viewport
- [ ] Header block with live clocks (Brisbane/LA), tagline, scroll indicator
- [ ] Clients "lips reveal" with crack, purple flash, 3D lip rotation, center-out logo stagger
- [ ] All existing sections render correctly with new palette
- [ ] Navigation uses glass blur effect over hero video
- [ ] Footer is sticky black with large wordmark and office addresses
- [ ] No fontsource packages in bundle (system fonts only)
- [ ] Reduced motion fallbacks work for all new components
- [ ] Mobile responsive at 375px, 768px, 1024px breakpoints
- [ ] Lenis smooth scroll and all GSAP animations function correctly
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` passes TypeScript checks
