<script lang="ts">
	/**
	 * ServicePillar - Single numbered service with tagline, description, and bullets
	 *
	 * Vertical stack layout: number, tagline, description, bullet list.
	 * Thin bone divider between pillars (removed on last child via CSS).
	 * No card treatment — editorial numbered stack.
	 *
	 * CSS sets initial opacity: 0 / translateY(24px) for GSAP stagger targeting.
	 * Parent (Services) orchestrates scroll-triggered stagger animation.
	 *
	 * @example
	 * <ServicePillar
	 *   number="01"
	 *   tagline="The foundation everything else sits on."
	 *   description="We define what the world stands for..."
	 *   bullets={['Positioning and value proposition', ...]}
	 * />
	 */

	interface Props {
		/** Service number (e.g., "01", "02") */
		number: string;
		/** Service tagline */
		tagline: string;
		/** Service description paragraph */
		description: string;
		/** List of service capabilities */
		bullets: string[];
	}

	let { number, tagline, description, bullets }: Props = $props();
</script>

<div class="service-pillar">
	<span class="pillar-number">{number}</span>
	<h3 class="pillar-tagline">{tagline}</h3>
	<p class="pillar-description">{description}</p>
	<ul class="pillar-bullets">
		{#each bullets as bullet}
			<li class="pillar-bullet">{bullet}</li>
		{/each}
	</ul>
</div>

<style>
	.service-pillar {
		opacity: 0;
		transform: translateY(24px);
		padding-bottom: 3rem;
		margin-bottom: 3rem;
		border-bottom: 1px solid var(--color-bone);
	}

	.service-pillar:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.pillar-number {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-primary);
		letter-spacing: 0.05em;
	}

	.pillar-tagline {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-2xl--line-height);
		margin: 0.5rem 0 0;
	}

	.pillar-description {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: 400;
		color: var(--color-text-muted);
		line-height: var(--text-base--line-height);
		max-width: 55ch;
		margin: 1rem 0 0;
	}

	.pillar-bullets {
		list-style: none;
		padding: 0;
		margin: 1.5rem 0 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.pillar-bullet {
		font-family: var(--font-sans);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		line-height: 1.6;
		padding-left: 1.25rem;
		position: relative;
	}

	.pillar-bullet::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.55em;
		width: 6px;
		height: 1px;
		background-color: var(--color-primary);
		opacity: 0.6;
	}
</style>
