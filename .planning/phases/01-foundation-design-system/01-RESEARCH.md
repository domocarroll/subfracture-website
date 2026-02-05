# Phase 1: Foundation & Design System - Research

**Researched:** 2026-02-05
**Domain:** Editorial design system (typography, color, grid) + GSAP animation infrastructure
**Confidence:** HIGH

## Summary

This research covers the foundational design system for an editorial website with the "Nigrum Corpus" aesthetic: neo-classical medical illustration, museum-like pages, and scholarly warmth. The phase establishes design tokens, typography scale, color palette, responsive grid, and GSAP animation utilities that all subsequent phases depend on.

The technical stack is already established: SvelteKit 2 + Svelte 5 + Tailwind CSS 4 + GSAP. The research focuses on implementation patterns for each decision from CONTEXT.md, filling in the discretionary choices with evidence-based recommendations.

**Primary recommendation:** Use Tailwind CSS 4's `@theme` directive for all design tokens (colors, typography, spacing), implement GSAP via Svelte actions with proper cleanup, and adopt a golden ratio (1.618) typography scale for the dramatic editorial feel.

---

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| SvelteKit | ^2.50.1 | Full-stack framework | Already installed; SSR, routing |
| Svelte | ^5.48.2 | UI framework | Already installed; runes system |
| Tailwind CSS | ^4.1.18 | Utility-first CSS | Already installed; CSS-first config |
| @tailwindcss/vite | ^4.1.18 | Vite integration | Already installed; simpler than PostCSS |

### To Install

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| gsap | ^3.14.2 | Animation engine | Industry standard; 100% free including all plugins |
| @fontsource-variable/playfair-display | ^5.2.8 | Self-hosted variable font | GDPR compliant, version-locked, offline support |
| @fontsource/source-sans-3 | ^5.x | UI sans-serif | Clean, readable, pairs well with Playfair Display |
| @tailwindcss/typography | ^0.5.x | Prose styling | Essential for editorial content |

### Supporting (Optional)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lenis | ^1.3.17 | Smooth scrolling | When scroll-linked animations feel janky |

**Installation:**
```bash
npm install gsap @fontsource-variable/playfair-display @fontsource/source-sans-3 @tailwindcss/typography
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── lib/
│   ├── styles/
│   │   └── tokens.css          # Design tokens (imported in app.css)
│   ├── actions/
│   │   └── animate.ts          # GSAP Svelte action
│   ├── utils/
│   │   ├── gsap.ts            # GSAP setup, registration, SSR guards
│   │   └── motion.ts          # Reduced motion utilities, easing presets
│   └── components/
│       └── ui/                 # Foundational UI components
├── app.css                     # Global styles, imports tokens.css
└── routes/
    └── +layout.svelte          # Font imports, GSAP registration
```

### Pattern 1: Tailwind CSS 4 Design Tokens

**What:** Define all design tokens using `@theme` directive in CSS
**When to use:** Always for colors, typography, spacing, breakpoints

**Example:**
```css
/* src/lib/styles/tokens.css */
@theme {
  /* === COLORS (Semantic) === */
  --color-surface: #f5f0e8;           /* Cream/parchment background */
  --color-surface-warm: #f0ebe0;      /* Slightly warmer variant */
  --color-text: #1a1a1a;              /* Black ink */
  --color-text-muted: #4a4a4a;        /* Secondary text */
  --color-primary: #c55a3d;           /* Terracotta accent */
  --color-primary-dark: #a84830;      /* Darker terracotta for hover */
  --color-botanical: #5a7c65;         /* Muted green (botanical only) */
  --color-bone: #e8e0d4;              /* Light stone tone */
  --color-burgundy: #722f37;          /* Deep red accent */

  /* === TYPOGRAPHY === */
  --font-serif: "Playfair Display Variable", Georgia, serif;
  --font-sans: "Source Sans 3", system-ui, sans-serif;

  /* Golden Ratio Scale (1.618) - base 18px */
  --text-xs: 0.69rem;                 /* 11px - labels, captions */
  --text-sm: 0.875rem;                /* 14px - small UI */
  --text-base: 1.125rem;              /* 18px - body */
  --text-lg: 1.5rem;                  /* 24px - lead paragraphs */
  --text-xl: 1.875rem;                /* 30px - H4 */
  --text-2xl: 2.44rem;                /* 39px - H3 */
  --text-3xl: 3.05rem;                /* 49px - H2 */
  --text-4xl: 3.95rem;                /* 63px - H1 */
  --text-5xl: 4.94rem;                /* 79px - Display */
  --text-6xl: 6.4rem;                 /* 102px - Hero display */

  /* Line Heights */
  --text-base--line-height: 1.8;      /* Generous body (art book feel) */
  --text-lg--line-height: 1.7;
  --text-xl--line-height: 1.4;
  --text-2xl--line-height: 1.3;
  --text-3xl--line-height: 1.2;
  --text-4xl--line-height: 1.1;
  --text-5xl--line-height: 1.05;
  --text-6xl--line-height: 1;

  /* === SPACING === */
  --spacing-section: 10rem;           /* 160px between sections */
  --spacing-section-sm: 7.5rem;       /* 120px mobile */

  /* === BREAKPOINTS === */
  --breakpoint-sm: 40rem;             /* 640px */
  --breakpoint-md: 48rem;             /* 768px - two-column collapse */
  --breakpoint-lg: 64rem;             /* 1024px */
  --breakpoint-xl: 80rem;             /* 1280px */

  /* === GRID === */
  --content-max: 56.25rem;            /* 900px - narrow editorial */
  --content-wide: 75rem;              /* 1200px - when needed */

  /* === EASING (Organic/Botanical) === */
  --ease-organic: cubic-bezier(0.22, 1, 0.36, 1);     /* Out-quint feel */
  --ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);       /* Out-expo, dramatic */
  --ease-subtle: cubic-bezier(0.4, 0, 0.2, 1);        /* Material design standard */
}
```

### Pattern 2: GSAP Svelte Action with SSR Safety

**What:** Svelte action wrapping GSAP methods with proper cleanup
**When to use:** For all GSAP animations in components

**Example:**
```typescript
// src/lib/actions/animate.ts
import { browser } from '$app/environment';

type GSAPMethodType = 'to' | 'from' | 'fromTo' | 'set';

interface AnimateOptions extends gsap.TweenVars {
  type?: GSAPMethodType;
  scrollTrigger?: ScrollTrigger.Vars;
}

let gsapModule: typeof import('gsap') | null = null;
let ScrollTriggerPlugin: typeof import('gsap/ScrollTrigger').ScrollTrigger | null = null;

// Lazy load GSAP only in browser
async function ensureGSAP() {
  if (!browser) return null;

  if (!gsapModule) {
    gsapModule = await import('gsap');
    const stModule = await import('gsap/ScrollTrigger');
    ScrollTriggerPlugin = stModule.ScrollTrigger;
    gsapModule.gsap.registerPlugin(ScrollTriggerPlugin);
  }

  return gsapModule.gsap;
}

export function animate(
  node: HTMLElement,
  options: AnimateOptions = {}
): { destroy?: () => void; update?: (opts: AnimateOptions) => void } {
  if (!browser) return {};

  const { type = 'to', scrollTrigger, ...tweenVars } = options;
  let tween: gsap.core.Tween | null = null;

  // Initialize async
  ensureGSAP().then((gsap) => {
    if (!gsap) return;

    const vars: gsap.TweenVars = {
      ...tweenVars,
      scrollTrigger: scrollTrigger
        ? { trigger: node, ...scrollTrigger }
        : undefined
    };

    switch (type) {
      case 'from':
        tween = gsap.from(node, vars);
        break;
      case 'set':
        tween = gsap.set(node, vars) as unknown as gsap.core.Tween;
        break;
      default:
        tween = gsap.to(node, vars);
    }
  });

  return {
    destroy() {
      if (tween) {
        const st = tween.scrollTrigger;
        tween.kill();
        if (st) st.kill();
      }
    }
  };
}
```

**Usage in component:**
```svelte
<script lang="ts">
  import { animate } from '$lib/actions/animate';
</script>

<h1 use:animate={{
  type: 'from',
  opacity: 0,
  y: 30,
  duration: 0.6,
  ease: 'var(--ease-reveal)'
}}>
  Heading
</h1>
```

### Pattern 3: Golden Ratio Two-Column Grid

**What:** Asymmetric two-column layout using ~62/38 split
**When to use:** Desktop content layouts, services sections

**Example:**
```html
<!-- Golden ratio: 62% / 38% -->
<div class="grid md:grid-cols-[1.618fr_1fr] gap-8 max-w-[--content-max] mx-auto px-6">
  <div class="col-major">
    <!-- Primary content (larger column) -->
  </div>
  <div class="col-minor">
    <!-- Secondary content (smaller column) -->
  </div>
</div>
```

**CSS utilities:**
```css
/* In app.css after @import */
@utility col-golden-major {
  grid-column: span 1;
}

@utility col-golden-minor {
  grid-column: span 1;
}

/* Or use explicit values */
.grid-golden {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8);
}

@media (width >= 48rem) {
  .grid-golden {
    grid-template-columns: 1.618fr 1fr;
  }
}
```

### Pattern 4: Section Numbers (01, 02...)

**What:** Superscript/small section numbers beside headings
**When to use:** Section headings throughout site

**Example:**
```svelte
<script>
  export let number: string;  // "01", "02", etc.
  export let title: string;
</script>

<div class="section-heading">
  <span class="section-number">{number}</span>
  <h2 class="section-title">{title}</h2>
</div>

<style>
  .section-heading {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .section-number {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-primary);
    letter-spacing: 0.1em;
    /* Slightly raised like superscript but not as extreme */
    position: relative;
    top: -0.15em;
  }

  .section-title {
    font-family: var(--font-serif);
    font-size: var(--text-3xl);
    font-weight: 400;
    color: var(--color-text);
    line-height: var(--text-3xl--line-height);
    margin: 0;
  }
</style>
```

### Anti-Patterns to Avoid

- **Using $effect for one-time animation setup:** Use `onMount` instead. $effect re-runs on dependency changes.
- **Mixing Tailwind classes with inline styles for same properties:** Pick one approach per property.
- **Hard-coding animation values:** Use CSS custom properties for consistency.
- **Importing GSAP at module level without browser guards:** Always use dynamic imports or browser checks.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Typography scale | Manual font-size calculations | Golden ratio scale in tokens | Mathematical harmony, consistent rhythm |
| Animation cleanup | Manual tween.kill() calls | GSAP action with destroy() | Prevents memory leaks on navigation |
| Smooth scrolling | Custom RAF scroll | Lenis (if needed) | Edge cases, momentum, touch devices |
| Font loading | @font-face declarations | Fontsource packages | Version-locked, pre-optimized, tree-shakeable |
| Responsive breakpoints | @media queries in components | Tailwind's responsive prefixes | Consistent, composable, no context switching |

**Key insight:** Design tokens in `@theme` make hand-rolled CSS unnecessary. Define once, use everywhere via utilities.

---

## Common Pitfalls

### Pitfall 1: Google Fonts Still in app.css

**What goes wrong:** The current app.css imports Playfair Display from Google Fonts CDN. This creates GDPR concerns and adds external dependency.

**How to avoid:**
1. Remove `@import url('https://fonts.googleapis.com/css2...')` line
2. Install Fontsource package
3. Import in +layout.svelte or app entry

**Warning signs:** Network waterfall shows fonts.googleapis.com request

### Pitfall 2: SSR Hydration Mismatch with GSAP

**What goes wrong:** GSAP code runs on server, causing hydration errors or "window is not defined" crashes.

**How to avoid:**
1. Use `browser` check from `$app/environment`
2. Use dynamic imports for GSAP modules
3. Initialize animations in `onMount`, not module scope

**Warning signs:** Console errors about window/document, flash of unstyled content

### Pitfall 3: ScrollTrigger Persists Across Routes

**What goes wrong:** Navigation doesn't cleanup ScrollTriggers, causing position miscalculations on return.

**How to avoid:**
1. Use GSAP action with destroy() callback
2. Call ScrollTrigger.refresh() in afterNavigate hook
3. Monitor `ScrollTrigger.getAll().length` during development

**Warning signs:** Animations don't trigger on second visit, wrong scroll positions

### Pitfall 4: Mint/Magenta Colors Creeping In

**What goes wrong:** Existing app.css has `--color-mint` and `--color-magenta` defined. These are explicitly excluded from palette.

**How to avoid:**
1. Remove these color definitions from tokens
2. Don't use them in any component
3. Code review for accidental usage

**Warning signs:** Any mint or magenta appearing in UI

### Pitfall 5: Typography Plugin Conflicts

**What goes wrong:** @tailwindcss/typography's `prose` classes conflict with custom typography tokens.

**How to avoid:**
1. Use prose only for CMS/Markdown content
2. Don't use prose on custom-styled sections
3. Override prose defaults with CSS custom properties

**Warning signs:** Unexpected font sizes or colors in prose blocks

---

## Code Examples

### GSAP Registration (SSR-Safe)

```typescript
// src/lib/utils/gsap.ts
import { browser } from '$app/environment';

let initialized = false;

export async function initGSAP() {
  if (!browser || initialized) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  gsap.registerPlugin(ScrollTrigger);

  // Set global defaults matching motion personality
  gsap.defaults({
    duration: 0.6,
    ease: 'power3.out'  // Or custom ease
  });

  initialized = true;
  return gsap;
}
```

### Font Import in Layout

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '@fontsource-variable/playfair-display';
  import '@fontsource/source-sans-3/400.css';
  import '@fontsource/source-sans-3/500.css';
  import '@fontsource/source-sans-3/600.css';
  import '../app.css';

  import { onMount } from 'svelte';
  import { initGSAP } from '$lib/utils/gsap';

  let { children } = $props();

  onMount(() => {
    initGSAP();
  });
</script>

{@render children()}
```

### Reveal Animation Pattern

```svelte
<script lang="ts">
  import { animate } from '$lib/actions/animate';
</script>

<!-- Fade + slight rise, classic editorial reveal -->
<div
  use:animate={{
    type: 'from',
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power3.out',
    scrollTrigger: {
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  }}
>
  Content to reveal
</div>
```

### Staggered Reveal for Lists

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let container: HTMLElement;

  onMount(async () => {
    if (!browser) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const items = container.querySelectorAll('.stagger-item');

    gsap.from(items, {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.08,  // 0.05-0.1s per CONTEXT.md
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%'
      }
    });
  });
</script>

<ul bind:this={container}>
  <li class="stagger-item">Item 1</li>
  <li class="stagger-item">Item 2</li>
  <li class="stagger-item">Item 3</li>
</ul>
```

### Reduced Motion Utility

```typescript
// src/lib/utils/motion.ts
import { browser } from '$app/environment';

export function prefersReducedMotion(): boolean {
  if (!browser) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAnimationDuration(baseDuration: number): number {
  return prefersReducedMotion() ? 0 : baseDuration;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | @theme in CSS | Tailwind v4 (2024) | No JS config needed |
| PostCSS for Tailwind | @tailwindcss/vite | Tailwind v4 (2024) | Simpler Vite setup |
| Google Fonts CDN | Fontsource NPM | 2023+ | GDPR compliant, faster |
| $effect for animations | onMount + actions | Svelte 5 (2024) | Avoids re-run issues |
| gsap.context() | Svelte action destroy | 2025 | Native Svelte cleanup |
| Club GreenSock paid | GSAP 100% free | Late 2024 | All plugins included |

**Deprecated/outdated:**
- `tailwind.config.js` - Use `@theme` in CSS instead (v4)
- Google Fonts `@import` - Use Fontsource for self-hosting
- `$effect` for one-time setup - Use `onMount` for animations

---

## Claude's Discretion Recommendations

Based on research, here are recommendations for the discretionary items from CONTEXT.md:

### Sans vs Serif for UI Elements

**Recommendation:** Use **Source Sans 3** for UI elements (nav, buttons, labels).

**Rationale:**
- Source Sans Pro is the #1 recommended Playfair Display pairing
- Clean, highly legible, neutral sans-serif
- Works well at small sizes for labels and UI
- Provides clear contrast between editorial content (Playfair) and functional UI (Source Sans)

### Exact Breakpoint for Two-Column Collapse

**Recommendation:** Collapse at **768px (md breakpoint / 48rem)**.

**Rationale:**
- With max content width of 900px and golden ratio split (558px / 342px)
- The smaller column becomes too narrow below 768px for comfortable reading
- 768px is standard tablet breakpoint, natural transition point
- Matches Tailwind's default `md` for consistency

### Terracotta Application

**Recommendation:**
- **Primary:** Section numbers (01, 02), link hover states
- **Secondary:** H1 headings (hero only), selection highlight
- **Accent:** Decorative lines, annotation markers

**Rationale:**
- Section numbers as terracotta creates consistent wayfinding
- Terracotta H1 only in hero prevents overuse
- Links need hover state differentiation; terracotta provides warmth
- Restraint = impact (color is controlled and symbolic per CONTEXT.md)

### GSAP API Architecture

**Recommendation:** **Svelte action** for simple tweens, **onMount imperative** for complex timelines.

**Rationale:**
- Actions provide automatic cleanup via destroy()
- Actions are declarative and component-scoped
- Complex timelines with multiple targets need imperative control
- Mix is pragmatic: action for 80% of cases, imperative for complex sequences

### Specific Easing Curves

**Recommendation:**
```css
--ease-organic: cubic-bezier(0.22, 1, 0.36, 1);   /* Primary - out-quint feel */
--ease-reveal: cubic-bezier(0.16, 1, 0.3, 1);     /* Hero/dramatic - out-expo */
--ease-subtle: cubic-bezier(0.4, 0, 0.2, 1);      /* UI interactions */
```

**Rationale:**
- Out-quint/expo curves feel organic (fast start, gentle settle)
- Matches botanical/natural motion personality
- 0.5-0.8s duration per CONTEXT.md

---

## Open Questions

### 1. Playfair Display for Body Text

**What we know:** CONTEXT.md specifies Playfair Display for headings AND body.

**What's unclear:** At 18px body size with 1.8 line-height, Playfair's high contrast may reduce readability for long paragraphs.

**Recommendation:** Implement as specified, but prepare Source Sans fallback. Test with real content; if readability suffers in long passages, propose body text in Source Sans.

### 2. Variable Font Axes

**What we know:** @fontsource-variable/playfair-display supports wght axis (400-900).

**What's unclear:** Whether we need italic axis loaded separately (`wght-italic.css`).

**Recommendation:** Import both. Italic is used for the subhead in Hero and likely elsewhere. Bundle impact is minimal (~50KB for both).

---

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 @theme Documentation](https://tailwindcss.com/docs/adding-custom-styles) - Theme configuration
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors) - Custom color setup
- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design) - Breakpoint customization
- [GSAP ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger) - ScrollTrigger setup
- [GSAP revert() Documentation](https://gsap.com/docs/v3/GSAP/Timeline/revert%28%29) - Cleanup patterns
- [Svelte Lifecycle Hooks](https://svelte.dev/docs/svelte/lifecycle-hooks) - onMount vs $effect
- [Svelte Actions](https://svelte.dev/docs/svelte/use) - use: directive patterns
- [Fontsource Playfair Display](https://fontsource.org/fonts/playfair-display/install) - Font installation

### Secondary (MEDIUM confidence)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no) - Action patterns
- [Playfair Display Font Pairings](https://www.typewolf.com/playfair-display) - Typography pairing
- [Golden Ratio Typography Calculator](https://tools.yasirusenarathna.com/) - Scale calculation
- [Typographic Hierarchy and Scale](https://library.fiveable.me/advanced-editorial-design/unit-3/typographic-hierarchy-scale/study-guide/B1cAgPiV1GWWeXc3) - Editorial typography principles

### Tertiary (LOW confidence)
- [2026 Typography Trends](https://graphicdesignjunction.com/2026/01/2026-typography-trends/) - Industry direction (blog)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified via official docs/Context7
- Architecture: HIGH - Patterns verified against Tailwind v4 and Svelte 5 docs
- Pitfalls: HIGH - Based on prior project research (PITFALLS.md) and official GSAP docs
- Discretionary choices: MEDIUM - Based on research + judgment, may need user validation

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable domain)
