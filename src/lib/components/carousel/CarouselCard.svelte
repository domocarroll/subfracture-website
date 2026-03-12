<script lang="ts">
	/**
	 * CarouselCard - Editorial text card for the fold-behind carousel
	 *
	 * Styled with design tokens: cream surface, Playfair Display serif,
	 * terracotta index number. No image area — text-only for the
	 * problems-solved section.
	 */

	interface Props {
		text: string;
		index: number;
	}

	let { text, index }: Props = $props();
</script>

<div class="carousel-card-inner">
	<span class="card-index">{String(index + 1).padStart(2, '0')}</span>
	<p class="card-text">{text}</p>
</div>

<style>
	.carousel-card-inner {
		width: 100%;
		height: 100%;
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;

		background: var(--color-surface-warm);
		border: 1px solid var(--color-bone);
		border-radius: 8px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	}

	.card-index {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}

	.card-text {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		font-weight: 400;
		line-height: var(--text-xl--line-height);
		color: var(--color-text);
		margin: 0;
	}

	@media (max-width: 47.99rem) {
		.carousel-card-inner {
			padding: 1.75rem;
		}

		.card-text {
			font-size: var(--text-lg);
			line-height: var(--text-lg--line-height);
		}
	}
</style>
