<script lang="ts">
	/**
	 * PortfolioBgText - Background watermark typography with subtle parallax
	 *
	 * Large "SELECTED WORK" text at 12-15vw, sitting behind portfolio
	 * content at 0.04 opacity. Creates a watermark-on-parchment effect.
	 * Single parallax element (y: -80 scrub) — the only parallax on the page.
	 * aria-hidden since it's purely decorative.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** Text to display */
		text?: string;
		/** Additional CSS class */
		class?: string;
	}

	let {
		text = 'SELECTED WORK',
		class: className = ''
	}: Props = $props();

	let bgEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (!browser || !bgEl || prefersReducedMotion()) return;

		let tween: gsap.core.Tween | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			tween = gsap.to(bgEl!, {
				y: -80,
				ease: 'none',
				scrollTrigger: {
					trigger: bgEl!.parentElement,
					start: 'top bottom',
					end: 'bottom top',
					scrub: true
				}
			});
		};

		init();

		return () => {
			if (tween) {
				if (tween.scrollTrigger) (tween.scrollTrigger as ScrollTrigger).kill();
				tween.kill();
			}
		};
	});
</script>

<div class="bg-text {className}" aria-hidden="true" bind:this={bgEl}>
	{text}
</div>

<style>
	.bg-text {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: clamp(8rem, 14vw, 20rem);
		text-transform: uppercase;
		color: var(--color-surface);
		opacity: 0.04;
		line-height: 0.9;
		white-space: nowrap;
		user-select: none;
		pointer-events: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		will-change: transform;
	}
</style>
