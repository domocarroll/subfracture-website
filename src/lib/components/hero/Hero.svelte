<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  import HeroCrack from './HeroCrack.svelte';
  import HeroRose from './HeroRose.svelte';
  import HeroContent from './HeroContent.svelte';
  import LogoCarousel from './LogoCarousel.svelte';

  let heroSection: HTMLElement;
  let matchMedia: gsap.MatchMedia | null = null;
  let animateRose = $state(false);

  onMount(async () => {
    if (!browser) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    gsap.registerPlugin(ScrollTrigger);

    matchMedia = gsap.matchMedia();

    // Text reveals start immediately — simultaneous with crack
    matchMedia.add('(prefers-reduced-motion: no-preference)', () => {
      // Trigger rose animation at 0.8s (after crack has started opening)
      const roseTimer = setTimeout(() => { animateRose = true; }, 800);

      const tl = gsap.timeline({ delay: 0.3 });

      tl.to('.hero-headline', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power4.out'
      });

      tl.to('.hero-tagline', {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'expo.out'
      }, '-=0.35');

      tl.to('.hero-subline', {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power1.out'
      }, '-=0.25');

      tl.to('.hero-ctas', {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power1.out'
      }, '-=0.15');

      tl.to('.hero-carousel', {
        opacity: 1,
        duration: 0.6,
        ease: 'power1.out'
      }, '-=0.25');

      // Parallax: crack layer moves slower than scroll
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
        clearTimeout(roseTimer);
        tl.kill();
      };
    });

    // Reduced motion: show everything immediately
    matchMedia.add('(prefers-reduced-motion: reduce)', () => {
      animateRose = true;
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
  Hero: Full-viewport orchestrator composing WebGL crack, content, and carousel.

  The crack is the brand — a deep fissure in the parchment surface revealing
  psychedelic life beneath. Text floats above on the z-index.

  Animation sequence:
  0.0-3.0s  — Crack reveals from center outward (WebGL shader, self-driven)
  1.2-1.9s  — Headline strikes into place (power4.out)
  1.5-2.1s  — Tagline whispers in (expo.out)
  1.8-2.3s  — Subline settles (power1.out)
  2.0-2.4s  — CTAs appear (power1.out)
  2.1-2.7s  — Carousel fades ambient (power1.out)
-->

<section
  class="hero"
  bind:this={heroSection}
>
  <div class="hero-bg">
    <HeroCrack />
  </div>

  <div class="hero-fg">
    <HeroContent />
  </div>

  <div class="hero-right" aria-hidden="true">
    <HeroRose animate={animateRose} class="hero-rose-position" />
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

  /* Background layer: WebGL crack canvas */
  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Foreground layer: text content on top, left-aligned vertically centered */
  .hero-fg {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    min-height: 100svh;
    padding-top: 5rem;
    padding-inline: 1.5rem;
    padding-left: max(2rem, calc((100vw - 1200px) / 2 + 2rem));
  }

  /* Right layer: rose growing from the crack */
  .hero-right {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 80%;
    z-index: 2;
    pointer-events: none;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .hero-right :global(.hero-rose-position) {
    width: 6rem;
    height: auto;
    margin-bottom: 10%;
    margin-right: 5%;
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

  /* Mobile: reset to simpler layout */
  @media (max-width: 47.999rem) {
    .hero-fg {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    .hero-right {
      display: none;
    }
  }
</style>
