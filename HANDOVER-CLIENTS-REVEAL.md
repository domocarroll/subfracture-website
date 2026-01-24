# Clients Reveal - Handover Document

## Current State: FIXED

The clients reveal "lips opening" effect has been restored. Both the 3D lip rotation animation AND logo centering now work correctly.

---

## What Was Working Before This Session

The original "lips reveal" effect had:
1. **Grid animation**: `.clients-reveal` uses `grid-template-rows: 0fr → 1fr` to expand
2. **3D lip rotation**: Two `.clients-reveal__lip` elements rotate away (top: -90deg, bottom: +90deg)
3. **Logo stagger**: Logos appear center-out with opacity/scale/y animation
4. **Crack anticipation**: Hairline appears at 50-100px scroll before reveal
5. **Purple flash**: Subfracture brand color pulses at threshold crossing

---

## What Was Added This Session

### 1. Scroll-Lock Dwell Phase (lines 2194-2241 in main.js)
- Second ScrollTrigger that pins header-block after reveal completes
- `DWELL_DISTANCE = 350` pixels of scroll while pinned
- `is-dwelling` class for CSS styling
- Breathing gradient indicator during dwell

### 2. Logo Centering (effects.css ~line 885)
- Changed `.clients-reveal__content` to use flexbox centering
- Added `min-height: 75vh` to fill space above header-block
- **THIS LIKELY BROKE THE LIPS** - the flexbox/min-height may conflict with the grid collapse mechanism

---

## The Problem

The grid animation (`grid-template-rows: 0fr → 1fr`) relies on:
- Parent having `overflow: hidden` on children
- Children having `min-height: 0` for proper collapse

Adding `min-height: 75vh` and `display: flex` to `.clients-reveal__content` likely prevents:
1. The content from collapsing to 0 height initially
2. The lips from properly masking the content during animation

---

## Files Changed

### `/home/dom/subfracture-website/assets/css/effects.css`

**Lines ~885-903** - The clients-reveal content styling (FIXED):
```css
/* FIXED: Flexbox centering WITHOUT min-height allows grid collapse */
.clients-reveal__content {
  position: relative;
  z-index: 1;
  background: #fafafa;
  box-sizing: border-box;
  padding: 2rem 0;
  /* Use flexbox for centering BUT without min-height */
  /* This allows content to collapse for grid animation */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Only apply min-height AFTER reveal completes */
/* This preserves the grid collapse mechanism during animation */
.clients-reveal.is-revealed .clients-reveal__content {
  min-height: 75vh;
}
```

**Key insight:** The flexbox centering can be applied always, but `min-height` must only be applied after reveal completes. The grid collapse mechanism (`grid-template-rows: 0fr -> 1fr`) requires content to be able to shrink to 0 height.

### `/home/dom/subfracture-website/assets/js/main.js`

**Lines ~2027-2241** - The `initClientsReveal()` function contains:
- Element queries for container, lips, crack, header-block
- Easing functions (`easeOutSoft`, `easeOutElastic`)
- Main ScrollTrigger for reveal animation (lines 2077-2192)
- Dwell phase ScrollTrigger (lines 2194-2241)

---

## Fix Applied

### Solution
1. Keep flexbox centering (`display: flex`, `justify-content: center`, etc.) on `.clients-reveal__content` always
2. Move `min-height: 75vh` to `.clients-reveal.is-revealed .clients-reveal__content` only
3. This allows grid collapse during animation while still centering content when revealed

### Verified Effects (All Working)
- [x] Crack appears at 50-100px scroll
- [x] Purple flash at ~100px threshold
- [x] Lips rotate open (top: -90deg, bottom: +90deg)
- [x] Logos stagger in center-out
- [x] Logos end up centered in 75vh space
- [x] Dwell phase keeps header-block fixed
- [x] Smooth release after dwell

---

## Key Code Locations

| Feature | File | Line(s) |
|---------|------|---------|
| Grid animation | effects.css | ~871-877 |
| Lip styling | effects.css | ~906-934 |
| Content styling | effects.css | ~885-895 |
| Crack styling | effects.css | ~959-993 |
| Dwell indicators | effects.css | ~1068-1093 |
| Main reveal JS | main.js | ~2077-2192 |
| Dwell phase JS | main.js | ~2194-2241 |
| Lip rotation | main.js | ~2140-2144 |
| Logo stagger | main.js | ~2146-2159 |

---

## Testing Commands

```bash
# Start dev server
cd /home/dom/subfracture-website
npm run dev

# Test at http://localhost:3001
# Scroll slowly from 0 to ~400px to see full reveal
```

---

## Original Working CSS Structure (Reference)

The grid collapse mechanism requires this structure:
```css
.clients-reveal {
  display: grid;
  grid-template-rows: 0fr; /* Animated to 1fr by JS */
}

.clients-reveal > * {
  overflow: hidden;
  min-height: 0; /* Required for grid collapse */
}

.clients-reveal__content {
  /* Should NOT have min-height or fixed height during animation */
}
```

The lips are absolutely positioned within `.clients-reveal__lips` and use `rotateX` transforms.
