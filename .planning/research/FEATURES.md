# Feature Landscape

**Domain:** Premium Editorial Portfolio / Culture Studio Website
**Researched:** 2026-02-05
**Confidence:** MEDIUM-HIGH (based on current industry trends, competitor analysis, and established UX patterns)

---

## Table Stakes

Features users expect from a premium creative studio website. Missing = product feels incomplete or unprofessional.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Hero Section with Clear Value Proposition** | Users form judgments in 0.5 seconds; 94% judge trustworthiness on design alone | Medium | Must immediately communicate "Culture Studio" positioning. Botanical Genesis/Anatomy of Place concept adds complexity. |
| **Responsive Design (Mobile-First)** | 50%+ traffic is mobile; non-responsive = instant bounce | Medium | Mobile horizontal scroll requires extra attention |
| **Fast Loading (<3s)** | Pages loading >5s see 0.6% conversion vs 1.9% at 2.4s | High | SVG animations, high-res imagery need optimization |
| **Clear Navigation** | Poor navigation = users leave for competitors; most critical UX element | Low | Sticky nav, clear hierarchy, accessible on all devices |
| **Services/Capabilities Section** | Visitors need to understand what you offer before engaging | Low-Medium | Numbered pillars (01-05) pattern is on-brand and expected |
| **Portfolio/Case Studies** | Agencies without visible work lack credibility; 72% of clients evaluate via websites | Medium | Outcome-led framing differentiates from standard galleries |
| **Contact Information & CTA** | Missing = agency looks unapproachable; no lead generation path | Low | Must include email, phone, physical addresses (Brisbane + LA) |
| **Team Section** | Humanizes the agency; visitors want to know who they're hiring | Low-Medium | Shows there's a real team; builds trust |
| **Social Proof Elements** | Establishes credibility, experience, design aesthetic | Low | Client logos, testimonials, or implied proof via case studies |
| **Accessibility Compliance** | Legal requirement; excludes users if missing; WCAG 2.1 minimum | Medium | prefers-reduced-motion, keyboard nav, screen reader support |
| **SSL/HTTPS** | Browser warnings without; basic security expectation | N/A | Standard with Vercel |
| **SEO Fundamentals** | Discoverability; meta tags, semantic HTML, structured data | Low | SvelteKit handles SSR; metadata needs manual attention |

### Table Stakes - Subfracture-Specific

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Editorial Typography System** | Brand direction demands scholarly authority | Medium | Canela/Editorial New fonts, numbered sections, generous spacing |
| **Two-Location Footer** | International presence is core positioning | Low | Brisbane HQ + LA office |
| **Problems We Solve Section** | Culture studio positioning requires diagnosis framing | Low | 6 pain points from PROJECT.md |

---

## Differentiators

Features that set Subfracture apart from generic agencies. Not expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Botanical/Anatomical Hero Animation** | Unique artistic statement; embodies "Where art and systems flow together" | High | SVG draw animation, parallax layers, performance-critical |
| **Lips Reveal + Horizontal Scroll Portfolio** | Discovery moment creates intrigue; horizontal scroll = gallery/magazine feel | High | Requires careful mobile adaptation; GSAP ScrollTrigger |
| **Outcome-Led Case Study Framing** | Focus on client results, not just pretty visuals; builds ROI trust | Medium | Metrics, before/after, challenge-solution structure |
| **Diagnostic Visual Language** | Medical textbook/anatomical illustration aesthetic is rare in agency space | High | Consistent system: annotations, cross-sections, clinical precision |
| **Section Numbering System** | Editorial/academic feel; creates visual rhythm and navigation aid | Low | 01, 02, 03... pattern throughout |
| **Statistical Callouts** | +485hr, 680hr style data visualization adds authority | Medium | Need real or representative data; SVG infographics |
| **Dark Mode Toggle** | 82.7% of users prefer dark mode; premium aesthetic signal | Medium | Must work with cream/terracotta palette in both modes |
| **Subtle Parallax & Micro-interactions** | Modern polish without being overwhelming; rewards engagement | Medium | Must respect prefers-reduced-motion |
| **Interactive Team Portraits** | Hover states, reveal animations humanize the team | Low-Medium | IDEO-style flip/smile effect or Lateral-style cursor tracking |
| **Grid System with Generous Whitespace** | Art book/museum aesthetic; "pages feel museum-like, not commercial" | Medium | Two-column asymmetric, editorial margins |
| **Latin/Scientific Nomenclature Labels** | Unique brand signature; scholarly tone | Low | Section labels, annotations in diagnostic style |
| **Scroll Progress Indicator** | Enhances narrative flow; shows journey through content | Low | Subtle, positioned, brand-aligned |
| **Preloader with Brand Animation** | Sets tone immediately; covers asset loading | Medium | Botanical element drawing or subtle logo animation |

### Differentiators - High Impact for Subfracture

| Feature | Impact | Complexity | Recommendation |
|---------|--------|------------|----------------|
| **Anatomy of Place Hero** | Signature moment; Renaissance scholarship meets local identity | Very High | Prioritize - this IS the brand statement |
| **Horizontal Portfolio Gallery** | Magazine-feel differentiation; explore mode within vertical scroll | High | Must work on mobile; consider swipe gestures |
| **Diagnostic Annotations** | Unique visual language; no one else does this | Medium | Develop reusable component system |

---

## Anti-Features

Features to explicitly NOT build. Common mistakes in the agency website domain.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Auto-playing Video with Sound** | Intrusive, increases bounce rate, burns data | Use muted video or SVG animation; let users opt-in to sound |
| **Overwhelming Animation Density** | "Trying to be too clever" - chunks of text, blocks moving, cursor changes | Purposeful, restrained animation; let content breathe |
| **Hidden Contact Information** | Superiority complex; visitors leave without converting | Clear CTAs, contact in nav, multiple touchpoints |
| **Generic Agency Stock Photography** | Undermines credibility; contradicts editorial aesthetic | Custom imagery, illustration, or thoughtful stock that matches brand |
| **Carousel/Slider for Hero** | Users don't interact; buried content gets missed | Single strong statement or controlled scroll-based reveal |
| **Popup Overlays on Entry** | Instant annoyance; dark pattern territory | If needed, delay significantly or use less intrusive patterns |
| **Tiny Touch Targets on Mobile** | Accessibility failure; frustrates mobile users | Minimum 44x44px touch targets; generous spacing |
| **Long Contact Forms (>3 fields)** | Each field reduces conversion; 11 to 4 fields = 120% increase | Name, email, message only; gather details in follow-up |
| **Buried Case Studies** | If work isn't prominent, visitors assume you don't have any | Work should be 1-2 clicks from any page |
| **Campaign-Adjacent Aesthetics** | Contradicts "Culture Studio" positioning; looks like every other agency | Editorial, scholarly, diagnostic - not glossy/trendy |
| **Generic "Submit" Button Text** | 3% lower conversion than alternatives | "Let's Talk", "Start a Conversation", "Get in Touch" |
| **Decorative Elements Without Meaning** | Clutter; contradicts editorial restraint | Every visual element must earn its place |
| **Motion for Motion's Sake** | Performance cost, accessibility issue, looks try-hard | Animation should reveal, guide, or delight - not decorate |
| **Dark Patterns** | Erodes trust; ethical red line | Transparent CTAs, symmetrical choices, honest copy |
| **Infinite Scroll for Portfolio** | No sense of completion; SEO issues | Finite, curated selection with clear navigation |

### Anti-Features - Specific to Subfracture's Direction

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **DANNI/AI Section (from v1)** | Out of scope; evaluate later; could distract from core positioning | Focus on human team; revisit in v2.1 if still relevant |
| **Blog/News on Launch** | Scope creep; empty blog is worse than no blog | Defer to v2.1; launch with strong static content |
| **Multiple Visual Modes (from v1)** | Confusing; contradicts "single cohesive design system" | One editorial aesthetic, executed consistently |
| **Vibrant/Playful Colors** | Contradicts terracotta warmth, scholarly feel | Controlled, symbolic color: terracotta, black, cream, muted accents |
| **Tech-Forward Showcase** | Subfracture is culture-led, not tech-led | Technology serves the story, not the other way around |

---

## Feature Dependencies

Understanding which features must be built in sequence.

```
Foundation Layer (must come first):
  Typography System
  Color Palette
  Grid System
  Responsive Framework
        ↓
Navigation & Structure:
  Sticky Nav
  Section Numbering
  Scroll Progress (optional)
        ↓
Hero Section:
  Anatomy of Place SVG Layers → Draw Animation → Parallax
  (High complexity, but brand-critical)
        ↓
Content Sections (can parallelize):
  Problems We Solve ─┐
  Services (01-05)  ─┼→ All use same Typography + Grid
  Team Section      ─┘
        ↓
Portfolio Section:
  Lips Reveal Animation → Horizontal Scroll Gallery → Individual Cards
  (Depends on ScrollTrigger implementation)
        ↓
Contact & Footer:
  Contact Form → Thank You State
  Two-Location Footer
        ↓
Polish Layer:
  Micro-interactions
  Preloader
  Dark Mode (if included)
  Accessibility Audit
```

### Critical Path

1. **Typography + Color + Grid** - Everything depends on this
2. **Hero** - First impression, brand statement
3. **Portfolio** - Proof of work, conversion driver
4. **Contact** - Lead generation

### Parallel Development Opportunities

- Services and Problems sections can be built simultaneously
- Team section is independent once grid is established
- Micro-interactions can be added incrementally

---

## MVP Recommendation

For MVP (launch), prioritize:

### Must Have (Table Stakes + Critical Differentiators)

1. **Typography System** - Editorial serif, numbered sections
2. **Color Palette** - Terracotta, cream, black, muted accents
3. **Responsive Grid** - Two-column asymmetric, generous whitespace
4. **Hero Section** - Anatomy of Place concept (can simplify animation for v1)
5. **Navigation** - Clear, sticky, accessible
6. **Services Section** - 5 numbered pillars
7. **Problems Section** - 6 pain points
8. **Portfolio** - Lips reveal + horizontal scroll (or simplified vertical if timeline requires)
9. **Team Section** - Photos, names, roles
10. **Contact Form** - 3 fields max
11. **Footer** - Both locations

### Defer to Post-MVP

| Feature | Reason to Defer |
|---------|-----------------|
| **Dark Mode** | Nice-to-have; adds complexity; can add post-launch |
| **Case Study Deep Dives** | Need real content; individual pages can come later |
| **Blog/News** | Empty blog is worse than none; build when content exists |
| **Preloader Animation** | Polish layer; site should be fast enough without |
| **Interactive Team Portraits** | Enhancement; basic photos work for launch |
| **Sanity CMS Integration** | Deferred per PROJECT.md; static content first |

---

## Sources

### Industry Trends & Best Practices
- [Awwwards Portfolio Websites](https://www.awwwards.com/websites/portfolio/)
- [Really Good Designs: Web Design Trends 2026](https://reallygooddesigns.com/web-design-trends-2026/)
- [Figma: Web Design Trends](https://www.figma.com/resource-library/web-design-trends/)
- [Format.com: Horizontal Scrolling Templates](https://www.format.com/magazine/resources/photography/horizontal-scrolling-templates)

### Case Study Best Practices
- [Webflow: Write the Perfect Case Study](https://webflow.com/blog/write-the-perfect-case-study)
- [Smashing Magazine: Case Studies in Design Portfolios](https://www.smashingmagazine.com/2009/09/showcase-of-case-studies-in-design-portfolios/)
- [Format.com: How to Write Design Case Study](https://www.format.com/magazine/resources/design/how-to-write-design-case-study)

### Team Section Examples
- [HubSpot: Creative Agency Team Pages](https://blog.hubspot.com/marketing/creative-agency-team-pages)
- [Digital Agency Network: Meet the Team Examples](https://digitalagencynetwork.com/top-inspiring-digital-agency-meet-the-team-page-examples/)

### Technical Implementation
- [SVG AI: SVG Animation Guide](https://www.svgai.org/blog/svg-animation-guide)
- [Pixel Free Studio: Best Practices for Animating SVGs](https://blog.pixelfreestudio.com/best-practices-for-animating-svgs-on-the-web/)
- [Prismic: Hero Section Best Practices](https://prismic.io/blog/website-hero-section)

### Contact & Conversion
- [SmartBug Media: Optimize Contact Page for Conversions](https://www.smartbugmedia.com/blog/optimize-your-contact-us-page-for-conversions)
- [WPForms: Form Conversion Best Practices](https://wpforms.com/research-based-tips-to-improve-contact-form-conversions/)

### Accessibility & Animation
- [Medium: Scroll Responsibly - Animation and Accessibility](https://medium.com/@hanzla123/scroll-responsibly-using-animation-to-enhance-accessibility-893efd6be804)
- [Pixel Free Studio: Accessible Web Animations](https://blog.pixelfreestudio.com/best-practices-for-creating-accessible-web-animations/)

### Dark Mode & Premium Design
- [Digital Silk: Dark Mode Design Guide 2026](https://www.digitalsilk.com/digital-trends/dark-mode-design-guide/)
- [Kontra Agency: Web Design Trends 2026](https://kontra.agency/top-web-design-trends-for-2026/)

### Anti-Patterns & Mistakes
- [Proposify: Agency Website Do's and Don'ts](https://www.proposify.com/blog/agency-website-dos-donts-design-mistakes)
- [Digital Silk: Web Design Mistakes](https://www.digitalsilk.com/digital-trends/web-design-mistakes/)
- [InGenium Web: UI Anti-Patterns](https://www.ingeniumweb.com/blog/post/6-ui-anti-patterns-that-every-designer-should-avoid/3476/)

---

## Confidence Assessment

| Category | Confidence | Notes |
|----------|------------|-------|
| Table Stakes | HIGH | Industry-standard; verified across multiple sources |
| Differentiators | MEDIUM-HIGH | Based on current trends; Subfracture-specific items confirmed in PROJECT.md |
| Anti-Features | HIGH | Well-documented mistakes; clear evidence of harm |
| Dependencies | MEDIUM | Logical sequencing; may need adjustment based on actual development |
| MVP Recommendation | MEDIUM | Based on scope constraints; user may prioritize differently |

---

*Research complete. Ready for roadmap integration.*
