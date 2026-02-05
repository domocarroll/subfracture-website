<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { animate } from '$lib/actions/animate';
</script>

<svelte:head>
	<title>Subfracture | Culture Studio</title>
	<meta name="description" content="Subfracture - Culture studio for brands that outgrow campaigns. Brisbane HQ, Los Angeles." />
</svelte:head>

<!-- Hero -->
<header class="hero">
	<Container>
		<h1 class="hero-title" use:animate={{
			type: 'from',
			opacity: 0,
			y: 40,
			duration: 0.8
		}}>Subfracture</h1>
		<p class="hero-subtitle" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.8,
			delay: 0.15
		}}>Culture Studio</p>
		<p class="hero-lead" use:animate={{
			type: 'from',
			opacity: 0,
			y: 20,
			duration: 0.6,
			delay: 0.3
		}}>For brands that outgrow campaigns</p>
	</Container>
</header>

<!-- Work Section -->
<section id="work" class="section">
	<Container>
		<SectionHeading number="01" title="Work" />
		<div class="section-content" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="section-text">
				Selected projects showcasing strategic brand work across culture,
				identity, and experience design. Each project represents a collaborative
				journey with clients who understand that meaningful brands require
				meaningful investment in understanding.
			</p>
			<div class="placeholder-grid">
				<div class="placeholder-card"></div>
				<div class="placeholder-card"></div>
				<div class="placeholder-card"></div>
			</div>
		</div>
	</Container>
</section>

<!-- Services Section -->
<section id="services" class="section section--warm">
	<Container>
		<SectionHeading number="02" title="Services" />
		<div class="section-content" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="section-text">
				Strategy, identity, and experience design for brands navigating
				cultural complexity. We work with organizations ready to move beyond
				campaigns toward enduring cultural relevance.
			</p>
			<div class="services-list">
				<div class="service-item">
					<h3 class="service-title">Strategy</h3>
					<p class="service-desc">Brand positioning, cultural research, and narrative development.</p>
				</div>
				<div class="service-item">
					<h3 class="service-title">Identity</h3>
					<p class="service-desc">Visual systems, naming, and verbal identity.</p>
				</div>
				<div class="service-item">
					<h3 class="service-title">Experience</h3>
					<p class="service-desc">Digital products, environments, and touchpoints.</p>
				</div>
			</div>
		</div>
	</Container>
</section>

<!-- About Section -->
<section id="about" class="section">
	<Container>
		<SectionHeading number="03" title="About" />
		<div class="section-content" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="section-text section-text--large">
				Subfracture is a culture studio founded on the belief that brands
				are living systems, not static marks. We combine scholarly rigor
				with creative intuition to help organizations discover and express
				their authentic cultural position.
			</p>
			<p class="section-text">
				Based in Brisbane with a presence in Los Angeles, we work with
				clients globally on projects that demand both strategic depth
				and creative excellence.
			</p>
		</div>
	</Container>
</section>

<!-- Contact Section -->
<section id="contact" class="section section--dark">
	<Container>
		<SectionHeading number="04" title="Contact" variant="light" />
		<div class="section-content" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="section-text section-text--light">
				Ready to explore how culture can transform your brand?
				We would love to hear from you.
			</p>
			<a href="mailto:ohhello@subfrac.com" class="contact-cta">
				ohhello@subfrac.com
			</a>
		</div>
	</Container>
</section>

<style>
	/* Hero */
	.hero {
		background-color: var(--color-surface);
		padding: var(--spacing-section) 0;
		text-align: center;
		min-height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hero-title {
		font-family: var(--font-serif);
		font-size: var(--text-5xl);
		line-height: var(--text-5xl--line-height);
		color: var(--color-text);
		margin: 0 0 0.5rem;
		font-weight: 400;
	}

	.hero-subtitle {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		font-style: italic;
		color: var(--color-text-muted);
		margin: 0 0 2rem;
	}

	.hero-lead {
		font-family: var(--font-sans);
		font-size: var(--text-lg);
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Sections */
	.section {
		padding: var(--spacing-section) 0;
		background-color: var(--color-surface);
		min-height: 80vh;
	}

	.section--warm {
		background-color: var(--color-surface-warm);
	}

	.section--dark {
		background-color: var(--color-text);
	}

	.section-content {
		margin-top: 3rem;
	}

	.section-text {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		line-height: var(--text-base--line-height);
		color: var(--color-text-muted);
		margin: 0 0 2rem;
		max-width: 60ch;
	}

	.section-text--large {
		font-family: var(--font-serif);
		font-size: var(--text-lg);
		line-height: var(--text-lg--line-height);
		color: var(--color-text);
	}

	.section-text--light {
		color: var(--color-surface);
		opacity: 0.85;
	}

	/* Placeholder cards for work section */
	.placeholder-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.placeholder-card {
		aspect-ratio: 4/3;
		background-color: var(--color-bone);
		border-radius: 4px;
	}

	/* Services list */
	.services-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
		margin-top: 2rem;
	}

	.service-item {
		padding: 1.5rem;
		background-color: var(--color-surface);
		border-radius: 4px;
		border: 1px solid var(--color-bone);
	}

	.service-title {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		color: var(--color-text);
		margin: 0 0 0.75rem;
	}

	.service-desc {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.6;
	}

	/* Contact CTA */
	.contact-cta {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		color: var(--color-surface);
		text-decoration: none;
		display: inline-block;
		padding: 0.5rem 0;
		border-bottom: 2px solid var(--color-primary);
		transition: color 200ms ease, border-color 200ms ease;
	}

	.contact-cta:hover {
		color: var(--color-primary);
		border-color: var(--color-surface);
	}

	/* Responsive adjustments */
	@media (max-width: 48rem) {
		.hero-title {
			font-size: var(--text-4xl);
		}

		.hero {
			min-height: 60vh;
		}

		.section {
			padding: var(--spacing-section-sm) 0;
			min-height: auto;
		}

		.contact-cta {
			font-size: var(--text-xl);
		}
	}
</style>
