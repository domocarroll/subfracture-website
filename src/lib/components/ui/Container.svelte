<script lang="ts">
	/**
	 * Container - Responsive content container with optional grid layout
	 *
	 * Provides consistent max-width, padding, and centering for content sections.
	 * When grid=true, enables golden ratio two-column layout that collapses on mobile.
	 *
	 * @example
	 * <Container>
	 *   <p>Narrow content (900px max)</p>
	 * </Container>
	 *
	 * @example With grid
	 * <Container grid>
	 *   <div>Major column (61.8%)</div>
	 *   <div>Minor column (38.2%)</div>
	 * </Container>
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		/** Width variant: 'narrow' (900px) or 'wide' (1200px) */
		variant?: 'narrow' | 'wide';
		/** Enable golden ratio two-column grid */
		grid?: boolean;
		/** Content */
		children: Snippet;
	}

	let { variant = 'narrow', grid = false, children }: Props = $props();
</script>

<div class="container" class:container--wide={variant === 'wide'} class:container--grid={grid}>
	{@render children()}
</div>

<style>
	.container {
		width: 100%;
		max-width: var(--content-max);
		margin-inline: auto;
		padding-inline: 1rem;
	}

	.container--wide {
		max-width: var(--content-wide);
	}

	/* Grid mode: golden ratio columns */
	.container--grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	/* Responsive padding */
	@media (min-width: 40rem) {
		.container {
			padding-inline: 1.5rem;
		}
	}

	@media (min-width: 64rem) {
		.container {
			padding-inline: 2rem;
		}
	}

	/* Two-column grid above md breakpoint */
	@media (min-width: 48rem) {
		.container--grid {
			grid-template-columns: 1.618fr 1fr;
		}
	}
</style>
