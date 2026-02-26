<script lang="ts">
	import Hero from '$lib/components/hero/Hero.svelte';
	import ProblemsSolved from '$lib/components/content/ProblemsSolved.svelte';
	import Services from '$lib/components/content/Services.svelte';
	import ClosingStatement from '$lib/components/content/ClosingStatement.svelte';

	import PortfolioSection from '$lib/components/portfolio/PortfolioSection.svelte';
	import TeamSection from '$lib/components/team/TeamSection.svelte';
	import ContactSection from '$lib/components/contact/ContactSection.svelte';
	import InlineCTA from '$lib/components/ui/InlineCTA.svelte';
</script>

<svelte:head>
	<title>Subfracture | Culture Studio</title>
	<meta name="description" content="Subfracture is a strategic culture and design studio. We help brands get clear, get chosen, and get remembered. Brisbane HQ, Los Angeles." />
	<link rel="canonical" href="https://subfrac.com" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subfrac.com" />
	<meta property="og:title" content="Subfracture | Culture Studio" />
	<meta property="og:description" content="Strategic culture and design studio. For brands that outgrow campaigns." />
	<meta property="og:image" content="https://subfrac.com/og-image.png" />
	<meta property="og:locale" content="en_AU" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Subfracture | Culture Studio" />
	<meta name="twitter:description" content="Strategic culture and design studio. For brands that outgrow campaigns." />
	<meta name="twitter:image" content="https://subfrac.com/og-image.png" />

	<!-- JSON-LD Structured Data -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Subfracture",
		"url": "https://subfrac.com",
		"description": "Strategic culture and design studio",
		"address": {
			"@type": "PostalAddress",
			"addressLocality": "Brisbane",
			"addressRegion": "QLD",
			"addressCountry": "AU"
		}
	})}</script>`}
</svelte:head>

<!-- Hero -->
<Hero />

<!-- Problems Solved (About) -->
<ProblemsSolved />

<!-- Services -->
<Services />

<!-- Closing Statement (scrub text reveal) -->
<ClosingStatement />
<InlineCTA text="Let's talk" href="#contact" />

<!-- Portfolio -->
<PortfolioSection />

<!-- Team (cream return — no divider needed) -->
<TeamSection />

<!-- Contact -->
<ContactSection />
