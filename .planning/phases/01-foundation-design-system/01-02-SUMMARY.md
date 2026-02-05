---
phase: 01-foundation-design-system
plan: 02
subsystem: ui
tags: [gsap, animation, scrolltrigger, ssr, svelte-actions, accessibility]

# Dependency graph
requires:
  - phase: none
    provides: n/a
provides:
  - SSR-safe GSAP initialization with ScrollTrigger registration
  - Reduced motion detection utilities
  - Svelte action for declarative GSAP animations with cleanup
affects: [03-hero-botanical-genesis, 04-services-philosophy, 05-portfolio-showcase, 06-about-contact]

# Tech tracking
tech-stack:
  added: [gsap@^3.14.2]
  patterns: [dynamic-import, svelte-action-cleanup, reduced-motion-respect]

key-files:
  created:
    - src/lib/utils/gsap.ts
    - src/lib/utils/motion.ts
    - src/lib/actions/animate.ts
  modified: []

key-decisions:
  - "GSAP loaded via dynamic import for SSR safety and lazy loading"
  - "Global defaults set to 0.6s duration with power3.out ease"
  - "Reduced motion preference returns duration: 0 (instant transition)"
  - "Svelte action pattern chosen for declarative animations with automatic cleanup"

patterns-established:
  - "SSR guard: check `browser` from $app/environment before any window/document access"
  - "Dynamic GSAP loading: always use await import('gsap') inside functions"
  - "Animation cleanup: use Svelte action destroy() to kill tweens and ScrollTriggers"
  - "Reduced motion: wrap getMotionSafeProps() or check prefersReducedMotion() before animating"

# Metrics
duration: 4min
completed: 2026-02-05
---

# Phase 01 Plan 02: GSAP Animation Infrastructure Summary

**SSR-safe GSAP utilities with lazy loading, reduced motion support, and Svelte action for declarative animations with automatic ScrollTrigger cleanup**

## Performance

- **Duration:** 4 min
- **Started:** 2026-02-05T05:30:04Z
- **Completed:** 2026-02-05T05:34:18Z
- **Tasks:** 3
- **Files created:** 3

## Accomplishments

- GSAP initialization utility with ScrollTrigger registration and global defaults
- Reduced motion utilities for accessibility compliance
- Svelte action wrapping GSAP with automatic cleanup on unmount
- All utilities SSR-safe with browser guards and dynamic imports

## Task Commits

Each task was committed atomically:

1. **Task 1: Create GSAP initialization utility** - `e00fdfc` (feat)
2. **Task 2: Create reduced motion utilities** - `c405539` (feat)
3. **Task 3: Create GSAP Svelte action** - `37825ee` (feat)

## Files Created/Modified

- `src/lib/utils/gsap.ts` - SSR-safe GSAP initialization with ScrollTrigger registration, global defaults (0.6s, power3.out)
- `src/lib/utils/motion.ts` - Reduced motion detection (prefersReducedMotion, getAnimationDuration, getMotionSafeProps)
- `src/lib/actions/animate.ts` - Svelte action for declarative GSAP animations with to/from/fromTo/set types and cleanup

## Decisions Made

1. **Dynamic imports over static imports** - GSAP modules loaded lazily inside functions to prevent SSR errors and enable code splitting
2. **power3.out as default ease** - Provides organic feel matching botanical/natural motion personality from CONTEXT.md
3. **Svelte action over component wrapper** - Actions integrate naturally with `use:` directive and provide automatic cleanup via destroy()
4. **Reduced motion returns duration: 0** - Instant transitions rather than skipped animations ensures state consistency

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing gsap dependency**
- **Found during:** Task 1 (GSAP initialization utility)
- **Issue:** gsap package not in package.json, dynamic import would fail
- **Fix:** Ran `npm install gsap`
- **Files modified:** package.json, package-lock.json
- **Verification:** Import succeeds, npm run check passes
- **Committed in:** e00fdfc (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential dependency installation. No scope creep.

## Issues Encountered

None - implementation followed research patterns from 01-RESEARCH.md

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Animation infrastructure complete and ready for use
- All animated components in subsequent phases should:
  - Import `animate` action from `$lib/actions/animate`
  - Use `initGSAP()` in root layout for global registration
  - Wrap complex timelines with gsap.context() for additional cleanup

---
*Phase: 01-foundation-design-system*
*Completed: 2026-02-05*
