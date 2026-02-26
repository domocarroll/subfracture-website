# Subfracture Website v2 - Project Memory

## Project Status
- **Version**: 2.0 (SvelteKit rebuild)
- **v1 Archive**: `/_archive/v1/` (preserved for reference)

## Tech Stack
- **Framework**: SvelteKit (Svelte 5)
- **Styling**: Tailwind CSS 4
- **Build**: Vite 7
- **Language**: TypeScript
- **CMS**: Sanity (to be added before deployment)
- **Deployment**: Cloudflare Pages

## Directory Structure
```
/
├── src/
│   ├── routes/         # SvelteKit pages
│   ├── lib/            # Shared components & utilities
│   └── app.css         # Global Tailwind styles
├── functions/
│   └── api/            # Cloudflare Pages Functions (contact form)
├── static/             # Static assets + _headers
├── _archive/v1/        # Previous version (reference)
└── CLAUDE.md           # This file
```

## Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run check    # Type checking
```

## Design Direction
*(To be populated based on user's design inputs)*

## Known Patterns & Gotchas

### From v1 (Reference)
- ScrollTrigger can fire on page load - always check `scrollY > threshold` before animating
- `overflow: hidden` + `perspective` are CSS-incompatible (spec flattens 3D)
- CSS Grid `grid-template-rows: 0fr/1fr` is excellent for smooth height animations

### Svelte 5
- Uses runes (`$state`, `$derived`, `$effect`) instead of stores
- `$props()` for component props
- `{@render children()}` for slot content
