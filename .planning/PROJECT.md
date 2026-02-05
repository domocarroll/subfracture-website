# Subfracture Website v2

## What This Is

A complete rebuild of the Subfracture website using SvelteKit, Tailwind CSS, and eventually Sanity CMS. The site repositions Subfracture as a **Culture Studio** — not an agency — that designs brand worlds for clients who have outgrown campaign-led thinking.

## Core Value

**"For brands that outgrow campaigns"**

Subfracture designs brand worlds — systems that build meaning, momentum, and relevance over time. The website must embody this philosophy: scholarly authority, warm humanity, systems thinking.

## The Shift (v1 → v2)

| v1 | v2 |
|----|----|
| Animation-heavy, GSAP-driven | Editorial, restrained, purposeful motion |
| "Visions" visual modes | Single cohesive design system |
| Campaign-adjacent feel | Culture studio authority |
| Generic agency structure | Diagnostic, systems-oriented framing |

## Brand Position

**Culture Studio** based in Merivale Studios, South Brisbane.

*"We help brands and IP get clear, get chosen, and get remembered — not just launched."*

### Philosophy

- **Culture-led, but not trend-led** — Timelessness × Now-ness
- **We're not showing culture. We're diagnosing it.**
- Show structures, patterns, failure points (not people, emotion, "now")
- Studio as **operating system**, not campaign

### Problems We Solve

1. Campaign-led thinking with no long-term platform
2. Inconsistent brand and IP expression at scale
3. Low trust or weak cultural relevance
4. Launches that need real momentum, not noise
5. Brand systems that extend beyond start and end dates
6. Unclear positioning — people don't get it

### Services (5 Pillars)

| # | Service | Focus |
|---|---------|-------|
| 01 | Strategy | Positioning, value prop, audience mapping, brand architecture, experience strategy |
| 02 | Creative Platforms | Central creative platform, campaign system, content pillars, launch narrative |
| 03 | Brand & Visual Identity | Naming, tone of voice, visual identity, guidelines and templates |
| 04 | Design & Build | Websites, content production, prototyping, software and immersive builds |
| 05 | Partnerships & Cultural Influence | Partnership strategy, talent liaison, cultural moments, rollout planning |

### Team

| Name | Role |
|------|------|
| Warwick Heathwood | Strategy |
| Casey Midgley | Design |
| Tyronne Curtis | Technology |
| Amanda Archer | Partnerships |

### Locations

**Brisbane** (HQ)
29 Merivale Street, South Brisbane, Qld 4101
ohhello@subfrac.com

**Los Angeles**
520 Broadway Suite 200, Santa Monica, CA 90401

---

## Design Direction

### North Star: Nigrum Corpus Campaign (Cannes Lions Grand Prix 2025)

**"Editorial Anatomical Surrealism with Neo-Classical Medical Illustration"**

The website should feel like browsing a digital medical textbook — scholarly, warm, diagnostic.

### Core Aesthetic

**Cultural Forensics / Editorial Systems Analysis**

Visuals feel like:
- Medical journals
- Institutional archives
- Redacted research
- Museum catalogues
- Diagnostic manuals

But executed with contemporary restraint and taste.

### Typography System

**Display**: High-contrast editorial serif (Canela, Editorial New, Playfair Display)
- Tall x-height, sharp terminals, classical proportions
- Academic, authoritative, refined
- **Typography never shouts — it asserts**

**Hierarchy**:
- Large, confident headlines (often centered or aligned with imagery)
- Generous spacing and restraint
- Section numbers (01, 02...) as anchors
- Latin/scientific nomenclature style for labels

### Color Palette

| Role | Color | Symbolism |
|------|-------|-----------|
| Background | Warm off-white/cream | Paper, archive |
| Display text | Terracotta/rust `~#c55a3d` | Warmth, authority |
| Body text | Black | Clarity |
| Accent 1 | Mint `#adedc2` | System, growth |
| Accent 2 | Magenta `#e949db` | Pressure, highlight |
| Botanical | Muted greens | Life, intentionality |

**Color is controlled and symbolic, not vibrant or playful.**

Sparse but intentional use:
- **Red** = pressure
- **Green** = system
- **Black** = void

### Layout Principles

**Editorial / Art Book Structure**:
- Large margins
- Clear grid system (two-column asymmetric)
- Plenty of breathing room
- Pages feel **museum-like, not commercial**

**Image Treatment**:
- Full bleed or isolated on clean backgrounds
- Cropping is intentional and bold
- Subjects feel centered, balanced, monumental

**Data & Infographics**:
- Minimalist and refined
- Circles, thin lines, restrained color
- Feel like academic journal — not marketing deck

### Signature Moves

Subfracture should develop recognizable rituals, not just a look:

- Diagrammatic layouts that repeat across projects
- Consistent typographic hierarchy (almost academic)
- Recurrent symbols: fractures, layers, cross-sections, annotations
- Statistical callouts as visual anchors (+485hr, 680hr style)
- Section numbering system throughout

### Tone & Emotional Feel

- Serious
- Respectful
- Poetic
- Intellectually charged
- Quietly provocative

**This is not shock value. It's authority + empathy.**

### Botanical Note

Botanicals should feel **illustrative and intentional**, not decorative filler.

*"Medical textbook precision rendered with art book beauty."*

---

## Inspiration Sites

| Site | What to Reference |
|------|-------------------|
| **SPYLT** (spylt.com) | Bold typography animation, premium whitespace, scroll-linked GSAP motion, sticky elements |
| **Jane Doe Creation** | Single-column narrative flow, restraint, "making the right idea real" |
| **Matvoyce** | Grid system, motion as specialty, vibrant-meets-minimal |
| **Blinkmybrain** | Modern component system, smooth interactions |
| **Sonja van Duelmen** | Contemporary minimalism, professional clarity |
| **Kiehl's** | Apothecary heritage, archive ephemera, historical credibility |

---

## Technical Stack

- **Framework**: SvelteKit (Svelte 5)
- **Styling**: Tailwind CSS 4
- **Build**: Vite 7
- **Language**: TypeScript
- **CMS**: Sanity (deferred until deployment)
- **Deployment**: Vercel
- **Animation**: GSAP (restrained, purposeful)

---

## Constraints

- No campaign-adjacent aesthetics
- No generic agency patterns
- No decorative elements without meaning
- Motion must be purposeful, not performative
- Content-first — design serves the message

---

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with editorial grid structure
- [ ] Services section with numbered pillars
- [ ] Problems/pain points section
- [ ] Proof/portfolio section (outcome-led framing)
- [ ] Team section
- [ ] Contact/footer with both locations
- [ ] Responsive design (mobile-first)
- [ ] Typography system implementation
- [ ] Color palette implementation
- [ ] Statistical callouts / data visualization patterns

### Out of Scope

- Sanity CMS integration (deferred to deployment phase)
- Blog/news section (v2.1)
- Case study deep-dive pages (v2.1)
- DANNI/SubFrac.OS AI system section (from v1 — evaluate if still relevant)

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SvelteKit over vanilla HTML | Component architecture, better DX, SSR capability | — Confirmed |
| Tailwind CSS over vanilla | Rapid prototyping, utility-first aligns with editorial grid | — Confirmed |
| Defer Sanity until deployment | Build experience first, wire CMS when content is final | — Confirmed |
| Terracotta accent over brand mint/magenta | Nigrum Corpus warmth, scholarly feel | — Pending user confirmation |
| **Botanical Genesis Hero** | Brand philosophy made tangible — growth, systems, "Break → Shape" metaphor. SVG botanical linework grows/animates as page loads, revealing content. More sophisticated than video reel, aligns with editorial aesthetic. | — Confirmed |
| **Lips Reveal + Horizontal Portfolio** | Keep v1 lips reveal animation, but inside: horizontal scroll gallery for case studies (SPYLT-style tilted cards). Creates discovery moment — lips open to reveal proof, explore laterally, then continue vertical scroll. | — Confirmed |
| **Terracotta accent** | Primary accent color — aligns with Nigrum Corpus warmth, scholarly feel | — Confirmed |

---

## Open Questions

1. ~~**Hero treatment**~~ — RESOLVED: Botanical Genesis
2. ~~**Client logos**~~ — RESOLVED: Lips reveal + horizontal scroll portfolio
3. ~~**Accent color**~~ — RESOLVED: Terracotta primary
4. **Typography** — Source specific fonts (Canela, Editorial New) or use system alternatives initially?

---

*Last updated: 2026-02-05 after initialization*
