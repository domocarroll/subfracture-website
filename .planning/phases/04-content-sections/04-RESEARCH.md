# Phase 4: Content Sections - Research

**Researched:** 2026-02-09
**Domain:** Editorial content sections (Problems, Services, Closing) with scroll-reveal GSAP animation
**Confidence:** HIGH

## Summary

This phase builds three content sections between the hero and portfolio: "Problems Solved" (intro + 6 pain point cards), "Services / What We Build" (5 numbered pillars 01-05), and a closing statement. Statistical callouts are deferred. All copy is already extracted in `.planning/CONTENT.md` — no copywriting required.

The existing codebase has everything needed: design tokens in `tokens.css`, `SectionHeading.svelte` and `Container.svelte` reusable components, the `animate` Svelte action for declarative scroll-triggered reveals, and established GSAP patterns (SSR guards, cleanup via destroy, ScrollTrigger). The current `+page.svelte` has placeholder sections that will be replaced with proper components.

The primary challenge is design execution, not technical implementation. The "Claude's Discretion" items center on layout decisions (numbered stack vs cards vs accordion for services), visual weight (text-only vs accented), scroll reveal approach, and card treatment for problems — all of which this research resolves with prescriptive recommendations.

**Primary recommendation:** Build three self-contained Svelte components (`ProblemsSolved.svelte`, `Services.svelte`, `ClosingStatement.svelte`) using the established `Container` and `SectionHeading` primitives. Use the `animate` action for per-element scroll reveals with staggered timing. Favor a vertical numbered stack for services (editorial feel) and borderless typographic treatment for problem cards (confrontational tone). Keep methodology/approach layered into the Problems intro paragraph rather than a separate section.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Content structure (from Canva comp):** "Where art and systems flow together" section: heading + intro paragraph + "Problems we help solve" label + 6 problem cards. "What we build" section: 5 numbered services (01-05), each with tagline, description, and bullet list. Closing statement: "Entry points are flexible. Outputs are deliberate." + closing paragraph. All copy comes from `.planning/CONTENT.md` — no copywriting needed.
- **Problems tone:** Confrontational — bold, punchy statements that hit hard, direct challenge. The 6 pain points should land with force, not softness.
- **Approach/methodology:** Both layered — lead with philosophical WHY (manifesto-style), then reveal the process underneath. Depth for those who want it, but the top layer is about conviction, not steps.
- **Scroll rhythm & spacing:** Generous breathing room between sections (200-300px vertical gaps). Soft anchors — no scroll-snapping, but visual cues (background shifts, dividers) create a sense of arriving at each section. Continuous scroll with distinct chapter feel.
- **Mobile treatment:** Simplified on mobile — some elements condensed or hidden on small screens. Fewer visible elements, shorter descriptions where appropriate, lighter visual load.
- **Statistical callouts:** Deferred — skip for this phase, add later when real numbers are available. Build the section structure to accommodate stats insertion later (CONT-04 partially deferred).

### Claude's Discretion
- Services layout style (numbered stack vs two-column cards vs accordion)
- Visual weight of services (text-only vs subtle accents vs illustrations)
- Scroll reveal approach (staggered elements, section-level, or pre-visible)
- Section transitions and visual separators
- Typography hierarchy within sections
- Card treatment for problem pain points (applying design system, not Canva mint green)
- Mobile simplification specifics (what gets hidden/condensed)
- How methodology layers between philosophy and process
- Animation timing and easing for content reveals

### Deferred Ideas (OUT OF SCOPE)
- Statistical callouts (+485hr style metrics) — deferred until real numbers provided
- CMS integration for content — deferred until static frontend complete
</user_constraints>

---

## Standard Stack

### Core (Already Installed — No New Dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SvelteKit | ^2.50.1 | Framework | Already installed; component architecture |
| Svelte 5 | ^5.48.2 | UI framework | Runes, snippets, $props() |
| Tailwind CSS 4 | ^4.1.18 | Utility CSS | Design tokens via @theme |
| GSAP | ^3.14.2 | Animation | ScrollTrigger for scroll reveals |

### Supporting (Already Available)

| Component/Utility | Location | Purpose |
|---|---|---|
| `Container.svelte` | `src/lib/components/ui/` | Max-width container (narrow 900px, wide 1200px), golden ratio grid |
| `SectionHeading.svelte` | `src/lib/components/ui/` | Editorial numbered section headings (01, 02...) |
| `animate` action | `src/lib/actions/animate.ts` | Declarative GSAP scroll reveals with cleanup |
| `tokens.css` | `src/lib/styles/` | All design tokens (colors, typography, spacing, easing) |
| `motion.ts` | `src/lib/utils/` | Reduced motion detection |
| `gsap.ts` | `src/lib/utils/` | SSR-safe GSAP initialization |

### No New Packages Required

This phase uses only existing dependencies. No `npm install` needed.

---

## Architecture Patterns

### Recommended Component Structure

```
src/lib/components/
├── content/
│   ├── ProblemsSolved.svelte       # "Where art and systems flow together" + 6 problems
│   ├── ProblemCard.svelte          # Single pain point card (extracted for clarity)
│   ├── Services.svelte             # "What we build" + 5 numbered service pillars
│   ├── ServicePillar.svelte        # Single service (01-05) with tagline, desc, bullets
│   └── ClosingStatement.svelte     # "Entry points are flexible..." + closing paragraph
├── ui/
│   ├── Container.svelte            # (existing)
│   └── SectionHeading.svelte       # (existing)
└── hero/                           # (existing)
```

### Pattern 1: Section Component with Scroll Reveals

**What:** Each content section is a self-contained Svelte component using `Container` and `SectionHeading` with the `animate` action for scroll-triggered reveals.

**When to use:** Every content section in Phase 4.

**Example:**
```svelte
<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
  import { animate } from '$lib/actions/animate';
</script>

<section id="problems" class="problems-section">
  <Container>
    <div use:animate={{
      type: 'from',
      opacity: 0,
      y: 24,
      duration: 0.6,
      scrollTrigger: { start: 'top 85%' }
    }}>
      <SectionHeading number="01" title="Where art and systems flow together" />
    </div>
    <!-- Content follows with staggered reveals -->
  </Container>
</section>
```

**Source:** Established pattern from Phase 1 research + current `+page.svelte` placeholder sections.

### Pattern 2: Staggered Child Reveals via onMount

**What:** When multiple child elements need staggered reveal (e.g., 6 problem cards, 5 service pillars), use `onMount` with GSAP stagger on a container reference rather than individual `animate` actions per item.

**When to use:** Lists of items that should animate in sequence when scrolled into view.

**Example:**
```svelte
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let container: HTMLElement;
  let ctx: { revert: () => void } | null = null;

  onMount(async () => {
    if (!browser) return;
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(() => {
      gsap.from('.problem-card', {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%'
        }
      });
    }, container);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<div bind:this={container} class="problem-grid">
  {#each problems as problem}
    <div class="problem-card">...</div>
  {/each}
</div>
```

**Source:** GSAP official stagger documentation + Pitfall #1 cleanup pattern from PITFALLS.md. Uses `gsap.context()` scoped to container for proper cleanup.

### Pattern 3: Background Shift as Section Transition

**What:** Alternate section backgrounds between `--color-surface` (cream) and `--color-surface-warm` (warmer cream) to create visual "arrival" cues without hard dividers.

**When to use:** Between major content sections to create the "soft anchor" feel requested.

**Example:**
```css
.problems-section {
  background-color: var(--color-surface);
  padding: var(--spacing-section) 0;
}

.services-section {
  background-color: var(--color-surface-warm);
  padding: var(--spacing-section) 0;
}

.closing-section {
  background-color: var(--color-surface);
  padding: var(--spacing-section) 0;
}
```

**Source:** Decision from CONTEXT.md: "visual cues (background shifts, dividers) create a sense of arriving at each section." Already established in `+page.svelte` with `.section--warm` class.

### Pattern 4: Stats Placeholder Slot

**What:** Reserve an empty container with a CSS class inside the Problems or Services section where statistical callouts can be inserted later without restructuring.

**When to use:** Where CONT-04 would go — deferred but structurally accommodated.

**Example:**
```svelte
<!-- Reserved for statistical callouts (Phase deferred) -->
<div class="stats-placeholder" aria-hidden="true">
  <!-- CONT-04: Statistical callouts inserted here when real numbers available -->
</div>
```

### Anti-Patterns to Avoid

- **Creating one mega-component for all content:** Split into ProblemsSolved, Services, ClosingStatement. Each should be <200 lines.
- **Using `animate` action on every individual card:** For staggered lists (6 problems, 5 services), use a single `gsap.from()` with `stagger` on the container, not 6/5 individual animate actions. This creates coordinated timing and fewer ScrollTrigger instances.
- **Adding scroll-snapping:** Explicitly rejected in CONTEXT.md. Use continuous scroll with visual cues only.
- **Mint green card styling from Canva:** Use terracotta/cream/editorial design system, not the Canva mint.
- **Soft/empathetic tone for problems:** Problems should be confrontational and punchy, not gentle.

---

## Claude's Discretion Recommendations

### Services Layout: Vertical Numbered Stack

**Recommendation:** Use a vertical numbered stack (full-width items stacked vertically, not side-by-side cards or accordion).

**Rationale:**
- Editorial websites use vertical stacks for numbered content — it reads like a table of contents or chapter index
- The Canva comp uses 01-05 numbering which naturally reads top-to-bottom
- Each service has 4 bullets + description + tagline — too much content for card format
- Accordion hides content behind interaction — bad for scanning and SEO
- Two-column cards would create uneven heights and awkward empty space
- Vertical stack allows generous whitespace between services (the "breathing room" requested)

**Layout per service:**
```
[number]  [tagline]
          [description paragraph]
          [bullet list]
          ─────────────── (subtle divider between services)
```

The number appears as a small terracotta label (matching `SectionHeading` style). Major/minor golden ratio columns: number + tagline in minor column, description + bullets in major column on desktop. Single column on mobile.

### Visual Weight: Text-Heavy with Subtle Terracotta Accents

**Recommendation:** Primarily typographic (no illustrations, no heavy visual elements). Subtle accents via terracotta number labels and thin divider lines between services.

**Rationale:**
- The hero already carries the visual weight with the botanical illustration
- Content sections should feel "scholarly" — like reading a well-set book page
- Too many visual elements compete with the editorial tone
- Terracotta accents in numbers create consistent editorial rhythm established in Phase 1
- Thin dividers (1px `--color-bone`) between services create structure without heaviness

### Scroll Reveal: Staggered Element Reveals

**Recommendation:** Staggered element-level reveals — heading reveals first, then items stagger in one by one.

**Approach per section:**
1. Section heading fades in (opacity 0 to 1, y: 24px to 0, 0.6s, power3.out)
2. Intro paragraph reveals 0.15s after heading
3. Cards/pillars stagger in (0.08s per item, same opacity/y pattern)

**Rationale:**
- Pre-visible content feels static and wastes the scroll journey
- Section-level reveal (everything at once) is too abrupt for editorial pacing
- Staggered reveals create the "arrival" rhythm matching the editorial feel
- 0.08s stagger per item is fast enough to feel fluid, slow enough to perceive
- Matches established pattern from Phase 1 research: `stagger: 0.08` with `start: 'top 80%'`

**Mobile:** Simpler reveals — entire section fades in at once (no per-element stagger). Reduces animation load per Pitfall #8 (mobile performance).

### Section Transitions: Background Shifts + Thin Dividers

**Recommendation:** Alternate `--color-surface` and `--color-surface-warm` between sections. Add thin horizontal rules (1px, `--color-bone`) as optional visual breaks within sections (e.g., between problems label and cards, between each service pillar).

**Rationale:**
- Background shifts are already established in `+page.svelte` placeholder
- Full-width background color changes are the strongest "soft anchor" without scroll-snapping
- Thin rules within sections add structure without weight
- No decorative SVG dividers — would clash with editorial restraint

**Specific transitions:**
- Hero → Problems: `--color-surface` (same background, seamless)
- Problems → Services: `--color-surface-warm` (subtle warm shift)
- Services → Closing: `--color-surface` (back to primary cream)

### Typography Hierarchy Within Sections

**Recommendation:**

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section heading | Playfair Display | `--text-3xl` (49px) | 400 | `--color-text` |
| Section number | Source Sans 3 | `--text-xs` (11px) | 500 | `--color-primary` |
| Intro paragraph | Source Sans 3 | `--text-lg` (24px) | 400 | `--color-text-muted` |
| Subsection label | Source Sans 3 | `--text-xs` (11px) | 600 | `--color-primary` |
| Problem card text | Playfair Display | `--text-xl` (30px) | 400 | `--color-text` |
| Service number | Source Sans 3 | `--text-xs` (11px) | 500 | `--color-primary` |
| Service tagline | Playfair Display | `--text-2xl` (39px) | 400 | `--color-text` |
| Service description | Source Sans 3 | `--text-base` (18px) | 400 | `--color-text-muted` |
| Service bullets | Source Sans 3 | `--text-sm` (14px) | 400 | `--color-text-muted` |
| Closing statement | Playfair Display | `--text-2xl` (39px) | 400 | `--color-text` |
| Closing paragraph | Source Sans 3 | `--text-base` (18px) | 400 | `--color-text-muted` |

**Rationale:**
- Matches established hierarchy from `HeroContent.svelte` and `SectionHeading.svelte`
- Problem cards use Playfair at `--text-xl` for impact (confrontational tone needs size)
- Service taglines use Playfair at `--text-2xl` for chapter-like presence
- All body/supporting text uses Source Sans 3 for readability
- Subsection labels (like "Problems we help solve") match the `--text-xs` terracotta pattern from nav and footer

### Card Treatment for Problem Pain Points

**Recommendation:** Borderless typographic cards — no background, no border, no shadow. Each problem is a single bold statement on its own line with generous vertical spacing.

**Layout:** 2-column grid on desktop (3 rows of 2), single column on mobile.

**Rationale:**
- Confrontational tone needs stark, unadorned presentation — "these are facts, not decorations"
- Borders or backgrounds would soften the impact (empathetic framing)
- Large serif type on clean background creates maximum typographic punch
- The Canva mint green cards are explicitly rejected; the design system has no "card" color
- Sparse layout with whitespace between problems lets each statement breathe and land

**Visual treatment per card:**
- Playfair Display, `--text-xl` (30px), weight 400
- Color: `--color-text` (black ink)
- No background, no border
- Optional: small number or bullet in `--color-primary` (terracotta)
- Generous margin-bottom (2rem+) between cards

### Mobile Simplification Specifics

**Recommendation:**

| Element | Desktop | Mobile |
|---------|---------|--------|
| Problem grid | 2 columns | 1 column |
| Service layout | Golden ratio 2-col (number+tagline / desc+bullets) | Single column stacked |
| Service bullets | All visible | Show first 2-3, hide rest (or show all — test for length) |
| Staggered animations | Per-element stagger | Section-level fade (single reveal) |
| Section padding | `--spacing-section` (160px) | `--spacing-section-sm` (120px) |
| Service description | Full paragraph | Full paragraph (no truncation — content is concise enough) |
| Closing statement | Large type with generous margin | Slightly smaller type, tighter margins |

**Rationale:**
- Service bullet lists are short enough (4 items each) to show fully even on mobile
- Animation simplification on mobile prevents performance issues (Pitfall #8)
- Grid collapse from 2-col to 1-col follows established responsive pattern from `Container.svelte`

### Methodology Layering

**Recommendation:** Do NOT create a separate "Approach" section component. Instead, layer the methodology into the Problems and Services sections:

1. **Problems intro paragraph** serves as the manifesto/WHY layer: "Subfracture is a strategic culture and design studio..." — this is the philosophical conviction statement
2. **Services section** serves as the process/HOW layer: the 5 numbered pillars with bullets are the methodology revealed
3. **Closing statement** bridges both: "Entry points are flexible. Outputs are deliberate." ties philosophy to process

**Rationale:**
- CONTENT.md doesn't have a separate "Approach" section — the methodology IS the services structure
- Creating a standalone approach section would duplicate content and break the Canva comp structure
- The layered feel comes from the intro (philosophical) flowing into the specifics (practical)
- CONT-03 ("Approach/methodology section explains how Subfracture works") is satisfied by the Services section itself — the 5 pillars ARE the methodology

### Animation Timing and Easing

**Recommendation:**

| Animation | Duration | Ease | Delay/Stagger |
|-----------|----------|------|---------------|
| Section heading reveal | 0.6s | power3.out | — |
| Intro paragraph reveal | 0.5s | power3.out | 0.15s after heading |
| Problem cards stagger | 0.5s each | power3.out | 0.08s between cards |
| Service pillars stagger | 0.6s each | power3.out | 0.12s between pillars |
| Closing statement reveal | 0.7s | power3.out | — |
| Closing paragraph reveal | 0.5s | power3.out | 0.2s after statement |

**ScrollTrigger start:** `top 80%` for all sections (element enters when 80% visible from top).

**Reduced motion:** All animations use `duration: 0` via the `animate` action's built-in `prefersReducedMotion()` check. The `gsap.context()` pattern for staggered lists should include a `matchMedia` branch for `(prefers-reduced-motion: reduce)` that uses `gsap.set()` instead.

**Rationale:**
- Timings match established GSAP defaults (0.6s base, power3.out ease) from `gsap.ts`
- Service pillars get slightly longer stagger (0.12s) because each is a larger visual element — needs more time to "arrive"
- Closing statement gets longer duration (0.7s) to match its importance as the section crescendo

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll reveal animation | Custom IntersectionObserver | `animate` action or `gsap.from()` with ScrollTrigger | Cleanup, reduced motion, SSR safety already handled |
| Section numbering styling | Custom CSS per section | `SectionHeading.svelte` | Already built, consistent pattern |
| Content container widths | Manual max-width + padding | `Container.svelte` | Already handles responsive padding and width variants |
| Scroll-triggered stagger | Individual `animate` per list item | Single `gsap.from()` with `stagger` on container | Coordinated timing, fewer ScrollTrigger instances |
| Reduced motion handling | Manual `matchMedia` checks | Built into `animate` action; use `gsap.matchMedia()` for imperative code | Consistent with Phase 3 hero pattern |

**Key insight:** Phase 4 should use ONLY existing utilities from Phases 1-3. No new animation infrastructure needed. The `animate` action, `Container`, and `SectionHeading` cover 90% of requirements. The remaining 10% (staggered lists) uses the established `onMount` + `gsap.context()` imperative pattern from `Hero.svelte`.

---

## Common Pitfalls

### Pitfall 1: ScrollTrigger Cleanup with Multiple Sections

**What goes wrong:** Adding 3+ content sections with scroll reveals creates many ScrollTrigger instances. If components don't clean up properly on route change, stale triggers accumulate.

**Why it happens:** Each content section creates its own ScrollTrigger(s). Without cleanup, these persist across SvelteKit route changes.

**How to avoid:**
1. Use `animate` action for simple reveals — it handles cleanup via `destroy()`
2. For imperative stagger animations, use `gsap.context(scope)` and call `ctx.revert()` in `onDestroy`
3. Verify cleanup by checking `ScrollTrigger.getAll().length` in dev tools after navigation

**Warning signs:** Animations don't trigger on second route visit; wrong scroll positions.

### Pitfall 2: gsap.from() with ScrollTrigger Flashing

**What goes wrong:** Elements briefly appear in their "end" state before the scroll-triggered `from()` animation kicks in, causing a visual flash.

**Why it happens:** GSAP's `from()` reads current element values as the "to" destination. If ScrollTrigger hasn't initialized yet when the element renders, the element appears unstyled briefly.

**How to avoid:**
1. Set initial opacity/transform in CSS (not relying on GSAP to set them)
2. Use `gsap.fromTo()` instead of `gsap.from()` when using ScrollTrigger
3. OR set elements to `opacity: 0` in CSS and use `gsap.to()` with ScrollTrigger

**Applied to Phase 4:** Problem cards and service pillars that will be scroll-revealed should have `opacity: 0` and `transform: translateY(24px)` in their CSS initial state, matching the `HeroContent.svelte` pattern (see lines 41-43, 52-55, 64-66).

### Pitfall 3: Too Many Simultaneous ScrollTriggers on Mobile

**What goes wrong:** Mobile devices with less GPU/CPU power struggle with many simultaneous scroll-driven calculations.

**Why it happens:** Each ScrollTrigger instance recalculates on every scroll event. With 6 problem cards + 5 service pillars + headings + paragraphs, you could have 15+ individual ScrollTriggers.

**How to avoid:**
1. Use container-level ScrollTriggers with `stagger` for grouped elements — one trigger for all 6 problems, one for all 5 services
2. On mobile, simplify to section-level reveals (one trigger per major section)
3. Use `gsap.matchMedia()` to differentiate desktop vs mobile animation complexity

**Rationale:** The Phase 3 hero already uses `gsap.matchMedia()` for desktop vs reduced-motion branches. Content sections should follow the same pattern for desktop vs mobile animation complexity.

### Pitfall 4: Section ID Conflicts with Navigation

**What goes wrong:** The current `+page.svelte` uses `id="services"`, `id="work"`, etc. for nav link targets. Changing these IDs when replacing placeholders with real components will break navigation scroll-to behavior.

**Why it happens:** `Navigation.svelte` has hardcoded `href="#services"`, `href="#work"`, `href="#about"`, `href="#contact"` links.

**How to avoid:**
1. Maintain the same section IDs when building new components
2. Update navigation links if section IDs change
3. The new content structure maps: Problems section ~ `#about` or new ID, Services ~ `#services`
4. Plan the ID mapping before building components

**Navigation link mapping (recommendation):**
| Nav Link | Current ID | New Section | Recommended ID |
|----------|-----------|-------------|----------------|
| Work | `#work` | (Portfolio — Phase 5) | Keep `#work` |
| Services | `#services` | Services / What We Build | Keep `#services` |
| About | `#about` | Problems Solved | Change to `#about` or keep — this IS the about section |
| Contact | `#contact` | Contact section | Keep `#contact` |

### Pitfall 5: Content Section Ordering vs Canva Comp

**What goes wrong:** Building sections in the wrong order relative to the Canva comp creates confusion about section numbering and flow.

**Why it happens:** The Canva comp has a specific order (Hero → Problems → Services → Closing → Portfolio) but the current page placeholder has Work before Services.

**How to avoid:** Follow CONTENT.md ordering strictly:
1. Hero (done)
2. Problems Solved ("Where art and systems flow together")
3. Services ("What we build" — 01-05)
4. Closing statement ("Entry points are flexible...")
5. Portfolio (Phase 5)
6. Contact (Phase 7)

The section numbers should align with Canva comp, not the current placeholder numbering. Update `SectionHeading` numbers accordingly.

---

## Code Examples

### ProblemsSolved Section Structure

```svelte
<!-- src/lib/components/content/ProblemsSolved.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import Container from '$lib/components/ui/Container.svelte';
  import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
  import { animate } from '$lib/actions/animate';

  const problems = [
    'Campaign-led thinking with no long-term platform',
    'Inconsistent brand and IP expression at scale',
    'Low trust or weak cultural relevance',
    'Launches that need real momentum, not noise',
    'Brand systems that extend beyond start and end dates',
    'Unclear positioning — people don\'t get it'
  ];

  let gridEl: HTMLElement;
  let ctx: { revert: () => void } | null = null;

  onMount(async () => {
    if (!browser) return;
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.problem-card', {
          opacity: 0,
          y: 24,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridEl,
            start: 'top 80%'
          }
        });
      });

      gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.problem-card', { opacity: 1, y: 0 });
      });
    }, gridEl);
  });

  onDestroy(() => {
    ctx?.revert();
  });
</script>

<section id="about" class="problems-section">
  <Container>
    <div use:animate={{
      type: 'from',
      opacity: 0,
      y: 24,
      duration: 0.6,
      scrollTrigger: { start: 'top 85%' }
    }}>
      <SectionHeading number="01" title="Where art and systems flow together" />
      <p class="problems-intro">
        Subfracture is a strategic culture and design studio based in
        Merivale Studios, South Brisbane. We help brands and IP get clear,
        get chosen, and get remembered — not just launched.
      </p>
    </div>

    <p class="problems-label">Problems we help solve</p>

    <div class="problem-grid" bind:this={gridEl}>
      {#each problems as problem}
        <div class="problem-card">
          <p class="problem-text">{problem}</p>
        </div>
      {/each}
    </div>
  </Container>
</section>
```

### ServicePillar Component Structure

```svelte
<!-- src/lib/components/content/ServicePillar.svelte -->
<script lang="ts">
  interface Props {
    number: string;
    tagline: string;
    description: string;
    bullets: string[];
  }

  let { number, tagline, description, bullets }: Props = $props();
</script>

<article class="service-pillar">
  <div class="service-meta">
    <span class="service-number">{number}</span>
  </div>
  <div class="service-content">
    <h3 class="service-tagline">{tagline}</h3>
    <p class="service-description">{description}</p>
    <ul class="service-bullets">
      {#each bullets as bullet}
        <li class="service-bullet">{bullet}</li>
      {/each}
    </ul>
  </div>
</article>
```

### Closing Statement Structure

```svelte
<!-- src/lib/components/content/ClosingStatement.svelte -->
<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import { animate } from '$lib/actions/animate';
</script>

<section class="closing-section">
  <Container>
    <div use:animate={{
      type: 'from',
      opacity: 0,
      y: 24,
      duration: 0.7,
      scrollTrigger: { start: 'top 80%' }
    }}>
      <p class="closing-statement">
        Entry points are flexible. Outputs are deliberate.
      </p>
    </div>

    <div use:animate={{
      type: 'from',
      opacity: 0,
      y: 16,
      duration: 0.5,
      delay: 0.2,
      scrollTrigger: { start: 'top 80%' }
    }}>
      <p class="closing-paragraph">
        We work alongside founders and brand teams to set direction,
        design systems, and bring ideas to life — because strong brands
        aren't just seen, they're understood, trusted, and chosen.
      </p>
    </div>
  </Container>
</section>
```

### Updated +page.svelte Integration

```svelte
<script lang="ts">
  import Hero from '$lib/components/hero/Hero.svelte';
  import ProblemsSolved from '$lib/components/content/ProblemsSolved.svelte';
  import Services from '$lib/components/content/Services.svelte';
  import ClosingStatement from '$lib/components/content/ClosingStatement.svelte';
</script>

<svelte:head>
  <title>Subfracture | Culture Studio</title>
  <meta name="description" content="..." />
</svelte:head>

<Hero />
<ProblemsSolved />
<Services />
<ClosingStatement />

<!-- Portfolio placeholder (Phase 5) -->
<section id="work" class="section">...</section>

<!-- Contact placeholder (Phase 7) -->
<section id="contact" class="section section--dark">...</section>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single large page file | Component-per-section | SvelteKit best practice | Better maintainability, isolation |
| CSS-only scroll reveals | GSAP ScrollTrigger + action | Project Phase 1 | Consistent timing, cleanup, reduced motion |
| Individual ScrollTriggers per item | Container-level stagger | GSAP best practice | Fewer triggers, coordinated timing |
| Blanket scroll animations | matchMedia-branched animations | Phase 3 hero pattern | Desktop vs mobile optimization |

**Deprecated/outdated:**
- Intersection Observer for reveal animations — use GSAP ScrollTrigger instead (already installed, better timing control)
- CSS-only fade-in animations — inconsistent timing, no stagger support, no reduced motion integration

---

## Open Questions

### 1. Section Numbering Alignment

**What we know:** The current page has Work=01, Services=02, About=03, Contact=04. The Canva comp has a different content order.

**What's unclear:** Whether the editorial section numbers (01, 02...) in `SectionHeading` should reflect the Canva comp ordering or the navigation ordering.

**Recommendation:** Follow Canva comp ordering. Problems section gets no number (it's a chapter heading, not a numbered service). Services section uses numbers 01-05 for the individual pillars. This avoids the section-number-doesn't-match-nav confusion.

### 2. Navigation Link Updates

**What we know:** Navigation currently links to #work, #services, #about, #contact. The new content structure changes what those IDs point to.

**What's unclear:** Whether to update nav links to match new content structure or maintain backward compatibility.

**Recommendation:** Keep existing nav IDs but map them to new components. This is a minor update in `Navigation.svelte` if needed. Address during implementation.

### 3. Problems Section as CONT-03 Fulfillment

**What we know:** CONT-03 requires "Approach/methodology section explains how Subfracture works." The Canva comp has no standalone "Approach" section.

**What's unclear:** Whether CONT-03 is considered satisfied by the Services section + intro paragraph, or whether a separate component is needed.

**Recommendation:** CONT-03 is satisfied by the Problems intro paragraph (the WHY/philosophy) combined with the Services section (the HOW/process). The "layered" approach from CONTEXT.md means these are the same content presented at two depths, not two separate sections. Mark CONT-03 as satisfied by this combined treatment.

---

## Sources

### Primary (HIGH confidence)
- **Existing codebase** — All component patterns, utilities, and established architecture from Phases 1-3
- **GSAP ScrollTrigger documentation** — Stagger, batch, cleanup patterns (gsap.com/docs/v3/Plugins/ScrollTrigger)
- **GSAP ScrollTrigger.batch()** — Batched reveal callbacks (gsap.com/docs/v3/Plugins/ScrollTrigger/static.batch())
- **GSAP ScrollTrigger tips & mistakes** — Loop pattern for individual element triggers (gsap.com/resources/st-mistakes)
- **Svelte 5 documentation** — Snippets, $props(), component composition (svelte.dev/docs)
- **`.planning/CONTENT.md`** — All copy pre-extracted from Canva comp
- **`.planning/research/PITFALLS.md`** — Established pitfall catalog for project

### Secondary (MEDIUM confidence)
- **Web design trends 2026** — Editorial layout patterns, whitespace, typographic hierarchy (kontra.agency, rebekahreadcreative.com)
- **GSAP community forum** — Performance optimization for multiple ScrollTrigger reveals (gsap.com/community/forums/topic/39943)

### Tertiary (LOW confidence)
- None — all findings verified against primary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — No new dependencies; using only existing installed packages and components
- Architecture: HIGH — Component structure follows established Phase 1-3 patterns exactly
- Discretion recommendations: MEDIUM — Layout and visual choices based on editorial design principles and project context, may need user validation during implementation
- Pitfalls: HIGH — Based on documented project pitfalls and GSAP official guidance

**Research date:** 2026-02-09
**Valid until:** 2026-03-09 (30 days — stable domain, no new libraries)
