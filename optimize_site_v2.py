"""
Subfracture Site-Wide GEPA Optimizer v2
=======================================
Evolves tokens.css through LLM-guided iterations.
Takes 9 screenshots at different scroll positions, VLM-scores each section,
and mutates CSS custom properties for site-wide visual refinement.

Updated for v2 site architecture:
  Hero → IntroBlock → ClientsReveal → ProblemsSolved → Services →
  ClosingStatement → InlineCTA → Portfolio → Team → Contact

Prerequisites:
    - Vite dev server running: npm run dev (port 5173)
    - CLIProxyAPI running: cd ~/CLIProxyAPI && ./cli-proxy-api (port 8317)
    - pip install gepa litellm playwright

Usage:
    cd /home/dom/subfracture-website
    python3 optimize_site_v2.py
"""

import base64
import os
import re
import time
from pathlib import Path

import gepa.optimize_anything as oa
from gepa.optimize_anything import (
    EngineConfig,
    GEPAConfig,
    ReflectionConfig,
    optimize_anything,
)
from gepa.image import Image
from gepa.utils.stop_condition import ScoreThresholdStopper, NoImprovementStopper

TOKENS_FILE = Path("/home/dom/subfracture-website/src/lib/styles/tokens.css")
GALLERY_DIR = Path("/home/dom/subfracture-website/site-evolution-v2")
PREVIEW_URL = "http://localhost:5173/"
CLI_PROXY_BASE = "http://localhost:8317/v1"
REFLECTION_MODEL = "openai/claude-sonnet-4-5-20250929"
MAX_ITERATIONS = 100
HMR_WAIT = 2.5
SCREENSHOT_WAIT = 1.5

SECTIONS = [
    {"name": "hero", "scroll_pct": 0.0, "weight": 0.20},
    {"name": "intro", "scroll_pct": 0.06, "weight": 0.10},
    {"name": "clients", "scroll_pct": 0.12, "weight": 0.08},
    {"name": "about", "scroll_pct": 0.18, "weight": 0.10},
    {"name": "services", "scroll_pct": 0.30, "weight": 0.10},
    {"name": "closing", "scroll_pct": 0.42, "weight": 0.08},
    {"name": "portfolio", "scroll_pct": 0.55, "weight": 0.12},
    {"name": "team", "scroll_pct": 0.72, "weight": 0.10},
    {"name": "contact", "scroll_pct": 0.88, "weight": 0.12},
]

OBJECTIVE = """
Optimize the CSS design tokens (tokens.css) for the Subfracture website — a culture
strategy studio. The candidate is a CSS file containing all design tokens as custom
properties inside an @theme block. Vite HMR hot-reloads changes instantly.

The goal is a cohesive site where every section carries the same refined quality:
1. Clean, minimal aesthetic — white surfaces, near-black text, system sans-serif
2. Editorial precision — type hierarchy, spacing rhythm, opacity balance
3. Section transitions feel organic, not jarring
4. Client logos feel restrained (greyscale, subtle)
5. Team section feels warm and approachable
6. The overall impression is "premium culture studio" — restrained, clean, sophisticated

Creative doctrine: "Restraint = authority. White space is the primary material."

HIGHER SCORE = BETTER. Target: composite score >= 9.0/10.
"""

BACKGROUND = """
## Brand Identity
- Surface color: #ffffff (clean white)
- Surface warm: #f7f7f7 (light grey variant)
- Text color: #0b0b0b (near-black)
- Accent: #ffef6a (yellow — selection/highlight only)
- Typography: System sans-serif stack (ui-sans-serif, system-ui)
- Mood: "Clean minimalism meets culture authority"

## Mutation Surface
The tokens.css file contains all design tokens as CSS custom properties in an @theme block.
GEPA tunes only the VALUES of existing properties — do not add/remove properties or change
the @theme structure. Key tunable groups:

### Colors
--color-surface, --color-surface-warm, --color-bone, --color-text, --color-text-muted,
--color-primary, --color-primary-dark, --color-yellow

### Typography Scale
--text-xs through --text-6xl, line heights, --font-mono/serif/sans

### Layout & Spacing
--spacing-section, --content-max, --content-wide, --letter-spacing-label

### Easing
--ease-organic, --ease-reveal, --ease-subtle

### Section styling
--section-number-size, --section-number-weight, --section-number-color
--prose-max-width, --closing-max-width

## Sections (9 screenshots, weighted)
1. Hero (20%): Video hero with frosted glass overlay, watermark parallax
2. Intro (10%): "Strategic Creative Design Technology" H1 with orb glow
3. Clients (8%): 3D lips reveal animation with client logos (greyscale)
4. About (10%): Problem carousel with editorial heading
5. Services (10%): Pinned scroll-through with service pillars
6. Closing (8%): Scrub text reveal statement
7. Portfolio (12%): Circle-wipe portal with project cards
8. Team (10%): Grid with photos, bios, click-to-expand
9. Contact (12%): Form section with heading

## Scoring Criteria (per section)
- Visual Hierarchy (VH, 20%): Text readability, focal point, depth layers
- Color Harmony (CH, 20%): Palette cohesion, restraint, warmth balance
- Typography (TY, 20%): Scale appropriateness, spacing rhythm, weight balance
- Composition (CO, 15%): Layout balance, whitespace rhythm, section proportions
- Technical Quality (TQ, 10%): No rendering artifacts, clean edges, good contrast ratios
- Brand Alignment (BA, 15%): Restrained, clean, "premium culture studio"

## What NOT to do
- Do NOT change font-family values (keep system sans-serif stack)
- Do NOT change breakpoint values
- Do NOT use neon, saturated, or cold colors
- Do NOT set text sizes outside reasonable ranges (body 0.9-1.3rem, hero 3-10rem)
- Do NOT change the @theme structure or add/remove properties
- Do NOT make things busier — every change should increase restraint
"""

SCORING_PROMPT = """Score this website section screenshot for the Subfracture culture studio.
Section: {section_name}

Rate each axis 0-10 (higher = better). Be critical and precise — differentiate carefully between 7, 8, and 9.

Axes:
- Visual Hierarchy (VH): Is text readable? Clear focal point? Good depth layers?
- Color Harmony (CH): Does the palette feel cohesive and clean? Accent restrained?
- Typography (TY): Good scale, spacing, weight balance? Clean editorial feel?
- Composition (CO): Layout balanced? Whitespace rhythm? Section proportions?
- Technical Quality (TQ): Clean rendering? Good contrast? No artifacts?
- Brand Alignment (BA): Restrained, clean, sophisticated? "Premium culture studio"?

Format your response EXACTLY as:
VH: X.X
CH: X.X
TY: X.X
CO: X.X
TQ: X.X
BA: X.X

Then provide 1-2 sentences of specific actionable feedback for THIS section."""

SCORING_AXES = {
    "vh": {
        "pattern": r"(?:visual\s*hierarchy|VH)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.20,
    },
    "ch": {"pattern": r"(?:color\s*harmony|CH)\s*[:\-=]\s*(\d+\.?\d*)", "weight": 0.20},
    "ty": {"pattern": r"(?:typography|TY)\s*[:\-=]\s*(\d+\.?\d*)", "weight": 0.20},
    "co": {"pattern": r"(?:composition|CO)\s*[:\-=]\s*(\d+\.?\d*)", "weight": 0.15},
    "tq": {
        "pattern": r"(?:technical\s*quality|TQ)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.10,
    },
    "ba": {
        "pattern": r"(?:brand\s*alignment|BA)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.15,
    },
}

_eval_count = 0


def _detect_last_pass() -> int:
    existing = list(GALLERY_DIR.glob("pass-*"))
    if not existing:
        return 0
    nums = []
    for f in existing:
        try:
            nums.append(int(f.name.split("-")[1]))
        except (IndexError, ValueError):
            continue
    return max(nums) if nums else 0


def take_section_screenshots(page, pass_num: int) -> list[dict]:
    total_height = page.evaluate("document.documentElement.scrollHeight")
    viewport_height = page.evaluate("window.innerHeight")
    max_scroll = total_height - viewport_height

    pass_dir = GALLERY_DIR / f"pass-{pass_num:03d}"
    pass_dir.mkdir(parents=True, exist_ok=True)

    results = []
    for section in SECTIONS:
        scroll_y = int(max_scroll * section["scroll_pct"])
        page.evaluate(f"window.scrollTo(0, {scroll_y})")
        time.sleep(SCREENSHOT_WAIT)

        thumb_path = str(pass_dir / f"{section['name']}.png")
        screenshot_bytes = page.screenshot(path=thumb_path, full_page=False)
        results.append(
            {
                "name": section["name"],
                "weight": section["weight"],
                "path": thumb_path,
                "bytes": screenshot_bytes,
            }
        )

    return results


def parse_scores(feedback: str) -> dict[str, float]:
    scores = {}
    for axis_key, axis_config in SCORING_AXES.items():
        match = re.search(axis_config["pattern"], feedback, re.IGNORECASE)
        scores[axis_key] = min(float(match.group(1)), 10.0) if match else 5.0
    return scores


def section_composite(scores: dict[str, float]) -> float:
    return sum(scores[k] * SCORING_AXES[k]["weight"] for k in SCORING_AXES)


def score_section_vlm(
    screenshot_path: str, section_name: str
) -> tuple[dict, float, str]:
    import litellm

    with open(screenshot_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = SCORING_PROMPT.format(section_name=section_name)

    response = litellm.completion(
        model=REFLECTION_MODEL,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{b64}"},
                    },
                ],
            }
        ],
        api_base=CLI_PROXY_BASE,
        api_key="dummy",
    )
    feedback = response.choices[0].message.content
    scores = parse_scores(feedback)
    composite = section_composite(scores)
    return scores, composite, feedback


def evaluate(candidate: str) -> tuple[float, dict]:
    global _eval_count
    _eval_count += 1
    pass_num = _eval_count

    oa.log(f"=== Pass {pass_num} ===")

    TOKENS_FILE.write_text(candidate)
    oa.log("Wrote tokens.css — waiting for HMR...")
    time.sleep(HMR_WAIT)

    from playwright.sync_api import sync_playwright

    all_section_scores = {}
    all_feedback = []
    side_info_images = {}

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            page.goto(PREVIEW_URL, wait_until="networkidle")
            time.sleep(3.0)

            screenshots = take_section_screenshots(page, pass_num)
            browser.close()

        for shot in screenshots:
            try:
                scores, sec_composite, feedback = score_section_vlm(
                    shot["path"], shot["name"]
                )
                all_section_scores[shot["name"]] = {
                    "scores": scores,
                    "composite": sec_composite,
                    "weight": shot["weight"],
                }
                all_feedback.append(
                    f"[{shot['name']}] ({sec_composite:.1f}) {feedback}"
                )
                side_info_images[f"Screenshot_{shot['name']}"] = Image(
                    path=shot["path"]
                )
                oa.log(f"  {shot['name']}: {sec_composite:.2f} {scores}")
            except Exception as e:
                oa.log(f"  {shot['name']}: scoring failed — {e}")
                all_section_scores[shot["name"]] = {
                    "scores": {k: 5.0 for k in SCORING_AXES},
                    "composite": 5.0,
                    "weight": shot["weight"],
                }
                all_feedback.append(f"[{shot['name']}] Scoring failed: {e}")

    except Exception as e:
        oa.log(f"Screenshot capture failed: {e}")
        return 0.0, {"error": str(e)}

    weighted_total = sum(
        s["composite"] * s["weight"] for s in all_section_scores.values()
    )
    weight_sum = sum(s["weight"] for s in all_section_scores.values())
    site_composite = weighted_total / weight_sum if weight_sum > 0 else 0.0

    oa.log(f"Site composite: {site_composite:.2f}")

    per_section_summary = {
        name: f"{data['composite']:.1f}" for name, data in all_section_scores.items()
    }
    oa.log(f"Section scores: {per_section_summary}")

    flat_scores = {name: data["composite"] for name, data in all_section_scores.items()}

    side_info = {
        "scores": flat_scores,
        "section_composites": per_section_summary,
        "Feedback": "\n\n".join(all_feedback),
        "Pass": pass_num,
        **side_info_images,
    }

    return site_composite, side_info


def main():
    global _eval_count
    _eval_count = _detect_last_pass()

    GALLERY_DIR.mkdir(parents=True, exist_ok=True)

    seed_css = TOKENS_FILE.read_text()
    print(f"Seed tokens.css: {len(seed_css)} chars")
    print(f"Preview: {PREVIEW_URL}")
    print(f"Reflection LM: {REFLECTION_MODEL} via CLIProxyAPI")
    print(f"Budget: {MAX_ITERATIONS} evaluations")
    print(f"Sections: {len(SECTIONS)} ({', '.join(s['name'] for s in SECTIONS)})")
    print(f"Resuming from pass: {_eval_count}")
    print()

    os.environ["OPENAI_API_BASE"] = CLI_PROXY_BASE
    os.environ["OPENAI_API_KEY"] = "dummy"

    config = GEPAConfig(
        engine=EngineConfig(
            max_metric_calls=MAX_ITERATIONS,
            run_dir=str(GALLERY_DIR / ".gepa_runs"),
            display_progress_bar=True,
            candidate_selection_strategy="pareto",
        ),
        reflection=ReflectionConfig(
            reflection_lm=oa.make_litellm_lm(REFLECTION_MODEL),
        ),
        stop_callbacks=[
            ScoreThresholdStopper(threshold=9.0),
            NoImprovementStopper(max_iterations_without_improvement=25),
        ],
    )

    print("Starting GEPA site-wide optimization (v2)...")
    print("=" * 60)

    result = optimize_anything(
        seed_candidate=seed_css,
        evaluator=evaluate,
        objective=OBJECTIVE,
        background=BACKGROUND,
        config=config,
    )

    best = result.best_candidate
    if isinstance(best, dict):
        best = best.get("current_candidate", str(best))

    TOKENS_FILE.write_text(best)
    print()
    print("=" * 60)
    print(f"Optimization complete! Best tokens.css written.")
    print(f"Gallery: {GALLERY_DIR}")


if __name__ == "__main__":
    main()
