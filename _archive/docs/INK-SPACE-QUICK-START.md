# The Ink Space - Quick Start Guide

## What You've Built

An ethereal 3D gallery where your ink drawings float through fog like memories. Scroll transforms into camera movement through consciousness space. Contemplative, mysterious, organic.

## Files Created

```
/assets/js/visions/ink-space.js       (15KB) - Main Three.js module
/assets/css/visions/ink-space.css     (2.9KB) - Canvas styles
/ink-space-demo.html                  - Working demo page
/INK-SPACE-README.md                  - Full documentation
```

## Quick Test

```bash
# Navigate to project
cd /home/dom/subfracture-website

# Start local server
python3 -m http.server 8000
# or
npx serve .

# Open in browser
open http://localhost:8000/ink-space-demo.html
```

## Integration Pattern

```javascript
// 1. Import module
import InkSpace from '/assets/js/visions/ink-space.js';

// 2. Initialize
InkSpace.init({
  mobile: window.innerWidth < 768,
  particleCount: 25000
});

// 3. Cleanup on exit
window.addEventListener('beforeunload', () => {
  InkSpace.destroy();
});
```

## Spatial Layers

As user scrolls, camera moves through these depths:

| Depth | Content | Feeling |
|-------|---------|---------|
| z = -10 | Contemporary figures | Present, immediate |
| z = -25 | Eastern philosophy | Contemplative |
| z = -42 | Hip-hop icons | Cultural, eye-level |
| z = -70 | Strategy diagrams | Analytical |
| z = -100 | Brisbane map | Ground, foundation |

## Performance

- **Desktop**: 25,000 particles, full quality
- **Mobile**: 8,000 particles, optimized
- **Target**: 60fps on modern hardware
- **Fallback**: Hides on `prefers-reduced-motion`

## Customization

### Change Particle Count
```javascript
InkSpace.init({ particleCount: 15000 });
```

### Adjust Scroll Distance
```javascript
InkSpace.init({ scrollDistance: 150 }); // Default: 100
```

### Different Container
```javascript
const container = document.getElementById('my-container');
InkSpace.init({ container });
```

## Adding New Drawings

1. Place JPG in `/assets/drawings/`
2. Edit `ink-space.js` → `loadDrawings()` method
3. Add to drawings array:

```javascript
{
  path: '/assets/drawings/YOUR_IMAGE.jpg',
  position: [x, y, z],  // e.g., [5, 2, -30]
  rotation: [rx, ry, rz], // e.g., [0, 0.2, 0]
  scale: [width, height, 1] // e.g., [6, 8, 1]
}
```

## Troubleshooting

### Canvas is blank
- Check browser console for errors
- Verify Three.js is loaded
- Check drawing paths are correct

### Poor performance
- Reduce particle count: `particleCount: 5000`
- Disable antialiasing in code
- Check GPU is being used (about:gpu in Chrome)

### Drawings not appearing
- Verify files exist in `/assets/drawings/`
- Check for CORS errors (must serve from localhost)
- Wait for texture loading (async)

## Next Steps

1. Test the demo: `ink-space-demo.html`
2. Integrate into your site structure
3. Adjust scroll triggers for your content
4. Customize drawing positions
5. Tune particle count for your audience

## The Vision

This isn't a 3D gallery showcase. It's a contemplative space where drawings exist as memories floating in consciousness. The fog obscures as much as it reveals. Discovery happens at the user's pace. Mystery is intentional.

Let it breathe. Let them drift.

---

Read `INK-SPACE-README.md` for complete technical documentation.
