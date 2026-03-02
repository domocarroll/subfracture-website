# Video Analysis & Design Extraction Plan

## Source
**"This Changed The Way I Design With AI"** — AI LABS (124k subs)
- URL: https://www.youtube.com/watch?v=sdxJEd7nqiQ
- Duration: 9:59 | Uploaded: 2026-02-28 | Views: 9.7k
- Full transcript saved at: `/tmp/ailabs-sdxJEd7nqiQ.en.vtt`

## What The Video Covers

AI LABS built a multi-page website for a **"Creator Direction Studio"** using:

1. **Pencil.dev** — AI design canvas (Figma alternative with bidirectional code sync)
2. **Claude Code** with **Opus 4.6** — primary coding agent
3. **Custom file-watcher script** — monitors `.pen` design file, auto-triggers Claude CLI to sync changes to Next.js on save (eliminates manual "sync" prompting)
4. **Multi-agent system** — 5 Claude agents spawned in parallel, each building a different page while keeping design system consistent (fonts, colors, styling)
5. **GSAP scroll animations** — detailed XML-structured prompts targeting every section
6. **Lenis smooth scrolling** — layered on top of GSAP for immersive scroll feel
7. **Custom UX Audit skill** — built with Skill Creator, 9-point checklist + Python scripts for programmatic accessibility/usability checks, scored website C→B after fixes

## Key Techniques Worth Extracting

### 1. XML-Structured GSAP Prompts
They wrote highly detailed XML prompts specifying:
- Task details in tags
- Required dependencies
- Per-element animation behavior
- Section-by-section scroll trigger instructions
- Rules and constraints

**Why it matters for us**: We already use GSAP + Lenis. Their XML prompt structure could make our animation prompts more precise and reproducible.

### 2. Multi-Agent Parallel Page Design
- 5 agents, each assigned a different page
- Shared design system context (fonts, colors, styling docs)
- PRD and UI guide files stored as context docs before diving in

**Why it matters for us**: We have team/agent infrastructure. Could parallelize section rebuilds or new page creation.

### 3. UX Audit Skill
- Custom Claude Code skill
- 9-point UX checklist
- Phases: gather context → analyze → report with scores
- Python scripts catching programmatic UX issues
- WCAG compliance checking

**Why it matters for us**: We should build a similar audit skill for our own site.

### 4. Design-to-Code File Watcher
- Monitors design file for changes
- Cooldown periods to prevent token waste
- Auto-triggers Claude CLI with sync prompt on save
- Pre-configured permissions in `.claude/settings.json`

**Why it matters for us**: Pattern for any file-watching → agent-trigger workflow.

### 5. Lenis + GSAP Complementary Approach
Their exact framing:
> "GSAP controls what happens when you scroll. Lenis controls the look and feel of the scroll itself."

**We already do this** — validates our architecture choice.

---

## The Creative Website (What Dom Loves)

The website they built is for a **"Creator Direction Studio"** — a creative agency/direction company. It features:

- Multi-page layout (5+ pages)
- Consistent design system across all pages
- GSAP scroll-triggered animations per section
- Lenis smooth scrolling overlay
- WCAG-compliant after UX audit pass
- Built with Next.js

### What to extract for subfracture-website:
The video doesn't host the final site publicly, but the community at **ailabspro.io** has the source code (marked as "Video code: V46"). The visual style and interaction patterns shown are:

1. **Scroll-driven section reveals** with GSAP
2. **Smooth, immersive navigation feel** via Lenis
3. **Strong typographic hierarchy** consistent across pages
4. **Motion as storytelling** — not decorative, guides the eye
5. **Multi-page architecture** with consistent design tokens

---

## Task for Fresh Context Window

### Objective
Analyze the Creator Direction Studio website from this video, extract specific design patterns, animations, and interaction ideas, then create an actionable enhancement plan for the Subfracture website.

### Steps

1. **Check ailabspro.io** for the V46 source code / demo
   - Look for the Creator Direction Studio template
   - Extract color palette, typography, animation timings, layout patterns

2. **Review pencil.dev** for the design canvas approach
   - Understand if bidirectional sync could benefit our workflow
   - Check if pencil.dev works with SvelteKit (video used Next.js)

3. **Extract animation patterns** from their XML prompt approach
   - Create equivalent GSAP animation prompts in XML for our sections
   - Document per-section scroll behavior specifications

4. **Build a UX Audit skill** for Claude Code
   - 9-point checklist (accessibility, contrast, navigation, etc.)
   - Python scripts for programmatic WCAG checking
   - Scoring rubric (A/B/C/D)

5. **Identify specific "cool things" to adopt**
   - Compare their scroll animation style to our current implementation
   - Note any interaction patterns we're missing
   - Look at their page transition approach for multi-page

6. **Create implementation tickets** for enhancements

### Context to Include
- Our site: SvelteKit + Svelte 5, Tailwind CSS 4, GSAP, Lenis
- Current page flow: Hero → ProblemsSolved → Services → Portfolio → Team → Contact → Footer
- We already have GSAP + Lenis — looking for refinement, not setup
- Design doctrine: white space as primary material, restraint = authority, typography leads
- Deployment: Cloudflare Pages (adapter-static)

### Reference Files
- `/home/dom/subfracture-website/CLAUDE.md` — project config
- `/home/dom/subfracture-website/.planning/SPRINT-V1.md` — current sprint
- `/home/dom/subfracture-website/.planning/SISYPHUS-HANDOFF.md` — remaining work
- `/home/dom/subfracture-website/src/routes/+page.svelte` — main page
- `/home/dom/subfracture-website/src/routes/+layout.svelte` — Lenis/GSAP init
