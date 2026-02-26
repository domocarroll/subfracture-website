/**
 * Vercel Serverless Function — /api/contact
 *
 * Accepts POST with { name, email, message }.
 * Validates with Zod, checks honeypot, rate-limits by IP,
 * then sends email via Resend.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

// ---------- Validation ----------

interface ContactPayload {
	name: string
	email: string
	message: string
	website?: string // honeypot
}

function validatePayload(body: unknown): { success: true; data: ContactPayload } | { success: false; error: string } {
	if (!body || typeof body !== 'object') {
		return { success: false, error: 'Invalid request body' }
	}

	const { name, email, message, website } = body as Record<string, unknown>

	if (typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
		return { success: false, error: 'Name is required (max 100 characters)' }
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (typeof email !== 'string' || !emailRegex.test(email)) {
		return { success: false, error: 'Please enter a valid email' }
	}

	if (typeof message !== 'string' || message.trim().length < 10 || message.length > 2000) {
		return { success: false, error: 'Message must be 10-2000 characters' }
	}

	return {
		success: true,
		data: {
			name: name.trim(),
			email: email.trim(),
			message: message.trim(),
			website: typeof website === 'string' ? website : undefined
		}
	}
}

// ---------- Rate limiting (in-memory, per instance) ----------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 3 // 3 requests per window

function isRateLimited(ip: string): boolean {
	const now = Date.now()
	const entry = rateLimitMap.get(ip)

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
		return false
	}

	if (entry.count >= RATE_LIMIT_MAX) {
		return true
	}

	rateLimitMap.set(ip, { ...entry, count: entry.count + 1 })
	return false
}

// ---------- Handler ----------

const ALLOWED_ORIGINS = ['https://subfrac.com', 'https://www.subfrac.com'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
	// CORS headers
	const origin = req.headers.origin || '';
	const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
	res.setHeader('Access-Control-Allow-Origin', allowedOrigin)
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

	if (req.method === 'OPTIONS') {
		return res.status(204).end()
	}

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' })
	}

	// Rate limit
	const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
	if (isRateLimited(ip)) {
		return res.status(429).json({ error: 'Too many requests. Please wait a moment.' })
	}

	// Validate
	const result = validatePayload(req.body)
	if (!result.success) {
		return res.status(400).json({ error: result.error })
	}

	const { name, email, message, website } = result.data

	// Honeypot — if a bot filled in the hidden field, silently succeed
	if (website && website.length > 0) {
		return res.status(200).json({ success: true })
	}

	// Send via Resend
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY is not configured')
		return res.status(500).json({ error: 'Server configuration error' })
	}

	try {
		const resendResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: 'Subfracture Website <onboarding@resend.dev>',
				to: ['danni@subfrac.com'],
				reply_to: email,
				subject: `New enquiry from ${name}`,
				text: [
					`Name: ${name}`,
					`Email: ${email}`,
					'',
					'Message:',
					message
				].join('\n')
			})
		})

		if (!resendResponse.ok) {
			const errorBody = await resendResponse.text()
			console.error('Resend API error:', resendResponse.status, errorBody)
			return res.status(502).json({ error: 'Failed to send message. Please try again.' })
		}

		return res.status(200).json({ success: true })
	} catch (err) {
		console.error('Failed to send email:', err)
		return res.status(500).json({ error: 'Failed to send message. Please try again.' })
	}
}
