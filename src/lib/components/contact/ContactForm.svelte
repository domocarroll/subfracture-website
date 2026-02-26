<script lang="ts">
	/**
	 * ContactForm - 3-field contact form with Zod validation
	 *
	 * Fields: name, email, message. Client-side Zod validation,
	 * then POST to /api/contact (Cloudflare Pages Function).
	 * Honeypot field catches bots. Loading + error + thank-you states.
	 * Dark background styling — cream text on near-black.
	 */

	import { z } from 'zod';

	const contactSchema = z.object({
		name: z.string().min(1, 'Name is required').max(100),
		email: z.string().email('Please enter a valid email'),
		message: z.string().min(10, 'Tell us a bit more (10+ characters)').max(2000)
	});

	type ContactData = z.infer<typeof contactSchema>;
	type FieldErrors = Partial<Record<keyof ContactData, string>>;

	let formData = $state<ContactData>({ name: '', email: '', message: '' });
	let honeypot = $state('');
	let errors = $state<FieldErrors>({});
	let submitting = $state(false);
	let submitted = $state(false);
	let serverError = $state('');

	function validate(): boolean {
		const result = contactSchema.safeParse(formData);
		if (result.success) {
			errors = {};
			return true;
		}

		const fieldErrors: FieldErrors = {};
		for (const issue of result.error.issues) {
			const field = issue.path[0] as keyof ContactData;
			if (!fieldErrors[field]) {
				fieldErrors[field] = issue.message;
			}
		}
		errors = fieldErrors;
		return false;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		serverError = '';

		if (!validate()) return;

		submitting = true;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					message: formData.message,
					website: honeypot
				})
			});

			const data = await response.json();

			if (!response.ok) {
				serverError = data.error || 'Something went wrong. Please try again.';
				return;
			}

			submitted = true;
		} catch {
			serverError = 'Network error. Please check your connection and try again.';
		} finally {
			submitting = false;
		}
	}
</script>

{#if submitted}
	<div class="thank-you">
		<p class="thank-you-heading">Message received.</p>
		<p class="thank-you-text">We'll be in touch within 48 hours.</p>
	</div>
{:else}
	<form class="form" onsubmit={handleSubmit} novalidate>
		<!-- Honeypot — hidden from humans, bots fill it in -->
		<div class="honeypot" aria-hidden="true">
			<label for="contact-website">Website</label>
			<input
				id="contact-website"
				type="text"
				name="website"
				bind:value={honeypot}
				tabindex="-1"
				autocomplete="off"
			/>
		</div>

		<div class="field">
			<label for="contact-name" class="label">Name</label>
			<input
				id="contact-name"
				type="text"
				class="input"
				class:input--error={errors.name}
				bind:value={formData.name}
				autocomplete="name"
				disabled={submitting}
				aria-invalid={!!errors.name}
				aria-describedby={errors.name ? 'name-error' : undefined}
			/>
			{#if errors.name}
				<p class="error" id="name-error" role="alert">{errors.name}</p>
			{/if}
		</div>

		<div class="field">
			<label for="contact-email" class="label">Email</label>
			<input
				id="contact-email"
				type="email"
				class="input"
				class:input--error={errors.email}
				bind:value={formData.email}
				autocomplete="email"
				disabled={submitting}
				aria-invalid={!!errors.email}
				aria-describedby={errors.email ? 'email-error' : undefined}
			/>
			{#if errors.email}
				<p class="error" id="email-error" role="alert">{errors.email}</p>
			{/if}
		</div>

		<div class="field">
			<label for="contact-message" class="label">Message</label>
			<textarea
				id="contact-message"
				class="input textarea"
				class:input--error={errors.message}
				bind:value={formData.message}
				rows="5"
				disabled={submitting}
				aria-invalid={!!errors.message}
				aria-describedby={errors.message ? 'message-error' : undefined}
			></textarea>
			{#if errors.message}
				<p class="error" id="message-error" role="alert">{errors.message}</p>
			{/if}
		</div>

		{#if serverError}
			<p class="error server-error">{serverError}</p>
		{/if}

		<button type="submit" class="submit" disabled={submitting}>
			{#if submitting}
				Sending...
			{:else}
				Send message
			{/if}
		</button>
	</form>
{/if}

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 32rem;
	}

	.honeypot {
		position: absolute;
		left: -9999px;
		top: -9999px;
		opacity: 0;
		height: 0;
		width: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: rgba(245, 240, 232, 0.6);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.input {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		color: var(--color-surface);
		background-color: transparent;
		border: none;
		border-bottom: 1px solid rgba(245, 240, 232, 0.2);
		padding: 0.75rem 0;
		outline: none;
		transition: border-color 0.3s ease;
	}

	.input:focus {
		border-bottom-color: var(--color-primary);
	}

	.input--error {
		border-bottom-color: var(--color-primary);
	}

	.textarea {
		resize: vertical;
		min-height: 6rem;
	}

	.error {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-primary);
		margin: 0;
	}

	.submit {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: 500;
		color: var(--color-surface);
		background-color: transparent;
		border: 1px solid rgba(245, 240, 232, 0.3);
		padding: 1rem 2rem;
		cursor: pointer;
		align-self: flex-start;
		transition: border-color 0.3s ease, color 0.3s ease;
	}

	.submit:hover,
	.submit:focus-visible {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.submit:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
	}

	.submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input:disabled {
		opacity: 0.5;
	}

	.server-error {
		font-size: var(--text-sm);
	}

	.thank-you {
		max-width: 32rem;
	}

	.thank-you-heading {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		color: var(--color-surface);
		margin: 0 0 1rem;
	}

	.thank-you-text {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		color: rgba(245, 240, 232, 0.6);
		margin: 0;
	}
</style>
