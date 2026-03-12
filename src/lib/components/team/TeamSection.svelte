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

	// Team data — synced with subfrac.com v1
	const team = [
		{
			name: 'Warwick Heathwood',
			role: 'Strategy Director',
			photo: '/images/team/warwick.png',
			bio: 'Warwick is a strategic leader with over 20 years in brand, creative, and business strategy. He\u2019s shaped growth for global brands, startups, and non-profits, blending commercial acumen with creative instinct. Warwick drives the studio\u2019s vision and leads client engagements, applying deep expertise in communication, experiential marketing, and human-centred design.',
			linkedin: 'https://www.linkedin.com/in/warwick-heathwood-9aa3682a/'
		},
		{
			name: 'Casey Midgley',
			role: 'Design Director',
			photo: '/images/team/casey.png',
			bio: 'Casey is a design-led thinker and founder of Maker Street Studios, with 14 years leading brand and creative work across startups, scaleups and established brands. At Subfracture, Casey shapes the studio\u2019s creative vision and output. He helps brands uncover their unique difference and brings it to life through purposeful identity, digital, and campaign work.',
			linkedin: 'https://www.linkedin.com/in/caseymidgley/'
		},
		{
			name: 'Tyronne Curtis',
			role: 'Technology Director',
			photo: '/images/team/tyronne.png',
			bio: 'Ty Curtis is an XR creator, technologist, and founder of Activate Studios. Since 2012, he has led immersive work for brands including Jimmy Choo, BMW, Lendlease, YouTube Kids and more, blending emerging technology with classic storytelling to create bold, emotional experiences.',
			linkedin: 'https://www.linkedin.com/in/tyronne-curtis-9b6b2525/'
		},
		{
			name: 'Amanda Archer',
			role: 'Publicity & Partnerships',
			photo: '/images/team/amanda.png',
			bio: 'Amanda is a global publicity strategist and founder of First-Class Access Worldwide Collection. Her impressive career spans work with icons including Madonna, Serena Williams, the Hilton sisters, and the Irwin family. A speaker at SXSW and mentee of Randi Zuckerberg, Amanda sits at the intersection of luxury, technology, and culture.',
			linkedin: 'https://www.linkedin.com/in/amanda-archer-6319ba169'
		}
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
</style>
