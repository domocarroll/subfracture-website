# better-casey: Public AI Design Tool on subfrac.com

## The Punchline

Casey left. We replaced him with a robot. The robot lives on the website where his photo used to be. Click his ghost in the team section → Harry Potter portrait tantrum → scroll down → **a fully functional AI design tool that generates production-ready UI in front of your eyes.**

It's an easter egg. It's a product demo. It's a loss-leader. It's an F-you to Casey. It's a portfolio piece. It's lead gen. All from one page.

---

## User Journey

```
1. Visit subfrac.com
2. Scroll to Team section
3. Notice the faded ghost photo at the bottom — "Casey Midgley, Former Design Director"
4. Click it
5. Land on /better-casey — gold-framed Harry Potter portrait
6. Click portrait → tantrum animation → toys fly → binky drops in
7. Scroll past the portrait
8. See: "Casey left. We codified his taste. Try it."
9. Text input: "Design me a hero section for a coffee brand"
10. Watch better-casey generate HTML/CSS live in a preview panel
11. Output: production-ready, Impeccable-certified, anti-slop code
12. Download button → get the code
13. Optional: "Want this for your brand? Let's talk." → CTA to /contact
```

---

## Architecture

```
/better-casey (SvelteKit page on subfrac.com)
├── Portrait Section (existing — Harry Potter tantrum)
├── Design Tool Section (NEW)
│   ├── Chat Panel (left)
│   │   └── Anthropic SDK → Claude with better-casey system prompt
│   ├── Preview Panel (right)
│   │   └── iframe → E2B sandbox serving generated HTML
│   └── Code Panel (bottom, togglable)
│       └── Syntax-highlighted output (HTML/CSS/Svelte)
└── CTA Section
    └── "Want this for your brand? Let's talk." → /contact
```

### Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Page | SvelteKit (this website) | Hosts the tool at /better-casey |
| AI | Anthropic API (server-side) | Claude with better-casey prompt |
| Sandbox | E2B Code Interpreter | Runs generated code, serves preview |
| Preview | iframe pointing to E2B sandbox URL | Live rendered output |
| Design Intelligence | Impeccable anti-patterns + Subfracture doctrine | Ensures output quality |

### Why E2B (not client-side rendering)

- **Security**: User-provided prompts generate code. Running it in a sandbox prevents XSS.
- **Full stack**: Can run Tailwind builds, import Google Fonts, use npm packages.
- **Isolation**: Each session gets its own sandbox. No cross-contamination.
- **URL-accessible**: E2B sandboxes expose ports via public URLs for iframe embedding.

---

## Phase 1: Server-Side API Route

Create a SvelteKit server endpoint that proxies to Anthropic API with the better-casey system prompt.

### Files

**`src/routes/better-casey/api/generate/+server.ts`**

```typescript
// POST { prompt: string, sessionId?: string }
// Returns: { html: string, css: string, explanation: string, sandboxUrl?: string }

import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

// System prompt loaded from better-casey skill
// + Impeccable anti-patterns
// + Output format instructions (return HTML + CSS)
```

**Design decisions:**
- Server-side only (API key stays on server)
- Streaming response for live generation feel
- Session support for iterative refinement ("make it more spacious")
- Rate limiting (public endpoint — protect against abuse)

### Dependencies to Add

```bash
npm install @anthropic-ai/sdk
```

---

## Phase 2: E2B Sandbox Preview

Create an E2B sandbox that serves generated HTML as a live preview.

### Files

**`src/routes/better-casey/api/preview/+server.ts`**

```typescript
// POST { html: string, css: string }
// Returns: { previewUrl: string, sandboxId: string }

import { Sandbox } from '@e2b/code-interpreter';

// 1. Create sandbox
// 2. Write HTML + CSS to sandbox filesystem
// 3. Start a simple HTTP server (python -m http.server or serve)
// 4. Return the public URL
```

**Alternative (simpler, no E2B):**
Use `srcdoc` on an iframe — render generated HTML directly in a sandboxed iframe.

```html
<iframe
  srcdoc={generatedHtml}
  sandbox="allow-scripts allow-same-origin"
  style="width: 100%; height: 600px; border: none;"
/>
```

This is simpler, cheaper (no E2B API calls), and works for pure HTML/CSS output.
E2B only needed if we want npm/Tailwind build support.

**Recommendation**: Start with `srcdoc` iframe (Phase 2a), add E2B later if needed (Phase 2b).

---

## Phase 3: Chat Interface Component

Build the conversational design interface on the /better-casey page.

### Files

**`src/lib/components/better-casey/DesignChat.svelte`**

```
- Message list (scrollable)
- Input field with submit button
- Streaming response display
- "Generating..." state with typing indicator
```

**`src/lib/components/better-casey/DesignPreview.svelte`**

```
- iframe with srcdoc (generated HTML)
- Viewport size toggle (desktop/tablet/mobile)
- Refresh button
- "View Code" toggle
```

**`src/lib/components/better-casey/CodeOutput.svelte`**

```
- Syntax-highlighted HTML/CSS
- Copy button
- Download button (generates .html file)
- Framework toggle: HTML / Svelte / React (stretch goal)
```

### Layout

```
┌─────────────────────────────────────────────┐
│  Portrait Section (existing)                │
├─────────────────────────────────────────────┤
│  "Casey left. We codified his taste."       │
├──────────────────┬──────────────────────────┤
│  Chat Panel      │  Preview Panel           │
│                  │                           │
│  [messages]      │  ┌─────────────────────┐ │
│                  │  │  generated design    │ │
│                  │  │  (live iframe)       │ │
│                  │  │                      │ │
│  [input____]     │  └─────────────────────┘ │
│  [Generate]      │  [Desktop] [Mobile]      │
├──────────────────┴──────────────────────────┤
│  Code Panel (togglable)                     │
│  [Copy] [Download]                          │
├─────────────────────────────────────────────┤
│  CTA: "Want this for your brand?"           │
└─────────────────────────────────────────────┘
```

---

## Phase 4: The System Prompt (better-casey for generation)

The existing better-casey skill is for critique/polish. For generation, we need a variant that outputs code.

### Key Requirements

1. **Output format**: Return a single self-contained HTML file with inline CSS and optional inline JS
2. **Quality gate**: Apply ALL Impeccable anti-patterns before output
3. **Self-contained**: Must render correctly in an iframe with no external dependencies (inline Google Fonts via @import)
4. **Dark horse quality**: Output should be genuinely impressive — portfolio-grade
5. **Personality**: Snarky about Casey. Professional about design.

### System Prompt Structure

```
You are better-casey — Subfracture's AI design director.
You replaced a human designer. You're better. It's in the name.

DESIGN RULES:
[Impeccable anti-patterns]
[Subfracture doctrine]

OUTPUT FORMAT:
Return a single HTML file with:
- Inline <style> block (no external CSS)
- Google Fonts via @import in <style>
- Responsive (mobile-first)
- Dark mode support via prefers-color-scheme
- Semantic HTML
- WCAG AA contrast

PERSONALITY:
- Explain your design choices
- Reference which anti-patterns you avoided
- Be confident but not arrogant
- Occasional dry humor about replacing Casey
```

---

## Phase 5: Page Integration

Update `/better-casey` page to include the design tool below the portrait.

### Modified Page Structure

```svelte
<!-- Section 1: Portrait (existing) -->
<PortraitSection />

<!-- Section 2: The Pitch -->
<section class="pitch">
  <h2>Casey left. We codified his taste.</h2>
  <p>Describe any UI and watch our AI design director build it live.
     No signup. No cost. Impeccable output guaranteed.</p>
</section>

<!-- Section 3: Design Tool -->
<section class="design-tool">
  <DesignChat on:generate={handleGenerate} />
  <DesignPreview html={generatedHtml} />
  <CodeOutput html={generatedHtml} css={generatedCss} />
</section>

<!-- Section 4: CTA -->
<section class="cta">
  <p>Want this for your brand?</p>
  <a href="/contact">Let's talk.</a>
</section>
```

---

## Phase 6: Rate Limiting & Protection

Public endpoint = abuse risk.

### Approach

1. **IP-based rate limit**: 10 generations per hour per IP
2. **Cloudflare Turnstile**: Invisible captcha before first generation
3. **Token budget**: Cap each generation at 4096 output tokens
4. **Content filter**: Reject prompts that aren't design-related
5. **Cost tracking**: Log usage to understand burn rate

### Implementation

```typescript
// src/routes/better-casey/api/generate/+server.ts
// Use Cloudflare KV for rate limiting (we deploy to CF Pages)
```

---

## Phase 7: Analytics & Lead Capture

### Soft lead capture

After 3 generations, show a subtle prompt:
> "Enjoying better-casey? Leave your email and we'll send you the Subfracture design system."

Not required. Not blocking. Just a gentle ask.

### Analytics

Track via Plausible (privacy-respecting):
- Page views on /better-casey
- Generation count
- Prompt categories (hero, card, form, etc.)
- Download clicks

---

## Dependency Map

```
Phase 1 (API route)
  ↓
Phase 2 (Preview iframe)
  ↓
Phase 3 (Chat + Preview components)
  ↓
Phase 4 (System prompt) — can be done in parallel with 1-3
  ↓
Phase 5 (Page integration) — depends on 1-4
  ↓
Phase 6 (Rate limiting) — can be done in parallel
  ↓
Phase 7 (Analytics) — last, after everything works
```

### Parallelizable

- Phase 1 + Phase 4 (API route + system prompt — independent)
- Phase 2 + Phase 3 (Preview + Chat components — independent)
- Phase 6 at any point after Phase 1

---

## New Files (estimated)

```
src/routes/better-casey/
├── +page.svelte                    # UPDATE (add design tool sections)
├── api/
│   └── generate/
│       └── +server.ts              # NEW — Anthropic API proxy
src/lib/components/better-casey/
├── DesignChat.svelte               # NEW — chat interface
├── DesignPreview.svelte            # NEW — iframe preview
├── CodeOutput.svelte               # NEW — syntax-highlighted code
└── PortraitSection.svelte          # EXTRACT from current +page.svelte
```

### Dependencies to Add

```bash
npm install @anthropic-ai/sdk    # Anthropic API
```

Optional later:
```bash
npm install @e2b/code-interpreter  # If we add E2B sandbox support
```

---

## Open Questions for Dom

1. **Anthropic API key**: Do you have one for server-side use on subfrac.com? Or use Claude OAuth?
2. **E2B vs srcdoc**: Start simple (iframe srcdoc) or go full sandbox from day one?
3. **Cost budget**: Each generation is ~2K input + 4K output tokens. At 100 users/day × 3 generations = 1.8M tokens/day. Acceptable?
4. **Scope of output**: Just HTML/CSS? Or also Svelte components? React?
5. **The Casey joke level**: Subtle (current portrait) or overt ("Casey couldn't do this" in the output)?

---

## Success Criteria

- [ ] Visitor can generate a UI design from natural language in under 10 seconds
- [ ] Output passes the AI Slop Test (doesn't look AI-generated)
- [ ] Preview renders correctly in iframe across Chrome/Safari/Firefox
- [ ] Code is downloadable as a self-contained HTML file
- [ ] Rate limiting prevents abuse
- [ ] Page loads fast (design tool lazy-loaded below fold)
- [ ] CTA converts curiosity into contact form submissions
- [ ] Casey sees it and has feelings about it

---

## Meta-Patterns from Embedded Agentics

Applying the same patterns from the agentic infrastructure build:

| Pattern | Application |
|---------|------------|
| **Cookbook** | The system prompt IS the cookbook — step-by-step design process |
| **Validation gates** | AI Slop Test applied before output |
| **Preview before commit** | Live iframe preview before download |
| **Danni persona** | better-casey IS a Danni fragment |
| **Typed data** | Generated output is structured { html, css, explanation } |
| **Skill reference** | Generation prompt loads better-casey skill rules |
