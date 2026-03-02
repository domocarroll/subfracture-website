# Sisyphus Handoff — Design Polish Sprint

**Source**: AI LABS video analysis + award-winning agency pattern research
**Date**: 2026-03-02
**Doctrine**: Restraint = authority. Every change makes things cleaner, not busier.
**Prerequisite**: Read `.planning/DESIGN-ENHANCEMENTS.md` for full rationale behind each change.

---

## What This Sprint IS

Refinement of an already-solid site. Timing tweaks, spacing standardization, animation smoothing. The kind of work that takes a B+ to an A. No new sections, no new features, no new dependencies.

## What This Sprint IS NOT

A rebuild. A redesign. Adding complexity. If any change makes the site busier or noisier, skip it.

---

## Phase 1: Scroll-Scrub Alignment (Priority 1)

**Goal**: Make GSAP scrub values complement Lenis instead of fighting it.

### Task 1.1 — Services scrub smoothing
```
File: src/lib/components/content/Services.svelte
Line ~128: scrub: 0.6 → scrub: 0.8
```
Rationale: Lenis interpolates at lerp:0.1 / wheelMultiplier:0.8. Services scrub at 0.6 creates a slight jitter where GSAP arrives before Lenis finishes. Matching at 0.8 creates cohesion.

### Task 1.2 — ScrubTextReveal scrub smoothing
```
File: src/lib/components/scroll/ScrubTextReveal.svelte
Line 39: scrub = true → scrub = 0.5
```
The default `scrub: true` (instant) snaps to exact scroll position while Lenis is still interpolating. Adding `scrub: 0.5` creates a soft chase effect. This prop is the component default — ClosingStatement and ContactSection inherit it automatically since neither passes a custom `scrub` prop.

### Task 1.3 — Verify PortfolioReveal (no change needed)
```
File: src/lib/components/portfolio/PortfolioReveal.svelte
Already at scrub: 0.8 — confirm and move on.
```

### Verification
- Dev server (`npm run dev`)
- Scroll through full page at normal speed
- Scrub text reveal in ClosingStatement should feel smooth, not jerky
- Services pillar transitions should feel buttery
- Build passes (`npm run build`)

---

## Phase 2: Label Typography Standardization (Priority 2)

**Goal**: All section labels use the same letter-spacing. Currently inconsistent (0.05em vs 0.1em).

### Task 2.1 — Add design token
```
File: src/lib/styles/tokens.css
Add inside @theme block:
  --letter-spacing-label: 0.15em;
```

### Task 2.2 — Update Services label
```
File: src/lib/components/content/Services.svelte
.label { letter-spacing: 0.1em → var(--letter-spacing-label) }
```

### Task 2.3 — Update ProblemsSolved label
```
File: src/lib/components/content/ProblemsSolved.svelte
.label { letter-spacing: 0.1em → var(--letter-spacing-label) }
```

### Task 2.4 — Update Portfolio number
```
File: src/lib/components/portfolio/PortfolioSection.svelte
.portfolio-number { letter-spacing: 0.05em → var(--letter-spacing-label) }
```

### Task 2.5 — Update Team number
```
File: src/lib/components/team/TeamSection.svelte
.team-number { letter-spacing: 0.05em → var(--letter-spacing-label) }
```

### Task 2.6 — Update Contact number
```
File: src/lib/components/contact/ContactSection.svelte
.contact-number { letter-spacing: 0.05em → var(--letter-spacing-label) }
```

### Verification
- Visual scan across all sections — labels should feel like a unified system
- Build passes

---

## Phase 3: Scroll Progress Refinement (Priority 3)

**Goal**: Progress bar whispers, doesn't shout.

### Task 3.1 — Reduce height and opacity
```
File: src/lib/components/navigation/ScrollProgress.svelte
Line 44: Change class from "h-0.5" to "h-px" (0.5 = 2px, px = 1px)
Line 44: Add opacity — style attribute or class "opacity-40"
```

Current:
```html
<div class="fixed left-0 top-0 z-[60] h-0.5 bg-primary" ...>
```

Change to:
```html
<div class="fixed left-0 top-0 z-[60] h-px bg-primary opacity-40" ...>
```

### Verification
- Scroll full page — progress bar should be ambient, not distracting
- Still visible on both cream and dark sections

---

## Phase 4: Hero Entrance Timing (Priority 4)

**Goal**: Slow the hero entrance by ~20%. Make it feel inevitable, not performative.

### Task 4.1 — Adjust timeline in HeroContent.svelte
```
File: src/lib/components/hero/HeroContent.svelte
```

Current values → New values:

```javascript
// Timeline setup
delay: 0.3 → 0.5                    // Let page settle

// Culture fade-up
duration: 1.0 → 1.2                 // Slower
ease: 'power3.out' → 'expo.out'     // Softer landing

// Rule draw
duration: 0.9 → 1.1                 // The rule IS the moment
overlap: '-=0.4' → '-=0.5'          // More overlap

// Studio fade-up
duration: 1.0 → 1.2                 // Match Culture
y: 24 → 20                          // Less vertical travel
overlap: '-=0.5' → '-=0.6'          // More overlap

// Meta reveal
duration: 0.8 → 1.0                 // Gentle arrival
overlap: '-=0.3' → '-=0.4'          // More overlap
```

### Verification
- Hard refresh page, watch entrance
- Should feel ceremonious, like a title card in a film
- Total entrance should be ~3s, not ~2s

---

## Phase 5: Closing Statement Breathing Room (Priority 5)

**Goal**: "Entry points are flexible. Outputs are deliberate." owns its viewport.

### Task 5.1 — Add vertical space and centering
```
File: src/lib/components/content/ClosingStatement.svelte
```

Current:
```css
.closing {
    padding: clamp(8rem, 10vw, 12rem) 0;
    background-color: var(--color-surface);
}
```

Change to:
```css
.closing {
    padding: clamp(12rem, 15vw, 18rem) 0;
    background-color: var(--color-surface);
    min-height: 80vh;
    display: flex;
    align-items: center;
}
```

Note: `.closing-content` is already inside a `<Container>`, so the flex centering applies to the section's single child (the Container). This should vertically center the statement.

### Verification
- Scroll to closing statement — it should appear alone on screen
- On 1440px viewport: statement in center with generous space above/below
- On mobile: still centered, padding reduced via clamp

---

## Phase 6: Contact Heading Width (Priority 6)

**Goal**: Let the heading breathe wider on the dark background.

### Task 6.1 — Widen max-width
```
File: src/lib/components/contact/ContactSection.svelte
:global(.contact-heading) { max-width: 20ch → 24ch }
```

### Verification
- "Ready when you are. Let's build something that lasts." should fill more horizontal space
- Still wraps naturally, not forced into a single line

---

## Phase 7: Section Entrance Consistency (Priority 7)

**Goal**: Standardize the "quiet arrival" cadence across all sections.

### Task 7.1 — Align ProblemsSolved entrance timing
```
File: src/lib/components/content/ProblemsSolved.svelte
```
Current: SectionHeading wrapper uses `y: 24, duration: 0.6`, intro uses `y: 24, duration: 0.6, delay: 0.15`

Standardize to the cadence:
- Label/number: `y: 12, duration: 0.5` (quick, quiet)
- Heading: `y: 20, duration: 0.7, delay: 0.1` (the main moment)
- Body: `y: 16, duration: 0.6, delay: 0.2`

Change the SectionHeading wrapper:
```javascript
use:animate={{
    type: 'from',
    opacity: 0,
    y: 20,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: { start: 'top 85%' }
}}
```

Change the intro paragraph:
```javascript
use:animate={{
    type: 'from',
    opacity: 0,
    y: 16,
    duration: 0.6,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: { start: 'top 80%' }
}}
```

### Task 7.2 — Align TeamSection card stagger
```
File: src/lib/components/team/TeamSection.svelte
```
Current: `delay: i * 0.1, y: 30, duration: 0.6`
Change: `delay: i * 0.08, y: 20, duration: 0.5`

Tighter stagger (0.08 vs 0.1), less vertical travel (20 vs 30), slightly faster (0.5 vs 0.6). Feels like a wave, not a slideshow.

### Verification
- Scroll through ProblemsSolved, Team, Contact — all should arrive with the same rhythm
- Different content, same cadence

---

## Phase 8: Portfolio Card Stagger Entrance (Priority 8)

**Goal**: Cards fade-up individually after the circle wipe reveals them.

### Task 8.1 — Add animate action to card wrappers
```
File: src/lib/components/portfolio/PortfolioSection.svelte
```

Current:
```svelte
{#each projects as project}
    <PortfolioCard ... />
{/each}
```

Change to:
```svelte
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
        <PortfolioCard
            title={project.title}
            outcome={project.outcome}
            category={project.category}
            rotation={project.rotation}
            href="/work/{project.slug}"
        />
    </div>
{/each}
```

Import `animate` at the top of the script:
```javascript
import { animate } from '$lib/actions/animate';
```

### Verification
- Scroll into portfolio section — after circle wipe, cards should cascade up
- Stagger should feel like a wave (fast, not delayed)
- Cards still have their CSS hover effects

---

## Phase 9: Services Scroll Height Reduction (Priority 9)

**Goal**: Tighten the scroll distance. 600vh → 480vh for 6 text-only pillars.

### Task 9.1 — Reduce outer height
```
File: src/lib/components/content/Services.svelte
.services-outer { height: 600vh → 480vh }
```

### Task 9.2 — Reduce hold durations
```
Same file, in the timeline builder:
Line ~227: holdDuration for last pillar: 30 → 18
Line ~226: holdDuration for other pillars: 10 → 8
Line ~247: gap between pillars: duration 4 → 3
```

### Verification
- Scroll through all 6 pillars — each should still have comfortable reading time
- Last pillar holds but doesn't overstay
- No content clipping or overlap
- Build passes

---

## Phase 10: Hero Parallax Drift (Priority 10 — Medium Complexity)

**Goal**: As the user scrolls past the hero, "Culture" drifts faster than "Studio". The fracture widens.

### Task 10.1 — Add parallax ScrollTriggers after entrance
```
File: src/lib/components/hero/HeroContent.svelte
```

After the entrance timeline completes (inside the onMount, after `revealed = true`), add:

```javascript
// Parallax drift — the fracture widens as user scrolls away
const { ScrollTrigger } = await import('gsap/ScrollTrigger');

gsap.to(el.querySelector('.hero-culture'), {
    y: -30,
    ease: 'none',
    scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
    }
});

gsap.to(el.querySelector('.hero-studio'), {
    y: -15,
    ease: 'none',
    scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8
    }
});

gsap.to(el.querySelector('.hero-meta'), {
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

**Important**: Store these ScrollTrigger instances for cleanup in onDestroy. Add cleanup logic.

### Task 10.2 — Reduced motion guard
Wrap the parallax code in `if (!prefersReducedMotion())` — already inside the reduced motion check block, but verify.

### Verification
- Scroll slowly past hero — "Culture" should drift upward faster than "Studio"
- The visual gap between the two type masses should widen subtly
- Effect should be gentle (30px, 15px, 5px) — barely noticeable unless looking for it
- Reduced motion: no parallax, just static

---

## Phase 11: Build UX Audit Skill (Priority 11 — Large)

**Goal**: Create a reusable `/ux-audit` skill for ongoing quality checks.

### Task 11.1 — Create skill file
```
File: .claude/skills/ux-audit.md
```

See Section C of `.planning/DESIGN-ENHANCEMENTS.md` for the full 9-point checklist spec, scoring rubric, and implementation approach. Start with Phase 1 (manual checklist only — no Python scripts yet).

### Task 11.2 — Test the skill
Run `/ux-audit` and verify it produces a structured report with:
- Per-item score (0-11 points)
- Specific file:line references for issues
- Overall grade (A/B/C/D)
- Recommended fixes

### Note
This is the largest task. Can be deferred to a separate Sisyphus session if the polish phases above take priority.

---

## Execution Order

```
Phase 1  → Scrub alignment        (3 files, value changes only)
Phase 2  → Label letter-spacing   (6 files, CSS token swap)
Phase 3  → Scroll progress        (1 file, class change)
Phase 4  → Hero timing            (1 file, 6 value tweaks)
Phase 5  → Closing statement      (1 file, 3 CSS properties)
Phase 6  → Contact heading        (1 file, 1 value change)
Phase 7  → Section entrances      (2 files, timing alignment)
Phase 8  → Portfolio card stagger (1 file, add animate action)
Phase 9  → Services scroll height (1 file, 4 value changes)
Phase 10 → Hero parallax          (1 file, add ScrollTrigger)
Phase 11 → UX audit skill         (new file, standalone)
```

Phases 1-9 are all **small** — single-file value changes. Each should take < 5 minutes. Phase 10 is **medium** — needs ScrollTrigger cleanup logic. Phase 11 is **large** — new skill file.

**Total estimated phases**: 11
**Commit after each phase.** Commit message format: `polish: <description>`

---

## Constraints

- **Do not add new dependencies.** Everything uses existing GSAP + Lenis + Tailwind.
- **Do not refactor.** These are value tweaks and small additions.
- **Build must pass after every phase.** Run `npm run build` before committing.
- **Respect reduced motion everywhere.** If adding animation (Phase 8, 10), verify `prefersReducedMotion()` guard.
- **Creative doctrine**: If any change makes the site feel busier, revert it.

---

## Files Touched (Summary)

```
src/lib/styles/tokens.css                          — Phase 2 (add token)
src/lib/components/scroll/ScrubTextReveal.svelte   — Phase 1
src/lib/components/content/Services.svelte         — Phase 1, 2, 9
src/lib/components/content/ClosingStatement.svelte — Phase 5
src/lib/components/content/ProblemsSolved.svelte   — Phase 2, 7
src/lib/components/portfolio/PortfolioSection.svelte — Phase 2, 8
src/lib/components/team/TeamSection.svelte         — Phase 2, 7
src/lib/components/contact/ContactSection.svelte   — Phase 2, 6
src/lib/components/navigation/ScrollProgress.svelte — Phase 3
src/lib/components/hero/HeroContent.svelte         — Phase 4, 10
.claude/skills/ux-audit.md                         — Phase 11 (new file)
```

---

## Success Criteria

The sprint is complete when:
1. Scrolling the full page feels like turning pages in a well-designed book
2. All scrub animations are smooth and complementary with Lenis
3. All section labels have consistent letter-spacing
4. Hero entrance feels ceremonious (not hurried)
5. Closing statement owns its viewport
6. Portfolio cards have a satisfying entrance after the circle wipe
7. Build passes with zero errors
8. No visual regression — site feels tighter, not different
