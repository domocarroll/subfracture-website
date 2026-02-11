<script lang="ts">
	/**
	 * PortfolioSection - Portfolio gallery orchestrator
	 *
	 * Combines:
	 * - PortfolioReveal (circle wipe entrance)
	 * - CharacterCascade heading ("Selected Work")
	 * - PortfolioBgText (watermark behind cards)
	 * - Scattered PortfolioCard grid
	 *
	 * Dark background chapter. One scroll interaction (circle wipe).
	 * Cards use CSS hover only, no scroll animation on cards.
	 */

	import PortfolioReveal from './PortfolioReveal.svelte';
	import PortfolioCard from './PortfolioCard.svelte';
	import PortfolioBgText from './PortfolioBgText.svelte';
	import CharacterCascade from '$lib/components/scroll/CharacterCascade.svelte';
	import Container from '$lib/components/ui/Container.svelte';

	// Placeholder portfolio data — will be replaced by Sanity CMS
	const projects = [
		{
			title: 'Vanguard Spirits Co.',
			outcome: 'Built a brand world that outlasted its launch campaign by 18 months',
			category: 'Brand Strategy',
			rotation: 3
		},
		{
			title: 'Meridian Health',
			outcome: 'Repositioned from clinic chain to trusted health partner',
			category: 'Identity System',
			rotation: -4
		},
		{
			title: 'Arcadia Collective',
			outcome: 'Unified 12 sub-brands under one coherent architecture',
			category: 'Brand Architecture',
			rotation: 2
		},
		{
			title: 'Sunline Festival',
			outcome: 'Created a cultural moment that earned 2.4M organic impressions',
			category: 'Cultural Activation',
			rotation: -3
		},
		{
			title: 'Waypoint Education',
			outcome: 'Designed a platform system that scaled from 1 to 8 markets',
			category: 'Design System',
			rotation: 4
		},
		{
			title: 'Ember & Stone',
			outcome: 'Launched from zero to category recognition in 90 days',
			category: 'Launch Strategy',
			rotation: -2
		}
	];
</script>

<PortfolioReveal>
	<section id="work" class="portfolio">
		<PortfolioBgText />

		<Container variant="wide">
			<div class="portfolio-header">
				<span class="portfolio-number">02</span>
				<CharacterCascade
					text="Selected Work"
					tag="h2"
					class="portfolio-heading"
				/>
			</div>

			<div class="portfolio-grid">
				{#each projects as project}
					<PortfolioCard
						title={project.title}
						outcome={project.outcome}
						category={project.category}
						rotation={project.rotation}
					/>
				{/each}
			</div>
		</Container>
	</section>
</PortfolioReveal>

<style>
	.portfolio {
		background-color: var(--color-text);
		color: var(--color-surface);
		padding: clamp(6rem, 8vw, 10rem) 0;
		position: relative;
		overflow: hidden;
		min-height: 100vh;
	}

	.portfolio-header {
		margin-bottom: clamp(4rem, 6vw, 8rem);
	}

	.portfolio-number {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-primary);
		margin-bottom: 1rem;
	}

	:global(.portfolio-heading) {
		font-family: var(--font-serif);
		font-size: var(--text-4xl);
		font-weight: 400;
		color: var(--color-surface);
		line-height: var(--text-4xl--line-height);
		margin: 0;
	}

	.portfolio-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: clamp(2rem, 4vw, 4rem);
	}

	/* Stagger the grid for scattered feel */
	.portfolio-grid > :global(:nth-child(even)) {
		margin-top: clamp(2rem, 4vw, 5rem);
	}

	@media (max-width: 48rem) {
		.portfolio-grid {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.portfolio-grid > :global(:nth-child(even)) {
			margin-top: 0;
		}
	}
</style>
