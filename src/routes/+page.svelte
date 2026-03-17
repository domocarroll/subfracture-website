<script lang="ts">
	import Hero from '$lib/components/hero/Hero.svelte';
	import IntroBlock from '$lib/components/content/IntroBlock.svelte';
	import ClientsReveal from '$lib/components/hero/ClientsReveal.svelte';
	import ProblemsSolved from '$lib/components/content/ProblemsSolved.svelte';
	import Services from '$lib/components/content/Services.svelte';
	import ClosingStatement from '$lib/components/content/ClosingStatement.svelte';

	import PortfolioSection from '$lib/components/portfolio/PortfolioSection.svelte';
	import TeamSection from '$lib/components/team/TeamSection.svelte';
	import ContactSection from '$lib/components/contact/ContactSection.svelte';
	import InlineCTA from '$lib/components/ui/InlineCTA.svelte';
	import { siteContent } from '$lib/data/content';
</script>

<svelte:head>
	<title>{siteContent.meta.title}</title>
	<meta name="description" content={siteContent.meta.description} />
	<link rel="canonical" href={siteContent.meta.canonical} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteContent.meta.canonical} />
	<meta property="og:title" content={siteContent.meta.title} />
	<meta property="og:description" content={siteContent.meta.ogDescription} />
	<meta property="og:image" content={siteContent.meta.ogImage} />
	<meta property="og:locale" content={siteContent.meta.locale} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={siteContent.meta.title} />
	<meta name="twitter:description" content={siteContent.meta.ogDescription} />
	<meta name="twitter:image" content={siteContent.meta.ogImage} />

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

<!-- Intro Block -->
<IntroBlock />

<!-- Clients Reveal (lips animation) -->
<ClientsReveal />

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
