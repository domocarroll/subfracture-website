# Domain Pitfalls: SvelteKit + GSAP Editorial Websites

**Domain:** Editorial portfolio website with complex animations
**Researched:** 2026-02-05
**Confidence:** HIGH (verified against official GSAP docs, Svelte 5 docs, and v1 project experience)

---

## Critical Pitfalls

Mistakes that cause rewrites or major issues. Address these in early phases.

---

### Pitfall 1: ScrollTrigger Route Change Breakage

**What goes wrong:** ScrollTrigger instances from previous routes persist and calculate positions incorrectly after SvelteKit navigation. On the second route, triggers don't fire or fire at wrong positions. If user navigates without scrolling first, ScrollTrigger may not work at all.

**Why it happens:** SvelteKit's client-side routing doesn't unmount the page in a traditional sense. ScrollTrigger caches element positions at creation time, and those positions become stale after route changes.

**Consequences:**
- Animations don't trigger on subsequent page visits
- Incorrect scroll positions for animations
- Memory leaks from orphaned ScrollTrigger instances
- Performance degradation over time

**Prevention:**
1. Use `gsap.context()` for ALL animations in each component
2. Call `context.revert()` in Svelte's `onDestroy` lifecycle
3. Call `ScrollTrigger.refresh()` after route transitions complete
4. Register ScrollTrigger cleanup with SvelteKit's `beforeNavigate`

**Detection:**
- Test by navigating away and back to animated pages
- Check if animations work on second visit
- Monitor `ScrollTrigger.getAll().length` in console - should reset between routes

**Phase:** Foundation - establish cleanup patterns before building animations

**Sources:**
- [SvelteKit 2 + Svelte 5 + GSAP Route Issues](https://gsap.com/community/forums/topic/40926-sveltekit-2-svelte-5-gsap-stuck-on-scrolltrigger-not-working-as-expected-after-route-change/)
- [GSAP ScrollTrigger Tips & Mistakes](https://gsap.com/resources/st-mistakes/)

---

### Pitfall 2: Svelte 5 $effect vs onMount Confusion

**What goes wrong:** Developers use `$effect` as a drop-in replacement for `onMount`, causing animations to re-run on every reactive state change, creating duplicate/conflicting animations.

**Why it happens:** `$effect` looks similar to `onMount` but behaves differently - it re-runs whenever its dependencies change, not just on mount. The cleanup function also runs on each re-run, not just unmount.

**Consequences:**
- Multiple animation instances fighting for the same properties
- Stuttering and visual glitches
- Performance degradation
- Memory leaks from improperly cleaned animations

**Prevention:**
1. Use `onMount` for one-time animation setup, NOT `$effect`
2. If using `$effect`, use `$effect.pre` or `untrack()` to prevent re-runs
3. For element references with `bind:this`, prefer Svelte actions (`use:`) for animation attachment
4. Consider the new `@attach` directive for element-level lifecycle

**Detection:**
- Console.log inside animation setup - should only fire once
- Watch for animation "jumps" when state changes
- Check GSAP's `gsap.globalTimeline.getChildren().length` - shouldn't grow unexpectedly

**Phase:** Foundation - establish animation lifecycle patterns early

**Sources:**
- [Svelte $effect Documentation](https://svelte.dev/docs/svelte/$effect)
- [Svelte 5 $effect cleanup order issues](https://github.com/sveltejs/svelte/issues/12731)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)

---

### Pitfall 3: Animation Property Conflicts (Tween Stacking)

**What goes wrong:** Multiple animation systems (hover, scroll, idle, magnetic effects) all try to animate the same CSS properties simultaneously, causing stuttering and unpredictable behavior.

**Why it happens:** Each feature is developed independently without awareness of what other systems animate. GSAP tweens stack by default rather than replacing.

**Consequences:**
- Jerky, stuttering animations
- Properties "fighting" between values
- Inconsistent visual state
- Hard-to-debug animation bugs

**Prevention:**
1. Create a unified `AnimationState` object tracking current mode
2. Use `gsap.killTweensOf(element, 'property')` before starting new tweens
3. Add `overwrite: 'auto'` to all interactive tweens
4. Implement state machine: only one system controls an element at a time
5. Use single RAF loop for continuous effects, not multiple competing loops

**Detection:**
- Visual stuttering when multiple interactions overlap
- `gsap.globalTimeline.getChildren()` shows many tweens on same element
- CSS properties flickering between values

**Phase:** Animation System - establish state management before building features

**From v1 Experience:**
```javascript
// Pattern from v1 culture-studio-dramatics.js
const AnimationState = {
  mode: 'idle', // 'idle' | 'hover-culture' | 'hover-studio' | 'hover-space'
  canInteract: false,
  // ... centralized state
};

// Kill conflicting tweens before starting new ones
gsap.killTweensOf(element, 'color');
gsap.to(element, {
  color: '#FF2D55',
  overwrite: 'auto'
});
```

**Sources:**
- v1 Archive: `/home/dom/subfracture-website/_archive/v1/docs/CULTURE-STUDIO-ANIMATION-SYSTEM.md`

---

### Pitfall 4: SSR/Hydration Mismatch with Browser APIs

**What goes wrong:** GSAP and ScrollTrigger access `window`, `document`, and element dimensions during SSR, causing hydration errors or crashes.

**Why it happens:** SvelteKit renders pages server-side by default. GSAP is a browser-only library that expects DOM APIs.

**Consequences:**
- Build failures
- Hydration mismatches
- "window is not defined" errors
- Inconsistent state between server and client render

**Prevention:**
1. Guard all GSAP code with `browser` check from `$app/environment`
2. Register GSAP plugins at module level (not in onMount) but wrap in browser check
3. Use dynamic imports for heavy animation modules
4. Consider `ssr: false` for specific routes with complex animations (last resort)

**Detection:**
- Build errors mentioning `window` or `document`
- Console hydration warnings
- Content flashing on initial load

**Phase:** Foundation - establish SSR-safe patterns first

**Code Pattern:**
```typescript
// In animate.ts or animation utility
import { browser } from '$app/environment';

let gsap: typeof import('gsap').gsap;
let ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;

if (browser) {
  const gsapModule = await import('gsap');
  const stModule = await import('gsap/ScrollTrigger');
  gsap = gsapModule.gsap;
  ScrollTrigger = stModule.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
}
```

**Sources:**
- [SvelteKit GSAP Integration](https://gsap.com/community/forums/topic/29122-sveltekit-with-gsap-and-scrolltrigger/)

---

### Pitfall 5: Horizontal Scroll Section Complexity

**What goes wrong:** Horizontal scroll sections interact poorly with pinned elements, other ScrollTriggers, and fixed overlays. Nested ScrollTriggers break. Mobile experience is janky.

**Why it happens:** Horizontal scroll requires pinning a container while translating content inside it. This affects document flow and other ScrollTrigger calculations.

**Consequences:**
- Other ScrollTriggers calculate positions incorrectly
- Fixed overlays conflict with horizontal scroll
- Mobile touch scrolling feels broken
- Fast scrolling breaks the effect

**Prevention:**
1. Create horizontal scroll ScrollTriggers in correct DOM order OR use `refreshPriority`
2. Never nest ScrollTriggers inside horizontal scroll sections
3. Use `position: fixed` for pinning on mobile (check for transform on container)
4. Keep horizontal sections isolated - don't mix with other pinned elements
5. Test with fast scrolling - may need to debounce

**Detection:**
- Horizontal scroll doesn't start/end at right positions
- Other sections "jump" when horizontal scroll completes
- Touch scrolling feels unnatural on mobile

**Phase:** Services Section - treat as high-complexity feature requiring dedicated attention

**Sources:**
- [GSAP ScrollTrigger Horizontal Scroll](https://gsap.com/community/forums/topic/40637-question-about-horizontal-scroll-section/)
- [GSAP Most Common ScrollTrigger Mistakes](https://gsap.com/resources/st-mistakes/)

---

## Moderate Pitfalls

Mistakes that cause delays or technical debt.

---

### Pitfall 6: SVG Transform-Origin Browser Inconsistencies

**What goes wrong:** SVG rotations and scales transform from unexpected origins. Firefox ignores percentage-based transform-origin. Safari has zooming bugs.

**Why it happens:** SVG spec defines transform-origin relative to parent SVG canvas, not the element itself. Browser implementations vary wildly.

**Prevention:**
1. Always set `transformOrigin` explicitly via GSAP, not CSS
2. Use pixel values, not percentages for SVG transform-origin
3. For rotation, position element at desired origin first
4. Add `rotation: 0.01` to force GPU acceleration and fix Chrome rendering
5. Test in Firefox specifically - it's the most different

**Detection:**
- Rotations pivot from wrong point
- Scale transforms "jump" on animation start
- Cross-browser visual differences

**Phase:** Hero/Branding - when implementing SVG animations

**Sources:**
- [GSAP SVG Animation Guide](https://gsap.com/resources/svg/)

---

### Pitfall 7: ScrollTrigger .from() Issues

**What goes wrong:** `gsap.from()` with ScrollTrigger doesn't detect destination values correctly, causing elements to appear in wrong state.

**Why it happens:** GSAP's `from()` tween needs to know the "to" values, which it reads from current element state. With ScrollTrigger, timing of when this happens can be unpredictable.

**Prevention:**
1. Use `gsap.fromTo()` instead of `gsap.from()` with ScrollTrigger
2. If using `from()`, add `immediateRender: false`
3. Set explicit starting styles in CSS

**Detection:**
- Elements appear in "animated" state before animation starts
- Animation seems to play backwards on scroll

**Phase:** All animation phases - establish pattern early

**Sources:**
- [Svelte ScrollTrigger and from()](https://gsap.com/community/forums/topic/31129-svelte-scrolltrigger-and-from/)

---

### Pitfall 8: Mobile Animation Performance

**What goes wrong:** Animations that work beautifully on desktop become janky, laggy, or drain battery on mobile devices.

**Why it happens:** Mobile GPUs and CPUs are significantly less powerful. Blur filters, complex SVG animations, and too many simultaneous tweens overwhelm mobile hardware.

**Prevention:**
1. Use only GPU-accelerated properties: `transform` and `opacity`
2. Reduce animation complexity at mobile breakpoints
3. Disable blur/filter animations on mobile entirely
4. Use `@media (prefers-reduced-motion)` for user preference
5. Limit simultaneous animations - batch and stagger
6. Test on real mobile devices, not just DevTools emulation

**Detection:**
- Stuttering animations on mobile
- High CPU usage / battery drain
- Frame drops visible in Performance panel

**Phase:** Every phase - test mobile after each animation addition

**From v1 Experience:**
```javascript
// From v1 documentation:
// "Generally, mobile devices like phones and tablets don't have
// the same level of GPUs and CPUs found on desktops"

// Reduce at mobile:
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) {
  // Simpler animations, fewer particles, no blur
}
```

**Sources:**
- [Mobile Animation Best Practices](https://www.vev.design/blog/mobile-friendly-website-design/)

---

### Pitfall 9: Page Refresh During Scroll

**What goes wrong:** When user refreshes the page while scrolled down, elements have incorrect bounding box dimensions at onMount time, causing ScrollTrigger positions to be wrong.

**Why it happens:** On page refresh, the browser may restore scroll position before images load or layout completes. onMount fires with partial layout information.

**Prevention:**
1. Call `ScrollTrigger.refresh()` after images load
2. Use `ScrollTrigger.refresh()` in `afterNavigate` hook
3. Consider `scrollRestoration: 'manual'` in SvelteKit config
4. Add scroll position check before animating: `scrollY > threshold`

**Detection:**
- Animations work on initial load but break on refresh
- Elements animate from wrong positions after refresh
- Issues only appear when refreshing while scrolled down

**Phase:** Foundation - establish refresh handling pattern

**From Project CLAUDE.md:**
```
// Known gotcha from v1:
// "ScrollTrigger can fire on page load - always check scrollY > threshold before animating"
```

---

### Pitfall 10: Hard-Coded Animation Values

**What goes wrong:** Animation distances, positions, and timing are hard-coded and don't adapt to viewport size changes, causing broken layouts on resize.

**Why it happens:** Values are calculated once at ScrollTrigger creation and not updated.

**Prevention:**
1. Use function-based values: `start: () => "top " + (50 + someCalculation) + "%"`
2. Set `invalidateOnRefresh: true` on ScrollTriggers
3. Recalculate values on resize with debounced handler
4. Use relative units (%, vh, vw) where possible

**Detection:**
- Resize window - animations don't adapt
- Mobile/desktop layout differences cause animation problems

**Phase:** All phases - establish pattern from start

**Sources:**
- [GSAP ScrollTrigger Tips & Mistakes](https://gsap.com/resources/st-mistakes/)

---

## Minor Pitfalls

Mistakes that cause annoyance but are fixable.

---

### Pitfall 11: Missing Reduced Motion Support

**What goes wrong:** Users with vestibular disorders experience discomfort from motion-heavy animations.

**Prevention:**
1. Check `prefers-reduced-motion` media query
2. Provide alternative subtle animations or instant transitions
3. Make it a utility function used everywhere

**Phase:** Foundation - add utility function early

```typescript
// From v1 pattern:
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

---

### Pitfall 12: Inconsistent Easing Across Animations

**What goes wrong:** Different animations use different easing functions without design intent, creating a disjointed feel.

**Prevention:**
1. Define easing constants in a shared config
2. Map semantic meaning to easing: `easings.organic`, `easings.mechanical`
3. Document when to use each easing

**Phase:** Design System - before heavy animation implementation

---

### Pitfall 13: ScrollTrigger Import Errors

**What goes wrong:** SyntaxError when importing ScrollTrigger, especially in Vite/SvelteKit environments.

**Prevention:**
1. Import from `gsap/ScrollTrigger` not `gsap/dist/ScrollTrigger`
2. Register plugin before using: `gsap.registerPlugin(ScrollTrigger)`
3. Do registration at module level (not in component)

**Phase:** Foundation - setup correct imports from start

---

### Pitfall 14: CMS Integration Too Early

**What goes wrong:** Frontend components and animations are built tightly coupled to CMS data shapes, requiring major refactoring when CMS schema changes.

**Prevention:**
1. Build all frontend components with static data first
2. Define TypeScript interfaces for expected data shapes
3. Add CMS integration last, adapting CMS to match frontend expectations
4. Use adapter layer between CMS and components

**Phase:** CMS Integration - explicitly defer to late phase

**Sources:**
- [Sanity SvelteKit Integration Best Practices](https://chrisjayden.com/articles/sveltekit-sanity-v3)

---

### Pitfall 15: overflow:hidden + perspective Conflict

**What goes wrong:** 3D CSS transforms (with `perspective`) are flattened when parent has `overflow: hidden`.

**Why it happens:** CSS spec explicitly flattens 3D context when `overflow` is not `visible`.

**Prevention:**
1. Don't combine `overflow: hidden` with `perspective` in the same context
2. Use `clip-path` instead of `overflow: hidden` if 3D is needed
3. Restructure DOM to separate overflow and perspective concerns

**Phase:** Hero/Any 3D - when implementing perspective effects

**From Project CLAUDE.md:**
```
// Known gotcha from v1:
// "`overflow: hidden` + `perspective` are CSS-incompatible (spec flattens 3D)"
```

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|----------------|------------|
| Foundation | SSR/Hydration errors | Establish browser guards and dynamic imports immediately |
| Foundation | $effect misuse | Document onMount vs $effect difference in coding standards |
| Animation System | Tween stacking conflicts | Build unified AnimationState pattern before adding features |
| Hero Section | SVG transform-origin | Test rotation/scale in Firefox early |
| Services (Horizontal) | ScrollTrigger order conflicts | Isolate horizontal section, use refreshPriority |
| Mobile Polish | Performance degradation | Test on real device after each phase, not just at end |
| CMS Integration | Data shape coupling | Don't start until all animations work with static data |
| Route Transitions | ScrollTrigger cleanup | Test navigation patterns throughout development |

---

## Quick Prevention Checklist

Before implementing any animation feature:

- [ ] Is this guarded with `browser` check for SSR?
- [ ] Am I using `onMount` (not `$effect`) for one-time setup?
- [ ] Am I using `gsap.context()` for cleanup?
- [ ] Will this conflict with other animations on same element?
- [ ] Does this use only `transform` and `opacity` for performance?
- [ ] Have I tested on mobile device (not emulator)?
- [ ] Does this respect `prefers-reduced-motion`?
- [ ] Is `fromTo()` used instead of `from()` with ScrollTrigger?
- [ ] Are values dynamic (not hard-coded) for resize handling?

---

## Sources Summary

### Official Documentation (HIGH confidence)
- [GSAP ScrollTrigger Tips & Mistakes](https://gsap.com/resources/st-mistakes/)
- [GSAP SVG Animation Guide](https://gsap.com/resources/svg/)
- [Svelte $effect Documentation](https://svelte.dev/docs/svelte/$effect)

### Community/GitHub (MEDIUM confidence)
- [SvelteKit + GSAP Route Issues](https://gsap.com/community/forums/topic/40926-sveltekit-2-svelte-5-gsap-stuck-on-scrolltrigger-not-working-as-expected-after-route-change/)
- [Svelte 5 $effect cleanup issues](https://github.com/sveltejs/svelte/issues/12731)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)

### Project Experience (HIGH confidence)
- v1 Archive: `CULTURE-STUDIO-ANIMATION-SYSTEM.md` - Animation conflicts lesson learned
- v1 Archive: `REFACTOR_PLAN.md` - Module lifecycle patterns
- Project CLAUDE.md - Known gotchas from v1 (ScrollTrigger on load, overflow+perspective)
