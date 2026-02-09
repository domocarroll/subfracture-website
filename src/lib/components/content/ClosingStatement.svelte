<script lang="ts">
	/**
	 * ClosingStatement - Weighted closing line and paragraph
	 *
	 * Bridge element between Services and the next section. Centers the key
	 * closing statement with visual weight (large serif) and a supporting
	 * paragraph underneath.
	 *
	 * Uses the animate action for scroll-triggered reveals.
	 * No section ID (not a nav target).
	 * Background: --color-surface (shifts back from warm cream)
	 */

	import Container from '$lib/components/ui/Container.svelte';
	import { animate } from '$lib/actions/animate';
</script>

<section class="closing">
	<Container>
		<div class="closing-content">
			<p
				class="closing-statement"
				use:animate={{
					type: 'from',
					opacity: 0,
					y: 24,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: { start: 'top 80%' }
				}}
			>
				Entry points are flexible. Outputs are deliberate.
			</p>
			<p
				class="closing-paragraph"
				use:animate={{
					type: 'from',
					opacity: 0,
					y: 16,
					duration: 0.5,
					delay: 0.2,
					ease: 'power3.out',
					scrollTrigger: { start: 'top 80%' }
				}}
			>
				We work alongside founders and brand teams to set direction, design systems, and bring
				ideas to life — because strong brands aren't just seen, they're understood, trusted, and
				chosen.
			</p>
		</div>
	</Container>
</section>

<style>
	.closing {
		padding: clamp(8rem, 10vw, 12rem) 0;
		background-color: var(--color-surface);
	}

	.closing-content {
		text-align: center;
	}

	.closing-statement {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-2xl--line-height);
		margin: 0 auto;
		max-width: 30ch;
	}

	.closing-paragraph {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		color: var(--color-text-muted);
		line-height: var(--text-base--line-height);
		max-width: 55ch;
		margin: 2rem auto 0;
	}
</style>
