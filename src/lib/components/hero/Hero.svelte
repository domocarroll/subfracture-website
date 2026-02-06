<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  import HeroIllustration from './HeroIllustration.svelte';
  import HeroContent from './HeroContent.svelte';
  import LogoCarousel from './LogoCarousel.svelte';

  let heroSection: HTMLElement;
  let matchMedia: gsap.MatchMedia | null = null;

  onMount(async () => {
    if (!browser) return;

    const { gsap } = await import('gsap');
    const { DrawSVGPlugin } = await import('gsap/DrawSVGPlugin');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

    matchMedia = gsap.matchMedia();

    // Full animation for users without motion preference
    matchMedia.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.15 });

      // Wave 1: Root/growth paths draw first — structural, deliberate
      // Stagger from center: trunk draws first, dendrites radiate outward.
      // 1.0s duration — unhurried, like a scholar's pen on parchment.
      tl.from('.hero-path-root', {
        drawSVG: 0,
        duration: 1.0,
        stagger: { each: 0.07, from: 'center' },
        ease: 'power2.inOut'
      });

      // Wave 2: Circular geometry arcs — mathematical framework appears
      // Stagger from edges: outer arcs draw first, inner last — convergence.
      // Overlaps late root drawing; circ easing for organic circular feel.
      tl.from('.hero-path-arc', {
        drawSVG: 0,
        duration: 0.8,
        stagger: { each: 0.1, from: 'edges' },
        ease: 'circ.out'
      }, '-=0.5');

      // Wave 3: Flowing organic lines — atmosphere and context
      // Begin as arcs are still settling; power3 for flowing motion.
      // Slightly wider stagger (0.06) for individual line distinction.
      tl.from('.hero-path-flow', {
        drawSVG: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out'
      }, '-=0.5');

      // Wave 4: Detail paths — fine dendrites, capillaries, annotation marks
      // Emerge as a soft bloom rather than individually. Tighter stagger (0.015)
      // so they feel like texture appearing rather than sequential drawing.
      tl.from('.hero-path-detail', {
        drawSVG: 0,
        duration: 0.5,
        stagger: 0.015,
        ease: 'power2.out'
      }, '-=0.35');

      // Phase 5: Headline reveal — emerges while illustration is still settling.
      // The headline should feel born from the illustration, not waiting for it.
      // power4.out for dramatic deceleration — like type being struck into place.
      // Using .to() because child components start at opacity:0/translateY(12px) via CSS.
      tl.to('.hero-headline', {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power4.out'
      }, '-=0.5');

      // Phase 6: Tagline — intimate whispered aside following the headline
      // expo.out — sharp initial appearance, then a very long soft tail.
      // The italic text materializes quickly then takes time to fully settle,
      // like a breath after a declaration.
      tl.to('.hero-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'expo.out'
      }, '-=0.3');

      // Phase 7: Subline — gentler deceleration, supporting copy settles quietly
      // power1.out — nearly linear at end, no dramatic stop
      tl.to('.hero-subline', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power1.out'
      }, '-=0.2');

      // Phase 8: CTAs fade in — functional, not dramatic
      // power1.out — same gentle deceleration as subline for cohesion
      tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power1.out'
      }, '-=0.12');

      // Phase 9: Carousel — last element, quiet entrance from below
      // Longer duration, very gentle — this is ambient, not a reveal
      tl.to('.hero-carousel', {
        opacity: 1,
        duration: 0.6,
        ease: 'power1.out'
      }, '-=0.25');

      // Parallax: illustration moves slower than scroll
      gsap.to('.hero-bg', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      return () => {
        tl.kill();
      };
    });

    // Reduced motion: show everything immediately, no animation
    matchMedia.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.hero-path', { drawSVG: '0% 100%' });
      gsap.set(
        ['.hero-headline', '.hero-tagline', '.hero-subline', '.hero-ctas', '.hero-carousel'],
        { opacity: 1, y: 0 }
      );
    });
  });

  onDestroy(() => {
    if (matchMedia) {
      matchMedia.revert();
      matchMedia = null;
    }
  });
</script>

<!--
  Hero: Full-viewport orchestrator composing illustration, content, and carousel.

  Synthesis: B's asymmetric illustration composition + C's layered animation
  timing + A's typography hierarchy and micro-details.

  Layout:
  - hero-bg: Absolute-positioned illustration layer behind everything
  - hero-fg: Relative-positioned foreground with vertically centered text
  - hero-bottom: Absolute-positioned carousel pinned to bottom edge

  Animation sequence (~3.8s total with 0.15s initial delay, heavily layered):

  0.15s     — Breath: contemplative pause before anything moves
  0.15-1.3s — Roots draw from center outward (power2.inOut, 1.0s)
  0.8-1.7s  — Arcs converge from edges inward (circ.out, 0.8s)
  1.2-2.1s  — Flow lines sweep across (power3.out, 0.7s)
  1.7-2.5s  — Detail paths bloom as texture (power2.out, 0.5s, tight stagger)
  2.0-2.7s  — Headline strikes into place (power4.out, 0.65s)
  2.4-2.9s  — Tagline whispers in (expo.out, 0.5s)
  2.7-3.1s  — Subline settles quietly (power1.out, 0.4s)
  2.9-3.3s  — CTAs appear (power1.out, 0.35s)
  3.0-3.6s  — Carousel fades ambient (power1.out, 0.6s)

  Easing philosophy: Each layer has its own character.
  - Roots: power2.inOut (balanced, structural)
  - Arcs: circ.out (organic, circular)
  - Flows: power3.out (sweeping momentum)
  - Details: power2.out (soft bloom)
  - Headline: power4.out (dramatic strike)
  - Tagline: expo.out (sharp then whispered)
  - Supporting: power1.out (gentle, nearly linear)

  The negative margin-top pulls the hero behind the fixed nav so the
  illustration extends full-bleed, while padding-top on hero-fg keeps
  text content visible below the nav.
-->

<section
  class="hero"
  bind:this={heroSection}
>
  <div class="hero-bg">
    <HeroIllustration class="hero-illustration" />
  </div>

  <div class="hero-fg">
    <HeroContent />
  </div>

  <div class="hero-bottom">
    <LogoCarousel />
  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    min-height: 100svh;
    margin-top: -5rem;
    background-color: var(--color-surface);
  }

  /* Background layer: illustration behind everything */
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .hero-bg :global(.hero-illustration) {
    width: 100%;
    max-width: 1200px;
    height: auto;
    opacity: 0.7;
  }

  /* Hide detail paths on mobile for simplification */
  @media (max-width: 48rem) {
    .hero-bg :global(.hero-detail) {
      display: none;
    }
  }

  /* Foreground layer: text content on top, centered vertically */
  .hero-fg {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    min-height: 100svh;
    padding-top: 5rem;
    padding-inline: 1.5rem;
  }

  /* Bottom layer: carousel pinned to bottom edge */
  .hero-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    padding: 1.5rem;
    padding-bottom: 2rem;
  }
</style>
