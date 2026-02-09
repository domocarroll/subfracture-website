<script lang="ts">
	import Container from '$lib/components/ui/Container.svelte';
	import Hero from '$lib/components/hero/Hero.svelte';
	import ProblemsSolved from '$lib/components/content/ProblemsSolved.svelte';
	import Services from '$lib/components/content/Services.svelte';
	import ClosingStatement from '$lib/components/content/ClosingStatement.svelte';
</script>

<svelte:head>
	<title>Subfracture | Culture Studio</title>
	<meta name="description" content="Subfracture - Culture studio for brands that outgrow campaigns. Brisbane HQ, Los Angeles." />
</svelte:head>

<!-- Hero -->
<Hero />

<!-- Problems Solved (About) -->
<ProblemsSolved />

<!-- Services -->
<Services />

<!-- Closing Statement -->
<ClosingStatement />

<!-- Portfolio placeholder (Phase 5) -->
<section id="work" class="section">
	<Container>
		<p style="font-family: var(--font-sans); color: var(--color-text-muted); font-size: var(--text-sm);">
			Portfolio section — Phase 5
		</p>
	</Container>
</section>

<!-- Contact placeholder (Phase 7) -->
<section id="contact" class="section section--dark">
	<Container>
		<p style="font-family: var(--font-sans); color: var(--color-surface); opacity: 0.6; font-size: var(--text-sm);">
			Contact section — Phase 7
		</p>
	</Container>
</section>

<style>
	/* Sections */
	.section {
		padding: var(--spacing-section) 0;
		background-color: var(--color-surface);
		min-height: 80vh;
	}

	.section--dark {
		background-color: var(--color-text);
	}

	/* Responsive adjustments */
	@media (max-width: 48rem) {
		.section {
			padding: var(--spacing-section-sm) 0;
			min-height: auto;
		}
	}
</style>
