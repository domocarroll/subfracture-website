<script lang="ts">
	interface Props {
		animate?: boolean;
		class?: string;
	}

	let { animate = false, class: className = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 120 280"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	class={`hero-rose ${className}`}
	class:animating={animate}
>
	<!-- Stem -->
	<path
		d="M 60 270 Q 55 220 60 180 Q 65 140 58 100 Q 55 60 60 20"
		stroke="#10b894"
		stroke-width="3"
		stroke-linecap="round"
		class="stem"
	/>

	<!-- Leaf 1 (left side, lower) -->
	<g class="leaf leaf-1">
		<path
			d="M 58 180 Q 35 185 25 195 Q 30 185 58 180"
			fill="#10b894"
			stroke="#10b894"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
	</g>

	<!-- Leaf 2 (right side, middle) -->
	<g class="leaf leaf-2">
		<path
			d="M 60 120 Q 85 115 95 105 Q 90 115 60 120"
			fill="#10b894"
			stroke="#10b894"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
	</g>

	<!-- Leaf 3 (left side, upper) -->
	<g class="leaf leaf-3">
		<path
			d="M 58 70 Q 40 68 30 62 Q 35 68 58 70"
			fill="#10b894"
			stroke="#10b894"
			stroke-width="1.5"
			stroke-linejoin="round"
		/>
	</g>

	<!-- Bloom petals (5 overlapping petals) -->
	<g class="bloom">
		<!-- Petal 1 (back left) -->
		<path
			d="M 60 20 Q 40 15 35 5 Q 40 10 50 15 Q 55 18 60 20"
			fill="#e02680"
			stroke="#e02680"
			stroke-width="2"
			class="petal petal-1"
		/>

		<!-- Petal 2 (back right) -->
		<path
			d="M 60 20 Q 80 15 85 5 Q 80 10 70 15 Q 65 18 60 20"
			fill="#4759e5"
			stroke="#4759e5"
			stroke-width="2"
			class="petal petal-2"
		/>

		<!-- Petal 3 (left side) -->
		<path
			d="M 60 20 Q 45 25 38 35 Q 42 28 52 22 Q 56 20 60 20"
			fill="#f5b31a"
			stroke="#f5b31a"
			stroke-width="2"
			class="petal petal-3"
		/>

		<!-- Petal 4 (right side) -->
		<path
			d="M 60 20 Q 75 25 82 35 Q 78 28 68 22 Q 64 20 60 20"
			fill="#e02680"
			stroke="#e02680"
			stroke-width="2"
			class="petal petal-4"
		/>

		<!-- Petal 5 (front center) -->
		<path
			d="M 60 20 Q 55 30 50 40 Q 60 35 70 40 Q 65 30 60 20"
			fill="#4759e5"
			stroke="#4759e5"
			stroke-width="2"
			class="petal petal-5"
		/>

		<!-- Center circle -->
		<circle cx="60" cy="22" r="4" fill="#f5b31a" class="center" />
	</g>
</svg>

<style>
	.hero-rose {
		width: 100%;
		height: 100%;
	}

	/* Stem setup */
	.stem {
		stroke-dasharray: 280;
		stroke-dashoffset: 280;
	}

	/* Leaves setup */
	.leaf {
		opacity: 0;
		transform-origin: right center;
	}

	.leaf path {
		stroke-dasharray: 60;
		stroke-dashoffset: 60;
	}

	/* Petals setup */
	.petal {
		stroke-dasharray: 80;
		stroke-dashoffset: 80;
		opacity: 0;
		transform-origin: 60px 20px;
	}

	.center {
		opacity: 0;
		transform-origin: 60px 22px;
	}

	/* Animations */
	.animating .stem {
		animation: drawStem 1.5s ease-out forwards;
	}

	.animating .leaf-1 {
		animation: unfurlLeaf 0.6s ease-out 1.0s forwards;
	}

	.animating .leaf-2 {
		animation: unfurlLeaf 0.6s ease-out 1.15s forwards;
	}

	.animating .leaf-3 {
		animation: unfurlLeaf 0.6s ease-out 1.3s forwards;
	}

	.animating .petal-1 {
		animation: bloomPetal 0.8s ease-out 1.2s forwards;
	}

	.animating .petal-2 {
		animation: bloomPetal 0.8s ease-out 1.35s forwards;
	}

	.animating .petal-3 {
		animation: bloomPetal 0.8s ease-out 1.5s forwards;
	}

	.animating .petal-4 {
		animation: bloomPetal 0.8s ease-out 1.65s forwards;
	}

	.animating .petal-5 {
		animation: bloomPetal 0.8s ease-out 1.8s forwards;
	}

	.animating .center {
		animation: fadeInScale 0.4s ease-out 2.0s forwards;
	}

	@keyframes drawStem {
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes unfurlLeaf {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		60% {
			opacity: 1;
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes bloomPetal {
		0% {
			stroke-dashoffset: 80;
			opacity: 0;
			transform: scale(0.3);
		}
		50% {
			opacity: 0.8;
		}
		100% {
			stroke-dashoffset: 0;
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes fadeInScale {
		0% {
			opacity: 0;
			transform: scale(0);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
