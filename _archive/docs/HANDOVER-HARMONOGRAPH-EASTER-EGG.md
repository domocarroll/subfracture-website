# HANDOVER: Subfracture Harmonograph Easter Egg

## Summary

Built an interactive harmonograph visualization that fills the Subfracture wordmark letterforms with mathematical pendulum drawings. The logo becomes a vessel for chaos — click to regenerate, presets for curated aesthetics, continuous breathing mode keeps it alive.

---

## Final Implementation

### Primary File
```
/home/dom/subfracture-website/harmonograph-v7-living.html
```

This is the production-ready version with all features:
- Continuous breathing (lines fade, new ones emerge)
- Flash transitions between states
- Mouse influence on parameters
- Line glow/bloom + tapering
- 5 curated presets
- Wild mode for chaos

### Dev Server
```bash
cd ~/subfracture-website
python3 -m http.server 8081
# Visit: http://localhost:8081/harmonograph-v7-living.html
```

---

## Controls

| Key | Action |
|-----|--------|
| **Click** | Random new harmonograph (controlled) |
| **Space/R** | Same as click |
| **W** | Wild mode — irrational ratios, full spectrum, chaos |
| **1** | Preset: Ember (warm orange) |
| **2** | Preset: Dense (heavy cyan fill) |
| **3** | Preset: Voltage (electric purple, high-freq) |
| **4** | Preset: Fracture (sharp crystalline) |
| **5** | Preset: Drift (irrational ratios, never repeats) |
| **C** | Toggle continuous breathing mode |
| **Mouse** | Subtle real-time influence on parameters |

---

## Technical Architecture

### Core Concept
- Harmonograph equation: `x(t) = A₁·e^(-d₁t)·sin(f₁t + φ₁) + A₂·e^(-d₂t)·sin(f₂t + φ₂)`
- Four pendulums (2 for X, 2 for Y)
- CSS `mask-image` clips canvas to logo shape
- Canvas sized to match logo (1361x1361)
- Amplitudes stretched to fill horizontal wordmark

### Key Parameters
```javascript
{
  A: amplitude (controls reach),
  f: frequency (controls pattern complexity),
  d: damping (controls decay rate),
  p: phase (controls starting position)
}
```

### Visual Features
- **Glow**: `shadowBlur: 8` with color-matched shadow
- **Tapering**: Line width decreases with `Math.exp(-decay * t)`
- **Breathing**: Canvas fades at `0.003` alpha per frame
- **Flash transitions**: Fade to black, apply new params, fade back

---

## Files Created (Exploration Versions)

| File | Description | Status |
|------|-------------|--------|
| `harmonograph-easter-egg.html` | V1: Ghost substrate concept | Archive |
| `harmonograph-v2-visible.html` | V2: Higher opacity blend | Archive |
| `harmonograph-v3-masked.html` | V3: Logo as mask (didn't fill) | Archive |
| `harmonograph-v4-inverse.html` | V4: Inverse mask attempt | Archive |
| `harmonograph-v5-filled.html` | V5: Working letter fill | Archive |
| `harmonograph-v6-light.html` | V6: Light theme variant | Keep |
| `harmonograph-v7-living.html` | V7: Final with breathing | **PRIMARY** |

### Cleanup Recommendation
Delete v1-v5 files. Keep:
- `harmonograph-v7-living.html` (dark, primary)
- `harmonograph-v6-light.html` (light variant)

---

## Assets

### Logo Used for Mask
```
/home/dom/subfracture-website/assets/subfracture-wordmark.png
```
- Source: `~/Downloads/PNG/SF_Logomark_transparent.png`
- Dimensions: 1361x1361 (square canvas, horizontal wordmark centered)

---

## Presets Reference

```javascript
ember:    { hue: 15,  sat: 75, light: 55 }  // Warm orange
dense:    { hue: 190, sat: 65, light: 55 }  // Cyan, thick lines
voltage:  { hue: 270, sat: 65, light: 60 }  // Purple, high-freq
fracture: { hue: 185, sat: 70, light: 50 }  // Teal, sharp decay
drift:    { hue: 175, sat: 55, light: 58 }  // Irrational freqs
```

---

## Implementation Notes for Integration

### As Easter Egg
Potential trigger mechanisms:
- Click logo 5 times rapidly
- Konami code
- Hold logo for 3 seconds
- `?chaos` URL parameter
- Hidden element in footer

### As Web Component (Future)
```html
<subfracture-harmonograph
  preset="fracture"
  theme="dark"
  continuous="true">
</subfracture-harmonograph>
```

### Responsive Considerations
- Canvas is 1361x1361, CSS scales via `width: 70vw; max-width: 900px`
- `aspect-ratio: 1/1` maintains square
- Mask scales with `mask-size: contain`

---

## What's Working Well

1. Letters fill properly with stretched harmonograph amplitudes
2. CSS mask is clean and performant
3. Breathing mode creates living presence
4. Flash transitions feel crisp, not gradient-mushy
5. Mouse influence adds subtle interactivity
6. Wild mode provides chaos escape valve

---

## Potential Future Enhancements

1. **Web Component packaging** — `<subfracture-harmonograph>`
2. **Export functionality** — SVG/GIF capture
3. **Audio dimension** — Frequencies as tones
4. **Scroll-linked reveal** — Drawing tied to scroll position
5. **localStorage persistence** — Remember last state

---

## Quick Start for Fresh Context

```bash
# Server (if not running)
cd ~/subfracture-website && python3 -m http.server 8081

# View
open http://localhost:8081/harmonograph-v7-living.html

# Files to work with
~/subfracture-website/harmonograph-v7-living.html  # Main
~/subfracture-website/harmonograph-v6-light.html   # Light variant
~/subfracture-website/assets/subfracture-wordmark.png  # Logo mask
```

---

*Handover created: 2026-01-16*
*For: Subfracture Website Integration*
