---
phase: 05-portfolio
subsystem: portfolio-gallery
tags: [svelte, gsap, scroll-animation, circle-wipe, portfolio, dark-chapter]
requires:
  - phase-01 (design tokens, GSAP utilities)
  - phase-04 (section patterns, animate action)
provides:
  - Circle-wipe portal reveal into dark portfolio chapter
  - Scattered card grid with hover tilt correction
  - Background watermark parallax
  - CharacterCascade heading animation
affects:
  - phase-06 (team section follows portfolio)
  - phase-08 (accessibility audit covers all animations)
tech-stack:
  added: []
  patterns:
    - clip-path circle() scaling from 0.05 to 1 over 200vh pinned scroll
    - Scattered grid via alternating margin-top on even children
    - Single parallax instance (y: -80 scrub) to avoid layout thrashing
key-files:
  created:
    - src/lib/components/portfolio/PortfolioReveal.svelte
    - src/lib/components/portfolio/PortfolioSection.svelte
    - src/lib/components/portfolio/PortfolioCard.svelte
    - src/lib/components/portfolio/PortfolioBgText.svelte
  modified:
    - src/routes/+page.svelte
---

## Summary

Built the portfolio gallery as a cinematic dark-chapter entry. PortfolioReveal creates a circle-wipe expansion pinned over 200vh of scroll — circle scales from 0.05 to 1, revealing the dark portfolio section beneath. PortfolioSection orchestrates a CharacterCascade "Selected Work" heading, scattered card grid (6 placeholder projects), and a large watermark with subtle parallax. PortfolioCard uses alternating 3-5deg tilt that corrects to 0deg on hover with scale(1.02). PortfolioBgText renders "SELECTED WORK" at opacity 0.04 as the only parallax element on the page.

## Components (4 files, ~493 LOC)

- **PortfolioReveal** (143 LOC) — Circle wipe with clip-path scaling, 200vh pin, scrub: 0.8
- **PortfolioSection** (142 LOC) — Orchestrator combining reveal, heading, watermark, card grid
- **PortfolioCard** (124 LOC) — Tilted cards with hover correction, 4:3 aspect placeholder
- **PortfolioBgText** (84 LOC) — Large watermark with single parallax, aria-hidden

## Key Patterns

- CSS `clip-path: circle()` on mobile for performance, CSS `scale` on desktop
- `preserveAspectRatio="none"` on SVG dividers for full-width responsiveness
- Reduced motion skips pin entirely, shows content immediately
- 6 placeholder projects ready for Sanity CMS replacement
