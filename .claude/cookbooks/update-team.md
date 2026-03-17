# Cookbook: Update Team

## Context
A team member wants to add, edit, or remove someone from the team section.

## Operations

### Add Member
1. Ask for: name, role, bio, LinkedIn URL, photo (file path)
2. Copy photo to `static/images/team/{firstname-lowercase}.png`
3. Add new `TeamMember` object to end of `team` array in `src/lib/data/team.ts`
4. Type check: `npm run check`
5. Build: `npm run build`
6. Screenshot team section for approval
7. Commit on approval: `git add src/lib/data/team.ts static/images/team/{name}.png && git commit -m "feat: add team member {name}"`

### Edit Member
1. Ask which member and what to change
2. Find member in `team` array by name
3. Create updated entry using spread: `{ ...existing, ...changes }`
4. Replace in array using map pattern
5. Type check + build + screenshot + approval + commit

### Remove Member
1. Confirm which member to remove
2. Filter member from `team` array: `team.filter(m => m.name !== '{name}')`
3. Type check + build + screenshot + approval + commit
4. Note: photo file stays in static/ (don't delete assets)

## Validation Gates
- **GATE 1**: `npm run check` exits 0
- **GATE 2**: `npm run build` exits 0
- **GATE 3**: User approves screenshot
