# Subfracture Website — Operations
# Usage: just <recipe>
# For non-technical team: just add-project, just update-team, just review-site

# ─── Development ───

dev:
    npm run dev -- --host 0.0.0.0 --port 5200

build:
    npm run check && npm run build

preview:
    npm run preview

check:
    npm run check

# ─── Content Operations ───

# Add a new portfolio project
add-project name="":
    claude -p "/add-project {{name}}"

# Update team members (add, edit, remove)
update-team args="":
    claude -p "/update-team {{args}}"

# Edit any site copy
update-content args="":
    claude -p "/update-content {{args}}"

# ─── Quality & Review ───

# Full visual QA review with screenshots
review-site:
    claude -p "/review-site"

# Quick health check
status:
    claude -p "/site-status"

# Gather feedback from humans
feedback:
    claude -p "/feedback"

# ─── Design ───

# Make a visual change
design-tweak args="":
    claude -p "/design-tweak {{args}}"

# ─── Deploy ───

# Build, validate, and deploy to production
deploy:
    claude -p "/deploy"

# ─── Utilities ───

# Load full context for a new session
prime:
    claude -p "/prime"

# Check what's needed from humans before launch
whats-needed:
    claude -p "/whats-needed"

# Content statistics
content-stats:
    @echo "Projects: $(grep -c 'slug:' src/lib/data/projects.ts)"
    @echo "Team: $(grep -c 'name:' src/lib/data/team.ts)"
    @echo "Services: 6"

# Full health check
health: check build content-stats

# ─── OpenCode (Team Interface) ───

# Start OpenCode TUI with operator agent
oc:
    opencode --agent subfrac-operator

# Run a single command via OpenCode (non-interactive)
oc-run args="":
    opencode run --agent subfrac-operator "{{args}}"

# Start OpenCode web interface (browser-based — most accessible)
oc-web:
    opencode web --agent subfrac-operator

# ─── Team Sessions (tmux) ───

# Spawn a team member's OpenCode session
spawn name:
    @tmux kill-session -t subfrac-{{name}} 2>/dev/null || true
    tmux new-session -d -s subfrac-{{name}} -c $(pwd)
    tmux send-keys -t subfrac-{{name}} "opencode --agent subfrac-operator" Enter
    @echo "Session 'subfrac-{{name}}' is live. Attach with: tmux attach -t subfrac-{{name}}"

# Spawn all team sessions
spawn-all: (spawn "warwick") (spawn "tyronne") (spawn "amanda")

# List active team sessions
sessions:
    @tmux list-sessions 2>/dev/null | grep "subfrac-" || echo "No active team sessions"

# Attach to a team session
attach name:
    tmux attach -t subfrac-{{name}}

# Kill a team session
kill name:
    tmux kill-session -t subfrac-{{name}}

# Kill all team sessions
kill-all:
    @tmux list-sessions 2>/dev/null | grep "subfrac-" | cut -d: -f1 | xargs -I{} tmux kill-session -t {} 2>/dev/null || echo "No sessions to kill"
