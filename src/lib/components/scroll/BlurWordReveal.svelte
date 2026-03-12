<script lang="ts">
	/**
	 * BlurWordReveal - Scroll-scrubbed blur-to-sharp word reveal
	 *
	 * Words start blurred and faded, progressively coming into focus
	 * as the user scrolls. Creates a "crystallizing" effect — ideas
	 * sharpening into clarity.
	 *
	 * Used for key statements that reward deliberate reading.
	 * Reduced motion: all words visible immediately, no blur.
	 */

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** The text to reveal word by word */
		text: string;
		/** HTML tag for the wrapper element */
		tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
		/** Additional CSS class for the wrapper */
		class?: string;
		/** ScrollTrigger start position */
		start?: string;
		/** ScrollTrigger end position */
		end?: string;
		/** Scrub smoothing value */
		scrub?: boolean | number;
		/** Blur amount in pixels (default 8) */
		blurAmount?: number;
		/** Starting opacity for each word (default 0.08) */
		startOpacity?: number;
	}

	let {
		text,
		tag = 'p',
		class: className = '',
		start = 'top 80%',
		end = 'top 30%',
		scrub = 0.8,
		blurAmount = 8,
		startOpacity = 0.08
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

			const wordEls = containerEl!.querySelectorAll('.blur-word');
			if (wordEls.length === 0) return;

			tween = gsap.fromTo(
				wordEls,
				{ opacity: startOpacity, filter: `blur(${blurAmount}px)` },
				{
					opacity: 1,
					filter: 'blur(0px)',
					duration: 1,
					ease: 'none',
					stagger: { each: 2 },
					scrollTrigger: {
						trigger: containerEl,
						start,
						end,
						scrub
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

{#snippet wordContent()}
	{#each words as word, i}
		<span class="blur-word">{word}</span>{#if i < words.length - 1}{' '}{/if}
	{/each}
{/snippet}

{#if tag === 'h1'}
	<h1 class="blur-text {className}" bind:this={containerEl}>
		{@render wordContent()}
	</h1>
{:else if tag === 'h2'}
	<h2 class="blur-text {className}" bind:this={containerEl}>
		{@render wordContent()}
	</h2>
{:else if tag === 'h3'}
	<h3 class="blur-text {className}" bind:this={containerEl}>
		{@render wordContent()}
	</h3>
{:else if tag === 'span'}
	<span class="blur-text {className}" bind:this={containerEl}>
		{@render wordContent()}
	</span>
{:else}
	<p class="blur-text {className}" bind:this={containerEl}>
		{@render wordContent()}
	</p>
{/if}

<style>
	.blur-text {
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.blur-word {
		display: inline;
	}

	@media (prefers-reduced-motion: reduce) {
		.blur-word {
			opacity: 1 !important;
			filter: none !important;
		}
	}
</style>
