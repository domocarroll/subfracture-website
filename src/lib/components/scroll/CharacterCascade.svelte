<script lang="ts">
	/**
	 * CharacterCascade - Character-level heading animation
	 *
	 * Splits heading text into individual characters, each animated from
	 * below (yPercent:100) to position (yPercent:0) with a staggered delay.
	 * Creates a "scholarly revelation" cascade effect.
	 *
	 * Two-trigger pattern:
	 * - Play on scroll enter (top 80%)
	 * - Reset on scroll leave-back (scrolls back above)
	 *
	 * Reduced motion: text appears immediately, no animation.
	 * No-JS: text renders normally as a heading.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** The heading text to cascade */
		text: string;
		/** HTML heading level */
		tag?: 'h1' | 'h2' | 'h3';
		/** Additional CSS class */
		class?: string;
		/** Stagger delay between characters in seconds */
		stagger?: number;
		/** Animation duration per character */
		duration?: number;
	}

	let {
		text,
		tag = 'h2',
		class: className = '',
		stagger = 0.04,
		duration = 0.5
	}: Props = $props();

	let containerEl: HTMLElement | undefined = $state();

	// Split text into characters, preserving spaces
	let chars = $derived(
		text.split('').map((char) => ({
			char,
			isSpace: char === ' '
		}))
	);

	onMount(() => {
		if (!browser || !containerEl || prefersReducedMotion()) return;

		let scrollTriggerInstance: ScrollTrigger | null = null;
		let tl: gsap.core.Timeline | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const charEls = containerEl!.querySelectorAll('.cascade-char');
			if (charEls.length === 0) return;

			tl = gsap.timeline({ paused: true });

			tl.fromTo(
				charEls,
				{
					yPercent: 100,
					opacity: 0
				},
				{
					yPercent: 0,
					opacity: 1,
					duration,
					ease: 'power3.out',
					stagger: { each: stagger }
				}
			);

			scrollTriggerInstance = ScrollTrigger.create({
				trigger: containerEl,
				start: 'top 80%',
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

{#snippet charContent()}
	{#each chars as { char, isSpace }}
		{#if isSpace}
			<span class="cascade-space">&nbsp;</span>
		{:else}
			<span class="cascade-char-wrap"><span class="cascade-char">{char}</span></span>
		{/if}
	{/each}
{/snippet}

{#if tag === 'h1'}
	<h1 class="cascade-heading {className}" bind:this={containerEl}>
		{@render charContent()}
	</h1>
{:else if tag === 'h3'}
	<h3 class="cascade-heading {className}" bind:this={containerEl}>
		{@render charContent()}
	</h3>
{:else}
	<h2 class="cascade-heading {className}" bind:this={containerEl}>
		{@render charContent()}
	</h2>
{/if}

<style>
	.cascade-heading {
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
	}

	.cascade-char-wrap {
		display: inline-block;
		overflow: hidden;
	}

	.cascade-char {
		display: inline-block;
		will-change: transform, opacity;
	}

	.cascade-space {
		display: inline-block;
		width: 0.3em;
	}

	/* Reduced motion: show immediately */
	@media (prefers-reduced-motion: reduce) {
		.cascade-char {
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
