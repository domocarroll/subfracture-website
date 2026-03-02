<script lang="ts">
	/**
	 * TeamSection - Team grid with CharacterCascade heading
	 *
	 * Cream background. Warmth after dark portfolio immersion.
	 * Minimal animation: CharacterCascade heading + stagger fade-up on cards.
	 * 4-column grid on desktop, 2-column on tablet, single on mobile.
	 */

	import Container from '$lib/components/ui/Container.svelte';
	import CharacterCascade from '$lib/components/scroll/CharacterCascade.svelte';
	import TeamMember from './TeamMember.svelte';
	import { animate } from '$lib/actions/animate';

	// Team data from Subfracture intro PDF
	const team = [
		{ name: 'Warwick Heathwood', role: 'Strategy Director' },
		{ name: 'Maddi Kimbe', role: 'Digital Marketing' },
		{ name: 'Tyronne Curtis', role: 'Innovation Director' },
		{ name: 'Amanda Archer', role: 'Publicity & Partnerships' }
	];
</script>

<section class="team">
	<Container variant="wide">
		<div class="team-header">
			<span class="team-number">03</span>
			<CharacterCascade
				text="The Humans"
				tag="h2"
				class="team-heading"
			/>
		</div>

		<div class="team-grid">
			{#each team as member, i}
				<div
					use:animate={{
						type: 'fromTo',
						fromVars: { opacity: 0, y: 30 },
						opacity: 1,
						y: 0,
						duration: 0.6,
						delay: i * 0.1,
						ease: 'power3.out',
						scrollTrigger: { start: 'top 85%' }
					}}
				>
					<TeamMember
						name={member.name}
						role={member.role}
					/>
				</div>
			{/each}
		</div>
	</Container>
</section>

<style>
	.team {
		padding: clamp(8rem, 10vw, 12rem) 0;
		background-color: var(--color-surface);
	}

	.team-header {
		margin-bottom: clamp(4rem, 6vw, 6rem);
	}

	.team-number {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-primary);
		letter-spacing: var(--letter-spacing-label);
		margin-bottom: 1rem;
	}

	:global(.team-heading) {
		font-family: var(--font-serif);
		font-size: var(--text-4xl);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-4xl--line-height);
		margin: 0;
	}

	.team-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: clamp(1.5rem, 3vw, 3rem);
	}

	@media (max-width: 64rem) {
		.team-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 40rem) {
		.team-grid {
			grid-template-columns: 1fr;
			max-width: 20rem;
		}
	}
</style>
