# Project Research Summary

**Project:** Subfracture Website v2
**Domain:** Premium Editorial Portfolio / Culture Studio Website
**Researched:** 2026-02-05
**Confidence:** HIGH

## Executive Summary

Subfracture v2 is a premium culture studio website requiring sophisticated scroll-linked animations, editorial typography, and botanical/anatomical visual storytelling. The research converges on a clear recommendation: **SvelteKit + Svelte 5 with GSAP for a section-based single-page experience**. The stack is already partially in place (SvelteKit 2, Svelte 5, Tailwind CSS 4), and the remaining additions are straightforward.

The recommended approach prioritizes **component isolation with animation encapsulation**. Each homepage section (Hero, Portfolio, Services, etc.) is a self-contained component with its own GSAP logic, composed together in a single +page.svelte. This pattern avoids the animation lifecycle chaos that plagued v1 and creates natural boundaries for development phases. Sanity CMS integration should be deferred until all frontend animations work with static data to avoid coupling and rework.

The primary risk is **GSAP + SvelteKit integration complexity**, specifically ScrollTrigger cleanup on route changes and animation property conflicts between interactive systems. These are well-documented pitfalls with proven mitigation patterns. By establishing cleanup protocols and animation state management in the foundation phase, these risks become manageable. The secondary risk is **horizontal scroll section complexity** for the portfolio gallery, which requires dedicated attention and mobile adaptation but is achievable with ScrollTrigger's proven patterns.

## Key Findings

### Recommended Stack

The tech stack is **production-ready and already 70% installed**. Core framework decisions (SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + TypeScript + Vite) are complete and correct. The major additions are GSAP (now 100% free including all premium plugins) and Sanity CMS (deferred per project requirements).

**Core technologies:**
- **SvelteKit 2 + Svelte 5**: Full-stack framework with runes-based reactivity — already installed, provides clean animation lifecycle management via $effect cleanup and Svelte actions
- **GSAP 3.14+ with ScrollTrigger**: Industry-standard animation engine — 100% free since Webflow acquisition, includes formerly premium plugins (SplitText, MorphSVG, DrawSVG) essential for editorial typography and botanical animations
- **Tailwind CSS 4 + Typography Plugin**: Utility-first styling — already installed (v4 uses CSS-first config, simpler than v3), typography plugin required for editorial long-form content
- **Sanity**: Headless CMS with GROQ queries — defer until static frontend complete, excellent SvelteKit integration with Visual Editing support
- **Lenis**: Lightweight smooth scrolling — plays well with ScrollTrigger without ScrollSmoother's markup constraints
- **Fontsource**: Self-hosted font packages — faster than CDN (no DNS lookup), GDPR compliant, version-locked

**Critical version notes:**
- Tailwind CSS v4 targets modern browsers only (Safari 16.4+, Chrome 111+, Firefox 128+)
- GSAP plugins require browser check for SSR compatibility
- Svelte 5's runes system ($effect, $state) replaces old stores pattern

### Expected Features

Research identified a clear hierarchy between table stakes (expected from any premium agency) and differentiators (unique to Subfracture's brand positioning).

**Must have (table stakes):**
- **Hero with clear value proposition** — 94% of users judge trustworthiness on design alone; must communicate "Culture Studio" immediately
- **Responsive design** — 50%+ traffic is mobile; mobile horizontal scroll requires extra attention
- **Fast loading (<3s)** — pages >5s see 0.6% conversion vs 1.9% at 2.4s; SVG/image optimization critical
- **Portfolio/case studies** — 72% of clients evaluate agencies via website; outcome-led framing differentiates
- **Services section** — numbered pillars (01-05) pattern is on-brand and expected
- **Contact form (3 fields max)** — each field reduces conversion; 11 to 4 fields = 120% increase
- **Team section** — humanizes the studio, builds trust
- **Two-location footer** — Brisbane HQ + LA office is core positioning
- **Accessibility (WCAG 2.1)** — legal requirement; prefers-reduced-motion, keyboard nav, screen readers

**Should have (competitive differentiators):**
- **Botanical/Anatomical Hero Animation** — signature artistic statement; embodies "Where art and systems flow together"; HIGH complexity
- **Lips Reveal + Horizontal Scroll Portfolio** — discovery moment creates intrigue; gallery/magazine feel; HIGH complexity
- **Diagnostic Visual Language** — medical textbook aesthetic with annotations, cross-sections, clinical precision; MEDIUM complexity
- **Outcome-Led Case Study Framing** — metrics, before/after, challenge-solution structure builds ROI trust; MEDIUM complexity
- **Section Numbering System** — editorial/academic feel (01, 02, 03...); LOW complexity
- **Subtle Parallax & Micro-interactions** — modern polish without overwhelming; must respect prefers-reduced-motion; MEDIUM complexity

**Defer (v2+):**
- **Dark Mode Toggle** — nice-to-have, adds complexity; can add post-launch
- **Case Study Deep Dive Pages** — need real content; individual pages can come later
- **Blog/News** — empty blog is worse than none; build when content exists
- **Preloader Animation** — polish layer; site should be fast enough without
- **Sanity CMS Integration** — deferred per project constraints; static content first

**Explicit anti-features (do NOT build):**
- Auto-playing video with sound
- Overwhelming animation density ("trying to be too clever")
- Hidden contact information
- Generic stock photography
- Hero carousers/sliders
- Campaign-adjacent aesthetics (contradicts editorial positioning)

### Architecture Approach

The recommended architecture follows a **section-based component pattern with co-located animation logic**. SvelteKit's file-based routing + Svelte 5's runes system provides optimal foundation for single-page scrolling with complex GSAP animations. Priority on component isolation, animation encapsulation, CMS readiness, and static generation performance.

**Major components:**
1. **+page.svelte (Homepage Composer)** — orchestrates all sections; imports and composes HeroSection, ClientsReveal, ServicesSection, TeamCarousel, etc.; passes data via $props()
2. **Section Components (lib/components/sections/)** — self-contained units with internal animation logic; HeroSection, ClientsReveal, ServicesSection, TeamCarousel, etc.; each handles own ScrollTrigger setup/cleanup
3. **Svelte Actions (lib/actions/)** — GSAP integration wrappers; animate.ts (core), scrollTrigger.ts, parallax.ts, reveal.ts; declarative API for element-level animations
4. **Animation Modules (lib/animations/)** — complex multi-step sequences; heroTimeline.ts, lipsReveal.ts, botanicalGrowth.ts, horizontalScroll.ts; extracted from components for readability
5. **Global Stores (lib/stores/*.svelte.ts)** — runes-based reactive state; scroll.svelte.ts, viewport.svelte.ts, navigation.svelte.ts; SSR-safe via .svelte.ts extension

**Key architectural patterns:**
- **GSAP Action Wrapper**: Svelte actions bind GSAP to element lifecycle with automatic cleanup; declarative `use:animate={{ ... }}` syntax
- **SSR-Safe GSAP Registration**: Check `browser` from `$app/environment` before plugin registration; use dynamic imports for heavy modules
- **Section Isolation**: Each section is independent; no shared animation state between sections except global stores
- **Animation State Management**: Unified AnimationState object prevents property conflicts; only one system controls element at a time

### Critical Pitfalls

Five critical pitfalls emerged from research, each capable of causing rewrites or major delays. All have proven mitigation strategies.

1. **ScrollTrigger Route Change Breakage** — ScrollTrigger instances persist across SvelteKit navigation; positions become stale; animations break on second visit. **Prevention:** Use gsap.context() for ALL animations; call context.revert() in onDestroy; register cleanup with beforeNavigate hook; call ScrollTrigger.refresh() after route transitions.

2. **Svelte 5 $effect vs onMount Confusion** — $effect re-runs on dependency changes, NOT just mount; creates duplicate/conflicting animations. **Prevention:** Use onMount for one-time animation setup, NOT $effect; if using $effect, use untrack() to prevent re-runs; prefer Svelte actions (use:) for element-level animations.

3. **Animation Property Conflicts (Tween Stacking)** — Multiple systems (hover, scroll, idle, magnetic) animate same properties simultaneously; causes stuttering. **Prevention:** Create unified AnimationState object; use gsap.killTweensOf() before new tweens; add overwrite: 'auto' to interactive tweens; implement state machine.

4. **SSR/Hydration Mismatch** — GSAP accesses window/document during SSR; causes build failures or hydration errors. **Prevention:** Guard all GSAP code with browser check; register plugins at module level but wrap in browser check; use dynamic imports for heavy modules.

5. **Horizontal Scroll Section Complexity** — Horizontal scroll interacts poorly with pinned elements, other ScrollTriggers; mobile experience is janky. **Prevention:** Create horizontal ScrollTriggers in correct DOM order OR use refreshPriority; never nest ScrollTriggers inside horizontal sections; test with fast scrolling.

## Implications for Roadmap

Based on combined research, the project should be structured into **6-8 phases** following dependency chains identified in architecture and features analysis. The foundation must establish GSAP lifecycle patterns before any animations are built. Hero and Portfolio are brand-critical but high-complexity, requiring dedicated phases. CMS integration must come last.

### Phase 1: Foundation & Design System
**Rationale:** Everything depends on design tokens, typography, and animation lifecycle patterns. Establishing GSAP cleanup protocols now prevents rework later.

**Delivers:**
- Typography system (editorial serif, numbered sections, generous spacing)
- Color palette (terracotta, cream, black, muted accents)
- Responsive grid (two-column asymmetric, museum whitespace)
- Global styles (app.css with Tailwind imports)
- SSR-safe GSAP setup (browser checks, plugin registration, cleanup utilities)
- Svelte actions foundation (animate.ts, reveal.ts with proper lifecycle)

**Addresses:** Table stakes (responsive framework, accessibility foundation), typography system from FEATURES.md

**Avoids:** Pitfall #4 (SSR hydration), Pitfall #2 ($effect confusion) by establishing patterns early

**Research flag:** Standard patterns (Tailwind + SvelteKit is well-documented) — no research-phase needed

---

### Phase 2: Navigation & Layout Structure
**Rationale:** Persistent UI (nav, footer) must exist before sections are built; active section tracking informs scroll progress.

**Delivers:**
- Sticky navigation with mobile menu
- Two-location footer (Brisbane + LA)
- Scroll progress indicator
- Section numbering system
- Global stores (scroll.svelte.ts, viewport.svelte.ts, navigation.svelte.ts)

**Uses:** Foundation styles, GSAP actions from Phase 1

**Avoids:** Pitfall #1 (route change breakage) by establishing cleanup in navigation context

**Research flag:** Standard patterns — no research-phase needed

---

### Phase 3: Hero Section
**Rationale:** First impression is brand-critical; high complexity requires dedicated phase; botanical animation is signature moment.

**Delivers:**
- Anatomy of Place botanical/anatomical illustration
- SVG draw animation (DrawSVG plugin)
- Parallax scroll layers
- Scroll-triggered exit animation
- Mobile-optimized version (reduced complexity)

**Uses:** GSAP actions, MorphSVG/DrawSVG plugins, heroTimeline.ts module

**Addresses:** Botanical Hero Animation differentiator from FEATURES.md

**Avoids:** Pitfall #6 (SVG transform-origin inconsistencies), Pitfall #8 (mobile performance) by testing early

**Research flag:** May need research-phase — SVG animation sequences for botanical anatomy are complex; check for botanical illustration animation tutorials

---

### Phase 4: Content Sections (Parallelizable)
**Rationale:** Services, Problems, Intro sections share same grid and animation patterns; can be built simultaneously once foundation exists.

**Delivers:**
- Services Section (5 numbered pillars with staggered reveal)
- Problems We Solve Section (6 pain points)
- Intro Section (value proposition)
- Approach Section (methodology)
- Values Section (culture)

**Uses:** ServiceCard component, reveal.ts action, section numbering from Phase 1

**Addresses:** Services and Problems sections from FEATURES.md table stakes

**Avoids:** Pitfall #10 (hard-coded values) by using responsive units

**Research flag:** Standard patterns — content + basic reveal animations, no research-phase needed

---

### Phase 5: Portfolio Gallery (Lips Reveal + Horizontal Scroll)
**Rationale:** Conversion driver; high complexity horizontal scroll requires dedicated phase; mobile adaptation is critical.

**Delivers:**
- Lips reveal animation (scroll-scrubbed SVG morph)
- Horizontal scroll gallery with momentum
- Individual portfolio cards with hover states
- Mobile swipe gesture fallback
- Outcome-led case study framing

**Uses:** lipsReveal.ts module, horizontalScroll.ts module, ScrollTrigger with scrubbing

**Addresses:** Portfolio differentiator from FEATURES.md, Lips Reveal signature moment

**Avoids:** Pitfall #5 (horizontal scroll complexity) by isolation and refreshPriority; Pitfall #8 (mobile performance) with separate mobile experience

**Research flag:** DEFINITELY needs research-phase — horizontal scroll + SVG morphing is complex integration; check GSAP community examples

---

### Phase 6: Team Section
**Rationale:** Independent once grid is established; can be simple photos for MVP or add micro-interactions later.

**Delivers:**
- Team member grid/carousel
- Photos, names, roles
- Optional: hover state micro-interactions

**Uses:** Grid system from Phase 1, optional magnetic.ts action

**Addresses:** Team section table stakes from FEATURES.md

**Avoids:** Standard section, low risk

**Research flag:** Standard patterns — no research-phase needed

---

### Phase 7: Contact & Conversion
**Rationale:** Lead generation critical path; form validation and thank you flow.

**Delivers:**
- Contact form (3 fields: name, email, message)
- Form validation (Zod schema)
- Thank you state/redirect
- Clear CTAs throughout site

**Uses:** Zod for validation, existing grid/typography

**Addresses:** Contact form table stakes from FEATURES.md

**Avoids:** Long forms (conversion killer anti-feature)

**Research flag:** Standard patterns — SvelteKit form actions + Zod is well-documented, no research-phase needed

---

### Phase 8: Polish & Accessibility Audit
**Rationale:** Final pass for micro-interactions, performance optimization, and accessibility compliance.

**Delivers:**
- Micro-interactions throughout (magnetic links, subtle parallax)
- prefers-reduced-motion support
- Accessibility audit (keyboard nav, screen readers, ARIA)
- Performance optimization (image lazy loading, animation throttling)
- Cross-browser testing (especially Firefox for SVG)

**Addresses:** Accessibility table stakes, micro-interactions differentiator from FEATURES.md

**Avoids:** Pitfall #11 (missing reduced motion), Pitfall #8 (mobile performance) through testing

**Research flag:** Standard patterns — accessibility checklist is established, no research-phase needed

---

### Phase Ordering Rationale

**Dependency chain:**
Foundation (design tokens, GSAP patterns) → Layout (nav, footer, stores) → Sections (can parallelize once foundation exists) → Advanced animations (hero, portfolio require foundation + stores) → Polish (depends on all content existing)

**Risk mitigation:**
Animation lifecycle patterns established in Phase 1 prevent all 5 critical pitfalls. By tackling high-complexity items (Hero, Portfolio) as dedicated phases, they get the attention required and don't block other work.

**CMS integration explicitly deferred:**
Not included in roadmap phases. Build all frontend with static data first. CMS adapter added post-launch or as separate initiative to avoid Pitfall #14 (coupling/rework).

### Research Flags

**Phases needing deeper research during planning:**
- **Phase 3 (Hero Section):** Botanical SVG animation sequences are complex; need to research botanical illustration animation tutorials, DrawSVG best practices, layered parallax patterns
- **Phase 5 (Portfolio Gallery):** Horizontal scroll + SVG morphing is advanced integration; check GSAP community examples, horizontal scroll showcase sites, lips/reveal animation techniques

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Tailwind CSS 4 + SvelteKit setup is well-documented in official guides
- **Phase 2 (Navigation):** Sticky nav + scroll tracking is established pattern
- **Phase 4 (Content Sections):** Basic reveal animations are GSAP fundamentals
- **Phase 6 (Team Section):** Grid + optional micro-interactions, standard
- **Phase 7 (Contact):** SvelteKit form actions + Zod validation is well-documented
- **Phase 8 (Polish):** Accessibility checklist is established (WCAG 2.1)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official SvelteKit/GSAP docs; package.json already has core dependencies; GSAP free licensing verified |
| Features | MEDIUM-HIGH | Based on industry trends + competitor analysis; Subfracture-specific items confirmed in project context; MVP prioritization is logical but may shift |
| Architecture | HIGH | Official SvelteKit patterns; Svelte 5 runes documented; section-based approach proven in v1 archive |
| Pitfalls | HIGH | All 5 critical pitfalls verified via official GSAP docs, community forums, and v1 project experience; mitigation patterns tested |

**Overall confidence:** HIGH

The convergence between all four research areas is strong. Stack recommendations align with architectural patterns; features map cleanly to phases; pitfalls are well-understood with proven solutions. The existing v1 archive provides concrete validation of pain points.

### Gaps to Address

While confidence is high, several areas need validation during implementation:

- **Botanical SVG complexity:** Research found DrawSVG/MorphSVG capabilities but not specific botanical anatomy animation examples; may need custom solution or adaptation of medical illustration techniques
- **Mobile horizontal scroll UX:** Pattern exists but mobile touch gesture integration with ScrollTrigger needs testing; may require fallback to vertical carousel on small screens
- **Lenis + ScrollTrigger integration:** Community consensus is positive but implementation details vary; need to test initialization order and RAF loop integration
- **Tailwind CSS v4 browser support:** Targets modern browsers only; confirm analytics show acceptable Safari 16.4+ adoption before proceeding
- **Performance budget:** No specific metrics researched; need to establish thresholds (LCP <2.5s, FID <100ms) and test against them during development

## Sources

### Primary (HIGH confidence)
- [SvelteKit Official Documentation](https://svelte.dev/docs/kit/) — project structure, routing, SSR, adapters
- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/$effect) — $effect lifecycle, cleanup patterns
- [GSAP Official Documentation](https://gsap.com/docs/) — animation API, ScrollTrigger, plugins
- [GSAP ScrollTrigger Tips & Mistakes](https://gsap.com/resources/st-mistakes/) — pitfalls and prevention
- [Tailwind CSS SvelteKit Guide](https://tailwindcss.com/docs/guides/sveltekit) — v4 installation and configuration
- [Sanity SvelteKit Integration](https://www.sanity.io/sveltekit-cms) — Visual Editing, data loading patterns

### Secondary (MEDIUM confidence)
- [Awwwards Portfolio Websites](https://www.awwwards.com/websites/portfolio/) — industry trends for features
- [GSAP Community Forums](https://gsap.com/community/) — SvelteKit integration discussions, route change issues
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no) — action pattern
- [SvelteKit Project Structure Discussion](https://github.com/sveltejs/kit/discussions/7579) — component organization
- [Lenis GitHub Repository](https://github.com/darkroomengineering/lenis) — smooth scroll implementation
- [Web Almanac 2025 Fonts](https://almanac.httparchive.org/en/2025/fonts) — self-hosting statistics

### Tertiary (Project-specific, HIGH confidence)
- v1 Archive (`/_archive/v1/`) — CULTURE-STUDIO-ANIMATION-SYSTEM.md (animation conflicts), REFACTOR_PLAN.md (lifecycle patterns), index.html (section structure)
- Project CLAUDE.md — Known gotchas (ScrollTrigger on load, overflow + perspective incompatibility, grid-template-rows animation pattern)

---
*Research completed: 2026-02-05*
*Ready for roadmap: yes*
