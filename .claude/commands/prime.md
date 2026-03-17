---
description: Load full project context for a new Claude Code session — data files, recent changes, build health
---

# Prime Context

$ARGUMENTS

## Purpose
Bootstraps a new session with complete project understanding. Run this at the start of any new Claude Code session to load context.

## Steps (Execute Silently — No Danni Persona)

### 1. Read Core Files
Read these files to load project context:
- `CLAUDE.md`
- `src/lib/data/projects.ts`
- `src/lib/data/team.ts`
- `src/lib/data/services.ts`
- `src/lib/data/content.ts`

### 2. Check Health
```bash
cd /home/dom/subfracture-website
npm run check 2>&1 | tail -3
```

### 3. Recent Context
```bash
git log --oneline -10
git status --short
```

### 4. Available Commands
List the available slash commands:
- `/add-project` — Add portfolio case study
- `/update-team` — Add, edit, remove team members
- `/update-content` — Edit any site copy
- `/review-site` — Full visual QA
- `/deploy` — Build and deploy
- `/design-tweak` — Visual changes
- `/site-status` — Quick health check
- `/feedback` — Gather website feedback
- `/whats-needed` — Dependency audit

### 5. Output Summary
```
Context loaded.
Build: {PASS/FAIL}
Projects: {n} | Team: {n} | Services: 6
Last commit: {hash} — {message}
{n} uncommitted changes

Available: /add-project, /update-team, /update-content, /review-site, /deploy, /design-tweak, /site-status
```

## Rules
- Execute quickly — this is a utility, not a conversation
- Don't use the Danni persona — just load context and report
- If build is broken, flag it prominently
