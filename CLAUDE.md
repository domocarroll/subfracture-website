# Subfracture Website v2 - Project Memory

## Project Status
- **Version**: 2.0 (Fresh build)
- **v1 Archive**: `/_archive/v1/` (preserved for reference)

## Tech Stack
- **Build**: Vite
- **Deployment**: Vercel
- **Styling**: Vanilla CSS (no framework)
- **JavaScript**: Vanilla JS with GSAP for animations

## Directory Structure
```
/
├── assets/
│   ├── css/        # Stylesheets
│   ├── js/         # Scripts
│   ├── images/     # Visual assets
│   └── fonts/      # Typography
├── index.html      # Main entry
├── _archive/v1/    # Previous version (reference)
└── CLAUDE.md       # This file
```

## Design Direction
*(To be populated based on user's design inputs)*

## Known Patterns & Gotchas

### From v1 (Reference)
- ScrollTrigger can fire on page load - always check `scrollY > threshold` before animating
- `overflow: hidden` + `perspective` are CSS-incompatible (spec flattens 3D)
- CSS Grid `grid-template-rows: 0fr/1fr` is excellent for smooth height animations
- Content wrapper needs `overflow: hidden; min-height: 0` for grid collapse

## Build Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```
