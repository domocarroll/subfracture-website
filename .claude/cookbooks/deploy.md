# Cookbook: Deploy to Production

## Context
Deploy the current state to Cloudflare Pages.

## Pre-Flight Checks

### 1. Type Check
```bash
cd /home/dom/subfracture-website && npm run check
```
**GATE**: Must exit 0. STOP if it fails.

### 2. Build
```bash
npm run build
```
**GATE**: Must exit 0. STOP if it fails.

### 3. Git Status
```bash
git status --short
git log --oneline -5
```
Warn if there are uncommitted changes.

### 4. Quick Visual Check
Start dev server, take 3 key screenshots (hero, portfolio, contact).
Present to user.

## Deploy

### 5. Present Summary
Tell the user exactly what will go live:
- Latest commit hash and message
- Number of changed files since last deploy
- Any new projects/team changes

### 6. Get Explicit Approval
Ask: "Ready to deploy? This will update the live site at subfrac.com."
**GATE**: Must receive explicit "yes" or approval.

### 7. Deploy
```bash
# Option A: Wrangler (if configured)
npx wrangler pages deploy build/

# Option B: Git push (if Cloudflare Pages watches main branch)
git push origin main
```

## Post-Deploy

### 8. Verify
```bash
# Wait for propagation
sleep 30

# Screenshot production
agent-browser open https://subfrac.com
agent-browser set viewport 1440 900
agent-browser screenshot .planning/screenshots/deploy/$(date +%Y-%m-%d)-production.png
agent-browser close
```

### 9. Report
Present production screenshot to user. Confirm deployment successful.
