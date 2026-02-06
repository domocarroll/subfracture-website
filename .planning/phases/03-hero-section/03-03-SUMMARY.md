---
phase: 03-hero-section
plan: 03
subsystem: ui
tags: [svelte, gsap, drawsvg, scrolltrigger, parallax, animation, hero, reduced-motion]

# Dependency graph
requires:
  - phase: 03-hero-section
    provides: HeroIllustration.svelte (24 SVG paths), HeroContent.svelte (typography + CTAs), LogoCarousel.svelte (CSS-only marquee)
  - phase: 01-foundation-design-system
    provides: Design tokens, GSAP utilities (initGSAP, gsap.ts), animate action
  - phase: 02-navigation-layout
    provides: Navigation with fixed 5rem header, +layout.svelte with main-content padding
provides:
  - Hero.svelte orchestrator composing illustration, content, carousel with GSAP timeline
  - Updated +page.svelte with Hero component replacing old hero markup
  - GSAP DrawSVG entrance animation sequence with reduced motion support
  - ScrollTrigger parallax on hero illustration background
affects: [04-portfolio-section, 03-hero-section/03-04 polish, performance-optimization]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "GSAP matchMedia for reduced motion branching"
    - "GSAP timeline position parameters for overlapping animation phases"
    - "Negative margin + content padding for full-bleed hero under fixed nav"
    - "CSS :global() for targeting child component classes from parent"

key-files:
  created:
    - src/lib/components/hero/Hero.svelte
  modified:
    - src/routes/+page.svelte

key-decisions:
  - "Hero uses negative margin-top: -5rem to extend illustration full-bleed under fixed nav, with padding-top: 5rem on foreground content"
  - "GSAP matchMedia handles both animation branches cleanly with automatic cleanup via revert()"
  - "SplitText not imported since HeroContent uses pre-set CSS classes for targeting rather than runtime text splitting"

patterns-established:
  - "matchMedia branching: Use gsap.matchMedia() with no-preference vs reduce branches for all animated sections"
  - "Orchestrator pattern: Parent component owns GSAP timeline, child components provide targeting classes"
  - "Full-bleed hero: negative margin pulls section behind nav, content padding preserves readability"

# Metrics
duration: 2min
completed: 2026-02-06
---

# Phase 3 Plan 3: Hero Orchestrator + Page Integration Summary

**GSAP-orchestrated hero section with DrawSVG entrance sequence, parallax, and reduced motion support integrated into +page.svelte**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-06T05:48:25Z
- **Completed:** 2026-02-06T05:50:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Hero.svelte orchestrator composing HeroIllustration, HeroContent, and LogoCarousel into a full-viewport section
- GSAP timeline with 6-phase overlapping entrance animation completing in ~1 second (DrawSVG paths -> headline -> tagline -> subline -> CTAs -> carousel)
- ScrollTrigger parallax shifting illustration at 12% slower rate than scroll
- Reduced motion branch showing all content immediately without animation
- Clean integration into +page.svelte replacing old hero markup and removing stale CSS

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Hero.svelte orchestrator with GSAP timeline** - `5c6259a` (feat)
2. **Task 2: Integrate Hero component into +page.svelte** - `1616998` (feat)

## Files Created/Modified
- `src/lib/components/hero/Hero.svelte` - Main hero orchestrator with GSAP animation timeline, parallax, and reduced motion support
- `src/routes/+page.svelte` - Replaced old hero header block with Hero component, removed stale hero CSS

## Decisions Made
- Did not import SplitText plugin since HeroContent uses pre-set CSS classes (`.hero-headline`, `.hero-tagline`, etc.) rather than runtime text splitting. This keeps the bundle smaller.
- Applied illustration at 70% opacity via CSS to ensure it stays in the background without competing with foreground text.
- Added `pointer-events: none` on the background layer so clicks pass through to foreground CTAs.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero orchestrator complete with all sub-components wired together
- Ready for 03-04 polish plan (visual refinement, performance audit, cross-browser testing)
- The old `src/lib/components/Hero.svelte` WIP file still exists and should be cleaned up in 03-04

## Self-Check: PASSED

---
*Phase: 03-hero-section*
*Completed: 2026-02-06*
