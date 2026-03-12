<script lang="ts">
	/**
	 * InlineCTA - Terracotta text link with dot marker
	 *
	 * Distributed after key sections as a gentle invitation.
	 * Text links only (not buttons), per the plan.
	 */

	interface Props {
		/** Link text */
		text: string;
		/** Link destination */
		href?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		text,
		href = '#contact',
		class: className = ''
	}: Props = $props();
</script>

<div class="cta-wrapper {className}">
	<a {href} class="cta">
		<span class="cta-dot" aria-hidden="true"></span>
		{text}
	</a>
</div>

<style>
	.cta-wrapper {
		text-align: center;
		padding: 2rem 0;
	}

	.cta {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 1px solid var(--color-text);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.3s ease, border-color 0.3s ease;
	}

	.cta:hover,
	.cta:focus-visible {
		color: var(--color-text-muted);
		border-color: var(--color-text-muted);
	}

	.cta:focus-visible {
		outline: 2px solid var(--color-text);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.cta-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--color-text);
		flex-shrink: 0;
		transition: transform 0.3s ease;
	}

	.cta:hover .cta-dot {
		transform: scale(1.5);
	}
</style>
