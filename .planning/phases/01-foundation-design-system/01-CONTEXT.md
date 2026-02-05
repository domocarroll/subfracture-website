# Phase 1: Foundation & Design System - Context

**Gathered:** 2026-02-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the editorial visual language (typography, color, grid) and GSAP animation patterns that all subsequent phases depend on. This is infrastructure — no user-facing features, but the design tokens and utilities that everything else builds upon.

</domain>

<decisions>
## Implementation Decisions

### Typography Scale & Rhythm
- **Dramatic editorial scale** — large headlines, big contrast between H1 and body (magazine feel)
- **Section numbers (01, 02...)** — superscript/small beside headings, numbers are secondary to heading text
- **Body line-height** — generous (1.8+), art book / medical journal feel with lots of air
- **Font pairing** — Playfair Display for headings/body; Claude decides sans vs serif for UI elements (nav, buttons, labels)

### Grid Breakpoints & Density
- **Desktop content width** — narrow (max ~900px), strong editorial constraint with dramatic margins (museum feel)
- **Two-column ratio** — golden ratio (~62/38), classical scholarly proportion
- **Breakpoint behavior** — Claude decides when two-column collapses (based on content readability)
- **Section vertical spacing** — generous (120-160px), clear separation with comfortable scroll rhythm

### Color Palette
- **Naming convention** — semantic (primary, surface, text) for flexibility
- **Base palette** — warm off-whites, soft greys, bone, parchment, light stone tones (paper-like)
- **Accent colors:**
  - Deep reds and burgundies (blood, muscle, circulation) — terracotta (#c55a3d) fits here
  - Muted greens — botanical elements ONLY
  - Earthy browns and blacks
- **NO mint or magenta** — explicitly excluded from palette
- **Principle** — color is controlled and symbolic, not vibrant or playful
- **White space is critical**
- **Terracotta usage** — Claude decides roles (headings, links, section numbers, etc.) based on hierarchy needs

### GSAP Utility Patterns
- **API style** — Claude decides (actions vs direct vs mix) based on best practices
- **Motion personality** — natural and organic (medium durations 0.5-0.8s, custom bezier, botanical feel)
- **Reveal animations** — fade + slight rise (classic editorial, elements fade in and move up slightly)
- **Stagger behavior** — subtle (0.05-0.1s), items feel connected with wave-like flow

### Claude's Discretion
- Sans vs serif for UI elements (nav, buttons, labels)
- Exact breakpoint values for two-column collapse
- Terracotta application across roles
- GSAP API architecture (actions vs imperative)
- Specific easing curves and duration values

</decisions>

<specifics>
## Specific Ideas

- "Nigrum Corpus" aesthetic — editorial anatomical surrealism, neo-classical medical illustration
- Site should feel like browsing a digital medical textbook — scholarly, warm, diagnostic
- Museum-like pages, not commercial
- Typography never shouts — it asserts

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-design-system*
*Context gathered: 2026-02-05*
