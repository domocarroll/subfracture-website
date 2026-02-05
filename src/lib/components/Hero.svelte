<script lang="ts">
	import VitruvianFigure from '$lib/assets/VitruvianFigure.svelte';
	import SacredGeometry from '$lib/assets/SacredGeometry.svelte';

	// Brisbane map image path
	const mapSrc = '/brisbane-map.png';
</script>

<section class="hero">
	<div class="hero-layers">
		<!-- Layer 1: Brisbane Map -->
		<div class="layer layer-map">
			<img
				src={mapSrc}
				alt="Brisbane city map"
				class="map-image"
			/>
		</div>

		<!-- Layer 2: Sacred Geometry -->
		<div class="layer layer-geometry">
			<SacredGeometry class="geometry-svg" strokeColor="#c55a3d" strokeWidth={1} />
		</div>

		<!-- Layer 3: Vitruvian Figure -->
		<div class="layer layer-figure">
			<VitruvianFigure class="figure-svg" strokeColor="#1a1a1a" strokeWidth={1.2} />
		</div>

		<!-- Layer 4: Typography -->
		<div class="layer layer-text">
			<div class="text-content">
				<h1 class="headline">Culture Studio</h1>
				<p class="subhead">For brands that outgrow campaigns</p>

				<!-- Annotation-style location -->
				<div class="annotation">
					<span class="annotation-line"></span>
					<span class="annotation-text">Brisbane, AUS — 27.4690° S</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		width: 100%;
		height: 100vh;
		min-height: 600px;
		background-color: #f5f0e8;
		overflow: hidden;
	}

	.hero-layers {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Map layer */
	.layer-map {
		opacity: 0.35;
	}

	.map-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}

	/* Geometry layer */
	.layer-geometry {
		z-index: 1;
	}

	:global(.geometry-svg) {
		width: min(80vh, 80vw);
		height: min(80vh, 80vw);
		max-width: 600px;
		max-height: 600px;
	}

	/* Figure layer */
	.layer-figure {
		z-index: 2;
	}

	:global(.figure-svg) {
		width: min(70vh, 70vw);
		height: min(70vh, 70vw);
		max-width: 520px;
		max-height: 520px;
	}

	/* Text layer */
	.layer-text {
		z-index: 3;
		pointer-events: none;
	}

	.text-content {
		position: absolute;
		bottom: 12%;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		pointer-events: auto;
	}

	.headline {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(2.5rem, 8vw, 5rem);
		font-weight: 400;
		color: #c55a3d;
		letter-spacing: 0.02em;
		margin: 0 0 0.5rem 0;
		line-height: 1.1;
	}

	.subhead {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: clamp(1rem, 2.5vw, 1.25rem);
		font-weight: 400;
		font-style: italic;
		color: #1a1a1a;
		opacity: 0.8;
		margin: 0;
		letter-spacing: 0.04em;
	}

	.annotation {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-top: 2rem;
		opacity: 0.6;
	}

	.annotation-line {
		width: 40px;
		height: 1px;
		background-color: #c55a3d;
	}

	.annotation-text {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 0.75rem;
		color: #1a1a1a;
		letter-spacing: 0.15em;
		text-transform: uppercase;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.text-content {
			bottom: 8%;
			width: 90%;
		}

		:global(.geometry-svg),
		:global(.figure-svg) {
			max-width: 90vw;
			max-height: 90vw;
		}
	}
</style>
