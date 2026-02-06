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
      const tl = gsap.timeline();

      // Phase 1: SVG paths draw in (0 to ~0.6s)
      tl.from('.hero-path', {
        drawSVG: 0,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out'
      });

      // Phase 2: Headline reveal (overlaps SVG by 0.2s)
      // Using .to() because child components start at opacity:0 via CSS
      tl.to('.hero-headline', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, '-=0.2');

      // Phase 3: Tagline
      tl.to('.hero-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power3.out'
      }, '-=0.15');

      // Phase 4: Subline
      tl.to('.hero-subline', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power3.out'
      }, '-=0.1');

      // Phase 5: CTAs fade in
      tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power3.out'
      }, '-=0.1');

      // Phase 6: Carousel fades in last
      tl.to('.hero-carousel', {
        opacity: 1,
        duration: 0.4,
        ease: 'power3.out'
      }, '-=0.2');

      // Parallax: illustration moves slower than scroll
      gsap.to('.hero-bg', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
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

  Layout:
  - hero-bg: Absolute-positioned illustration layer behind everything
  - hero-fg: Relative-positioned foreground with vertically centered text
  - hero-bottom: Absolute-positioned carousel pinned to bottom edge

  Animation sequence (~1s total):
  SVG draw -> headline -> tagline -> subline -> CTAs -> carousel

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
