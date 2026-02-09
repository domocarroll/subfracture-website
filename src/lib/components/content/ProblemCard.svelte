<script lang="ts">
	/**
	 * ProblemCard - Single pain point with confrontational typographic treatment
	 *
	 * Renders a borderless, stark typographic card — no background, no border,
	 * no shadow. Large serif text creates visual weight and confrontational tone.
	 *
	 * CSS sets initial opacity: 0 / translateY(24px) for GSAP stagger targeting.
	 * Parent (ProblemsSolved) orchestrates scroll-triggered stagger animation.
	 *
	 * @example
	 * <ProblemCard text="Campaign-led thinking with no long-term platform" />
	 */

	interface Props {
		/** Pain point text — rendered exactly as provided, no modification */
		text: string;
	}

	let { text }: Props = $props();
</script>

<div class="problem-card">
	<p class="problem-text">{text}</p>
</div>

<style>
	.problem-card {
		opacity: 0;
		transform: translateY(24px);
		margin-bottom: 2rem;
	}

	.problem-text {
		font-family: var(--font-serif);
		font-size: var(--text-xl);
		font-weight: 400;
		color: var(--color-text);
		line-height: var(--text-xl--line-height);
		margin: 0;
	}
</style>
