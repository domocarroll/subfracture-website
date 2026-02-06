# Phase 3: Hero Section - Context

**Gathered:** 2026-02-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the hero/top-fold section that immediately communicates "Culture Studio" positioning. Includes headline, tagline, subline, two CTAs, botanical illustration background, and brand logo carousel. Must work on all viewports and respect reduced motion.

Copy is locked (from CONTENT.md):
- Headline: "Culture Studio"
- Tagline: "For brands that outgrow campaigns"
- Subline: "We design brand worlds. Systems that build meaning, momentum, and relevance over time."
- CTAs: "Start a conversation" / "See the work"

</domain>

<decisions>
## Implementation Decisions

### Visual Composition
- Full viewport hero (100vh) — immersive first impression, content begins below fold
- Illustration sits BEHIND text as a background layer — text overlays it
- Brand logo carousel sits at the bottom edge of the hero (inside the hero section)
- CTAs are understated text links with hover states — NOT prominent colored buttons
- Editorial feel — typography is the star, illustration supports

### Botanical Illustration
- Depicts abstract organic linework — flowing lines suggesting growth, roots, neural networks (not a literal plant)
- Rendered as inline SVG with subtle fill/color — muted terracotta or botanical green in select areas on cream
- Subtle background texture level of presence — noticeable but restrained, doesn't compete with typography
- Built entirely in SVG code — no external asset files, full control over animation and styling

### Animation & Entrance
- Sequence: SVG linework draws in FIRST, then headline and tagline reveal on top
- SVG uses GSAP DrawSVG to trace paths — lines draw in on load
- Total entrance duration: ~1 second (quick, doesn't make visitors wait)
- Scroll behavior: parallax — text scrolls normally, illustration has subtle depth shift at different speed
- Reduced motion: static version with no animation, all elements visible immediately

### Mobile Treatment
- Simplified SVG illustration on mobile — fewer paths/lines, lighter version suggesting same organic feel
- Animation on mobile: Claude's discretion based on performance testing — use draw-in if smooth, fall back to fade-in if not
- CTAs become stacked full-width tappable buttons on mobile (not text links)
- Hero remains 100vh on mobile

### Claude's Discretion
- Exact SVG illustration design (paths, shapes, composition)
- Number of SVG paths in simplified mobile version
- Parallax speed ratios between layers
- Exact timing curve for draw-in animation within the ~1s window
- Whether to animate on mobile (performance-dependent)
- Logo carousel interaction (static row vs subtle scroll)
- Transition between hero and problems section below

</decisions>

<specifics>
## Specific Ideas

- Illustration should feel like medical textbook meets art book — "scholarly authority" not "creative agency"
- Nigrum Corpus aesthetic is the north star — editorial, anatomical, warm
- Organic lines could suggest root systems, neural pathways, or growth patterns — abstract enough to be interpreted
- Terracotta fills in select SVG areas connect to the overall color system
- The hero should communicate "this is a thinking studio, not a making agency" within 5 seconds

</specifics>

<deferred>
## Deferred Ideas

- Full botanical SVG draw animation with complex timeline (HERO-05, deferred to v1.1)
- Scroll-triggered exit animation (HERO-07, deferred to v1.1)
- Parallax scroll layers with depth (HERO-06, deferred to v1.1 — basic parallax included in v1.0)

</deferred>

---

*Phase: 03-hero-section*
*Context gathered: 2026-02-06*
