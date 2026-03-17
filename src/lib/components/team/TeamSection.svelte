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
	import { team, alumni } from '$lib/data/team';
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
						fromVars: { opacity: 0, y: 20 },
						opacity: 1,
						y: 0,
						duration: 0.5,
						delay: i * 0.08,
						ease: 'power3.out',
						scrollTrigger: { start: 'top 85%' }
					}}
				>
					<TeamMember
						name={member.name}
						role={member.role}
						photo={member.photo}
						bio={member.bio}
						linkedin={member.linkedin}
					/>
				</div>
			{/each}
		</div>

		<!-- Alumni ghost — easter egg -->
		{#each alumni as ghost, i}
			<a
				href={ghost.easterEgg || '#'}
				class="alumni-ghost"
				use:animate={{
					type: 'fromTo',
					fromVars: { opacity: 0 },
					opacity: 1,
					duration: 0.8,
					delay: (team.length + i) * 0.08 + 0.5,
					ease: 'power3.out',
					scrollTrigger: { start: 'top 70%' }
				}}
			>
				<div class="alumni-photo">
					<img src={ghost.photo} alt={ghost.name} loading="lazy" />
				</div>
				<span class="alumni-label">
					{ghost.name}
					<span class="alumni-role">{ghost.role}</span>
				</span>
			</a>
		{/each}
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
		color: var(--color-text-muted);
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

	/* Alumni ghost — faded, small, bottom-right */
	.alumni-ghost {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-top: clamp(3rem, 5vw, 5rem);
		text-decoration: none;
		opacity: 0.25;
		transition: opacity 0.4s ease;
	}

	.alumni-ghost:hover {
		opacity: 0.6;
	}

	.alumni-photo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		overflow: hidden;
		filter: grayscale(1);
		transition: filter 0.4s ease;
	}

	.alumni-ghost:hover .alumni-photo {
		filter: grayscale(0);
	}

	.alumni-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.alumni-label {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.alumni-role {
		font-size: 0.65rem;
		opacity: 0.6;
		font-style: italic;
	}
</style>
