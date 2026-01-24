# 🖋️ LIVING INK: Quick Start Guide

## What You Got

AVENUE A: THE LIVING INK is now installed and ready. This vision module makes drawings breathe with AI motion and reveals strategic diagrams through self-drawing SVG animations.

---

## 📂 Files Created

### Core Module
- `/home/dom/subfracture-website/assets/js/visions/living-ink.js` (12KB)
- `/home/dom/subfracture-website/assets/css/visions/living-ink.css` (6.7KB)

### Demos & Examples
- `/home/dom/subfracture-website/living-ink-demo.html` - Complete feature demo
- `/home/dom/subfracture-website/living-ink-integration-example.html` - Real-world usage

### AI Video Generator
- `/home/dom/subfracture-website/scripts/generate-breathing-videos.js` - Replicate API script
- `/home/dom/subfracture-website/scripts/preview-breathing.html` - Side-by-side comparisons
- `/home/dom/subfracture-website/scripts/package-snippet.json` - Dependencies

### Documentation
- `/home/dom/subfracture-website/LIVING-INK-README.md` - Full technical docs
- `/home/dom/subfracture-website/LIVING-INK-QUICKSTART.md` - This file

---

## ⚡ Quick Start (30 seconds)

### 1. View the Demo

```bash
cd /home/dom/subfracture-website
python3 -m http.server 8000
```

Then open: `http://localhost:8000/living-ink-demo.html`

**What you'll see:**
- ✅ Self-drawing SVG diagrams (working immediately)
- ⏸️ Breathing video containers (showing static images until videos generated)

---

## 🎬 Generate AI Breathing Videos (5 minutes)

### Step 1: Install Dependencies

```bash
cd /home/dom/subfracture-website/scripts
npm install replicate dotenv
```

### Step 2: Add API Key

Create `.env` file in project root:

```bash
echo "REPLICATE_API_TOKEN=your_token_here" > .env
```

Get token at: https://replicate.com/account/api-tokens

### Step 3: Generate Videos

```bash
cd /home/dom/subfracture-website
node scripts/generate-breathing-videos.js
```

This will:
- Process 6 priority drawings
- Generate ~2-4MB video per drawing
- Save to `/assets/videos/breathing/`
- Take ~15-20 minutes total (3-5 min per video)

### Step 4: View Results

Open: `http://localhost:8000/scripts/preview-breathing.html`

Compare static images with breathing videos side-by-side.

---

## 🔌 Add to Your Site

### Method 1: Direct Import (Simplest)

Add to your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="/assets/css/visions/living-ink.css">

<!-- JavaScript (at end of body) -->
<script type="module">
  import LivingInk from '/assets/js/visions/living-ink.js';
  document.addEventListener('DOMContentLoaded', () => {
    LivingInk.init();
  });
</script>
```

### Method 2: Via main.js

Add to `/home/dom/subfracture-website/assets/js/main.js`:

```javascript
import LivingInk from './visions/living-ink.js';
import '../css/visions/living-ink.css';

// In your ready() function:
LivingInk.init();
```

---

## 📝 Basic Usage

### Self-Drawing Diagram

```html
<div class="living-ink__diagram-wrapper">
  <div
    class="living-ink__diagram"
    data-diagram-type="bagua"
    data-stroke-color="#1a1a1a"
    data-stroke-width="2"
    data-duration="3.5"
  >
    <!-- SVG injected automatically -->
  </div>
</div>
```

**Available diagrams:**
- `bagua` - I-Ching octagon (sacred geometry)
- `joySpiral` - Upward expansion
- `fearSpiral` - Downward contraction
- `infinity` - Continuous flow
- `trinity` - Stable triangle

### Breathing Drawing

```html
<div
  class="living-ink__breathing"
  data-video-src="/assets/videos/breathing/IMG_0159_breathing.mp4"
  data-fallback-src="/assets/drawings/IMG_0159.jpg"
  data-alt="Sadhu in meditation"
>
  <!-- Video/image injected automatically -->
</div>
```

**Without video yet?** Just omit `data-video-src` - static image shows until ready.

---

## 🎨 Layouts

### Side-by-Side
```html
<div class="living-ink__composite">
  <div class="living-ink__breathing" ...></div>
  <div class="living-ink__diagram-wrapper">...</div>
</div>
```

### Gallery
```html
<div class="living-ink__gallery">
  <div class="living-ink__gallery-item">
    <div class="living-ink__breathing" ...></div>
    <p class="living-ink__caption">Caption text</p>
  </div>
  <!-- Repeat... -->
</div>
```

### Hero Overlay
```html
<div class="living-ink__hero">
  <div class="living-ink__breathing" ...></div>
  <div class="living-ink__diagram-wrapper">
    <div class="living-ink__diagram" ...></div>
    <h2>Your Text Here</h2>
  </div>
</div>
```

---

## 🔧 Customization

### Custom Diagram Colors

```html
<div
  class="living-ink__diagram"
  data-diagram-type="joySpiral"
  data-stroke-color="#DAA520"  <!-- Gold -->
  data-stroke-width="3"         <!-- Thicker -->
  data-duration="5"             <!-- Slower -->
>
</div>
```

### Add Your Own Diagram

Edit `/assets/js/visions/living-ink.js`:

```javascript
const SVG_PATHS = {
  // ... existing paths ...

  myCustomDiagram: `
    M 150 50
    L 250 150
    L 150 250
    L 50 150
    Z
  `
};
```

Then use: `data-diagram-type="myCustomDiagram"`

---

## 📊 What's Working Now vs. What Needs Videos

### ✅ Working Immediately
- All 5 SVG diagrams (bagua, joySpiral, fearSpiral, infinity, trinity)
- Scroll-triggered reveals
- Mobile responsive layouts
- Dark mode support
- Accessibility features
- All CSS styling and layouts

### ⏸️ Needs AI Video Generation
- Breathing videos (containers show static images until generated)
- 6 priority drawings ready for video treatment:
  - IMG_0159.jpg (Sadhu)
  - IMG_0161.jpg (Shaolin)
  - IMG_0165.jpg (Jimi Hendrix)
  - IMG_0154.jpg (Bagua diagram)
  - IMG_0160.jpg (Portrait)
  - IMG_0155.jpg (Architectural)

---

## 🚀 Performance

- **Bundle size**: ~3KB gzipped total
- **Mobile optimized**: Reduced animation on mobile
- **Lazy loading**: Videos only play when in viewport
- **Accessibility**: Respects `prefers-reduced-motion`
- **Framerate**: Targets 60fps on modern devices

---

## 📖 Full Documentation

See `LIVING-INK-README.md` for:
- Detailed API reference
- Advanced customization
- Replicate settings explained
- Performance tuning
- Troubleshooting

---

## 🎯 Next Steps

1. **Test the demo**: Open `living-ink-demo.html` in browser
2. **View integration**: Check `living-ink-integration-example.html` for real-world usage
3. **Generate videos**: Run the Replicate script (optional, but brings it alive)
4. **Integrate**: Add to your actual pages using examples above
5. **Customize**: Adjust colors, timings, add your own diagrams

---

## 💡 Tips

- **Start with diagrams**: They work immediately and look stunning
- **Add videos gradually**: Generate 1-2 videos first to test
- **Use compositions**: Side-by-side layouts tell great stories
- **Watch scroll triggers**: Diagrams draw when they enter viewport
- **Test on mobile**: Animations adapt automatically

---

## 🆘 Troubleshooting

**Diagrams not drawing?**
- Check browser console for errors
- Verify GSAP is loaded: `window.gsap`
- Ensure ScrollTrigger registered: `window.ScrollTrigger`

**Videos not playing?**
- Check `data-video-src` path is correct
- Verify video file exists
- Try opening video URL directly in browser
- Check browser console for CORS errors

**Import errors?**
- Verify file paths are correct
- Ensure using `type="module"` in script tag
- Check Vite config if using bundler

---

## 📞 Support Files

All examples include working code you can copy/paste:
- `living-ink-demo.html` - Every feature demonstrated
- `living-ink-integration-example.html` - Real page context
- `scripts/preview-breathing.html` - Video comparison tool

---

**The ink is alive. The geometry reveals itself.**

SUBFRAC.OS Vision System - AVENUE A Complete
