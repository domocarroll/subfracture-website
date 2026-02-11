<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  import HeroCrack from './HeroCrack.svelte';
  import HeroContent from './HeroContent.svelte';

  let heroSection: HTMLElement;
  let scrollTriggerInstance: { kill: () => void } | null = null;

  onMount(async () => {
    if (!browser) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.to('.hero-bg', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    scrollTriggerInstance = tween.scrollTrigger as { kill: () => void } | null;
  });

  onDestroy(() => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
  });
</script>

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

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .hero-fg {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    min-height: 100vh;
    min-height: 100svh;
    padding-top: 5rem;
  }

  @media (max-width: 47.999rem) {
    .hero-fg {
      padding-inline: 1.5rem;
    }
  }
</style>
