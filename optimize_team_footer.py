"""
Subfracture Team + Footer GEPA Optimizer
=========================================
Focused optimization of TeamSection, TeamMember, and Footer CSS.
Mutates the component files directly. Takes 3 screenshots:
team grid, expanded bio card, and footer.

Prerequisites:
    - Vite dev server running: npm run dev (port 5173)
    - CLIProxyAPI running: cd ~/CLIProxyAPI && ./cli-proxy-api (port 8317)
    - pip install gepa litellm playwright

Usage:
    cd /home/dom/subfracture-website
    python3 optimize_team_footer.py
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

TEAM_SECTION_FILE = Path(
    "/home/dom/subfracture-website/src/lib/components/team/TeamSection.svelte"
)
TEAM_MEMBER_FILE = Path(
    "/home/dom/subfracture-website/src/lib/components/team/TeamMember.svelte"
)
FOOTER_FILE = Path(
    "/home/dom/subfracture-website/src/lib/components/layout/Footer.svelte"
)
GALLERY_DIR = Path("/home/dom/subfracture-website/team-footer-evolution")
PREVIEW_URL = "http://localhost:5173/"
CLI_PROXY_BASE = "http://localhost:8317/v1"
REFLECTION_MODEL = "openai/claude-sonnet-4-5-20250929"
MAX_ITERATIONS = 50
HMR_WAIT = 2.5
SCREENSHOT_WAIT = 1.5

SCREENSHOT_TARGETS = [
    {
        "name": "team-grid",
        "desc": "Team section with 4-column grid of member cards",
        "scroll_pct": 0.72,
        "weight": 0.40,
        "action": None,
    },
    {
        "name": "team-bio-expanded",
        "desc": "Team section with one member bio expanded",
        "scroll_pct": 0.72,
        "weight": 0.25,
        "action": "click_first_member",
    },
    {
        "name": "footer",
        "desc": "Site footer with offices and links",
        "scroll_pct": 0.98,
        "weight": 0.35,
        "action": None,
    },
]

OBJECTIVE = """
Optimize the Team section and Footer CSS for the Subfracture website.
The candidate is a JSON bundle of 3 component files (TeamSection.svelte,
TeamMember.svelte, Footer.svelte). Vite HMR hot-reloads on save.

Goals:
1. Team grid: Clean 4-column layout with well-proportioned photo cards
2. Team member cards: Photo aspect ratio, name/role typography, hover effect
3. Bio expansion: Smooth, readable, well-spaced bio panel
4. Footer: Balanced, minimal, properly spaced office locations
5. Both sections feel cohesive with the overall site aesthetic

HIGHER SCORE = BETTER. Target: composite score >= 8.5/10.
"""

BACKGROUND = """
## Component Structure
- TeamSection.svelte: Section wrapper, heading ("The Humans"), 4-column grid
- TeamMember.svelte: Individual card (photo, name, role, click-to-expand bio, LinkedIn)
- Footer.svelte: Site footer with office locations (Brisbane, LA)

## Tunable CSS in TeamSection
- .team padding (clamp values)
- .team-header margin-bottom
- .team-grid gap, grid-template-columns
- .team-heading font-size, font-weight

## Tunable CSS in TeamMember
- .member-photo aspect-ratio, border-radius
- .member-card hover transform scale
- .member-name font-size, font-weight, margin
- .member-role font-size, color
- .member-bio padding, border styling
- .member-bio-text font-size, line-height
- .member-linkedin styling

## Tunable CSS in Footer
- Overall padding, spacing, layout
- Typography sizes, colors, weights
- Office location styling
- Link styling and hover states

## What NOT to do
- Do NOT change component script logic
- Do NOT change HTML structure
- Do NOT remove prefers-reduced-motion rules
- Do NOT change font-family values
- Do NOT make the design busier

## Scoring Criteria
- Layout Quality (LQ, 25%): Grid proportions, spacing rhythm, responsive balance
- Typography (TY, 20%): Name/role hierarchy, bio readability, footer text
- Interaction (IX, 15%): Hover states, bio expansion feel, click affordance
- Visual Polish (VP, 20%): Photo treatment, borders, shadows, overall finish
- Brand Alignment (BA, 20%): Clean, warm, professional culture studio feel
"""

SCORING_PROMPT = """Score this section screenshot for the Subfracture culture studio.
Section: {section_desc}

Rate each axis 0-10 (higher = better). Be critical.

Axes:
- Layout Quality (LQ): Grid proportions, spacing, responsive balance?
- Typography (TY): Text hierarchy, readability, weight balance?
- Interaction (IX): Hover states, expansion feel, click affordance?
- Visual Polish (VP): Photo treatment, borders, finish quality?
- Brand Alignment (BA): Clean, warm, professional culture studio?

Format your response EXACTLY as:
LQ: X.X
TY: X.X
IX: X.X
VP: X.X
BA: X.X

Then provide 1-2 sentences of specific actionable feedback."""

SCORING_AXES = {
    "lq": {
        "pattern": r"(?:layout\s*quality|LQ)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.25,
    },
    "ty": {"pattern": r"(?:typography|TY)\s*[:\-=]\s*(\d+\.?\d*)", "weight": 0.20},
    "ix": {
        "pattern": r"(?:interaction|IX)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.15,
    },
    "vp": {
        "pattern": r"(?:visual\s*polish|VP)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.20,
    },
    "ba": {
        "pattern": r"(?:brand\s*alignment|BA)\s*[:\-=]\s*(\d+\.?\d*)",
        "weight": 0.20,
    },
}

_eval_count = 0

SEPARATOR = "\n===FILE_BOUNDARY===\n"


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


def bundle_files() -> str:
    team_section = TEAM_SECTION_FILE.read_text()
    team_member = TEAM_MEMBER_FILE.read_text()
    footer = FOOTER_FILE.read_text()
    return f"### TeamSection.svelte ###\n{team_section}{SEPARATOR}### TeamMember.svelte ###\n{team_member}{SEPARATOR}### Footer.svelte ###\n{footer}"


def unbundle_files(candidate: str) -> tuple[str, str, str]:
    parts = candidate.split(SEPARATOR)
    if len(parts) != 3:
        raise ValueError(f"Expected 3 file parts, got {len(parts)}")

    team_section = parts[0].replace("### TeamSection.svelte ###\n", "", 1)
    team_member = parts[1].replace("### TeamMember.svelte ###\n", "", 1)
    footer = parts[2].replace("### Footer.svelte ###\n", "", 1)
    return team_section, team_member, footer


def parse_scores(feedback: str) -> dict[str, float]:
    scores = {}
    for axis_key, axis_config in SCORING_AXES.items():
        match = re.search(axis_config["pattern"], feedback, re.IGNORECASE)
        scores[axis_key] = min(float(match.group(1)), 10.0) if match else 5.0
    return scores


def section_composite(scores: dict[str, float]) -> float:
    return sum(scores[k] * SCORING_AXES[k]["weight"] for k in SCORING_AXES)


def score_screenshot_vlm(
    screenshot_path: str, section_desc: str
) -> tuple[dict, float, str]:
    import litellm

    with open(screenshot_path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")

    prompt = SCORING_PROMPT.format(section_desc=section_desc)

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

    try:
        team_section, team_member, footer = unbundle_files(candidate)
    except ValueError as e:
        oa.log(f"Unbundle failed: {e}")
        return 0.0, {"error": str(e)}

    TEAM_SECTION_FILE.write_text(team_section)
    TEAM_MEMBER_FILE.write_text(team_member)
    FOOTER_FILE.write_text(footer)
    oa.log("Wrote all 3 component files — waiting for HMR...")
    time.sleep(HMR_WAIT)

    from playwright.sync_api import sync_playwright

    pass_dir = GALLERY_DIR / f"pass-{pass_num:03d}"
    pass_dir.mkdir(parents=True, exist_ok=True)

    all_section_scores = {}
    all_feedback = []
    side_info_images = {}

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(viewport={"width": 1440, "height": 900})
            page.goto(PREVIEW_URL, wait_until="networkidle")
            time.sleep(3.0)

            total_height = page.evaluate("document.documentElement.scrollHeight")
            viewport_height = page.evaluate("window.innerHeight")
            max_scroll = total_height - viewport_height

            for target in SCREENSHOT_TARGETS:
                scroll_y = int(max_scroll * target["scroll_pct"])
                page.evaluate(f"window.scrollTo(0, {scroll_y})")
                time.sleep(SCREENSHOT_WAIT)

                if target["action"] == "click_first_member":
                    try:
                        page.click(".member-card", timeout=3000)
                        time.sleep(0.5)
                    except Exception:
                        oa.log(f"  Could not click member card for {target['name']}")

                thumb_path = str(pass_dir / f"{target['name']}.png")
                page.screenshot(path=thumb_path, full_page=False)

                try:
                    scores, composite, feedback = score_screenshot_vlm(
                        thumb_path, target["desc"]
                    )
                    all_section_scores[target["name"]] = {
                        "scores": scores,
                        "composite": composite,
                        "weight": target["weight"],
                    }
                    all_feedback.append(
                        f"[{target['name']}] ({composite:.1f}) {feedback}"
                    )
                    side_info_images[f"Screenshot_{target['name']}"] = Image(
                        path=thumb_path
                    )
                    oa.log(f"  {target['name']}: {composite:.2f} {scores}")
                except Exception as e:
                    oa.log(f"  {target['name']}: scoring failed — {e}")
                    all_section_scores[target["name"]] = {
                        "scores": {k: 5.0 for k in SCORING_AXES},
                        "composite": 5.0,
                        "weight": target["weight"],
                    }
                    all_feedback.append(f"[{target['name']}] Scoring failed: {e}")

            browser.close()

    except Exception as e:
        oa.log(f"Screenshot capture failed: {e}")
        return 0.0, {"error": str(e)}

    weighted_total = sum(
        s["composite"] * s["weight"] for s in all_section_scores.values()
    )
    weight_sum = sum(s["weight"] for s in all_section_scores.values())
    overall_composite = weighted_total / weight_sum if weight_sum > 0 else 0.0

    oa.log(f"Overall composite: {overall_composite:.2f}")

    flat_scores = {name: data["composite"] for name, data in all_section_scores.items()}

    side_info = {
        "scores": flat_scores,
        "Feedback": "\n\n".join(all_feedback),
        "Pass": pass_num,
        **side_info_images,
    }

    return overall_composite, side_info


def main():
    global _eval_count
    _eval_count = _detect_last_pass()

    GALLERY_DIR.mkdir(parents=True, exist_ok=True)

    seed = bundle_files()
    print(f"Seed bundle: {len(seed)} chars (3 files)")
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
            ScoreThresholdStopper(threshold=8.5),
            NoImprovementStopper(max_iterations_without_improvement=15),
        ],
    )

    print("Starting GEPA team + footer optimization...")
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

    try:
        team_section, team_member, footer = unbundle_files(best)
        TEAM_SECTION_FILE.write_text(team_section)
        TEAM_MEMBER_FILE.write_text(team_member)
        FOOTER_FILE.write_text(footer)
        print()
        print("=" * 60)
        print("Optimization complete! Best component files written.")
    except ValueError as e:
        print(f"Failed to unbundle best candidate: {e}")
        Path(GALLERY_DIR / "best-raw.txt").write_text(best)
        print("Raw best saved to best-raw.txt")

    print(f"Gallery: {GALLERY_DIR}")


if __name__ == "__main__":
    main()
