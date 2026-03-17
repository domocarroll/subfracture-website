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
just <recipe>    # Operations via justfile (see below)
```

## Embedded Agentic Infrastructure

This codebase has embedded agentic capabilities for non-technical team operation.

### Slash Commands (for team members)
| Command | What it does |
|---------|-------------|
| `/add-project` | Add a portfolio case study |
| `/update-team` | Add/edit/remove team members |
| `/update-content` | Edit any site copy |
| `/review-site` | Full visual QA with screenshots |
| `/deploy` | Build + deploy to production |
| `/design-tweak` | Make visual changes |
| `/site-status` | Quick health check |
| `/prime` | Load full context for new session |

### Justfile (terminal access)
```bash
just add-project "Project Name"  # Add portfolio project
just update-team                 # Modify team section
just review-site                 # Full visual QA
just deploy                      # Deploy to production
just status                      # Quick health check
just health                      # Full validation
```

### Data Files (content sources — edit these, not components)
| File | Content |
|------|---------|
| `src/lib/data/projects.ts` | Portfolio projects |
| `src/lib/data/team.ts` | Team members |
| `src/lib/data/services.ts` | Service pillars |
| `src/lib/data/content.ts` | All site copy, meta, clients |

### Architecture
```
Commands (interface) → Cookbooks (recipes) → Skills (knowledge) → Agents (workers) → Data Files
```

All commands route to step-by-step cookbooks in `.claude/cookbooks/`. Agents have scoped permissions (content-agent edits data, design-agent edits CSS, qa-agent is read-only). Every mutation has a preview gate (screenshot + build validation + user approval before commit).

Full catalog: `.claude/skills/library/library.yaml`

## Known Patterns & Gotchas

### From v1 (Reference)
- ScrollTrigger can fire on page load - always check `scrollY > threshold` before animating
- `overflow: hidden` + `perspective` are CSS-incompatible (spec flattens 3D)
- CSS Grid `grid-template-rows: 0fr/1fr` is excellent for smooth height animations

### Svelte 5
- Uses runes (`$state`, `$derived`, `$effect`) instead of stores
- `$props()` for component props
- `{@render children()}` for slot content
