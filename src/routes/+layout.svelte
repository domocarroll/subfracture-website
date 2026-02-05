<script lang="ts">
	// Self-hosted fonts (no Google Fonts CDN)
	import '@fontsource-variable/playfair-display';
	import '@fontsource/source-sans-3/400.css';
	import '@fontsource/source-sans-3/500.css';
	import '@fontsource/source-sans-3/600.css';

	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';
	import { initGSAP } from '$lib/utils/gsap';

	// Layout components
	import Navigation from '$lib/components/navigation/Navigation.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';

	let { children } = $props();

	onMount(() => {
		initGSAP();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Navigation includes ScrollProgress -->
<Navigation />

<main class="main-content">
	{@render children()}
</main>

<Footer />

<style>
	.main-content {
		/* Account for fixed navigation height */
		padding-top: 5rem; /* ~80px to match nav height */
		min-height: 100vh;
	}
</style>
