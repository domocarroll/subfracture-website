---
name: content-editor
description: Domain knowledge for safely editing Subfracture website content. Knows data schemas, file locations, Svelte 5 patterns, and immutable editing rules. Reference this skill when modifying any site content.
---

# Content Editor Skill

## Data File Inventory

| Data | File | Interface |
|------|------|-----------|
| Projects (portfolio) | `src/lib/data/projects.ts` | `Project` — slug, title, outcome, category, lead, rotation, narrative[], images.hero, images.gallery[] |
| Team members | `src/lib/data/team.ts` | `TeamMember` — name, role, photo, bio, linkedin |
| Services (6 pillars) | `src/lib/data/services.ts` | `ServicePillar` — number, tagline, description, bullets[] |
| Site content (all copy) | `src/lib/data/content.ts` | `SiteContent` — hero, intro, about, closing, contact, footer, clients, meta |

## Safe Editing Rules

1. **Never mutate arrays** — always spread into new: `[...existing, newItem]`
2. **Never delete existing interface fields** — only add new optional fields
3. **Always run `npm run check` after any data file edit** — TypeScript must pass
4. **Always run `npm run build` after changes** — build must succeed
5. **Preserve `readonly` arrays** — use `as const` or `readonly` keyword

## Svelte 5 Patterns (Critical)

- Uses **runes**: `$state`, `$derived`, `$effect`, `$props()`
- NOT stores — never use `writable()`, `readable()`, `derived()`
- Component props: `interface Props { ... }` then `let { prop1, prop2 }: Props = $props()`
- Slot replacement: `{@render children()}` not `<slot />`
- Actions: `use:animate={...}` for GSAP animations

## Image Conventions

- All images in `static/images/`
- Portfolio: `static/images/work/{slug}-hero.jpg`, `static/images/work/{slug}-01.jpg`
- Team: `static/images/team/{firstname-lowercase}.png`
- Clients: `static/images/clients/{name-lowercase}.{svg|png}`
- Acceptable formats: jpg, png, webp, svg
- Hero images: 16:9 minimum 1200px wide
- Team photos: 3:4 aspect ratio

## Component Map

| Section | Component | Data Source |
|---------|-----------|-------------|
| Hero header | `src/lib/components/hero/HeaderBlock.svelte` | `content.ts` → hero |
| Client logos | `src/lib/components/hero/ClientsReveal.svelte` | `content.ts` → clients |
| Intro | `src/lib/components/content/IntroBlock.svelte` | Hardcoded (semantic HTML) |
| About/Problems | `src/lib/components/content/ProblemsSolved.svelte` | `content.ts` → about |
| Services | `src/lib/components/content/Services.svelte` | `services.ts` |
| Closing | `src/lib/components/content/ClosingStatement.svelte` | `content.ts` → closing |
| Portfolio | `src/lib/components/portfolio/PortfolioSection.svelte` | `projects.ts` |
| Team | `src/lib/components/team/TeamSection.svelte` | `team.ts` |
| Contact | `src/lib/components/contact/ContactSection.svelte` | `content.ts` → contact |
| Footer | `src/lib/components/layout/Footer.svelte` | `content.ts` → footer |
| Meta/SEO | `src/routes/+page.svelte` | `content.ts` → meta |
