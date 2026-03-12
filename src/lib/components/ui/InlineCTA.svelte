<script lang="ts">
	/**
	 * InlineCTA - "The Invitation"
	 *
	 * Terracotta text link with dot marker. Distributed after key sections.
	 * Entrance: dot springs into existence, text fades up.
	 * Hover: magnetic pull tracks the cursor's interest.
	 *
	 * Reduced motion: visible immediately, no magnetic effect.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import { magnetic } from '$lib/actions/magnetic';

	interface Props {
		/** Link text */
		text: string;
		/** Link destination */
		href?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		text,
		href = '#contact',
		class: className = ''
	}: Props = $props();

	let wrapperEl: HTMLElement | undefined = $state();
	let dotEl: HTMLElement | undefined = $state();
	let reducedMotion = $state(false);

	onMount(() => {
		if (!browser) return;

		reducedMotion = prefersReducedMotion();
		if (reducedMotion || !wrapperEl || !dotEl) return;

		let scrollTriggerInstance: ScrollTrigger | null = null;
		let tl: gsap.core.Timeline | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const ctaEl = wrapperEl!.querySelector('.cta');
			if (!ctaEl || !dotEl) return;

			// Set initial states
			gsap.set(dotEl, { scale: 0 });
			gsap.set(ctaEl, { opacity: 0, y: 8 });

			tl = gsap.timeline({ paused: true });

			// Dot springs into existence
			tl.to(dotEl, {
				scale: 1,
				duration: 0.45,
				ease: 'back.out(1.4)'
			});

			// Text fades up alongside
			tl.to(
				ctaEl,
				{
					opacity: 1,
					y: 0,
					duration: 0.5,
					ease: 'power3.out'
				},
				0.05
			);

			scrollTriggerInstance = ScrollTrigger.create({
				trigger: wrapperEl,
				start: 'top 88%',
				onEnter: () => tl!.play(),
				onLeaveBack: () => tl!.pause(0)
			});
		};

		init();

		return () => {
			if (scrollTriggerInstance) scrollTriggerInstance.kill();
			if (tl) tl.kill();
		};
	});
</script>

<div class="cta-wrapper {className}" bind:this={wrapperEl}>
	{#if reducedMotion}
		<a {href} class="cta">
			<span class="cta-dot" aria-hidden="true"></span>
			{text}
		</a>
	{:else}
		<a {href} class="cta" use:magnetic={{ strength: 5 }}>
			<span class="cta-dot" aria-hidden="true" bind:this={dotEl}></span>
			{text}
		</a>
	{/if}
</div>

<style>
	.cta-wrapper {
		text-align: center;
		padding: 2rem 0;
	}

	.cta {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
		text-decoration: none;
		border-bottom: 1px solid var(--color-text);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		transition: color 0.3s ease, border-color 0.3s ease;
	}

	.cta:hover,
	.cta:focus-visible {
		color: var(--color-text-muted);
		border-color: var(--color-text-muted);
	}

	.cta:focus-visible {
		outline: 2px solid var(--color-text);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.cta-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--color-text);
		flex-shrink: 0;
		transition: transform 0.3s ease;
	}

	.cta:hover .cta-dot {
		transform: scale(1.5);
	}

	@media (prefers-reduced-motion: reduce) {
		.cta-dot {
			transform: none !important;
		}
	}
</style>
