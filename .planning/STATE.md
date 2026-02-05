# Project State: Subfracture Website v2

## Project Reference

**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

**Current Focus:** Phase 1 - Foundation & Design System

## Current Position

**Milestone:** v1.0
**Phase:** 1 of 8 - Foundation & Design System
**Plan:** 2 of 2 complete
**Status:** Phase 1 complete
**Last activity:** 2026-02-05 - Completed 01-02-PLAN.md (GSAP Animation Utilities)

**Progress:**
```
[##      ] 12% (2/16 plans complete)
```

## Phase 1 Overview

**Goal:** Establish editorial visual language (typography, color, grid) and GSAP animation patterns.

**Requirements:**
- FOUND-01: Typography system (Playfair Display, numbered sections)
- FOUND-02: Color palette (terracotta, cream, black, accents)
- FOUND-03: Responsive two-column asymmetric grid
- FOUND-04: Tailwind CSS 4 design tokens
- FOUND-05: SSR-safe GSAP installation

**Success Criteria:**
1. Terracotta headings on cream with consistent typography across viewports
2. Two-column (desktop) to single-column (mobile) layout shifts
3. Section numbers (01, 02...) with consistent styling
4. No hydration errors or GSAP/SSR console warnings

**Plans Status:**
| Plan | Name | Status |
|------|------|--------|
| 01-01 | Design Tokens | Complete |
| 01-02 | GSAP Animation Utilities | Complete |

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Phases Complete | 8 | 1 |
| Plans Complete | 16 | 2 |
| Requirements Done | 37 | 5 |
| Coverage | 100% | 14% |

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

### Artifacts Created
- `src/lib/styles/tokens.css` - Complete design token system
- `src/lib/utils/gsap.ts` - SSR-safe GSAP initialization
- `src/lib/utils/motion.ts` - Reduced motion utilities
- `src/lib/actions/animate.ts` - Svelte action for GSAP animations
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
      01-RESEARCH.md   # Phase research
```

### WIP Files (from exploration)
- `src/lib/components/Hero.svelte` - Basic hero component
- `src/lib/assets/SacredGeometry.svelte` - SVG asset
- `src/lib/assets/VitruvianFigure.svelte` - SVG asset

### Last Session
- **Date:** 2026-02-05
- **Stopped at:** Completed Phase 1 - Foundation & Design System
- **Resume file:** None - ready for Phase 2

### Resume Command
```
/gsd:plan-phase 2
```

---
*Last updated: 2026-02-05*
*Phase: 1 - Foundation & Design System (Complete)*
