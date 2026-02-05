# Technology Stack

**Project:** Subfracture Culture Studio Website v2
**Researched:** 2026-02-05
**Overall Confidence:** HIGH

## Executive Summary

This stack combines proven, production-ready technologies with a clear philosophy: **Svelte 5 for reactivity, GSAP for animation, Tailwind CSS 4 for styling, and Sanity for content**. The choices prioritize developer experience, performance, and animation capabilities required for an editorial portfolio with sophisticated scroll-linked effects.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| SvelteKit | ^2.50.1 | Full-stack framework | Already installed; excellent DX, SSR, file-based routing, built for Vercel | HIGH |
| Svelte | ^5.48.2 | UI framework | Already installed; runes system ($state, $effect) simplifies animation lifecycle management | HIGH |
| TypeScript | ^5.9.3 | Type safety | Already installed; catches errors early, better IDE support | HIGH |
| Vite | ^7.3.1 | Build tool | Already installed; fast HMR, native ESM, excellent plugin ecosystem | HIGH |

**Rationale:** SvelteKit 2 with Svelte 5 is the current stable release. Svelte 5's `$effect` rune provides clean cleanup patterns essential for GSAP animations (return cleanup function from effect). The existing project already has these installed.

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.1.18 | Utility-first CSS | Already installed; v4 uses CSS-first config, no PostCSS needed, native @import syntax | HIGH |
| @tailwindcss/vite | ^4.1.18 | Vite integration | Already installed; simpler than PostCSS approach, must be before sveltekit() in plugins | HIGH |
| @tailwindcss/typography | ^0.5.x | Prose styling | For editorial content; provides sensible defaults for long-form text | HIGH |

**Rationale:** Tailwind CSS 4 is a major release with CSS-first configuration (`@import "tailwindcss"`). No `tailwind.config.js` needed for basic usage. The typography plugin is essential for editorial content styling.

**Browser Support Note:** Tailwind CSS v4 targets modern browsers (Safari 16.4+, Chrome 111+, Firefox 128+). If legacy browser support is needed, stay with v3.4.

### Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| GSAP | ^3.14.2 | Animation engine | Industry standard; now 100% FREE including all plugins (SplitText, MorphSVG, DrawSVG, ScrollTrigger) | HIGH |
| ScrollTrigger | (included) | Scroll-linked animation | Best-in-class scroll-driven animations; pinning, scrubbing, snap | HIGH |
| SplitText | (included) | Text animation | Editorial typography animation; now free with GSAP | HIGH |
| DrawSVG | (included) | SVG line drawing | For botanical illustration animations | HIGH |
| MorphSVG | (included) | SVG morphing | Shape transitions for visual interest | HIGH |
| Lenis | ^1.3.17 | Smooth scrolling | Lightweight, plays well with ScrollTrigger, doesn't fight GSAP | MEDIUM |

**Rationale:** GSAP became 100% free in late 2024 when Webflow acquired GreenSock. ALL plugins (previously $99+/year) are now included. This is the definitive choice for editorial animation.

**GSAP + Svelte 5 Pattern:**
```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register once at app level
gsap.registerPlugin(ScrollTrigger);

// In component:
$effect(() => {
  const tween = gsap.to(element, { ... });
  return () => tween.kill(); // cleanup on unmount/rerun
});
```

**Lenis Integration:**
```typescript
import Lenis from 'lenis';

const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Content Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @sanity/client | ^7.14.1 | Content fetching | Official Sanity client for GROQ queries | HIGH |
| @sanity/sveltekit | latest | SvelteKit integration | Visual editing, live preview, data loaders | HIGH |
| sanity | ^3.x | Studio (embedded) | Can be embedded in SvelteKit route or separate deployment | HIGH |

**Rationale:** Sanity is explicitly in the project requirements. The @sanity/sveltekit package provides Visual Editing for Svelte 5 with SSR, enabling content editors to edit directly in context.

**Integration Pattern:**
- Finalize frontend components BEFORE connecting Sanity (reduces schema rework)
- Centralize GROQ queries in `/src/lib/sanity/queries.ts`
- Mirror TypeScript types in `/src/lib/sanity/types.ts`
- Use `apiVersion: '2025-02-06'` format (hardcoded, never dynamic)

### Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @sveltejs/adapter-vercel | ^6.3.1 | Vercel deployment | Zero-config deployment, ISR support, edge functions | HIGH |
| @sveltejs/adapter-auto | ^7.0.0 | Auto-detection | Already installed; falls back to adapter-vercel on Vercel | HIGH |

**Rationale:** Vercel + SvelteKit is a first-class integration. While adapter-auto works, installing adapter-vercel explicitly provides version stability and Vercel-specific configuration options (runtime, memory, regions).

### Image Optimization

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @sveltejs/enhanced-img | latest | Build-time optimization | Official SvelteKit solution; AVIF/WebP, responsive sizes, layout shift prevention | HIGH |

**Rationale:** Use `<enhanced:img>` for local/static images. For CMS images from Sanity, use Sanity's image URL builder with transformation parameters.

**Usage:**
```svelte
<enhanced:img src="./hero.jpg" alt="Hero image" />
```

**Note:** Plugin must come BEFORE sveltekit() in vite.config.js plugins array.

### Typography / Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Fontsource | ^5.x | Self-hosted fonts | NPM packages for fonts; version-locked, offline support, GDPR compliant | HIGH |

**Rationale:** Self-hosted fonts are used by 71% of websites (2025 Web Almanac). Fontsource provides 1500+ fonts as NPM packages. Use WOFF2 format only (30% smaller than WOFF).

**Usage:**
```typescript
// In app entry or +layout.svelte
import '@fontsource-variable/inter'; // Variable font
import '@fontsource/playfair-display/700.css'; // Specific weight
```

**Always set `font-display: swap`** in @font-face to prevent FOIT (Flash of Invisible Text).

---

## Supporting Libraries (Optional)

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| clsx | ^2.x | Class merging | When conditionally composing Tailwind classes | HIGH |
| zod | ^3.x | Schema validation | For form validation, API response validation | HIGH |
| @unpic/svelte | latest | Image CDN | If using external image CDN (Cloudinary, imgix) | MEDIUM |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Animation | GSAP | Motion One | GSAP has superior scroll-linked features (ScrollTrigger, ScrollSmoother); Motion One lacks SplitText equivalent |
| Animation | GSAP | Svelte transitions | Built-in transitions lack timelines, scroll-linking, advanced easing; fine for simple UI |
| Animation | GSAP | CSS scroll-driven | Safari lacks support (2025); requires polyfill; less precise control |
| Smooth scroll | Lenis | GSAP ScrollSmoother | Lenis is lighter, less opinionated about DOM structure; ScrollSmoother requires specific markup |
| Smooth scroll | Lenis | Locomotive Scroll | Locomotive is heavier, less maintained; Lenis is actively developed |
| CMS | Sanity | Contentful | Sanity has better SvelteKit integration, more flexible schema, better DX |
| CMS | Sanity | Strapi | Sanity is hosted (less ops), GROQ is more powerful than REST/GraphQL |
| Fonts | Fontsource | Google Fonts CDN | Self-hosting is faster (no DNS lookup), GDPR compliant, version-locked |
| Images | @sveltejs/enhanced-img | vite-imagetools | Official SvelteKit solution; simpler API, better maintained |

---

## Installation

### Already Installed (package.json)
```json
{
  "devDependencies": {
    "@sveltejs/adapter-auto": "^7.0.0",
    "@sveltejs/kit": "^2.50.1",
    "@sveltejs/vite-plugin-svelte": "^6.2.4",
    "@tailwindcss/vite": "^4.1.18",
    "svelte": "^5.48.2",
    "svelte-check": "^4.3.5",
    "tailwindcss": "^4.1.18",
    "typescript": "^5.9.3",
    "vite": "^7.3.1"
  }
}
```

### To Add

```bash
# Animation
npm install gsap lenis

# CMS (when ready)
npm install @sanity/client @sanity/sveltekit

# Image optimization
npm install -D @sveltejs/enhanced-img

# Typography
npm install @fontsource-variable/inter @tailwindcss/typography

# Deployment (explicit)
npm install -D @sveltejs/adapter-vercel

# Utilities
npm install clsx zod
```

### Vite Config Update

```typescript
// vite.config.ts
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    enhancedImages(),  // Must be first
    tailwindcss(),     // Must be before sveltekit
    sveltekit()
  ]
});
```

---

## Version Pinning Strategy

| Package | Strategy | Rationale |
|---------|----------|-----------|
| SvelteKit | Minor (^2.x) | Framework; minor updates are safe |
| Svelte | Minor (^5.x) | Core framework; minor updates are safe |
| GSAP | Minor (^3.x) | Animation library; stable API |
| Tailwind CSS | Major (4.x) | v4 is breaking change from v3; lock to major |
| Sanity client | Minor (^7.x) | API client; follows semver |

---

## What NOT to Use

| Technology | Why Avoid |
|------------|-----------|
| Framer Motion | React-only; no Svelte support |
| Three.js | Overkill for 2D editorial; adds significant bundle size |
| Anime.js | Less capable than GSAP for scroll-linked animations |
| PostCSS for Tailwind | Tailwind v4 Vite plugin is simpler |
| Google Fonts CDN | Slower, GDPR concerns, version instability |
| CSS scroll-driven animations (as primary) | Safari support incomplete; use as progressive enhancement only |

---

## Sources

### Verified (HIGH confidence)
- [Tailwind CSS SvelteKit Guide](https://tailwindcss.com/docs/guides/sveltekit) - Official installation docs
- [SvelteKit Vercel Adapter](https://svelte.dev/docs/kit/adapter-vercel) - Official adapter docs
- [SvelteKit Images](https://svelte.dev/docs/kit/images) - Official image handling docs
- [GSAP Pricing](https://gsap.com/pricing/) - Confirms 100% free status
- [GSAP is Now Free](https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/) - CSS-Tricks coverage
- [Sanity SvelteKit Visual Editing](https://www.sanity.io/docs/visual-editing/visual-editing-with-sveltekit) - Official Sanity docs
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - Official repository

### Community Verified (MEDIUM confidence)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no) - Svelte action pattern
- [Setting Up Tailwind CSS v4 in SvelteKit](https://dev.to/fedor-pasynkov/setting-up-tailwind-css-v4-in-sveltekit-the-vite-plugin-way-a-guide-based-on-real-issues-380n) - Vite plugin approach
- [Web Almanac 2025 Fonts](https://almanac.httparchive.org/en/2025/fonts) - Self-hosting statistics
- [Fontsource](https://fontsource.org/) - Font hosting solution
