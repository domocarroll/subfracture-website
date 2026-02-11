---
phase: 08-polish
subsystem: polish-accessibility
tags: [accessibility, reduced-motion, scroll-components, section-dividers, cta, utilities]
requires:
  - all previous phases
provides:
  - Scroll storytelling primitives (ScrubTextReveal, CharacterCascade, SectionDivider)
  - InlineCTA distributed throughout page narrative
  - scroll-helpers.ts factory functions
  - Color chapter system (.chapter-cream, .chapter-warm, .chapter-dark)
  - Reduced motion support across all animations
  - Focus-visible styling system
  - Lenis smooth scroll with GSAP sync
affects: []
tech-stack:
  added: []
  patterns:
    - Factory functions for ScrollTrigger creation (play-reset, scrub)
    - CSS color chapters for section theming
    - Consistent reduced-motion: 0.01ms animation duration
key-files:
  created:
    - src/lib/components/scroll/ScrubTextReveal.svelte
    - src/lib/components/scroll/CharacterCascade.svelte
    - src/lib/components/scroll/SectionDivider.svelte
    - src/lib/components/ui/InlineCTA.svelte
    - src/lib/utils/scroll-helpers.ts
    - src/routes/+layout.ts
  modified:
    - src/routes/+layout.svelte
    - src/app.css
    - src/lib/components/hero/Hero.svelte
    - src/lib/components/hero/HeroContent.svelte
    - src/lib/components/content/ClosingStatement.svelte
    - src/lib/components/navigation/Navigation.svelte
---

## Summary

Final polish pass establishing the scroll storytelling system and accessibility foundation. Created three scroll primitives: ScrubTextReveal (word-by-word opacity tied to scroll), CharacterCascade (character-level y-translate on enter), and SectionDivider (organic/fracture SVG transitions). Built InlineCTA as a terracotta-dot link distributed after key sections. Created scroll-helpers.ts with factory functions (createScrollPlayReset, createScrollScrub) that respect reduced motion. Added color chapter CSS classes for section theming. Integrated Lenis smooth scroll synced to GSAP ScrollTrigger via layout. Added comprehensive reduced motion support (0.01ms durations) and focus-visible styling.

## Scroll Primitives (3 files, ~384 LOC)

- **ScrubTextReveal** (135 LOC) — Word-by-word opacity reveal, $derived word splitting, scrub: true
- **CharacterCascade** (153 LOC) — Character-level yPercent animation, play-on-enter/reset-on-leave
- **SectionDivider** (96 LOC) — SVG wave (organic) or jagged (fracture) dividers, colorFrom/colorTo props

## Utilities & UI (2 files, ~188 LOC)

- **InlineCTA** (73 LOC) — Terracotta dot link, scales dot 1.5x on hover
- **scroll-helpers.ts** (115 LOC) — Factory functions returning ScrollTrigger instances for cleanup

## Accessibility

- Every animation component respects prefers-reduced-motion
- Focus-visible outlines (2px) on all interactive elements
- aria-hidden on decorative elements
- Semantic HTML with proper heading hierarchy
- Selection styling matches design system
