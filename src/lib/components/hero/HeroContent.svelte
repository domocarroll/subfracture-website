<script lang="ts">
  /**
   * HeroContent — Typographic hero with structural fracture
   *
   * "Culture" and "Studio" as two displaced type masses separated by
   * a hairline rule at the golden ratio. The displacement IS the fracture.
   * Below: tagline and CTAs as quiet marginalia.
   *
   * Entrance: staggered fade-up → rule draws → offset reveals → tagline resolves.
   * Pure HTML/CSS with optional GSAP entrance. No WebGL, no canvas.
   */

  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { prefersReducedMotion } from '$lib/utils/motion';

  let heroEl: HTMLElement | undefined = $state();
  let revealed = $state(false);

  onMount(async () => {
    if (!browser) {
      revealed = true;
      return;
    }

    if (prefersReducedMotion()) {
      revealed = true;
      return;
    }

    const { gsap } = await import('gsap');

    const tl = gsap.timeline({
      delay: 0.3,
      defaults: { ease: 'power3.out' }
    });

    const el = heroEl!;

    // Culture fades up
    tl.fromTo(
      el.querySelector('.hero-culture'),
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1.0 }
    );

    // Rule draws across
    tl.fromTo(
      el.querySelector('.hero-rule'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power2.inOut' },
      '-=0.4'
    );

    // Studio fades up at its offset
    tl.fromTo(
      el.querySelector('.hero-studio'),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 1.0 },
      '-=0.5'
    );

    // Tagline and CTAs resolve
    tl.fromTo(
      el.querySelector('.hero-meta'),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.3'
    );

    revealed = true;
  });
</script>

<div
  class="hero-content"
  class:hero-content--revealed={revealed}
  bind:this={heroEl}
>
  <div class="hero-type">
    <h1 class="hero-culture">Culture</h1>
    <div class="hero-rule" aria-hidden="true"></div>
    <p class="hero-studio">Studio</p>
  </div>

  <div class="hero-meta">
    <p class="hero-tagline">For brands that outgrow campaigns</p>
    <div class="hero-ctas">
      <a href="#contact" class="hero-cta">Start a conversation</a>
      <span class="hero-dot" aria-hidden="true"></span>
      <a href="#work" class="hero-cta">See the work</a>
    </div>
  </div>
</div>

<style>
  .hero-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
    min-height: 100svh;
    padding: 6rem 2rem 4rem;
    max-width: var(--content-wide);
    margin: 0 auto;
  }

  /* --- Type masses --- */

  .hero-type {
    position: relative;
  }

  .hero-culture {
    font-family: var(--font-serif);
    font-size: clamp(3.8rem, 10vw, 8.5rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0;
    /* Reduced motion: visible immediately */
    opacity: 1;
  }

  .hero-studio {
    font-family: var(--font-serif);
    font-size: clamp(3.8rem, 10vw, 8.5rem);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.025em;
    color: var(--color-text);
    margin: 0;
    /* The structural offset — displaced right */
    padding-left: clamp(3rem, 12vw, 14rem);
    opacity: 1;
  }

  /* --- The fracture line --- */

  .hero-rule {
    width: 100%;
    height: 1px;
    background-color: var(--color-text);
    margin: clamp(1rem, 2.5vw, 2rem) 0;
    transform-origin: left center;
    opacity: 0.15;
  }

  /* --- Marginalia --- */

  .hero-meta {
    margin-top: clamp(3rem, 6vw, 5rem);
    padding-left: clamp(3rem, 12vw, 14rem);
    opacity: 1;
  }

  .hero-tagline {
    font-family: var(--font-serif);
    font-style: italic;
    font-size: clamp(1rem, 1.8vw, 1.35rem);
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0 0 1.5rem;
    max-width: 28ch;
  }

  .hero-ctas {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: var(--font-sans);
    font-size: var(--text-sm);
  }

  .hero-cta {
    color: var(--color-text);
    text-decoration: none;
    border-bottom: 1px solid var(--color-primary);
    padding-bottom: 2px;
    transition: color 0.3s ease, border-color 0.3s ease;
  }

  .hero-cta:hover {
    color: var(--color-primary);
  }

  .hero-cta:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: 2px;
  }

  .hero-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: var(--color-primary);
    flex-shrink: 0;
  }

  /* --- GSAP entrance: hide elements before animation --- */

  .hero-content:not(.hero-content--revealed) .hero-culture,
  .hero-content:not(.hero-content--revealed) .hero-studio,
  .hero-content:not(.hero-content--revealed) .hero-meta {
    opacity: 0;
  }

  .hero-content:not(.hero-content--revealed) .hero-rule {
    transform: scaleX(0);
  }

  /* --- Reduced motion: no hidden state --- */

  @media (prefers-reduced-motion: reduce) {
    .hero-content:not(.hero-content--revealed) .hero-culture,
    .hero-content:not(.hero-content--revealed) .hero-studio,
    .hero-content:not(.hero-content--revealed) .hero-meta {
      opacity: 1;
    }

    .hero-content:not(.hero-content--revealed) .hero-rule {
      transform: scaleX(1);
    }
  }

  /* --- Mobile --- */

  @media (max-width: 47.999rem) {
    .hero-content {
      padding: 8rem 1.5rem 3rem;
    }

    .hero-studio {
      padding-left: clamp(1.5rem, 8vw, 3rem);
    }

    .hero-meta {
      padding-left: clamp(1.5rem, 8vw, 3rem);
    }
  }
</style>
