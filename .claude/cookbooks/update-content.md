# Cookbook: Update Content

## Context
A team member wants to change copy anywhere on the site.

## Content Areas

| Area | Data Path | File |
|------|-----------|------|
| Hero tagline | `siteContent.hero.tagline` | `src/lib/data/content.ts` |
| Intro heading | `siteContent.intro.heading` | `src/lib/data/content.ts` |
| About section title | `siteContent.about.sectionTitle` | `src/lib/data/content.ts` |
| About intro text | `siteContent.about.introParagraph` | `src/lib/data/content.ts` |
| Problems list | `siteContent.about.problems` | `src/lib/data/content.ts` |
| Closing statement | `siteContent.closing.statement` | `src/lib/data/content.ts` |
| Closing paragraph | `siteContent.closing.paragraph` | `src/lib/data/content.ts` |
| Contact heading | `siteContent.contact.heading` | `src/lib/data/content.ts` |
| Contact intro | `siteContent.contact.intro` | `src/lib/data/content.ts` |
| Footer tagline | `siteContent.footer.tagline` | `src/lib/data/content.ts` |
| Footer credo | `siteContent.footer.credo` | `src/lib/data/content.ts` |
| SEO title | `siteContent.meta.title` | `src/lib/data/content.ts` |
| SEO description | `siteContent.meta.description` | `src/lib/data/content.ts` |
| Client logos | `siteContent.clients` | `src/lib/data/content.ts` |
| Service pillars | `services[n].*` | `src/lib/data/services.ts` |

## Steps

### 1. Identify Content Area
If user specified which area: map to data path above.
If not: present the content areas table and ask which they want to change.

### 2. Show Current Value
Read the current value from the data file. Present it to the user.

### 3. Accept New Value
Ask user for the new text. Confirm it back to them.

### 4. Update Data File
Edit the relevant `.ts` file. Use exact string replacement — don't rewrite the whole file.

### 5. Type Check
```bash
npm run check
```
**GATE**: Must exit 0.

### 6. Build
```bash
npm run build
```
**GATE**: Must exit 0.

### 7. Screenshot
Start dev server, navigate to affected section, capture screenshot.

### 8. Present for Approval
Show the screenshot with the new content highlighted in your explanation.

### 9. Commit (Only on Approval)
```bash
git add src/lib/data/content.ts  # or services.ts
git commit -m "content: update {area description}"
```
