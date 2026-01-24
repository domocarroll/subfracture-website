# Footer Dramatics - Animation Timing Guide

## Visual Timeline

```
USER SCROLLS TO FOOTER
        ↓
════════════════════════════════════════════════════════════════════════

SCROLL POSITION: Footer enters viewport at 85%

═══════════════════════════════════════════════════════════════════════

0.00s │ ▼ ANIMATION START
      │
      │ Letters: y:120px, rotate:±8°, opacity:0
      │ Position: Below viewport (invisible)
      │
      │ [waiting below viewport...]
      │
      │
0.00s │ ▶ LETTER 1 STARTS RISING
      │
      │     S
      │     ↑ (rising, rotating back to 0°)
      │
0.08s │ ▶ LETTER 2 STARTS RISING
      │
      │     S    U
      │     ↑    ↑
      │
0.16s │ ▶ LETTER 3 STARTS RISING
      │
      │     S    U    B
      │     ↑    ↑    ↑
      │
0.24s │ ▶ LETTER 4 STARTS RISING
      │
      │     S    U    B    F
      │     ↑    ↑    ↑    ↑
      │
      │ [continues for all letters with 0.08s stagger...]
      │
      │
0.60s │ ◆ FIRST LETTER REACHES TOP (0.60s after start)
      │
      │     S
      │     │ (overshoots by -5px)
      │
0.68s │ ◆ SECOND LETTER REACHES TOP
      │
      │     S    U
      │     │    │
      │
      │ [cascade continues...]
      │
      │
0.80s │ ★ FIRST LETTER SETTLES (small downward correction)
      │
      │     S
      │     ↓ (from -5px to 0px)
      │
0.90s │ ★ LETTERS BEGIN SETTLING
      │
      │     S    U    B    F    R    A    C    T    U    R    E
      │     =    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓    ↓
      │
      │
1.20s │ ✓ ANIMATION COMPLETE
      │
      │     S U B F R A C T U R E
      │     ========================
      │     All letters at rest, fully opaque
      │
      │
1.20s │ ▶ MOUSE PARALLAX ACTIVATES
      │
      │ [wordmark now responds to cursor position]
      │
      │     Mouse moves right →
      │     Letters shift right with varying depth:
      │     S→  U→→  B→→→  F→→→→ ...
      │
      │
∞     │ ⟳ CONTINUOUS MOUSE PARALLAX
      │
      │ Mouse movement creates living typography
      │ Smooth interpolation (ease: 0.08)
      │ Each letter has unique depth
      │
════════════════════════════════════════════════════════════════════════
```

## Easing Breakdown

### Phase 1: Rise (0.00s - 0.80s)
```
Easing: back.out(1.4)
Effect: Overshoots target, then bounces back
Curve:
  │
1 │        ╱╲
  │      ╱    ╲___
  │    ╱
  │  ╱
0 │╱
  └────────────────
  0s            1.2s
```

### Phase 2: Overshoot (0.60s - 0.90s)
```
Easing: power1.out
Effect: Sharp deceleration
Movement: 0px → -5px (upward)
```

### Phase 3: Settle (0.90s - 1.20s)
```
Easing: power2.out
Effect: Smooth deceleration
Movement: -5px → 0px (downward)
```

### Phase 4: Mouse Parallax (continuous)
```
Easing: Linear interpolation (lerp)
Factor: 0.08 (smooth, not instant)
Formula: current += (target - current) * 0.08

Effect: Buttery smooth follow
```

## Stagger Pattern

```
Letter Index │ Start Time │ Rotation │ Depth Factor
─────────────┼────────────┼──────────┼─────────────
S (0)        │ 0.00s      │ +8°      │ 1.0x
U (1)        │ 0.08s      │ -8°      │ 1.1x
B (2)        │ 0.16s      │ +8°      │ 1.2x
F (3)        │ 0.24s      │ -8°      │ 1.3x
R (4)        │ 0.32s      │ +8°      │ 1.4x
A (5)        │ 0.40s      │ -8°      │ 1.5x
C (6)        │ 0.48s      │ +8°      │ 1.6x
T (7)        │ 0.56s      │ -8°      │ 1.7x
U (8)        │ 0.64s      │ +8°      │ 1.8x
R (9)        │ 0.72s      │ -8°      │ 1.9x
E (10)       │ 0.80s      │ +8°      │ 2.0x
```

**Note**: Rotation alternates (±8°) to create natural wave effect

## Mouse Parallax Math

```javascript
// User moves mouse to position (clientX, clientY)
// Container bounds: rect = container.getBoundingClientRect()

// 1. Find center of container
centerX = rect.left + rect.width / 2
centerY = rect.top + rect.height / 2

// 2. Calculate distance from center
distanceX = clientX - centerX
distanceY = clientY - centerY

// 3. Normalize to -1 to 1 range
mouseX = distanceX / (rect.width / 2)   // -1 (left) to +1 (right)
mouseY = distanceY / (rect.height / 2)  // -1 (top) to +1 (bottom)

// 4. Apply smooth interpolation
currentX += (mouseX - currentX) * 0.08  // Ease factor
currentY += (mouseY - currentY) * 0.08

// 5. Calculate movement for each letter
for each letter[i]:
  factor = 1 + (i * 0.1)           // 1.0, 1.1, 1.2, ...
  x = currentX * 8px * factor      // Base movement * depth
  y = currentY * 8px * factor
  rotation = currentX * 1.5        // Subtle tilt based on X

// 6. Apply transform
gsap.set(letter, { x, y, rotation })
```

## Performance Characteristics

```
Metric                  │ Target  │ Typical  │ Fallback
────────────────────────┼─────────┼──────────┼──────────
Frame rate (desktop)    │ 60 fps  │ 60 fps   │ 30 fps
Frame rate (mobile)     │ 30 fps  │ 30-60    │ 15 fps
Animation duration      │ 1.2s    │ 1.2s     │ 0.8s (fade)
GPU layers created      │ 11*     │ 11*      │ 1
Memory overhead         │ ~2MB    │ ~2MB     │ ~500KB
ScrollTrigger cost      │ ~0.1ms  │ ~0.1ms   │ N/A
Mouse parallax cost     │ ~0.5ms  │ ~0.5ms   │ 0ms
Total CPU time/frame    │ <16ms   │ ~1ms     │ N/A

* One per letter/path
```

## Accessibility

```
Feature                 │ Implementation
────────────────────────┼────────────────────────────────
Reduced motion          │ Simple fade-in (0.8s)
Screen readers          │ SVG has aria-label, IMG has alt
Keyboard nav            │ No interaction required
Color contrast          │ Inherits from design (inverted)
Focus indicators        │ N/A (no focusable elements)
Animation duration      │ Reasonable (<2s, user controlled)
```

## Comparison with Alternatives

```
Approach            │ Impact │ Complexity │ Performance │ Chosen
────────────────────┼────────┼────────────┼─────────────┼────────
Letter Rise         │ ★★★★☆  │ ★★☆☆☆      │ ★★★★☆       │ ✓ YES
+ Mouse Parallax    │ ★★★★★  │ ★★★☆☆      │ ★★★★☆       │ ✓ YES
Particle Assembly   │ ★★★★★  │ ★★★★★      │ ★★☆☆☆       │ ✗ NO (v2)
Reveal Wipe         │ ★★★☆☆  │ ★★☆☆☆      │ ★★★★★       │ ✓ ALT
Simple Fade         │ ★☆☆☆☆  │ ★☆☆☆☆      │ ★★★★★       │ ✓ FALLBACK
```

## Testing Scenarios

```
Scenario                │ Expected Result
────────────────────────┼──────────────────────────────────────────
Normal scroll           │ Letters rise with stagger, settle smoothly
Fast scroll             │ Animation still completes (no skip)
Scroll back up          │ No reverse (once: true)
Mouse over footer       │ Letters follow cursor with depth
Mouse leave footer      │ Letters continue responding (global listener)
Mobile touch            │ No parallax (no mousemove events)
Reduced motion on       │ Simple fade-in, no movement
Slow device             │ May reduce to 30fps, still smooth
Multiple viewport sizes │ Responsive (clamp font sizing maintained)
```

## Tuning Parameters

Want to adjust the feel? Modify these values:

```javascript
// In init-footer-upgrade.js:

letterRiseStagger: 0.08   // ↑ Slower wave   ↓ Faster wave
riseDistance: 120         // ↑ More dramatic ↓ Subtler
riseRotation: 8           // ↑ More playful  ↓ More serious

// In footer-dramatics.js:

const ease = 0.08         // ↑ Slower follow ↓ Snappier
const depth = 8           // ↑ More parallax ↓ More subtle
```

---

**Pro Tip**: The timing is designed to feel like a conductor's final flourish.
Don't rush it. Let the crescendo build naturally.
