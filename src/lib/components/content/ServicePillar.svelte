<script lang="ts">
	/**
	 * ServicePillar - Single service slide for pinned scroll-through
	 *
	 * Absolute-positioned within the pinned viewport. Features:
	 * - Ghost watermark number (large, behind content)
	 * - Word-split tagline for font-weight 400→700 animation
	 * - Description paragraph and bullet list
	 *
	 * All elements start opacity:0 — parent Services timeline controls animation.
	 * When `static` prop is true, renders as visible static block (reduced motion).
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
		/** Render as static visible block (reduced motion) */
		static?: boolean;
	}

	let {
		number,
		tagline,
		description,
		bullets,
		static: isStatic = false
	}: Props = $props();

	let taglineWords = $derived(tagline.split(/\s+/).filter(Boolean));
</script>

<div class="service-pillar" class:service-pillar--static={isStatic}>
	<!-- Ghost watermark number -->
	<span class="pillar-ghost">{number}</span>

	<!-- Content layer (above ghost) -->
	<div class="pillar-content">
		<span class="pillar-number">{number}</span>

		<h3 class="pillar-tagline">
			{#each taglineWords as word, i}
				<span class="tagline-word">{word}</span>{#if i < taglineWords.length - 1}{' '}{/if}
			{/each}
		</h3>

		<p class="pillar-description">{description}</p>

		<ul class="pillar-bullets">
			{#each bullets as bullet}
				<li class="pillar-bullet">{bullet}</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.service-pillar {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
	}

	/* Static mode: visible, flows in document */
	.service-pillar--static {
		position: relative;
		height: auto;
		opacity: 1;
		padding-bottom: 4rem;
		margin-bottom: 2rem;
	}

	/* Ghost watermark number */
	.pillar-ghost {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: clamp(10rem, 18vw, 25rem);
		color: var(--color-bone);
		opacity: 0;
		line-height: 1;
		user-select: none;
		pointer-events: none;
		z-index: 0;
	}

	.service-pillar--static .pillar-ghost {
		opacity: 0.06;
	}

	/* Content above ghost */
	.pillar-content {
		position: relative;
		z-index: 1;
		width: 100%;
		max-width: var(--content-max);
		margin-inline: auto;
		padding-inline: 1rem;
	}

	@media (min-width: 40rem) {
		.pillar-content {
			padding-inline: 1.5rem;
		}
	}

	@media (min-width: 64rem) {
		.pillar-content {
			padding-inline: 2rem;
		}
	}

	/* Small terracotta number */
	.pillar-number {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-primary);
		letter-spacing: 0.05em;
		opacity: 0;
	}

	.service-pillar--static .pillar-number {
		opacity: 1;
	}

	/* Tagline with word splitting */
	.pillar-tagline {
		font-family: var(--font-serif);
		font-size: var(--text-2xl);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-2xl--line-height);
		margin: 0.5rem 0 0;
	}

	@media (min-width: 48rem) {
		.pillar-tagline {
			font-size: var(--text-3xl);
			line-height: var(--text-3xl--line-height);
		}
	}

	.tagline-word {
		display: inline;
		opacity: 0;
		font-weight: 400;
	}

	.service-pillar--static .tagline-word {
		opacity: 1;
		font-weight: 700;
	}

	/* Description */
	.pillar-description {
		font-family: var(--font-sans);
		font-size: var(--text-base);
		font-weight: 400;
		color: var(--color-text-muted);
		line-height: var(--text-base--line-height);
		max-width: 55ch;
		margin: 1.5rem 0 0;
		opacity: 0;
	}

	.service-pillar--static .pillar-description {
		opacity: 1;
	}

	/* Bullets */
	.pillar-bullets {
		list-style: none;
		padding: 0;
		margin: 2rem 0 0;
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
		opacity: 0;
	}

	.service-pillar--static .pillar-bullet {
		opacity: 1;
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

	/* Reduced motion fallback */
	@media (prefers-reduced-motion: reduce) {
		.tagline-word,
		.pillar-number,
		.pillar-description,
		.pillar-bullet {
			opacity: 1 !important;
		}

		.tagline-word {
			font-weight: 700 !important;
		}

		.pillar-ghost {
			opacity: 0.06 !important;
		}
	}
</style>
