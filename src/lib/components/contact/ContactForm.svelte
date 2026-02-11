<script lang="ts">
	/**
	 * ContactForm - 3-field contact form with Zod validation
	 *
	 * Fields: name, email, message. Client-side validation only (no backend yet).
	 * Thank-you state after successful submission.
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
	let errors = $state<FieldErrors>({});
	let submitted = $state(false);

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

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (validate()) {
			submitted = true;
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
		<div class="field">
			<label for="contact-name" class="label">Name</label>
			<input
				id="contact-name"
				type="text"
				class="input"
				class:input--error={errors.name}
				bind:value={formData.name}
				autocomplete="name"
			/>
			{#if errors.name}
				<p class="error">{errors.name}</p>
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
			/>
			{#if errors.email}
				<p class="error">{errors.email}</p>
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
			></textarea>
			{#if errors.message}
				<p class="error">{errors.message}</p>
			{/if}
		</div>

		<button type="submit" class="submit">Send message</button>
	</form>
{/if}

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 32rem;
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
