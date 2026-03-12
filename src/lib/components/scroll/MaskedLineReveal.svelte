<script lang="ts">
	/**
	 * MaskedLineReveal - Line-by-line slide-up reveal with overflow mask
	 *
	 * Each line slides up from behind an overflow:hidden mask,
	 * creating an editorial "page turning" effect. Lines arrive
	 * with authority — expo.out ease snaps them to rest confidently.
	 *
	 * Lines are passed as an array of strings.
	 * Reduced motion: all lines visible immediately.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** Array of text lines to reveal */
		lines: string[];
		/** Additional CSS class for the container */
		class?: string;
		/** Stagger delay between lines in seconds (default 0.1) */
		stagger?: number;
		/** Animation duration per line (default 0.9) */
		duration?: number;
		/** ScrollTrigger start position (default 'top 80%') */
		triggerStart?: string;
		/** Final opacity for all lines (default 1) */
		finalOpacity?: number;
	}

	let {
		lines,
		class: className = '',
		stagger = 0.1,
		duration = 0.9,
		triggerStart = 'top 80%',
		finalOpacity = 1
	}: Props = $props();

	let containerEl: HTMLElement | undefined = $state();

	onMount(() => {
		if (!browser || !containerEl || prefersReducedMotion()) return;

		let scrollTriggerInstance: ScrollTrigger | null = null;
		let tl: gsap.core.Timeline | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const lineEls = containerEl!.querySelectorAll('.masked-line');
			if (lineEls.length === 0) return;

			// Set initial state — hidden below the mask
			gsap.set(lineEls, { yPercent: 110, opacity: 0 });

			tl = gsap.timeline({ paused: true });
			tl.to(lineEls, {
				yPercent: 0,
				opacity: finalOpacity,
				duration,
				ease: 'expo.out',
				stagger: { each: stagger }
			});

			scrollTriggerInstance = ScrollTrigger.create({
				trigger: containerEl,
				start: triggerStart,
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

<div class="masked-lines {className}" bind:this={containerEl}>
	{#each lines as line}
		<span class="masked-line-wrap">
			<span class="masked-line">{line}</span>
		</span>
	{/each}
</div>

<style>
	.masked-lines {
		display: block;
	}

	.masked-line-wrap {
		display: block;
		overflow: hidden;
	}

	.masked-line {
		display: block;
	}

	@media (prefers-reduced-motion: reduce) {
		.masked-line {
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
