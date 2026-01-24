# Fluid Canvas - Quick Reference

## 5-Minute Integration

```html
<!-- 1. Include CSS -->
<link rel="stylesheet" href="assets/css/visions/fluid-canvas.css">

<!-- 2. Include GSAP -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

<!-- 3. Initialize -->
<script type="module">
  import fluidCanvas from './assets/js/visions/fluid-canvas.js';

  fluidCanvas.init({
    mobile: window.innerWidth < 768
  });
</script>
```

## Essential API

```javascript
// Initialize
fluidCanvas.init({ mobile: false });

// Emerge drawing on scroll
fluidCanvas.emergeDrawing('./path/to/drawing.jpg', 0.8);

// Manual splat
fluidCanvas.splat(x, y, dx, dy, { r: 0.5, g: 0.5, b: 0.5 });

// Cleanup
fluidCanvas.destroy();
```

## ScrollTrigger Setup

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: '.your-section',
  start: 'top 60%',
  onEnter: () => {
    fluidCanvas.emergeDrawing('./drawing.jpg', 0.8);
  }
});
```

## Key Configuration

```javascript
// Tweak simulation behavior
fluidCanvas.config = {
  simResolution: 512,         // Grid size (512 desktop, 256 mobile)
  densityDissipation: 0.98,   // Ink fade (0.95=slower, 0.99=faster)
  velocityDissipation: 0.99,  // Flow decay
  curl: 25,                   // Swirl strength (15=calm, 40=turbulent)
  pressureIterations: 20,     // Solver quality (10=fast, 30=precise)
  splatRadius: 0.003          // Splat size
};
```

## Common Patterns

### Mouse Interaction
```javascript
document.addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth;
  const y = 1 - (e.clientY / window.innerHeight);
  fluidCanvas.splat(x, y, 0.01, 0.01, { r: 0.3, g: 0.3, b: 0.3 });
});
```

### Multiple Drawings
```javascript
const drawings = [
  { trigger: '.section-1', path: './drawing1.jpg' },
  { trigger: '.section-2', path: './drawing2.jpg' },
  { trigger: '.section-3', path: './drawing3.jpg' }
];

drawings.forEach(({ trigger, path }) => {
  ScrollTrigger.create({
    trigger,
    start: 'top 60%',
    onEnter: () => fluidCanvas.emergeDrawing(path, 0.8)
  });
});
```

### Pause on Hidden
```javascript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    fluidCanvas.isRunning = false;
  } else {
    fluidCanvas.isRunning = true;
    fluidCanvas.lastTime = performance.now();
    fluidCanvas.animate();
  }
});
```

## Debugging

```javascript
// Press 'D' for debug mode
document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') {
    console.log('Config:', fluidCanvas.config);
    console.log('FPS:', /* calculate */);
    console.log('Resolution:', fluidCanvas.simWidth);
  }
});
```

## Performance Tuning

**Low FPS? Try:**
```javascript
// Reduce resolution
fluidCanvas.config.simResolution = 256;

// Fewer pressure iterations
fluidCanvas.config.pressureIterations = 10;

// Less curl (cheaper)
fluidCanvas.config.curl = 15;

// Faster dissipation (less work)
fluidCanvas.config.densityDissipation = 0.96;
```

**Want more ink persistence?**
```javascript
fluidCanvas.config.densityDissipation = 0.995; // Slower fade
```

**Want calmer motion?**
```javascript
fluidCanvas.config.curl = 15;                   // Less swirl
fluidCanvas.config.velocityDissipation = 0.995; // Slower decay
```

**Want more turbulence?**
```javascript
fluidCanvas.config.curl = 40;                   // More swirl
fluidCanvas.config.velocityScale = 1.0;         // Stronger splats
```

## Accessibility

The system automatically respects:
- `prefers-reduced-motion` - Disables simulation
- `prefers-contrast: high` - Adds content backgrounds
- Keyboard navigation - Canvas doesn't intercept

## Browser Support

- ✅ Chrome 79+
- ✅ Firefox 78+
- ✅ Safari 15+
- ✅ Edge 79+
- ⚠️ Older browsers → Static background

## Troubleshooting

**Blank screen?**
- Check WebGL2 support: `!!canvas.getContext('webgl2')`
- Check console for errors
- Verify image paths (CORS)

**Low FPS?**
- Reduce resolution (see Performance Tuning)
- Check device GPU capabilities
- Monitor memory usage

**Drawings not appearing?**
- Verify image paths
- Check CORS headers
- Confirm ScrollTrigger is loaded
- Test with absolute paths

**Canvas not resizing?**
- Verify CSS: `#fluid-canvas { width: 100vw; height: 100vh; }`
- Check resize handler is attached

## File Paths

```
assets/
├── js/visions/fluid-canvas.js
├── css/visions/fluid-canvas.css
└── drawings/
    ├── IMG_0154.jpg  (Bagua)
    ├── IMG_0161.jpg  (Monk)
    └── IMG_0159.jpg  (Sadhu)
```

## Keyboard Shortcuts (Demo)

- **D** - Toggle debug mode
- **Space** - Pause/resume (if implemented)
- **S** - Save frame (if implemented)

## Memory Usage

- Desktop: ~8MB VRAM + ~1.5MB drawings
- Mobile: ~2MB VRAM + ~1.5MB drawings

## Key Metrics

- Target: **60 FPS**
- Desktop budget: **~8ms/frame** (47% of 16.67ms)
- Mobile budget: **~4.7ms/frame** (28% of 16.67ms)

## Resources

- **Full Guide**: `/FLUID-CANVAS-GUIDE.md`
- **Architecture**: `/FLUID-CANVAS-ARCHITECTURE.md`
- **Demo**: `/fluid-canvas-demo.html`
- **Validation**: `node validate-fluid-canvas.cjs`

## Support

Check console logs for status messages:
- 🌊 Initializing...
- ✓ Initialized
- 🎨 Emerging drawing
- ⚠️ Warnings/errors

## Production Checklist

- [ ] Minify JS/CSS
- [ ] Optimize drawing images (WebP)
- [ ] Test on min-spec device
- [ ] Verify CORS headers
- [ ] Enable HTTPS (for WebGL2)
- [ ] Monitor FPS in production
- [ ] Setup error tracking

---

**Quick Test:**
```bash
python3 -m http.server 8000
open http://localhost:8000/fluid-canvas-demo.html
```

**Validate:**
```bash
node validate-fluid-canvas.cjs
```

---

*Updated: 2026-01-16*
