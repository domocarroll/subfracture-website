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
	import { animate } from '$lib/actions/animate';
	import { prefersReducedMotion, onReducedMotionChange } from '$lib/utils/motion';

	const problems = [
		'Campaign-led thinking with no long-term platform',
		'Inconsistent brand and IP expression at scale',
		'Low trust or weak cultural relevance',
		'Launches that need real momentum, not noise',
		'Brand systems that extend beyond start and end dates',
		'Unclear positioning \u2014 people don\u2019t get it'
	];

	const carouselItems = problems.map((text) => ({ text }));

	let reducedMotion = $state(false);

	onMount(() => {
		reducedMotion = prefersReducedMotion();
		const cleanup = onReducedMotionChange((prefers) => {
			reducedMotion = prefers;
		});
		return cleanup;
	});
</script>

<section id="about" class="problems-solved">
	<Container>
		<div
			use:animate={{
				type: 'from',
				opacity: 0,
				y: 24,
				duration: 0.6,
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
				y: 24,
				duration: 0.6,
				delay: 0.15,
				ease: 'power3.out',
				scrollTrigger: { start: 'top 85%' }
			}}
		>
			Subfracture is a strategic culture and design studio based in Merivale Studios, South
			Brisbane. We help brands and IP get clear, get chosen, and get remembered — not just
			launched.
		</p>

		<span class="label">Problems we help solve</span>
	</Container>

	{#if reducedMotion}
		<!-- Reduced motion fallback: static grid -->
		<Container>
			<div class="problem-grid">
				{#each problems as text}
					<ProblemCard {text} />
				{/each}
			</div>
		</Container>
	{:else}
		<!-- Full motion: scroll-driven 3D carousel -->
		<ScrollCarousel items={carouselItems}>
			{#snippet card({ item, index })}
				<CarouselCard text={item.text} {index} />
			{/snippet}
		</ScrollCarousel>
	{/if}

	<!-- Stats insertion point (CONT-04) -->
	<div class="stats-placeholder" aria-hidden="true"></div>
</section>

<style>
	.problems-solved {
		padding-top: clamp(12rem, 15vw, 18rem);
		background-color: var(--color-surface);
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
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-label);
		margin-top: 4rem;
		margin-bottom: 2rem;
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

	.stats-placeholder {
		display: none;
	}
</style>
