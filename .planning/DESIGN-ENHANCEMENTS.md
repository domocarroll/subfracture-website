# Design Enhancements Plan

**Source**: AI LABS video analysis, award-winning creative agency patterns, Subfracture codebase audit
**Date**: 2026-03-02
**Doctrine**: Restraint = authority. White space is the primary material. Not doing too much.

---

## Section A: "Learn and Apply"

Specific enhancements inspired by the AI LABS video and top creative agency patterns. Every suggestion here makes something cleaner, not busier.

---

### A1. Hero Entrance Timing Refinement

**Current state**: Hero timeline uses `power3.out` with 1.0s durations and -0.4s overlaps. The stagger is tight and the whole entrance completes in roughly 2 seconds.

**What the best agencies do differently**: Slower, more deliberate entrance pacing. The hero is the first thing anyone sees -- it should breathe. Award-winning sites (Locomotive, Zajno, Osmo) use longer durations with more dramatic easing on hero elements, creating a sense of ceremony rather than loading.

**Recommended changes**:

```
File: src/lib/components/hero/HeroContent.svelte

1. Increase delay from 0.3 to 0.5 (let the page settle)
2. "Culture" fade-up: duration 1.0 → 1.2, ease 'power3.out' → 'expo.out'
3. Rule draw: duration 0.9 → 1.1, keep power2.inOut (the draw IS the moment)
4. "Studio" fade-up: duration 1.0 → 1.2, y: 24 → 20 (less vertical travel)
5. Meta reveal: duration 0.8 → 1.0, add opacity ease: 'power2.out'
6. Increase overlaps slightly: -=0.4 → -=0.5, -=0.5 → -=0.6, -=0.3 → -=0.4
```

**Why**: The current entrance is good but slightly hurried. Slowing it down by ~20% with softer easing makes it feel inevitable rather than performative. The rule draw is the structural fracture moment -- giving it an extra 200ms lets it command attention.

**Complexity**: Small

---

### A2. Section Entrance Pattern -- Consistent "Quiet Arrival"

**Current state**: Different sections use different entrance patterns:
- ProblemsSolved: `gsap.from` with opacity:0, y:24 via `animate` action
- ClosingStatement: ScrubTextReveal + animate action (fromTo)
- TeamSection: animate action with stagger (i * 0.1)
- PortfolioSection: CharacterCascade + circle wipe

**What the video showed**: Consistent, system-level entrance animations. Every section uses the same fundamental reveal pattern, creating rhythm. The best creative agencies (Basic, Locomotive) treat scroll entrances like a heartbeat -- same cadence, different content.

**Recommended changes**:

```
Standardize the "quiet arrival" pattern across all content sections:

1. Section label (terracotta number/text): fade-up, y: 12, duration: 0.5
   - Start: 'top 85%'

2. Section heading: fade-up, y: 20, duration: 0.7, delay: 0.1
   - Start: 'top 85%'

3. Body text: fade-up, y: 16, duration: 0.6, delay: 0.2
   - Start: 'top 80%'

4. Grid/list items: stagger fade-up, y: 20, stagger: 0.08, duration: 0.5
   - Start: 'top 80%'

Easing: 'power3.out' everywhere (already our global default)
```

**Files to update**:
- `src/lib/components/content/ProblemsSolved.svelte` -- align entrance timing
- `src/lib/components/team/TeamSection.svelte` -- reduce delay per card from 0.1 to 0.08
- `src/lib/components/contact/ContactSection.svelte` -- add staggered entrance to body

**Why**: Rhythm creates trust. When every section "arrives" with the same cadence, the scroll experience feels composed rather than assembled. The variation comes from the content, not the animation pattern.

**Complexity**: Small

---

### A3. Softer Scroll-Scrub Smoothing

**Current state**: Services section uses `scrub: 0.6`. PortfolioReveal uses `scrub: 0.8`. ScrubTextReveal uses `scrub: true` (instant).

**What the video emphasized**: "GSAP controls what happens when you scroll. Lenis controls the feel of the scroll itself." Their complementary approach means GSAP scrub values should be slightly smoother -- Lenis handles the physical feel, GSAP should match that fluidity rather than fight it.

**Recommended changes**:

```
File: src/lib/components/content/Services.svelte
  scrub: 0.6 → scrub: 0.8  (match Lenis smoothness)

File: src/lib/components/scroll/ScrubTextReveal.svelte
  scrub: true → scrub: 0.5  (add slight lerp instead of instant)

File: src/lib/components/portfolio/PortfolioReveal.svelte
  scrub: 0.8 → keep (already good)
```

**Why**: `scrub: true` (instant) can feel jerky when paired with Lenis smooth scroll, because the animation jumps to exact scroll position while the scroll itself is interpolating. Adding a small scrub value (0.5) creates a cohesive feel where everything moves at the same speed. Services going from 0.6 to 0.8 brings it in line with the portfolio reveal.

**Complexity**: Small

---

### A4. Reduce Service Pillar Scroll Height

**Current state**: Services section is 600vh for 6 pillars (100vh per pillar). The hold duration for the last pillar is 30 (vs 10 for others).

**What award-winning agencies do**: Shorter scroll distances per content unit. 600vh is a lot of scroll for text content without imagery. The video's approach treated each section as purposeful -- no dead scroll space.

**Recommended changes**:

```
File: src/lib/components/content/Services.svelte

1. Reduce outer height: 600vh → 480vh (80vh per pillar)
2. Reduce last pillar holdDuration: 30 → 18
3. Reduce gap between pillars: duration 4 → 3

This tightens the overall scroll without changing the animation choreography.
The enter/hold/exit rhythm stays identical, just compresses slightly.
```

**Why**: At 600vh, users spend a long time scrolling through text-only content. Reducing to 480vh maintains the cinematic feel while respecting the user's scroll investment. The last pillar's 30-unit hold is especially long -- 18 units still provides comfortable reading time before unpin.

**Complexity**: Small

---

### A5. Typography Spacing Refinement -- Wider Letter-Spacing on Labels

**Current state**: Section labels ("WHAT WE BUILD", terracotta numbers) use `letter-spacing: 0.1em`. Nav links use standard sans-serif spacing.

**What the best studios do**: Wider letter-spacing on uppercase labels, creating more air and distinction between wayfinding text and content text. Locomotive, Zajno, and similar studios typically use 0.15-0.2em for uppercase micro-labels.

**Recommended changes**:

```
File: src/lib/styles/tokens.css
  Add: --letter-spacing-label: 0.15em;

File: src/lib/components/content/Services.svelte
  .label letter-spacing: 0.1em → 0.15em

File: src/lib/components/portfolio/PortfolioSection.svelte
  .portfolio-number letter-spacing: 0.05em → 0.15em

File: src/lib/components/team/TeamSection.svelte
  .team-number letter-spacing: 0.05em → 0.15em

File: src/lib/components/contact/ContactSection.svelte
  .contact-number letter-spacing: 0.05em → 0.15em
```

**Why**: The inconsistency between 0.05em and 0.1em across section labels undermines the system feel. Standardizing at 0.15em creates more visual hierarchy between labels and headings. It costs nothing and adds visible polish.

**Complexity**: Small

---

### A6. Subtle Parallax on Hero Elements

**Current state**: Hero is completely static after entrance animation. Once revealed, nothing moves until the user scrolls past.

**What the video and top agencies do**: Very subtle parallax drift on hero elements as the user begins scrolling. Not a full parallax effect -- just a 5-10% differential speed between "Culture" and "Studio" as they scroll offscreen, reinforcing the structural fracture concept.

**Recommended changes**:

```
File: src/lib/components/hero/HeroContent.svelte

After the entrance timeline completes, add a ScrollTrigger-driven parallax:

gsap.to('.hero-culture', {
  y: -30,
  ease: 'none',
  scrollTrigger: {
    trigger: heroEl,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8
  }
});

gsap.to('.hero-studio', {
  y: -15,
  ease: 'none',
  scrollTrigger: {
    trigger: heroEl,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8
  }
});

gsap.to('.hero-meta', {
  y: -5,
  ease: 'none',
  scrollTrigger: {
    trigger: heroEl,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8
  }
});
```

**Why**: "Culture" drifts faster than "Studio" as the user scrolls, which physically separates the two type masses -- the fracture widens. This is the one place where adding motion earns its complexity because it deepens the brand metaphor. The values are small (30px, 15px, 5px) so it reads as natural physics, not a "parallax effect."

**Complexity**: Medium

---

### A7. Portfolio Cards -- Staggered Scroll Entrance

**Current state**: Portfolio cards have no scroll-triggered entrance. They're visible as soon as the circle wipe reveals them. Only hover effects (CSS).

**What award-winning agencies do**: Staggered card entrances on scroll. Cards fade-up individually as the user scrolls into the grid area, creating visual momentum. This is one of the most common patterns on Awwwards-winning creative agency sites.

**Recommended changes**:

```
File: src/lib/components/portfolio/PortfolioSection.svelte

Add animate action to each PortfolioCard wrapper:

{#each projects as project, i}
  <div
    use:animate={{
      type: 'fromTo',
      fromVars: { opacity: 0, y: 40 },
      opacity: 1,
      y: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power3.out',
      scrollTrigger: { start: 'top 85%' }
    }}
  >
    <PortfolioCard ... />
  </div>
{/each}
```

**Why**: After the cinematic circle wipe, the cards just sitting there is anticlimactic. A simple staggered fade-up completes the reveal sequence without competing with the wipe. The 0.08s stagger is fast enough to feel like a wave, not a slideshow.

**Complexity**: Small

---

### A8. Navigation Scroll Progress -- Thinner, More Refined

**Current state**: Navigation has a ScrollProgress component (visible in screenshots as a thin bar at the top).

**What the best studios do**: Either no scroll progress indicator at all (maximum restraint), or an extremely thin one (1px) with subtle opacity. The scroll progress bar is functional but can feel utilitarian on a brand-forward site.

**Recommended changes**:

```
File: src/lib/components/navigation/ScrollProgress.svelte

1. Reduce height from current to 1px
2. Set opacity to 0.4 (let it whisper, not shout)
3. Use terracotta color (already does this) but at reduced opacity
```

**Why**: The scroll progress indicator serves wayfinding but should not compete with the content. At 1px and 40% opacity, it becomes ambient information -- present for those who look, invisible to those absorbed in the content.

**Complexity**: Small

---

### A9. Closing Statement -- Add Breathing Room

**Current state**: ClosingStatement padding is `clamp(8rem, 10vw, 12rem)`. The scrub text reveal starts at `top 85%` and ends at `top 35%`.

**What the video approach suggests**: Key statements deserve more vertical space. They positioned their key copy with enormous breathing room -- the statement is the entire viewport, with nothing else visible.

**Recommended changes**:

```
File: src/lib/components/content/ClosingStatement.svelte

1. Increase padding: clamp(8rem, 10vw, 12rem) → clamp(12rem, 15vw, 18rem)
2. Add min-height: 80vh to the section (ensure statement owns the viewport)
3. Center vertically with flexbox: display: flex; align-items: center;
```

**Why**: "Entry points are flexible. Outputs are deliberate." is a thesis statement. It should own its viewport. The current padding gives it space but doesn't guarantee it feels monumental. Adding `min-height: 80vh` with vertical centering means the statement appears alone on screen -- one idea per surface.

**Complexity**: Small

---

### A10. Contact Section -- Heading Left-Aligned, Not Centered

**Current state**: Contact section scrub heading is left-aligned (which is good), but the `contact-body` max-width is 36rem and left-aligned within the container.

**What the video/agency pattern suggests**: The heading and body should share a clear left edge. The current layout is close but could benefit from making the heading max-width wider to fill more horizontal space, creating a stronger left margin line.

**Recommended changes**:

```
File: src/lib/components/contact/ContactSection.svelte

:global(.contact-heading)
  max-width: 20ch → max-width: 24ch

This allows longer lines to stretch wider, creating a more
confident typographic presence in the dark chapter.
```

**Why**: On the dark background, wider heading lines create visual weight that anchors the section. 20ch feels slightly narrow for the text "Ready when you are. Let's build something that lasts." -- widening to 24ch lets it breathe across two natural lines rather than being forced narrow.

**Complexity**: Small

---

## Section B: "Already Strong"

What we do well that the video's approach does not match or exceed.

---

### B1. Structural Metaphor in the Hero

Our hero is architecturally meaningful. "Culture" and "Studio" as displaced type masses separated by a hairline rule IS the brand. The video's approach was visually clean but generic -- a creative agency template without conceptual depth. Our fracture concept gives every visitor a visual metaphor to understand the brand before reading a single word.

**Verdict**: Keep. Do not change the hero concept. Only refine timing (A1) and add subtle parallax (A6).

---

### B2. Service Pillar Scroll-Through Choreography

The 600vh pinned scroll-through with per-pillar ghost watermarks, word-weight thickening, and cascading bullets is genuinely sophisticated. The font-weight 400-to-700 animation on tagline words is a signature moment that most agencies do not attempt. The video used simpler fade-in/fade-out patterns.

**Verdict**: Keep the choreography. Only tighten scroll height (A4) and smooth scrub value (A3).

---

### B3. ScrubTextReveal Component

The word-by-word scrub reveal is a reusable component with proper TypeScript interfaces, configurable start/end/scrub, and reduced motion support. This is production-quality scroll animation work. The video achieved similar effects but with less componentization.

**Verdict**: Keep. Refine scrub smoothing (A3) only.

---

### B4. ScrollCarousel with Spring Physics

The 3D fold-behind carousel with dual spring configs (tension vs snap), dead zone, rubber band resistance, and three interaction modes (scroll, drag, keyboard) is significantly more sophisticated than anything shown in the video. This is genuinely impressive interaction design.

**Verdict**: Keep entirely. No changes recommended.

---

### B5. Reduced Motion Support

Every animated component has explicit reduced motion handling: static fallbacks, `prefersReducedMotion()` checks, `@media (prefers-reduced-motion: reduce)` CSS. The video mentioned WCAG checks but we have this built into the architecture from the start.

**Verdict**: Keep. This is ahead of the video's approach.

---

### B6. Design Token System

Our golden ratio type scale, semantic color tokens, organic easing curves, and content-max/content-wide layout constraints create a cohesive system. The video's multi-agent approach had to manually synchronize design tokens across agents. Our tokens.css ensures consistency inherently.

**Verdict**: Keep. Extend with `--letter-spacing-label` token (A5).

---

### B7. Lenis + GSAP Integration Architecture

Our Lenis init in +layout.svelte with `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.lagSmoothing(0)` is exactly the pattern the video recommended. We implemented it identically and correctly.

**Verdict**: Keep. Validated by the video.

---

### B8. GSAP Svelte Action (`animate`)

The `animate` action is a clean abstraction unique to our SvelteKit stack. It provides declarative GSAP with automatic ScrollTrigger cleanup on unmount -- something the video's Next.js approach handled with useEffect cleanup. Our action-based approach is more ergonomic.

**Verdict**: Keep. Use more consistently across sections (A2).

---

## Section C: "UX Audit Skill" -- Specification

Based on the video's 9-point checklist approach, adapted for our SvelteKit stack.

---

### C1. Skill Structure

```
.claude/skills/ux-audit.md
```

The skill should be a Claude Code custom skill that can be invoked with `/ux-audit` and produces a scored report.

### C2. Nine-Point Checklist

| # | Category | What to Check | Tool |
|---|----------|---------------|------|
| 1 | **Accessibility** | WCAG AA contrast ratios on all text/bg combos; heading hierarchy (no skipped levels); alt text on images; ARIA labels on interactive elements | Python script: `axe-core` or `pa11y` |
| 2 | **Typography** | Consistent use of design tokens (no hardcoded font-size/family); line-height ratios; max line-width under 75ch; golden ratio scale adherence | Grep + manual review |
| 3 | **Spacing** | Section padding consistency; container max-width adherence; gap token usage; no stray margins | Grep for hardcoded px/rem values outside tokens |
| 4 | **Animation** | Reduced motion support on every animated component; scrub values aligned with Lenis; no layout-triggering properties animated (top/left/margin); will-change only where needed | AST scan of GSAP calls |
| 5 | **Performance** | No GSAP imports outside async/lazy patterns; ScrollTrigger cleanup in onDestroy; no orphaned timelines; font preloading; bundle size check | Build output analysis |
| 6 | **Responsiveness** | All sections tested at 375px, 768px, 1024px, 1440px; no horizontal overflow; touch targets >= 44px; viewport units using svh/dvh where appropriate | Playwright viewport screenshots |
| 7 | **Color System** | All colors reference CSS custom properties; no raw hex values in components; dark/light chapter consistency; selection styling present | Grep for hex codes outside tokens.css |
| 8 | **Navigation** | Skip-to-content link present; focus trap on mobile menu; keyboard navigation on all interactive elements; scroll-to-section smooth; focus-visible styles | Manual + automated a11y |
| 9 | **Content** | No placeholder/lorem text; all links functional; meta tags present (OG, Twitter, JSON-LD); canonical URL set; sitemap exists | Automated URL + meta scan |

### C3. Scoring Rubric

```
A  (90-100): Production-ready. Ship with confidence.
B  (75-89):  Strong with minor issues. Fix before launch.
C  (60-74):  Functional but needs attention. Address within sprint.
D  (0-59):   Significant issues. Block deployment until resolved.
```

Each checklist item is worth up to 11 points (9 items * 11 = 99, plus 1 bonus point for exceptional craft). Partial credit:
- **Full (11 pts)**: Passes all sub-checks with no issues
- **Partial (6 pts)**: Passes most sub-checks, minor issues
- **Minimal (3 pts)**: Basic implementation, significant gaps
- **Fail (0 pts)**: Missing or broken

### C4. Implementation Approach

```
Phase 1: Manual checklist (the skill walks through each item systematically)
Phase 2: Add Python automation scripts for items 1, 5, 6, 7, 9
Phase 3: Playwright integration for item 6 (viewport screenshots)
```

### C5. Python Automation Scripts

```python
# scripts/ux-audit/contrast-check.py
# Uses WCAG 2.1 contrast algorithm on all color token pairs

# scripts/ux-audit/token-usage.py
# Greps for hardcoded values that should use tokens

# scripts/ux-audit/animation-audit.py
# Scans .svelte files for GSAP usage without reduced motion checks

# scripts/ux-audit/bundle-check.py
# Parses Vite build output for oversized chunks

# scripts/ux-audit/meta-check.py
# Validates OG tags, Twitter cards, JSON-LD, sitemap, robots.txt
```

### C6. Skill Prompt Template

```markdown
# UX Audit Skill

## Trigger
/ux-audit

## Phases
1. **Gather**: Read tokens.css, app.css, +layout.svelte, +page.svelte, all component files
2. **Analyze**: Run each of the 9 checklist items against the gathered context
3. **Score**: Assign points per item, calculate total
4. **Report**: Output structured report with:
   - Overall grade (A/B/C/D)
   - Per-item score and findings
   - Specific file:line references for issues
   - Recommended fixes ordered by impact

## Constraints
- SvelteKit + Svelte 5 (runes, not stores)
- Tailwind CSS 4 (not 3)
- GSAP with ScrollTrigger (lazy-loaded, SSR-safe)
- Lenis smooth scroll
- adapter-static for Cloudflare Pages
```

---

## Section D: "Implementation Priority"

Ordered by impact-to-effort ratio. Highest value first.

---

| Priority | Enhancement | File(s) | Change | Complexity |
|----------|-------------|---------|--------|------------|
| 1 | **A3**: Softer scroll-scrub smoothing | Services.svelte, ScrubTextReveal.svelte | Change 3 scrub values | Small |
| 2 | **A5**: Standardize label letter-spacing | tokens.css, Services, Portfolio, Team, Contact | Add token, update 4 files | Small |
| 3 | **A8**: Thinner scroll progress | ScrollProgress.svelte | Height + opacity tweak | Small |
| 4 | **A1**: Hero entrance timing | HeroContent.svelte | Adjust 6 timing values | Small |
| 5 | **A9**: Closing statement breathing room | ClosingStatement.svelte | Padding + min-height + flex | Small |
| 6 | **A10**: Contact heading width | ContactSection.svelte | max-width 20ch to 24ch | Small |
| 7 | **A2**: Consistent section entrances | ProblemsSolved, Team, Contact | Align animate timings | Small |
| 8 | **A7**: Portfolio card stagger entrance | PortfolioSection.svelte | Add animate action to cards | Small |
| 9 | **A4**: Reduce services scroll height | Services.svelte | 600vh to 480vh, adjust holds | Small |
| 10 | **A6**: Hero parallax drift | HeroContent.svelte | Add 3 ScrollTrigger instances | Medium |
| 11 | **C**: Build UX audit skill | .claude/skills/ux-audit.md | New skill + scripts | Large |

---

## Notes on Pencil.dev

Pencil.dev is primarily a Next.js/React design-to-code tool. Its MCP integration exposes canvas context to Claude Code, which reads coordinates, tokens, and structure to generate matching components. As of March 2026, there is no documented SvelteKit support. The bidirectional sync is React-focused.

**Recommendation**: Monitor for SvelteKit support. In the meantime, our design token system in `tokens.css` serves a similar role -- it IS our design file, just expressed as code rather than canvas. If Pencil.dev adds Svelte support, the MCP integration could replace manual token synchronization.

---

## Creative Doctrine Compliance

Every recommendation above was evaluated against:

```
White space is the primary material.         -- A9 adds more space, nothing removes it
One idea per surface.                        -- A9 ensures the closing statement owns its viewport
Imagery is treated as evidence.              -- No changes to imagery approach
Fracture is structural, not literal.         -- A6 deepens the fracture metaphor with parallax
Typography leads the brand.                  -- A1, A5 refine the typographic system
Restraint = authority.                       -- Nothing added is decorative; everything earns its place
```

No recommendation adds visual complexity. Every change either tightens timing, standardizes patterns, or deepens existing intent.
