# Project State: Subfracture Website v2

## Project Reference

**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

**Current Focus:** Phase 3 - Hero Section

## Current Position

**Milestone:** v1.0
**Phase:** 3 of 8 - In Progress (Hero Section)
**Plan:** 3 of 4 complete (03-03 done, 03-04 pending)
**Status:** In progress
**Last activity:** 2026-02-06 - Completed 03-03-PLAN.md (Hero Orchestrator + Page Integration)

**Progress:**
```
[########=] 50% (8/16 plans complete)
```

## Phase 3 Overview

**Goal:** Build the hero section with illustration, typography, logo carousel, and GSAP animation orchestration.

**Plans Status:**
| Plan | Name | Status |
|------|------|--------|
| 03-01 | Hero Illustration SVG | Complete |
| 03-02 | Hero Content & Logo Carousel | Complete |
| 03-03 | Hero Orchestrator | Complete |
| 03-04 | Hero Polish & Verification | Pending |

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Phases Complete | 8 | 2 |
| Plans Complete | 16 | 8 |
| Requirements Done | 37 | 14 |
| Coverage | 100% | 50% |

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
- **Hero CTAs**: Understated text links on desktop (vertical bar divider), stacked tappable buttons on mobile
- **Logo carousel**: CSS-only marquee with absolute positioning + staggered animation-delay (Smashing Magazine pattern)
- **Placeholder logos**: Geometric inline SVGs (no external assets)
- **Hero nav offset**: Negative margin-top: -5rem for full-bleed illustration under nav, padding-top: 5rem on foreground content
- **Hero animation**: GSAP matchMedia with no-preference (animated) and reduce (static) branches
- **SplitText skipped**: HeroContent uses pre-set CSS classes rather than runtime text splitting

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
- Initial opacity: 0 + translateY pattern for GSAP orchestration
- hero-path class: All GSAP-animated SVG paths get class="hero-path" with stroke and stroke-width attributes
- hero-detail group: Mobile-hidden detail paths wrapped in g.hero-detail for responsive CSS hiding
- SVG path-only rule: Use path elements exclusively for DrawSVG (no rect/circle/ellipse -- iOS Safari bug)
- matchMedia branching: Use gsap.matchMedia() with no-preference vs reduce branches for animated sections
- Orchestrator pattern: Parent component owns GSAP timeline, child components provide targeting classes
- Full-bleed hero: negative margin pulls section behind nav, content padding preserves readability

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
- `src/lib/components/hero/HeroIllustration.svelte` - Abstract organic SVG linework (24 paths)
- `src/lib/components/hero/HeroContent.svelte` - Typography + CTAs foreground layer
- `src/lib/components/hero/LogoCarousel.svelte` - CSS-only infinite marquee
- `src/lib/components/hero/Hero.svelte` - Hero orchestrator with GSAP animation timeline
- `src/routes/+page.svelte` - Home page with Hero component and section placeholders
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
      03-CONTEXT.md    # Phase context
      03-RESEARCH.md   # Phase research
```

### WIP Files (from exploration)
- `src/lib/components/Hero.svelte` - Basic hero component
- `src/lib/assets/SacredGeometry.svelte` - SVG asset
- `src/lib/assets/VitruvianFigure.svelte` - SVG asset

### Last Session
- **Date:** 2026-02-06
- **Stopped at:** Completed 03-03-PLAN.md (Hero Orchestrator + Page Integration)
- **Resume file:** None

### Resume Command
```
/gsd:execute-phase
```

---
*Last updated: 2026-02-06*
*Phase: 3 - Hero Section (In Progress - 3/4 plans complete, 03-04 pending)*
