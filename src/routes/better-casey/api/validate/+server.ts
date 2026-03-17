import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const VISION_PROMPT = `You are an expert design critic applying the Impeccable anti-pattern test.

Analyze this UI screenshot and check for these specific failures:

TYPOGRAPHY:
- Is it using Inter, Roboto, Arial, Open Sans, or system-ui? (FAIL)
- Is body text below 16px? (FAIL)
- Are there more than 2 font families? (FAIL)

COLOR:
- Is there pure black (#000) or pure gray with no tint? (FAIL)
- Is there gray text on a colored background? (FAIL)
- Is there a purple-to-blue gradient? (FAIL)
- Are there more than 4 colors beyond neutrals? (FAIL)

LAYOUT:
- Are cards nested inside cards? (FAIL)
- Is everything center-aligned with identical spacing? (FAIL)
- Is it an identical card grid with no variation? (FAIL)

VISUAL:
- Does it have unnecessary glassmorphism? (FAIL)
- Does it use generic rounded-rectangle-with-drop-shadow cards? (FAIL)

THE AI SLOP TEST:
Would someone immediately say "AI made this"? If yes, that's the critical failure.

OVERALL:
Does this feel like it came from an opinionated design studio or a template generator?

Return ONLY valid JSON:
{
  "pass": true/false,
  "score": 0-100,
  "issues": ["specific issue 1", "specific issue 2"],
  "strengths": ["what works well"],
  "suggestion": "one-line suggestion for improvement if it failed"
}`;

interface ValidationResult {
	pass: boolean;
	score: number;
	issues: string[];
	strengths: string[];
	suggestion?: string;
}

interface GeminiResponse {
	candidates?: Array<{
		content?: {
			parts?: Array<{ text?: string }>;
		};
	}>;
}

export const POST: RequestHandler = async ({ request }) => {
	const { screenshot } = (await request.json()) as { screenshot: string };

	const apiKey = env.GEMINI_API_KEY;
	if (!apiKey) {
		return new Response(
			JSON.stringify({
				pass: true,
				score: 70,
				issues: [],
				strengths: ['Validation skipped — no API key']
			} satisfies ValidationResult),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	const response = await fetch(
		`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contents: [
					{
						parts: [
							{ text: VISION_PROMPT },
							{
								inline_data: {
									mime_type: 'image/png',
									data: screenshot.replace(/^data:image\/\w+;base64,/, '')
								}
							}
						]
					}
				],
				generationConfig: {
					maxOutputTokens: 1024,
					temperature: 0.2
				}
			})
		}
	);

	if (!response.ok) {
		// Fail open — don't block the user if vision fails
		return new Response(
			JSON.stringify({
				pass: true,
				score: 50,
				issues: ['Vision validation unavailable'],
				strengths: []
			} satisfies ValidationResult),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}

	const data = (await response.json()) as GeminiResponse;
	let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

	// Strip markdown fences if present
	text = text.replace(/^```json?\n?/i, '').replace(/\n?```$/i, '').trim();

	try {
		const result = JSON.parse(text) as ValidationResult;
		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(
			JSON.stringify({
				pass: true,
				score: 50,
				issues: ['Could not parse validation'],
				strengths: []
			} satisfies ValidationResult),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
