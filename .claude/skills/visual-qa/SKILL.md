---
name: visual-qa
description: Visual quality assurance for the Subfracture website. Screenshots sections, compares before/after states, scores accessibility and design quality. Uses agent-browser CLI.
---

# Visual QA Skill

## Tool

Uses `agent-browser` CLI — see `.claude/skills/agent-browser/SKILL.md` for full command reference.

## Screenshot Capture Recipe

```bash
# 1. Start dev server
npm run dev -- --host 0.0.0.0 --port 5200 &
sleep 3

# 2. Open browser
agent-browser open http://localhost:5200

# 3. Desktop captures (1440x900)
agent-browser set viewport 1440 900
agent-browser screenshot screenshots/desktop-hero.png
agent-browser scroll down 1000 && agent-browser wait 800
agent-browser screenshot screenshots/desktop-intro.png
# ... repeat for each section

# 4. Mobile captures (375x812)
agent-browser set viewport 375 812
agent-browser open http://localhost:5200
agent-browser screenshot screenshots/mobile-hero.png
# ... repeat

# 5. Close
agent-browser close
```

## Before/After Comparison

1. Capture "before" screenshots into `.planning/screenshots/qa/before/`
2. Make changes
3. Capture "after" screenshots into `.planning/screenshots/qa/after/`
4. Present both sets to user with commentary on differences

## Output Directory

`.planning/screenshots/qa/YYYY-MM-DD/`

## Quality Scoring

Reference the existing `/ux-audit` skill (`.claude/skills/ux-audit.md`) for the 9-point, 100-point scoring rubric covering:
1. Accessibility (11 pts)
2. Typography (11 pts)
3. Spacing (11 pts)
4. Animation (11 pts)
5. Performance (11 pts)
6. Responsiveness (11 pts)
7. Color System (11 pts)
8. Navigation (11 pts)
9. Content (11 pts)

Scores: A (90+), B (75-89), C (60-74), D (0-59)
