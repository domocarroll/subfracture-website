# UX Audit Skill

## Trigger
/ux-audit

## Description
Comprehensive UX quality audit for the Subfracture website. Walks through a 9-point checklist adapted from award-winning agency patterns, producing a scored report with specific file:line references and recommended fixes.

## Phases
1. **Gather**: Read tokens.css, app.css, +layout.svelte, +page.svelte, and all component files
2. **Analyze**: Run each of the 9 checklist items against the gathered context
3. **Score**: Assign points per item, calculate total
4. **Report**: Output structured report

## Constraints
- SvelteKit + Svelte 5 (runes, not stores)
- Tailwind CSS 4 (not 3)
- GSAP with ScrollTrigger (lazy-loaded, SSR-safe)
- Lenis smooth scroll
- adapter-static for Cloudflare Pages

---

## Nine-Point Checklist

### 1. Accessibility (11 pts)
Check:
- WCAG AA contrast ratios on all text/bg combinations
- Heading hierarchy — no skipped levels (h1 → h2 → h3, never h1 → h3)
- Alt text on all images
- ARIA labels on interactive elements (buttons, links, form fields)
- Focus-visible styles on all interactive elements
- Skip-to-content link present

Tools: Grep for `<img` without `alt`, scan heading levels in page templates, check for `aria-label` on interactive elements.

### 2. Typography (11 pts)
Check:
- All font-size values reference design tokens (no hardcoded rem/px in components)
- All font-family values reference tokens (no raw font strings)
- Line-height ratios use token variables
- Maximum line-width under 75ch on body text
- Golden ratio scale adherence (--text-xs through --text-6xl)

Tools: Grep for hardcoded `font-size:`, `font-family:` values in `.svelte` files that don't use `var(--`.

### 3. Spacing (11 pts)
Check:
- Section padding consistency (uses clamp patterns)
- Container max-width adherence (--content-max, --content-wide)
- Gap token usage where applicable
- No stray margins with raw pixel values

Tools: Grep for hardcoded `margin:`, `padding:`, `gap:` values outside tokens.

### 4. Animation (11 pts)
Check:
- Every animated component has `prefersReducedMotion()` guard
- Scrub values aligned with Lenis (lerp: 0.1, wheelMultiplier: 0.8)
- No layout-triggering properties animated (top, left, margin, width, height) — should use transform/opacity
- `will-change` only where needed (not over-applied)
- All ScrollTrigger instances cleaned up in onDestroy/cleanup return
- No orphaned timelines

Tools: Grep for `gsap` imports, verify corresponding `prefersReducedMotion` check. Grep for animated `top|left|margin|width|height` in GSAP calls.

### 5. Performance (11 pts)
Check:
- All GSAP imports use async `await import('gsap')` pattern
- ScrollTrigger cleanup in every component using it
- No orphaned timelines (created but never killed)
- Font preloading in app.html or +layout
- Bundle size check — no chunk over 100KB gzipped
- No synchronous heavy imports at module level

Tools: Build output analysis (`npm run build`), grep for synchronous GSAP imports.

### 6. Responsiveness (11 pts)
Check:
- Components tested at 375px, 768px, 1024px, 1440px (check CSS breakpoints)
- No horizontal overflow potential (check for fixed widths without max-width)
- Touch targets >= 44px on mobile (buttons, links, form elements)
- Viewport units use svh/dvh where appropriate for mobile
- Clamp patterns for fluid typography and spacing

Tools: Grep for fixed `width:` without responsive fallback, check touch target sizes, scan for `vh` vs `svh`.

### 7. Color System (11 pts)
Check:
- All colors reference CSS custom properties from tokens.css
- No raw hex values in component `<style>` blocks
- Dark/light chapter consistency (portfolio/contact dark, others light)
- Selection styling present (::selection)
- Opacity values consistent (not arbitrary)

Tools: Grep for hex codes (`#[0-9a-fA-F]{3,8}`) outside tokens.css, check for `::selection`.

### 8. Navigation (11 pts)
Check:
- Skip-to-content link present and functional
- Focus trap on mobile menu (if applicable)
- Keyboard navigation on all interactive elements
- Scroll-to-section smooth and accurate
- Focus-visible styles distinct from hover
- Active section indication in nav

Tools: Scan +layout.svelte and Nav component for skip link, keyboard handlers, focus management.

### 9. Content (11 pts)
Check:
- No placeholder/lorem text anywhere
- All links functional (no href="#" placeholders)
- Meta tags present: OG title, OG description, OG image, Twitter card
- Canonical URL set
- JSON-LD structured data (Organization or WebSite)
- Sitemap.xml exists
- Robots.txt configured

Tools: Scan app.html/+layout for meta tags, check static/ for sitemap.xml and robots.txt.

---

## Scoring Rubric

```
A  (90-100): Production-ready. Ship with confidence.
B  (75-89):  Strong with minor issues. Fix before launch.
C  (60-74):  Functional but needs attention. Address within sprint.
D  (0-59):   Significant issues. Block deployment until resolved.
```

Per-item scoring:
- **Full (11 pts)**: Passes all sub-checks with no issues
- **Partial (6 pts)**: Passes most sub-checks, minor issues
- **Minimal (3 pts)**: Basic implementation, significant gaps
- **Fail (0 pts)**: Missing or broken

Total possible: 99 pts + 1 bonus for exceptional craft = 100

---

## Report Format

```markdown
# UX Audit Report — Subfracture Website
**Date**: [timestamp]
**Auditor**: Claude Code (ux-audit skill)

## Overall Grade: [A/B/C/D] ([score]/100)

## Summary
[2-3 sentence overview of site quality]

## Detailed Findings

### 1. Accessibility — [score]/11
[Findings with file:line references]

### 2. Typography — [score]/11
[Findings with file:line references]

... (repeat for all 9 items)

## Recommended Fixes (Ordered by Impact)
1. [Highest impact fix] — [file:line] — [effort: low/med/high]
2. ...

## Strengths
- [What the site does well]
```

---

## Execution Instructions

When invoked with `/ux-audit`:

1. Read the following files first:
   - `src/lib/styles/tokens.css`
   - `src/app.css`
   - `src/app.html`
   - `src/routes/+layout.svelte`
   - `src/routes/+page.svelte`

2. Then scan all component directories:
   - `src/lib/components/**/*.svelte`

3. For each checklist item, use grep/read tools to verify compliance

4. Score each item, compile findings, output the report in the format above

5. End with actionable fix recommendations ordered by impact
