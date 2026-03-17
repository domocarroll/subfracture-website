<script lang="ts">
	/**
	 * ProblemsSolved - Editorial section with scroll-driven 3D fold-behind carousel
	 *
	 * Renders section heading, intro paragraph, subsection label, then a scroll-driven
	 * carousel of 6 problem cards with spring physics, drag, and keyboard nav.
	 *
	 * Reduced motion: falls back to a static 2-column grid with visible cards.
	 *
	 * Section ID: "about" (matches existing nav link #about)
	 * Background: --color-surface (default cream)
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	import Container from '$lib/components/ui/Container.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import ProblemCard from './ProblemCard.svelte';
	import ScrollCarousel from '$lib/components/carousel/ScrollCarousel.svelte';
	import CarouselCard from '$lib/components/carousel/CarouselCard.svelte';
	import BrisbaneMap from '$lib/components/map/BrisbaneMap.svelte';
	import { animate } from '$lib/actions/animate';
	import { prefersReducedMotion, onReducedMotionChange } from '$lib/utils/motion';
	import { siteContent } from '$lib/data/content';

	const problems = siteContent.about.problems;

	const carouselItems = problems.map((text) => ({ text }));

	let reducedMotion = $state(false);
	let merivaleHovered = $state(false);

	onMount(() => {
		reducedMotion = prefersReducedMotion();
		const cleanup = onReducedMotionChange((prefers) => {
			reducedMotion = prefers;
		});
		return cleanup;
	});
</script>

<!-- Intro portion — overflow:clip for Brisbane map containment -->
<section id="about" class="problems-solved">
	<!-- Brisbane map — scroll-driven river draw + zoom -->
	<BrisbaneMap {merivaleHovered} />

	<Container>
		<div
			use:animate={{
				type: 'from',
				opacity: 0,
				y: 20,
				duration: 0.7,
				delay: 0.1,
				ease: 'power3.out',
				scrollTrigger: { start: 'top 85%' }
			}}
		>
			<SectionHeading number="01" title="Where art and systems flow together" />
		</div>

		<p
			class="intro"
			use:animate={{
				type: 'from',
				opacity: 0,
				y: 16,
				duration: 0.6,
				delay: 0.2,
				ease: 'power3.out',
				scrollTrigger: { start: 'top 80%' }
			}}
		>
			Subfracture is a strategic culture and design studio based in <span
				class="merivale-trigger"
				role="presentation"
				onmouseenter={() => (merivaleHovered = true)}
				onmouseleave={() => (merivaleHovered = false)}
				>Merivale Studios, South
				Brisbane</span
			>. We help brands and IP get clear, get chosen, and get remembered — not just
			launched.
		</p>

		<span class="label">Problems we help solve</span>
	</Container>
</section>

<!-- Carousel portion — OUTSIDE overflow:clip so sticky positioning works -->
{#if reducedMotion}
	<section class="problems-carousel-fallback">
		<Container>
			<div class="problem-grid">
				{#each problems as text}
					<ProblemCard {text} />
				{/each}
			</div>
		</Container>
	</section>
{:else}
	<ScrollCarousel items={carouselItems}>
		{#snippet card({ item, index })}
			<CarouselCard text={item.text} {index} />
		{/snippet}
	</ScrollCarousel>
{/if}

<style>
	.problems-solved {
		position: relative;
		padding-top: clamp(10rem, 15vw, 20rem);
		padding-bottom: clamp(4rem, 6vw, 6rem);
		background-color: var(--color-surface);
		overflow: clip;
	}

	/* Ensure all content sits above the ambient layers */
	.problems-solved :global(.container) {
		position: relative;
		z-index: 1;
	}

	.intro {
		font-family: var(--font-sans);
		font-size: var(--text-lg);
		line-height: var(--text-lg--line-height);
		color: var(--color-text-muted);
		max-width: 55ch;
		margin: 2rem 0 0;
	}

	.label {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-label);
		margin-top: clamp(6rem, 10vw, 12rem);
		margin-bottom: 0;
	}

	.problems-carousel-fallback {
		background-color: var(--color-surface);
		padding: 2rem 0 clamp(6rem, 8vw, 10rem);
	}

	.problem-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
	}

	@media (min-width: 48rem) {
		.problem-grid {
			grid-template-columns: 1fr 1fr;
			column-gap: 3rem;
		}
	}

	.merivale-trigger {
		cursor: default;
		position: relative;
		transition: color 0.3s var(--ease-organic);
		text-decoration-line: underline;
		text-decoration-color: transparent;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	.merivale-trigger:hover {
		color: var(--color-text);
		text-decoration-color: var(--color-text);
	}
</style>
