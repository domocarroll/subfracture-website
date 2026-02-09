# Project State: Subfracture Website v2

## Project Reference

**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

**Current Focus:** Phase 4 - Content Sections (Complete)

## Current Position

**Milestone:** v1.0
**Phase:** 4 of 8 - Content Sections
**Plan:** 04-02 complete
**Status:** All content sections rendering correctly with GSAP scroll animations
**Last activity:** 2026-02-09 - Fixed gsap.from→fromTo visibility bug (ea5dc12), checkpoint passed

**Progress:**
```
[#############==] 81.25% (13/16 plans complete)
```

## Phase 4 Overview

**Goal:** Build editorial content sections (ProblemsSolved, Services, ClosingStatement) and integrate into page.

**Plans Status:**
| Plan | Name | Status |
|------|------|--------|
| 04-01 | Content Components | Complete |
| 04-02 | Page Integration | Complete |

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Phases Complete | 8 | 4 |
| Plans Complete | 16 | 13 |
| Requirements Done | 37 | 23 |
| Coverage | 100% | 81.25% |

## Accumulated Context

### Key Decisions
- **Hero**: Botanical Genesis SVG animation (not video reel)
- **Portfolio**: Lips reveal + horizontal scroll gallery (SPYLT-style)
- **Colors**: Terracotta primary accent (#c55a3d) on cream background
- **Stack**: SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + GSAP (100% free)
- **CMS**: Sanity (deferred until static frontend complete)
- **Typography**: Golden ratio scale (1.618) with 18px base
- **Fonts**: Playfair Display Variable (body/headings), Source Sans 3 (UI)
- **Font hosting**: Self-hosted via Fontsource (no Google CDN)
- **GSAP loading**: Dynamic imports for SSR safety and lazy loading
- **Animation defaults**: 0.6s duration, power3.out ease
- **Reduced motion**: Returns duration: 0 for instant transitions
- **Section numbering**: Editorial style with small terracotta labels (01, 02...)
- **Container variants**: Two widths (narrow: 900px, wide: 1200px)
- **Grid system**: Golden ratio (1.618fr 1fr) for major/minor columns
- **NAV-01**: Use GSAP ScrollTrigger direction detection for auto-hide behavior
- **Hero CTAs**: Understated text links on desktop (terracotta dot divider), stacked tappable buttons on mobile
- **Logo carousel**: CSS-only marquee with absolute positioning + staggered animation-delay (Smashing Magazine pattern)
- **Placeholder logos**: Geometric inline SVGs (no external assets)
- **Hero nav offset**: Negative margin-top: -5rem for full-bleed illustration under nav, padding-top: 5rem on foreground content
- **Hero animation**: GSAP matchMedia with no-preference (animated) and reduce (static) branches
- **SplitText skipped**: HeroContent uses pre-set CSS classes rather than runtime text splitting
- **Hero illustration**: Asymmetric composition — trunk shifted left (M540), secondary emergence right (M830)
- **Hero animation layers**: 4-wave DrawSVG (root/arc/flow/detail) with per-layer easing vocabulary
- **Hero typography synthesis**: Graduated spacing, enriched tagline color-mix, 12px translateY travel
- **Content stagger targeting**: querySelectorAll('.problem-card'/'.service-pillar') for GSAP stagger instead of child ref binding
- **Bullet markers**: Terracotta dash (6px line, opacity 0.6) for editorial consistency
- **Section padding**: clamp(12rem, 15vw, 18rem) for responsive breathing room
- **Declarative vs imperative**: animate action for simple reveals, imperative GSAP matchMedia for stagger

### Research Findings
- GSAP plugins (DrawSVG, MorphSVG, SplitText) now 100% free
- Tailwind CSS v4 targets modern browsers only (Safari 16.4+)
- Critical pitfalls: ScrollTrigger cleanup, $effect vs onMount, SSR hydration
- Phase 3 (Hero) and Phase 5 (Portfolio) need research-phase during planning

### Technical Notes
- Use gsap.context() for ALL animations with cleanup in onDestroy
- Guard all GSAP code with browser check from $app/environment
- Use onMount for animation setup, NOT $effect
- Create horizontal ScrollTriggers in correct DOM order
- Import tokens.css after tailwindcss in app.css
- Font imports in +layout.svelte before app.css
- Use `animate` action from $lib/actions/animate for declarative animations
- Use `initGSAP()` in root layout for global registration

### Patterns Established
- SSR guard: check `browser` from $app/environment before any window/document access
- Dynamic GSAP loading: always use await import('gsap') inside functions
- Animation cleanup: use Svelte action destroy() to kill tweens and ScrollTriggers
- Reduced motion: wrap getMotionSafeProps() or check prefersReducedMotion() before animating
- Disclosure pattern: `id` on menu, `aria-controls` on toggle, `aria-expanded` state
- Hero sub-components provide semantic GSAP targeting classes (.hero-headline, .hero-tagline, etc.)
- Mobile CTAs convert from inline links to full-width tappable buttons at 48rem breakpoint
- CSS mask-image gradient for smooth edge fade on scrolling content
- CSS-only marquee using @keyframes with staggered animation-delay
- prefers-reduced-motion static fallback for animation components
- Initial opacity: 0 + translateY(12px) pattern for GSAP orchestration
- hero-path class: All GSAP-animated SVG paths get hero-path + layer class (hero-path-root/arc/flow/detail)
- hero-detail group: Mobile-hidden detail paths wrapped in g.hero-detail for responsive CSS hiding
- SVG path-only rule: Use path elements exclusively for DrawSVG (no rect/circle/ellipse -- iOS Safari bug)
- matchMedia branching: Use gsap.matchMedia() with no-preference vs reduce branches for animated sections
- Orchestrator pattern: Parent component owns GSAP timeline, child components provide targeting classes
- Full-bleed hero: negative margin pulls section behind nav, content padding preserves readability
- Parallel recursive improvement: Three branches (typography/illustration/animation) run independently, synthesize best-of-all
- Per-layer easing vocabulary: Each animation layer gets its own easing character (power2.inOut, circ.out, power3.out, etc.)
- Terracotta dot divider: 4px circle with opacity 0.4 replaces pipe character between CTAs
- Content section pattern: section > Container > content with animate action + imperative GSAP stagger
- Background alternation: surface -> surface-warm -> surface for visual rhythm between sections
- CSS initial opacity:0/translateY(24px) on GSAP stagger targets prevents flash before animation
- CRITICAL: Use gsap.fromTo() (not gsap.from()) when elements have CSS opacity:0 — from() reads current CSS as destination, animating 0→0

### Artifacts Created
- `src/lib/styles/tokens.css` - Complete design token system
- `src/lib/utils/gsap.ts` - SSR-safe GSAP initialization
- `src/lib/utils/motion.ts` - Reduced motion utilities
- `src/lib/actions/animate.ts` - Svelte action for GSAP animations
- `src/lib/components/ui/SectionHeading.svelte` - Editorial section headings
- `src/lib/components/ui/Container.svelte` - Responsive layout container
- `src/lib/components/navigation/Navigation.svelte` - Main navigation with auto-hide
- `src/lib/components/navigation/NavLink.svelte` - Reusable nav link
- `src/lib/components/navigation/MobileMenu.svelte` - Mobile menu overlay
- `src/lib/components/navigation/ScrollProgress.svelte` - Scroll progress bar
- `src/lib/components/hero/HeroIllustration.svelte` - Asymmetric organic SVG (36 paths, 4 layers)
- `src/lib/components/hero/HeroContent.svelte` - Typography + CTAs with graduated spacing
- `src/lib/components/hero/LogoCarousel.svelte` - CSS-only infinite marquee
- `src/lib/components/hero/Hero.svelte` - Hero orchestrator with 4-wave GSAP animation
- `src/routes/+page.svelte` - Home page with Hero component and section placeholders
- `src/lib/components/content/ProblemCard.svelte` - Single pain point card (confrontational typography)
- `src/lib/components/content/ProblemsSolved.svelte` - Problems section with 6 cards and stagger reveal
- `src/lib/components/content/ServicePillar.svelte` - Single service pillar (number, tagline, description, bullets)
- `src/lib/components/content/Services.svelte` - Services section with 5 pillars and stagger reveal
- `src/lib/components/content/ClosingStatement.svelte` - Closing statement bridge
- GSAP, Fontsource packages installed

### Open TODOs
- [x] Source specific fonts (Canela, Editorial New) or use Playfair Display initially
  - Resolved: Using Playfair Display Variable + Source Sans 3

### Blockers
None

## Session Continuity

### Files Created
```
.planning/
  PROJECT.md         # Full project context
  REQUIREMENTS.md    # 37 v1 requirements with traceability
  ROADMAP.md         # 8-phase roadmap with success criteria
  STATE.md           # This file
  config.json        # Workflow preferences
  research/
    STACK.md         # Technology recommendations
    FEATURES.md      # Feature landscape
    ARCHITECTURE.md  # Component structure
    PITFALLS.md      # Common mistakes to avoid
    SUMMARY.md       # Executive synthesis
  phases/
    01-foundation-design-system/
      01-01-PLAN.md    # Design tokens plan
      01-01-SUMMARY.md # Design tokens summary
      01-02-PLAN.md    # GSAP utilities plan
      01-02-SUMMARY.md # GSAP utilities summary
      01-03-PLAN.md    # Typography/grid components plan
      01-03-SUMMARY.md # Typography/grid components summary
      01-RESEARCH.md   # Phase research
    02-navigation-layout/
      02-01-PLAN.md    # Navigation components plan
      02-01-SUMMARY.md # Navigation components summary
      02-02-PLAN.md    # Footer & Layout Integration plan
      02-02-SUMMARY.md # Footer & Layout Integration summary
      02-RESEARCH.md   # Phase research
    03-hero-section/
      03-01-PLAN.md    # Hero Illustration SVG plan
      03-01-SUMMARY.md # Hero Illustration SVG summary
      03-02-PLAN.md    # Hero Content & Logo Carousel plan
      03-02-SUMMARY.md # Hero Content & Logo Carousel summary
      03-03-PLAN.md    # Hero Orchestrator plan
      03-03-SUMMARY.md # Hero Orchestrator summary
      03-04-PLAN.md    # Hero Polish & Verification plan
      03-04-SUMMARY.md # Hero Polish & Three-Branch Synthesis summary
      03-CONTEXT.md    # Phase context
      03-RESEARCH.md   # Phase research
    04-content-sections/
      04-01-PLAN.md    # Content Components plan
      04-01-SUMMARY.md # Content Components summary
      04-02-PLAN.md    # Page Integration plan
      04-CONTEXT.md    # Phase context
      04-RESEARCH.md   # Phase research
```

### Last Session
- **Date:** 2026-02-09
- **Stopped at:** Phase 4 complete (all content sections integrated and verified)
- **Resume file:** None

### Resume Command
```
/gsd:progress
```

---
*Last updated: 2026-02-09*
*Phase: 4 - Content Sections (Complete)*
*Next: Phase 5 - Portfolio Gallery*
