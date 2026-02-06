---
phase: 03-hero-section
plan: 01
subsystem: ui
tags: [gsap, drawsvg, splittext, svg, animation, hero, svelte]

# Dependency graph
requires:
  - phase: 01-foundation-design-system
    provides: GSAP initialization utility (gsap.ts), design tokens, color system
provides:
  - GSAP initialization with DrawSVGPlugin and SplitText registration
  - HeroIllustration SVG component with GSAP-ready organic linework
affects: [03-hero-section (remaining plans need these artifacts)]

# Tech tracking
tech-stack:
  added: [gsap/DrawSVGPlugin, gsap/SplitText]
  patterns: [SVG-only path elements for DrawSVG (no rect/circle/ellipse), hero-path class convention for GSAP targeting, hero-detail group for mobile simplification]

key-files:
  created: [src/lib/components/hero/HeroIllustration.svelte]
  modified: [src/lib/utils/gsap.ts]

key-decisions:
  - "24 SVG paths total: 12 core (always visible) + 12 detail (mobile-hidden)"
  - "All animatable elements use path elements only (iOS Safari DrawSVG safety)"
  - "Accent fills use terracotta #c55a3d at fill-opacity 0.06-0.08 for warmth"
  - "Botanical green #5a7c65 used for river/growth trajectory lines"

patterns-established:
  - "hero-path class: All GSAP-animated SVG paths get class hero-path with stroke and stroke-width attributes"
  - "hero-detail group: Mobile-hidden detail paths wrapped in g.hero-detail for responsive CSS hiding by parent"
  - "SVG path-only rule: Use path elements exclusively for DrawSVG animation (no rect/circle/ellipse due to iOS Safari bug)"

# Metrics
duration: 5min
completed: 2026-02-06
---

# Phase 03 Plan 01: GSAP Plugin Registration and Hero SVG Illustration Summary

**DrawSVGPlugin and SplitText registered in GSAP init, plus 24-path abstract organic SVG illustration for hero background**

## Performance

- **Duration:** 4min 37s
- **Started:** 2026-02-06T05:37:56Z
- **Completed:** 2026-02-06T05:42:33Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Extended initGSAP() to register DrawSVGPlugin and SplitText alongside ScrollTrigger via dynamic imports
- Created HeroIllustration.svelte with 24 abstract organic SVG paths depicting root/growth networks, circular geometry, and flowing organic lines
- Established hero-path class convention and hero-detail group pattern for mobile simplification
- All paths use stroke attributes required by DrawSVG, no CSS animations, no iOS-unsafe elements

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend gsap.ts to register DrawSVGPlugin and SplitText** - `6d3dc90` (feat)
2. **Task 2: Create HeroIllustration.svelte with abstract organic linework** - `137d306` (feat)

## Files Created/Modified
- `src/lib/utils/gsap.ts` - Added DrawSVGPlugin and SplitText dynamic imports and registration
- `src/lib/components/hero/HeroIllustration.svelte` - Inline SVG with 24 abstract organic paths for hero background

## Decisions Made
- **24 paths (not 20-25):** 24 paths provide sufficient visual density for the Nigrum Corpus aesthetic while staying within the plan range
- **12/12 core-detail split:** Equal split between always-visible core paths and mobile-hidden detail paths, keeping mobile at 12 paths (within 8-12 recommendation)
- **Path-only elements:** Strictly used path elements for all animatable shapes including circular arcs (using arc commands instead of circle elements) per iOS Safari DrawSVG bug avoidance
- **Composition layers:** Root/growth network (5 core paths), circular geometry frame (3 core arcs), flowing organic lines (4 core sweeps), with dendrites, filaments, accents, and additional detail in the hero-detail group

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- GSAP plugins (DrawSVGPlugin, SplitText, ScrollTrigger) all registered and ready for animation orchestration
- HeroIllustration.svelte is purely structural -- ready for GSAP DrawSVG animation in the Hero orchestrator component
- hero-path class on all 24 paths enables immediate GSAP targeting
- hero-detail group enables CSS-based mobile simplification
- Next plans can build HeroContent (typography/CTAs) and Hero orchestrator (animation timeline)

## Self-Check: PASSED

---
*Phase: 03-hero-section*
*Completed: 2026-02-06*
