<script lang="ts">
	/**
	 * ProblemsSolved - Editorial section with confrontational pain point cards
	 *
	 * Renders section heading, intro paragraph, subsection label, and 6 borderless
	 * typographic problem cards in a 2-column grid (1-column mobile).
	 *
	 * Animation: GSAP matchMedia with staggered scroll-triggered card reveals.
	 * Cards use `.problem-card` class for stagger targeting.
	 * Reduced motion branch shows all content immediately.
	 *
	 * Section ID: "about" (matches existing nav link #about)
	 * Background: --color-surface (default cream)
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import Container from '$lib/components/ui/Container.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import ProblemCard from './ProblemCard.svelte';
	import { animate } from '$lib/actions/animate';

	const problems = [
		'Campaign-led thinking with no long-term platform',
		'Inconsistent brand and IP expression at scale',
		'Low trust or weak cultural relevance',
		'Launches that need real momentum, not noise',
		'Brand systems that extend beyond start and end dates',
		'Unclear positioning \u2014 people don\u2019t get it'
	];

	let gridEl: HTMLElement;
	let ctx: gsap.MatchMedia | null = null;

	onMount(async () => {
		if (!browser) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		ctx = gsap.matchMedia();

		ctx.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.fromTo(
				gridEl.querySelectorAll('.problem-card'),
				{ opacity: 0, y: 24 },
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					stagger: 0.08,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: gridEl,
						start: 'top 80%'
					}
				}
			);
		});

		ctx.add('(prefers-reduced-motion: reduce)', () => {
			gsap.set(gridEl.querySelectorAll('.problem-card'), { opacity: 1, y: 0 });
		});
	});

	onDestroy(() => {
		if (ctx) {
			ctx.revert();
			ctx = null;
		}
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

		<div class="problem-grid" bind:this={gridEl}>
			{#each problems as text}
				<ProblemCard {text} />
			{/each}
		</div>

		<!-- Stats insertion point (CONT-04) -->
		<div class="stats-placeholder" aria-hidden="true"></div>
	</Container>
</section>

<style>
	.problems-solved {
		padding: clamp(12rem, 15vw, 18rem) 0;
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
		letter-spacing: 0.1em;
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
