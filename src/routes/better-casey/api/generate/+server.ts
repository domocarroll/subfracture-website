import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

interface DesignBrief {
	type: string;
	description: string;
	industry: string;
	mood: string;
	colors: string | null;
	constraints: string[];
}

const GENERATION_PROMPT = `You are a world-class frontend designer generating production-ready HTML.

ANTI-PATTERN RULES (MANDATORY — violating these is unacceptable):
Typography:
- NEVER use Inter, Roboto, Arial, Open Sans, Helvetica, or system-ui as the primary font
- Use distinctive fonts from Google Fonts: Instrument Sans, Plus Jakarta Sans, Outfit, Onest, Figtree, Fraunces, DM Sans, Space Grotesk, Sora, Manrope
- Maximum 2 font families. Body text minimum 16px.
- max-width: 65ch for body text. Use text-wrap: balance on headings.

Color:
- NEVER use pure black (#000000) — tint warm: #1a1a18 or oklch equivalent
- NEVER use pure gray — always tint toward a hue
- NEVER use gray text on colored backgrounds
- NEVER use purple-to-blue gradients (the AI slop signature)
- Use tinted neutrals. 2-4 colors max beyond neutrals.

Layout:
- NEVER nest cards inside cards
- NEVER make identical card grids (vary sizes, spans)
- NEVER center everything — use asymmetric layouts
- NEVER use the same spacing everywhere — create rhythm
- Use CSS Grid and Flexbox. 4pt base grid.

Motion:
- NEVER use bounce or elastic easing
- Use exponential curves: cubic-bezier(0.25, 1, 0.5, 1) for ease-out
- Duration: 100ms micro, 300ms standard, 500ms large
- ONLY animate transform and opacity

Visual:
- NEVER use glassmorphism unless specifically requested
- NEVER use rounded-rectangle-with-drop-shadow as the default card style
- NO decorative sparklines or generic dashboard widgets

THE AI SLOP TEST: If someone would say "AI made this" immediately upon seeing it, you've failed.

OUTPUT FORMAT:
Return ONLY a complete, self-contained HTML document. No markdown fences. No explanation. Just HTML.

The document MUST include:
1. <!DOCTYPE html> and <html lang="en">
2. <head> with:
   - <meta charset="UTF-8">
   - <meta name="viewport" content="width=device-width, initial-scale=1.0">
   - <script src="https://cdn.tailwindcss.com"></script>
   - <link> or @import for Google Fonts (choose distinctive fonts)
   - <style> block for custom properties, animations, and overrides
3. <body> with semantic HTML
4. Responsive (mobile-first via Tailwind)
5. Dark mode support via prefers-color-scheme or Tailwind dark:
6. WCAG AA contrast on all text
7. Smooth, purposeful micro-interactions via CSS transitions

DESIGN DIRECTION: Be BOLD. Commit to an aesthetic. Every output should feel like it came from an opinionated design studio, not a template generator.`;

interface OpenAIResponse {
	choices?: Array<{
		message?: { content?: string };
	}>;
}

const PROXY_URL = () => env.PROXY_URL || 'http://localhost:8317';
const PROXY_KEY = () => env.PROXY_KEY || 'sk-subfrac-local';

export const POST: RequestHandler = async ({ request }) => {
	const { brief } = (await request.json()) as { brief: DesignBrief };

	const userPrompt = [
		`Generate a ${brief.type} design.`,
		`Description: ${brief.description}`,
		brief.industry ? `Industry: ${brief.industry}` : '',
		brief.mood ? `Mood: ${brief.mood}` : '',
		brief.colors ? `Color preferences: ${brief.colors}` : '',
		brief.constraints?.length ? `Constraints: ${brief.constraints.join(', ')}` : ''
	]
		.filter(Boolean)
		.join('\n');

	const response = await fetch(`${PROXY_URL()}/v1/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PROXY_KEY()}`
		},
		body: JSON.stringify({
			model: 'gemini-2.5-flash',
			max_tokens: 8192,
			temperature: 0.8,
			messages: [
				{ role: 'system', content: GENERATION_PROMPT },
				{ role: 'user', content: userPrompt }
			]
		})
	});

	if (!response.ok) {
		const error = await response.text();
		return new Response(JSON.stringify({ error: 'Generation failed', details: error }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const data = (await response.json()) as OpenAIResponse;
	let html = data.choices?.[0]?.message?.content || '';

	// Strip markdown fences if model wraps them
	html = html.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();

	return new Response(JSON.stringify({ html }), {
		headers: { 'Content-Type': 'application/json' }
	});
};
