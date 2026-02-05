# Project State: Subfracture Website v2

## Project Reference

**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

**Current Focus:** Phase 2 - Navigation & Layout

## Current Position

**Milestone:** v1.0
**Phase:** 2 of 8 - Navigation & Layout
**Plan:** 1 of 2 complete
**Status:** In progress
**Last activity:** 2026-02-05 - Completed 02-01-PLAN.md (Navigation Components)

**Progress:**
```
[####    ] 25% (4/16 plans complete)
```

## Phase 2 Overview

**Goal:** Build navigation system with sticky header, mobile menu, and scroll progress indicator.

**Requirements:**
- NAV-01: Sticky navigation with auto-hide on scroll down
- NAV-02: Mobile menu with Disclosure pattern
- NAV-03: Scroll progress indicator
- NAV-04: Reduced motion support

**Plans Status:**
| Plan | Name | Status |
|------|------|--------|
| 02-01 | Navigation Components | Complete |
| 02-02 | Page Layout | Pending |

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Phases Complete | 8 | 1 |
| Plans Complete | 16 | 4 |
| Requirements Done | 37 | 9 |
| Coverage | 100% | 25% |

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
- `src/routes/+page.svelte` - Design system demo page
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
      02-RESEARCH.md   # Phase research
```

### WIP Files (from exploration)
- `src/lib/components/Hero.svelte` - Basic hero component
- `src/lib/assets/SacredGeometry.svelte` - SVG asset
- `src/lib/assets/VitruvianFigure.svelte` - SVG asset

### Last Session
- **Date:** 2026-02-05
- **Stopped at:** Completed 02-01-PLAN.md (Navigation Components)
- **Resume file:** None - ready for 02-02 planning

### Resume Command
```
/gsd:execute-phase 2
```

### Phase 2 Progress
Navigation components complete:
- Navigation with auto-hide via GSAP ScrollTrigger direction detection
- ScrollProgress with GSAP ScrollTrigger progress binding
- MobileMenu with Svelte slide transition and reduced motion check
- NavLink with hash-based active detection
- All components SSR-safe with proper cleanup

---
*Last updated: 2026-02-05*
*Phase: 2 - Navigation & Layout (In Progress)*
