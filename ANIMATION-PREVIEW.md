# Footer Dramatics - Visual Preview

## Animation Sequence (ASCII Representation)

```
════════════════════════════════════════════════════════════════════════
USER SCROLLS TO FOOTER
════════════════════════════════════════════════════════════════════════


FRAME 0.0s - INITIAL STATE (Below viewport, invisible)
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │        [Other content above]           │
          │                                        │
          └────────────────────────────────────────┘
                           ↓
                        [Below viewport]

                     S  U  B  F  R  A  C  T  U  R  E
                    ⤿  ⤿  ⤿  ⤿  ⤿  ⤿  ⤿  ⤿  ⤿  ⤿  ⤿
                 (rotated ±8°, opacity: 0)


═══════════════════════════════════════════════════════════════════════
FRAME 0.2s - FIRST LETTERS START RISING
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │        [Footer header visible]         │
          │                                        │
          │                                        │
          └────────────────────────────────────────┘
                           ↑
                           S
                          ⤿ ↑

                              U  B
                             ⤿  ⤿


═══════════════════════════════════════════════════════════════════════
FRAME 0.4s - WAVE BUILDS
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │           S                            │
          │          ⤿ ↑                           │
          │              U  B  F                   │
          │             ⤿  ⤿  ⤿                    │
          └────────────────────────────────────────┘
                                 R  A  C
                                ⤿  ⤿  ⤿


═══════════════════════════════════════════════════════════════════════
FRAME 0.6s - FIRST LETTERS REACH TOP (begin overshoot)
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │        S  U  B  F                      │
          │        ↑  │  │  ⤿                      │
          │       (overshooting -5px)              │
          │                      R  A  C  T        │
          │                     │  │  │  ⤿        │
          └────────────────────────────────────────┘
                                            U  R  E
                                           ⤿  ⤿  ⤿


═══════════════════════════════════════════════════════════════════════
FRAME 0.8s - WAVE COMPLETES, ALL LETTERS VISIBLE
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │     S  U  B  F  R  A  C  T  U  R  E   │
          │     ↓  ↓  ↓  │  │  │  │  │  ⤿  ⤿  ⤿  │
          │    (settling downward from overshoot)  │
          │                                        │
          └────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
FRAME 1.0s - SETTLING INTO FINAL POSITION
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │  S  U  B  F  R  A  C  T  U  R  E      │
          │  ↓  ↓  ↓  ↓  ↓  ↓  ↓  │  │  │  │      │
          │     (gentle downward correction)       │
          │                                        │
          └────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
FRAME 1.2s - FINAL RESTING STATE (Animation complete)
═══════════════════════════════════════════════════════════════════════

Viewport: ┌────────────────────────────────────────┐
          │                                        │
          │   S U B F R A C T U R E               │
          │   ═══════════════════════               │
          │   (fully opaque, at rest)              │
          │                                        │
          └────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
CONTINUOUS - MOUSE PARALLAX ACTIVE
═══════════════════════════════════════════════════════════════════════

Mouse at center:
┌────────────────────────────────────────┐
│                                        │
│   S U B F R A C T U R E               │
│   ═══════════════════════               │
│                                        │
└────────────────────────────────────────┘


Mouse moves RIGHT →
┌────────────────────────────────────────┐
│                                        │
│    S→ U→→ B→→→ F→→→→ R→→→→→ A→→→→→→ C→→→→→→→ T→→→→→→→→ U→→→→→→→→→ R→→→→→→→→→→ E→→→→→→→→→→→
│    (each letter shifts with increasing depth)
│                                        │
└────────────────────────────────────────┘


Mouse moves UP ↑
┌────────────────────────────────────────┐
│   S↑ U↑↑ B↑↑↑ F↑↑↑↑ R↑↑↑↑↑ A↑↑↑↑↑↑ C↑↑↑↑↑↑↑ T↑↑↑↑↑↑↑↑ U↑↑↑↑↑↑↑↑↑ R↑↑↑↑↑↑↑↑↑↑ E↑↑↑↑↑↑↑↑↑↑↑
│                                        │
│   (letters rise with varying depth)    │
│                                        │
└────────────────────────────────────────┘


Mouse moves diagonally →↑
┌────────────────────────────────────────┐
│    S↗ U↗↗ B↗↗↗ F↗↗↗↗ R↗↗↗↗↗ ...         │
│    (combined X and Y movement)         │
│                                        │
│                                        │
└────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════
```

## Side View (Y-axis movement)

```
Initial Position (t=0.0s):
                        ────────── Viewport Bottom
                                 ↑
                                120px gap
                                 ↓
                        S U B F R A C T U R E
                        (below viewport, hidden)


Rising Phase (t=0.0s - 0.8s):
                        ────────── Viewport Bottom
                        S U B F R A C T U R E
                        ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
                        (rising with stagger)


Overshoot Phase (t=0.6s - 0.9s):
                        S U B F R A C T U R E
                        ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑ ↑
                        (briefly above target)
                        ────────── Viewport Bottom


Settle Phase (t=0.9s - 1.2s):
                        S U B F R A C T U R E
                        ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
                        (gentle correction down)
                        ────────── Viewport Bottom


Final Position (t=1.2s+):
                        S U B F R A C T U R E
                        ═══════════════════════
                        ────────── Viewport Bottom
                        (at rest, ready for parallax)
```

## Rotation View (Initial → Final)

```
Letter S (index 0):
t=0.0s:  ╱S   (rotated +8°, rising)
         ↑
t=0.6s:  │S   (rotation → 0°)
         │
t=1.2s:  ─S─  (at rest, rotation: 0°)


Letter U (index 1):
t=0.0s:  S╲   (rotated -8°, rising)
         ↑
t=0.6s:  │S   (rotation → 0°)
         │
t=1.2s:  ─S─  (at rest, rotation: 0°)


Pattern continues with alternating rotation...
```

## Opacity Fade

```
t=0.0s:  S U B F R A C T U R E
         ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢  (opacity: 0, invisible)

t=0.4s:  S U B F R A C T U R E
         ▣ ▤ ▥ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢  (fading in with stagger)

t=0.8s:  S U B F R A C T U R E
         ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▤ ▥ ▢ ▢  (most visible)

t=1.2s:  S U B F R A C T U R E
         ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓ ▓  (opacity: 1, fully visible)
```

## Mouse Parallax Depth Map

```
Mouse Position: Center
Depth Factor:   1.0  1.1  1.2  1.3  1.4  1.5  1.6  1.7  1.8  1.9  2.0
Letter:         S    U    B    F    R    A    C    T    U    R    E
Movement:       0px  0px  0px  0px  0px  0px  0px  0px  0px  0px  0px


Mouse Position: Right edge (+1.0)
Depth Factor:   1.0  1.1  1.2  1.3  1.4  1.5  1.6  1.7  1.8  1.9  2.0
Letter:         S    U    B    F    R    A    C    T    U    R    E
Movement:       8px  9px  10   11   11   12   13   14   14   15   16
                →    →→   →→→  →→→→ ...progressively more

Visual:         S   U   B   F    R    A     C      T       U        R         E
                →   →→  →→→ →→→→ →→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→→
```

## Easing Curve Visualization

```
Rise Phase (back.out(1.4)):

1.0 │                      ╱╲
    │                    ╱    ╲___
    │                  ╱
0.5 │              ╱
    │          ╱
    │      ╱
0.0 │╱
    └──────────────────────────────
    0s    0.2s   0.4s   0.6s   0.8s

    ↑ Slow start
        ↑ Acceleration
              ↑ Peak (overshoot)
                    ↑ Settle


Parallax Interpolation (linear with ease factor):

Target
  ↓
  │ ┌─────────────────────────────→ (instant, no ease)
  │ │
  │ │  ╱───────────────────────→ (ease: 0.3, snappy)
  │ │╱
  │ ╱
  │╱─────────────────────────→ (ease: 0.08, smooth) ← We use this
  │
Current

Time →
```

## Performance Graph (Expected)

```
Frame Rate During Animation:

60fps ┤ ████████████████████████████████████
      │
      │
30fps ┤
      │
      │
 0fps └─────────────────────────────────────→
      Load  Scroll  Trigger  Rise  Parallax
                     ↑
                     Animation maintains 60fps throughout
```

## Device Comparison

```
Desktop (60fps):
┌────────────────────────────────────────┐
│   S U B F R A C T U R E               │  ← Buttery smooth
│   ═══════════════════════               │  ← Full parallax
└────────────────────────────────────────┘

Mobile (30-60fps):
┌────────────────────────────────────────┐
│   S U B F R A C T U R E               │  ← Still smooth
│   ═══════════════════════               │  ← No parallax (by design)
└────────────────────────────────────────┘

Reduced Motion (simple fade):
┌────────────────────────────────────────┐
│   [Fades in from opacity 0 → 1]        │  ← Accessible
│   S U B F R A C T U R E               │  ← No movement
└────────────────────────────────────────┘
```

## Comparison: IMG vs Inline SVG

```
Using IMG tag (current):

Animation treats logo as single unit:
┌────────────────────────────────────────┐
│                                        │
│   [SUBFRACTURE]                        │  ← Entire logo rises together
│        ↑                               │  ← Still looks great!
│   (single element)                     │
│                                        │
└────────────────────────────────────────┘


Using Inline SVG (enhanced):

Animation treats each letter separately:
┌────────────────────────────────────────┐
│                                        │
│   S  U  B  F  R  A  C  T  U  R  E    │  ← Each letter independent
│   ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑  ↑    │  ← Wave effect
│   (individual paths)                   │
│                                        │
└────────────────────────────────────────┘
```

## State Transitions

```
┌───────────┐
│  HIDDEN   │  (Initial: below viewport)
└─────┬─────┘
      │ User scrolls to footer
      ↓
┌───────────┐
│  RISING   │  (Letters ascending with stagger)
└─────┬─────┘
      │ Reach target position
      ↓
┌───────────┐
│OVERSHOOTING│ (Brief upward overshoot)
└─────┬─────┘
      │ Correction kicks in
      ↓
┌───────────┐
│ SETTLING  │  (Gentle downward correction)
└─────┬─────┘
      │ Animation complete
      ↓
┌───────────┐
│  RESTING  │  (At final position)
└─────┬─────┘
      │ Parallax activates
      ↓
┌───────────┐
│  LIVING   │  (Continuous mouse response)
└───────────┘
      │
      └──→ (stays in this state forever)
```

---

## Live Preview

Want to see this in action?

```bash
open test-footer-dramatics.html
```

Scroll down and watch the choreography unfold.

---

**This is the crescendo. The signature. The final flourish.**

*Built to be remembered.*
