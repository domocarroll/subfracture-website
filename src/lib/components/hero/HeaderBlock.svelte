<script lang="ts">
	/**
	 * HeaderBlock - "The Studio Powers On"
	 *
	 * Above-the-fold brand statement with entrance choreography:
	 * - Tagline reveals word-by-word in two beats (sentence pause)
	 * - Clocks scramble through random digits before resolving to real time
	 * - Scroll indicator fades in last with a gentle infinite pulse
	 *
	 * Reduced motion: all elements visible immediately, no entrance animation.
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	let bneTime = $state('--:--');
	let laTime = $state('--:--');
	let interval: ReturnType<typeof setInterval> | null = null;
	let cleanup: (() => void) | null = null;

	const taglineWords = 'Built on Intelligence. Powered by Humans.'.split(/\s+/);
	const sentenceBreak = 3; // "Built on Intelligence." is words 0-2

	let taglineEl: HTMLElement | undefined = $state();
	let clocksEl: HTMLElement | undefined = $state();
	let scrollIndicatorEl: HTMLElement | undefined = $state();

	function updateClocks() {
		const now = new Date();

		bneTime = now.toLocaleTimeString('en-AU', {
			timeZone: 'Australia/Brisbane',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});

		laTime = now.toLocaleTimeString('en-US', {
			timeZone: 'America/Los_Angeles',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
	}

	function scrambleClocks() {
		const chars = '0123456789';
		let frame = 0;
		const totalFrames = 15;

		const randomTime = () => {
			const h =
				chars[Math.floor(Math.random() * 3)] + chars[Math.floor(Math.random() * 10)];
			const m =
				chars[Math.floor(Math.random() * 6)] + chars[Math.floor(Math.random() * 10)];
			return `${h}:${m}`;
		};

		const scrambleId = setInterval(() => {
			bneTime = randomTime();
			laTime = randomTime();
			frame++;
			if (frame >= totalFrames) {
				clearInterval(scrambleId);
				updateClocks();
				interval = setInterval(updateClocks, 1000);
			}
		}, 50);
	}

	onMount(async () => {
		if (!browser) return;

		// Reduced motion: show everything immediately, start clocks
		if (prefersReducedMotion()) {
			updateClocks();
			interval = setInterval(updateClocks, 1000);
			return;
		}

		// Full motion: choreographed entrance
		const { gsap } = await import('gsap');

		const wordEls = taglineEl?.querySelectorAll('.tagline-word');
		if (!wordEls || wordEls.length === 0) {
			updateClocks();
			interval = setInterval(updateClocks, 1000);
			return;
		}

		// Set initial states
		gsap.set(wordEls, { opacity: 0, y: 6 });
		if (clocksEl) gsap.set(clocksEl, { opacity: 0 });
		if (scrollIndicatorEl) gsap.set(scrollIndicatorEl, { opacity: 0 });

		// Two-beat tagline timeline
		const sentence1 = Array.from(wordEls).slice(0, sentenceBreak);
		const sentence2 = Array.from(wordEls).slice(sentenceBreak);

		const tl = gsap.timeline({ delay: 0.4 });

		// Beat 1: "Built on Intelligence."
		tl.to(sentence1, {
			opacity: 0.7,
			y: 0,
			duration: 0.5,
			ease: 'power3.out',
			stagger: 0.06
		});

		// Breath between sentences — let the first land before the second begins
		tl.to({}, { duration: 0.4 });

		// Beat 2: "Powered by Humans."
		tl.to(sentence2, {
			opacity: 0.7,
			y: 0,
			duration: 0.5,
			ease: 'power3.out',
			stagger: 0.06
		});

		// Clocks fade in + scramble
		if (clocksEl) {
			tl.to(
				clocksEl,
				{
					opacity: 1,
					duration: 0.3,
					ease: 'power2.out',
					onStart: () => scrambleClocks()
				},
				'-=0.2'
			);
		}

		// Scroll indicator fades in
		let pulse: gsap.core.Tween | null = null;

		if (scrollIndicatorEl) {
			tl.to(
				scrollIndicatorEl,
				{
					opacity: 0.4,
					duration: 0.5,
					ease: 'power2.out'
				},
				'-=0.3'
			);

			// Scroll indicator infinite pulse (starts after entrance)
			pulse = gsap.to(scrollIndicatorEl, {
				opacity: 0.15,
				duration: 2,
				ease: 'sine.inOut',
				yoyo: true,
				repeat: -1,
				paused: true
			});

			tl.call(() => { pulse?.play(); });
		}

		cleanup = () => {
			tl.kill();
			pulse?.kill();
		};
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
		cleanup?.();
	});
</script>

<section class="header-block">
	<div class="logo">
		<img src="/subfracture.svg" alt="Subfracture" class="logo-img" />
	</div>

	<div class="nav-placeholder"></div>

	<div class="tagline" bind:this={taglineEl}>
		{#each taglineWords as word, i}
			<span class="tagline-word">{word}</span>{#if i < taglineWords.length - 1}{' '}{/if}
		{/each}
	</div>

	<div class="clocks" bind:this={clocksEl}>
		<span class="clock clock-bne">BRISBANE {bneTime}</span>
		<span class="clock clock-lax">LOS ANGELES {laTime}</span>
	</div>

	<div class="scroll-indicator" bind:this={scrollIndicatorEl}>(Scroll)</div>
</section>

<style>
	.header-block {
		display: grid;
		grid-template-columns: 1fr 3fr;
		grid-template-rows: auto auto;
		gap: 2em;
		height: 25vh;
		padding: 2em;
		background-color: var(--color-surface);
	}

	.header-block > * {
		line-height: 1;
	}

	.logo {
		grid-column: 1;
		grid-row: 1;
		align-self: start;
		justify-self: start;
	}

	.logo-img {
		height: 16px;
		width: auto;
		display: block;
	}

	.nav-placeholder {
		grid-column: 2;
		grid-row: 1;
	}

	.tagline {
		grid-column: 1;
		grid-row: 2;
		align-self: end;
		justify-self: start;
		font-family: var(--font-sans);
		font-size: 0.85rem;
		color: var(--color-text);
		opacity: 0.7;
	}

	.tagline-word {
		display: inline;
	}

	.clocks {
		grid-column: 2;
		grid-row: 2;
		align-self: end;
		justify-self: start;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text);
		opacity: 0.5;
		letter-spacing: 0.05em;
	}

	.clock-bne {
		margin-right: 1em;
	}

	.scroll-indicator {
		grid-column: 2;
		grid-row: 2;
		align-self: end;
		justify-self: end;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--color-text);
		opacity: 0.4;
		letter-spacing: 0.05em;
	}

	@media (max-width: 48rem) {
		.header-block {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			height: auto;
			min-height: 20vh;
			padding: 1.5em;
			gap: 1em;
		}

		.nav-placeholder {
			display: none;
		}

		.tagline {
			grid-column: 1;
			grid-row: 2;
		}

		.clocks {
			display: none;
		}

		.scroll-indicator {
			grid-column: 1;
			grid-row: 3;
			justify-self: start;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tagline-word {
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
