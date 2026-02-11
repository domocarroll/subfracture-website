<script lang="ts">
	/**
	 * SectionDivider - SVG transition between page sections
	 *
	 * Two variants:
	 * - "organic": Gentle wave/curve for warm transitions (e.g., cream → cream)
	 * - "fracture": Jagged/cracked edge for dramatic transitions (e.g., cream → dark)
	 *
	 * SVG uses preserveAspectRatio="none" to stretch full-width at any viewport.
	 * Colors are passed as props to handle any section-to-section transition.
	 * No animation — these are static visual bridges.
	 */

	interface Props {
		/** Divider shape variant */
		variant?: 'organic' | 'fracture';
		/** Color of the section above */
		colorFrom?: string;
		/** Color of the section below */
		colorTo?: string;
		/** Height of the divider in px */
		height?: number;
		/** Flip vertically */
		flip?: boolean;
		/** Additional CSS class */
		class?: string;
	}

	let {
		variant = 'organic',
		colorFrom = 'var(--color-surface-warm)',
		colorTo = 'var(--color-surface)',
		height = 80,
		flip = false,
		class: className = ''
	}: Props = $props();
</script>

<div
	class="divider {className}"
	class:divider--flip={flip}
	style="height: {height}px; background-color: {colorTo};"
	aria-hidden="true"
>
	<svg
		viewBox="0 0 1440 {height}"
		preserveAspectRatio="none"
		xmlns="http://www.w3.org/2000/svg"
		style="display: block; width: 100%; height: 100%;"
	>
		{#if variant === 'organic'}
			<!-- Gentle wave curve -->
			<path
				d="M0,0 L0,{height * 0.4}
				   C360,{height * 0.9} 720,{height * 0.1} 1080,{height * 0.6}
				   C1260,{height * 0.8} 1380,{height * 0.3} 1440,{height * 0.5}
				   L1440,0 Z"
				fill={colorFrom}
			/>
		{:else}
			<!-- Jagged fracture edge -->
			<path
				d="M0,0 L0,{height * 0.45}
				   L120,{height * 0.35}
				   L200,{height * 0.6}
				   L340,{height * 0.25}
				   L420,{height * 0.55}
				   L520,{height * 0.3}
				   L620,{height * 0.7}
				   L720,{height * 0.2}
				   L840,{height * 0.65}
				   L920,{height * 0.35}
				   L1020,{height * 0.55}
				   L1120,{height * 0.15}
				   L1220,{height * 0.5}
				   L1320,{height * 0.3}
				   L1440,{height * 0.45}
				   L1440,0 Z"
				fill={colorFrom}
			/>
		{/if}
	</svg>
</div>

<style>
	.divider {
		width: 100%;
		overflow: hidden;
		line-height: 0;
		position: relative;
	}

	.divider--flip {
		transform: scaleY(-1);
	}
</style>
