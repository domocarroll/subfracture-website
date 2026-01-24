# Avenue B: The Ink Space

An ethereal 3D gallery where drawings float through atmospheric fog like memories in consciousness. Built with Three.js, this experience transforms scroll into movement through a contemplative space inspired by Gaia Alari's aesthetic.

## Overview

The Ink Space is not a clinical 3D gallery - it's an organic, breathing environment where hand-drawn works exist as spiritual artifacts suspended in fog. As you scroll, the camera drifts through different depths, discovering layers of meaning: contemporary figures, Eastern philosophy, cultural icons, strategic diagrams, and the Brisbane/Meanjin map as the ground beneath everything.

## Technical Architecture

### Core Technologies
- **Three.js** - WebGL rendering and 3D scene management
- **GSAP ScrollTrigger** - Smooth scroll-to-camera binding
- **Curl Noise** - Organic particle movement system
- **Mobile-First Performance** - Adaptive quality based on device

### Scene Composition

#### Spatial Layout (Z-Depth)
```
z = 0     → Entry point (hero area)
z = -10   → Contemporary figures
z = -20   → Eastern philosophy (Sadhu, Shaolin)
z = -40   → Hip-hop icons (eye level feeling)
z = -70   → Workshop tools, strategy diagrams (Bagua)
z = -100  → Brisbane/Meanjin map (horizontal ground plane)
```

#### Atmosphere System
- **10,000-30,000 particles** (mobile-adaptive)
- **Curl noise flow** for fluid, organic movement
- **Exponential fog** increasing with depth
- **Additive blending** for soft glow effect

#### Drawing Planes
- TextureLoader for async image loading
- DoubleSide rendering with 90% opacity
- Subtle floating animation (sine wave oscillation)
- Strategic rotation angles for visual interest

## Files Created

### 1. `/assets/js/visions/ink-space.js`
Main module exporting `init()` and `destroy()` methods.

**Key Methods:**
- `init(options)` - Initialize scene, camera, renderer, particles, drawings
- `destroy()` - Proper cleanup of all Three.js resources
- `setupScrollBinding()` - GSAP ScrollTrigger for camera movement
- `updateParticles()` - Curl noise particle system
- `curlNoise()` - 3D noise function for fluid flow

### 2. `/assets/css/visions/ink-space.css`
Styles ensuring canvas sits behind interactive content.

**Key Features:**
- Fixed positioning with `z-index: -1`
- `pointer-events: none` for click-through
- GPU acceleration hints
- Accessibility support (reduced motion, high contrast)
- Mobile optimizations

### 3. `/ink-space-demo.html`
Complete working example demonstrating integration.

## Usage

### Basic Integration

```html
<!DOCTYPE html>
<html lang="en" class="ink-space-active">
<head>
  <link rel="stylesheet" href="/assets/css/visions/ink-space.css">
</head>
<body>

  <!-- Your content sections -->
  <section class="ink-space-section ink-space-content">
    <div class="content-block">
      <h1>Your Content</h1>
    </div>
  </section>

  <!-- More sections for scroll distance -->

  <script type="module">
    import InkSpace from '/assets/js/visions/ink-space.js';

    const isMobile = window.innerWidth < 768;

    InkSpace.init({
      mobile: isMobile,
      container: document.body,
      particleCount: isMobile ? 8000 : 25000,
      scrollDistance: 100
    });
  </script>

</body>
</html>
```

### Configuration Options

```javascript
InkSpace.init({
  // Device detection
  mobile: false,              // Auto-reduce quality on mobile

  // Container
  container: document.body,   // Where to append canvas

  // Performance
  particleCount: 25000,       // Number of fog particles

  // Camera movement
  scrollDistance: 100         // Z-axis travel distance
});
```

### Cleanup

Always destroy the instance when navigating away:

```javascript
window.addEventListener('beforeunload', () => {
  InkSpace.destroy();
});
```

## Drawing Assets

Located in `/assets/drawings/`:

| File | Content | Z-Depth | Description |
|------|---------|---------|-------------|
| IMG_0240.jpg | Brisbane/Meanjin map | -100 | Horizontal ground plane |
| IMG_0154.jpg | Bagua diagram | -70 | Strategy/philosophy |
| IMG_0133.jpg | Hip-hop portrait | -40 | Cultural icon |
| IMG_0165.jpg | Jimi Hendrix | -45 | Music legend |
| IMG_0159.jpg | Sadhu meditation | -20 | Eastern spirituality |
| IMG_0161.jpg | Shaolin monk | -25 | Discipline/practice |
| IMG_0176.jpg | Contemporary figure | -10 | Entry piece |
| IMG_0152.jpg | Additional depth | -60 | Atmospheric |
| IMG_0174.jpg | Additional depth | -35 | Atmospheric |

All images are JPEG format, average 400-900KB each.

## Performance Optimizations

### Mobile Adaptations
- Reduced particle count (8,000 vs 25,000)
- Lower pixel ratio (max 2x)
- Disabled antialiasing
- Texture quality maintained (drawings are hero content)

### GPU Optimizations
- Additive blending on particles (no depth write)
- BufferGeometry for efficient particle storage
- Instanced rendering approach
- Exponential fog (GPU-friendly)

### Memory Management
- Proper geometry/material disposal in `destroy()`
- Texture disposal on cleanup
- Animation frame cancellation
- Event listener removal

## Aesthetic Principles

### What This Is
- Contemplative drift through memories
- Organic, breathing space
- Mystery through fog (can't see everything at once)
- Drawings as spiritual artifacts
- Ethereal, dream-like quality

### What This Isn't
- Clinical museum gallery
- Gamified 3D space
- Over-animated spectacle
- Technical showcase
- Literal representation

## Browser Support

- **Chrome/Edge** - Full support
- **Firefox** - Full support
- **Safari** - Full support (iOS 15+)
- **Mobile browsers** - Optimized experience

Requires WebGL support. Falls back gracefully with `prefers-reduced-motion`.

## Accessibility

- Respects `prefers-reduced-motion` (hides canvas)
- High contrast mode support (reduces opacity)
- Text remains selectable on content
- Keyboard navigation preserved
- Screen reader content unaffected

## Future Enhancements

### Potential Extensions
- Audio-reactive particles (link to ambient soundtrack)
- Mouse parallax for depth perception
- Drawing detail view on hover/click
- Procedural fog density based on scroll velocity
- WebXR support for VR exploration

### Performance Improvements
- Level-of-detail system for particles
- Frustum culling on drawing planes
- Texture compression (KTX2/Basis)
- Worker-based noise computation

## Troubleshooting

### Canvas Not Appearing
- Check that Three.js is loaded
- Verify drawing paths are correct
- Ensure container exists in DOM

### Performance Issues
- Reduce `particleCount` option
- Disable antialiasing: `antialias: false`
- Lower `pixelRatio` to 1

### Scroll Not Working
- Verify GSAP ScrollTrigger is loaded
- Check that body has enough height
- Ensure no CSS `overflow: hidden` on html/body

### Drawings Not Loading
- Check browser console for 404 errors
- Verify `/assets/drawings/` path
- Check CORS if serving from different domain

## Development Notes

### Curl Noise Implementation
Simplified 3D curl noise using sine wave approximation. For production at scale, consider:
- Importing simplex-noise library
- Pre-computed noise lookup textures
- GPU-based noise computation in vertex shader

### Camera Movement
Currently using GSAP for smooth scroll interpolation. Alternative approaches:
- Lerp in animation loop for more control
- Physics-based easing with momentum
- Gamepad/keyboard navigation option

### Resource Loading
Textures load asynchronously. Consider:
- Loading screen with progress indicator
- Preload critical drawings before init
- Low-res placeholder → high-res swap

## Credits

**Concept**: Avenue B - The Ink Space for Subfracture
**Aesthetic Inspiration**: Gaia Alari
**Technical Implementation**: Three.js, GSAP, Curl Noise
**Drawings**: Original ink works from `/assets/drawings/`

---

**Remember**: This is a space for contemplation, not spectacle. The fog should obscure as much as it reveals. Let the drawings breathe. Let the user discover at their own pace. The mystery is part of the experience.
