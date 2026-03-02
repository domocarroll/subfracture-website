<script lang="ts">
	/**
	 * ScrubTextReveal - Word-by-word scroll-scrubbed opacity reveal
	 *
	 * Splits text into individual words, each wrapped in a span.
	 * As the user scrolls, words progressively reveal from muted to full opacity,
	 * creating a "scholarly revelation" reading experience.
	 *
	 * Uses gsap.fromTo with scrub:true for smooth scroll-linked animation.
	 * Reduced motion: all words show at full opacity immediately.
	 * No-JS: text renders normally (no spans needed for content).
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** The text to reveal word by word */
		text: string;
		/** HTML tag for the wrapper element */
		tag?: 'p' | 'h2' | 'h3' | 'span';
		/** Additional CSS class for the wrapper */
		class?: string;
		/** ScrollTrigger start position */
		start?: string;
		/** ScrollTrigger end position */
		end?: string;
		/** Scrub smoothing value (true = instant, number = lerp seconds) */
		scrub?: boolean | number;
	}

	let {
		text,
		tag = 'p',
		class: className = '',
		start = 'top 85%',
		end = 'top 25%',
		scrub = 0.5
	}: Props = $props();

	let containerEl: HTMLElement | undefined = $state();
	let words = $derived(text.split(/\s+/).filter(Boolean));

	onMount(() => {
		if (!browser || !containerEl || prefersReducedMotion()) return;

		let scrollTriggerInstance: ScrollTrigger | null = null;
		let tween: gsap.core.Tween | null = null;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const wordEls = containerEl!.querySelectorAll('.scrub-word');
			if (wordEls.length === 0) return;

			tween = gsap.fromTo(
				wordEls,
				{ opacity: 0.15 },
				{
					opacity: 1,
					duration: 1,
					ease: 'none',
					stagger: { each: 2 },
					scrollTrigger: {
						trigger: containerEl,
						start,
						end,
						scrub,
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

{#if tag === 'h2'}
	<h2 class="scrub-text {className}" bind:this={containerEl}>
		{#each words as word, i}
			<span class="scrub-word">{word}</span>{#if i < words.length - 1}{' '}{/if}
		{/each}
	</h2>
{:else if tag === 'h3'}
	<h3 class="scrub-text {className}" bind:this={containerEl}>
		{#each words as word, i}
			<span class="scrub-word">{word}</span>{#if i < words.length - 1}{' '}{/if}
		{/each}
	</h3>
{:else if tag === 'span'}
	<span class="scrub-text {className}" bind:this={containerEl}>
		{#each words as word, i}
			<span class="scrub-word">{word}</span>{#if i < words.length - 1}{' '}{/if}
		{/each}
	</span>
{:else}
	<p class="scrub-text {className}" bind:this={containerEl}>
		{#each words as word, i}
			<span class="scrub-word">{word}</span>{#if i < words.length - 1}{' '}{/if}
		{/each}
	</p>
{/if}

<style>
	.scrub-text {
		/* Ensure words wrap naturally */
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.scrub-word {
		/* Start muted for JS-enhanced experience */
		display: inline;
		will-change: opacity;
	}

	/* No-JS fallback: words are fully visible without JavaScript */
	@media (prefers-reduced-motion: reduce) {
		.scrub-word {
			opacity: 1 !important;
		}
	}
</style>
