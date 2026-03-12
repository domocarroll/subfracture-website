<script lang="ts">
	/**
	 * SectionHeading - Editorial section header with numbered label
	 *
	 * Follows the Pattern 4 from RESEARCH.md: section numbers with consistent styling.
	 * Number appears in terracotta, slightly raised like superscript.
	 *
	 * @example
	 * <SectionHeading number="01" title="Typography" />
	 * <SectionHeading number="02" title="Our Process" level="h3" />
	 * <SectionHeading number="04" title="Contact" variant="light" />
	 */

	interface Props {
		/** Section number ("01", "02", etc.) */
		number: string;
		/** Heading text */
		title: string;
		/** Semantic heading level (default 'h2') */
		level?: 'h1' | 'h2' | 'h3';
		/** Color variant: 'default' (dark text) or 'light' (light text on dark bg) */
		variant?: 'default' | 'light';
	}

	let { number, title, level = 'h2', variant = 'default' }: Props = $props();
</script>

<div class="section-heading" class:section-heading--light={variant === 'light'}>
	<span class="section-number">{number}</span>
	{#if level === 'h1'}
		<h1 class="section-title">{title}</h1>
	{:else if level === 'h3'}
		<h3 class="section-title">{title}</h3>
	{:else}
		<h2 class="section-title">{title}</h2>
	{/if}
</div>

<style>
	.section-heading {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
	}

	.section-number {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-text-muted);
		position: relative;
		top: -0.2em;
		letter-spacing: 0.05em;
	}

	.section-title {
		font-family: var(--font-serif);
		color: var(--color-text);
		margin: 0;
		font-weight: 400;
	}

	/* Size adjustments based on semantic level */
	h1.section-title {
		font-size: var(--text-4xl);
		line-height: var(--text-4xl--line-height);
	}

	h2.section-title {
		font-size: var(--text-3xl);
		line-height: var(--text-3xl--line-height);
	}

	h3.section-title {
		font-size: var(--text-2xl);
		line-height: var(--text-2xl--line-height);
	}

	/* Light variant for dark backgrounds */
	.section-heading--light .section-title {
		color: var(--color-surface);
	}
</style>
