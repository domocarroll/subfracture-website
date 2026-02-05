# Phase 2: Navigation & Layout Structure - Research

**Researched:** 2026-02-05
**Domain:** Navigation components, scroll-based interactions, accessibility
**Confidence:** HIGH

## Summary

This phase implements the persistent navigation system with sticky header, mobile menu, and scroll progress indicator. The research confirms that no additional libraries are needed - GSAP ScrollTrigger (already installed) handles all scroll-based behaviors, and Svelte 5's `<svelte:window>` provides SSR-safe scroll position binding.

The navigation follows the "Disclosure pattern" for accessibility rather than complex ARIA menu roles. This pattern is simpler, more robust, and follows WCAG guidelines while avoiding common implementation pitfalls. The scroll progress indicator uses GSAP's `scrub` feature linked to document height.

**Primary recommendation:** Build a single `Navigation.svelte` component with mobile toggle using the Disclosure pattern, GSAP for show/hide on scroll direction, and a separate `ScrollProgress.svelte` for the progress bar.

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GSAP | 3.x | Scroll direction detection, animations | Already in project, ScrollTrigger handles all scroll behaviors |
| Svelte 5 | 5.x | Component framework with $state runes | Native `<svelte:window bind:scrollY>` for SSR-safe scroll tracking |
| Tailwind CSS 4 | 4.x | Styling | Already configured with design tokens |

### Supporting (No Installation Needed)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| `svelte/transition` | Mobile menu slide animation | Built-in, SSR-safe transitions |
| `$lib/utils/gsap.ts` | GSAP initialization | Already created in Phase 1 |
| `$lib/utils/motion.ts` | Reduced motion detection | Already created in Phase 1 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GSAP direction detection | Intersection Observer | IO is simpler but can't detect scroll direction as cleanly |
| Svelte transitions | GSAP for menu | Svelte transitions are SSR-safe by default, simpler |
| Custom scroll tracking | scroll-timeline CSS | Not supported in all browsers yet (Safari 16.4+ only) |

**Installation:**
```bash
# No additional packages needed - all dependencies from Phase 1
```

## Architecture Patterns

### Recommended Component Structure
```
src/lib/components/
├── navigation/
│   ├── Navigation.svelte      # Main nav with mobile toggle
│   ├── NavLink.svelte         # Individual nav link with active state
│   ├── MobileMenu.svelte      # Slide-out mobile menu content
│   └── ScrollProgress.svelte  # Scroll progress indicator bar
└── layout/
    └── Footer.svelte          # Site footer
```

### Pattern 1: Sticky Navigation with Auto-Hide
**What:** Navigation bar that hides on scroll down, shows on scroll up
**When to use:** Long-form content pages where nav would obstruct reading
**Example:**
```typescript
// Source: https://gsap.com/community/forums/topic/27672-scrolltrigger-showhide-navbar-on-scroll-upscroll-down/
import { browser } from '$app/environment';
import { initGSAP } from '$lib/utils/gsap';

let isVisible = $state(true);
let lastScrollY = 0;

async function setupScrollBehavior() {
  if (!browser) return;

  const gsap = await initGSAP();
  if (!gsap) return;

  const { ScrollTrigger } = await import('gsap/ScrollTrigger');

  ScrollTrigger.create({
    start: 'top -80', // After scrolling 80px
    end: 'max',
    onUpdate: (self) => {
      // direction: 1 = down, -1 = up
      isVisible = self.direction === -1;
    }
  });
}
```

### Pattern 2: Scroll Progress Bar with Scrub
**What:** Progress bar that fills based on scroll position through page
**When to use:** Editorial/long-form content to show reading progress
**Example:**
```typescript
// Source: https://gsap.com/docs/v3/Plugins/ScrollTrigger
ScrollTrigger.create({
  trigger: 'body',
  start: 'top top',
  end: 'bottom bottom',
  scrub: true, // Directly linked to scroll position
  onUpdate: (self) => {
    progress = self.progress; // 0 to 1
  }
});
```

### Pattern 3: Mobile Menu with Disclosure Pattern
**What:** Hamburger button that toggles mobile navigation visibility
**When to use:** All mobile viewports
**Example:**
```svelte
<!-- Source: https://a11ymatters.com/pattern/mobile-nav/ -->
<button
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
  aria-label={isOpen ? 'Close menu' : 'Open menu'}
  class="touch-target"
  onclick={() => isOpen = !isOpen}
>
  <span class="sr-only">{isOpen ? 'Close' : 'Menu'}</span>
  <!-- Hamburger icon -->
</button>

{#if isOpen}
  <nav id="mobile-menu" transition:slide>
    <!-- Links -->
  </nav>
{/if}
```

### Pattern 4: SSR-Safe Scroll Binding
**What:** Using Svelte's `<svelte:window>` for scroll position
**When to use:** Any scroll-dependent state that needs to be SSR-safe
**Example:**
```svelte
<!-- Source: https://svelte.dev/docs/svelte/svelte-window -->
<script>
  let scrollY = $state(0);

  // scrollY is automatically 0 on server, bound to actual value on client
</script>

<svelte:window bind:scrollY />

<nav class:scrolled={scrollY > 0}>
  <!-- Nav content -->
</nav>
```

### Anti-Patterns to Avoid
- **Adding `aria-hidden` with `display: none`:** Redundant - `display: none` already hides from AT
- **Using `role="menu"` for navigation:** Menu role is for application menus, not site navigation
- **Forgetting ScrollTrigger cleanup:** MUST kill ScrollTrigger instances on component destroy
- **Using window.scrollY directly:** Not SSR-safe, use `<svelte:window bind:scrollY>` instead
- **Animation without reduced motion check:** Always respect `prefersReducedMotion()`

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll direction detection | Manual scroll event listeners | GSAP ScrollTrigger `direction` | Debouncing, performance, cleanup handled |
| Mobile menu animation | Custom CSS transitions | `svelte/transition` slide | SSR-safe, proper lifecycle |
| Touch target sizing | Manual CSS | Tailwind `min-h-11 min-w-11` | 44x44px is the standard, use utility |
| Progress bar animation | requestAnimationFrame loop | ScrollTrigger `scrub` | Direct binding, no jank |
| Keyboard trap in menu | Custom focus management | Focus-visible + proper DOM order | Browser handles it with semantic HTML |

**Key insight:** Svelte's built-in transitions and GSAP ScrollTrigger cover all animation needs. The main complexity is accessibility, which is solved by using semantic HTML and the Disclosure pattern rather than complex ARIA.

## Common Pitfalls

### Pitfall 1: ScrollTrigger Memory Leak on Navigation
**What goes wrong:** ScrollTrigger instances persist after navigating away, causing duplicate triggers
**Why it happens:** GSAP's global plugin registration survives Svelte component lifecycle
**How to avoid:** Store ScrollTrigger reference and kill in cleanup
```typescript
let scrollTriggerRef: ScrollTrigger | null = null;

onMount(async () => {
  // ... setup
  scrollTriggerRef = ScrollTrigger.create({ ... });
});

onDestroy(() => {
  scrollTriggerRef?.kill();
  scrollTriggerRef = null;
});
```
**Warning signs:** Animations trigger multiple times, console shows duplicate ScrollTriggers

### Pitfall 2: Flash of Unstyled Content (FOUC) with Mobile Menu
**What goes wrong:** Menu briefly visible on page load before JavaScript hydrates
**Why it happens:** SSR renders menu as open, JS toggles closed after hydration
**How to avoid:** Default menu state to closed, use CSS to hide until mounted
```svelte
<script>
  let isOpen = $state(false);
  let mounted = $state(false);

  onMount(() => { mounted = true; });
</script>

<nav class:js-ready={mounted}>
```
**Warning signs:** Menu flashes open on page load, especially on slower connections

### Pitfall 3: Scroll Position Doesn't Reset on Navigation
**What goes wrong:** Navigating to new page keeps old scroll position
**Why it happens:** SvelteKit preserves scroll for back/forward but sometimes misbehaves
**How to avoid:** SvelteKit handles this by default; if issues arise, use `$app/navigation` afterNavigate
**Warning signs:** Users start mid-page on fresh navigation

### Pitfall 4: Touch Target Too Small on Mobile
**What goes wrong:** Users can't reliably tap hamburger menu
**Why it happens:** Visual icon is 24px, but touch target must be 44x44px minimum
**How to avoid:** Use Tailwind's `min-h-11 min-w-11` (44px) even if icon is smaller
```svelte
<button class="min-h-11 min-w-11 flex items-center justify-center">
  <svg class="h-6 w-6"><!-- 24px icon --></svg>
</button>
```
**Warning signs:** User complaints, Lighthouse accessibility warnings

### Pitfall 5: Reduced Motion Not Respected
**What goes wrong:** Animations play for users who have motion sensitivity
**Why it happens:** Forgot to check `prefersReducedMotion()` before animating
**How to avoid:** Use `$lib/utils/motion.ts` utilities for all animations
```typescript
import { prefersReducedMotion } from '$lib/utils/motion';

const duration = prefersReducedMotion() ? 0 : 0.3;
```
**Warning signs:** No instant fallback when system prefers-reduced-motion is enabled

## Code Examples

Verified patterns from official sources:

### Navigation Component Base Structure
```svelte
<!-- Source: Synthesized from Svelte 5 docs + accessibility research -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { slide } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { initGSAP } from '$lib/utils/gsap';
  import { prefersReducedMotion } from '$lib/utils/motion';

  // State
  let isMenuOpen = $state(false);
  let isNavVisible = $state(true);
  let scrollY = $state(0);

  // ScrollTrigger reference for cleanup
  let scrollTriggerRef: ScrollTrigger | null = null;

  // Toggle menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  // Close menu on escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMenuOpen) {
      isMenuOpen = false;
    }
  }

  onMount(async () => {
    if (!browser) return;

    const gsap = await initGSAP();
    if (!gsap) return;

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    scrollTriggerRef = ScrollTrigger.create({
      start: 'top -80',
      end: 'max',
      onUpdate: (self) => {
        isNavVisible = self.direction === -1 || scrollY < 80;
      }
    });
  });

  onDestroy(() => {
    scrollTriggerRef?.kill();
    scrollTriggerRef = null;
  });
</script>

<svelte:window bind:scrollY onkeydown={handleKeydown} />

<header
  class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
  class:translate-y-[-100%]={!isNavVisible}
  class:translate-y-0={isNavVisible}
>
  <nav aria-label="Main navigation">
    <!-- Desktop nav links -->
    <div class="hidden md:flex">
      <a href="/">Home</a>
      <a href="/work">Work</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>

    <!-- Mobile menu button -->
    <button
      class="md:hidden min-h-11 min-w-11 flex items-center justify-center"
      aria-expanded={isMenuOpen}
      aria-controls="mobile-menu"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      onclick={toggleMenu}
    >
      <span class="sr-only">{isMenuOpen ? 'Close' : 'Menu'}</span>
      <!-- Icon here -->
    </button>
  </nav>

  <!-- Mobile menu -->
  {#if isMenuOpen}
    <div
      id="mobile-menu"
      class="md:hidden"
      transition:slide={{ duration: prefersReducedMotion() ? 0 : 300 }}
    >
      <a href="/">Home</a>
      <a href="/work">Work</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>
  {/if}
</header>
```

### Scroll Progress Component
```svelte
<!-- Source: GSAP ScrollTrigger docs -->
<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount, onDestroy } from 'svelte';
  import { initGSAP } from '$lib/utils/gsap';

  let progress = $state(0);
  let scrollTriggerRef: ScrollTrigger | null = null;

  onMount(async () => {
    if (!browser) return;

    const gsap = await initGSAP();
    if (!gsap) return;

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    scrollTriggerRef = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress = self.progress;
      }
    });
  });

  onDestroy(() => {
    scrollTriggerRef?.kill();
    scrollTriggerRef = null;
  });
</script>

<div
  class="fixed top-0 left-0 h-1 bg-primary z-[60]"
  style="width: {progress * 100}%"
  role="progressbar"
  aria-valuenow={Math.round(progress * 100)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Reading progress"
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `role="menu"` for nav | Disclosure pattern | 2020+ | Simpler, fewer ARIA bugs |
| Stores for state | $state rune | Svelte 5 (2024) | Direct reactivity, no subscribe |
| onMount for scroll | <svelte:window bind:scrollY> | Always | SSR-safe by default |
| Spring stores | Spring class | Svelte 5.8 | Class-based API |
| aria-hidden with display:none | Just display:none | Always | display:none is sufficient |

**Deprecated/outdated:**
- `$$props` and `$$restProps`: Use `$props()` with rest syntax in Svelte 5
- `on:click` syntax: Use `onclick` in Svelte 5
- `<slot>`: Use `{@render children()}` in Svelte 5
- Legacy spring/tweened stores: Use Spring/Tween classes

## Open Questions

None identified - this is a well-established pattern with clear solutions.

## Sources

### Primary (HIGH confidence)
- `/websites/svelte_dev` - <svelte:window>, transitions, use: actions, $state rune
- `/websites/gsap_v3` - ScrollTrigger direction, onUpdate, scrub
- Svelte MCP - svelte/motion with prefersReducedMotion

### Secondary (MEDIUM confidence)
- [GSAP Community Forums](https://gsap.com/community/forums/topic/27672-scrolltrigger-showhide-navbar-on-scroll-upscroll-down/) - Show/hide navbar pattern
- [A11y Matters - Mobile Nav](https://a11ymatters.com/pattern/mobile-nav/) - Disclosure pattern
- [MDN ARIA menu role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/menu_role) - When NOT to use menu role
- [Eastern Standard - ARIA](https://www.easternstandard.com/blog/which-aria-attributes-should-i-use-accessibility-and-aria-tags-for-common-ui-patterns/) - aria-expanded patterns
- [Level Access](https://www.levelaccess.com/blog/accessible-navigation-menus-pitfalls-and-best-practices/) - Navigation accessibility best practices

### Tertiary (LOW confidence)
- None - all patterns verified with authoritative sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, all patterns use existing Phase 1 infrastructure
- Architecture: HIGH - Disclosure pattern is well-documented, GSAP patterns verified
- Pitfalls: HIGH - ScrollTrigger cleanup is documented in Phase 1 research, accessibility patterns from authoritative sources

**Research date:** 2026-02-05
**Valid until:** 2026-03-05 (30 days - stable patterns)
