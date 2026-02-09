---
phase: 04-content-sections
plan: 01
subsystem: content-components
tags: [svelte, gsap, scroll-animation, typography, editorial, content-sections]
requires:
  - phase-01 (design tokens, Container, SectionHeading)
  - phase-02 (navigation with #about and #services anchors)
provides:
  - 5 content section components (ProblemsSolved, ProblemCard, Services, ServicePillar, ClosingStatement)
  - Scroll-triggered stagger reveal pattern for card/pillar grids
  - Background alternation pattern (surface -> surface-warm -> surface)
affects:
  - 04-02 (page integration imports these components)
  - phase-05 (portfolio section sits between these sections and closing)
tech-stack:
  added: []
  patterns:
    - GSAP matchMedia stagger on querySelectorAll for child component animation
    - CSS initial opacity:0/translateY(24px) flash prevention for GSAP-animated elements
    - Terracotta dash markers for bullet lists
    - clamp() vertical padding for responsive section spacing
key-files:
  created:
    - src/lib/components/content/ProblemCard.svelte
    - src/lib/components/content/ProblemsSolved.svelte
    - src/lib/components/content/ServicePillar.svelte
    - src/lib/components/content/Services.svelte
    - src/lib/components/content/ClosingStatement.svelte
  modified: []
key-decisions:
  - Used querySelectorAll for GSAP stagger targeting instead of binding each child element
  - Terracotta dash (6px line) as bullet marker instead of dots for editorial consistency
  - clamp(12rem, 15vw, 18rem) for generous section padding over fixed spacing tokens
  - ClosingStatement uses animate action (declarative) vs imperative GSAP since no stagger needed
patterns-established:
  - Content section component pattern: section > Container > content with animate action + imperative GSAP stagger
  - Background alternation for visual rhythm between adjacent sections
  - Stats placeholder div with aria-hidden for future CONT-04 insertion
duration: ~3 minutes
completed: 2026-02-09
---

# Phase 04 Plan 01: Content Components Summary

**5 editorial content components with GSAP scroll-triggered stagger reveals and confrontational typographic treatment**

## Performance

- svelte-check: 0 errors, 0 warnings
- All 5 components created (575 total lines)
- All content matches CONTENT.MD exactly (verified by grep)
- All GSAP animations have proper matchMedia branching and onDestroy cleanup

## Accomplishments

1. **ProblemCard** (42 lines) - Borderless confrontational typographic card with Playfair Display serif at 30px. No background, no border, no shadow. CSS initial state prevents flash.

2. **ProblemsSolved** (160 lines) - Section heading ("Where art and systems flow together"), intro paragraph, "Problems we help solve" label, and 6 pain point cards in 2-column responsive grid. GSAP matchMedia stagger (0.08s between cards). Section ID "about" for nav anchor.

3. **ServicePillar** (116 lines) - Numbered vertical stack with terracotta number, Playfair tagline at 39px, description, and bullet list with terracotta dash markers. Bone divider between pillars (removed on last child).

4. **Services** (175 lines) - "What we build" label and 5 numbered pillars (01-05) with all content from CONTENT.MD. GSAP matchMedia stagger (0.12s between pillars). Section ID "services" for nav anchor. Warm cream background shift.

5. **ClosingStatement** (82 lines) - Centered weighted closing line and supporting paragraph. Uses animate action for simple scroll reveals (no stagger needed). Bridge padding with clamp(8rem, 10vw, 12rem).

## Task Commits

| Task | Name | Commit | Key Files |
|------|------|--------|-----------|
| 1 | ProblemCard and ProblemsSolved | c2e76e1 | ProblemCard.svelte, ProblemsSolved.svelte |
| 2 | ServicePillar, Services, ClosingStatement | 262e387 | ServicePillar.svelte, Services.svelte, ClosingStatement.svelte |

## Files Created

- `src/lib/components/content/ProblemCard.svelte` - Single pain point card (42 lines)
- `src/lib/components/content/ProblemsSolved.svelte` - Problems section with 6 cards (160 lines)
- `src/lib/components/content/ServicePillar.svelte` - Single service pillar (116 lines)
- `src/lib/components/content/Services.svelte` - Services section with 5 pillars (175 lines)
- `src/lib/components/content/ClosingStatement.svelte` - Closing statement bridge (82 lines)

## Decisions Made

1. **querySelectorAll for stagger targeting** - Used `gridEl.querySelectorAll('.problem-card')` and `servicesEl.querySelectorAll('.service-pillar')` for GSAP stagger instead of binding individual child refs. This keeps the parent-child interface clean (no ref forwarding needed) and matches the Hero.svelte pattern.

2. **Terracotta dash markers** - Bullet lists use a 6px horizontal line in terracotta (opacity 0.6) as custom markers instead of circles or default bullets. This creates editorial consistency with the terracotta accent system.

3. **Responsive section padding with clamp()** - Used `clamp(12rem, 15vw, 18rem)` for main sections and `clamp(8rem, 10vw, 12rem)` for the closing bridge. This provides generous breathing room that scales smoothly rather than jumping at breakpoints.

4. **Declarative vs imperative split** - ClosingStatement uses the `animate` action (declarative) since it only has 2 sequential reveals. ProblemsSolved and Services use imperative GSAP with matchMedia since they need stagger across multiple children.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components passed svelte-check on first attempt and all content matched CONTENT.MD exactly.

## Next Phase Readiness

- All 5 components are self-contained and ready for import into `+page.svelte` in Plan 04-02
- Import paths: `$lib/components/content/ProblemsSolved.svelte`, `$lib/components/content/Services.svelte`, `$lib/components/content/ClosingStatement.svelte`
- Page integration will replace existing placeholder sections (#about, #services) with these components
- No blockers for Plan 04-02

## Self-Check: PASSED
