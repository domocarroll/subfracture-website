# Phase 3: Hero Section - Research

**Researched:** 2026-02-06
**Domain:** SVG animation, GSAP DrawSVG, hero section composition, brand logo carousel, Svelte 5 integration
**Confidence:** HIGH

## Summary

The hero section requires rebuilding the existing WIP `Hero.svelte` (currently using setTimeout-based CSS animations) into a GSAP-driven composition with DrawSVG line-drawing animation, editorial typography reveal, and a brand logo carousel. All the necessary tools are already installed and available.

GSAP 3.14.2 is installed and includes DrawSVGPlugin and SplitText (now 100% free since Webflow's acquisition in April 2025). The existing `initGSAP()` utility needs extending to register DrawSVGPlugin. The existing `animate` Svelte action, `motion.ts` utilities, and SSR guards are all ready for reuse. Three inline SVG components already exist (`BrisbaneRiver.svelte`, `SacredGeometry.svelte`, `VitruvianFigure.svelte`) that need reworking to integrate with GSAP DrawSVG instead of CSS `stroke-dasharray` animations.

**Primary recommendation:** Use GSAP timeline with DrawSVGPlugin for the SVG draw-in sequence, GSAP matchMedia for reduced motion handling, CSS-only infinite marquee for the logo carousel, and `100svh` for mobile-safe full viewport height.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Visual Composition
- Full viewport hero (100vh) — immersive first impression, content begins below fold
- Illustration sits BEHIND text as a background layer — text overlays it
- Brand logo carousel sits at the bottom edge of the hero (inside the hero section)
- CTAs are understated text links with hover states — NOT prominent colored buttons
- Editorial feel — typography is the star, illustration supports

#### Botanical Illustration
- Depicts abstract organic linework — flowing lines suggesting growth, roots, neural networks (not a literal plant)
- Rendered as inline SVG with subtle fill/color — muted terracotta or botanical green in select areas on cream
- Subtle background texture level of presence — noticeable but restrained, doesn't compete with typography
- Built entirely in SVG code — no external asset files, full control over animation and styling

#### Animation & Entrance
- Sequence: SVG linework draws in FIRST, then headline and tagline reveal on top
- SVG uses GSAP DrawSVG to trace paths — lines draw in on load
- Total entrance duration: ~1 second (quick, doesn't make visitors wait)
- Scroll behavior: parallax — text scrolls normally, illustration has subtle depth shift at different speed
- Reduced motion: static version with no animation, all elements visible immediately

#### Mobile Treatment
- Simplified SVG illustration on mobile — fewer paths/lines, lighter version suggesting same organic feel
- Animation on mobile: Claude's discretion based on performance testing — use draw-in if smooth, fall back to fade-in if not
- CTAs become stacked full-width tappable buttons on mobile (not text links)
- Hero remains 100vh on mobile

### Claude's Discretion
- Exact SVG illustration design (paths, shapes, composition)
- Number of SVG paths in simplified mobile version
- Parallax speed ratios between layers
- Exact timing curve for draw-in animation within the ~1s window
- Whether to animate on mobile (performance-dependent)
- Logo carousel interaction (static row vs subtle scroll)
- Transition between hero and problems section below

### Specific Ideas
- Illustration should feel like medical textbook meets art book — "scholarly authority" not "creative agency"
- Nigrum Corpus aesthetic is the north star — editorial, anatomical, warm
- Organic lines could suggest root systems, neural pathways, or growth patterns — abstract enough to be interpreted
- Terracotta fills in select SVG areas connect to the overall color system
- The hero should communicate "this is a thinking studio, not a making agency" within 5 seconds

### Deferred Ideas (OUT OF SCOPE)
- Full botanical SVG draw animation with complex timeline (HERO-05, deferred to v1.1)
- Scroll-triggered exit animation (HERO-07, deferred to v1.1)
- Parallax scroll layers with depth (HERO-06, deferred to v1.1 — basic parallax included in v1.0)
</user_constraints>

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.14.2 | Animation engine | Already installed. Industry standard for web animation. All plugins now free. |
| DrawSVGPlugin | 3.14.2 (bundled) | SVG stroke animation | Included in `gsap` npm package at `gsap/DrawSVGPlugin`. Controls `stroke-dashoffset`/`stroke-dasharray` for path drawing. |
| SplitText | 3.14.2 (bundled) | Text reveal animation | Included in `gsap` npm package at `gsap/SplitText`. Splits text into chars/words/lines for staggered reveals. Built-in ARIA support since v3.13. |
| ScrollTrigger | 3.14.2 (bundled) | Scroll-based animation | Already registered in `initGSAP()`. Used for basic parallax. |
| Svelte 5 | 5.48.2 | Component framework | Already installed. Uses runes (`$state`, `$derived`, `$effect`). |
| Tailwind CSS 4 | 4.1.18 | Utility styles | Already installed. Use for layout utilities, responsive breakpoints. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `$app/environment` | SvelteKit | Browser detection | Import `browser` for SSR guards before any DOM/GSAP code |
| Existing `motion.ts` | local | Reduced motion utils | `prefersReducedMotion()`, `getMotionSafeProps()` |
| Existing `gsap.ts` | local | GSAP initialization | `initGSAP()` — needs DrawSVGPlugin registration added |
| Existing `animate.ts` | local | Svelte action | `use:animate` for simple element animations (text reveals) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| DrawSVGPlugin | CSS `stroke-dasharray` animation | Already in WIP code. Less control over timing, no `fromTo` segments, no stagger. GSAP DrawSVG is strictly better. |
| SplitText | Manual `<span>` wrapping | SplitText handles line breaks, ARIA, and responsive re-splitting automatically. |
| GSAP matchMedia | Custom `prefersReducedMotion()` | matchMedia auto-cleans up, handles context revert. Existing `motion.ts` still useful for non-GSAP checks. |
| CSS marquee | GSAP-driven carousel | CSS-only is lighter, GPU-accelerated, zero JS. Use CSS unless interaction needed. |

### No Additional Installation Required

Everything needed is already in `node_modules/gsap/`:
- `gsap/DrawSVGPlugin` (verified: `/node_modules/gsap/DrawSVGPlugin.js` exists)
- `gsap/SplitText` (verified: `/node_modules/gsap/SplitText.js` exists)
- `gsap/ScrollTrigger` (already registered)

## Architecture Patterns

### Recommended Component Structure
```
src/lib/
├── components/
│   ├── hero/
│   │   ├── Hero.svelte              # Main hero section (orchestrator)
│   │   ├── HeroIllustration.svelte  # SVG illustration layer (background)
│   │   ├── HeroContent.svelte       # Typography + CTAs layer (foreground)
│   │   └── LogoCarousel.svelte      # Brand logo carousel (bottom edge)
│   └── ...
├── assets/
│   ├── BrisbaneRiver.svelte         # EXISTING — river SVG paths (rework for GSAP)
│   ├── SacredGeometry.svelte        # EXISTING — circle/square (rework for GSAP)
│   └── VitruvianFigure.svelte       # EXISTING — anatomical figure (rework for GSAP)
├── utils/
│   ├── gsap.ts                      # EXISTING — extend to register DrawSVGPlugin
│   └── motion.ts                    # EXISTING — reduced motion utilities
└── actions/
    └── animate.ts                   # EXISTING — Svelte action for GSAP
```

### Pattern 1: GSAP Timeline Orchestration in Hero

**What:** Create a single GSAP timeline in `Hero.svelte` `onMount` that sequences all entrance animations. Each child component exposes DOM refs that the parent timeline targets.

**When to use:** When multiple elements must animate in a coordinated sequence (SVG draw -> text reveal).

**Example:**
```typescript
// Source: GSAP official docs, Context7 /llmstxt/gsap_llms_txt
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';

let timeline: gsap.core.Timeline | null = null;
let svgPaths: SVGElement;
let headline: HTMLElement;

onMount(async () => {
  if (!browser) return;

  const { gsap } = await import('gsap');
  const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

  // Use matchMedia for reduced motion
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    timeline = gsap.timeline();

    // Phase 1: SVG paths draw in (~0.6s)
    timeline.from('.hero-path', {
      drawSVG: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: 'power3.out'
    });

    // Phase 2: Text reveals on top (~0.4s, overlapping)
    timeline.from(headline, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power3.out'
    }, '-=0.2');
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    // All elements visible immediately, no animation
    gsap.set('.hero-path', { drawSVG: '0% 100%' });
    gsap.set(headline, { opacity: 1, y: 0 });
  });
});

onDestroy(() => {
  if (timeline) {
    timeline.kill();
    timeline = null;
  }
});
```

### Pattern 2: SVG Component with GSAP-Ready Refs

**What:** SVG components expose their path elements via `bind:this` so the parent timeline can target them with DrawSVG. The SVG itself is purely structural — no CSS animations.

**When to use:** For all three SVG components (BrisbaneRiver, SacredGeometry, VitruvianFigure).

**Example:**
```svelte
<!-- HeroIllustration.svelte -->
<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = '' }: Props = $props();
</script>

<svg viewBox="0 0 1000 1000" class={className} fill="none">
  <!-- All paths get class="hero-path" for GSAP targeting -->
  <path class="hero-path" d="M..." stroke="#c55a3d" stroke-width="1" />
  <path class="hero-path" d="M..." stroke="#c55a3d" stroke-width="0.8" />
</svg>

<!-- NO <style> block with CSS animations — GSAP handles all animation -->
```

### Pattern 3: CSS-Only Logo Carousel

**What:** Pure CSS infinite marquee using absolute positioning, staggered negative animation-delay, and CSS custom properties. No JavaScript required.

**When to use:** For the brand logo carousel at the bottom of the hero section.

**Source:** Smashing Magazine (widely supported technique)

**Example:**
```css
/* Source: smashingmagazine.com/2024/04/infinite-scrolling-logos-html-css/ */
.marquee {
  --marquee-item-width: 120px;
  --marquee-duration: 30s;
  --marquee-items: 6;
  display: flex;
  overflow-x: hidden;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 20%,
    black 80%,
    transparent
  );
}

.marquee__item {
  position: absolute;
  animation: scroll linear var(--marquee-duration) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .marquee__item {
    animation-play-state: paused;
    position: static;
  }
  .marquee {
    justify-content: space-evenly;
    mask-image: none;
  }
}
```

### Pattern 4: Mobile-Safe Viewport Height

**What:** Use `100svh` (small viewport height) with `100vh` fallback for mobile browsers where the address bar changes viewport size.

**When to use:** For the hero section full-viewport height.

**Example:**
```css
/* Source: Multiple authoritative sources on viewport units */
.hero {
  min-height: 100vh;        /* Fallback for older browsers */
  min-height: 100svh;       /* Small viewport height — accounts for mobile browser chrome */
}
```

### Anti-Patterns to Avoid

- **setTimeout-based sequencing (EXISTING WIP):** The current `Hero.svelte` uses `setTimeout` chains for animation timing. This is fragile, not interruptible, doesn't support easing, and breaks reduced-motion handling. Replace entirely with GSAP timeline.

- **CSS stroke-dasharray animation on SVG components:** The existing `BrisbaneRiver.svelte` has CSS `@keyframes` for path drawing. These compete with GSAP DrawSVG and can't be controlled by the parent timeline. Remove all CSS animation from SVG components.

- **Importing GSAP at module level:** Always dynamic-import GSAP inside `onMount()` or browser-guarded blocks. Module-level imports cause SSR failures.

- **Using `$effect` for animation initialization:** `$effect` reruns when dependencies change. Use `onMount` for one-time animation setup. `$effect` is inappropriate for animation orchestration.

- **Setting SVG `transform-origin` via CSS:** Browser inconsistencies with SVG transform-origin. Always set `transformOrigin` via GSAP, not CSS (Pitfall 6 from prior decisions).

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG path drawing | CSS `stroke-dasharray` + `getTotalLength()` | GSAP `DrawSVGPlugin` | DrawSVG handles path length calculation, Firefox quirks (use 102%), `<rect>`/`<ellipse>` support, live recalculation, and timeline integration automatically |
| Text splitting for reveal | Manual `<span>` wrapping | GSAP `SplitText` | Handles responsive line breaks, auto-cleanup, ARIA accessibility (`aria-label` on parent, `aria-hidden` on splits since v3.13), and re-splitting on resize |
| Reduced motion handling | Custom if/else blocks | `gsap.matchMedia()` | Auto-reverts animations when media query changes, manages context cleanup, pairs with ScrollTrigger cleanup |
| Infinite logo scroll | JavaScript interval/requestAnimationFrame | CSS `@keyframes` + absolute positioning | GPU-accelerated, zero JS, pauses properly with `prefers-reduced-motion`, widely supported |
| Mobile viewport height | `100vh` only | `100svh` with `100vh` fallback | `100vh` is cut off by mobile browser chrome. `100svh` accounts for the smallest viewport (when address bar is visible). Supported in Chrome 94+, Safari 15.4+, Firefox 101+ |

**Key insight:** The existing WIP code hand-rolls several of these (setTimeout sequencing, CSS stroke-dasharray animation, manual opacity transitions). All should be replaced with GSAP equivalents for better timing control, accessibility, and maintainability.

## Common Pitfalls

### Pitfall 1: DrawSVG Requires Stroke to Be Set
**What goes wrong:** DrawSVGPlugin animates `stroke-dashoffset`/`stroke-dasharray`. If the SVG element has no `stroke` attribute, nothing is visible.
**Why it happens:** SVG elements default to `stroke: none`. Easy to forget when building inline SVGs.
**How to avoid:** Every `<path>`, `<line>`, `<circle>`, `<rect>`, `<ellipse>` that will be animated must have both `stroke` and `stroke-width` set (via attributes or CSS).
**Warning signs:** SVG is invisible after animation plays. Check browser dev tools for missing stroke.

### Pitfall 2: Firefox Path Length Miscalculation
**What goes wrong:** Firefox sometimes calculates incorrect `getTotalLength()` values, causing paths to stop drawing slightly short of completion.
**Why it happens:** Firefox bug in SVG path length calculation (documented in GSAP DrawSVG docs).
**How to avoid:** Use `drawSVG: "0% 102%"` instead of `"0% 100%"` as end state, or add extra anchor points to paths.
**Warning signs:** Path animation stops a few pixels short on Firefox only.

### Pitfall 3: iOS Safari `<rect>` Rendering Bug
**What goes wrong:** DrawSVG on `<rect>` elements renders inconsistently on iOS Safari.
**Why it happens:** WebKit SVG rendering bug.
**How to avoid:** Convert `<rect>` elements to `<path>` equivalents, or use `<polyline>` for rectangular shapes. The `SacredGeometry.svelte` component currently uses `<rect>` and must be converted.
**Warning signs:** Sacred geometry square doesn't draw properly on iOS devices.

### Pitfall 4: SSR Hydration Mismatch with GSAP
**What goes wrong:** If GSAP sets inline styles during animation (e.g., `opacity: 0`), the server-rendered HTML has different styles than the client, causing hydration warnings.
**Why it happens:** GSAP only runs client-side. Server renders default state, client immediately applies GSAP styles.
**How to avoid:** Set initial states via CSS (not GSAP `.set()`), so server and client start with the same DOM. Use `visibility: hidden` or `opacity: 0` in CSS, then GSAP animates to visible.
**Warning signs:** Console warnings about hydration mismatch on page load.

### Pitfall 5: Layout Conflict Between Fixed Nav and 100vh Hero
**What goes wrong:** The existing `+layout.svelte` has `padding-top: 5rem` on `.main-content` to account for the fixed navigation. If the hero is `100vh`, it overflows because `100vh + 5rem` exceeds the viewport.
**Why it happens:** The hero is inside `.main-content` which already has top padding for the nav.
**How to avoid:** Either: (a) hero uses `height: 100svh` and is positioned to overlap the nav padding area (negative margin or absolute positioning), or (b) hero specifically accounts for nav height: `height: calc(100svh - 5rem)`, or (c) hero breaks out of `.main-content` padding context.
**Warning signs:** Hero doesn't fill the full viewport, or content below hero is pushed down too far.

### Pitfall 6: GSAP Timeline Cleanup on SvelteKit Navigation
**What goes wrong:** If user navigates away mid-animation, timeline continues running against unmounted DOM nodes, causing errors or memory leaks.
**Why it happens:** GSAP animations are not automatically tied to Svelte component lifecycle.
**How to avoid:** Always `kill()` timelines and ScrollTrigger instances in `onDestroy()`. Use `gsap.matchMedia()` which provides auto-cleanup context.
**Warning signs:** Console errors about accessing null elements after navigation.

### Pitfall 7: Logo Carousel Without Content
**What goes wrong:** CONTENT.md notes "Brand logo carousel content (clients TBD)" -- there may be no actual logos to display yet.
**Why it happens:** Content dependency not resolved.
**How to avoid:** Build carousel component with placeholder state. Use generic geometric marks or company initials as placeholder logos. Make it trivially replaceable when real logos arrive.
**Warning signs:** Empty carousel section in production.

### Pitfall 8: Mobile Animation Jank from Too Many SVG Paths
**What goes wrong:** Drawing many SVG paths simultaneously causes frame drops on mobile devices.
**Why it happens:** `stroke-dashoffset` animation triggers repaint for each path on every frame. Mobile GPUs can't keep up with 30+ paths.
**How to avoid:** Mobile version should have 8-12 paths maximum (vs 20-30+ on desktop). Group paths where possible. Use `will-change: stroke-dashoffset` judiciously. Test on real devices.
**Warning signs:** Animation stutters or device heats up during hero entrance on mobile.

### Pitfall 9: SplitText on SSR-Rendered Text
**What goes wrong:** SplitText manipulates DOM directly. If called on server-rendered text during hydration, it can cause mismatches.
**Why it happens:** SplitText reads computed styles and modifies DOM.
**How to avoid:** Only call SplitText inside `onMount()` or inside a `gsap.matchMedia()` callback (which is browser-only by nature).
**Warning signs:** Flash of unstyled text, then text disappears or duplicates.

## Code Examples

Verified patterns from official sources:

### DrawSVG Plugin Registration and Basic Usage
```typescript
// Source: gsap.com/docs/v3/Plugins/DrawSVGPlugin/ (Context7 verified)
import { gsap } from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

// Draw from nothing to full stroke
gsap.from('.hero-path', { drawSVG: 0, duration: 0.6 });

// Draw from center outward
gsap.fromTo('.hero-path',
  { drawSVG: '50% 50%' },
  { drawSVG: '0% 100%', duration: 0.8 }
);

// Staggered drawing of multiple paths
gsap.from('.hero-path', {
  drawSVG: 0,
  duration: 0.6,
  stagger: 0.05,
  ease: 'power3.out'
});
```

### GSAP matchMedia for Reduced Motion (Official Pattern)
```typescript
// Source: gsap.com/resources/a11y (Context7 verified)
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  const tl = gsap.timeline();

  tl.from('.hero-path', { drawSVG: 0, duration: 0.6, stagger: 0.05 })
    .from('.headline', { opacity: 0, y: 20, duration: 0.4 }, '-=0.2')
    .from('.tagline', { opacity: 0, y: 15, duration: 0.3 }, '-=0.15');

  return () => {
    // Context auto-reverts when media query changes
    tl.kill();
  };
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Instant — all visible, no motion
  gsap.set('.hero-path', { drawSVG: '0% 100%' });
  gsap.set(['.headline', '.tagline', '.subline', '.cta'], {
    opacity: 1, y: 0
  });
});
```

### Timeline Position Parameter for Overlapping Animations
```typescript
// Source: gsap.com/resources/position-parameter (Context7 verified)
const tl = gsap.timeline();

// Sequential by default
tl.from('.hero-path', { drawSVG: 0, duration: 0.6, stagger: 0.05 })
  // Start 0.2s before previous ends (overlap)
  .from('.headline', { opacity: 0, y: 20, duration: 0.4 }, '-=0.2')
  // Start 0.15s before previous ends
  .from('.tagline', { opacity: 0, y: 15, duration: 0.3 }, '-=0.15')
  // Start at same time as tagline
  .from('.subline', { opacity: 0, y: 10, duration: 0.3 }, '<')
  // Start 0.1s after previous starts
  .from('.cta-group', { opacity: 0, duration: 0.3 }, '<0.1');
```

### SplitText with ARIA Accessibility
```typescript
// Source: gsap.com/docs/v3/Plugins/SplitText/ (Context7 verified)
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// SplitText auto-adds aria-label to parent, aria-hidden to children (since v3.13)
const split = new SplitText('.headline', {
  type: 'chars,words',
  // Mask wraps each element for clip reveal effects
  mask: 'words'
});

gsap.from(split.chars, {
  opacity: 0,
  y: 20,
  stagger: 0.02,
  duration: 0.4,
  ease: 'power3.out'
});

// IMPORTANT: Revert split when animation is done or on destroy
// split.revert() restores original HTML
```

### SSR-Safe GSAP Initialization in Svelte 5
```typescript
// Source: dev.to/jasper-clarke + existing project patterns
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';

let timeline: gsap.core.Timeline | null = null;
let matchMedia: gsap.MatchMedia | null = null;

onMount(async () => {
  if (!browser) return;

  // Dynamic imports for tree-shaking and SSR safety
  const { gsap } = await import('gsap');
  const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

  matchMedia = gsap.matchMedia();

  matchMedia.add("(prefers-reduced-motion: no-preference)", () => {
    timeline = gsap.timeline();
    // ... build animation
  });
});

onDestroy(() => {
  // matchMedia.revert() kills all animations and ScrollTriggers in its contexts
  if (matchMedia) {
    matchMedia.revert();
    matchMedia = null;
  }
  if (timeline) {
    timeline.kill();
    timeline = null;
  }
});
```

### Basic Parallax with ScrollTrigger
```typescript
// Source: gsap.com parallax examples (Context7 verified)
// Basic parallax: illustration moves slower than scroll
gsap.to('.hero-illustration', {
  yPercent: -15,  // Moves up 15% of its height
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1  // Smooth follow (1 second lag)
  }
});
```

### CSS-Only Infinite Logo Marquee
```css
/* Source: smashingmagazine.com/2024/04/infinite-scrolling-logos-html-css/ */
.logo-carousel {
  --item-width: 120px;
  --item-height: 40px;
  --duration: 30s;
  --items: 6;
  --gap: 3rem;
  --offset: max(
    calc(var(--item-width) * var(--items) + var(--gap) * var(--items)),
    calc(100% + var(--item-width))
  );

  display: flex;
  height: var(--item-height);
  overflow-x: hidden;
  position: relative;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

.logo-carousel__item {
  position: absolute;
  inset-inline-start: var(--offset);
  animation: marquee linear var(--duration) infinite;
  transform: translateX(-50%);
  /* Stagger: each item gets --item-index via nth-of-type */
  animation-delay: calc(
    var(--duration) / var(--items) * (var(--items) - var(--item-index)) * -1
  );
}

@keyframes marquee {
  to {
    inset-inline-start: calc(var(--item-width) * -1);
  }
}

/* Reduced motion: static layout */
@media (prefers-reduced-motion: reduce) {
  .logo-carousel__item {
    animation-play-state: paused;
    position: static;
    transform: none;
  }
  .logo-carousel {
    justify-content: space-evenly;
    mask-image: none;
    gap: var(--gap);
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS `stroke-dasharray` + JS `getTotalLength()` | GSAP DrawSVGPlugin | Available free since April 2025 | Handles path length, Firefox quirks, iOS Safari, timeline integration |
| `gsap-trial` npm package | `gsap` npm package (all plugins included) | April 2025 (Webflow acquisition) | No more trial limitations. DrawSVG, SplitText, MorphSVG all in standard package |
| `100vh` for mobile | `100svh` with `100vh` fallback | Chrome 94+, Safari 15.4+, Firefox 101+ | Accounts for mobile browser chrome (address bar) |
| Manual ARIA for split text | SplitText built-in ARIA (v3.13+) | GSAP 3.13.0 | Auto-adds `aria-label` to parent, `aria-hidden` to split children |
| Custom reduced motion checks | `gsap.matchMedia()` | GSAP 3.11+ | Auto-reverts animations when media query changes, manages cleanup contexts |
| Separate `gsap-trial` for premium plugins | All plugins in `gsap` package | April 2025 | Single `npm install gsap` gets everything |

**Deprecated/outdated:**
- `gsap-trial` package: No longer needed. All plugins are in the standard `gsap` package.
- `TimelineLite`/`TimelineMax`/`TweenLite`/`TweenMax`: Replaced by `gsap.timeline()` and `gsap.to()/from()/fromTo()`.

## Discretion Recommendations

Research-backed recommendations for areas marked as "Claude's Discretion":

### SVG Illustration Design
**Recommendation:** Evolve the existing three-component system (BrisbaneRiver + SacredGeometry + VitruvianFigure) rather than building from scratch. These already capture the "Anatomy of Place" concept from the hero brief. Simplify and unify them into a single `HeroIllustration.svelte` that merges the best paths from all three. The existing VitruvianFigure has ~60 paths which is too many for animation; pare down to ~20-25 essential paths that communicate the anatomical/cartographic concept.

### Mobile SVG Path Count
**Recommendation:** 8-12 paths on mobile. Use the river course (3-4 major paths), sacred geometry circle+square (2 paths converted from rect), and 4-6 of the most recognizable figure outlines (head, torso, arms horizontal). Remove subtle details (muscle lines, guide lines, secondary arm positions).

### Parallax Speed Ratios
**Recommendation:** Illustration layer at `yPercent: -10` to `-15` with `scrub: 1` (1-second smooth follow). This creates a subtle depth shift without being disorienting. Text layer scrolls normally (no GSAP needed). Keep it minimal per the "basic parallax" scope.

### Animation Timing Curve
**Recommendation:** Use `power3.out` (matches existing global defaults) for the draw-in, with total sequence under 1 second:
- SVG draw: 0 to 0.6s (stagger 0.03-0.05s per path)
- Text reveal: 0.4s to 0.9s (overlaps SVG by 0.2s)
- CTAs fade: 0.7s to 1.0s
This keeps total entrance under 1 second as specified while still feeling intentional.

### Mobile Animation Strategy
**Recommendation:** Start with DrawSVG on mobile (fewer paths = less work). If performance testing shows jank on mid-range devices, fall back to a simple opacity fade-in for the SVG (GSAP `from` with `opacity: 0, duration: 0.3`). Test on a real mid-range Android device (Pixel 6a class).

### Logo Carousel
**Recommendation:** CSS-only infinite marquee (no JS). Subtle, slow scroll (30s+ full cycle). Falls back to static evenly-spaced row on `prefers-reduced-motion: reduce`. Use placeholder geometric marks until real client logos are provided.

### Hero-to-Problems Transition
**Recommendation:** Simple — the hero ends at 100svh, and the next section starts naturally below. No scroll-triggered exit animation (that's deferred to v1.1). A subtle separator could be a thin terracotta horizontal rule or a simple gradient fade from cream to slightly warmer cream.

## Open Questions

Things that couldn't be fully resolved:

1. **Logo carousel content availability**
   - What we know: CONTENT.md says "clients TBD" for logo carousel
   - What's unclear: Whether any placeholder logos exist or should be created
   - Recommendation: Build component with 6 placeholder slots using geometric SVG marks. Make it trivially replaceable.

2. **Navigation z-index interaction with hero**
   - What we know: Navigation is `z-50` fixed header, hero is underneath. Layout has `padding-top: 5rem`.
   - What's unclear: Whether hero should sit behind the nav (full 100svh with content starting at 5rem) or account for nav height
   - Recommendation: Hero should be full 100svh. Add `padding-top` to hero content area (not the hero section itself) to prevent text from hiding behind the nav. The illustration can extend under the nav for full-bleed effect.

3. **SplitText vs simple opacity reveal for headline**
   - What we know: SplitText is available and free. The context says "editorial feel, typography is the star."
   - What's unclear: Whether character-by-character reveal fits the editorial aesthetic or feels too flashy
   - Recommendation: Use SplitText with `type: 'words'` and `mask: 'words'` for a refined word-by-word clip reveal. This is more editorial than character-by-character. Fall back to simple `opacity + y` if it feels overwrought.

## Sources

### Primary (HIGH confidence)
- Context7 `/llmstxt/gsap_llms_txt` - DrawSVGPlugin API, matchMedia patterns, timeline sequencing, accessibility
- Context7 `/websites/gsap_v3` - DrawSVG registration, installation, plugin imports
- [GSAP DrawSVGPlugin official docs](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/) - API reference, limitations, Firefox workarounds
- [GSAP Installation docs](https://gsap.com/docs/v3/Installation/) - npm import paths, plugin registration
- [GSAP Accessibility guide](https://gsap.com/resources/a11y) - matchMedia reduced motion pattern
- Verified: `node_modules/gsap/DrawSVGPlugin.js` and `SplitText.js` exist in installed package
- Existing codebase: `gsap.ts`, `motion.ts`, `animate.ts`, `Hero.svelte`, all SVG components

### Secondary (MEDIUM confidence)
- [Smashing Magazine: Infinite-scrolling logos](https://www.smashingmagazine.com/2024/04/infinite-scrolling-logos-html-css/) - CSS-only marquee technique, verified cross-browser
- [dev.to: Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no) - Svelte action pattern, cleanup strategy
- [CSS-Tricks: GSAP is now completely free](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) - License confirmation
- [Codrops: Free GSAP plugins demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/) - Real-world plugin usage patterns
- Multiple sources on `100svh` viewport units (Medium, DEV Community) - mobile viewport fix

### Tertiary (LOW confidence)
- None — all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries verified installed, import paths confirmed, API docs checked via Context7
- Architecture: HIGH - patterns verified against GSAP official docs and existing project conventions
- Pitfalls: HIGH - DrawSVG gotchas from official docs, SSR patterns from existing codebase, mobile viewport from multiple sources
- Discretion recommendations: MEDIUM - based on research and judgment, not user-validated

**Research date:** 2026-02-06
**Valid until:** 2026-03-06 (30 days — GSAP and Svelte ecosystems are stable)
