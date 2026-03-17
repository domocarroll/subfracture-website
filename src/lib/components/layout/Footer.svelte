<script lang="ts">
	/**
	 * Footer - "The Coda"
	 *
	 * Bookends the header: same two-beat tagline treatment, same clock
	 * scramble. You started with "Built on Intelligence. Powered by Humans."
	 * and you end with it. The studio is still alive.
	 *
	 * Scroll-triggered entrance: tagline words fade up, credo mirrors
	 * the header's two-beat rhythm, clocks scramble to real time.
	 *
	 * Reduced motion: all text visible immediately.
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';
	import { siteContent } from '$lib/data/content';

	import Container from '$lib/components/ui/Container.svelte';

	const currentYear = new Date().getFullYear();

	let brisbaneTime = $state('');
	let laTime = $state('');
	let interval: ReturnType<typeof setInterval> | null = null;
	let cleanup: (() => void) | null = null;

	// Word splitting for animations
	const taglineWords = siteContent.footer.tagline.split(/\s+/);
	const credoWords = siteContent.footer.credo.split(/\s+/);
	const credoSentenceBreak = siteContent.footer.credoSentenceBreak;

	let taglineEl: HTMLElement | undefined = $state();
	let credoEl: HTMLElement | undefined = $state();
	let clocksEl: HTMLElement | undefined = $state();

	function updateClocks() {
		const now = new Date();
		brisbaneTime = now.toLocaleTimeString('en-AU', {
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
		const totalFrames = 12;

		const randomTime = () => {
			const h =
				chars[Math.floor(Math.random() * 3)] + chars[Math.floor(Math.random() * 10)];
			const m =
				chars[Math.floor(Math.random() * 6)] + chars[Math.floor(Math.random() * 10)];
			return `${h}:${m}`;
		};

		const scrambleId = setInterval(() => {
			brisbaneTime = randomTime();
			laTime = randomTime();
			frame++;
			if (frame >= totalFrames) {
				clearInterval(scrambleId);
				updateClocks();
			}
		}, 50);
	}

	onMount(async () => {
		if (!browser) return;

		updateClocks();
		interval = setInterval(updateClocks, 30000);

		if (prefersReducedMotion()) return;

		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const taglineWordEls = taglineEl?.querySelectorAll('.footer-tagline-word');
		const credoWordEls = credoEl?.querySelectorAll('.footer-credo-word');

		if (!taglineWordEls?.length && !credoWordEls?.length) return;

		// Set initial states
		if (taglineWordEls?.length) {
			gsap.set(taglineWordEls, { opacity: 0, y: 4 });
		}
		if (credoWordEls?.length) {
			gsap.set(credoWordEls, { opacity: 0, y: 4 });
		}
		if (clocksEl) {
			gsap.set(clocksEl, { opacity: 0 });
		}

		const tl = gsap.timeline({ paused: true });

		// Tagline words cascade
		if (taglineWordEls?.length) {
			tl.to(taglineWordEls, {
				opacity: 0.5,
				y: 0,
				duration: 0.5,
				ease: 'power3.out',
				stagger: 0.05
			});
		}

		// Credo: two-beat (mirrors header)
		if (credoWordEls?.length) {
			const sentence1 = Array.from(credoWordEls).slice(0, credoSentenceBreak);
			const sentence2 = Array.from(credoWordEls).slice(credoSentenceBreak);

			tl.to(
				sentence1,
				{
					opacity: 0.5,
					y: 0,
					duration: 0.5,
					ease: 'power3.out',
					stagger: 0.06
				},
				'-=0.2'
			);

			tl.to({}, { duration: 0.35 });

			tl.to(sentence2, {
				opacity: 0.5,
				y: 0,
				duration: 0.5,
				ease: 'power3.out',
				stagger: 0.06
			});
		}

		// Clocks fade in with scramble
		if (clocksEl) {
			tl.to(
				clocksEl,
				{
					opacity: 1,
					duration: 0.3,
					ease: 'power2.out',
					onStart: () => scrambleClocks()
				},
				'-=0.3'
			);
		}

		const scrollTrigger = ScrollTrigger.create({
			trigger: taglineEl?.closest('.footer') || taglineEl,
			start: 'top 90%',
			onEnter: () => tl.play(),
			onLeaveBack: () => tl.pause(0)
		});

		cleanup = () => {
			tl.kill();
			scrollTrigger.kill();
		};
	});

	onDestroy(() => {
		if (interval) clearInterval(interval);
		cleanup?.();
	});
</script>

<footer class="footer">
	<Container variant="wide">
		<!-- Top: Brand -->
		<div class="footer-top">
			<a href="/" class="footer-wordmark" aria-label="Subfracture — home">
				<img src="/subfracture.svg" alt="Subfracture" class="footer-wordmark-img" />
			</a>
			<p class="footer-tagline" bind:this={taglineEl}>
				{#each taglineWords as word, i}
					<span class="footer-tagline-word">{word}</span>{#if i < taglineWords.length - 1}{' '}{/if}
				{/each}
			</p>
		</div>

		<!-- Bottom bar -->
		<div class="footer-bottom">
			<p class="footer-credo" bind:this={credoEl}>
				{#each credoWords as word, i}
					<span class="footer-credo-word">{word}</span>{#if i < credoWords.length - 1}{' '}{/if}
				{/each}
			</p>

			<div class="footer-clocks" bind:this={clocksEl}>
				<span class="clock">
					<span class="clock-city">BRISBANE</span>
					<span class="clock-time">{brisbaneTime}</span>
				</span>
				<span class="clock-divider" aria-hidden="true"></span>
				<span class="clock">
					<span class="clock-city">LOS ANGELES</span>
					<span class="clock-time">{laTime}</span>
				</span>
			</div>

			<p class="copyright">
				&copy; {currentYear}
				<img
					src="/subfracture.svg"
					alt="Subfracture"
					class="copyright-wordmark"
				/>
			</p>
		</div>
	</Container>
</footer>

<style>
	.footer {
		background-color: var(--color-text);
		padding: 4rem 0 2rem;
		position: sticky;
		bottom: 0;
		z-index: -1;
	}

	/* Top brand section */
	.footer-top {
		padding-bottom: 3rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.footer-wordmark {
		display: block;
		text-decoration: none;
	}

	.footer-wordmark:hover .footer-wordmark-img {
		opacity: 0.7;
	}

	.footer-wordmark:focus-visible {
		outline: 2px solid var(--color-surface);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.footer-wordmark-img {
		height: 18px;
		width: auto;
		display: block;
		filter: invert(1);
		transition: opacity 0.2s ease;
	}

	.footer-tagline {
		font-family: var(--font-sans);
		font-size: 0.9rem;
		font-style: italic;
		color: var(--color-surface);
		margin: 0.5rem 0 0;
		opacity: 0.45;
	}

	.footer-tagline-word {
		display: inline;
	}

	/* Bottom bar */
	.footer-bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-top: 1.5rem;
	}

	.footer-credo {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-surface);
		opacity: 0.45;
		margin: 0;
		letter-spacing: 0.02em;
	}

	.footer-credo-word {
		display: inline;
	}

	/* Live clocks */
	.footer-clocks {
		display: flex;
		align-items: center;
		gap: 1.25rem;
	}

	.clock {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.clock-city {
		font-family: var(--font-sans);
		font-size: 0.65rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-surface);
		opacity: 0.4;
	}

	.clock-time {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-variant-numeric: tabular-nums;
		color: var(--color-surface);
		opacity: 0.7;
	}

	.clock-divider {
		width: 1px;
		height: 12px;
		background: rgba(255, 255, 255, 0.15);
	}

	.copyright {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-surface);
		opacity: 0.3;
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.35em;
	}

	.copyright-wordmark {
		height: 0.7em;
		width: auto;
		display: inline-block;
		filter: invert(1);
		vertical-align: baseline;
	}

	/* Mobile: stack vertically */
	@media (max-width: 40rem) {
		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.footer-tagline-word,
		.footer-credo-word {
			opacity: 1 !important;
			transform: none !important;
		}
	}
</style>
