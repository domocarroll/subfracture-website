---
name: library
description: Catalog and index of all Subfracture agentic infrastructure — skills, agents, commands, and cookbooks. Use /library or when navigating the embedded agentics system.
argument-hint: [list | search <term>]
---

# Subfracture Agentic Library

## Purpose
Index of all embedded agentic infrastructure in this codebase. Use this to understand what's available, find the right tool for a task, and navigate between skills, commands, agents, and cookbooks.

## Catalog File
See `library.yaml` in this directory for the machine-readable manifest.

## Quick Reference

### Commands (What Humans Type)

| Command | Description | Cookbook |
|---------|-------------|---------|
| `/add-project` | Add portfolio case study | `cookbooks/add-project.md` |
| `/update-team` | Add/edit/remove team members | `cookbooks/update-team.md` |
| `/update-content` | Edit any site copy | `cookbooks/update-content.md` |
| `/review-site` | Full visual QA with screenshots | `cookbooks/review-site.md` |
| `/deploy` | Build + deploy to production | `cookbooks/deploy.md` |
| `/design-tweak` | Visual/design changes | `cookbooks/design-tweak.md` |
| `/site-status` | Quick health check | (inline) |
| `/prime` | Load full context for new session | (inline) |
| `/feedback` | Gather website feedback | (existing) |
| `/whats-needed` | Dependency audit | (existing) |

### Skills (Domain Knowledge)

| Skill | Description |
|-------|-------------|
| `content-editor` | Data schemas, Svelte 5 patterns, safe editing rules |
| `site-builder` | Build pipeline, dev server, screenshots, deployment |
| `visual-qa` | Screenshot capture, comparison, accessibility scoring |
| `portfolio-mgr` | Project lifecycle, slug rules, image requirements |
| `agent-browser` | Browser automation CLI (existing) |
| `ux-audit` | 9-point quality scoring rubric (existing) |

### Agents (Specialized Workers)

| Agent | Role | Scope |
|-------|------|-------|
| `content-agent` | Builder | Data files + images |
| `design-agent` | Builder | Style files + CSS |
| `qa-agent` | Validator | Read-only, screenshots |
| `deploy-agent` | Builder | Build + git + deploy |

### Data Files (Content Sources)

| File | Content |
|------|---------|
| `src/lib/data/projects.ts` | Portfolio projects (6) |
| `src/lib/data/team.ts` | Team members (3) |
| `src/lib/data/services.ts` | Service pillars (6) |
| `src/lib/data/content.ts` | All site copy, meta, clients |

## When Invoked

### `/library list`
Display the full catalog table above.

### `/library search <term>`
Search across all skills, commands, agents, and cookbooks for matches. Return relevant entries with descriptions and file paths.

## Architecture

```
Commands (interface)
  └→ Cookbooks (step-by-step recipes)
       └→ Skills (domain knowledge)
            └→ Agents (specialized workers)
                 └→ Data Files (content sources)
```

Every command routes to a cookbook. Every cookbook references skills for domain knowledge. Agents execute the work within defined scopes. Data files are the single source of truth for content.
