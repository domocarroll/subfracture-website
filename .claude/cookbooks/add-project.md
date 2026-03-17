# Cookbook: Add Portfolio Project

## Context
A team member wants to add a new portfolio case study to the website.

## Input Required
- Project name/title
- Category (Brand Activation / Branding / Activation / Campaign)
- Lead team member
- One-line outcome statement
- 2-paragraph narrative
- Hero image (file path or URL)
- Gallery images (1-3, optional)

## Steps

### 1. Generate Slug
```bash
# Slug = lowercase, hyphens, no special chars
# Example: "SAOR Skin Rebrand" → "saor-skin-rebrand"
```

### 2. Validate Slug Uniqueness
```bash
cd /home/dom/subfracture-website
grep -c "slug: '{slug}'" src/lib/data/projects.ts
# Must return 0. If > 0, append a number: {slug}-2
```

### 3. Process Images
```bash
# Create directory if needed
mkdir -p static/images/work/

# Copy hero image
cp {provided_hero_path} static/images/work/{slug}-hero.jpg

# Copy gallery images
cp {provided_gallery_1} static/images/work/{slug}-01.jpg
cp {provided_gallery_2} static/images/work/{slug}-02.jpg
cp {provided_gallery_3} static/images/work/{slug}-03.jpg
```

### 4. Add Project Entry
Edit `src/lib/data/projects.ts`:
- Add new Project object at the END of the `projects` array
- Use immutable pattern (spread if needed)
- Generate random rotation: `Math.floor(Math.random() * 9) - 4`

### 5. Type Check
```bash
cd /home/dom/subfracture-website && npm run check
```
**GATE**: Must exit 0. If errors, fix and re-run.

### 6. Build
```bash
cd /home/dom/subfracture-website && npm run build
```
**GATE**: Must exit 0. If errors, fix and re-run.

### 7. Screenshot Verification
```bash
# Start dev server
npm run dev -- --host 0.0.0.0 --port 5200 &
sleep 3

# Screenshot portfolio section
agent-browser open http://localhost:5200
agent-browser set viewport 1440 900
agent-browser scroll down 9000
agent-browser wait 1000
agent-browser screenshot .planning/screenshots/qa/new-project-grid.png

# Screenshot detail page
agent-browser open http://localhost:5200/work/{slug}
agent-browser wait 1000
agent-browser screenshot .planning/screenshots/qa/new-project-detail.png
agent-browser close
```

### 8. Present for Approval
Show screenshots to user. Describe what was added.

### 9. Commit (Only on Approval)
```bash
git add src/lib/data/projects.ts static/images/work/{slug}-*
git commit -m "feat: add project {title}"
```

## Rollback
If build fails or user rejects:
```bash
git checkout -- src/lib/data/projects.ts
rm -f static/images/work/{slug}-*
```
