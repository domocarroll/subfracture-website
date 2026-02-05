# Animation Development Process

A repeatable process for creating premium GSAP animations across Subfracture sections.

---

## The Process

### 1. Semantic Analysis
Before writing code, understand what the content *means*:
- What is the emotional tone?
- What are the key words/phrases?
- What duality or tension exists?
- How should motion reinforce meaning?

**Example:** "Culture Studio" has inherent duality:
- Culture = organic, human, warm, alive
- Studio = precise, crafted, intentional, systematic

### 2. Foundation Layer
Build the basic reveal animation:
- Character/word splitting
- Initial states (opacity: 0, transforms)
- Entrance timeline with appropriate easing
- Test with reduced motion fallback

### 3. Signature Moment
Add one memorable interaction:
- Color pulse
- Gravity drop
- Elastic bounce
- Whatever makes it *unforgettable*

### 4. Interactivity Layer
Add cursor/scroll response:
- Magnetic effects
- Hover states
- Parallax
- Keep each feature isolated initially

### 5. Polish Layer
Ambient life and refinement:
- Breathing rhythms
- Idle states
- Glow effects
- Selection styling

### 6. Consolidation (Critical)
Before shipping, unify all systems:
- Single AnimationState object
- Single RAF loop
- State machine for modes
- `overwrite: 'auto'` everywhere
- Test for conflicts

---

## Technical Patterns

### Unified State Pattern
```javascript
const AnimationState = {
  mode: 'idle',
  canInteract: false,
  mouse: { x: 0, y: 0 },
  scroll: { y: 0, velocity: 0 },
  elements: {},
  lastInteraction: Date.now()
};
```

### State Machine Pattern
```javascript
AnimationState.setMode('hover-culture');
// Only one mode active at a time
// Magnetic effect checks: if (mode === 'idle')
```

### GSAP Best Practices
```javascript
// Kill conflicts before new tweens
gsap.killTweensOf(element, 'color');

// Always use overwrite
gsap.to(element, { ...props, overwrite: 'auto' });

// Use timelines for sequenced animations
const tl = gsap.timeline({ delay: 0.3 });
```

### Single RAF Loop
```javascript
function startUnifiedRAF() {
  function tick() {
    updateVelocities();
    checkIdleState();
    applyEffects();
    requestAnimationFrame(tick);
  }
  tick();
}
```

---

## Checklist for New Sections

### Before Starting
- [ ] Analyze semantic content
- [ ] Identify key phrases to emphasize
- [ ] Define the emotional arc
- [ ] Sketch motion concepts

### Foundation
- [ ] Create split text utility (or reuse)
- [ ] Set initial states (opacity, transforms)
- [ ] Build entrance timeline
- [ ] Test reduced motion fallback

### Interactivity
- [ ] Add to AnimationState.elements
- [ ] Use unified mouse/scroll tracking
- [ ] Implement hover states with mode management
- [ ] Add scroll-triggered effects with ScrollTrigger

### Polish
- [ ] Ambient breathing/glow
- [ ] Idle state behavior
- [ ] Selection styling
- [ ] Cursor customization

### Consolidation
- [ ] Verify single RAF loop
- [ ] Check for tween conflicts
- [ ] Test rapid interactions
- [ ] Performance audit (60fps)
- [ ] Document in section-specific file

---

## Common Pitfalls

| Problem | Solution |
|---------|----------|
| Animations fight each other | State machine + `overwrite: 'auto'` |
| Janky performance | Single RAF loop, passive listeners |
| Hover flickers | `gsap.killTweensOf()` before new tweens |
| Scroll jank | Use `scrub` instead of callbacks |
| Mobile lag | GPU transforms only (no filters) |

---

## Files to Create Per Section

```
docs/[SECTION-NAME]-ANIMATION-SYSTEM.md  # Architecture docs
assets/js/[section-name]-dramatics.js     # Animation module
assets/css/effects.css                     # Add section CSS classes
```

---

## Tomorrow's Targets

Sections to apply this process:

1. **Hero Section** — Video/lightbox choreography
2. **Footer (sf-closer)** — Big wordmark reveal
3. **Logo Strip** — Subtle hover interactions
4. **Team Carousel** — Member card animations

Each section should:
- Have its own semantic analysis
- Share the AnimationState pattern
- Integrate with unified RAF loop
- Document in its own markdown file
