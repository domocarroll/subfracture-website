# Architecture Patterns

**Domain:** SvelteKit Editorial Portfolio Website (Single-Page Scrolling)
**Researched:** 2026-02-05
**Confidence:** HIGH (verified via official SvelteKit documentation and community patterns)

## Executive Summary

The Subfracture v2 website should follow a **section-based component architecture** with co-located animation logic. SvelteKit's file-based routing combined with Svelte 5's runes system provides an optimal foundation for a single-page scrolling experience with complex GSAP animations. The architecture prioritizes:

1. **Component isolation** - Each section is self-contained with its own animation logic
2. **Animation encapsulation** - GSAP integration via Svelte actions for clean, declarative markup
3. **CMS readiness** - Data structures designed for eventual Sanity integration
4. **Performance** - Static generation (SSG) for the marketing homepage

---

## Recommended Architecture

```
src/
├── routes/
│   └── +page.svelte              # Homepage (composes sections)
│   └── +layout.svelte            # Root layout (global styles, GSAP context)
│   └── +page.server.ts           # Future: Sanity data loading
│
├── lib/
│   ├── components/
│   │   ├── layout/               # Persistent UI elements
│   │   │   ├── StickyNav.svelte
│   │   │   ├── Footer.svelte
│   │   │   └── ScrollProgress.svelte
│   │   │
│   │   ├── sections/             # Homepage section components
│   │   │   ├── HeroSection.svelte
│   │   │   ├── ClientsReveal.svelte    # Lips reveal animation
│   │   │   ├── IntroSection.svelte
│   │   │   ├── TeamCarousel.svelte
│   │   │   ├── WhatWeDoSection.svelte
│   │   │   ├── ServicesSection.svelte
│   │   │   ├── AISystemSection.svelte
│   │   │   ├── ApproachSection.svelte
│   │   │   └── ValuesSection.svelte
│   │   │
│   │   └── ui/                   # Reusable primitives
│   │       ├── Clock.svelte
│   │       ├── LogoGrid.svelte
│   │       ├── ServiceCard.svelte
│   │       └── MagneticLink.svelte
│   │
│   ├── actions/                  # Svelte actions (GSAP integration)
│   │   ├── animate.ts            # Core GSAP action wrapper
│   │   ├── scrollTrigger.ts      # ScrollTrigger-specific action
│   │   ├── parallax.ts           # Parallax scroll effect
│   │   ├── reveal.ts             # Intersection-based reveal
│   │   └── magnetic.ts           # Magnetic cursor effect
│   │
│   ├── animations/               # Complex animation sequences
│   │   ├── heroTimeline.ts       # Hero video + watermark sequence
│   │   ├── lipsReveal.ts         # Clients section lips animation
│   │   ├── botanicalGrowth.ts    # SVG botanical growth animation
│   │   └── horizontalScroll.ts   # Horizontal scroll section logic
│   │
│   ├── stores/                   # Svelte 5 runes-based state
│   │   ├── scroll.svelte.ts      # Scroll position, direction
│   │   ├── viewport.svelte.ts    # Viewport dimensions, breakpoints
│   │   └── navigation.svelte.ts  # Active section tracking
│   │
│   ├── sanity/                   # CMS integration (future)
│   │   ├── client.ts             # Sanity client configuration
│   │   ├── queries.ts            # GROQ queries
│   │   └── types.ts              # TypeScript types for CMS data
│   │
│   ├── utils/                    # Pure utilities
│   │   ├── clamp.ts
│   │   ├── lerp.ts
│   │   └── debounce.ts
│   │
│   └── assets/                   # Imported assets (not static/)
│       ├── svg/                  # SVG components/files
│       └── images/               # Optimized images
│
├── static/                       # Static assets (videos, fonts)
│   ├── videos/
│   └── fonts/
│
└── app.css                       # Global Tailwind styles
```

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `+page.svelte` | Composes all sections, orchestrates page-level timeline | All sections (imports), layout |
| `+layout.svelte` | Global styles, GSAP context provider, persistent UI | Page, StickyNav, Footer |
| `HeroSection` | Video playback, watermark animation, scroll-triggered exit | animate action, heroTimeline |
| `ClientsReveal` | Logo grid display, lips reveal animation on scroll | lipsReveal animation, ScrollTrigger |
| `ServicesSection` | Service cards with staggered reveal | reveal action, ServiceCard components |
| `TeamCarousel` | Horizontal scroll carousel of team members | horizontalScroll animation |
| Svelte Actions | DOM lifecycle + GSAP binding | GSAP library, target elements |
| Stores (`.svelte.ts`) | Reactive global state | All consuming components |

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        +page.server.ts                          │
│                    (Future: Sanity data load)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ PageData
┌─────────────────────────────────────────────────────────────────┐
│                         +page.svelte                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Sections receive data via $props()                      │    │
│  │ - HeroSection: { videoUrl, logoSrc }                    │    │
│  │ - ServicesSection: { services: Service[] }              │    │
│  │ - TeamCarousel: { members: TeamMember[] }               │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
          Section Components          Global Stores
          (receive props)          (scroll.svelte.ts)
                    │                       │
                    └───────────┬───────────┘
                                │
                                ▼
                        Svelte Actions
                    (animate, scrollTrigger)
                                │
                                ▼
                          GSAP Library
                    (timelines, ScrollTrigger)
```

### State Management with Svelte 5 Runes

**Global reactive state** uses `.svelte.ts` files:

```typescript
// lib/stores/scroll.svelte.ts
export const scrollState = $state({
  y: 0,
  direction: 'down' as 'up' | 'down',
  velocity: 0
});

// Usage in components:
// import { scrollState } from '$lib/stores/scroll.svelte';
// Access: scrollState.y, scrollState.direction
```

**Component communication:**

1. **Parent to Child:** `$props()` for data
2. **Child to Parent:** Event dispatching or callback props
3. **Sibling to Sibling:** Shared stores in `.svelte.ts` files
4. **Global:** Context API for SSR-safe state (set in `+layout.svelte`)

---

## Patterns to Follow

### Pattern 1: GSAP Action Wrapper

Encapsulate GSAP animations in reusable Svelte actions.

**What:** Svelte actions bind GSAP to element lifecycle
**When:** Any element needs GSAP animation
**Why:** Declarative API, automatic cleanup, TypeScript support

```typescript
// lib/actions/animate.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimateOptions extends GSAPTweenVars {
  type?: 'to' | 'from' | 'fromTo';
  scrollTrigger?: ScrollTrigger.Vars;
}

export function animate(
  node: HTMLElement,
  options: AnimateOptions
): { destroy: () => void } {
  const { type = 'to', scrollTrigger, ...vars } = options;

  const tween = gsap[type](node, {
    ...vars,
    scrollTrigger: scrollTrigger
      ? { trigger: node, ...scrollTrigger }
      : undefined
  });

  return {
    destroy() {
      tween.kill();
      tween.scrollTrigger?.kill();
    }
  };
}
```

**Usage:**

```svelte
<h1
  use:animate={{
    type: 'from',
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  }}
>
  Culture Studio
</h1>
```

### Pattern 2: Section Component Structure

**What:** Each section is self-contained with internal animation logic
**When:** Building homepage sections
**Why:** Isolation, testability, reusability

```svelte
<!-- lib/components/sections/ServicesSection.svelte -->
<script lang="ts">
  import { animate } from '$lib/actions/animate';
  import ServiceCard from '$lib/components/ui/ServiceCard.svelte';
  import type { Service } from '$lib/sanity/types';

  let { services = [] }: { services: Service[] } = $props();
</script>

<section id="services" class="sf-section sf-services">
  <div class="container">
    <header
      use:animate={{
        type: 'from',
        y: 30,
        opacity: 0,
        scrollTrigger: { start: 'top 70%' }
      }}
    >
      <span class="sf-section__label">Services</span>
      <h2 class="sf-section__title">What We Build</h2>
    </header>

    <div class="sf-services__grid">
      {#each services as service, i}
        <ServiceCard
          {service}
          animationDelay={i * 0.1}
        />
      {/each}
    </div>
  </div>
</section>
```

### Pattern 3: Complex Animation Modules

**What:** Extract multi-step timelines into dedicated modules
**When:** Animations involve multiple elements or stages
**Why:** Keeps components readable, enables reuse

```typescript
// lib/animations/lipsReveal.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function createLipsReveal(container: HTMLElement) {
  const topLip = container.querySelector('.clients-reveal__lip--top');
  const bottomLip = container.querySelector('.clients-reveal__lip--bottom');
  const crack = container.querySelector('.clients-reveal__crack');
  const content = container.querySelector('.clients-reveal__content');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1
    }
  });

  tl.to(topLip, { yPercent: -100, duration: 1 }, 0)
    .to(bottomLip, { yPercent: 100, duration: 1 }, 0)
    .to(crack, { scaleY: 0, duration: 0.5 }, 0)
    .from(content, { opacity: 0, y: 20, duration: 0.5 }, 0.5);

  return {
    destroy() {
      tl.kill();
    }
  };
}
```

**Usage in component:**

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { createLipsReveal } from '$lib/animations/lipsReveal';

  let container: HTMLElement;
  let animation: ReturnType<typeof createLipsReveal>;

  onMount(() => {
    animation = createLipsReveal(container);
    return () => animation.destroy();
  });
</script>

<section bind:this={container} class="clients-reveal">
  <!-- ... -->
</section>
```

### Pattern 4: SSR-Safe GSAP Registration

**What:** Register GSAP plugins only in browser context
**When:** Using any GSAP plugin with SvelteKit
**Why:** Avoids SSR errors, plugins need DOM

```typescript
// lib/gsap.ts - Central GSAP setup
import { gsap } from 'gsap';
import { browser } from '$app/environment';

let initialized = false;

export async function initGSAP() {
  if (!browser || initialized) return gsap;

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  const { MorphSVGPlugin } = await import('gsap/MorphSVGPlugin');

  gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);
  initialized = true;

  return gsap;
}

export { gsap };
```

**Usage in layout:**

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { initGSAP } from '$lib/gsap';

  let { children } = $props();

  onMount(() => {
    initGSAP();
  });
</script>

{@render children()}
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Animation Logic in Templates

**What:** Defining GSAP timelines directly in component markup
**Why bad:** Cluttered templates, hard to test, no reusability
**Instead:** Extract to actions or animation modules

```svelte
<!-- BAD -->
<script>
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let el;
  onMount(() => {
    gsap.from(el, { opacity: 0 });
  });
</script>
<div bind:this={el}>...</div>

<!-- GOOD -->
<script>
  import { animate } from '$lib/actions/animate';
</script>
<div use:animate={{ type: 'from', opacity: 0 }}>...</div>
```

### Anti-Pattern 2: Global GSAP Plugin Registration in Components

**What:** Calling `gsap.registerPlugin()` in multiple components
**Why bad:** Race conditions, duplicate registration, SSR errors
**Instead:** Single initialization in `+layout.svelte` or dedicated module

### Anti-Pattern 3: Storing Scroll Position in Component State

**What:** Using `$state` within components for scroll position
**Why bad:** Every scroll event re-renders component, performance death
**Instead:** Use global store with throttled updates, or GSAP ScrollTrigger directly

### Anti-Pattern 4: Mixing Section Logic with Route Logic

**What:** Putting animation code, data fetching, and layout all in `+page.svelte`
**Why bad:** Unreadable, untestable, hard to maintain
**Instead:** `+page.svelte` only composes sections, each section is self-contained

### Anti-Pattern 5: Using `overflow: hidden` with CSS `perspective`

**What:** Combining overflow containment with 3D transforms on same element
**Why bad:** CSS spec flattens 3D when overflow is hidden
**Instead:** Separate overflow container from perspective container

```css
/* BAD */
.container {
  overflow: hidden;
  perspective: 1000px;
}

/* GOOD */
.container {
  overflow: hidden;
}
.container__inner {
  perspective: 1000px;
}
```

---

## Build Order Implications

Based on component dependencies, the recommended build order:

### Phase 1: Foundation (No Dependencies)

| Component | Rationale |
|-----------|-----------|
| Global styles (app.css) | Everything depends on design tokens |
| `+layout.svelte` | Root wrapper, GSAP initialization |
| Svelte Actions (`animate.ts`, `reveal.ts`) | Sections depend on these |
| Utility functions | Actions depend on these |

### Phase 2: UI Primitives (Depends on Phase 1)

| Component | Rationale |
|-----------|-----------|
| `Clock.svelte` | Used in header |
| `LogoGrid.svelte` | Used in clients section |
| `ServiceCard.svelte` | Used in services section |
| `MagneticLink.svelte` | Used throughout |

### Phase 3: Layout Components (Depends on Phase 1-2)

| Component | Rationale |
|-----------|-----------|
| `StickyNav.svelte` | Persistent UI, uses Clock |
| `Footer.svelte` | Persistent UI, uses MagneticLink |
| `ScrollProgress.svelte` | Depends on scroll store |

### Phase 4: Simple Sections (Depends on Phase 1-3)

| Component | Rationale |
|-----------|-----------|
| `IntroSection.svelte` | Text only, basic reveal |
| `WhatWeDoSection.svelte` | Text only, basic reveal |
| `ApproachSection.svelte` | Text only, basic reveal |
| `ValuesSection.svelte` | Text only, basic reveal |

### Phase 5: Complex Sections (Depends on Phase 1-4)

| Component | Rationale |
|-----------|-----------|
| `HeroSection.svelte` | Video, watermark, scroll-triggered exit |
| `ServicesSection.svelte` | Uses ServiceCard, staggered reveals |
| `AISystemSection.svelte` | Multi-part reveal animation |

### Phase 6: Advanced Animations (Depends on Phase 1-5)

| Component | Rationale |
|-----------|-----------|
| `ClientsReveal.svelte` | Complex lips reveal animation |
| `TeamCarousel.svelte` | Horizontal scroll mechanics |
| Botanical SVG animations | MorphSVG plugin, complex timelines |

### Phase 7: CMS Integration (Depends on Phase 1-6)

| Component | Rationale |
|-----------|-----------|
| Sanity client setup | All sections need data |
| `+page.server.ts` data loading | Homepage needs CMS data |
| Schema types alignment | Props must match CMS structure |

---

## Scalability Considerations

| Concern | Current (Single Page) | Future (Multi-Page) |
|---------|----------------------|---------------------|
| Animation memory | Kill ScrollTriggers on section unmount | Kill all on page navigation |
| Bundle size | Tree-shake unused GSAP plugins | Code-split per route |
| Data loading | Single `+page.server.ts` load | Add case studies, blog routes |
| State management | Global stores work fine | May need route-specific contexts |
| Build time | Fast (few pages) | Consider ISR for dynamic routes |

---

## Sources

### Official Documentation (HIGH Confidence)
- [SvelteKit Project Structure](https://svelte.dev/docs/kit/project-structure)
- [SvelteKit Single-Page Apps](https://svelte.dev/docs/kit/single-page-apps)
- [Svelte 5 Runes Introduction](https://svelte.dev/blog/runes)

### Community Patterns (MEDIUM Confidence)
- [Structuring Larger SvelteKit Apps - GitHub Discussion](https://github.com/sveltejs/kit/discussions/7579)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)
- [GSAP ScrollTrigger & SvelteKit - StackBlitz](https://stackblitz.com/edit/sveltejs-kit-template-default-eddyvv)
- [Global State in Svelte 5 with Runes](https://mainmatter.com/blog/2025/03/11/global-state-in-svelte-5/)
- [SvelteKit + Sanity CMS Integration](https://www.sanity.io/sveltekit-cms)

### Animation Resources (MEDIUM Confidence)
- [GSAP MorphSVG Documentation](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/)
- [Scrolling Animation with SvelteKit](https://www.seeskou.dev/blog/scrolling-animation-sveltekit)
- [Animation with Svelte - Joy of Code](https://joyofcode.xyz/animation-with-svelte)

### Project-Specific Context (HIGH Confidence)
- v1 Archive (`/_archive/v1/index.html`) - Section structure reference
- CLAUDE.md - Known patterns and gotchas from v1
