# Subfracture Website - Project Memory

## Known Fixes & Gotchas

### Clients Reveal - Scroll Threshold Check (CRITICAL)

**Problem**: ScrollTrigger can fire on page load if the hero is shorter than viewport, causing the clients section to be visible when it should be hidden.

**Root Cause**:
1. `overflow: hidden` + `perspective` are CSS-incompatible (spec flattens 3D)
2. ScrollTrigger conditions may be satisfied on initial page load

**Solution**: Always include a scroll threshold check in the `onUpdate` callback:

```javascript
onUpdate: (self) => {
  const scrollY = window.scrollY || window.pageYOffset;

  // DON'T animate until user has actually scrolled
  if (scrollY < 100) {
    gsap.set(container, { gridTemplateRows: '0fr' });
    container.classList.remove('is-animating', 'is-revealed');
    return;  // EXIT EARLY - prevents triggering on page load
  }

  // ... rest of animation code
}
```

**Key Files**:
- CSS: `/assets/css/effects.css` (search for `.clients-reveal`)
- JS: `/assets/js/main.js` (function `initClientsReveal`)

---

## Architecture Notes

### Clients Reveal "Lips" Effect

The section uses CSS Grid for smooth height animation:
- `grid-template-rows: 0fr` = collapsed (invisible)
- `grid-template-rows: 1fr` = expanded (visible)
- Content wrapper needs `overflow: hidden; min-height: 0` for grid collapse to work

Header-block can be fixed at bottom during reveal using `.is-fixed-bottom` class.
