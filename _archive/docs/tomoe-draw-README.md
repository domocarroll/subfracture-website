# Tomoe Self-Drawing Animation

The hero symbol for Subfracture - a self-drawing three-way spiral (Tomoe) representing cycles, flow, and interconnection.

## Overview

This module creates a beautiful, hand-drawn-feeling SVG animation of the Tomoe symbol. The animation sequence:

1. Outer circle draws (1.2s)
2. Three magatama spirals emerge simultaneously from center (2.0s)
3. Center triangle appears (0.4s)
4. Subtle pulse/glow effect begins

Total animation: ~3.6 seconds

## Files

- `tomoe-draw.js` - Reusable animation module
- `../../tomoe-test.html` - Standalone test page

## Usage

### Basic Integration

```javascript
import { initTomoe } from './assets/js/tomoe-draw.js';

const container = document.getElementById('hero-symbol');
const animation = initTomoe(container);
```

### With Completion Callback

```javascript
initTomoe(container, {
  onComplete: () => {
    console.log('Animation complete');
    // Trigger next phase of page load
  }
});
```

### Replay Animation

```javascript
const animation = initTomoe(container);
// Later...
animation.replay();
```

### Clean Up

```javascript
import { destroyTomoe } from './assets/js/tomoe-draw.js';

destroyTomoe(container);
```

## Customization

Edit the constants at the top of `tomoe-draw.js`:

```javascript
const COLORS = {
  primary: '#7d54ff',    // Line color
  background: '#0a0014', // Not used in SVG, but reference
  white: '#ffffff'       // Alternative color
};

const TIMING = {
  outerCircle: 1.2,  // Circle drawing duration
  spirals: 2.0,      // Spirals drawing duration
  triangle: 0.4,     // Triangle drawing duration
  pulseDelay: 0.3    // Delay before pulse starts
};
```

## Technical Details

### SVG Structure

- **Viewbox**: 300x300
- **Outer circle**: r=140, centered at (150, 150)
- **Three magatama**: Bezier curve paths, rotated 0°, 120°, 240°
- **Center triangle**: Small equilateral triangle at center

### Animation Technique

Uses `stroke-dasharray` and `stroke-dashoffset` for the drawing effect:

1. Calculate path length with `getTotalLength()`
2. Set `stroke-dasharray` to full length
3. Set `stroke-dashoffset` to full length (hidden)
4. Animate `stroke-dashoffset` to 0 (revealed)

### Easing

Custom cubic-bezier: `cubic-bezier(0.65, 0, 0.35, 1)`
- Creates organic, hand-drawn feeling
- Slight ease-in, stronger ease-out
- Not too slow, not too fast

### Pulse Effect

After drawing completes:
- CSS animation with `drop-shadow` filter
- 3s duration, infinite loop
- Gentle opacity and glow variation

## Integration Examples

### Hero Section

```html
<section class="hero">
  <div id="tomoe-hero"></div>
  <h1>Subfracture</h1>
  <p>Art and systems, flowing together</p>
</section>

<script type="module">
  import { initTomoe } from './assets/js/tomoe-draw.js';

  initTomoe(document.getElementById('tomoe-hero'), {
    onComplete: () => {
      // Fade in text after symbol completes
      gsap.to('.hero h1, .hero p', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2
      });
    }
  });
</script>
```

### Loading Spinner Replacement

```javascript
// Show Tomoe while content loads
const loader = document.getElementById('loader');
const animation = initTomoe(loader, {
  onComplete: () => {
    // Content is ready, fade out loader
    gsap.to(loader, {
      opacity: 0,
      onComplete: () => loader.remove()
    });
  }
});
```

### Page Transition

```javascript
// Tomoe appears during route change
function transitionPage(newRoute) {
  const transition = document.getElementById('page-transition');
  transition.style.display = 'flex';

  initTomoe(transition, {
    onComplete: () => {
      loadNewRoute(newRoute);
      transition.style.display = 'none';
    }
  });
}
```

## Performance

- Pure SVG, no canvas
- Hardware-accelerated CSS transitions
- No external dependencies (except container)
- Lightweight: ~7KB unminified
- 60fps animation

## Browser Support

- Modern browsers with SVG support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Design Philosophy

The Tomoe represents:
- **Cycles**: Continuous flow of energy
- **Three-way balance**: Multiple forces in harmony
- **Sacred geometry**: Ancient symbol, modern execution
- **Organic motion**: Hand-drawn aesthetic via code

The animation should feel like watching an artist draw the symbol in real-time, not like a computer animation. Timing and easing are carefully tuned for this organic feeling.

## Credits

Symbol traced from source drawing: `assets/drawings/IMG_0156.jpg`
Created for Subfracture Culture Studio
"Art and systems, flowing together"
