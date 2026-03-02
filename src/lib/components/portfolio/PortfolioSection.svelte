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

	import { projects } from '$lib/data/projects';
	import { animate } from '$lib/actions/animate';
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
				{#each projects as project, i}
					<div
						use:animate={{
							type: 'fromTo',
							fromVars: { opacity: 0, y: 40 },
							opacity: 1,
							y: 0,
							duration: 0.7,
							delay: i * 0.08,
							ease: 'power3.out',
							scrollTrigger: { start: 'top 85%' }
						}}
					>
						<PortfolioCard
							title={project.title}
							outcome={project.outcome}
							category={project.category}
							rotation={project.rotation}
							href="/work/{project.slug}"
						/>
					</div>
				{/each}
			</div>
		</Container>
	</section>
</PortfolioReveal>

<style>
	.portfolio {
		background-color: var(--color-text);
		color: var(--color-surface);
		padding: clamp(8rem, 10vw, 12rem) 0;
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
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-primary);
		letter-spacing: var(--letter-spacing-label);
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
