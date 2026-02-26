/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Accepts JSON { name, email, message }.
 * Validates input, checks honeypot, rate-limits by IP,
 * then sends email via Resend.
 */

interface Env {
	RESEND_API_KEY: string;
}

interface ContactPayload {
	name: string;
	email: string;
	message: string;
	website?: string; // honeypot
}

// ---------- Validation ----------

function validatePayload(
	body: unknown
): { success: true; data: ContactPayload } | { success: false; error: string } {
	if (!body || typeof body !== 'object') {
		return { success: false, error: 'Invalid request body' };
	}

	const { name, email, message, website } = body as Record<string, unknown>;

	if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
		return { success: false, error: 'Name is required (max 100 characters)' };
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (typeof email !== 'string' || !emailRegex.test(email)) {
		return { success: false, error: 'Please enter a valid email' };
	}

	if (typeof message !== 'string' || message.trim().length < 10 || message.length > 2000) {
		return { success: false, error: 'Message must be 10-2000 characters' };
	}

	return {
		success: true,
		data: {
			name: name.trim(),
			email: email.trim(),
			message: message.trim(),
			website: typeof website === 'string' ? website : undefined
		}
	};
}

// ---------- Rate limiting (in-memory, per isolate) ----------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
		return false;
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		return true;
	}

	rateLimitMap.set(ip, { ...entry, count: entry.count + 1 });
	return false;
}

// ---------- CORS ----------

const ALLOWED_ORIGINS = ['https://subfrac.com', 'https://www.subfrac.com'];

function corsHeaders(origin: string): Record<string, string> {
	const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
	return {
		'Access-Control-Allow-Origin': allowed,
		'Access-Control-Allow-Methods': 'POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type'
	};
}

// ---------- Handlers ----------

export const onRequestOptions: PagesFunction<Env> = async (context) => {
	const origin = context.request.headers.get('Origin') || '';
	return new Response(null, {
		status: 204,
		headers: corsHeaders(origin)
	});
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
	const origin = context.request.headers.get('Origin') || '';
	const headers = {
		'Content-Type': 'application/json',
		...corsHeaders(origin)
	};

	// Rate limit
	const ip = context.request.headers.get('CF-Connecting-IP') || 'unknown';
	if (isRateLimited(ip)) {
		return new Response(
			JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
			{ status: 429, headers }
		);
	}

	// Parse body
	let body: unknown;
	try {
		body = await context.request.json();
	} catch {
		return new Response(
			JSON.stringify({ error: 'Invalid JSON' }),
			{ status: 400, headers }
		);
	}

	// Validate
	const result = validatePayload(body);
	if (!result.success) {
		return new Response(
			JSON.stringify({ error: result.error }),
			{ status: 400, headers }
		);
	}

	const { name, email, message, website } = result.data;

	// Honeypot — if a bot filled in the hidden field, silently succeed
	if (website && website.length > 0) {
		return new Response(
			JSON.stringify({ success: true }),
			{ status: 200, headers }
		);
	}

	// Send via Resend
	const apiKey = context.env.RESEND_API_KEY;
	if (!apiKey) {
		console.error('RESEND_API_KEY is not configured');
		return new Response(
			JSON.stringify({ error: 'Server configuration error' }),
			{ status: 500, headers }
		);
	}

	try {
		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: 'Subfracture Website <onboarding@resend.dev>',
				to: ['danni@subfrac.com'],
				reply_to: email,
				subject: `New enquiry from ${name}`,
				text: [`Name: ${name}`, `Email: ${email}`, '', 'Message:', message].join('\n')
			})
		});

		if (!resendResponse.ok) {
			const errorBody = await resendResponse.text();
			console.error('Resend API error:', resendResponse.status, errorBody);
			return new Response(
				JSON.stringify({ error: 'Failed to send message. Please try again.' }),
				{ status: 502, headers }
			);
		}

		return new Response(
			JSON.stringify({ success: true }),
			{ status: 200, headers }
		);
	} catch (err) {
		console.error('Failed to send email:', err);
		return new Response(
			JSON.stringify({ error: 'Failed to send message. Please try again.' }),
			{ status: 500, headers }
		);
	}
};
