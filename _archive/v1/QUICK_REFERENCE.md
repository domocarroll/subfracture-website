# Quick Reference: DANNI vs SubFrac.OS Animations

## 🎯 What Was Built

Viscerally different animation DNA for two AI entities that makes their contrast **felt, not just seen**.

---

## 📁 Files Changed

### JavaScript
- `/home/dom/subfracture-website/assets/js/main.js`
  - Lines 1467-1509: DANNI animation (warm-glow)
  - Lines 1511-1573: SubFrac.OS animation (system-pulse)
  - Lines 1645-1731: Visual conversation system

### CSS
- `/home/dom/subfracture-website/assets/css/sections.css`
  - Lines 270-295: Enhanced AI name styling

---

## 🧪 Testing

### Quick Test (Standalone)
```bash
# Open test page in browser
open /home/dom/subfracture-website/test-ai-animations.html
# or
firefox /home/dom/subfracture-website/test-ai-animations.html
```

### Full Site Test
1. Start dev server: `npm run dev`
2. Navigate to AI section
3. Scroll until visible
4. Watch for ~10 seconds

---

## 🎨 Animation Contrasts

| Aspect | DANNI | SubFrac.OS |
|--------|-------|------------|
| **Color** | Warm amber/peach | Cold purple |
| **Timing** | Variable (±75ms) | Exact (0ms) |
| **Easing** | Sine curves | Quantized steps |
| **Rhythm** | Breathing (3.5-4s) | Pulse (0.8s) |
| **Feeling** | Organic, alive | Mechanical, precise |

---

## 🔍 What to Look For

### DANNI
✓ Warm glow appears with slight variance
✓ Gentle breathing pattern (irregular)
✓ Barely perceptible scale breathing
✓ Feels alive and trustworthy

### SubFrac.OS
✓ Digital flicker on arrival (5 pulses)
✓ Scan-line artifact descends
✓ Metronomic purple pulse
✓ Feels mechanical and powerful

### Conversation (after ~4.5s)
✓ DANNI pulses warmly (slow)
✓ SubFrac.OS responds digitally (instant)
✓ 4 total exchanges
✓ Timing contrast is visceral

---

## 📖 Documentation

- `ANIMATION_IMPLEMENTATION_SUMMARY.md` - Complete implementation guide
- `DANNI_SUBFRACOS_ANIMATION_CONTRAST.md` - Detailed animation specs
- `animation-timing-diagram.txt` - Visual timing breakdown
- `test-ai-animations.html` - Standalone test page

---

## 🐛 Debugging

```javascript
// In browser console:

// Kill all animations
gsap.killTweensOf('*');

// Slow down time (for debugging)
gsap.globalTimeline.timeScale(0.25);

// Normal speed
gsap.globalTimeline.timeScale(1);

// View GSAP version
console.log(gsap.version);
```

---

## 🎚️ Intensity Adjustments

### If too subtle:
- Multiply glow alpha values by 1.5x
- Increase DANNI scale: `1.012` → `1.02`
- Reduce conversation delay: `4.5s` → `2.5s`

### If too intense:
- Multiply glow alpha values by 0.7x
- Decrease DANNI scale: `1.008` → `1.004`
- Increase conversation delay: `4.5s` → `7s`

---

## ✅ Success Checklist

- [ ] DANNI feels warm and alive
- [ ] SubFrac.OS feels precise and powerful
- [ ] Contrast is viscerally felt
- [ ] Conversation feels meaningful
- [ ] 60fps maintained (no jank)
- [ ] Effects enhance, don't distract

---

## 🚀 Deploy Checklist

Before deploying:
1. Test in Chrome, Firefox, Safari
2. Test on mobile (iOS/Android)
3. Verify ScrollTrigger fires correctly
4. Check performance (60fps maintained)
5. Test with reduced motion preference
6. Verify conversation starts/stops correctly

---

## 💡 Key Design Principle

**The user should FEEL the difference before reading a word.**

- DANNI = warm collaborative intelligence (trust)
- SubFrac.OS = precise operational intelligence (power)
- Together = complete AI system (heart + mind)

---

## 📞 Quick Commands

```bash
# View timing diagram
cat /home/dom/subfracture-website/animation-timing-diagram.txt

# Open test page
open /home/dom/subfracture-website/test-ai-animations.html

# Check implementation
grep -A 10 "case 'warm-glow'" /home/dom/subfracture-website/assets/js/main.js
grep -A 10 "case 'system-pulse'" /home/dom/subfracture-website/assets/js/main.js
```

---

**Status:** ✅ Complete
**Date:** 2026-01-20
**Ready for:** Browser testing and deployment
