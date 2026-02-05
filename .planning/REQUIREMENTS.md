# Requirements: Subfracture Website v2

**Defined:** 2026-02-05
**Core Value:** For brands that outgrow campaigns — the website must embody scholarly authority, warm humanity, systems thinking.

## v1 Requirements

Requirements for initial launch. Each maps to roadmap phases.

### Foundation

- [ ] **FOUND-01**: Typography system implements editorial serif (Playfair Display) with numbered section labels
- [ ] **FOUND-02**: Color palette implements terracotta (#c55a3d), cream background, black body text, muted accents
- [ ] **FOUND-03**: Responsive grid uses two-column asymmetric layout with generous whitespace
- [ ] **FOUND-04**: Global styles configured in Tailwind CSS 4 with design tokens
- [ ] **FOUND-05**: GSAP installed with SSR-safe browser guards and cleanup utilities

### Navigation

- [ ] **NAV-01**: Sticky navigation with clear hierarchy visible on all pages
- [ ] **NAV-02**: Mobile menu with accessible toggle (44x44px touch target)
- [ ] **NAV-03**: Scroll progress indicator shows position in page narrative
- [ ] **NAV-04**: Section numbering system (01, 02...) creates editorial rhythm

### Hero

- [ ] **HERO-01**: Hero section displays clear value proposition ("Culture Studio" positioning)
- [ ] **HERO-02**: Botanical/anatomical illustration establishes brand aesthetic
- [ ] **HERO-03**: Hero works on mobile with simplified treatment
- [ ] **HERO-04**: Hero respects prefers-reduced-motion

### Content Sections

- [ ] **CONT-01**: Services section displays 5 numbered pillars with descriptions
- [ ] **CONT-02**: Problems section displays 6 pain points Subfracture solves
- [ ] **CONT-03**: Approach/methodology section explains how Subfracture works
- [ ] **CONT-04**: Statistical callouts display key metrics (+485hr style)

### Portfolio

- [ ] **PORT-01**: Lips reveal animation triggers on scroll into portfolio section
- [ ] **PORT-02**: Horizontal scroll gallery displays portfolio cards with momentum
- [ ] **PORT-03**: Portfolio cards show outcome-led framing (metrics, challenge-solution)
- [ ] **PORT-04**: Mobile swipe gesture provides fallback for horizontal scroll
- [ ] **PORT-05**: Portfolio section works without JavaScript (graceful degradation)

### Team

- [ ] **TEAM-01**: Team section displays 4 team members with photos, names, roles
- [ ] **TEAM-02**: Interactive portraits have hover state micro-interactions
- [ ] **TEAM-03**: Team section works on mobile (touch-friendly)

### Contact

- [ ] **CTCT-01**: Contact form has 3 fields maximum (name, email, message)
- [ ] **CTCT-02**: Form validates input with clear error messages
- [ ] **CTCT-03**: Thank you state confirms submission
- [ ] **CTCT-04**: Clear CTAs appear throughout site (not just contact section)

### Footer

- [ ] **FOOT-01**: Footer displays Brisbane HQ address and contact
- [ ] **FOOT-02**: Footer displays Los Angeles office address
- [ ] **FOOT-03**: Footer includes email (ohhello@subfrac.com)

### Accessibility & Polish

- [ ] **ACCS-01**: Site passes WCAG 2.1 AA accessibility audit
- [ ] **ACCS-02**: All animations respect prefers-reduced-motion
- [ ] **ACCS-03**: Keyboard navigation works throughout site
- [ ] **ACCS-04**: Screen reader compatible (semantic HTML, ARIA labels)
- [ ] **POLSH-01**: Micro-interactions on links and buttons (magnetic, hover states)
- [ ] **POLSH-02**: Subtle parallax on scroll (content sections)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Dark Mode

- **DARK-01**: Dark mode toggle preserves cream/terracotta palette feel
- **DARK-02**: User preference persists across sessions

### Case Studies

- **CASE-01**: Individual case study pages with full project details
- **CASE-02**: Challenge → Solution → Outcome structure
- **CASE-03**: Related projects navigation

### Content Management

- **CMS-01**: Sanity CMS integration for content editing
- **CMS-02**: Visual editing support
- **CMS-03**: Image optimization pipeline

### Enhanced Hero

- **HERO-05**: Full botanical SVG draw animation with timeline
- **HERO-06**: Parallax scroll layers with depth
- **HERO-07**: Scroll-triggered exit animation

### Blog

- **BLOG-01**: Blog/news section
- **BLOG-02**: RSS feed
- **BLOG-03**: Category filtering

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| DANNI/AI Section | Out of scope per PROJECT.md; evaluate in v2.1 |
| Multiple Visual Modes | Contradicts "single cohesive design system" |
| Auto-playing Video | Anti-feature; intrusive, burns data |
| Blog on Launch | Empty blog is worse than none |
| Carousel/Slider Hero | Users don't interact; anti-pattern |
| Long Contact Forms | Each field reduces conversion |
| Generic Stock Photography | Undermines editorial credibility |
| Preloader Animation | Polish layer; site should be fast enough |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| HERO-01 | Phase 3 | Pending |
| HERO-02 | Phase 3 | Pending |
| HERO-03 | Phase 3 | Pending |
| HERO-04 | Phase 3 | Pending |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| CONT-04 | Phase 4 | Pending |
| PORT-01 | Phase 5 | Pending |
| PORT-02 | Phase 5 | Pending |
| PORT-03 | Phase 5 | Pending |
| PORT-04 | Phase 5 | Pending |
| PORT-05 | Phase 5 | Pending |
| TEAM-01 | Phase 6 | Pending |
| TEAM-02 | Phase 6 | Pending |
| TEAM-03 | Phase 6 | Pending |
| CTCT-01 | Phase 7 | Pending |
| CTCT-02 | Phase 7 | Pending |
| CTCT-03 | Phase 7 | Pending |
| CTCT-04 | Phase 7 | Pending |
| FOOT-01 | Phase 7 | Pending |
| FOOT-02 | Phase 7 | Pending |
| FOOT-03 | Phase 7 | Pending |
| ACCS-01 | Phase 8 | Pending |
| ACCS-02 | Phase 8 | Pending |
| ACCS-03 | Phase 8 | Pending |
| ACCS-04 | Phase 8 | Pending |
| POLSH-01 | Phase 8 | Pending |
| POLSH-02 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-05*
*Last updated: 2026-02-05 after milestone v1.0 scoping*
