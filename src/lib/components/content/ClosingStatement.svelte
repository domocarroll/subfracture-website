<script lang="ts">
	/**
	 * ClosingStatement - Scroll-scrubbed closing line with supporting paragraph
	 *
	 * Bridge element between Services and Portfolio. The key statement
	 * "Entry points are flexible. Outputs are deliberate." reveals
	 * word-by-word via scroll scrub. Supporting paragraph fades up.
	 *
	 * No section ID (not a nav target).
	 * Background: --color-surface (cream)
	 */

	import Container from '$lib/components/ui/Container.svelte';
	import ScrubTextReveal from '$lib/components/scroll/ScrubTextReveal.svelte';
	import { animate } from '$lib/actions/animate';
</script>

<section class="closing">
	<Container>
		<div class="closing-content">
			<ScrubTextReveal
				text="Entry points are flexible. Outputs are deliberate."
				tag="p"
				class="closing-statement"
				start="top 85%"
				end="top 35%"
			/>
			<p
				class="closing-paragraph"
				use:animate={{
					type: 'fromTo',
					fromVars: { opacity: 0, y: 16 },
					opacity: 1,
					y: 0,
					duration: 0.5,
					delay: 0.2,
					ease: 'power3.out',
					scrollTrigger: { start: 'top 75%' }
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
		padding: clamp(12rem, 15vw, 18rem) 0;
		background-color: var(--color-surface);
		min-height: 80vh;
		display: flex;
		align-items: center;
	}

	.closing-content {
		text-align: center;
	}

	:global(.closing-statement) {
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
