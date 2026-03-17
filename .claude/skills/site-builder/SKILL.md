---
name: site-builder
description: Build, validate, preview, and deploy the Subfracture website. Knows the full build pipeline, dev server setup, screenshot workflow, and deployment targets.
---

# Site Builder Skill

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev -- --host 0.0.0.0 --port 5200` | Start dev server |
| `npm run check` | TypeScript + Svelte type checking |
| `npm run build` | Production build (adapter-static → `build/`) |
| `npm run preview` | Preview production build locally |

## Build Pipeline

1. `npm run check` — must exit 0
2. `npm run build` — must produce `build/` directory with no errors
3. `npm run preview` — serves production build for verification

## Screenshot Workflow

Requires `agent-browser` CLI (see `.claude/skills/agent-browser/SKILL.md`).

```bash
# Start dev server first (in background or separate terminal)
npm run dev -- --host 0.0.0.0 --port 5200 &

# Desktop viewport
agent-browser open http://localhost:5200
agent-browser set viewport 1440 900

# Capture each section by scrolling
agent-browser screenshot .planning/screenshots/qa/hero.png
agent-browser scroll down 1000 && agent-browser wait 500
agent-browser screenshot .planning/screenshots/qa/intro.png
# ... continue for each section
agent-browser close
```

## Section Scroll Positions (approximate for 1440x900 viewport)

| Section | Scroll Y | Notes |
|---------|----------|-------|
| Hero + HeaderBlock | 0 | Above fold |
| IntroBlock | 1000 | Full height |
| ClientsReveal | 2000 | Logo ticker |
| ProblemsSolved | 2500 | + carousel below |
| Services | 4000-7000 | Pinned 480vh scroll |
| ClosingStatement | 8000 | Bridge section |
| Portfolio | 9000 | Grid with cards |
| Team | 10500 | Cream background |
| Contact | 11500 | Dark chapter |
| Footer | 12500 | Sticky footer |

## Deployment

- **Target**: Cloudflare Pages (adapter-static)
- **Build output**: `build/` directory
- **Fallback**: `index.html` (SPA mode)

## Validation Checklist

- [ ] `npm run check` exits 0
- [ ] `npm run build` exits 0
- [ ] No TypeScript errors
- [ ] No Svelte warnings
- [ ] All referenced images exist in `static/`
- [ ] Build output under 500KB total (excluding images)
