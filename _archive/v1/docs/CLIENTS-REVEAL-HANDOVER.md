# Clients Banner "Lips Reveal" - Handover Document

## Current Status: WORKING - Ready for Refinement

The core functionality is implemented and working. The section:
- Starts collapsed (0px height) on page load
- Expands smoothly on scroll (after 100px threshold)
- Pushes content down as it reveals
- Shows client logos (Nike, Sprite, BMW, etc.)

---

## What Was Fixed

### Root Cause (from previous investigation)
`overflow: hidden` + `perspective: 1200px` are **fundamentally incompatible** in CSS. The browser flattens 3D context when overflow is hidden.

### Solution Implemented

**CSS Changes** (`/home/dom/subfracture-website/assets/css/effects.css` lines 869-905):
```css
.clients-reveal {
  position: relative;
  background: var(--sf-bg, #fafafa);
  display: grid;
  grid-template-rows: 0fr;  /* Collapsed by default */
}

.clients-reveal > * {
  overflow: hidden;
  min-height: 0;  /* Required for grid collapse */
}

.clients-reveal__content {
  position: relative;
  z-index: 1;
  /* Padding moved to inner .container for grid collapse to work */
}

.clients-reveal__content > .container {
  padding: 3rem 0;
}

.clients-reveal__lips {
  /* Perspective moved here from parent */
  perspective: 1200px;
  perspective-origin: 50% 50%;
  transform-style: preserve-3d;
}
```

**JS Changes** (`/home/dom/subfracture-website/assets/js/main.js` function `initClientsReveal` ~line 2027):
- Uses ScrollTrigger with container as trigger
- Animates `gridTemplateRows` from `0fr` to `1fr`
- Requires 100px scroll before animation starts (prevents page-load trigger)
- Rotates lip panels for 3D fold effect

---

## Current Behavior

1. **Page Load**: Section is collapsed, takes zero space
2. **Scroll 0-100px**: Section stays collapsed
3. **Scroll 100px+**: Section begins expanding, lips rotate
4. **Full reveal**: Section at full height, `is-revealed` class added

---

## Areas for Refinement

### 1. Scroll Trigger Timing
Current trigger: `start: 'top bottom'` to `end: 'top 60%'`
- Animation happens quickly once triggered
- May want to adjust for smoother/longer reveal

### 2. 3D Lip Effect
The lips (top/bottom panels that fold open) rotate with:
```javascript
gsap.set(topLip, { rotateX: -90 * progress });
gsap.set(bottomLip, { rotateX: 90 * progress });
```
- Currently rotates to 90 degrees (fully open)
- May need visual refinement for the "lips spreading" effect

### 3. Scroll Threshold
Currently requires 100px scroll before animation starts:
```javascript
if (scrollY < 100) {
  gsap.set(container, { gridTemplateRows: '0fr' });
  return;
}
```
- Prevents triggering on page load
- May need adjustment based on hero height

---

## Key Files

| File | Purpose |
|------|---------|
| `/home/dom/subfracture-website/index.html` | HTML structure (lines 83-104) |
| `/home/dom/subfracture-website/assets/css/effects.css` | CSS for clients-reveal (lines 869-1001) |
| `/home/dom/subfracture-website/assets/js/main.js` | JS animation (function `initClientsReveal` ~line 2027) |

---

## HTML Structure
```html
<section class="clients-reveal">
  <div class="clients-reveal__content">
    <div class="container">
      <ul class="logo-grid">
        <!-- 8 logo items -->
      </ul>
    </div>
  </div>
  <div class="clients-reveal__lips" aria-hidden="true">
    <div class="clients-reveal__lip clients-reveal__lip--top"></div>
    <div class="clients-reveal__lip clients-reveal__lip--bottom"></div>
  </div>
</section>
```

---

## Dev Server

```bash
cd /home/dom/subfracture-website
npm run dev
# Runs on http://localhost:3000
```

---

## Notes for Next Session

1. The "header-block overlapping Culture Studio" mentioned by user is actually normal layout - they're sequential sections, not overlapping

2. Two `.header-block` elements exist:
   - Line 58: `<div class="header-block sticky__nav">` - fixed sticky nav (hidden by default)
   - Line 107: `<section class="header-block">` - static section in document flow

3. The accessibility tree shows logo items even when collapsed - this is expected (they're in DOM, just visually hidden)

4. Console shows "Clients reveal (lips spreading) initialized" on successful init

---

## Vision for the Effect

User's original description: "Opens out of the page on scroll - like vertical lips spreading apart to reveal the logos underneath"

The current implementation:
- Expands from 0 height (pushes content down)
- Has lip panels that can rotate in 3D
- Needs refinement on the visual "lips spreading" metaphor
