# Subfracture Website — V1 Sprint Plan

> **Duration**: 2 weeks
> **Goal**: Complete site readiness for production launch
> **CMS**: Deferred — hardcoded content with clean data structures
> **Polish pass**: Gemini 3.1 Preview for final frontend graphical refinement

---

## Creative Doctrine (Non-Negotiable)

```
White space is the primary material.
One idea per surface.
Imagery is treated as evidence.
Fracture is structural, not literal.
Typography leads the brand.
Restraint = authority.
```

**Design position**: Tech-forward, archival, restrained, calm authority, anti-trend, structural thinking.

---

## Content Required From Dom

These are placeholders I cannot fill. Everything else I'll handle autonomously.

### CONTENT-01: Portfolio Projects (3-6 real case studies)
For each project provide:
```
- Client/project name
- One-line outcome statement (what changed)
- Category tag (Brand Strategy / Identity System / etc.)
- 2-3 paragraph case narrative (challenge → approach → outcome)
- 1 hero image per project (landscape, min 1600px wide)
- 2-4 supporting images (process shots, deliverables, in-situ photography)
- Client industry
- Year completed
```

### CONTENT-02: Team
```
- Real team members (name, role, optional one-line bio)
- Headshot per person (square crop, consistent treatment)
  OR confirm you want text-only team section (no photos)
```

### CONTENT-03: Footer / Contact Details
```
- Confirm Brisbane office address (or remove if no physical office)
- Confirm LA office address (or remove)
- Confirm email: ohhello@subfrac.com (or update)
- Social links? (Instagram, LinkedIn, etc.) — or intentionally none
```

### CONTENT-04: Hero Copy
```
- Confirm or revise:
  - "Culture Studio" (h1)
  - "For brands that outgrow campaigns" (tagline)
  - "We design brand worlds..." (subline)
- Or provide replacement copy
```

### CONTENT-05: Email Delivery — DECIDED
```
- Submissions to: danni@subfrac.com
- Service: Resend (lightweight, modern, SvelteKit-friendly)
- Dom to provide Resend API key, or I'll set up account
```

### CONTENT-06: Domain & Deployment
```
- Confirm domain: subfrac.com? subfracture.com? other?
- DNS provider (Cloudflare, registrar, etc.)
- Vercel team/account to deploy under
```

---

## Phase 1: Foundation Cleanup (Day 1)

**Goal**: Clean working tree, stable baseline, committed state.

### 1.1 Commit uncommitted hero work
- Stage and commit current HeroCrack/HeroRose/HeroContent changes
- Clean up untracked files (move prototype HTML to _archive)

### 1.2 Dependency updates
- Update 9 minor versions (Svelte 5.53, Kit 2.53, Tailwind 4.2, Three 0.183)
- Run build, verify zero breakage

### 1.3 Remove .env from working tree
- Create `.env.example` with dummy values
- Confirm `.env` stays gitignored (already is)
- Rotate any exposed tokens

---

## Phase 2: Hero — New Design (Days 1-3)

**Goal**: The hero is the ONE bold gesture. Everything after it is restrained. The WebGL crack + rose is being scrapped. Build a new hero from the creative doctrine.

### 2.1 Remove existing WebGL hero
- Archive HeroCrack.svelte and HeroRose.svelte to `_archive/hero-webgl/`
- Strip Three.js, @threlte/core, @threlte/extras dependencies if no longer needed
- This removes ~188KB gzipped from the bundle — significant win

### 2.2 New hero direction
**Creative doctrine application:**
- "White space is the primary material" — hero should breathe, not assault
- "Typography leads the brand" — the words ARE the hero, not a visual behind them
- "Restraint = authority" — one bold typographic moment, nothing competing
- "Fracture is structural, not literal" — if fracture appears, it's in layout/composition, not a texture

**Possible directions (decide with Dom or execute best judgment):**
- **A) Pure typography hero**: "Culture Studio" at display scale, generous whitespace, subtle entrance animation (CSS only). Tagline and CTA below. The confidence IS the design.
- **B) Typography + structural fracture**: Type with a single elegant compositional break — a hairline rule, a staggered baseline, an offset grid — something that implies fracture without depicting it.
- **C) Typography + restrained motion**: Type with scroll-driven micro-animations (letter-spacing shift, opacity reveal, baseline drift). No 3D, no WebGL. CSS/GSAP only.

### CONTENT-07: Hero Direction — DECIDED
```
Direction B: Typography + structural fracture
- "Culture" / "Studio" as two displaced type masses
- Horizontal hairline rule at golden ratio split
- "Studio" offset right — the displacement IS the fracture
- Entrance: staggered fade-up → rule draws → offset reveals
- Pure HTML/CSS/GSAP. No WebGL, no canvas.
- Dom's call: "run with whatever you think is strongest"
```

### 2.3 Hero requirements (all directions)
- Pinned or static — decide based on direction (simpler heroes don't need pin)
- Mobile-first responsive typography (clamp-based sizing)
- Reduced motion: static, no animation, still beautiful
- Load time: near-zero (no WebGL, no 3D, no heavy assets)
- The hero should feel like the cover of an architecture monograph

### 2.4 Scroll transition out of hero
- If pinned: fade-to-cream exit as scroll releases
- If static: natural scroll with generous bottom padding
- The transition from hero → ProblemsSolved should feel like turning a page

---

## Phase 3: Page Architecture Refinement (Day 2-3)

**Goal**: Apply creative doctrine to page flow. One idea per surface. Restraint.

### 3.1 Simplify CTA distribution
Current state has 3 InlineCTAs breaking flow. Reduce to rhythm:
```
Hero (bold gesture)
  → breathing space
ProblemsSolved (one idea: what we solve)
  → breathing space
Services (one idea: what we build)
  → breathing space
ClosingStatement (one idea: the invitation)
  → fracture divider
Portfolio (one idea: the evidence)
  → breathing space
Team (one idea: the humans)
  → fracture divider
Contact (one idea: the conversation)
Footer
```
- Remove InlineCTA after ProblemsSolved
- Remove InlineCTA after Services
- Keep single InlineCTA after ClosingStatement OR integrate CTA into ClosingStatement itself
- Let sections breathe — the white space between them IS the design

### 3.2 Section spacing audit
- Increase `--spacing-section` if needed for "white space is primary material"
- Each section should feel like turning a page, not scrolling a feed
- Audit padding-top/bottom consistency across all sections

### 3.3 Section divider review
- Evaluate whether organic divider (cream→cream) is needed or if pure white space is enough
- Keep fracture dividers for cream→dark transitions (structural, not decorative)
- Fracture = the structural break between light and dark chapters

### 3.4 Navigation refinement
- Wordmark treatment: evaluate if "Subfracture" needs different typographic weight
- Consider whether nav links need rethinking for final page structure

---

## Phase 4: Typography & Design Token Refinement (Day 3)

**Goal**: Typography leads the brand. Every type decision must be intentional.

### 4.1 Heading hierarchy audit
- Hero h1: "Culture Studio" — confirm this is the most authoritative moment on page
- Section headings: review Playfair Display weight (currently 400) — does it carry enough authority?
- Body text: Source Sans 3 at 18px/1.8 — generous and readable, confirm this feels right

### 4.2 Spacing between type elements
- Review margin between heading → intro paragraph → content
- Generous but not wasteful — each gap should feel like a considered pause

### 4.3 Color discipline
- Primary surfaces: cream (#f5f0e8) and near-black (#1a1a1a) only
- Terracotta (#c55a3d) used sparingly — section numbers, links, form focus states
- Remove any color that doesn't serve the palette (verify no stray hex values)

### 4.4 Label typography
- "What we build", "Problems we help solve" — uppercase, small, terracotta
- These are wayfinding, not headings. Confirm they feel appropriately quiet.

---

## Phase 5: Portfolio Section Rebuild (Days 4-5)

**Goal**: Imagery as evidence. Each project is a surface. No decoration.

### 5.1 Portfolio data structure
Create clean TypeScript interface for projects:
```typescript
interface Project {
  slug: string
  title: string
  outcome: string
  category: string
  industry: string
  year: string
  narrative: {
    challenge: string
    approach: string
    outcome: string
  }
  images: {
    hero: string      // path to hero image
    gallery: string[] // paths to supporting images
  }
}
```

### 5.2 Portfolio card redesign
- Remove rotation/scattered layout (decorative, not structural)
- Clean grid: 2 columns on desktop, 1 on mobile
- Each card: hero image + title + category + outcome line
- Image takes 60-70% of card height — imagery as evidence
- Hover: subtle scale or opacity shift, nothing playful
- **Use placeholder image slots** — grey rectangles with aspect ratio maintained until Dom provides images

### 5.3 Portfolio detail pages
- Create `/work/[slug]/+page.svelte` route
- Layout: hero image (full-width or contained), then narrative text, then image gallery
- Minimal design — let the work speak
- Back link to portfolio section
- Placeholder content structure ready for Dom's real copy

### 5.4 Portfolio section background
- Evaluate whether dark background for portfolio is right
- Evidence-based imagery often reads better on neutral/light backgrounds
- Consider: cream background with generous whitespace vs current dark chapter
- Decision depends on image content — may need to see real images first

---

## Phase 6: Contact Form Backend (Day 5)

**Goal**: Form actually sends. Simple, reliable, no over-engineering.

### 6.1 API endpoint
- Create `src/routes/api/contact/+server.ts`
- Server-side Zod validation (duplicate of client-side schema)
- Rate limiting: simple in-memory counter (upgrade later if needed)
- Honeypot field for spam prevention

### 6.2 Email delivery
- Integrate Resend (or whichever service Dom confirms)
- Send to configured recipient email
- Simple, clean email template — plain text is fine
- Confirmation response to submitter (optional, confirm with Dom)

### 6.3 Error states
- Network error handling in form component
- Loading state during submission
- Error message if delivery fails
- Success state already exists (refine copy if needed)

---

## Phase 7: Team Section (Day 6)

**Goal**: The humans behind the work. Restrained, warm.

### 7.1 Decide format based on content
- **If headshots provided**: Photo + name + role, simple grid
- **If text-only**: Name + role + optional one-line bio, elegant list format
- Either way: minimal, no hover gimmicks

### 7.2 Placeholder-ready
- Data structure accepts optional photo prop
- Graceful fallback if photo missing (initial letter on neutral background)
- Ready for Dom to drop in real data

---

## Phase 8: SEO & Meta (Day 7)

**Goal**: Professional, complete, nothing missed.

### 8.1 Global meta
- `<html lang="en">` attribute
- Canonical URL
- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- favicon link tag in layout

### 8.2 OG image
- Generate a simple, typographic OG image (1200x630)
- "Subfracture" wordmark + "Culture Studio" on cream background
- Can be static SVG→PNG or generated

### 8.3 Structured data
- JSON-LD for Organization (name, url, logo, address)
- JSON-LD for LocalBusiness (Brisbane office)

### 8.4 Sitemap
- Static sitemap.xml for / and /work/[slug] pages
- Add to robots.txt

### 8.5 Performance meta
- Preload critical fonts
- Preconnect to any external origins
- Verify no render-blocking resources

---

## Phase 9: Accessibility & Quality (Day 8)

**Goal**: Calm authority extends to how the site treats all users.

### 9.1 Keyboard navigation audit
- Tab through entire page — logical order, visible focus states
- Skip-to-content link
- Mobile menu keyboard trap when open

### 9.2 Screen reader audit
- Semantic HTML throughout (section, nav, main, footer, headings hierarchy)
- Alt text on all images (portfolio images especially)
- aria-labels where needed (carousel, decorative elements hidden)

### 9.3 Color contrast
- Verify WCAG AA contrast for all text/background combinations
- Muted text on cream (#4a4a4a on #f5f0e8) — check this passes
- Light text on dark (cream on near-black) — should be fine

### 9.4 Reduced motion
- Full audit of all animated components
- Every scroll animation has a static fallback
- prefers-reduced-motion respected everywhere

---

## Phase 10: Performance & Mobile QA (Days 8-9)

**Goal**: Fast, smooth, no jank. The restraint extends to bundle size.

### 10.1 Lighthouse audit
- Target: 90+ on Performance, Accessibility, Best Practices, SEO
- Identify and fix any flagged issues

### 10.2 Bundle analysis
- With Three.js removed, bundle should be dramatically smaller
- Verify no orphaned 3D dependencies remain
- Check if any component imports pull unnecessary weight

### 10.3 Image optimization
- All images served in WebP/AVIF with fallbacks
- Proper width/height attributes to prevent CLS
- Lazy loading on below-fold images

### 10.4 Mobile testing
- Test on real viewport sizes: 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
- Hero WebGL performance on mobile — does it maintain 30fps minimum?
- Touch targets: all interactive elements ≥ 44x44px
- No horizontal scroll at any breakpoint

---

## Phase 11: Deployment Setup (Day 9)

**Goal**: Production-ready pipeline.

### 11.1 Vercel configuration
- Create `vercel.json` with build settings
- Configure environment variables in Vercel dashboard
- Set up production and preview deployments

### 11.2 Domain setup
- Configure custom domain (once confirmed by Dom)
- SSL certificate (automatic via Vercel)
- Redirect www → apex (or vice versa)

### 11.3 Analytics
- Install Plausible or Vercel Analytics (privacy-respecting, lightweight)
- No Google Analytics — aligns with anti-trend positioning

---

## Phase 12: Visual Polish Pass (Days 9-10)

**Goal**: Use Gemini 3.1 Preview for final frontend graphical refinement.

### 12.1 Screenshot every section
- Desktop (1440px) and mobile (375px) captures of every section
- Feed to Gemini 3.1 for visual critique against creative doctrine

### 12.2 Refinement loop
- Address spacing inconsistencies
- Typography micro-adjustments (letter-spacing, line-height fine-tuning)
- Color temperature consistency across sections
- Shadow/border subtlety audit — remove anything that feels decorative

### 12.3 Animation timing review
- Hero scroll journey: does the pace feel considered?
- Services reveal: does the font-weight transition feel authoritative?
- Scrub text reveal: is the timing meditative or anxious?
- Overall: does scrolling through the entire page feel like turning pages in a well-designed book?

---

## Phase 13: Final QA & Launch (Days 10)

### 13.1 Cross-browser testing
- Chrome, Firefox, Safari (if available), Edge
- Verify WebGL fallback if no GPU support

### 13.2 Content review
- Read every word on the page out loud
- Check for typos, awkward phrasing, broken links
- Verify all anchor links (#work, #services, #about, #contact) scroll correctly

### 13.3 Production deploy
- Deploy to production domain
- Smoke test all interactions on live URL
- Verify OG tags render correctly (use opengraph.xyz or similar)
- Submit sitemap to Google Search Console

---

## Execution Notes

### Autonomous decisions I'll make:
- All code architecture and implementation details
- Animation timing and easing curves
- Responsive breakpoint behavior
- Component structure and file organization
- Git commit strategy

### Decisions that need Dom:
- All items in "Content Required From Dom" section above
- Final copy approval (I'll write placeholder-ready copy, Dom reviews)
- Portfolio: dark vs light background (depends on imagery)
- Whether to keep or remove team photos
- Domain and deployment target

### Dependencies between phases:
- Phase 5 (Portfolio) blocked by CONTENT-01 for final images/copy (can build structure with placeholders)
- Phase 6 (Contact) blocked by CONTENT-05 for email service choice
- Phase 7 (Team) blocked by CONTENT-02 for real team data
- Phase 11 (Deployment) blocked by CONTENT-06 for domain
- Everything else is unblocked and can proceed autonomously

---

## Success Criteria

The site is v1-ready when:

1. Every section has real or clearly-placeholdered content
2. Contact form sends email successfully
3. Portfolio detail pages exist and render
4. Lighthouse scores: 90+ across all categories
5. No horizontal scroll on any viewport
6. All animations have reduced-motion fallbacks
7. OG tags and structured data render correctly
8. Build passes with zero errors
9. Scrolling the full page feels like an experience designed by someone who believes restraint is authority
