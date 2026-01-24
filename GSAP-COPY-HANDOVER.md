# GSAP Copy Animation Handover

## Context
Subfracture website - a culture studio. The copy is manifesto-quality writing that deserves motion reinforcing meaning.

## Creative Direction: Meaning-Driven Motion
Words animate to amplify their semantic meaning. "Flow" ripples. "Love" pulses warm. "Pretending" shimmers like a dream. The philosophy: motion as typography's secret language.

---

## Current State

### Files Modified
- `/assets/js/main.js` - All GSAP animations (lines 1185-1631 for semantic text)
- `/assets/css/effects.css` - Supporting styles (lines 424-545 for semantic CSS)
- `/index.html` - Main page structure

### What's Implemented

**Semantic Word System** (`initSemanticText()`):
```
flow/flowing    → wave (ripple motion, hover continues)
love            → pulse-warm (scale + rosy color)
acceptance      → embrace (letters spread open)
pretending      → shimmer (blur-to-sharp + purple sweep)
shift           → slide (lateral entrance)
movements       → drift (organic float)
open            → spread (letters expand)
curious         → tilt (rotation + bounce)
sustained       → stretch (horizontal scale)
collective      → gather (letters converge)
fight           → impact (bold slam)
DANNI           → warm-glow (amber shadow)
SubFrac.OS      → system-pulse (monospace flicker)
```

**Special Sequences**:
- `initAIFlowSequence()` - Steps cascade with connecting lines
- `initFightTransformation()` - Enemy dissolves, virtue emerges strong

---

## Recursive Exploration Ideas

### 1. Manifesto Moments
Key phrases that deserve orchestrated treatment:
- "sustained collective pretending" - Three words, three distinct motions in sequence
- "art and systems, flowing together" - "Art" organic/loose, "systems" precise/grid, "flowing together" merges them
- "the before-stretch" - The hyphenated phrase could literally stretch
- "acceptance and love" - Could pulse in unison like a heartbeat

### 2. Section Title Typography
Currently using character split. Could explore:
- Titles that write themselves (typewriter with cursor)
- Letters that assemble from particles
- Words that morph from abstract shapes
- Gradient color wipes synchronized to scroll position

### 3. The Closer/Footer
"Subfracture" big type emergence could be more theatrical:
- Letters rise from below viewport individually
- Dramatic timing with orchestrated delays
- Possible interaction: letters respond to mouse position

### 4. Scroll-Synchronized Text
- Paragraphs that highlight current reading position
- Words that increase opacity as they enter "reading zone"
- Scrub-based animations tied to scroll progress

### 5. Interactive Copy
- Hover states that reveal hidden meanings
- Click to expand philosophical tangents
- Words that connect visually (draw lines between related concepts)

### 6. DANNI vs SubFrac.OS Contrast
These two entities should feel fundamentally different:
- DANNI: Warm, organic, slightly imperfect, human timing
- SubFrac.OS: Precise, systematic, grid-aligned, machine timing

### 7. The Fight Section Evolution
Current: enemy fades, virtue strengthens
Could explore:
- Enemy text literally crumbles/disintegrates
- Virtue text assembles from the debris
- Transformation animation (morphing letterforms)

### 8. Rhythm & Pacing
- Musical timing for staggered reveals
- Beat-based animation (consistent rhythm across sections)
- Silence/pause as design element (strategic delays)

---

## Technical Patterns

### Adding New Semantic Words
In `initSemanticText()`, add to the `semanticWords` object:
```javascript
'newword': { animation: 'animation-type', class: 'sem-newword' }
```

Then add the animation case in `animateSemanticWord()` switch statement.

### ScrollTrigger Pattern
```javascript
ScrollTrigger.create({
  trigger: element,
  start: 'top 85%',
  onEnter: () => { /* animation */ },
  once: true
});
```

### Timeline Sequencing
```javascript
const tl = gsap.timeline();
tl.to(el1, { /* props */ })
  .to(el2, { /* props */ }, '-=0.3')  // overlap
  .to(el3, { /* props */ }, '+=0.2'); // delay
```

---

## Key Copy Sections to Animate

1. **Intro Lede**: "For brands and IP that deserve more than campaigns, we co-design movements that generate acceptance and love."

2. **What We Do Lead**: "We are a strategic culture and design studio. We design solutions to make people want change."

3. **Approach Philosophy**: "Every brand that matters, every movement that changed something, started as pretending."

4. **Fight Manifesto**: "Our enemy isn't obscurity. It's an unwillingness to care. We fight for the opening, the moment when skepticism softens and someone lets something in."

5. **AI Flow Outro**: "A system designed around collaboration as it has always happened. Only now, the machine remembers. The machine learns. The machine works while you sleep."

---

## Dependencies
- GSAP 3.14.2
- ScrollTrigger (registered)
- No external text splitting library (custom implementation)

## Dev Server
```bash
npm run dev
# http://localhost:3000
```

---

## The Goal
Make every word earn its place. Motion should feel inevitable - like the text couldn't exist any other way. The copy already has soul; animation reveals it.

Think recursively: each pass should discover new opportunities, refine existing animations, and deepen the semantic connection between meaning and motion.
