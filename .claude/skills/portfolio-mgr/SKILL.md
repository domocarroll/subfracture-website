---
name: portfolio-mgr
description: Manages portfolio projects for the Subfracture website. Knows the Project interface, slug conventions, image requirements, and the full add/update/archive lifecycle.
---

# Portfolio Manager Skill

## Project Interface

From `src/lib/data/projects.ts`:

```typescript
interface Project {
  slug: string;        // lowercase, hyphens, unique
  title: string;       // Display name
  outcome: string;     // One-line result statement
  category: string;    // "Brand Activation" | "Branding" | "Activation" | "Campaign"
  lead: string;        // Team member name
  rotation: number;    // Card tilt: random integer between -4 and 4
  narrative: string[]; // 2 paragraphs
  images: {
    hero: string;      // /images/work/{slug}-hero.jpg
    gallery: string[]; // /images/work/{slug}-01.jpg, -02.jpg, -03.jpg
  };
}
```

## Slug Rules

- Lowercase only
- Hyphens for spaces (no underscores, no special chars)
- Must be unique across all projects
- Used in URL: `/work/{slug}`
- Used in image paths: `/images/work/{slug}-hero.jpg`

## Image Requirements

| Type | Aspect | Min Width | Format | Path |
|------|--------|-----------|--------|------|
| Hero | 16:9 | 1200px | jpg/webp | `static/images/work/{slug}-hero.jpg` |
| Gallery | 4:3 | 800px | jpg/webp | `static/images/work/{slug}-01.jpg` |

## Add Project Workflow

1. Generate slug from title
2. Validate slug is unique in `projects` array
3. Copy images to `static/images/work/`
4. Create new Project object
5. Append to array in `src/lib/data/projects.ts` using spread pattern
6. Run `npm run check`
7. Run `npm run build`
8. Screenshot: portfolio grid + detail page at `/work/{slug}`
9. Present for approval

## Update Project Workflow

1. Find project by slug in `projects` array
2. Create new object with spread: `{ ...existing, ...updates }`
3. Replace in array using map
4. Run check + build + screenshot

## Archive Project Workflow

- Do NOT delete — move to a separate `archivedProjects` array
- Remove from active `projects` export
- Detail page will 404 naturally (no matching slug)

## Card Rotation

Random integer between -4 and 4 for CSS transform on portfolio grid cards.
`Math.floor(Math.random() * 9) - 4`

## Detail Pages

Route: `src/routes/work/[slug]/+page.svelte`
Loader: `src/routes/work/[slug]/+page.ts` calls `getProject(slug)`
No new file needed per project — dynamic routing handles it.
