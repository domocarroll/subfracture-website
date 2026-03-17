# Cookbook: Review Site

## Context
Full visual QA review of the current site state.

## Steps

### 1. Health Check
```bash
cd /home/dom/subfracture-website
npm run check
npm run build
```
Record pass/fail for both.

### 2. Start Dev Server
```bash
npm run dev -- --host 0.0.0.0 --port 5200 &
sleep 3
```

### 3. Desktop Screenshots (1440x900)
```bash
mkdir -p .planning/screenshots/qa/$(date +%Y-%m-%d)
agent-browser open http://localhost:5200
agent-browser set viewport 1440 900
agent-browser screenshot .planning/screenshots/qa/$(date +%Y-%m-%d)/desktop-full.png --full
agent-browser close
```

### 4. Mobile Screenshots (375x812)
```bash
agent-browser open http://localhost:5200
agent-browser set viewport 375 812
agent-browser screenshot .planning/screenshots/qa/$(date +%Y-%m-%d)/mobile-full.png --full
agent-browser close
```

### 5. Content Audit
- Count projects: `grep -c "slug:" src/lib/data/projects.ts`
- Count team members: `grep -c "name:" src/lib/data/team.ts`
- Check for TODOs: `grep -rn "TODO\|FIXME\|TBD" src/ --include='*.svelte' --include='*.ts'`
- Check for placeholder images: `find static/images -name "*.jpg" -size 0`

### 6. Compile Report
Write to `.planning/qa/YYYY-MM-DD-review.md`:

```markdown
# Site Review — {date}

## Build Health
- Type check: PASS/FAIL
- Build: PASS/FAIL

## Content Stats
- Projects: {n}
- Team members: {n}
- Services: 6
- TODOs remaining: {n}

## Visual Review
[Screenshots attached]

### Desktop (1440x900)
[Commentary on each section]

### Mobile (375x812)
[Commentary on each section]

## Issues Found
1. [Issue description] — Severity: HIGH/MEDIUM/LOW
2. ...

## Recommendations
1. [Ordered by impact]
```

### 7. Present Report
Share the report conversationally. Highlight critical issues first.
