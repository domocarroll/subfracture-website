<script lang="ts">
	import Hero from '$lib/components/hero/Hero.svelte';
	import ProblemsSolved from '$lib/components/content/ProblemsSolved.svelte';
	import Services from '$lib/components/content/Services.svelte';
	import ClosingStatement from '$lib/components/content/ClosingStatement.svelte';
	import SectionDivider from '$lib/components/scroll/SectionDivider.svelte';
	import PortfolioSection from '$lib/components/portfolio/PortfolioSection.svelte';
	import TeamSection from '$lib/components/team/TeamSection.svelte';
	import ContactSection from '$lib/components/contact/ContactSection.svelte';
	import InlineCTA from '$lib/components/ui/InlineCTA.svelte';
</script>

<svelte:head>
	<title>Subfracture | Culture Studio</title>
	<meta name="description" content="Subfracture - Culture studio for brands that outgrow campaigns. Brisbane HQ, Los Angeles." />
</svelte:head>

<!-- Hero -->
<Hero />

<!-- Problems Solved (About) -->
<ProblemsSolved />
<InlineCTA text="Start a conversation" href="#contact" />

<!-- Services -->
<Services />
<InlineCTA text="See how we work" href="#work" />

<!-- Organic divider: warm cream → cream -->
<SectionDivider
	variant="organic"
	colorFrom="var(--color-surface-warm)"
	colorTo="var(--color-surface)"
	height={80}
/>

<!-- Closing Statement (scrub text reveal) -->
<ClosingStatement />
<InlineCTA text="Let's talk" href="#contact" />

<!-- Fracture divider: cream → near-black -->
<SectionDivider
	variant="fracture"
	colorFrom="var(--color-surface)"
	colorTo="var(--color-text)"
	height={100}
/>

<!-- Portfolio (circle wipe + scattered cards) -->
<PortfolioSection />

<!-- Team (cream return — no divider needed) -->
<TeamSection />

<!-- Fracture divider: cream → near-black -->
<SectionDivider
	variant="fracture"
	colorFrom="var(--color-surface)"
	colorTo="var(--color-text)"
	height={100}
/>

<!-- Contact (scrub heading + form, shares dark chapter with footer) -->
<ContactSection />
