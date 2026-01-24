# Subfracture Main.js Refactoring Plan

## Executive Summary

Refactor the 2,321-line `main.js` monolith into modular ES6 components using `gsap.context()` for lifecycle management. This enables cleaner code organization, proper animation cleanup, HMR support, and easier maintenance.

---

## Current State Analysis

### Metrics
- **Total Lines:** 2,321
- **Functions:** 29 defined
- **Largest Function:** `initSemanticText()` at 612 lines
- **External Dependencies:** gsap, ScrollTrigger, 5 external modules
- **Shared Utility:** `prefersReducedMotion()` used by 14+ functions

### Existing External Modules (Good Patterns)
These demonstrate the target pattern:
- `cursor.js` (324 lines) - Clean lifecycle
- `culture-studio-dramatics.js` (1,352 lines) - Unified state pattern
- `footer-dramatics.js` (289 lines) - Exported init/destroy
- `vision-controller.js` (310 lines) - Class-based with lifecycle

---

## Target Architecture

```
assets/js/
├── main.js                     # Entry point (~120 lines)
├── core/
│   ├── gsap-config.js          # Plugin registration, global defaults
│   ├── utils.js                # prefersReducedMotion, splitText, ready
│   ├── lifecycle.js            # gsap.context() management, visibility
│   └── registry.js             # Module registration for init queue
├── features/
│   ├── hero/
│   │   ├── index.js            # Exports init/destroy for hero group
│   │   ├── parallax.js
│   │   ├── lightbox.js
│   │   └── play-cursor.js
│   ├── navigation/
│   │   ├── index.js
│   │   ├── sticky-nav.js
│   │   └── clocks.js
│   ├── reveals/
│   │   ├── index.js
│   │   ├── scroll-batch.js     # .reveal, .reveal-stagger batches
│   │   ├── character-reveal.js
│   │   └── clip-path.js
│   ├── semantic/
│   │   ├── index.js            # Orchestrator
│   │   ├── processor.js        # DOM wrapping
│   │   ├── registry.js         # Word-to-animation mappings
│   │   └── animations/         # One file per animation type (~25 files)
│   │       ├── wave.js
│   │       ├── pulse-warm.js
│   │       ├── system-pulse.js
│   │       └── ...
│   ├── sections/
│   │   ├── index.js
│   │   ├── services.js         # Horizontal scroll theatre
│   │   ├── approach.js         # Pillar animations
│   │   ├── fight.js            # Transformation sequence
│   │   └── clients.js          # Lips reveal animation
│   ├── decorative/
│   │   ├── index.js
│   │   ├── floating-artwork.js
│   │   ├── orb-animation.js
│   │   └── scroll-progress.js
│   └── micro/
│       ├── index.js
│       ├── magnetic.js
│       ├── card-tilt.js
│       └── link-underlines.js
├── cursor.js                   # (existing)
├── culture-studio-dramatics.js # (existing)
├── footer-dramatics.js         # (existing)
├── init-footer-upgrade.js      # (existing)
├── reading-spotlight.js        # (existing)
├── vision-controller.js        # (existing)
└── visions/                    # (existing)
```

---

## Module Template

Every feature module follows this pattern:

```javascript
// features/[feature]/[module].js
import { gsap, ScrollTrigger } from '../../core/gsap-config.js';
import { prefersReducedMotion } from '../../core/utils.js';

let ctx = null;

export function init(scope = document) {
  if (prefersReducedMotion()) return;

  const element = scope.querySelector('.target-element');
  if (!element) return;

  ctx = gsap.context(() => {
    // All animations defined here are automatically tracked
    gsap.to(element, { /* ... */ });

    ScrollTrigger.create({
      trigger: element,
      // ...
    });
  }, scope);
}

export function destroy() {
  ctx?.revert();  // Cleans up ALL animations and ScrollTriggers
  ctx = null;
}

// Optional: visibility handling
export function pause() {
  // Pause RAF loops, intervals, etc.
}

export function resume() {
  // Resume RAF loops, intervals, etc.
}
```

---

## Implementation Phases

### Phase 1: Core Infrastructure (Low Risk)
**Goal:** Create foundation without breaking existing code

#### Tasks:
1. Create `core/gsap-config.js`
   - Move GSAP imports and plugin registration
   - Add global defaults
   - Export for debugging in dev mode

2. Create `core/utils.js`
   - Extract `ready()` function
   - Extract `prefersReducedMotion()` function
   - Extract `splitTextToChars()` function

3. Create `core/lifecycle.js`
   - Module registry for init queue
   - Visibility change handler
   - Optional HMR cleanup

4. Update `main.js` imports to use new core modules

#### Validation:
- [ ] Site loads without errors
- [ ] All animations still work
- [ ] Console shows "Subfracture loaded" message

---

### Phase 2: Simple Extractions (Low Risk)
**Goal:** Extract independent, simple modules

#### Tasks:
1. Extract `initClocks()` → `features/navigation/clocks.js`
   - Lines 35-73 (38 lines)
   - Zero GSAP dependencies
   - Pure DOM manipulation

2. Extract `initStickyNav()` → `features/navigation/sticky-nav.js`
   - Lines 78-120 (42 lines)
   - No ScrollTrigger, just scroll listener

3. Extract `initOrbAnimation()` → `features/decorative/orb-animation.js`
   - Lines 264-298 (34 lines)
   - CSS variable manipulation only

4. Extract `initLogoMarquee()` → `features/navigation/logo-marquee.js`
   - Lines 303-351 (49 lines)
   - Self-contained

5. Extract `initScrollProgress()` → `features/decorative/scroll-progress.js`
   - Lines 731-767 (37 lines)
   - Single ScrollTrigger

#### Validation:
- [ ] Navigation still works (sticky nav, clocks)
- [ ] Orb animation pulses in intro block
- [ ] Scroll progress bar animates
- [ ] Mobile logo marquee works on narrow viewport

---

### Phase 3: Hero Section (Medium Risk)
**Goal:** Extract hero-related animations with proper cleanup

#### Tasks:
1. Extract `initHeroParallax()` → `features/hero/parallax.js`
   - Lines 125-144 (19 lines)
   - Add gsap.context() wrapper

2. Extract `initHeroLightbox()` → `features/hero/lightbox.js`
   - Lines 149-259 (110 lines)
   - Includes play cursor, lightbox modal
   - Add cleanup for RAF loop

3. Create `features/hero/index.js`
   - Exports combined init/destroy

#### Validation:
- [ ] Hero parallax scrolls correctly
- [ ] Play cursor follows mouse over video
- [ ] Lightbox opens on click
- [ ] Video pauses when lightbox opens
- [ ] ESC closes lightbox

---

### Phase 4: GSAP Animations Core (Medium Risk)
**Goal:** Extract main GSAP animation orchestration

#### Tasks:
1. Extract batched reveals → `features/reveals/scroll-batch.js`
   - `.reveal` batch animation
   - `.reveal-stagger` batch animation
   - Lines from initGSAPAnimations()

2. Extract `initFooterAnimations()` → `features/sections/footer-entrance.js`
   - Lines 504-556 (52 lines)
   - Decouple from initGSAPAnimations()

3. Extract character reveal → `features/reveals/character-reveal.js`
   - Lines 620-657 (38 lines)
   - Uses splitTextToChars()

4. Extract flow list cascade → `features/reveals/flow-cascade.js`
   - Lines 662-689 (28 lines)

5. Refactor remaining initGSAPAnimations() → orchestrator only

#### Validation:
- [ ] Section reveals animate on scroll
- [ ] Footer entrance animation triggers
- [ ] Section titles reveal character-by-character
- [ ] AI flow list cascades in sequence

---

### Phase 5: Scroll Theatre & Micro-interactions (Medium Risk)
**Goal:** Extract interaction-heavy modules

#### Tasks:
1. Extract `initScrollTheatre()` → `features/sections/services.js`
   - Lines 859-935 (76 lines)
   - Horizontal scroll + parallax depth

2. Extract `initMicroInteractions()` → `features/micro/`
   - Split into: magnetic.js, card-tilt.js, link-underlines.js
   - Lines 940-1054 (114 lines total)

3. Extract `initRevealDrama()` → `features/reveals/clip-path.js`
   - Lines 1059-1199 (140 lines)
   - Clip-path wipes, number counters

#### Validation:
- [ ] Services section horizontal scroll works (desktop)
- [ ] Magnetic button effect on hover
- [ ] Service cards tilt on hover
- [ ] Link underlines animate
- [ ] Section headers clip-path reveal
- [ ] Service numbers count up

---

### Phase 6: Semantic Text System (High Risk, High Reward)
**Goal:** Tame the 612-line monster

#### Tasks:
1. Create `features/semantic/registry.js`
   - Word-to-animation mappings
   - Frozen configuration object

2. Create `features/semantic/processor.js`
   - DOM wrapping logic
   - innerHTML manipulation

3. Extract animations to individual files:
   - `animations/wave.js`
   - `animations/pulse-warm.js`
   - `animations/embrace.js`
   - `animations/shimmer.js`
   - `animations/impact.js`
   - `animations/fade-strike.js`
   - `animations/slide.js`
   - `animations/drift.js`
   - `animations/spread.js`
   - `animations/tilt.js`
   - `animations/stretch.js`
   - `animations/gather.js`
   - `animations/breathe.js`
   - `animations/warm-glow.js` (DANNI)
   - `animations/system-pulse.js` (SubFrac.OS)
   - `animations/pre-extend.js`
   - `animations/echo-trail.js`
   - `animations/grow-wise.js`
   - `animations/rest-fade.js`
   - `animations/tension-release.js`
   - `animations/curtain-part.js`
   - `animations/tessellate.js`
   - `animations/deep-glow.js`
   - `animations/gravity-settle.js`

4. Extract AI conversation → `features/semantic/ai-conversation.js`
   - initAIFlowSequence()
   - initAIConversation()
   - startVisualConversation()

5. Extract fight transformation → `features/sections/fight.js`
   - initFightTransformation()

6. Create `features/semantic/index.js`
   - Orchestrates all semantic functionality

#### Validation:
- [ ] Semantic words animate on scroll
- [ ] DANNI warm-glow breathing effect
- [ ] SubFrac.OS digital pulse effect
- [ ] AI conversation ping-pong animation
- [ ] Fight section enemy/virtue transformation
- [ ] Phrase orchestrations still work

---

### Phase 7: Remaining Sections (Low-Medium Risk)
**Goal:** Extract remaining section-specific animations

#### Tasks:
1. Extract `initClientsReveal()` → `features/sections/clients.js`
   - Lines 2027-2089 (63 lines)

2. Extract `initFloatingArtwork()` → `features/decorative/floating-artwork.js`
   - Lines 793-854 (62 lines)

3. Extract approach pillars → `features/sections/approach.js`
   - From initGSAPAnimations()

4. Extract phrase orchestrations → `features/semantic/phrases.js`
   - orchestrateSustainedCollectivePretending()
   - orchestrateArtAndSystems()

#### Validation:
- [ ] Clients banner lips spread on scroll
- [ ] Floating artwork parallax + mouse movement
- [ ] Approach pillars reveal with rotation
- [ ] Phrase orchestrations for key content

---

### Phase 8: Final Cleanup & HMR (Low Risk)
**Goal:** Polish and enable development features

#### Tasks:
1. Reduce main.js to orchestrator only (~120 lines)

2. Add HMR support:
```javascript
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    destroyAll();
  });
}
```

3. Add development debugging:
   - Performance timing logs
   - Animation registry inspector

4. Update any remaining hardcoded imports

5. Documentation:
   - Update this plan with completion status
   - Add JSDoc comments to public APIs

#### Validation:
- [ ] Full site functionality identical to before refactor
- [ ] HMR works without animation duplication
- [ ] No console errors
- [ ] Build size is similar or smaller

---

## Risk Assessment & Mitigation

### High Risk Areas

| Risk | Impact | Mitigation |
|------|--------|------------|
| Semantic text DOM manipulation | Breaks text display | Test each animation individually |
| ScrollTrigger cleanup | Memory leaks, duplicate triggers | Use gsap.context() everywhere |
| Init order dependencies | Animations don't fire | Maintain current init order in registry |
| Footer animation coupling | Footer breaks | Extract before decoupling |

### Rollback Strategy

1. Work in a feature branch: `refactor/modular-gsap`
2. Each phase is a separate commit
3. If phase fails validation, revert that commit
4. Keep original main.js as `main.js.backup` until complete

---

## Success Criteria

### Functional
- [ ] All animations work identically to before
- [ ] No console errors
- [ ] Reduced motion preference respected
- [ ] Mobile experience unchanged

### Code Quality
- [ ] No file exceeds 200 lines (except semantic/processor.js)
- [ ] Each module has init() and destroy() exports
- [ ] All gsap.context() wrappers in place
- [ ] No circular dependencies (ESLint check)

### Developer Experience
- [ ] HMR works without animation duplication
- [ ] Clear module boundaries
- [ ] Easy to find specific animation code
- [ ] main.js is under 150 lines

---

## Estimated Effort

| Phase | Complexity | Estimated Time |
|-------|------------|----------------|
| Phase 1: Core Infrastructure | Low | 1-2 hours |
| Phase 2: Simple Extractions | Low | 2-3 hours |
| Phase 3: Hero Section | Medium | 2-3 hours |
| Phase 4: GSAP Animations Core | Medium | 3-4 hours |
| Phase 5: Scroll Theatre & Micro | Medium | 3-4 hours |
| Phase 6: Semantic Text System | High | 4-6 hours |
| Phase 7: Remaining Sections | Low-Medium | 2-3 hours |
| Phase 8: Final Cleanup & HMR | Low | 1-2 hours |

**Total: 18-27 hours** (spread across multiple sessions recommended)

---

## Quick Reference: Function Locations

| Function | Current Location | Target Module |
|----------|-----------------|---------------|
| `ready()` | main.js:24-27 | core/utils.js |
| `prefersReducedMotion()` | main.js:29-30 | core/utils.js |
| `initClocks()` | main.js:35-73 | features/navigation/clocks.js |
| `initStickyNav()` | main.js:78-120 | features/navigation/sticky-nav.js |
| `initHeroParallax()` | main.js:125-144 | features/hero/parallax.js |
| `initHeroLightbox()` | main.js:149-259 | features/hero/lightbox.js |
| `initOrbAnimation()` | main.js:264-298 | features/decorative/orb-animation.js |
| `initLogoMarquee()` | main.js:303-351 | features/navigation/logo-marquee.js |
| `initGSAPAnimations()` | main.js:356-502 | features/reveals/ (split) |
| `initFooterAnimations()` | main.js:504-556 | features/sections/footer-entrance.js |
| `splitTextToChars()` | main.js:567-615 | core/utils.js |
| `initCharacterReveal()` | main.js:620-657 | features/reveals/character-reveal.js |
| `initFlowListCascade()` | main.js:662-689 | features/reveals/flow-cascade.js |
| `initFooterEmergence()` | main.js:694-726 | (merged with footer-entrance) |
| `initScrollProgress()` | main.js:731-767 | features/decorative/scroll-progress.js |
| `initPremiumAnimations()` | main.js:772-788 | (becomes orchestrator call) |
| `initFloatingArtwork()` | main.js:793-854 | features/decorative/floating-artwork.js |
| `initScrollTheatre()` | main.js:859-935 | features/sections/services.js |
| `initMicroInteractions()` | main.js:940-1054 | features/micro/ (split) |
| `initRevealDrama()` | main.js:1059-1199 | features/reveals/clip-path.js |
| `initSemanticText()` | main.js:1205-1816 | features/semantic/ (split) |
| `initAIFlowSequence()` | main.js:1819-1866 | features/semantic/ai-conversation.js |
| `initAIConversation()` | main.js:1869-1890 | features/semantic/ai-conversation.js |
| `startVisualConversation()` | main.js:1892-1954 | features/semantic/ai-conversation.js |
| `initFightTransformation()` | main.js:1957-2019 | features/sections/fight.js |
| `initClientsReveal()` | main.js:2027-2089 | features/sections/clients.js |
| `orchestrateSustainedCollectivePretending()` | main.js:2100-2169 | features/semantic/phrases.js |
| `orchestrateArtAndSystems()` | main.js:2175-2265 | features/semantic/phrases.js |

---

## Next Steps

1. Review this plan
2. Create feature branch: `git checkout -b refactor/modular-gsap`
3. Begin Phase 1: Core Infrastructure
4. Commit after each phase passes validation
5. Merge when all phases complete

---

*Plan generated with ultrathink analysis through 7 Hermetic principles*
*"The code wants to breathe."*
