# Roadmap: Subfracture Website v2

**Created:** 2026-02-05
**Milestone:** v1.0
**Core Value:** For brands that outgrow campaigns - scholarly authority, warm humanity, systems thinking.

## Overview

| Phase | Name | Goal | Requirements | Criteria |
|-------|------|------|--------------|----------|
| 1 | Foundation & Design System | Establish editorial visual language and animation patterns | FOUND-01 to FOUND-05 | 4 |
| 2 | Navigation & Layout | Create persistent UI structure with scroll awareness | NAV-01 to NAV-04 | 3 |
| 3 | Hero Section | Deliver first impression that embodies Culture Studio positioning | HERO-01 to HERO-04 | 4 |
| 4 | Content Sections | Present services, problems, approach, and proof points | CONT-01 to CONT-04 | 3 |
| 5 | Portfolio Gallery | Create discovery moment with lips reveal and horizontal exploration | PORT-01 to PORT-05 | 4 |
| 6 | Team Section | Humanize the studio with team presence | TEAM-01 to TEAM-03 | 3 |
| 7 | Contact & Footer | Enable conversion and provide location credibility | CTCT-01 to CTCT-04, FOOT-01 to FOOT-03 | 4 |
| 8 | Polish & Accessibility | Ensure universal access and refined micro-interactions | ACCS-01 to ACCS-04, POLSH-01 to POLSH-02 | 5 |

**Total:** 8 phases | 37 requirements | 100% coverage

---

## Phase 1: Foundation & Design System

**Goal:** Establish the editorial visual language (typography, color, grid) and GSAP animation patterns that all subsequent phases depend on.

**Plans:** 3 plans in 2 waves

Plans:
- [x] 01-01-PLAN.md - Install dependencies and create design tokens
- [x] 01-02-PLAN.md - Create GSAP utilities with SSR safety
- [x] 01-03-PLAN.md - Build typography/grid components and demo page

**Requirements:**
- FOUND-01: Typography system implements editorial serif (Playfair Display) with numbered section labels
- FOUND-02: Color palette implements terracotta (#c55a3d), cream background, black body text, muted accents
- FOUND-03: Responsive grid uses two-column asymmetric layout with generous whitespace
- FOUND-04: Global styles configured in Tailwind CSS 4 with design tokens
- FOUND-05: GSAP installed with SSR-safe browser guards and cleanup utilities

**Success Criteria:**
1. Visitor sees terracotta headings on cream background with consistent typography across all viewport sizes
2. Content layouts shift from two-column asymmetric (desktop) to single-column (mobile) at breakpoint
3. Section numbers (01, 02...) appear with consistent styling throughout site
4. Page loads without hydration errors or console warnings related to GSAP/SSR

**Dependencies:** None (foundation phase)

**Research Notes:** Standard patterns - Tailwind CSS 4 + SvelteKit is well-documented. Focus on establishing GSAP cleanup protocols early to prevent Pitfall #1 (ScrollTrigger route change breakage) and Pitfall #4 (SSR hydration mismatch).

---

## Phase 2: Navigation & Layout Structure

**Goal:** Create persistent navigation and footer that provides orientation and establishes the editorial rhythm across the page.

**Plans:** 2 plans in 2 waves

Plans:
- [ ] 02-01-PLAN.md - Create navigation components (Navigation, NavLink, MobileMenu, ScrollProgress)
- [ ] 02-02-PLAN.md - Create footer and integrate into layout

**Requirements:**
- NAV-01: Sticky navigation with clear hierarchy visible on all pages
- NAV-02: Mobile menu with accessible toggle (44x44px touch target)
- NAV-03: Scroll progress indicator shows position in page narrative
- NAV-04: Section numbering system (01, 02...) creates editorial rhythm

**Success Criteria:**
1. Visitor can access navigation from any scroll position on both desktop and mobile
2. Mobile menu toggle is easily tappable and announces state to screen readers
3. Visitor can see their position in page narrative via scroll progress indicator

**Dependencies:** Phase 1 (typography, colors, grid, GSAP utilities)

**Research Notes:** Standard patterns - sticky nav + scroll tracking is established. Establish cleanup in navigation context to avoid Pitfall #1.

---

## Phase 3: Hero Section

**Goal:** Deliver a first impression that immediately communicates Culture Studio positioning with botanical/anatomical visual storytelling.

**Plans:** 4 plans in 3 waves

Plans:
- [x] 03-01-PLAN.md — Extend GSAP utilities (DrawSVGPlugin, SplitText) + create HeroIllustration SVG
- [x] 03-02-PLAN.md — Create HeroContent typography layer + LogoCarousel CSS marquee
- [x] 03-03-PLAN.md — Create Hero orchestrator with GSAP timeline + integrate into page
- [x] 03-04-PLAN.md — Visual verification + three-branch recursive improvement synthesis

**Requirements:**
- HERO-01: Hero section displays clear value proposition ("Culture Studio" positioning)
- HERO-02: Botanical/anatomical illustration establishes brand aesthetic
- HERO-03: Hero works on mobile with simplified treatment
- HERO-04: Hero respects prefers-reduced-motion

**Success Criteria:**
1. Visitor understands Subfracture is a Culture Studio within 5 seconds of page load
2. Botanical illustration is visible and establishes editorial/medical aesthetic
3. Hero content is readable and illustration adapts appropriately on mobile viewport
4. Users with prefers-reduced-motion see static version without animation

**Dependencies:** Phase 1 (GSAP utilities, typography), Phase 2 (navigation integration)

**Research Notes:** May need research-phase for SVG animation sequences. Botanical/anatomical animation is signature moment - DrawSVG plugin available in GSAP. Test mobile performance early to avoid Pitfall #8.

---

## Phase 4: Content Sections

**Goal:** Build the editorial content sections (Problems Solved, Services, Closing Statement) between hero and portfolio, with confrontational tone, numbered service pillars, and scroll-triggered reveals.

**Plans:** 2 plans in 2 waves

Plans:
- [x] 04-01-PLAN.md — Build all 5 content components (ProblemsSolved, ProblemCard, Services, ServicePillar, ClosingStatement)
- [x] 04-02-PLAN.md — Integrate into home page and visual verification

**Requirements:**
- CONT-01: Services section displays 5 numbered pillars with descriptions
- CONT-02: Problems section displays 6 pain points Subfracture solves
- CONT-03: Approach/methodology section explains how Subfracture works
- CONT-04: Statistical callouts display key metrics (+485hr style) [DEFERRED]

**Success Criteria:**
1. Visitor can identify all 5 service pillars with numbered labels (01-05) and descriptions
2. Visitor recognizes at least one pain point from Problems section that resonates with their situation
3. Statistical callouts (+XXXhr style) are visually prominent and communicate value at a glance [DEFERRED]

**Dependencies:** Phase 1 (grid, typography), Phase 2 (section numbering system)

**Research Notes:** Standard patterns - content + basic reveal animations. CONT-03 satisfied by Problems intro (philosophy/WHY) + Services section (process/HOW) layered approach. CONT-04 deferred until real numbers available.

---

## Phase 5: Portfolio Gallery

**Goal:** Create a discovery moment where the lips reveal animation opens to horizontal portfolio exploration, showcasing work with outcome-led framing.

**Requirements:**
- PORT-01: Lips reveal animation triggers on scroll into portfolio section
- PORT-02: Horizontal scroll gallery displays portfolio cards with momentum
- PORT-03: Portfolio cards show outcome-led framing (metrics, challenge-solution)
- PORT-04: Mobile swipe gesture provides fallback for horizontal scroll
- PORT-05: Portfolio section works without JavaScript (graceful degradation)

**Success Criteria:**
1. Visitor experiences lips reveal animation as they scroll into portfolio section
2. Visitor can explore portfolio horizontally (desktop scroll / mobile swipe) with momentum feel
3. Each portfolio card communicates client outcome, not just deliverables
4. Portfolio content remains accessible if JavaScript fails to load

**Dependencies:** Phase 1 (GSAP cleanup patterns), Phase 3 (animation patterns established)

**Research Notes:** DEFINITELY needs research-phase. Horizontal scroll + SVG morphing is complex integration. Check GSAP community examples. Create horizontal ScrollTriggers in correct DOM order OR use refreshPriority per Pitfall #5.

---

## Phase 6: Team Section

**Goal:** Humanize the studio by presenting team members in a way that builds trust and connection.

**Requirements:**
- TEAM-01: Team section displays 4 team members with photos, names, roles
- TEAM-02: Interactive portraits have hover state micro-interactions
- TEAM-03: Team section works on mobile (touch-friendly)

**Success Criteria:**
1. Visitor can see all 4 team members with their photos, names, and roles
2. Desktop users experience subtle micro-interaction when hovering on team portraits
3. Team section is navigable via touch on mobile without hover-dependent information loss

**Dependencies:** Phase 1 (grid system), Phase 4 (section structure patterns)

**Research Notes:** Standard patterns - grid + optional micro-interactions. Low complexity, can use magnetic.ts action if desired.

---

## Phase 7: Contact & Footer

**Goal:** Enable lead generation with a simple contact form and establish location credibility with both office addresses.

**Requirements:**
- CTCT-01: Contact form has 3 fields maximum (name, email, message)
- CTCT-02: Form validates input with clear error messages
- CTCT-03: Thank you state confirms submission
- CTCT-04: Clear CTAs appear throughout site (not just contact section)
- FOOT-01: Footer displays Brisbane HQ address and contact
- FOOT-02: Footer displays Los Angeles office address
- FOOT-03: Footer includes email (ohhello@subfrac.com)

**Success Criteria:**
1. Visitor can submit contact form with name, email, and message - and receives clear confirmation
2. Form validation errors appear inline with clear guidance on how to fix
3. Both Brisbane and Los Angeles addresses are visible in footer, establishing global presence
4. Visitor encounters clear CTAs at multiple points in page scroll, not just at bottom

**Dependencies:** Phase 1 (typography, grid), Phase 2 (footer structure)

**Research Notes:** Standard patterns - SvelteKit form actions + Zod validation is well-documented. Keep form to 3 fields max per conversion research.

---

## Phase 8: Polish & Accessibility Audit

**Goal:** Ensure the site is accessible to all users, respects motion preferences, and has refined micro-interactions throughout.

**Requirements:**
- ACCS-01: Site passes WCAG 2.1 AA accessibility audit
- ACCS-02: All animations respect prefers-reduced-motion
- ACCS-03: Keyboard navigation works throughout site
- ACCS-04: Screen reader compatible (semantic HTML, ARIA labels)
- POLSH-01: Micro-interactions on links and buttons (magnetic, hover states)
- POLSH-02: Subtle parallax on scroll (content sections)

**Success Criteria:**
1. Site achieves zero critical or high-severity issues in accessibility audit (axe-core or Lighthouse)
2. Users with prefers-reduced-motion enabled see no animation - static states only
3. User can navigate entire site using only keyboard (Tab, Enter, Escape, Arrow keys)
4. Screen reader announces all interactive elements, form fields, and navigation items correctly
5. Links and buttons respond with subtle magnetic/hover effects (reduced-motion users see instant state changes)

**Dependencies:** All previous phases (audit requires complete site)

**Research Notes:** Accessibility checklist is established (WCAG 2.1). Final pass for Pitfall #11 (missing reduced motion). Performance optimization (image lazy loading, animation throttling) included here.

---

## Dependency Graph

```
Phase 1: Foundation & Design System
    |
    v
Phase 2: Navigation & Layout
    |
    +---> Phase 3: Hero Section
    |         |
    |         v
    +---> Phase 4: Content Sections --+
    |                                 |
    +---> Phase 5: Portfolio --------+
    |                                 |
    +---> Phase 6: Team Section -----+
    |                                 |
    +---> Phase 7: Contact & Footer -+
                                      |
                                      v
                              Phase 8: Polish & Accessibility
```

**Parallelization potential:** After Phase 2, Phases 3-7 can run partially in parallel (content sections are independent). Phase 8 requires all content complete.

---

## Progress

| Phase | Status | Started | Completed |
|-------|--------|---------|-----------|
| 1 - Foundation | ✓ Complete | 2026-02-05 | 2026-02-05 |
| 2 - Navigation | ✓ Complete | 2026-02-05 | 2026-02-05 |
| 3 - Hero | ✓ Complete | 2026-02-06 | 2026-02-06 |
| 4 - Content | ✓ Complete | 2026-02-09 | 2026-02-09 |
| 5 - Portfolio | Pending | - | - |
| 6 - Team | Pending | - | - |
| 7 - Contact & Footer | Pending | - | - |
| 8 - Polish | Pending | - | - |

---

*Roadmap created: 2026-02-05*
