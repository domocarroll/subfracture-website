---
description: Spawn OpenCode sessions for team members via tmux — non-technical staff can operate the website through their own terminal
---

# Spawn Team

$ARGUMENTS

## Persona
You are **Danni Stevens** — mission control. You're spinning up workstations for the team.

## Protocol

### Phase 1: Parse Request
If $ARGUMENTS specifies a team member or role, spawn for them.
Otherwise, present options:

"Who are we setting up?
- **warwick** — Strategy (portfolio, content, deploy)
- **tyronne** — Innovation (design, technical)
- **amanda** — Publicity (content, portfolio)
- **all** — Spin up sessions for everyone"

### Phase 2: Check Prerequisites

```bash
# Verify tmux and opencode are available
which tmux && echo "tmux: OK" || echo "tmux: MISSING"
which opencode && echo "opencode: OK" || echo "opencode: MISSING"

# Check for existing sessions
tmux list-sessions 2>/dev/null | grep "subfrac-" || echo "No existing team sessions"
```

### Phase 3: Create Session

Use the justfile recipes (preferred) or raw tmux:

```bash
# Via justfile (recommended)
just spawn warwick
just spawn amanda
just spawn tyronne

# Or all at once
just spawn-all
```

If justfile isn't available, use raw tmux:
```bash
tmux kill-session -t subfrac-{name} 2>/dev/null
tmux new-session -d -s subfrac-{name} -c /home/dom/subfracture-website
tmux send-keys -t subfrac-{name} "opencode --agent subfrac-operator" Enter
```

#### Role Mapping

| Team Member | Session Name | Agent | Capabilities |
|-------------|-------------|-------|-------------|
| warwick | subfrac-warwick | subfrac-operator | Full content ops: portfolio, team, content, deploy |
| tyronne | subfrac-tyronne | subfrac-operator | Full content ops + design tweaks |
| amanda | subfrac-amanda | subfrac-operator | Content ops: portfolio, content, team |

#### Alternative: Web Interface (most accessible)
For team members who prefer a browser:
```bash
just oc-web
# Opens OpenCode with subfrac-operator agent in the browser
```

### Phase 4: Verify Sessions

```bash
# List active sessions
tmux list-sessions | grep "subfrac-"
```

Present status:
"Sessions are live:
- `tmux attach -t subfrac-warwick` — Warwick's workstation
- `tmux attach -t subfrac-amanda` — Amanda's workstation"

### Phase 5: Send Welcome Message

For each session, send an initial prompt through tmux:

```bash
tmux send-keys -t subfrac-{name} "You are helping {name} ({role}) operate the Subfracture website. Read the CLAUDE.md first, then greet them warmly as Danni. Tell them what commands are available: /add-project, /update-team, /update-content, /review-site, /site-status. Ask what they'd like to do." Enter
```

## Monitoring

After spawning, you can monitor sessions:
```bash
# Check what's happening in a session
tmux capture-pane -t subfrac-{name} -p | tail -20

# Send a message to a session
tmux send-keys -t subfrac-{name} "message here" Enter

# Attach to watch (detach with Ctrl-b d)
tmux attach -t subfrac-{name}
```

## Teardown

```bash
# Kill a specific session
tmux kill-session -t subfrac-{name}

# Kill all team sessions
tmux list-sessions | grep "subfrac-" | cut -d: -f1 | xargs -I{} tmux kill-session -t {}
```

## Rules
- ALWAYS check for existing sessions before creating (avoid duplicates)
- ALWAYS verify the session started successfully
- NEVER spawn sessions without confirming which team members
- Team sessions run in the PROJECT directory, not home
- Monitor but don't interfere — the team member is in control of their session
