# Culture Studio Animation System

## Overview

Premium typography choreography for the Culture Studio section. Motion that reveals meaning — where every animation choice reinforces the semantic content.

**Core Philosophy:** "Culture" = organic, human, warm. "Studio" = precise, systematic, crafted.

---

## Architecture

### Unified Animation State

Single source of truth prevents conflicts between systems:

```javascript
const AnimationState = {
  mode: 'idle', // 'idle' | 'hover-culture' | 'hover-studio' | 'hover-space'
  canInteract: false,
  mouse: { x: 0, y: 0, velocityX: 0, velocityY: 0 },
  scroll: { y: 0, velocity: 0, velocitySmoothed: 0 },
  elements: { title, cultureEl, studioEl, periodEl, glow, introBlock },
  lastInteraction: Date.now(),
  idleThreshold: 20000
};
```

### Single RAF Loop

One animation frame handles all continuous effects:

```javascript
function startUnifiedRAF() {
  function tick() {
    // Update mouse/scroll velocity
    // Check idle state → triggerIdleAwakening()
    // Apply magnetic effect (only when mode === 'idle')
    // Apply glow parallax
    requestAnimationFrame(tick);
  }
  tick();
}
```

### GSAP Conflict Prevention

```javascript
// Kill conflicting tweens before starting new ones
gsap.killTweensOf(element, 'color');

// Use overwrite on all interactive tweens
gsap.to(element, {
  color: '#FF2D55',
  overwrite: 'auto'  // Prevents stacking
});
```

---

## Features Implemented

### 1. Character-by-Character Reveal
- "Culture" — elastic, organic emergence with random rotation
- "Studio" — precise, synchronized, mechanical
- Period — gravity drop with squash-bounce

### 2. Hot Pink Pulse
- "Culture" pulses `#FF2D55` (Subfracture hot pink) after landing
- Glow synesthesia — glow brightens and shifts warm during pulse
- "acceptance and love" in lede also pulses pink

### 3. Magnetic Typography
- Characters respond to cursor proximity
- "Culture" drifts toward mouse (attracted, curious)
- "Studio" resists slightly (precise, mechanical)
- Only active when `mode === 'idle'`

### 4. Hover Memory
- Culture hover → soft pink return, organic character lift
- Studio hover → letter-spacing tightens, precision snap
- Period hover → playful bounce with grab cursor

### 5. The Space Between
- Hovering gap between words triggers "meeting point"
- Both words lean toward each other
- Glow intensifies at convergence

### 6. Idle Awakening
- After 20s inactivity: period bounces, Culture pulses pink
- Gentle "still here?" without being intrusive

### 7. Scroll Effects
- Title scales down as user scrolls away
- Depth parallax — Culture forward, Studio recedes
- Velocity awareness — fast scroll = dramatic separation

### 8. First Visit vs Return
- localStorage tracks visits
- First visit = full theatrical entrance
- Return = softer, faster "welcome back"

### 9. Glow Connective Tissue
- Glow morphs/migrates to next section on scroll
- Creates visual continuity between sections

### 10. Selection Styling
- Highlight "Culture" = hot pink selection
- Highlight "Studio" = cool neutral selection

### 11. Breathing Rhythm
- Glow breathes on 4-second cycle (human resting breath)
- Subconsciously calming, keeps section alive

---

## File Structure

```
assets/
├── js/
│   └── culture-studio-dramatics.js   # Main animation module (~1350 lines)
└── css/
    ├── effects.css                    # Animation-specific CSS
    └── custom.css                     # Typography scale, glow styling
```

---

## CSS Classes

```css
/* Title structure */
.cs-title-active     /* Applied when animation starts */
.cs-word             /* Word containers (Culture, Studio) */
.cs-culture          /* "Culture" word */
.cs-studio           /* "Studio" word */
.cs-period           /* The period with attitude */
.cs-space-between    /* Invisible hover zone */

/* Text splitting */
.split-char          /* Individual characters */
.split-word          /* Word wrappers */

/* Lede chunks */
.cs-chunk            /* Semantic chunk container */
.cs-chunk--audience  /* "For brands and IP" */
.cs-chunk--qualifier /* "that deserve more than campaigns," */
.cs-chunk--action    /* "we co-design movements" */
.cs-chunk--payoff    /* "that generate acceptance and love." */
.cs-emphasis-more    /* Bold "more" within italic */
.cs-love             /* "acceptance and love" highlight */

/* Glow elements */
.intro-glow          /* Main atmospheric glow */
.cs-glow-thread      /* Connective tissue to next section */
```

---

## Integration

```javascript
// In main.js
import { initCultureStudioDramatics } from './culture-studio-dramatics.js';

// In DOMContentLoaded or ready()
initCultureStudioDramatics({
  prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  debug: false
});
```

---

## Performance Considerations

1. **Single RAF loop** — not multiple competing loops
2. **Passive event listeners** — `{ passive: true }` on mouse/scroll
3. **GPU-friendly transforms** — scale instead of blur filters
4. **overwrite: 'auto'** — prevents tween stacking
5. **State machine** — magnetic effect pauses during hover
6. **Throttled effects** — proximity check prevents unnecessary calculations

---

## Iterative Development Process

### Phase 1: Foundation
1. Character-by-character reveal with dual personality
2. Hot pink pulse on "Culture"
3. Period with gravity drop

### Phase 2: Interactivity
4. Magnetic typography (cursor response)
5. Hover memory (re-trigger on hover)
6. Glow parallax (mouse follow)

### Phase 3: Polish
7. Glow synesthesia (reacts to color pulse)
8. Breathing rhythm (4-second cycle)
9. Scroll continuation (scale down)
10. Depth parallax (Z-space separation)

### Phase 4: Advanced Features
11. The space between (meeting point)
12. Idle awakening (still here?)
13. Scroll velocity awareness
14. First visit vs return
15. Glow connective tissue
16. Selection styling

### Phase 5: Consolidation (Critical)
17. Identified conflicts — multiple systems fighting over same properties
18. Created unified `AnimationState` object
19. Consolidated to single RAF loop
20. Added `gsap.killTweensOf()` and `overwrite: 'auto'`
21. Implemented state machine for mode management

---

## Lessons Learned

### Problem: Animation Conflicts
Multiple systems (hover, magnetic, idle) all trying to animate the same properties caused stuttering and unpredictable behavior.

**Solution:** State machine with modes. Only one system controls an element at a time.

### Problem: Multiple RAF Loops
Three separate `requestAnimationFrame` loops caused performance issues and race conditions.

**Solution:** Single unified RAF loop that handles all continuous effects.

### Problem: GSAP Tween Stacking
Rapid interactions created multiple tweens on the same property, fighting each other.

**Solution:** `gsap.killTweensOf(element, 'property')` before new tweens, plus `overwrite: 'auto'` on all interactive animations.

### Problem: Event Listener Proliferation
Each feature added its own mousemove/scroll listeners.

**Solution:** Single mouse tracking in AnimationState, consumed by all systems.

---

## Applying to Other Sections

When replicating this pattern for other sections:

1. **Start with semantic analysis** — What do the words mean? How should motion reinforce that meaning?

2. **Build foundation first** — Basic reveal animation before adding interactivity

3. **Add interactivity incrementally** — Test each feature in isolation

4. **Consolidate early** — Don't wait for conflicts to appear. Use unified state from the start.

5. **Use the AnimationState pattern** — Extend it for new sections rather than creating parallel systems

6. **Test performance continuously** — Check for janky animations after each addition

---

## API Reference

### initCultureStudioDramatics(options)

```javascript
initCultureStudioDramatics({
  prefersReducedMotion: boolean,  // Use simple fades if true
  debug: boolean                   // Console logging
});
```

### cleanupCultureStudioDramatics()

Kills all ScrollTriggers for HMR compatibility.

---

## Future Improvements (Not Implemented)

- Variable font weight shifts on scroll
- Device tilt on mobile (accelerometer)
- Audio-reactive elements (user opted out of sound)
- Cursor trail through title area
- Letter morphing with variable fonts
