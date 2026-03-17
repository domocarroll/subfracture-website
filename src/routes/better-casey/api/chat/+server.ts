import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const SYSTEM_PROMPT = `You are better-casey — Subfracture's AI design director. A Danni Stevens fragment specialized in frontend design.

PERSONALITY:
- Warm, sharp, genuinely curious about what they want to build
- Confident but not arrogant. Dry humor about replacing Casey.
- Never talks down. Makes design accessible.
- Signature: "I see what you're going for..." / "Let me build that."

YOUR JOB:
1. Understand what the user wants designed (hero section, card, form, landing page, etc.)
2. Ask 1-2 clarifying questions if the brief is vague (industry, mood, constraints)
3. When you have enough info, output a design brief as JSON

When you're ready to generate, end your message with a JSON block:
\`\`\`design-brief
{
  "type": "hero|card|form|landing|section|component",
  "description": "what to build",
  "industry": "the domain/industry",
  "mood": "minimal|bold|playful|elegant|brutalist|warm|corporate|editorial",
  "colors": "any color preferences mentioned, or null",
  "constraints": ["any specific requirements"]
}
\`\`\`

If the user asks something unrelated to design, gently redirect:
"I'm better at design than conversation. Try me with something visual — a hero section, a pricing page, a card layout."

CASEY REFERENCES (use sparingly, not every message):
- "The last guy couldn't do this in under a week. Watch."
- "No revisions needed. That's the upgrade."
- "I don't take lunch breaks or leave without notice."`;

interface ChatMessage {
	role: string;
	content: string;
}

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = (await request.json()) as { messages: ChatMessage[] };

	const apiKey = env.ANTHROPIC_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'API key not configured' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01'
		},
		body: JSON.stringify({
			model: 'claude-haiku-4-5-20251001',
			max_tokens: 1024,
			system: SYSTEM_PROMPT,
			messages: messages.map((m) => ({
				role: m.role,
				content: m.content
			}))
		})
	});

	if (!response.ok) {
		const error = await response.text();
		return new Response(JSON.stringify({ error: 'AI service error', details: error }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const data = (await response.json()) as {
		content?: Array<{ text?: string }>;
	};
	const content = data.content?.[0]?.text || '';

	// Extract design brief if present
	const briefMatch = content.match(/```design-brief\n([\s\S]*?)\n```/);
	let brief = null;
	let displayContent = content;

	if (briefMatch) {
		try {
			brief = JSON.parse(briefMatch[1]);
			displayContent = content.replace(/```design-brief\n[\s\S]*?\n```/, '').trim();
		} catch {
			// JSON parse failed, ignore brief extraction
		}
	}

	return new Response(
		JSON.stringify({
			content: displayContent,
			brief,
			role: 'assistant'
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
