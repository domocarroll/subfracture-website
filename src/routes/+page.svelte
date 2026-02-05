<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import Container from '$lib/components/ui/Container.svelte';
	import { animate } from '$lib/actions/animate';

	// Color palette data for swatches
	const colors = [
		{ name: 'Surface', var: '--color-surface', hex: '#f5f0e8', description: 'Cream/parchment' },
		{ name: 'Surface Warm', var: '--color-surface-warm', hex: '#f0ebe0', description: 'Warmer variant' },
		{ name: 'Bone', var: '--color-bone', hex: '#e8e0d4', description: 'Light stone' },
		{ name: 'Text', var: '--color-text', hex: '#1a1a1a', description: 'Black ink' },
		{ name: 'Text Muted', var: '--color-text-muted', hex: '#4a4a4a', description: 'Secondary' },
		{ name: 'Primary', var: '--color-primary', hex: '#c55a3d', description: 'Terracotta' },
		{ name: 'Primary Dark', var: '--color-primary-dark', hex: '#a84830', description: 'Hover state' },
		{ name: 'Botanical', var: '--color-botanical', hex: '#5a7c65', description: 'Muted green' },
		{ name: 'Burgundy', var: '--color-burgundy', hex: '#722f37', description: 'Deep red' }
	];

	// Typography scale data
	const typeSizes = [
		{ name: '6xl', size: 'var(--text-6xl)', label: '~102px - Hero' },
		{ name: '5xl', size: 'var(--text-5xl)', label: '~79px - Display' },
		{ name: '4xl', size: 'var(--text-4xl)', label: '~63px - H1' },
		{ name: '3xl', size: 'var(--text-3xl)', label: '~49px - H2' },
		{ name: '2xl', size: 'var(--text-2xl)', label: '~39px - H3' },
		{ name: 'xl', size: 'var(--text-xl)', label: '30px - H4' },
		{ name: 'lg', size: 'var(--text-lg)', label: '24px - Lead' },
		{ name: 'base', size: 'var(--text-base)', label: '18px - Body' },
		{ name: 'sm', size: 'var(--text-sm)', label: '14px - Small' },
		{ name: 'xs', size: 'var(--text-xs)', label: '~11px - Caption' }
	];
</script>

<svelte:head>
	<title>Design System | Subfracture</title>
	<meta name="description" content="Subfracture Design System - Typography, colors, grid, and motion patterns." />
</svelte:head>

<!-- Hero -->
<header class="hero">
	<h1 class="hero-title">Design System</h1>
	<p class="hero-subtitle">Nigrum Corpus aesthetic</p>
</header>

<!-- Typography Section -->
<section class="section">
	<Container>
		<SectionHeading number="01" title="Typography" />

		<div class="type-demo" use:animate={{
			type: 'from',
			opacity: 0,
			y: 20,
			duration: 0.6,
			scrollTrigger: { start: 'top 90%' }
		}}>
			<h3 class="font-label">Playfair Display <span class="font-meta">(Serif)</span></h3>
			<div class="type-scale">
				{#each typeSizes.slice(0, 6) as item}
					<div class="type-sample serif" style="font-size: {item.size}">
						Aa
						<span class="type-label">{item.label}</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="type-demo" use:animate={{
			type: 'from',
			opacity: 0,
			y: 20,
			duration: 0.6,
			delay: 0.1,
			scrollTrigger: { start: 'top 90%' }
		}}>
			<h3 class="font-label">Source Sans 3 <span class="font-meta">(Sans-Serif)</span></h3>
			<div class="type-scale">
				{#each typeSizes.slice(4) as item}
					<div class="type-sample sans" style="font-size: {item.size}">
						Aa
						<span class="type-label">{item.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</Container>
</section>

<!-- Color Palette Section -->
<section class="section">
	<Container grid>
		<div>
			<SectionHeading number="02" title="Color Palette" />
			<p class="section-intro">
				A warm, scholarly palette rooted in earth tones. Terracotta provides
				accent warmth against cream backgrounds, with botanical green reserved
				for specific decorative elements.
			</p>
		</div>
		<div class="color-grid" use:animate={{
			type: 'from',
			opacity: 0,
			x: 20,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			{#each colors as color}
				<div class="color-swatch">
					<div
						class="swatch-preview"
						style="background-color: {color.hex}"
						class:swatch-dark={color.name === 'Text' || color.name === 'Text Muted' || color.name === 'Burgundy'}
					></div>
					<div class="swatch-info">
						<span class="swatch-name">{color.name}</span>
						<span class="swatch-hex">{color.hex}</span>
					</div>
				</div>
			{/each}
		</div>
	</Container>
</section>

<!-- Grid System Section -->
<section class="section">
	<Container>
		<SectionHeading number="03" title="Grid System" />
	</Container>
	<Container grid>
		<div class="grid-demo major" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="ratio-label">1.618fr</p>
			<p class="ratio-name">Major Column</p>
			<p class="ratio-desc">Primary content, editorial text, main imagery. This is where the narrative lives.</p>
		</div>
		<div class="grid-demo minor" use:animate={{
			type: 'from',
			opacity: 0,
			y: 30,
			duration: 0.6,
			delay: 0.15,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<p class="ratio-label">1fr</p>
			<p class="ratio-name">Minor Column</p>
			<p class="ratio-desc">Supporting content, sidebar information.</p>
		</div>
	</Container>
</section>

<!-- Motion Section -->
<section class="section section--motion">
	<Container>
		<SectionHeading number="04" title="Motion" />
		<p class="section-intro">
			Animations use GSAP with ScrollTrigger. Elements reveal with a gentle fade and rise
			as they enter the viewport. Duration: 0.6s, ease: power3.out.
		</p>

		<div class="motion-grid">
			<div class="motion-card" use:animate={{
				type: 'from',
				opacity: 0,
				y: 40,
				duration: 0.6,
				scrollTrigger: { start: 'top 85%' }
			}}>
				<span class="motion-label">Fade + Rise</span>
				<p>Default reveal animation. Elements fade in while rising 40px.</p>
			</div>

			<div class="motion-card" use:animate={{
				type: 'from',
				opacity: 0,
				y: 40,
				duration: 0.6,
				delay: 0.1,
				scrollTrigger: { start: 'top 85%' }
			}}>
				<span class="motion-label">Staggered</span>
				<p>Sequential reveals create rhythm. 0.1s delay between elements.</p>
			</div>

			<div class="motion-card" use:animate={{
				type: 'from',
				opacity: 0,
				y: 40,
				duration: 0.6,
				delay: 0.2,
				scrollTrigger: { start: 'top 85%' }
			}}>
				<span class="motion-label">ScrollTrigger</span>
				<p>Animations activate when element enters viewport at 85% scroll position.</p>
			</div>
		</div>
	</Container>
</section>

<!-- Spacing Section -->
<section class="section">
	<Container>
		<SectionHeading number="05" title="Spacing" />
		<div class="spacing-demo" use:animate={{
			type: 'from',
			opacity: 0,
			y: 20,
			duration: 0.6,
			scrollTrigger: { start: 'top 85%' }
		}}>
			<div class="spacing-block">
				<span class="spacing-value">10rem</span>
				<span class="spacing-name">Section spacing (desktop)</span>
			</div>
			<div class="spacing-block">
				<span class="spacing-value">7.5rem</span>
				<span class="spacing-name">Section spacing (mobile)</span>
			</div>
		</div>
	</Container>
</section>

<style>
	/* Hero */
	.hero {
		background-color: var(--color-surface);
		padding: var(--spacing-section) 1rem;
		text-align: center;
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
		font-size: var(--text-lg);
		font-style: italic;
		color: var(--color-text-muted);
		margin: 0;
	}

	/* Sections */
	.section {
		padding: var(--spacing-section) 0;
		background-color: var(--color-surface);
	}

	.section--motion {
		background-color: var(--color-surface-warm);
	}

	.section-intro {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		line-height: var(--text-base--line-height);
		color: var(--color-text-muted);
		margin: 1.5rem 0 2rem;
		max-width: 40ch;
	}

	/* Typography Demo */
	.type-demo {
		margin-top: 3rem;
	}

	.font-label {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 1rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.font-meta {
		font-weight: 400;
		color: var(--color-text-muted);
		text-transform: none;
	}

	.type-scale {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.type-sample {
		display: flex;
		align-items: baseline;
		gap: 1rem;
		color: var(--color-text);
		line-height: 1.2;
	}

	.type-sample.serif {
		font-family: var(--font-serif);
	}

	.type-sample.sans {
		font-family: var(--font-sans);
	}

	.type-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	/* Color Palette */
	.color-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.color-swatch {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.swatch-preview {
		height: 3rem;
		border-radius: 4px;
		border: 1px solid var(--color-bone);
	}

	.swatch-dark {
		border-color: transparent;
	}

	.swatch-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.swatch-name {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-text);
	}

	.swatch-hex {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	/* Grid Demo */
	.grid-demo {
		padding: 2rem;
		border-radius: 4px;
	}

	.grid-demo.major {
		background-color: var(--color-bone);
	}

	.grid-demo.minor {
		background-color: var(--color-surface-warm);
		border: 1px solid var(--color-bone);
	}

	.ratio-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-primary);
		margin: 0 0 0.25rem;
		letter-spacing: 0.05em;
	}

	.ratio-name {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		color: var(--color-text);
		margin: 0 0 0.5rem;
	}

	.ratio-desc {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0;
		line-height: 1.6;
	}

	/* Motion Demo */
	.motion-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.motion-card {
		background-color: var(--color-surface);
		padding: 1.5rem;
		border-radius: 4px;
		border: 1px solid var(--color-bone);
	}

	.motion-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-primary);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.motion-card p {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin: 0.75rem 0 0;
		line-height: 1.6;
	}

	/* Spacing Demo */
	.spacing-demo {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		margin-top: 2rem;
	}

	.spacing-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.spacing-value {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		color: var(--color-text);
	}

	.spacing-name {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	/* Responsive adjustments */
	@media (max-width: 48rem) {
		.hero-title {
			font-size: var(--text-4xl);
		}

		.color-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.section {
			padding: var(--spacing-section-sm) 0;
		}
	}
</style>
