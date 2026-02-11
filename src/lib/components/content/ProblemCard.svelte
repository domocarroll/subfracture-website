<script lang="ts">
	/**
	 * ProblemCard - Single pain point with confrontational typographic treatment
	 *
	 * Renders a borderless, stark typographic card — no background, no border,
	 * no shadow. Large serif text creates visual weight and confrontational tone.
	 *
	 * Used as reduced-motion fallback in ProblemsSolved static grid.
	 *
	 * @example
	 * <ProblemCard text="Campaign-led thinking with no long-term platform" />
	 */

	interface Props {
		text: string;
	}

	let { text }: Props = $props();
</script>

<div class="problem-card">
	<p class="problem-text">{text}</p>
</div>

<style>
	.problem-card {
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
