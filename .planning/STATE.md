# Project State: Subfracture Website v2

## Project Reference

**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

**Current Focus:** Phase 1 - Foundation & Design System

## Current Position

**Milestone:** v1.0
**Phase:** 1 of 8 - Foundation & Design System
**Plan:** Not yet created
**Status:** Ready for planning

**Progress:**
```
[        ] 0% (0/8 phases complete)
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

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Phases Complete | 8 | 0 |
| Requirements Done | 37 | 0 |
| Coverage | 100% | 0% |

## Accumulated Context

### Key Decisions
- **Hero**: Botanical Genesis SVG animation (not video reel)
- **Portfolio**: Lips reveal + horizontal scroll gallery (SPYLT-style)
- **Colors**: Terracotta primary accent (#c55a3d) on cream background
- **Stack**: SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + GSAP (100% free)
- **CMS**: Sanity (deferred until static frontend complete)

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

### Open TODOs
- [ ] Source specific fonts (Canela, Editorial New) or use Playfair Display initially

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
```

### WIP Files (from exploration)
- `src/lib/components/Hero.svelte` - Basic hero component
- `src/lib/assets/SacredGeometry.svelte` - SVG asset
- `src/lib/assets/VitruvianFigure.svelte` - SVG asset
- Typography tokens in `src/app.css`

### Resume Command
```
/gsd:plan-phase 1
```

---
*Last updated: 2026-02-05*
*Phase: Ready for planning*
