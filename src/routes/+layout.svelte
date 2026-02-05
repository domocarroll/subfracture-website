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

	let { children } = $props();

	onMount(() => {
		initGSAP();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
