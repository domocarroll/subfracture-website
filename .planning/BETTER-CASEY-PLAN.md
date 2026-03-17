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
10. Haiku responds as Danni: "A surf brand hero... I'm seeing tinted sand tones, bold serif, full-bleed imagery. Give me a moment."
11. Gemini generates HTML/CSS live → preview materializes in iframe
12. Gemini Vision screenshots the output, runs AI Slop Test
13. If pass → show to user with Haiku commentary
14. If fail → Gemini regenerates silently, user never sees the bad version
15. Download button → get production-ready code
16. "Want this for your brand? Let's talk." → CTA to /contact
```

---

## Architecture: Three-Model Stack

```
User prompt
    ↓
┌─────────────────────────────────────────────┐
│  HAIKU 4.5 — Conversation Layer             │
│  • Danni/better-casey persona               │
│  • Parse intent, extract design brief       │
│  • Respond warmly, explain choices           │
│  • Cost: ~$0.0002/turn                      │
│  Output: { brief, mood, type, constraints } │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  GEMINI 3 FLASH/PRO — Generation Layer      │
│  • Receive structured design brief          │
│  • Apply Impeccable anti-patterns           │
│  • Generate self-contained HTML/CSS         │
│  • Include Tailwind CDN + Google Fonts      │
│  • Cost: Dom's existing token pool          │
│  Output: complete HTML document string      │
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  GEMINI 3 PRO VISION — Quality Gate         │
│  • Screenshot the srcdoc iframe             │
│  • Run AI Slop Test against Impeccable rules│
│  • Check: banned fonts? purple gradients?   │
│    card nesting? gray-on-color?             │
│  • Pass → deliver to user                   │
│  • Fail → regenerate with feedback          │
│  Output: { pass: boolean, issues: string[] }│
└──────────────────┬──────────────────────────┘
                   ↓
┌─────────────────────────────────────────────┐
│  SRCDOC IFRAME — Preview Layer              │
│  • Renders HTML directly in sandboxed frame │
│  • Zero infrastructure, instant, free       │
│  • Tailwind via CDN script tag              │
│  • Google Fonts via @import                 │
│  • Viewport toggle: desktop/tablet/mobile   │
└─────────────────────────────────────────────┘
```

### Why This Stack

| Concern | Solution |
|---------|----------|
| **Cost** | Haiku is fractions of a cent. Gemini runs on Dom's existing pool. |
| **Speed** | Haiku responds instantly. Gemini Flash generates in 2-4s. |
| **Quality** | Vision gate catches slop before user sees it. |
| **Personality** | Haiku handles all user-facing conversation (Danni persona). |
| **Scalability** | Public endpoint stays cheap even at volume. |

---

## Phase 1: API Routes (Server-Side)

Three endpoints, all server-side (keys never exposed to client).

### 1a. Conversation endpoint (Haiku)

**`src/routes/better-casey/api/chat/+server.ts`**

```typescript
// POST { messages: Message[], prompt: string }
// Returns: streaming Haiku response (Danni persona)
// When Haiku decides to generate, returns { action: 'generate', brief: {...} }

import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are better-casey — Subfracture's AI design director...
[Danni persona + brief extraction instructions]
When you have enough info to design, respond with a JSON block:
\`\`\`json
{ "action": "generate", "brief": { "type": "hero", "industry": "...", "mood": "...", "constraints": [...] } }
\`\`\`
Otherwise, ask clarifying questions conversationally.`;
```

### 1b. Generation endpoint (Gemini)

**`src/routes/better-casey/api/generate/+server.ts`**

```typescript
// POST { brief: DesignBrief }
// Returns: streaming HTML document

import { GoogleGenAI } from '@google/genai';

const GENERATION_PROMPT = `You are a world-class frontend designer.
[Impeccable anti-patterns — full list]
[Output format: single self-contained HTML with Tailwind CDN + Google Fonts @import]
[Subfracture creative doctrine]

Generate a {brief.type} for a {brief.industry} brand.
Mood: {brief.mood}
Constraints: {brief.constraints}

Return ONLY the HTML. No markdown fences. No explanation.`;
```

### 1c. Quality gate endpoint (Gemini Vision)

**`src/routes/better-casey/api/validate/+server.ts`**

```typescript
// POST { screenshot: base64 }
// Returns: { pass: boolean, issues: string[], suggestions: string[] }

import { GoogleGenAI } from '@google/genai';

const VISION_PROMPT = `You are an expert design critic applying the Impeccable anti-pattern test.
Look at this screenshot and check for:
- Overused fonts (Inter, Arial, Roboto)
- Purple/blue gradients
- Gray text on colored backgrounds
- Card nesting
- Pure black or pure gray
- Bounce/elastic easing indicators
- Generic AI aesthetic ("would someone say 'AI made this' immediately?")

Return JSON: { "pass": boolean, "issues": ["..."], "suggestions": ["..."] }`;
```

### Dependencies

```bash
npm install @anthropic-ai/sdk @google/genai
```

### Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...     # For Haiku conversation
GEMINI_API_KEY=...               # For generation + vision
```

---

## Phase 2: Preview Component (srcdoc iframe)

**`src/lib/components/better-casey/DesignPreview.svelte`**

```svelte
<script lang="ts">
  interface Props {
    html: string;
    viewport: 'desktop' | 'tablet' | 'mobile';
  }
  let { html, viewport = 'desktop' }: Props = $props();

  const viewportWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };
</script>

<div class="preview-container">
  <div class="viewport-bar">
    <button onclick={() => viewport = 'desktop'}>Desktop</button>
    <button onclick={() => viewport = 'tablet'}>Tablet</button>
    <button onclick={() => viewport = 'mobile'}>Mobile</button>
  </div>
  <div class="preview-frame" style:width={viewportWidths[viewport]}>
    <iframe
      srcdoc={html}
      sandbox="allow-scripts allow-same-origin"
      title="Design preview"
    />
  </div>
</div>
```

Key decisions:
- `sandbox="allow-scripts allow-same-origin"` — allows Tailwind CDN and Google Fonts
- Viewport toggle resizes the frame container, not the iframe itself
- Streams: update `html` binding as Gemini streams → iframe re-renders progressively

---

## Phase 3: Chat Interface Component

**`src/lib/components/better-casey/DesignChat.svelte`**

Core behaviors:
- Message list with auto-scroll
- Input field with Enter-to-submit
- Streaming Haiku responses
- When Haiku returns `{ action: 'generate' }`, automatically triggers generation
- Shows "Designing..." state with progress indicator during Gemini generation
- After generation, Haiku comments on the result ("Here's what I built and why...")

Message types:
```typescript
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'generating' | 'preview' | 'error';
};
```

---

## Phase 4: Code Output Component

**`src/lib/components/better-casey/CodeOutput.svelte`**

- Toggle panel (collapsed by default, "View Code" button)
- Syntax highlighting (use Shiki or Prism — or just `<pre><code>` with CSS)
- Copy to clipboard button
- Download as `.html` file button
- Line numbers

Keep it simple. No framework toggle in v1 — just raw HTML output.

---

## Phase 5: Page Integration

Update `/better-casey/+page.svelte` to compose all sections:

```
┌─────────────────────────────────────────────┐
│  Portrait Section (existing)                │
│  Gold frame, Harry Potter tantrum           │
├─────────────────────────────────────────────┤
│  The Pitch                                  │
│  "Casey left. We codified his taste."       │
│  "Describe any UI. Watch it materialize."   │
├──────────────────┬──────────────────────────┤
│  Chat Panel      │  Preview Panel           │
│  (left, 40%)     │  (right, 60%)            │
│                  │                           │
│  [Danni msgs]    │  ┌─────────────────────┐ │
│                  │  │  srcdoc iframe       │ │
│                  │  │  (live preview)      │ │
│                  │  │                      │ │
│  [input____]     │  └─────────────────────┘ │
│                  │  [Desktop][Tablet][Mobile]│
├──────────────────┴──────────────────────────┤
│  Code Panel (togglable)                     │
│  [View Code ▼] [Copy] [Download]            │
├─────────────────────────────────────────────┤
│  CTA                                        │
│  "Want this for your brand? Let's talk."    │
│  [Contact us →]                             │
└─────────────────────────────────────────────┘
```

On mobile: stack vertically (chat above, preview below).

---

## Phase 6: Rate Limiting & Protection

### Approach

1. **Cloudflare rate limiting** (deploy target is CF Pages):
   - 10 generations per hour per IP
   - Use `cf.request` headers for IP identification
2. **Token budget**: Cap Gemini output at 8192 tokens per generation
3. **Haiku guard**: Haiku validates the prompt is design-related before triggering generation
   - "Write me an essay" → Haiku: "I only do design. Try me with something visual."
4. **No auth required** — frictionless is the point

### Implementation

Rate limit via Cloudflare Workers KV or simple in-memory map (acceptable for CF Pages functions).

---

## Phase 7: Analytics & Lead Capture

### Soft capture (after 3 generations)

Subtle inline prompt:
> "You've generated 3 designs. Subfracture builds brand worlds like this for a living. [Leave your email] and we'll send you our design system."

### Analytics (Plausible)

- `/better-casey` page views
- Generation events (custom event)
- Download clicks (custom event)
- CTA clicks (custom event)

---

## File Manifest

```
NEW FILES:
src/routes/better-casey/api/chat/+server.ts          # Haiku conversation
src/routes/better-casey/api/generate/+server.ts       # Gemini generation
src/routes/better-casey/api/validate/+server.ts       # Gemini Vision quality gate
src/lib/components/better-casey/DesignChat.svelte     # Chat interface
src/lib/components/better-casey/DesignPreview.svelte  # srcdoc iframe preview
src/lib/components/better-casey/CodeOutput.svelte     # Code display + download
src/lib/components/better-casey/PortraitSection.svelte # Extracted from +page.svelte

MODIFIED FILES:
src/routes/better-casey/+page.svelte                  # Compose all sections
package.json                                          # Add @anthropic-ai/sdk, @google/genai
.env.example                                          # Add ANTHROPIC_API_KEY, GEMINI_API_KEY
```

---

## Dependency Map

```
Phase 1a (Haiku chat API) ─────┐
Phase 1b (Gemini gen API) ─────┤── Can build in parallel
Phase 1c (Vision gate API) ────┘
           ↓
Phase 2 (Preview component) ───┐
Phase 3 (Chat component) ──────┤── Can build in parallel
Phase 4 (Code output) ─────────┘
           ↓
Phase 5 (Page integration) ──── Depends on 1-4
           ↓
Phase 6 (Rate limiting) ─────── Can build in parallel with 5
           ↓
Phase 7 (Analytics) ──────────── Last
```

**Estimated build: 3 waves of parallel work.**

---

## Deployment Note: adapter-static Limitation

The current site uses `adapter-static` (Cloudflare Pages static). The API routes (`+server.ts`) require a **server adapter** — either:

1. **`adapter-cloudflare`** — swap out adapter-static for Cloudflare Pages Functions (recommended, minimal change)
2. **`adapter-vercel`** — if deploying to Vercel instead
3. **Separate API** — deploy the AI endpoints as a standalone Cloudflare Worker, keep the site static

**Recommendation**: Switch to `adapter-cloudflare`. It supports both static pages AND server endpoints. Minimal migration — just change the adapter in `svelte.config.js`.

---

## Success Criteria

- [ ] Visitor generates a UI design from natural language in under 8 seconds
- [ ] Haiku conversation feels warm, sharp, and distinctly Danni
- [ ] Gemini output passes the AI Slop Test (Vision gate catches failures)
- [ ] Preview renders correctly in srcdoc iframe (Chrome/Safari/Firefox)
- [ ] Code is downloadable as a self-contained HTML file
- [ ] Rate limiting prevents abuse (10/hour/IP)
- [ ] Page loads fast (design tool lazy-loaded below fold)
- [ ] CTA converts curiosity into contact form submissions
- [ ] The whole thing works with no signup, no login, no friction
- [ ] Casey sees it and has complicated feelings about it

---

## Meta-Patterns from Embedded Agentics

| Pattern | Application |
|---------|------------|
| **Cookbook** | The generation prompt IS the cookbook — structured design process |
| **Validation gates** | Vision gate = the AI Slop Test before user sees output |
| **Preview before commit** | Live iframe preview before download |
| **Danni persona** | Haiku IS Danni, better-casey IS the fragment |
| **Builder + Validator** | Gemini = Builder (generates), Vision = Validator (read-only critique) |
| **Typed data** | Structured brief { type, mood, industry, constraints } |
| **Two-phase execution** | Haiku routes → Gemini executes (like SKILL.md → cookbook) |
