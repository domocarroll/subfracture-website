<script lang="ts">
	/**
	 * Services - Pinned scroll-through with animated typography
	 *
	 * 600vh scroll spacer with 100vh pinned viewport. Each of 6 service pillars
	 * reveals sequentially via a single GSAP master timeline:
	 * - Ghost watermark number scales in
	 * - Tagline words thicken (font-weight 400→700) word-by-word
	 * - Description and bullets cascade in
	 * - Cross-fade to next pillar (15% overlap)
	 *
	 * "What we build" label stays pinned throughout as persistent wayfinding.
	 * Last pillar (06) holds for extended scroll before natural unpin.
	 *
	 * Reduced motion: static vertical stack with all content visible.
	 * Section ID: "services" (matches nav link #services)
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { prefersReducedMotion } from '$lib/utils/motion';

	import ServicePillar from './ServicePillar.svelte';
	import ServiceProgress from './ServiceProgress.svelte';
	import { services } from '$lib/data/services';

	let outerEl: HTMLElement | undefined = $state();
	let pinnedEl: HTMLElement | undefined = $state();
	let reducedMotion = $state(false);
	let activePillar = $state(0);
	let showProgress = $state(false);

	let timeline: gsap.core.Timeline | null = null;
	let scrollTriggerInstance: ScrollTrigger | null = null;

	onMount(() => {
		reducedMotion = prefersReducedMotion();
		if (!browser || !outerEl || !pinnedEl || reducedMotion) return;

		const init = async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');
			gsap.registerPlugin(ScrollTrigger);

			const pillarEls = pinnedEl!.querySelectorAll('.service-pillar');
			const totalPillars = pillarEls.length;

			// Master timeline — scrubbed across 600vh
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: outerEl,
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.8,
					pin: pinnedEl,
					onUpdate: (self) => {
						// Track active pillar from scroll progress
						const progress = self.progress;
						const newActive = Math.min(
							Math.floor(progress * totalPillars),
							totalPillars - 1
						);
						if (newActive !== activePillar) {
							activePillar = newActive;
						}

						// Show/hide progress based on pin state
						showProgress = self.isActive;
					}
				}
			});

			if (tl.scrollTrigger) {
				scrollTriggerInstance = tl.scrollTrigger as unknown as ScrollTrigger;
			}

			// Build per-pillar chapters
			pillarEls.forEach((pillarEl, index) => {
				const ghost = pillarEl.querySelector('.pillar-ghost');
				const number = pillarEl.querySelector('.pillar-number');
				const words = pillarEl.querySelectorAll('.tagline-word');
				const desc = pillarEl.querySelector('.pillar-description');
				const bullets = pillarEl.querySelectorAll('.pillar-bullet');
				const isLast = index === totalPillars - 1;

				const label = `pillar-${index}`;

				// --- ENTER ---
				tl.addLabel(label);

				// Ghost number scales in
				tl.fromTo(
					ghost,
					{ opacity: 0, scale: 0.8 },
					{ opacity: 0.06, scale: 1, duration: 5, ease: 'none' },
					label
				);

				// Pillar container fades in
				tl.fromTo(
					pillarEl,
					{ opacity: 0 },
					{ opacity: 1, duration: 5, ease: 'none' },
					label
				);

				// Small number fades up
				tl.fromTo(
					number,
					{ opacity: 0, y: 12 },
					{ opacity: 1, y: 0, duration: 4, ease: 'power2.out' },
					`${label}+=2`
				);

				// Tagline words: opacity + font-weight thicken (the signature moment)
				tl.fromTo(
					words,
					{ opacity: 0.15, fontWeight: 400 },
					{
						opacity: 1,
						fontWeight: 700,
						duration: 6,
						ease: 'none',
						stagger: { each: 0.8 }
					},
					`${label}+=4`
				);

				// Description paragraph fades up
				tl.fromTo(
					desc,
					{ opacity: 0, y: 20 },
					{ opacity: 1, y: 0, duration: 6, ease: 'power2.out' },
					`${label}+=14`
				);

				// Bullets stagger in
				tl.fromTo(
					bullets,
					{ opacity: 0, x: -8 },
					{
						opacity: 1,
						x: 0,
						duration: 5,
						ease: 'power2.out',
						stagger: { each: 1 }
					},
					`${label}+=18`
				);

				// --- HOLD --- (reading time)
				const holdDuration = isLast ? 12 : 8;
				tl.to({}, { duration: holdDuration }, `${label}+=28`);

				// --- EXIT ---
				const exitLabel = `${label}-exit`;
				tl.addLabel(exitLabel, `${label}+=38`);

				tl.to(
					pillarEl,
					{ opacity: 0, y: -30, duration: 8, ease: 'power2.in' },
					exitLabel
				);

				tl.to(
					ghost,
					{ opacity: 0, scale: 1.05, duration: 8, ease: 'none' },
					exitLabel
				);

				if (!isLast) {
					// Gap before next pillar
					tl.to({}, { duration: 3 }, `${exitLabel}+=8`);
				} else {
					// Last pillar: hold blank after fade so unpin is invisible
					tl.to({}, { duration: 5 }, `${exitLabel}+=8`);
				}
			});

			timeline = tl;
		};

		init();
	});

	onDestroy(() => {
		if (scrollTriggerInstance) {
			scrollTriggerInstance.kill();
			scrollTriggerInstance = null;
		}
		if (timeline) {
			timeline.kill();
			timeline = null;
		}
	});
</script>

{#if reducedMotion}
	<!-- Reduced motion: static vertical stack -->
	<section id="services" class="services-static">
		<div class="services-static-inner">
			<span class="label">What we build</span>
			{#each services as service}
				<ServicePillar
					number={service.number}
					tagline={service.tagline}
					description={service.description}
					bullets={service.bullets}
					static={true}
				/>
			{/each}
		</div>
	</section>
{:else}
	<!-- Scroll-driven pinned experience -->
	<section id="services" class="services-outer" bind:this={outerEl}>
		<div class="services-pinned" bind:this={pinnedEl}>
			<span class="label">What we build</span>

			<div class="pillar-viewport">
				{#each services as service}
					<ServicePillar
						number={service.number}
						tagline={service.tagline}
						description={service.description}
						bullets={service.bullets}
					/>
				{/each}
			</div>
		</div>
	</section>

	{#if showProgress}
		<ServiceProgress total={services.length} current={activePillar} />
	{/if}
{/if}

<style>
	/* Scroll spacer — 480vh for 6 pillars */
	.services-outer {
		height: 480vh;
		position: relative;
		z-index: 1;
		background-color: var(--color-surface-warm);
	}

	/* Pinned viewport — 100vh, pinned by GSAP */
	.services-pinned {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		padding-top: 3rem;
		background-color: var(--color-surface-warm);
	}

	/* Pillar viewport — holds all absolute-positioned pillar slides */
	.pillar-viewport {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	/* Label — persistent wayfinding */
	.label {
		display: block;
		font-family: var(--font-sans);
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: var(--letter-spacing-label);
		padding-inline: 1rem;
		max-width: var(--content-max);
		margin-inline: auto;
		width: 100%;
	}

	@media (min-width: 40rem) {
		.label {
			padding-inline: 1.5rem;
		}
	}

	@media (min-width: 64rem) {
		.label {
			padding-inline: 2rem;
		}
	}

	/* Reduced motion static layout */
	.services-static {
		background-color: var(--color-surface-warm);
		padding: clamp(12rem, 15vw, 18rem) 0;
	}

	.services-static-inner {
		max-width: var(--content-max);
		margin-inline: auto;
		padding-inline: 1rem;
	}

	@media (min-width: 40rem) {
		.services-static-inner {
			padding-inline: 1.5rem;
		}
	}

	@media (min-width: 64rem) {
		.services-static-inner {
			padding-inline: 2rem;
		}
	}

	.services-static .label {
		margin-bottom: 3rem;
		padding-inline: 0;
	}
</style>
