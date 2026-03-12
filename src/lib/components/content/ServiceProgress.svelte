<script lang="ts">
	/**
	 * ServiceProgress - Terracotta dash indicators for pinned service scroll
	 *
	 * Vertical dashes on desktop (right margin), horizontal on mobile (bottom center).
	 * Active dash elongates and fills to full terracotta. Purely decorative.
	 */

	interface Props {
		/** Total number of pillars */
		total: number;
		/** Currently active pillar index (0-based) */
		current: number;
	}

	let { total, current }: Props = $props();
</script>

<div class="progress" aria-hidden="true">
	{#each Array(total) as _, i}
		<div class="dash" class:dash--active={i === current} class:dash--past={i < current}></div>
	{/each}
</div>

<style>
	.progress {
		position: fixed;
		right: 2rem;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		z-index: 10;
		pointer-events: none;
	}

	.dash {
		width: 2px;
		height: 1.25rem;
		background-color: var(--color-text);
		opacity: 0.2;
		border-radius: 1px;
		transition:
			height 0.4s var(--ease-organic),
			opacity 0.4s var(--ease-organic);
	}

	.dash--active {
		height: 2.5rem;
		opacity: 1;
	}

	.dash--past {
		opacity: 0.45;
	}

	/* Mobile: horizontal at bottom */
	@media (max-width: 48rem) {
		.progress {
			right: auto;
			top: auto;
			bottom: 1.5rem;
			left: 50%;
			transform: translateX(-50%);
			flex-direction: row;
		}

		.dash {
			width: 1.25rem;
			height: 2px;
		}

		.dash--active {
			width: 2.5rem;
			height: 2px;
		}
	}
</style>
