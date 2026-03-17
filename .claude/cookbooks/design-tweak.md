# Cookbook: Design Tweak

## Context
A team member wants to make a visual change (spacing, colors, typography, layout).

## Steps

### 1. Understand the Request
Parse the natural language description. Identify:
- Which section is affected
- What kind of change (color, spacing, typography, layout, animation)
- Reference files likely involved

### 2. Screenshot "Before"
```bash
npm run dev -- --host 0.0.0.0 --port 5200 &
sleep 3
agent-browser open http://localhost:5200
agent-browser set viewport 1440 900
# Navigate to affected section
agent-browser screenshot .planning/screenshots/qa/before-tweak.png
```

### 3. Identify Files to Modify

| Change Type | Primary File | Secondary |
|-------------|-------------|-----------|
| Colors | `src/lib/styles/tokens.css` | Component `<style>` blocks |
| Typography | `src/lib/styles/tokens.css` | Component `<style>` blocks |
| Spacing | Component `<style>` block | `src/app.css` |
| Layout | Component `<style>` block | — |
| Animation | Component `<script>` block | `src/lib/utils/motion.ts` |

### 4. Make the Change
Edit the identified files. Follow existing patterns:
- Use CSS custom properties from `tokens.css` where possible
- Use `clamp()` for responsive values
- Respect `prefers-reduced-motion` for animation changes

### 5. Type Check + Build
```bash
npm run check && npm run build
```
**GATE**: Must pass.

### 6. Screenshot "After"
```bash
agent-browser open http://localhost:5200
# Navigate to same section
agent-browser screenshot .planning/screenshots/qa/after-tweak.png
agent-browser close
```

### 7. Present Comparison
Show before and after screenshots. Explain what changed and why.

### 8. Commit (Only on Approval)
```bash
git add [changed files]
git commit -m "design: {description of change}"
```
