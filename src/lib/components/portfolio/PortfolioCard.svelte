<script lang="ts">
	/**
	 * PortfolioCard - Tilted project card with hover interaction
	 *
	 * Displays a portfolio project with outcome-led content.
	 * Cards sit at 3-5deg rotation and straighten on hover.
	 * Clean design for dark backgrounds.
	 */

	interface Props {
		/** Project title */
		title: string;
		/** Short outcome-led description */
		outcome: string;
		/** Project category/type */
		category: string;
		/** Rotation angle in degrees (alternates per card) */
		rotation?: number;
		/** Link to project detail */
		href?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		title,
		outcome,
		category,
		rotation = 3,
		href = '#',
		class: className = ''
	}: Props = $props();
</script>

<a
	{href}
	class="card {className}"
	style="--rotation: {rotation}deg;"
>
	<div class="card-image">
		<div class="card-image-placeholder">
			<span class="card-image-label">{category}</span>
		</div>
	</div>
	<div class="card-body">
		<h3 class="card-title">{title}</h3>
		<p class="card-outcome">{outcome}</p>
	</div>
</a>

<style>
	.card {
		display: block;
		text-decoration: none;
		color: inherit;
		transform: rotate(var(--rotation));
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
		cursor: pointer;
	}

	.card:hover,
	.card:focus-visible {
		transform: rotate(0deg) scale(1.02);
	}

	.card:focus-visible {
		outline: 2px solid var(--color-surface);
		outline-offset: 8px;
		border-radius: 4px;
	}

	.card-image {
		aspect-ratio: 4 / 3;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 1rem;
	}

	.card-image-placeholder {
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: flex-end;
		padding: 1rem;
	}

	.card-image-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.4);
	}

	.card-title {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		font-weight: 400;
		color: var(--color-surface);
		line-height: var(--text-lg--line-height);
		margin: 0 0 0.5rem;
	}

	.card-outcome {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: rgba(255, 255, 255, 0.6);
		line-height: var(--text-base--line-height);
		margin: 0;
	}

	/* Reduced motion: no rotation */
	@media (prefers-reduced-motion: reduce) {
		.card {
			transform: none;
			transition: none;
		}

		.card:hover {
			transform: none;
		}
	}
</style>
