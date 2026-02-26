<script lang="ts">
	// Self-hosted fonts (no Google Fonts CDN)
	import '@fontsource-variable/playfair-display';
	import '@fontsource/source-sans-3/400.css';
	import '@fontsource/source-sans-3/500.css';
	import '@fontsource/source-sans-3/600.css';

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount, onDestroy } from 'svelte';
	import { initGSAP } from '$lib/utils/gsap';
	import { prefersReducedMotion } from '$lib/utils/motion';

	// Layout components
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();

	let lenisCleanup: (() => void) | null = null;

	onMount(() => {
		initLenis();
	});

	onDestroy(() => {
		if (lenisCleanup) lenisCleanup();
	});

	async function initLenis() {
		const gsap = await initGSAP();

		// Lenis smooth scroll — skip if reduced motion preferred
		if (gsap && !prefersReducedMotion()) {
			const { default: Lenis } = await import('lenis');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');

			const lenis = new Lenis({
				lerp: 0.1,
				wheelMultiplier: 0.8,
				touchMultiplier: 1,
			});

			// Sync Lenis scroll position with GSAP ScrollTrigger
			lenis.on('scroll', ScrollTrigger.update);

			gsap.ticker.add((time: number) => {
				lenis.raf(time * 1000);
			});

			gsap.ticker.lagSmoothing(0);

			lenisCleanup = () => {
				gsap.ticker.remove(lenis.raf);
				lenis.destroy();
			};
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Skip to content (a11y) -->
<a href="#main-content" class="skip-link">Skip to content</a>

<!-- Navigation includes ScrollProgress -->
<Navigation />

<main id="main-content" class="main-content">
	{@render children()}
</main>

<Footer />

<style>
	.skip-link {
		position: fixed;
		top: -100%;
		left: 1rem;
		z-index: 100;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-surface);
		color: var(--color-text);
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		border: 2px solid var(--color-primary);
		border-radius: 4px;
		text-decoration: none;
		transition: top 0.2s ease;
	}

	.skip-link:focus {
		top: 1rem;
	}

	.main-content {
		/* Account for fixed navigation height */
		padding-top: 5rem; /* ~80px to match nav height */
		min-height: 100vh;
	}
</style>
