---
phase: 07-contact
subsystem: contact-section
tags: [svelte, gsap, contact, form, zod-validation, dark-chapter, scrub-text]
requires:
  - phase-01 (design tokens, typography)
  - scroll/ components (ScrubTextReveal)
provides:
  - Contact section with scrub-reveal heading
  - Validated contact form (Zod schema)
  - Dark chapter finale unified with footer
affects:
  - phase-08 (accessibility audit)
tech-stack:
  added: []
  patterns:
    - ScrubTextReveal for word-by-word heading disclosure
    - Zod client-side validation with inline error display
    - Thank-you state replaces form after submission
key-files:
  created:
    - src/lib/components/contact/ContactSection.svelte
    - src/lib/components/contact/ContactForm.svelte
  modified:
    - src/routes/+page.svelte
---

## Summary

Built the contact section as the dark-chapter finale. ContactSection uses ScrubTextReveal to animate "Ready when you are. Let's build something that lasts." word-by-word as the user scrolls (start: top 80%, end: top 30%). ContactForm implements a 3-field form (name, email, message) with Zod validation, inline error display, and a thank-you state that replaces the form on success. Dark background with cream text and terracotta accents. Shares the dark chapter with the footer — no divider between them.

## Components (2 files, ~279 LOC)

- **ContactSection** (78 LOC) — ScrubTextReveal heading + form wrapper
- **ContactForm** (201 LOC) — Validated form with Zod, inline errors, success state

## Key Patterns

- Minimal underline borders on inputs, focus state changes to primary color
- Textarea with dynamic height
- No divider between contact and footer — visually unified dark chapter
