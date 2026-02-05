<script lang="ts">
	interface Props {
		class?: string;
		strokeColor?: string;
		strokeWidth?: number;
	}

	let {
		class: className = '',
		strokeColor = '#c55a3d',
		strokeWidth = 1
	}: Props = $props();
</script>

<svg
	viewBox="0 0 400 400"
	class={className}
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<g stroke={strokeColor} stroke-width={strokeWidth}>
		<!-- Circle - centered on navel area, passes through fingertips -->
		<circle cx="200" cy="195" r="175" />

		<!-- Square - base at feet, top at head crown -->
		<rect x="32" y="40" width="336" height="336" />

		<!-- Subtle cross lines for alignment -->
		<line x1="200" y1="40" x2="200" y2="376" stroke-dasharray="4 8" opacity="0.3" />
		<line x1="32" y1="195" x2="368" y2="195" stroke-dasharray="4 8" opacity="0.3" />

		<!-- Golden ratio spiral hint - very subtle -->
		<path
			d="M200 195
			   Q200 120 275 120
			   Q350 120 350 195
			   Q350 300 230 300
			   Q150 300 150 220"
			stroke-dasharray="2 6"
			opacity="0.2"
		/>
	</g>
</svg>
