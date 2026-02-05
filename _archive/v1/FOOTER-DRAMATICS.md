# Footer Dramatics - Implementation Documentation

## Overview

The footer wordmark ("Subfracture") receives a **theatrical emergence animation** that serves as the crescendo of the page experience. This is the last thing users see, and it should feel like a signature, a conclusion, a promise.

## Implementation Strategy

**Primary Approach: Letter Rise + Mouse Parallax**

The animation combines two powerful effects:
1. **Letter Rise**: Individual letters/paths rise from below viewport with staggered timing and rotation
2. **Mouse Parallax**: Once assembled, letters respond subtly to mouse position for living typography

## Files Created

### 1. `/assets/js/footer-dramatics.js`
Main module containing:
- `initFooterDramatics()` - Primary animation controller
- `prepareLogo()` - SVG path detection and preparation
- `initMouseParallax()` - Interactive mouse-following effect
- `initBreathingEffect()` - Optional subtle scale pulsing
- `initRevealWipe()` - Alternative clip-path wipe reveal (bonus)
- `initParticleAssembly()` - Placeholder for future canvas-based particle effect

### 2. `/assets/js/init-footer-upgrade.js`
Integration wrapper that:
- Calls `initFooterDramatics()` with optimal configuration
- Respects `prefers-reduced-motion`
- Sets timing and easing parameters

### 3. CSS Enhancements in `/assets/css/custom.css`
Added to `.sf-closer__bigtype`:
```css
perspective: 1000px;
transform-style: preserve-3d;
will-change: transform;
```

Added support for:
- SVG path animation prep
- Breathing effect keyframes
- Reduced motion fallbacks

## Animation Sequence

### Phase 1: Letter Rise (1.2s duration)
```
Timeline:
0.0s - Letters start below viewport (y: 120px, rotated ±8deg, opacity: 0)
0.0s-0.8s - Staggered rise with back.out(1.4) easing
0.6s-0.9s - Subtle overshoot upward (-5px)
0.9s-1.2s - Settle to final position (y: 0)
```

**Stagger Pattern**: 0.08s per element (configurable)
**Easing**: `back.out(1.4)` creates satisfying "bounce settle"

### Phase 2: Mouse Parallax (continuous)
```
- Mouse position tracked relative to container center
- Normalized to -1 to 1 range
- Smooth interpolation (ease: 0.08)
- Each letter has slightly different depth (factor: 1 + i * 0.1)
- Movement range: ±8px base * depth factor
- Subtle rotation: mouseX * 1.5deg
```

### Phase 3: Optional Breathing (disabled by default)
```
- Gentle scale pulse (1.0 to 1.01)
- Duration: 3s sine.inOut
- Infinite yoyo repeat
```

## ScrollTrigger Configuration

```javascript
ScrollTrigger.create({
  trigger: '.sf-closer__bigtype',
  start: 'top 85%',      // Trigger when wordmark is 15% from bottom of viewport
  once: true,            // Only animate once (no reverse)
  onEnter: () => riseTL.play()
});
```

## Reduced Motion Fallback

When `prefers-reduced-motion: reduce` is detected:
```javascript
// Simple fade-in, no movement or rotation
gsap.fromTo(bigtype,
  { autoAlpha: 0 },
  { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }
);
```

CSS also removes all transforms and animations.

## Configuration Options

```javascript
initFooterDramatics({
  prefersReducedMotion: false,  // Auto-detected from system
  mouseParallax: true,           // Enable mouse-follow effect
  breathingEffect: false,        // Subtle scale pulsing (disabled to avoid competing)
  letterRiseStagger: 0.08,       // Seconds between each letter
  riseDistance: 120,             // Pixels to rise from (below viewport)
  riseRotation: 8                // Degrees of initial rotation (alternating ±)
});
```

## Browser Support

**Full Support:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

**Fallback (reduced motion):**
- All modern browsers
- IE11 (simple fade via GSAP)

**Performance:**
- 60fps target on desktop
- 30-60fps on mobile (adaptive based on device)
- GPU acceleration via `force3D: true`
- `will-change` hints for optimal layer promotion

## Future Enhancements

### Particle Assembly Mode (Advanced)
Potential implementation:
1. Render SVG logo to hidden canvas
2. Sample pixels as particles with target positions
3. Scatter particles randomly on load
4. Animate particles to form letters (magnetic attraction)
5. Crossfade canvas to actual SVG

**Benefits**: More dramatic, unique effect
**Costs**: Canvas overhead, more complex, potential performance impact on low-end devices

### Reveal Wipe Alternative
Already implemented as `initRevealWipe()`:
- Diagonal clip-path reveal
- Combined with scale-up effect
- Duration: 1.6s with power4.inOut easing

To use instead of letter rise:
```javascript
// In init-footer-upgrade.js, replace initFooterDramatics with:
import { initRevealWipe } from './footer-dramatics.js';
initRevealWipe(document.querySelector('.sf-closer__bigtype'));
```

## Design Philosophy

**Why Letter Rise + Mouse Parallax?**

1. **Signature Moment**: Like signing a masterpiece - deliberate, theatrical
2. **Living Typography**: The wordmark breathes and responds, not static
3. **Emotional Arc**: The page journey ends with flourish, not a thud
4. **Brand Resonance**: Reflects Subfracture's "art and systems" duality:
   - **Art**: Expressive motion, human-like parallax response
   - **Systems**: Precise timing, calculated stagger, mathematical easing

**Alternatives Considered:**

- **Option A (Letter Rise)**: ✅ Selected as primary
- **Option B (Particle Assembly)**: Deferred - too complex for MVP, saved for v2
- **Option C (Reveal Wipe)**: ✅ Implemented as alternative, available via config
- **Option D (Mouse Parallax)**: ✅ Selected as enhancement layer

**Final Choice**: A + D combined = Maximum impact with polish

## Testing Checklist

- [ ] Letter rise triggers at correct scroll position
- [ ] Stagger timing feels natural (not too fast/slow)
- [ ] Mouse parallax is smooth, no jank
- [ ] No layout shift during animation
- [ ] Reduced motion fallback works
- [ ] Mobile performance acceptable (30+ fps)
- [ ] No console errors
- [ ] Works with inline SVG logo (if available)
- [ ] Works with IMG fallback
- [ ] Compatible with existing footer animations (offices, mark, tagline)

## Console Output

When working correctly, you'll see:
```
Footer dramatics initialized - the crescendo awaits
Footer mouse parallax initialized
```

## Integration with Existing Footer

The dramatics module works **alongside** the existing `initFooterAnimations()`:
- Offices: Fade up first
- Mark: Fade in slightly after
- Tagline: Fade in
- **Bigtype**: Letter rise + parallax (our addition)

Original bigtype animation (y: viewport height → 0) is **replaced** by the new system.

## Performance Optimization

- SVG paths animated individually for best control
- `force3D: true` ensures GPU acceleration
- `will-change: transform` hints browser for layer promotion
- Smooth interpolation loop uses `requestAnimationFrame`
- Mouse events use `passive: true` listener
- Animation completes before parallax activates (no competing effects)

## Troubleshooting

**Letters don't animate individually:**
- Ensure logo is inline SVG, not IMG
- Check that SVG has individual path elements
- Fallback: entire logo animates as one (still looks good)

**Mouse parallax feels laggy:**
- Reduce ease factor (currently 0.08, try 0.15 for faster response)
- Reduce depth multiplier (currently 8px, try 5px)
- Check for other heavy scroll listeners competing for RAF

**Animation triggers too early/late:**
- Adjust ScrollTrigger `start` value (currently 'top 85%')
- 85% = triggers when element is 15% from bottom of viewport
- Lower % = triggers earlier, higher % = triggers later

## Credits

Designed for **Subfracture** brand experience.
Implementation: Claude Code (Opus 4.5)
Style inspiration: Award-winning studio sites, Apple product reveals, luxury brand landings

---

**Remember**: This is the signature. Make it count.
