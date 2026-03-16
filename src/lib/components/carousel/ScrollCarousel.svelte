<script lang="ts">
	/**
	 * ScrollCarousel - 3D fold-behind carousel with scroll-driven springs
	 *
	 * Three interaction modes:
	 * - Scroll: vertical scroll drives card transitions via sticky viewport
	 * - Drag: pointer drag with momentum and snap-to-nearest (desktop only)
	 * - Keyboard: ArrowLeft/Right cycles cards
	 *
	 * Three-phase scroll model:
	 * 1. Dead zone — card sits at center, no tension
	 * 2. Tension — rubber-band resistance builds toward next card
	 * 3. Snap — decisive pop to next card with snappy spring
	 *
	 * Uses Svelte 5 Spring class for physics-based animation.
	 */

	import { Spring } from 'svelte/motion';
	import { browser } from '$app/environment';
	import { getCardTransform, rubberBand } from './transforms';
	import type { Snippet } from 'svelte';

	interface CarouselItem {
		text: string;
	}

	interface Props {
		items: CarouselItem[];
		card: Snippet<[{ item: CarouselItem; index: number }]>;
	}

	let { items, card }: Props = $props();

	let TOTAL = $derived(items.length);

	// Card sizing — measured from container, with fallbacks
	let containerEl: HTMLDivElement | undefined = $state(undefined);
	let trackEl: HTMLDivElement | undefined = $state(undefined);
	let scrollSectionEl: HTMLDivElement | undefined = $state(undefined);

	let cardWidth = $state(380);
	const CARD_GAP = 32;
	let cardStep = $derived(cardWidth + CARD_GAP);

	// Measure card size from container width
	$effect(() => {
		if (!browser || !containerEl) return;

		function measure() {
			const w = window.innerWidth;
			if (w < 480) {
				cardWidth = 280;
			} else if (w < 768) {
				cardWidth = 340;
			} else {
				cardWidth = 380;
			}
		}

		measure();

		window.addEventListener('resize', measure, { passive: true });
		return () => window.removeEventListener('resize', measure);
	});

	// ---------------------------------------------------------------------------
	// Spring state
	// ---------------------------------------------------------------------------

	let isDragging = $state(false);
	let dragStartX = $state(0);
	let dragStartOffset = $state(0);
	let pointerVelocity = $state(0);
	let lastPointerX = $state(0);
	let lastPointerTime = $state(0);

	const offset = new Spring(0, {
		stiffness: 0.12,
		damping: 0.74,
		precision: 0.5
	});

	// Dual spring configs
	const SPRING_TENSION = { stiffness: 0.06, damping: 0.88 };
	const SPRING_SNAP = { stiffness: 0.15, damping: 0.68 };
	const SPRING_DEFAULT = { stiffness: 0.12, damping: 0.74 };

	function setSpringConfig(config: { stiffness: number; damping: number }) {
		offset.stiffness = config.stiffness;
		offset.damping = config.damping;
	}

	// ---------------------------------------------------------------------------
	// Derived
	// ---------------------------------------------------------------------------

	let activeIndex = $derived.by(() => {
		const raw = -offset.current / cardStep;
		return ((Math.round(raw) % TOTAL) + TOTAL) % TOTAL;
	});

	// ---------------------------------------------------------------------------
	// Pointer drag (desktop only)
	// ---------------------------------------------------------------------------

	let isDesktop = $state(true);

	$effect(() => {
		if (!browser) return;

		function checkDesktop() {
			isDesktop = window.innerWidth >= 768;
		}

		checkDesktop();
		window.addEventListener('resize', checkDesktop, { passive: true });
		return () => window.removeEventListener('resize', checkDesktop);
	});

	function onPointerDown(e: PointerEvent) {
		if (e.button !== 0 || !isDesktop) return;

		isDragging = true;
		dragStartX = e.clientX;
		dragStartOffset = offset.current;
		pointerVelocity = 0;
		lastPointerX = e.clientX;
		lastPointerTime = performance.now();

		offset.set(offset.current, { instant: true });

		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;

		const now = performance.now();
		const dt = now - lastPointerTime;
		const dx = e.clientX - lastPointerX;

		if (dt > 0) {
			pointerVelocity = pointerVelocity * 0.4 + (dx / dt) * 0.6;
		}

		lastPointerX = e.clientX;
		lastPointerTime = now;

		const totalDragDelta = e.clientX - dragStartX;
		const newOffset = dragStartOffset + totalDragDelta;

		offset.set(newOffset, { instant: true });
	}

	function onPointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;

		(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);

		const momentumDistance = pointerVelocity * 200;
		const projectedOffset = offset.current + momentumDistance;

		setSpringConfig(SPRING_DEFAULT);
		const targetIndex = Math.round(-projectedOffset / cardStep);
		const snapOffset = -targetIndex * cardStep;

		offset.set(snapOffset);
	}

	function onPointerCancel(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;

		const currentIndex = Math.round(-offset.current / cardStep);
		offset.set(-currentIndex * cardStep);
	}

	// ---------------------------------------------------------------------------
	// Keyboard navigation
	// ---------------------------------------------------------------------------

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			setSpringConfig(SPRING_DEFAULT);
			const currentIndex = Math.round(-offset.current / cardStep);
			offset.set(-(currentIndex - 1) * cardStep);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			setSpringConfig(SPRING_DEFAULT);
			const currentIndex = Math.round(-offset.current / cardStep);
			offset.set(-(currentIndex + 1) * cardStep);
		}
	}

	// ---------------------------------------------------------------------------
	// Dot navigation
	// ---------------------------------------------------------------------------

	function goToCard(index: number) {
		setSpringConfig(SPRING_DEFAULT);
		const currentIndex = Math.round(-offset.current / cardStep);
		const currentMod = ((currentIndex % TOTAL) + TOTAL) % TOTAL;

		let diff = index - currentMod;
		if (diff > TOTAL / 2) diff -= TOTAL;
		if (diff < -TOTAL / 2) diff += TOTAL;

		const targetIndex = currentIndex + diff;
		offset.set(-targetIndex * cardStep);
	}

	// ---------------------------------------------------------------------------
	// Scroll-linked driving
	// ---------------------------------------------------------------------------

	let lastScrollCardIndex = $state(0);
	let lastRawIndex = $state(0);
	let scrollVelocity = $state(0);

	const SNAP_THRESHOLD = 0.35;
	const SNAP_THRESHOLD_FAST = 0.22;
	const TENSION_AMOUNT = 0.35;
	const DEAD_ZONE = 0.08;

	$effect(() => {
		if (!browser || !scrollSectionEl) return;

		let ticking = false;

		function onScroll() {
			if (ticking || isDragging) return;
			ticking = true;

			requestAnimationFrame(() => {
				if (!scrollSectionEl) {
					ticking = false;
					return;
				}

				const rect = scrollSectionEl.getBoundingClientRect();
				const viewportHeight = window.innerHeight;
				const inSection = rect.top <= 0 && rect.bottom >= viewportHeight;

				if (!inSection || isDragging) {
					ticking = false;
					return;
				}

					const scrollRange = scrollSectionEl.offsetHeight - viewportHeight;
				const scrolled = Math.max(0, Math.min(1, -rect.top / scrollRange));
				const rawIndex = scrolled * (TOTAL - 1);
				const baseIndex = Math.floor(rawIndex);
				const fraction = rawIndex - baseIndex;

				scrollVelocity = scrollVelocity * 0.3 + Math.abs(rawIndex - lastRawIndex) * 0.7;
				lastRawIndex = rawIndex;

				const threshold = scrollVelocity > 0.08 ? SNAP_THRESHOLD_FAST : SNAP_THRESHOLD;

				const snappedIndex = fraction >= threshold ? baseIndex + 1 : baseIndex;

				if (snappedIndex !== lastScrollCardIndex) {
					setSpringConfig(SPRING_SNAP);
					lastScrollCardIndex = snappedIndex;
					offset.set(-snappedIndex * cardStep);
				} else {
					if (fraction < DEAD_ZONE || fraction > 1 - DEAD_ZONE) {
						const nearestIndex = Math.round(rawIndex);
						offset.set(-nearestIndex * cardStep);
					} else if (fraction < threshold) {
						setSpringConfig(SPRING_TENSION);

						const activeFraction = (fraction - DEAD_ZONE) / (threshold - DEAD_ZONE);
						const clamped = Math.max(0, Math.min(1, activeFraction));
						const eased = rubberBand(clamped) * TENSION_AMOUNT;

						const tensionTarget = -(baseIndex + eased) * cardStep;
						offset.set(tensionTarget);
					} else {
						offset.set(-lastScrollCardIndex * cardStep);
					}
				}

				ticking = false;
			});
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<!-- Tall scroll container for scroll-linked driving -->
<div class="scroll-section" bind:this={scrollSectionEl}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="carousel-viewport"
		bind:this={containerEl}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerCancel}
		onkeydown={onKeyDown}
		role="region"
		aria-roledescription="carousel"
		aria-label="Problems we help solve"
		tabindex="0"
		class:is-dragging={isDragging}
		style:touch-action={isDesktop ? 'none' : 'pan-y'}
	>
		<!-- Cards track -->
		<div
			class="carousel-track"
			bind:this={trackEl}
			style:width="{cardWidth}px"
			style:height="{cardWidth * 0.75}px"
		>
			{#each items as item, i}
				{@const t = getCardTransform(i, offset.current, cardStep, TOTAL)}
				<div
					class="carousel-card-wrapper"
					class:is-active={t.isActive}
					style:transform="translate3d({t.x}px, 0, {t.translateZ}px) rotateY({t.rotateY}deg) scale({t.scale})"
					style:transform-origin={t.transformOrigin}
					style:opacity={t.opacity}
					style:filter="blur({t.blur}px)"
					style:z-index={t.zIndex}
					style:width="{cardWidth}px"
					style:height="{cardWidth * 0.75}px"
					role="group"
					aria-roledescription="slide"
					aria-label={item.text}
				>
					{@render card({ item, index: i })}
				</div>
			{/each}
		</div>

		<!-- Dot navigation -->
		<nav class="carousel-dots" aria-label="Carousel navigation">
			{#each items as _, i}
				<button
					class="carousel-dot"
					class:is-active={activeIndex === i}
					onclick={() => goToCard(i)}
					aria-label="Go to problem {i + 1}"
					aria-current={activeIndex === i ? 'true' : undefined}
				>
					<span class="dot-fill"></span>
				</button>
			{/each}
		</nav>

		<!-- Scroll hint -->
		<span class="scroll-hint">Scroll to explore</span>
	</div>
</div>

<style>
	.scroll-section {
		position: relative;
		height: 300vh;
	}

	.carousel-viewport {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		background: var(--color-surface);
		overflow: hidden;
		user-select: none;
		outline: none;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}

	.carousel-viewport:focus-visible {
		box-shadow: inset 0 0 0 2px var(--color-text);
	}

	.carousel-viewport.is-dragging {
		cursor: grabbing;
	}

	/* Desktop only: show grab cursor */
	@media (min-width: 48rem) {
		.carousel-viewport:not(.is-dragging) {
			cursor: grab;
		}
	}

	.carousel-track {
		position: relative;
		flex-shrink: 0;
		perspective: 800px;
	}

	.carousel-card-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		will-change: transform, opacity, filter;
		pointer-events: none;

		transition:
			opacity 150ms ease-out,
			filter 150ms ease-out;
	}

	.carousel-card-wrapper.is-active {
		pointer-events: auto;
	}

	/* Dot navigation */
	.carousel-dots {
		display: flex;
		gap: 12px;
		justify-content: center;
	}

	.carousel-dot {
		position: relative;
		width: 44px;
		min-height: 44px;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
	}

	.carousel-dot:focus-visible {
		outline: 2px solid var(--color-text);
		outline-offset: 4px;
		border-radius: 2px;
	}

	.dot-fill {
		display: block;
		width: 100%;
		height: 3px;
		border-radius: 2px;
		background: var(--color-bone);
		transition:
			background 400ms ease-out,
			transform 400ms ease-out;
	}

	.carousel-dot.is-active .dot-fill {
		background: var(--color-text);
		transform: scaleX(1.3);
	}

	.carousel-dot:hover .dot-fill {
		background: var(--color-text-muted);
	}

	.carousel-dot.is-active:hover .dot-fill {
		background: var(--color-text);
	}

	/* Scroll hint */
	.scroll-hint {
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-text-muted);
		opacity: 0.4;
	}

	@media (max-width: 47.99rem) {
		.scroll-hint {
			display: none;
		}
	}
</style>
