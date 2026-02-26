# Sisyphus Handoff — Subfracture Website V1

## Context

The site has been rebuilt with a new typographic hero, real content from the intro PDF, simplified page flow, contact form backend, and SEO. What remains is visual polish, portfolio detail pages, and deployment readiness.

## Current State (as of this handoff)

### Done
- [x] New typographic hero with structural fracture (Culture / hairline / Studio offset)
- [x] Removed WebGL/Three.js hero (188KB bundle savings)
- [x] Removed SVG section dividers (ugly jagged mountains)
- [x] Simplified page flow (3 InlineCTAs → 1)
- [x] Real portfolio projects (Sprite, SAOR Skin, Nike, Google, Ekka, Sh!t Happens)
- [x] Real team (Warwick Heathwood, Casey Midgley, Tyronne Curtis, Amanda Archer)
- [x] Real addresses (29 Merivale St Brisbane, 520 Broadway Santa Monica)
- [x] 6 services matching PDF (Strategy, Branding, Creative, Design, Execution, Media Influence)
- [x] Contact form backend (Vercel serverless → Resend → danni@subfrac.com)
- [x] SEO (OG tags, Twitter cards, JSON-LD, sitemap, robots.txt)
- [x] Build passes clean (3.3s, zero errors)

### NOT Done — Sisyphus Phases Below

---

## Creative Doctrine (enforce throughout)

```
White space is the primary material.
One idea per surface.
Imagery is treated as evidence.
Fracture is structural, not literal.
Typography leads the brand.
Restraint = authority.
```

Design position: tech-forward, archival, restrained, calm authority, anti-trend, structural.

---

## Phase 1: Portfolio Detail Pages

**Goal**: Each project gets its own page at `/work/[slug]`. Imagery as evidence.

### Tasks
1. Create route `src/routes/work/[slug]/+page.svelte`
2. Create route `src/routes/work/[slug]/+page.ts` (load function matching slug to project data)
3. Create shared project data file `src/lib/data/projects.ts` with full project details:

```typescript
export interface Project {
  slug: string
  title: string
  outcome: string
  category: string
  lead: string
  narrative: string[]  // paragraphs
  images: {
    hero: string       // placeholder path for now
    gallery: string[]  // placeholder paths
  }
}
```

Project data from the PDF (extract narratives from pages 9-14):

**Sprite** — Brand Activation, Lead: Warwick Heathwood
- Re-igniting Sprite's rich history in Hip Hop culture. The Bodega, a New York institution, perfectly expresses a physical intersection of the Sprite brand and Hip Hop culture.
- The Sprite Corner transformed from a retail experience by day into a performance destination by night, hosting pop-up events all summer.

**SAOR Skin** — Branding, Lead: Casey Midgley
- A wellness brand built on self-trust, not surface. It helps people feel more in tune with their bodies and more at ease in their own skin.
- Sharp serif typography, generous space, and a muted organic palette create a visual identity that feels calm without losing presence.

**Nike** — Activation, Lead: Warwick Heathwood
- Nike SNKRS Box pop-up for the US Olympic Basketball Team. Built with struts and 350 exterior grade LED screens.
- Inside: lit floor, facade walls, products and visual merchandising to match the experience.

**Google** — Activation, Lead: Warwick Heathwood
- Holiday pop-up shops in Chicago and NYC. "Hardware Store" retail narrative — traditional hardware cues (sawhorses, paint cans, lumber) surrounding a classic American home project: a tree house.

**Ekka** — Campaign, Lead: Tyronne Curtis
- "Milo's Magic" AR scavenger hunt integrated into the Ekka event app. Encouraged visitors to explore all areas of the Brisbane Showgrounds via six AR checkpoints.
- Successfully increased foot traffic to less-visited zones.

**Sh!t Happens** — Branding, Lead: Casey Midgley
- Personal care brand, disability community. Clear bold positioning: permission to speak freely. Every element designed to be honest, accessible and unafraid.
- The brand world flexes from shelf to screen with a system that brings dignity and design together.

4. Update `PortfolioSection.svelte` to import from shared data file
5. Update `PortfolioCard.svelte` to link to `/work/{slug}` instead of `#`
6. Detail page layout: large project title (same oversized type style as PDF), narrative text, image placeholders (grey aspect-ratio boxes), project metadata (category, client, lead)
7. Back link to `/#work`
8. Image placeholders should use `aspect-ratio: 16/9` with `background-color: var(--color-bone)` — ready for real images later

### Constraints
- No client logos on detail pages yet (we don't have permission/assets)
- Placeholder images are acceptable — they should look intentional, not broken
- Keep the same cream/dark chapter system

---

## Phase 2: Typography & Spacing Audit

**Goal**: Typography leads. Every gap is considered.

### Tasks
1. Audit heading hierarchy across all sections — ensure consistent use of Playfair Display weights
2. Review section padding consistency: `clamp(8rem, 10vw, 12rem)` should be the standard between major sections
3. Hero: verify the structural offset ratio works at all breakpoints (375px, 768px, 1024px, 1440px)
4. Verify golden ratio scale consistency — all type sizes should come from the token system, no stray hardcoded values
5. Check that `--color-text-muted` (#4a4a4a) passes WCAG AA on cream (#f5f0e8) — if not, darken it
6. Review the "What we build" label typography against section heading numbers (01, 02, etc.) for consistency
7. Ensure no component uses `font-family: system-ui` or other fallback directly — everything should reference `var(--font-sans)` or `var(--font-serif)`

---

## Phase 3: Mobile Responsiveness

**Goal**: Every viewport works. No jank.

### Tasks
1. Test hero at 375px — verify "Culture" and "Studio" don't overflow, offset reduces appropriately
2. Test carousel at 375px — verify cards are usable, touch targets ≥ 44px
3. Test services scroll at 375px — verify pinned section works, no content clipping
4. Test portfolio grid at 375px — single column, cards readable
5. Test contact form at 375px — inputs full-width, no horizontal overflow
6. Test footer at 375px — single column stack
7. Verify no horizontal scroll at ANY viewport width between 320px and 1920px
8. Check mobile menu open/close, keyboard accessibility

---

## Phase 4: Accessibility Pass

**Goal**: Calm authority extends to how the site treats all users.

### Tasks
1. Add skip-to-content link in layout (`<a href="#main-content" class="sr-only focus:not-sr-only">`)
2. Verify heading hierarchy: h1 (hero) → h2 (section headings) → h3 (cards/items) — no skipped levels
3. All interactive elements have focus-visible styles (terracotta outline, 4px offset)
4. Mobile menu: focus trap when open, return focus to toggle on close
5. Carousel: verify arrow key navigation works, announce current card to screen readers
6. Contact form: error messages associated via aria-describedby
7. Portfolio cards: ensure `<a>` wraps have meaningful accessible names
8. Reduced motion: verify ALL animated components have static fallbacks (hero entrance, services scroll, carousel, character cascade, scrub text)
9. Color contrast: verify all text/bg combinations pass WCAG AA

---

## Phase 5: Performance & Build

**Goal**: Fast. Light. Measured.

### Tasks
1. Run Lighthouse on the built site (npm run preview) — target 90+ all categories
2. Verify fonts are preloaded in app.html or layout
3. Check for unused CSS (Tailwind purge should handle this, but verify)
4. Lazy load below-fold images (portfolio section)
5. Verify GSAP is tree-shaken — only ScrollTrigger should be imported, nothing else
6. Build output should have NO chunks over 100KB gzipped (verify with `npm run build` output)
7. Test with network throttling: 3G simulation should still be usable

---

## Phase 6: Deployment Config

**Goal**: Ship it.

### Tasks
1. Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
2. Verify the Vercel serverless function at `api/contact.ts` deploys correctly alongside the static build
3. Create `.env.example` with all required env vars (already done — verify it's complete)
4. Set up Plausible Analytics (add script tag to app.html, guard with env var for domain)
5. Generate OG image: typographic, 1200x630, "Subfracture" + "Culture Studio" on cream background. Save as `static/og-image.png`

---

## Phase 7: Visual Polish (Gemini 3.1 Preview)

**Goal**: Final graphical refinement pass.

### Tasks
1. Screenshot every section at desktop (1440px) and mobile (375px)
2. Feed screenshots to Gemini 3.1 Preview with the creative doctrine as evaluation criteria
3. Address feedback: spacing, typography micro-adjustments, color consistency, shadow/border cleanup
4. Re-screenshot and verify
5. Specific areas to scrutinize:
   - Hero: does the structural offset feel inevitable or contrived?
   - Cream→dark transition: does the hard cut feel intentional?
   - Portfolio cards: do they look like evidence or decoration?
   - Footer: does it feel like the back page of a monograph?
   - Overall: does scrolling feel like turning pages in a well-designed book?

---

## Blockers & Dependencies

| Item | Status | Blocks |
|------|--------|--------|
| Portfolio project images | Waiting on Dom | Phase 1 (use placeholders until then) |
| Team headshot photos | Waiting on Dom (or go text-only) | — |
| Resend API key | Need to create account | Phase 6 (contact form won't send until deployed with key) |
| Domain confirmation | subfrac.com assumed | Phase 6 |
| Vercel account/team | Need Dom to confirm | Phase 6 |

---

## Execution Order

Phases 1-5 can be worked in order. Phase 6 requires deployment credentials. Phase 7 comes last after everything else is built.

**Estimated effort**: 4-6 Sisyphus sessions across the remaining sprint days.

---

## Files Modified This Session

```
CREATED:
  .planning/SPRINT-V1.md          — Full sprint plan
  .planning/SISYPHUS-HANDOFF.md   — This file
  api/contact.ts                   — Vercel serverless contact endpoint
  .env.example                     — Environment variable template
  static/sitemap.xml               — SEO sitemap
  _archive/hero-webgl/             — Archived old WebGL hero components

MODIFIED:
  src/lib/components/hero/Hero.svelte         — Simplified (no WebGL)
  src/lib/components/hero/HeroContent.svelte  — New typographic hero
  src/routes/+page.svelte                     — Simplified flow, SEO, no dividers
  src/lib/components/content/Services.svelte  — 6 services from PDF
  src/lib/components/portfolio/PortfolioSection.svelte — Real projects
  src/lib/components/team/TeamSection.svelte  — Real team
  src/lib/components/layout/Footer.svelte     — Real addresses
  src/lib/components/contact/ContactForm.svelte — Backend integration
  static/robots.txt                           — Sitemap reference
  package.json                                — Removed Three.js deps

DELETED:
  src/lib/components/hero/HeroCrack.svelte
  src/lib/components/hero/HeroRose.svelte
  src/lib/components/hero/HeroIllustration.svelte
  src/lib/components/hero/LogoCarousel.svelte
  fracture-hero-section.html
  screenshot-fullpage.jpeg
```
