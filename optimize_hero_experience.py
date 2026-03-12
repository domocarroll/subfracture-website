"""
Subfracture Hero Experience GEPA Optimizer
==========================================
Focused optimization of the VideoHero component's CSS — frosted glass overlay
timing, blur intensity, watermark positioning, and cursor styling.

Mutates scoped CSS within VideoHero.svelte via targeted regex replacement.
Takes single-viewport screenshots of the hero section only.

Prerequisites:
    - Vite dev server running: npm run dev (port 5173)
    - CLIProxyAPI running: cd ~/CLIProxyAPI && ./cli-proxy-api (port 8317)
    - pip install gepa litellm playwright

Usage:
    cd /home/dom/subfracture-website
    python3 optimize_hero_experience.py
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

HERO_FILE = Path(
    "/home/dom/subfracture-website/src/lib/components/hero/VideoHero.svelte"
)
GALLERY_DIR = Path("/home/dom/subfracture-website/hero-experience-evolution")
PREVIEW_URL = "http://localhost:5173/"
CLI_PROXY_BASE = "http://localhost:8317/v1"
REFLECTION_MODEL = "openai/claude-sonnet-4-5-20250929"
MAX_ITERATIONS = 60
HMR_WAIT = 2.5
SCREENSHOT_WAIT = 2.0

HERO_VIEWPORTS = [
    {
        "name": "hero-default",
        "desc": "Hero with frosted overlay (default state)",
        "hover": False,
    },
    {
        "name": "hero-hover",
        "desc": "Hero with overlay removed (hover state)",
        "hover": True,
    },
]

OBJECTIVE = """
Optimize the VideoHero component's CSS for the Subfracture website.
The candidate is the full VideoHero.svelte file. Vite HMR hot-reloads on save.

The goal is a cinematic hero experience:
1. Frosted glass overlay feels premium — right blur amount, right opacity
2. Hover reveal transition is smooth and satisfying (not too fast, not too slow)
3. Watermark SVG is perfectly positioned and legible
4. Custom cursor pill ("▶ Sizzle Me") looks polished and tracks smoothly
5. Overall impression: "this studio is world-class" from the first viewport

HIGHER SCORE = BETTER. Target: composite score >= 9.0/10.
"""

BACKGROUND = """
## Component Architecture
VideoHero.svelte contains:
- A sticky video container (75vh) with 115vh media for parallax room
- A frosted glass overlay (backdrop-filter: blur, grayscale, white bg)
- Hover interaction: overlay fades away revealing full-color video
- Custom cursor pill ("▶ Sizzle Me") following mouse position
- Watermark SVG at bottom with GSAP parallax scroll

## Tunable CSS Properties
- .hero__overlay backdrop-filter blur value (currently 60px)
- .hero__overlay background rgba alpha (currently 0.65)
- .hero__overlay transition timing (currently 0.4s ease)
- .hero__cursor styling: font-size, padding, border-radius, box-shadow
- .hero__cursor transition timing (currently 0.15s ease)
- .hero__watermark bottom offset values per breakpoint
- .hero-video height (currently 75vh)
- .hero__media height (currently 115vh — parallax room)

## What NOT to do
- Do NOT change the video source URL
- Do NOT remove the watermark or cursor elements
- Do NOT change the Svelte script logic (only CSS in <style>)
- Do NOT add new HTML elements
- Do NOT break the component structure
- Do NOT remove prefers-reduced-motion media query
- Keep the overlay effect subtle — it should feel like frosted glass, not a solid wall

## Scoring Criteria
- Overlay Quality (OQ, 25%): Frosted glass feels premium? Right blur/opacity balance?
- Transition Feel (TF, 20%): Hover reveal smooth and satisfying? Good timing curve?
- Cursor Polish (CP, 15%): Custom cursor looks professional? Smooth tracking?
- Composition (CO, 20%): Watermark position, overall layout balance, viewport usage
- Brand Alignment (BA, 20%): "World-class culture studio" first impression?
"""

SCORING_PROMPT = """Score this hero section screenshot for the Subfracture culture studio website.
State: {state_desc}

Rate each axis 0-10 (higher = better). Be critical and precise.

Axes:
- Overlay Quality (OQ): Does the frosted glass effect feel premium? Right blur/opacity?
- Transition Feel (TF): Based on the visual state — does the overlay/reveal look smooth?
- Cursor Polish (CP): If visible, does the custom cursor look professional?
- Composition (CO): Watermark position, overall layout balance, viewport usage?
- Brand Alignment (BA): Does this scream "world-class culture studio"?

Format your response EXACTLY as:
OQ: X.X
TF: X.X
CP: X.X
CO: X.X
BA: X.X

Then provide 1-2 sentences of specific actionable feedback."""

SCORING_AXES = {
    "oq": {
        "pattern": r"(?:overlay\s*quality|OQ)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.25,
    },
    "tf": {
        "pattern": r"(?:transition\s*feel|TF)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.20,
    },
    "cp": {
        "pattern": r"(?:cursor\s*polish|CP)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.15,
    },
    "co": {"pattern": r"(?:composition|CO)\s*[:\-=]\s*(\d+\.?\d*)", "weight": 0.20},
    "ba": {
        "pattern": r"(?:brand\s*alignment|BA)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.20,
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


def parse_scores(feedback: str) -> dict[str, float]:
    scores = {}
    for axis_key, axis_config in SCORING_AXES.items():
        match = re.search(axis_config["pattern"], feedback, re.IGNORECASE)
        scores[axis_key] = min(float(match.group(1)), 10.0) if match else 5.0
    return scores


def section_composite(scores: dict[str, float]) -> float:
    return sum(scores[k] * SCORING_AXES[k]["weight"] for k in SCORING_AXES)


def score_screenshot_vlm(
    screenshot_path: str, state_desc: str
) -> tuple[dict, float, str]:
    import litellm

    with open(screenshot_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = SCORING_PROMPT.format(state_desc=state_desc)

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

    HERO_FILE.write_text(candidate)
    oa.log("Wrote VideoHero.svelte — waiting for HMR...")
    time.sleep(HMR_WAIT)

    from playwright.sync_api import sync_playwright

    pass_dir = GALLERY_DIR / f"pass-{pass_num:03d}"
    pass_dir.mkdir(parents=True, exist_ok=True)

    all_scores = []
    all_feedback = []
    side_info_images = {}

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            page.goto(PREVIEW_URL, wait_until="networkidle")
            time.sleep(3.0)

            for vp in HERO_VIEWPORTS:
                if vp["hover"]:
                    page.hover(".hero__media", timeout=3000)
                    time.sleep(0.6)

                thumb_path = str(pass_dir / f"{vp['name']}.png")
                page.screenshot(path=thumb_path, full_page=False)

                try:
                    scores, composite, feedback = score_screenshot_vlm(
                        thumb_path, vp["desc"]
                    )
                    all_scores.append(composite)
                    all_feedback.append(f"[{vp['name']}] ({composite:.1f}) {feedback}")
                    side_info_images[f"Screenshot_{vp['name']}"] = Image(
                        path=thumb_path
                    )
                    oa.log(f"  {vp['name']}: {composite:.2f} {scores}")
                except Exception as e:
                    oa.log(f"  {vp['name']}: scoring failed — {e}")
                    all_scores.append(5.0)
                    all_feedback.append(f"[{vp['name']}] Scoring failed: {e}")

            browser.close()

    except Exception as e:
        oa.log(f"Screenshot capture failed: {e}")
        return 0.0, {"error": str(e)}

    hero_composite = sum(all_scores) / len(all_scores) if all_scores else 0.0
    oa.log(f"Hero composite: {hero_composite:.2f}")

    side_info = {
        "scores": {vp["name"]: s for vp, s in zip(HERO_VIEWPORTS, all_scores)},
        "Feedback": "\n\n".join(all_feedback),
        "Pass": pass_num,
        **side_info_images,
    }

    return hero_composite, side_info


def main():
    global _eval_count
    _eval_count = _detect_last_pass()

    GALLERY_DIR.mkdir(parents=True, exist_ok=True)

    seed = HERO_FILE.read_text()
    print(f"Seed VideoHero.svelte: {len(seed)} chars")
    print(f"Preview: {PREVIEW_URL}")
    print(f"Reflection LM: {REFLECTION_MODEL} via CLIProxyAPI")
    print(f"Budget: {MAX_ITERATIONS} evaluations")
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
            NoImprovementStopper(max_iterations_without_improvement=20),
        ],
    )

    print("Starting GEPA hero experience optimization...")
    print("=" * 60)

    result = optimize_anything(
        seed_candidate=seed,
        evaluator=evaluate,
        objective=OBJECTIVE,
        background=BACKGROUND,
        config=config,
    )

    best = result.best_candidate
    if isinstance(best, dict):
        best = best.get("current_candidate", str(best))

    HERO_FILE.write_text(best)
    print()
    print("=" * 60)
    print(f"Optimization complete! Best VideoHero.svelte written.")
    print(f"Gallery: {GALLERY_DIR}")


if __name__ == "__main__":
    main()
