# Avenue C: Fluid Canvas Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUID CANVAS SYSTEM                       │
│                    WebGL2 Fluid Simulation Engine                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
         ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
         │   WebGL2     │ │  Drawing   │ │ Interaction│
         │   Pipeline   │ │ Emergence  │ │   System   │
         └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                 │               │               │
                 └───────────────┼───────────────┘
                                 │
                        ┌────────▼────────┐
                        │  Canvas Output  │
                        │  (Cream + Ink)  │
                        └─────────────────┘
```

---

## WebGL2 Pipeline Architecture

### Framebuffer Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SIMULATION LOOP (60 FPS)                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │  1. CURL (Velocity → Curl FBO)             │
        │     Shader: curl.glsl                      │
        │     Calculates vorticity of velocity field │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  2. VORTICITY (Curl + Velocity → Velocity) │
        │     Shader: vorticity.glsl                 │
        │     Amplifies swirling motion              │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  3. DIVERGENCE (Velocity → Divergence FBO) │
        │     Shader: divergence.glsl                │
        │     Measures velocity field divergence     │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  4. PRESSURE SOLVER (Iterative Jacobi)     │
        │     Shader: pressure.glsl                  │
        │     20 iterations (desktop) / 10 (mobile)  │
        │     Ping-pong between pressure FBOs        │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  5. GRADIENT SUBTRACT (Pressure + Velocity)│
        │     Shader: gradientSubtract.glsl          │
        │     Makes velocity divergence-free         │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  6. ADVECTION - VELOCITY                   │
        │     Shader: advection.glsl                 │
        │     Move velocity by itself                │
        │     Dissipation: 0.99                      │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  7. ADVECTION - DENSITY                    │
        │     Shader: advection.glsl                 │
        │     Move density by velocity               │
        │     Dissipation: 0.98                      │
        └────────────────┬───────────────────────────┘
                         ▼
        ┌────────────────────────────────────────────┐
        │  8. DISPLAY (Density → Screen)             │
        │     Shader: display.glsl                   │
        │     Render as ink on cream background      │
        └────────────────────────────────────────────┘
```

### Shader Programs

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHADER PROGRAMS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. DISPLAY                                                      │
│     Input:  Density (RGBA16F)                                   │
│     Output: Screen (RGB8)                                       │
│     Logic:  mix(cream #f5f5f0, black #020202, density)         │
│                                                                  │
│  2. SPLAT                                                        │
│     Input:  Target field, position, radius, color              │
│     Output: Updated field                                       │
│     Logic:  Gaussian splat injection                           │
│                                                                  │
│  3. ADVECTION                                                    │
│     Input:  Velocity (RG16F), Source field, dt, dissipation    │
│     Output: Advected field                                      │
│     Logic:  Semi-Lagrangian backtrace                          │
│                                                                  │
│  4. DIVERGENCE                                                   │
│     Input:  Velocity (RG16F)                                    │
│     Output: Divergence (R16F)                                   │
│     Logic:  ∇·v = (∂u/∂x + ∂v/∂y)                             │
│                                                                  │
│  5. CURL                                                         │
│     Input:  Velocity (RG16F)                                    │
│     Output: Curl (R16F)                                         │
│     Logic:  ∇×v = (∂v/∂x - ∂u/∂y)                             │
│                                                                  │
│  6. VORTICITY                                                    │
│     Input:  Velocity (RG16F), Curl (R16F), curl strength       │
│     Output: Velocity with vorticity confinement                │
│     Logic:  f = ε(∇|ω| × ω)                                    │
│                                                                  │
│  7. PRESSURE                                                     │
│     Input:  Pressure (R16F), Divergence (R16F)                 │
│     Output: Updated pressure                                    │
│     Logic:  Jacobi iteration: p = (pL+pR+pT+pB-div)/4          │
│                                                                  │
│  8. GRADIENT_SUBTRACT                                            │
│     Input:  Pressure (R16F), Velocity (RG16F)                  │
│     Output: Divergence-free velocity                           │
│     Logic:  v = v - ∇p                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Structures

### Framebuffer Objects

```
┌──────────────────────────────────────────────────────────────┐
│                      FRAMEBUFFERS                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DENSITY (Double-buffered)                                   │
│  ├─ Resolution: 512×512 (desktop) / 256×256 (mobile)        │
│  ├─ Format: RGBA16F                                          │
│  ├─ Filter: LINEAR                                           │
│  └─ Usage: Stores ink density (RGB channels)                │
│                                                               │
│  VELOCITY (Double-buffered)                                  │
│  ├─ Resolution: 512×512 (desktop) / 256×256 (mobile)        │
│  ├─ Format: RG16F                                            │
│  ├─ Filter: LINEAR                                           │
│  └─ Usage: Stores velocity field (XY in RG)                 │
│                                                               │
│  DIVERGENCE (Single)                                         │
│  ├─ Resolution: 512×512 (desktop) / 256×256 (mobile)        │
│  ├─ Format: R16F                                             │
│  ├─ Filter: NEAREST                                          │
│  └─ Usage: Temporary divergence computation                 │
│                                                               │
│  CURL (Single)                                               │
│  ├─ Resolution: 512×512 (desktop) / 256×256 (mobile)        │
│  ├─ Format: R16F                                             │
│  ├─ Filter: NEAREST                                          │
│  └─ Usage: Temporary curl computation                       │
│                                                               │
│  PRESSURE (Double-buffered)                                  │
│  ├─ Resolution: 512×512 (desktop) / 256×256 (mobile)        │
│  ├─ Format: R16F                                             │
│  ├─ Filter: NEAREST                                          │
│  └─ Usage: Pressure field (iterative solver)                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Memory Usage

```
Desktop (512×512):
├─ Density:     2 × 512² × 8 bytes  = 4.19 MB
├─ Velocity:    2 × 512² × 4 bytes  = 2.10 MB
├─ Divergence:  1 × 512² × 2 bytes  = 0.52 MB
├─ Curl:        1 × 512² × 2 bytes  = 0.52 MB
├─ Pressure:    2 × 512² × 2 bytes  = 1.05 MB
└─ TOTAL:                            ≈ 8.4 MB VRAM

Mobile (256×256):
├─ Density:     2 × 256² × 8 bytes  = 1.05 MB
├─ Velocity:    2 × 256² × 4 bytes  = 0.52 MB
├─ Divergence:  1 × 256² × 2 bytes  = 0.13 MB
├─ Curl:        1 × 256² × 2 bytes  = 0.13 MB
├─ Pressure:    2 × 256² × 2 bytes  = 0.26 MB
└─ TOTAL:                            ≈ 2.1 MB VRAM
```

---

## Drawing Emergence System

### Image Processing Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                  DRAWING EMERGENCE PIPELINE                      │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │  1. LOAD IMAGE                │
                │     • CORS-enabled Image()    │
                │     • Async loading           │
                │     • Error handling          │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  2. OFFSCREEN CANVAS          │
                │     • Size: dyeResolution     │
                │     • Draw cream background   │
                │     • Center and scale image  │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  3. EXTRACT PIXELS            │
                │     • getImageData()          │
                │     • RGBA uint8 array        │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  4. THRESHOLD & SAMPLE        │
                │     • Brightness < 150        │
                │     • Sample every 4-8px      │
                │     • Calculate density       │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  5. INJECT SPLATS             │
                │     • Per-pixel splat         │
                │     • Random velocity         │
                │     • Density × intensity     │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  6. FLUID DYNAMICS            │
                │     • Natural emergence       │
                │     • Organic coalescing      │
                │     • Eventual dissolution    │
                └───────────────────────────────┘
```

### Sampling Pattern

```
Image (512×512):
┌─────────────────────────────────────────┐
│ • • • • • • • • • • • • • • • • • • •  │  • = Sample point
│ • • • • • • • • • • • • • • • • • • •  │  Step = 4px (desktop)
│ • • • • • • • • • • • • • • • • • • •  │       8px (mobile)
│ • • • • • • • • • • • • • • • • • • •  │
│ • • • • • • • • • • • • • • • • • • •  │  Total samples:
│ • • • • • • • • • • • • • • • • • • •  │  Desktop: ~16,384
│ • • • • • • • • • • • • • • • • • • •  │  Mobile:  ~4,096
│ • • • • • • • • • • • • • • • • • • •  │
│ • • • • • • • • • • • • • • • • • • •  │  Process time:
│ • • • • • • • • • • • • • • • • • • •  │  Desktop: ~50ms
└─────────────────────────────────────────┘  Mobile:  ~20ms
```

---

## Interaction System

### Event Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     INTERACTION SYSTEM                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │   MOUSE      │ │   TOUCH    │ │  AMBIENT   │
        │  MOVEMENT    │ │   GESTURE  │ │    FLOW    │
        └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                ┌───────────────▼───────────────┐
                │  NORMALIZE COORDINATES        │
                │  • x: clientX / width         │
                │  • y: 1 - (clientY / height)  │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  CALCULATE VELOCITY           │
                │  • dx = x_new - x_old         │
                │  • dy = y_new - y_old         │
                │  • Scale by multiplier        │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  INJECT SPLAT                 │
                │  • Velocity → velocity FBO    │
                │  • Density → density FBO      │
                │  • Gaussian distribution      │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  FLUID SIMULATION             │
                │  • Advection propagates       │
                │  • Curl amplifies swirls      │
                │  • Pressure maintains flow    │
                └───────────────────────────────┘
```

### Pointer State Machine

```
IDLE
  │
  ├─ mousedown/touchstart → DOWN
  │                           │
  │                           ├─ mousemove/touchmove → DRAGGING
  │                           │    ├─ Inject splats continuously
  │                           │    └─ Calculate velocity
  │                           │
  │                           └─ mouseup/touchend → IDLE
  │
  └─ mousemove (no button) → HOVER
       └─ Light splat on movement
```

---

## ScrollTrigger Integration

### Trigger Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SCROLL TRIGGER SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │  GSAP ScrollTrigger           │
                │  • Monitor section positions  │
                │  • Detect scroll events       │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  Section Entry Detection      │
                │  • Start: "top 60%"           │
                │  • End: "bottom 40%"          │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  onEnter Callback             │
                │  • Check if already emerged   │
                │  • Load drawing image         │
                │  • Call emergeDrawing()       │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  Drawing Emergence            │
                │  • Image processing           │
                │  • Splat injection            │
                │  • Natural coalescing         │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  onLeave Callback (Optional)  │
                │  • Inject turbulence          │
                │  • Accelerate dissolution     │
                └───────────────────────────────┘
```

### Section Mapping

```
┌─────────────────────────────────────────────────────────────────┐
│                         PAGE LAYOUT                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  INTRO SECTION                                       │      │
│  │  • No drawing                                        │      │
│  │  • Pure fluid background                            │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  APPROACH SECTION                      ┌───────────┐ │      │
│  │  • Drawing: Bagua (IMG_0154.jpg)      │ Trigger:  │ │      │
│  │  • Emerges at 60% viewport            │ top 60%   │ │      │
│  │  • Intensity: 0.8                      └───────────┘ │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  SPACER SECTION                                      │      │
│  │  • No drawing                                        │      │
│  │  • Bagua disperses                                   │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  FIGHT SECTION                         ┌───────────┐ │      │
│  │  • Drawing: Monk (IMG_0161.jpg)       │ Trigger:  │ │      │
│  │  • Emerges at 60% viewport            │ top 60%   │ │      │
│  │  • Intensity: 0.8                      └───────────┘ │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  SPACER SECTION                                      │      │
│  │  • No drawing                                        │      │
│  │  • Monk disperses                                    │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  SPIRIT SECTION                        ┌───────────┐ │      │
│  │  • Drawing: Sadhu (IMG_0159.jpg)      │ Trigger:  │ │      │
│  │  • Emerges at 60% viewport            │ top 60%   │ │      │
│  │  • Intensity: 0.8                      └───────────┘ │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  FINALE SECTION                                      │      │
│  │  • No drawing                                        │      │
│  │  • Pure fluid return                                 │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Monitoring

### Metrics Collection

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE MONITORING                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │     FPS      │ │   Memory   │ │  GL Calls  │
        │   Counter    │ │   Usage    │ │   Budget   │
        └───────┬──────┘ └─────┬──────┘ └─────┬──────┘
                │               │               │
                └───────────────┼───────────────┘
                                │
                ┌───────────────▼───────────────┐
                │  Adaptive Quality System      │
                │  • FPS < 30 → Reduce res      │
                │  • FPS < 20 → Reduce iters    │
                │  • FPS < 15 → Disable curl    │
                └───────────────┬───────────────┘
                                ▼
                ┌───────────────────────────────┐
                │  User Notification            │
                │  • Console warnings           │
                │  • Optional UI indicator      │
                └───────────────────────────────┘
```

### Frame Budget

```
Target: 60 FPS (16.67ms per frame)

Desktop Budget (512×512):
├─ Curl:              ~0.5ms
├─ Vorticity:         ~0.5ms
├─ Divergence:        ~0.5ms
├─ Pressure (20x):    ~4.0ms
├─ Gradient Subtract: ~0.5ms
├─ Velocity Advect:   ~0.5ms
├─ Density Advect:    ~0.5ms
├─ Display:           ~0.3ms
├─ CPU overhead:      ~0.5ms
├─ Interaction:       ~0.2ms
└─ TOTAL:             ~8.0ms ✓ (47% budget)

Mobile Budget (256×256):
├─ Curl:              ~0.3ms
├─ Vorticity:         ~0.3ms
├─ Divergence:        ~0.3ms
├─ Pressure (10x):    ~2.0ms
├─ Gradient Subtract: ~0.3ms
├─ Velocity Advect:   ~0.3ms
├─ Density Advect:    ~0.3ms
├─ Display:           ~0.2ms
├─ CPU overhead:      ~0.5ms
├─ Interaction:       ~0.2ms
└─ TOTAL:             ~4.7ms ✓ (28% budget)
```

---

## Error Handling & Fallbacks

### Graceful Degradation Chain

```
┌─────────────────────────────────────────────────────────────────┐
│                     INITIALIZATION FLOW                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────▼───────────────┐
                │  Check WebGL2 Support         │
                └───────────────┬───────────────┘
                                │
                    ┌───────────┴──────────┐
                    │ YES                  │ NO
                    ▼                      ▼
        ┌─────────────────────┐  ┌─────────────────────┐
        │  Initialize WebGL2  │  │  Static Background  │
        │  • Create context   │  │  • Cream color      │
        │  • Check extensions │  │  • Subtle texture   │
        └──────────┬──────────┘  └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Check Float Support│
        └──────────┬──────────┘
                   │
       ┌───────────┴──────────┐
       │ YES                  │ NO
       ▼                      ▼
┌──────────────┐    ┌──────────────────┐
│ Full Quality │    │ Reduced Quality  │
│ • RGBA16F    │    │ • RGBA8          │
│ • RG16F      │    │ • Limited blur   │
└──────┬───────┘    └──────────────────┘
       │
       ▼
┌──────────────────┐
│ Monitor FPS      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Adaptive Quality │
│ • Reduce res     │
│ • Reduce iters   │
└──────────────────┘
```

---

## File Structure

```
subfracture-website/
│
├── assets/
│   ├── js/
│   │   └── visions/
│   │       └── fluid-canvas.js         (1,077 lines, 28KB)
│   │           ├── Module exports
│   │           ├── WebGL2 initialization
│   │           ├── Shader compilation
│   │           ├── Framebuffer management
│   │           ├── Simulation step
│   │           ├── Drawing emergence
│   │           └── Interaction handling
│   │
│   ├── css/
│   │   └── visions/
│   │       └── fluid-canvas.css        (315 lines, 6KB)
│   │           ├── Canvas positioning
│   │           ├── Responsive design
│   │           ├── Accessibility
│   │           └── Animations
│   │
│   └── drawings/
│       ├── IMG_0154.jpg                (Bagua, 265KB)
│       ├── IMG_0161.jpg                (Monk, 188KB)
│       └── IMG_0159.jpg                (Sadhu, 942KB)
│
├── fluid-canvas-demo.html              (430 lines, 11KB)
│   ├── Demo sections
│   ├── ScrollTrigger setup
│   ├── Debug mode
│   └── Interaction examples
│
├── FLUID-CANVAS-GUIDE.md               (632 lines, 14KB)
│   ├── Quick start
│   ├── API reference
│   ├── Configuration
│   ├── Performance
│   └── Debugging
│
├── AVENUE-C-COMPLETION-REPORT.md       (Comprehensive)
│   ├── Technical summary
│   ├── Validation results
│   ├── Performance benchmarks
│   └── Production checklist
│
├── FLUID-CANVAS-ARCHITECTURE.md        (This file)
│   ├── System overview
│   ├── Pipeline diagrams
│   ├── Data structures
│   └── Flow charts
│
└── validate-fluid-canvas.cjs           (Validation script)
    └── 63 automated checks
```

---

## Integration Points

### External Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPENDENCY GRAPH                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
        │   Browser    │ │    GSAP    │ │  ES6 Env   │
        │    WebGL2    │ │ScrollTrigger│ │  (Native)  │
        └──────────────┘ └────────────┘ └────────────┘
               │                 │               │
               │                 │               │
               └─────────────────┼───────────────┘
                                 │
                        ┌────────▼────────┐
                        │ fluid-canvas.js │
                        └─────────────────┘
```

### Module Interface

```javascript
// Public API
export default {
  // Lifecycle
  init(options)           // Initialize with config
  destroy()               // Cleanup resources

  // Drawing System
  emergeDrawing(path, intensity)  // Inject drawing
  splat(x, y, dx, dy, color)     // Manual splat

  // Configuration (read/write)
  config: {
    simResolution,
    densityDissipation,
    velocityDissipation,
    pressure,
    pressureIterations,
    curl,
    splatRadius,
    velocityScale,
    baseFlow
  },

  // Internal State (read-only for debug)
  canvas,
  gl,
  isRunning,
  isMobile,
  framebuffers,
  programs
}
```

---

## Deployment Topology

### Production Setup

```
┌─────────────────────────────────────────────────────────────────┐
│                         CDN LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ GSAP 3.12.5  │  │ ScrollTrigger│  │  Drawing PNGs│          │
│  │ (jsdelivr)   │  │ (jsdelivr)   │  │  (optimized) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      STATIC HOSTING                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  fluid-canvas.js (minified, ~15KB gzipped)              │  │
│  │  fluid-canvas.css (minified, ~2KB gzipped)              │  │
│  │  Drawings (WebP optimized, ~500KB total)                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  WebGL2 Canvas (GPU-accelerated)                        │  │
│  │  • Framebuffers: ~8MB VRAM (desktop) / ~2MB (mobile)    │  │
│  │  • Texture cache: ~1.5MB for drawings                   │  │
│  │  • Program cache: ~50KB compiled shaders                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

This architecture document provides a comprehensive visual guide to the fluid canvas system's internals, making it easier to understand, maintain, and extend.

