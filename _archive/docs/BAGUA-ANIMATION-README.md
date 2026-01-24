# Bagua Self-Drawing Animation

## Overview

A hand-crafted SVG animation of the Bagua (八卦) - the ancient Chinese symbol representing the fundamental principles of reality in I-Ching philosophy. The animation draws itself line by line, revealing the structure from center to periphery.

## Symbol Structure

1. **Yin-Yang Center (Taijitu)**: The S-curve representing duality and balance
2. **Two Dots**: Unity within duality (yang within yin, yin within yang)
3. **Inner Octagon**: The first container, the frame
4. **Eight Trigrams**: The fundamental principles (Heaven, Earth, Fire, Water, Thunder, Wind, Mountain, Lake)
5. **Outer Octagon**: Completion, the boundary that holds all

## Animation Sequence

Total duration: ~5 seconds

1. **Yin-Yang S-curve** (1.5s) - The heart of duality draws
2. **Outer circle** (1.2s) - Completes the yin-yang
3. **Two dots appear** (0.4s) - Unity manifests
4. **Inner octagon** (0.8s) - First frame emerges
5. **Eight trigrams** (1.5s) - Complexity radiates outward
6. **Outer octagon** (1s) - Completion achieved
7. **Eternal rotation** - Subtle, slow rotation of center yin-yang (optional)

## Usage

### Basic Implementation

```html
<div id="bagua-container"></div>

<script type="module">
  import { init } from './assets/js/bagua-draw.js';
  import gsap from 'gsap';

  window.gsap = gsap; // Required

  const bagua = init('#bagua-container', {
    size: 500,
    strokeColor: '#7d54ff',
    strokeWidth: 2.5,
    autoStart: true,
    enableRotation: true,
    onComplete: () => {
      console.log('Drawing complete');
    }
  });
</script>
```

### Advanced Usage

```javascript
import { BaguaDraw } from './assets/js/bagua-draw.js';

const bagua = new BaguaDraw('#container', {
  size: 600,                    // Size in pixels
  strokeColor: '#7d54ff',       // Stroke color
  strokeWidth: 2.5,             // Line thickness
  backgroundColor: '#0a0014',   // Background (or 'transparent')
  autoStart: false,             // Don't auto-start
  enableRotation: true,         // Enable post-draw rotation
  onComplete: () => {
    // Callback when complete
  }
});

bagua.init();   // Initialize
bagua.start();  // Start animation
bagua.replay(); // Replay from beginning
bagua.reset();  // Reset to start without playing
bagua.destroy(); // Clean up
```

## Files

- `/assets/js/bagua-draw.js` - Main animation module
- `/bagua-test.html` - Standalone test page

## Test Page

Visit: `http://localhost:3001/bagua-test.html`

**Controls:**
- Press `R` to replay animation
- Press `SPACE` to reset to beginning
- Click "Replay" or "Reset" buttons

## Integration into Main Site

```javascript
// In your main app
import { init as initBagua } from './assets/js/bagua-draw.js';

// Hero section
const bagua = initBagua('#hero-bagua', {
  size: 600,
  strokeColor: '#7d54ff',
  autoStart: true,
  enableRotation: true,
  onComplete: () => {
    // Trigger next section
    showContent();
  }
});
```

## Design Philosophy

The animation embodies Subfracture's ethos:

- **Center to Periphery**: Systems grow from simple to complex
- **Contemplative Pacing**: Each line drawn with intention, not speed
- **Sacred Geometry**: The octagon, the trigrams, the eternal circle
- **Art and Systems**: Ancient wisdom rendered through modern code

## Performance

- Pure SVG with GSAP animation (hardware accelerated)
- ~1KB gzipped without GSAP
- 60fps throughout animation
- Scales perfectly to any size (vector)

## Technical Notes

- Requires GSAP (already in project dependencies)
- ES6 module format
- No external dependencies beyond GSAP
- Works in all modern browsers
- Touch-friendly, responsive

---

**Subfracture Culture Studio**
Art and Systems, Flowing Together
