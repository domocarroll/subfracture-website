# Hero Rose Scroll Journey — Handover

## What Was Built
A scroll-driven Three.js rose that grows out of a WebGL fracture crack in the hero section. As the user scrolls, the stem emerges from the crack, leaves unfurl, and petals bloom — with the camera following the growth tip upward into the rose.

## Current State: Working, Needs Polish

### What Works
- Scroll drives rose growth (not a timer)
- Camera follows the growth tip via CatmullRomCurve3 (8 control points)
- Text fades in first 15% of scroll
- Crack canvas fades out 25-55% (stays visible during stem emergence)
- Hero section pinned for 3x viewport height (ScrollTrigger `+=200%`)
- All geometry hidden at scroll 0%, grows progressively
- Reduced motion: single static frame at full bloom
- IntersectionObserver pauses rendering when off-screen

### What Needs Improvement
1. **Leaves render too dark** — at 55-75% scroll the leaves are viewed from behind, showing only the dark backface. The leaf shader's `gl_FrontFacing` check dims the back to 65%. Consider either: making backface brighter, or rotating leaves to face camera better.

2. **90% view is from below the bloom** — camera ends up looking UP into the underside of the rose. Should probably approach from the side or slightly above to see the beautiful petal spiral from a better angle. Adjust the last 2-3 camera journey control points.

3. **Transition out of hero** — when the pin releases at 100% scroll, there's no graceful transition to the next section (ProblemsSolved). Consider a fade-to-cream or the rose camera pulling back.

4. **Stem is flat green** — the stem ShaderMaterial is a solid color with just a clip-plane fade. Could benefit from subtle lighting/normal variation to match the sophistication of the petal shader.

5. **No bloom post-processing** — was removed because EffectComposer breaks alpha transparency. Could potentially be re-added with a custom approach that preserves alpha, or accepted as-is (petals still look rich without it).

6. **Performance on mobile** — untested. Scale is 0.35, but bloom pass disabled. Should verify FPS on real device.

## Architecture

```
Hero.svelte (orchestrator)
├── .hero-bg  (z:1) → HeroCrack.svelte  (raw WebGL, ray-marched slab)
├── .hero-rose (z:1) → HeroRose.svelte  (Three.js, alpha:true, transparent)
└── .hero-fg  (z:2) → HeroContent.svelte (text, position:absolute)
```

ScrollTrigger pin on `.hero` section, `start: 'top top', end: '+=200%'`.
`scrollProgress` (0→1) passed as prop to HeroRose.

### Key Files
- `src/lib/components/hero/Hero.svelte` — pin + text fade + crack fade (onUpdate callback)
- `src/lib/components/hero/HeroRose.svelte` — ~730 lines, full Three.js scene
- `src/lib/components/hero/HeroCrack.svelte` — raw WebGL fragment shader
- `src/lib/components/hero/HeroContent.svelte` — hero text

### Key Constants (HeroRose.svelte)
```
SLAB_Y = 0.55        // clip plane height (slab surface)
ROSE_X = 0.448        // world X (from crack UV 0.66)
ROSE_Z = 0.04         // world Z (from crack UV 0.52)
ROSE_BASE_Y = 0.10    // rose group Y position
scale = 0.55          // rose group scale (desktop)
FOV ≈ 31°             // matches crack shader camera
```

### Growth Timeline (by scrollProgress)
```
0.00-0.05: Nothing visible
0.05-0.40: Stem grows (drawRange), thorns appear
0.30-0.55: Leaves unfurl (staggered by index)
0.42-0.55: Calyx sepals appear
0.45-0.60: Center bud forms
0.50-0.85: Petals bloom (18 petals, staggered 0.018 apart)
0.85+:     Full bloom, idle sway
```

### Camera Journey (8 control points, CatmullRomCurve3)
```
0.00: Wide overview (matches crack shader rest position)
0.12: Push toward crack impact zone
0.25: Close to slab surface, stem emerging
0.40: Rising alongside stem
0.55: Mid-stem, leaves visible
0.70: Approaching bloom
0.85: Close orbit around bloom
1.00: Inside bloom (currently from below — needs adjustment)
```

### Mouse Parallax
- Both crack and rose track mouse with identical formula
- Crack: `aY = (mx-0.5)*0.22`, `aX = 0.52+(my-0.5)*0.15`, lerp 0.04
- Rose: same math in `getOverviewCamera()`, blends out by 30% scroll

## Bugs Found & Fixed This Session
1. **Text not fading** — separate ScrollTrigger inside pinned container doesn't sync. Fixed: animate directly in pin's `onUpdate`.
2. **Sepals visible at scroll 0** — weren't part of growth animation. Fixed: `scale.set(0,0,0)` + scroll-driven growth.
3. **Stem invisible until 33% scroll** — ROSE_BASE_Y was -0.65, too far below clip plane. Fixed: raised to 0.10.
4. **HeroContent position:fixed** — prevented text fade (z-index 10 over rose). Fixed: changed to position:absolute, z-index:3.

## Prototype Reference
`/home/dom/subfracture-rose-threejs.html` — original standalone Three.js rose with full post-processing (7 passes), ground plane, particles, etc. The HeroRose component is a stripped-down port focused on the rose geometry + growth animation.

## Dev Server
```bash
npm run dev  # currently on port 5206 (ports 5199-5205 occupied)
```
