<script lang="ts">
	/**
	 * CarouselDots - Navigation dot indicators styled with design tokens.
	 *
	 * Bone inactive / terracotta active, with accessible button labels.
	 */

	interface Props {
		activeIndex: number;
		total: number;
		onNavigate: (index: number) => void;
	}

	let { activeIndex, total, onNavigate }: Props = $props();
</script>

<nav class="carousel-dots" aria-label="Carousel navigation">
	{#each Array(total) as _, i}
		<button
			class="carousel-dot"
			class:is-active={activeIndex === i}
			onclick={() => onNavigate(i)}
			aria-label="Go to problem {i + 1}"
			aria-current={activeIndex === i ? 'true' : undefined}
		>
			<span class="dot-fill"></span>
		</button>
	{/each}
</nav>

<style>
	.carousel-dots {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.carousel-dot {
		position: relative;
		width: 44px;
		min-height: 44px;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.carousel-dot:focus-visible {
		outline: 2px solid var(--color-primary);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dot-fill {
		display: block;
		width: 100%;
		height: 3px;
		border-radius: 2px;
		background: var(--color-bone);
		transition:
			background 400ms ease-out,
			transform 400ms ease-out;
	}

	.carousel-dot.is-active .dot-fill {
		background: var(--color-primary);
		transform: scaleX(1.3);
	}

	.carousel-dot:hover .dot-fill {
		background: var(--color-primary-dark);
	}

	.carousel-dot.is-active:hover .dot-fill {
		background: var(--color-primary);
	}
</style>
