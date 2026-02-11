---
phase: 06-team
subsystem: team-section
tags: [svelte, gsap, team, scroll-animation, cream-chapter]
requires:
  - phase-01 (design tokens, grid system)
  - phase-04 (section patterns, animate action)
provides:
  - Team member cards with staggered fade-up reveal
  - CharacterCascade heading for "The Humans"
  - Cream chapter return after dark portfolio
affects:
  - phase-07 (contact section follows team)
  - phase-08 (accessibility audit)
tech-stack:
  added: []
  patterns:
    - Per-card stagger delay (i * 0.1) with animate action fromTo variant
    - 3:4 aspect placeholder with initial character fallback
key-files:
  created:
    - src/lib/components/team/TeamSection.svelte
    - src/lib/components/team/TeamMember.svelte
  modified:
    - src/routes/+page.svelte
---

## Summary

Built the team section as a warm cream-chapter return after the dark portfolio immersion. TeamSection uses a CharacterCascade "The Humans" heading with staggered fade-up team cards (opacity 0, y 30 → opacity 1, y 0). Grid is 4 columns on desktop, 2 on tablet, 1 on mobile. TeamMember renders a 3:4 aspect photo placeholder with serif name and terracotta-colored sans role. Hover scales cards to 1.03 with cubic-bezier easing.

## Components (2 files, ~209 LOC)

- **TeamSection** (104 LOC) — Orchestrator with CharacterCascade heading, staggered card grid
- **TeamMember** (105 LOC) — Individual card with photo, name, role, hover scale

## Key Patterns

- ScrollTrigger `start: 'top 85%'` triggers when section enters viewport
- Initial character fallback if no photo provided
- Section numbered "03" in editorial style
