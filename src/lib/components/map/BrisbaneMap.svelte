<script lang="ts">
	/**
	 * BrisbaneMap — "The Brown Snake" river flow effect
	 *
	 * Bottom: WebGL canvas — tectonic domain-warped shader (adapted from hero evolution)
	 *         Color-shifted to muddy brown river tones, always flowing
	 * Top: PNG map with transparent river channel (morphological-isolated mask)
	 *
	 * Scroll: Zoom into South Brisbane, map dissolves, become the river
	 * Reduced motion: static map with visible river shader
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { initGSAP } from '$lib/utils/gsap';
	import { prefersReducedMotion } from '$lib/utils/motion';

	let { merivaleHovered = false }: { merivaleHovered?: boolean } = $props();

	let containerEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let mapLayerEl: HTMLDivElement | undefined = $state();
	let poiEl: HTMLDivElement | undefined = $state();

	// WebGL state
	let gl: WebGLRenderingContext | null = null;
	let program: WebGLProgram | null = null;
	let rafId = 0;

	// Uniform locations
	let uTimeLoc: WebGLUniformLocation | null = null;
	let uResolutionLoc: WebGLUniformLocation | null = null;
	let uZoomLoc: WebGLUniformLocation | null = null;
	let uWhitenLoc: WebGLUniformLocation | null = null;
	let uScrollLoc: WebGLUniformLocation | null = null;

	// Animation state
	let zoom = 1;
	let whiten = 0; // 0 = full brown river, 1 = filled white
	let scrollFlow = 0; // 0→1 scroll progress driving right-to-left flow during pin
	let startTime = 0;
	let isVisible = true;
	let isClipped = true; // true when clip-path fully hides canvas — skip rendering
	let lastFrameTime = 0;
	const FRAME_INTERVAL = 1000 / 30;

	// GSAP cleanup
	let timeline: gsap.core.Timeline | null = null;
	let poiTween: gsap.core.Tween | null = null;

	// -----------------------------------------------------------------------
	// Shaders — "Brown Snake" tectonic flow (adapted from hero-evolution)
	// -----------------------------------------------------------------------

	const VERT = `
		attribute vec2 aPosition;
		varying vec2 vUv;
		void main() {
			vUv = aPosition * 0.5 + 0.5;
			gl_Position = vec4(aPosition, 0.0, 1.0);
		}
	`;

	const FRAG = `
		#ifdef GL_OES_standard_derivatives
		#extension GL_OES_standard_derivatives : enable
		#endif
		precision mediump float;

		uniform float uTime;
		uniform vec2 uResolution;
		uniform float uZoom;
		uniform float uWhiten;
		uniform float uScroll;

		varying vec2 vUv;

		// --- Simplex Noise (Patricio Gonzalez Vivo) ---
		vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
		vec3 permute(vec3 x) { return mod289v3(((x * 34.0) + 1.0) * x); }

		float snoise(vec2 v) {
			const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
			vec2 i = floor(v + dot(v, C.yy));
			vec2 x0 = v - i + dot(i, C.xx);
			vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			vec4 x12 = x0.xyxy + C.xxzz;
			x12.xy -= i1;
			i = mod289v2(i);
			vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
			vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
			m = m * m; m = m * m;
			vec3 x = 2.0 * fract(p * C.www) - 1.0;
			vec3 h = abs(x) - 0.5;
			vec3 ox = floor(x + 0.5);
			vec3 a0 = x - ox;
			m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
			vec3 g;
			g.x = a0.x * x0.x + h.x * x0.y;
			g.yz = a0.yz * x12.xz + h.yz * x12.yw;
			return 130.0 * dot(m, g);
		}

		float fbm(vec2 st, int octaves) {
			float value = 0.0, amplitude = 0.5, frequency = 1.0, maxVal = 0.0;
			for (int i = 0; i < 6; i++) {
				if (i >= octaves) break;
				value += amplitude * snoise(st * frequency);
				maxVal += amplitude;
				amplitude *= 0.5;
				frequency *= 2.0;
			}
			return value / maxVal;
		}

		void main() {
			vec2 uv = vUv;
			float t = uTime;
			float z = max(uZoom, 1.0);

			float aspect = uResolution.x / uResolution.y;
			vec2 p = vec2(uv.x * aspect, uv.y) * z;

			// === Right-to-left flow — scroll drives, time drifts ===
			float scrollDrive = uScroll * 5.0;
			float timeDrift = t * 0.12;
			p.x -= scrollDrive + timeDrift;
			p.y += timeDrift * 0.04;

			// === IQ Domain Warp ===
			float warpStrength = 1.6;
			float flowT = scrollDrive * 0.6 + timeDrift;

			vec2 q = vec2(
				fbm(p * 1.8 + vec2(0.0, flowT * 3.0), 4),
				fbm(p * 2.1 + vec2(5.2, flowT * 2.5), 4)
			);
			vec2 r = vec2(
				fbm(p * 2.0 + warpStrength * q + vec2(1.7, 9.2 + flowT * 2.0), 4),
				fbm(p * 2.4 + warpStrength * q + vec2(8.3, 2.8 + flowT * 1.6), 4)
			);
			float n = fbm(p * 2.0 + warpStrength * r, 4);

			// === Current detection ===
			#ifdef GL_OES_standard_derivatives
			float currentLines = fwidth(n) * 16.0;
			currentLines = smoothstep(0.02, 0.3, currentLines);
			float totalCurrent = currentLines;
			#else
			float totalCurrent = pow(abs(n), 2.0) * 0.5;
			#endif

			// === Bronze Snake palette (lifted for warmth) ===
			vec3 deepBronze = vec3(0.38, 0.26, 0.12);
			vec3 midBronze  = vec3(0.55, 0.38, 0.18);
			vec3 warmBronze = vec3(0.68, 0.50, 0.28);
			vec3 highlight  = vec3(0.82, 0.64, 0.36);

			float colorShift = n * 0.5 + 0.5;
			vec3 color = mix(deepBronze, midBronze, colorShift);

			float depth = smoothstep(-0.6, 0.6, n);
			color = mix(color, warmBronze, depth * 0.4);

			float currentHighlight = pow(totalCurrent, 1.5) * 0.35;
			color = mix(color, highlight, currentHighlight);
			color -= totalCurrent * 0.03;
			color += pow(totalCurrent, 2.5) * 0.08;

			// === White fill on scroll zoom ===
			color = mix(color, vec3(1.0), uWhiten);

			// Alpha — fades out as white fill completes
			float alpha = mix(0.95, 0.0, uWhiten * uWhiten);

			gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
		}
	`;

	// -----------------------------------------------------------------------
	// WebGL helpers
	// -----------------------------------------------------------------------

	function createShader(glCtx: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
		const shader = glCtx.createShader(type);
		if (!shader) return null;
		glCtx.shaderSource(shader, source);
		glCtx.compileShader(shader);
		if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
			console.error('Shader compile error:', glCtx.getShaderInfoLog(shader));
			glCtx.deleteShader(shader);
			return null;
		}
		return shader;
	}

	function createProgram(glCtx: WebGLRenderingContext, vert: WebGLShader, frag: WebGLShader): WebGLProgram | null {
		const prog = glCtx.createProgram();
		if (!prog) return null;
		glCtx.attachShader(prog, vert);
		glCtx.attachShader(prog, frag);
		glCtx.linkProgram(prog);
		if (!glCtx.getProgramParameter(prog, glCtx.LINK_STATUS)) {
			console.error('Program link error:', glCtx.getProgramInfoLog(prog));
			glCtx.deleteProgram(prog);
			return null;
		}
		return prog;
	}

	// -----------------------------------------------------------------------
	// Render loop — 30fps cap
	// -----------------------------------------------------------------------

	function render(now: number): void {
		rafId = requestAnimationFrame(render);

		// Skip when off-screen OR fully clipped by clip-path
		if (!gl || !program || !isVisible || isClipped) return;

		if (now - lastFrameTime < FRAME_INTERVAL) return;
		lastFrameTime = now;

		const elapsed = (now - startTime) / 1000;

		gl.clear(gl.COLOR_BUFFER_BIT);

		if (uTimeLoc) gl.uniform1f(uTimeLoc, elapsed);
		if (uResolutionLoc) gl.uniform2f(uResolutionLoc, gl.canvas.width, gl.canvas.height);
		if (uZoomLoc) gl.uniform1f(uZoomLoc, zoom);
		if (uWhitenLoc) gl.uniform1f(uWhitenLoc, whiten);
		if (uScrollLoc) gl.uniform1f(uScrollLoc, scrollFlow);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	// -----------------------------------------------------------------------
	// Setup
	// -----------------------------------------------------------------------

	function setupCanvas(): void {
		if (!canvasEl || !containerEl) return;

		const rect = containerEl.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

		canvasEl.width = Math.round(rect.width * dpr);
		canvasEl.height = Math.round(rect.height * dpr);
		canvasEl.style.width = `${rect.width}px`;
		canvasEl.style.height = `${rect.height}px`;
	}

	function initWebGL(): boolean {
		if (!canvasEl) return false;

		gl = canvasEl.getContext('webgl', {
			alpha: true,
			premultipliedAlpha: false,
			antialias: false,
		});

		if (!gl) return false;

		// Enable derivatives for fwidth() current detection
		gl.getExtension('OES_standard_derivatives');

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		const vert = createShader(gl, gl.VERTEX_SHADER, VERT);
		const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
		if (!vert || !frag) return false;

		program = createProgram(gl, vert, frag);
		if (!program) return false;

		uTimeLoc = gl.getUniformLocation(program, 'uTime');
		uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
		uZoomLoc = gl.getUniformLocation(program, 'uZoom');
		uWhitenLoc = gl.getUniformLocation(program, 'uWhiten');
		uScrollLoc = gl.getUniformLocation(program, 'uScroll');

		const positionLoc = gl.getAttribLocation(program, 'aPosition');
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
			gl.STATIC_DRAW
		);
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		// Free shader source memory — no longer needed after link
		gl.detachShader(program, vert);
		gl.detachShader(program, frag);
		gl.deleteShader(vert);
		gl.deleteShader(frag);

		// Set invariant GL state once (not per-frame)
		gl.clearColor(0, 0, 0, 0);
		gl.useProgram(program);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		return true;
	}

	onMount(async () => {
		if (!browser || !canvasEl || !containerEl) return;

		const isReduced = prefersReducedMotion();

		setupCanvas();

		const webglReady = initWebGL();

		if (!webglReady) {
			containerEl.classList.add('fallback');
			return;
		}

		if (isReduced) {
			startTime = performance.now();
			render(performance.now());
			return;
		}

		// Start render loop
		startTime = performance.now();
		rafId = requestAnimationFrame(render);

		// GSAP ScrollTrigger
		const gsap = await initGSAP();
		if (!gsap) return;

		const proxy = { zoom: 1, whiten: 0, scroll: 0, clipP: 0 };
		const parentSection = containerEl.closest('section');

		timeline = gsap.timeline({
			scrollTrigger: {
				trigger: parentSection || containerEl,
				start: 'top top',
				end: '+=200%',
				scrub: 1.5,
				pin: true,
				pinSpacing: true,
				invalidateOnRefresh: true,
			},
		});

		// River flow-through: diagonal NE → SW, enters then exits same direction
		// clipP 0→1: triangle expands from NE to full coverage (enter)
		// clipP 1→2: visible area slides off toward SW (exit)
		// Continuous motion — like floating down the river
		if (canvasEl) {
			canvasEl.style.clipPath = 'polygon(100% 0%, 100% 0%, 100% 0%)';
		}
		timeline.to(
			proxy,
			{
				clipP: 2,
				duration: 0.85,
				ease: 'none',
				onUpdate: () => {
					if (canvasEl) {
						const p = proxy.clipP;
						// Skip rendering when fully clipped (before enter or after exit)
						isClipped = p <= 0.01 || p >= 1.99;
						if (p <= 1) {
							const topX = 100 - 220 * p;
							const rightY = 220 * p;
							canvasEl.style.clipPath = `polygon(${topX}% 0%, 100% 0%, 100% ${rightY}%)`;
						} else {
							const q = p - 1;
							const topY = 220 * q;
							const rightX = 100 - 220 * q;
							canvasEl.style.clipPath = `polygon(-120% ${topY}%, ${rightX}% ${topY}%, ${rightX}% 220%)`;
						}
					}
				},
			},
			0
		);

		// River flow: right-to-left across full scroll duration
		timeline.to(
			proxy,
			{
				scroll: 1,
				duration: 1,
				ease: 'none',
				onUpdate: () => {
					scrollFlow = proxy.scroll;
				},
			},
			0
		);

		// Map blur — same treatment as sizzle reel unhovered state
		// Ramps up as the river flows through, softening the map
		if (mapLayerEl) {
			timeline.to(
				mapLayerEl,
				{
					filter: 'blur(60px) grayscale(1)',
					duration: 0.40,
					ease: 'power2.in',
				},
				0.45
			);
		}

		// Phase 1: Zoom into South Brisbane (0% → 50%)
		timeline.to(
			containerEl,
			{
				scale: 6,
				transformOrigin: '46% 68%',
				duration: 0.50,
				ease: 'power1.in',
			},
			0
		);

		timeline.to(
			proxy,
			{
				zoom: 6,
				duration: 0.50,
				ease: 'power1.in',
				onUpdate: () => {
					zoom = proxy.zoom;
				},
			},
			0
		);

		// Phase 2: River fills white (65% → 95%) — late, so the bronze river breathes
		timeline.to(
			proxy,
			{
				whiten: 1,
				duration: 0.30,
				ease: 'power2.in',
				onUpdate: () => {
					whiten = proxy.whiten;
				},
			},
			0.65
		);

		// Phase 3: Map dissolves (70% → 95%)
		if (mapLayerEl) {
			timeline.to(
				mapLayerEl,
				{
					opacity: 0,
					duration: 0.25,
					ease: 'power2.in',
				},
				0.70
			);
		}

		// Phase 4: Final zoom (60% → 100%)
		timeline.to(
			containerEl,
			{
				scale: 12,
				duration: 0.40,
				ease: 'power2.in',
			},
			0.60
		);

		timeline.to(
			proxy,
			{
				zoom: 12,
				duration: 0.40,
				ease: 'power2.in',
				onUpdate: () => {
					zoom = proxy.zoom;
				},
			},
			0.60
		);

		// Performance: pause render when off-screen
		const io = new IntersectionObserver(
			(entries) => {
				isVisible = entries[0]?.isIntersecting ?? true;
			},
			{ threshold: 0 }
		);
		io.observe(containerEl);

		let resizeTimer = 0;
		const ro = new ResizeObserver(() => {
			cancelAnimationFrame(resizeTimer);
			resizeTimer = requestAnimationFrame(() => {
				setupCanvas();
				if (gl && program) {
					gl.useProgram(program);
					gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
				}
			});
		});
		ro.observe(containerEl);

		(containerEl as any).__mapCleanup = () => {
			io.disconnect();
			ro.disconnect();
		};
	});

	// POI hover effect
	$effect(() => {
		if (!browser || !poiEl) return;

		const runHover = async () => {
			const gsap = await initGSAP();
			if (!gsap || !poiEl) return;

			if (merivaleHovered) {
				if (poiTween) poiTween.kill();
				poiTween = gsap.to(poiEl, {
					scale: 1.6,
					opacity: 1,
					duration: 0.5,
					ease: 'power2.out',
					yoyo: true,
					repeat: -1,
					repeatDelay: 0.15,
				});
			} else {
				if (poiTween) {
					poiTween.kill();
					poiTween = null;
				}
				gsap.to(poiEl, {
					scale: 1,
					opacity: 0.8,
					duration: 0.3,
					ease: 'power2.inOut',
				});
			}
		};

		runHover();
	});

	onDestroy(() => {
		if (!browser) return;
		cancelAnimationFrame(rafId);
		if (timeline) {
			timeline.scrollTrigger?.kill();
			timeline.kill();
			timeline = null;
		}
		if (poiTween) {
			poiTween.kill();
			poiTween = null;
		}
		if (containerEl && (containerEl as any).__mapCleanup) {
			(containerEl as any).__mapCleanup();
		}
		if (gl) {
			if (program) gl.deleteProgram(program);
			gl = null;
		}
	});
</script>

<div class="brisbane-map" bind:this={containerEl}>
	<!-- Layer 1 (bottom): WebGL Brown Snake shader -->
	<canvas
		bind:this={canvasEl}
		class="flow-canvas"
		aria-hidden="true"
	></canvas>

	<!-- Layer 2 (top): Map with transparent river channel -->
	<div bind:this={mapLayerEl} class="map-layer" aria-hidden="true"></div>

	<!-- Merivale Studios POI -->
	<div
		bind:this={poiEl}
		class="poi-marker"
		aria-hidden="true"
	></div>
</div>

<style>
	.brisbane-map {
		position: absolute;
		top: 2%;
		right: -8%;
		width: 55vw;
		max-width: 750px;
		aspect-ratio: 1 / 1;
		z-index: 0;
		pointer-events: none;
		will-change: transform;
		/* Radial fade on CONTAINER — both shader + map fade together */
		mask-image: radial-gradient(
			ellipse 60% 60% at 50% 50%,
			black 0%,
			black 30%,
			transparent 68%
		);
		-webkit-mask-image: radial-gradient(
			ellipse 60% 60% at 50% 50%,
			black 0%,
			black 30%,
			transparent 68%
		);
	}

	/* Bottom layer: WebGL Brown Snake shader */
	.flow-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		will-change: clip-path;
	}

	/* Top layer: map PNG with transparent river — shader shows through the river cutout */
	.map-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
		background-image: url('/images/brisbane-map-river-transparent.png');
		background-size: 120%;
		background-position: 45% 35%;
		background-repeat: no-repeat;
		opacity: 1;
		will-change: filter, opacity;
	}

	.poi-marker {
		position: absolute;
		top: 45%;
		left: 50%;
		width: 8px;
		height: 8px;
		background: var(--color-text);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		opacity: 0;
		pointer-events: none;
		z-index: 2;
		will-change: transform, opacity;
	}

	/* CSS fallback when WebGL is unavailable */
	:global(.brisbane-map.fallback) .flow-canvas {
		display: none;
	}

	:global(.brisbane-map.fallback) .map-layer {
		background-image: url('/images/brisbane-map-bg.webp');
		opacity: 0.15;
	}
</style>
