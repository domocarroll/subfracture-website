<script lang="ts">
	/**
	 * Services - Editorial numbered stack of 5 service pillars
	 *
	 * Renders "What we build" label and 5 ServicePillar components in vertical
	 * stack with thin bone dividers between pillars.
	 *
	 * Animation: GSAP matchMedia with staggered scroll-triggered pillar reveals.
	 * Pillars use `.service-pillar` class for stagger targeting.
	 * Reduced motion branch shows all content immediately.
	 *
	 * Section ID: "services" (matches existing nav link #services)
	 * Background: --color-surface-warm (warm cream shift from ProblemsSolved)
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	import Container from '$lib/components/ui/Container.svelte';
	import ServicePillar from './ServicePillar.svelte';
	import { animate } from '$lib/actions/animate';

	const services = [
		{
			number: '01',
			tagline: 'The foundation everything else sits on.',
			description:
				'We define what the world stands for, where it competes, and why it matters \u2014 so decisions stop fragmenting as pressure increases.',
			bullets: [
				'Positioning and value proposition',
				'Audience and category tension mapping',
				'Brand architecture (products, sub-brands, offers)',
				'Experience strategy across touchpoints'
			]
		},
		{
			number: '02',
			tagline: 'A system you can build momentum on.',
			description:
				'We create platform ideas that hold together across campaigns, channels, and moments \u2014 without resetting every quarter.',
			bullets: [
				'Central creative platform and territories',
				'Campaign system across channels',
				'Content pillars and repeatable formats',
				'Launch narrative and key moments'
			]
		},
		{
			number: '03',
			tagline: 'Make it unmistakable.',
			description:
				'We design identities that scale, adapt, and stay coherent wherever the brand shows up.',
			bullets: [
				'Naming support and brand story',
				'Tone of voice and verbal identity',
				'Visual identity (logo, type, colour, layout, art direction)',
				'Guidelines and templates for teams and partners'
			]
		},
		{
			number: '04',
			tagline: 'Bring the system to life.',
			description:
				'We design and build the things people actually interact with \u2014 quickly, carefully, and with intent.',
			bullets: [
				'Websites and landing pages (design and build)',
				'Content production (design, motion, photography direction)',
				'Prototyping before major investment',
				'Software, dev, and immersive builds (where relevant)'
			]
		},
		{
			number: '05',
			tagline: 'Extend reach. Build trust.',
			description:
				'We help brands create meaningful moments and collaborations that earn relevance, not just attention.',
			bullets: [
				'Partnership strategy and collaborator shortlists',
				'Talent and creator liaison',
				'Cultural moments and PR-style thinking',
				'Rollout planning to sustain momentum'
			]
		}
	];

	let servicesEl: HTMLElement;
	let ctx: gsap.MatchMedia | null = null;

	onMount(async () => {
		if (!browser) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		ctx = gsap.matchMedia();

		ctx.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.from(servicesEl.querySelectorAll('.service-pillar'), {
				opacity: 0,
				y: 24,
				duration: 0.6,
				stagger: 0.12,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: servicesEl,
					start: 'top 80%'
				}
			});
		});

		ctx.add('(prefers-reduced-motion: reduce)', () => {
			gsap.set(servicesEl.querySelectorAll('.service-pillar'), { opacity: 1, y: 0 });
		});
	});

	onDestroy(() => {
		if (ctx) {
			ctx.revert();
			ctx = null;
		}
	});
</script>

<section id="services" class="services">
	<Container>
		<span
			class="label"
			use:animate={{
				type: 'from',
				opacity: 0,
				y: 24,
				duration: 0.6,
				ease: 'power3.out',
				scrollTrigger: { start: 'top 85%' }
			}}
		>
			What we build
		</span>

		<div class="services-stack" bind:this={servicesEl}>
			{#each services as service}
				<ServicePillar
					number={service.number}
					tagline={service.tagline}
					description={service.description}
					bullets={service.bullets}
				/>
			{/each}
		</div>
	</Container>
</section>

<style>
	.services {
		padding: clamp(12rem, 15vw, 18rem) 0;
		background-color: var(--color-surface-warm);
	}

	.label {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 3rem;
	}

	.services-stack {
		display: flex;
		flex-direction: column;
	}
</style>
