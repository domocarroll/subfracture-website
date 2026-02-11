<script lang="ts">
	/**
	 * PortfolioReveal - Circle wipe transition into portfolio section
	 *
	 * A 200vh pinned wrapper with a circle that scales from 10vw to 150vw
	 * as the user scrolls. Creates a cinematic "portal opening" effect
	 * that transitions from cream into the dark portfolio world.
	 *
	 * Uses clip-path: circle() for mobile perf, CSS scale for desktop.
	 * Reduced motion: instant reveal (no pin, no scale).
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	import type { Snippet } from 'svelte';

	interface Props {
		/** Fill color of the expanding circle */
		fillColor?: string;
		/** Content to reveal inside the circle */
		children: Snippet;
	}

	let {
		fillColor = 'var(--color-text)',
		children
	}: Props = $props();

	let wrapperEl: HTMLElement | undefined = $state();
	let reducedMotion = $state(false);

	onMount(() => {
		reducedMotion = prefersReducedMotion();
		if (!browser || !wrapperEl || reducedMotion) return;

		let scrollTriggerInstance: ScrollTrigger | null = null;
		let tween: gsap.core.Tween | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const circle = wrapperEl!.querySelector('.reveal-circle');
			if (!circle) return;

			tween = gsap.fromTo(
				circle,
				{ scale: 0.05 },
				{
					scale: 1,
					ease: 'none',
					scrollTrigger: {
						trigger: wrapperEl,
						start: 'top top',
						end: 'bottom bottom',
						scrub: 0.8,
						pin: wrapperEl!.querySelector('.reveal-sticky'),
					}
				}
			);

			if (tween.scrollTrigger) {
				scrollTriggerInstance = tween.scrollTrigger as unknown as ScrollTrigger;
			}
		};

		init();

		return () => {
			if (scrollTriggerInstance) scrollTriggerInstance.kill();
			if (tween) tween.kill();
		};
	});
</script>

{#if reducedMotion}
	<!-- Reduced motion: no wrapper, content shows directly -->
	<div class="reveal-content-static" style="background-color: {fillColor};">
		{@render children()}
	</div>
{:else}
	<div class="reveal-wrapper" bind:this={wrapperEl}>
		<div class="reveal-sticky">
			<div class="reveal-circle" style="background-color: {fillColor};">
				<div class="reveal-content">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.reveal-wrapper {
		height: 200vh;
		position: relative;
	}

	.reveal-sticky {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.reveal-circle {
		width: 150vmax;
		height: 150vmax;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		will-change: transform;
		transform: scale(0.05);
	}

	.reveal-content {
		width: 100vw;
		min-height: 100vh;
	}

	.reveal-content-static {
		width: 100%;
	}

	/* No-JS fallback: just show the content */
	@supports not (animation-timeline: scroll()) {
		:global(.no-js) .reveal-wrapper {
			height: auto;
		}

		:global(.no-js) .reveal-circle {
			border-radius: 0;
			width: 100%;
			height: auto;
			transform: none;
		}
	}
</style>
