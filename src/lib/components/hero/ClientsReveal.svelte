<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { prefersReducedMotion } from '$lib/utils/motion';

  let sectionEl: HTMLElement | undefined = $state();
  let reducedMotion = $state(false);
  let scrollTriggerInstance: { kill: () => void } | null = null;

  onMount(async () => {
    if (!browser) return;

    reducedMotion = prefersReducedMotion();
    if (reducedMotion || !sectionEl) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const track = sectionEl.querySelector('.ticker-track');
    if (!track) return;

    gsap.set(track, { autoAlpha: 0, y: 16 });

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: sectionEl,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(track, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out'
        });
      },
      onLeaveBack: () => {
        gsap.to(track, {
          autoAlpha: 0,
          y: 16,
          duration: 0.35,
          ease: 'power2.in'
        });
      }
    });
  });

  onDestroy(() => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
  });

  const clients = [
    { name: 'Nike', alt: 'Nike logo', src: '/images/clients/nike.png' },
    { name: 'Sprite', alt: 'Sprite logo', src: '/images/clients/sprite.svg' },
    { name: 'BMW', alt: 'BMW logo', src: '/images/clients/bmw.svg' },
    { name: 'Sennheiser', alt: 'Sennheiser logo', src: '/images/clients/sennheiser.svg' },
    { name: 'Jimmy Choo', alt: 'Jimmy Choo logo', src: '/images/clients/jimmy-choo.svg' },
    { name: 'QLD Government', alt: 'Queensland Government logo', src: '/images/clients/qld-government.svg' },
    { name: 'Sennheiser', alt: 'Sennheiser logo', src: '/images/clients/senn-2.svg' },
    { name: 'Verizon', alt: 'Verizon logo', src: '/images/clients/verizon.svg' }
  ];
</script>

<section
  class="logo-strip"
  class:is-reduced={reducedMotion}
  bind:this={sectionEl}
  aria-label="Clients we've worked with"
>
  {#if reducedMotion}
    <div class="static-grid">
      {#each clients as client}
        <img class="logo-img" src={client.src} alt={client.alt} loading="lazy" />
      {/each}
    </div>
  {:else}
    <div class="ticker">
      <div class="ticker-track">
        {#each { length: 2 } as _, copy}
          {#each clients as client}
            <div class="ticker-item" aria-hidden={copy === 1 ? 'true' : undefined}>
              <img class="logo-img" src={client.src} alt={client.alt} loading="lazy" />
            </div>
          {/each}
        {/each}
      </div>
    </div>
  {/if}
</section>

<style>
  .logo-strip {
    padding-block: 4rem 3rem;
    background: var(--color-surface);
    position: relative;
    z-index: 90;
    overflow: hidden;
  }

  /* --- Ticker (animated) --- */
  .ticker {
    position: relative;
    mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0%,
      black 8%,
      black 92%,
      transparent 100%
    );
  }

  .ticker-track {
    display: flex;
    align-items: center;
    gap: 4rem;
    width: max-content;
    animation: ticker-scroll 35s linear infinite;
  }

  .logo-strip:hover .ticker-track {
    animation-play-state: paused;
  }

  @keyframes ticker-scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  .ticker-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* --- Logo images --- */
  .logo-img {
    max-height: 36px;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: grayscale(1) brightness(0) opacity(0.3);
    transition: filter 0.4s ease;
  }

  .logo-strip:hover .logo-img:hover {
    filter: grayscale(0) brightness(1) opacity(1);
  }

  /* --- Static grid (reduced motion) --- */
  .static-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2.5rem 3.5rem;
    max-width: 1200px;
    margin: 0 auto;
    padding-inline: 2rem;
  }

  /* --- Reduced motion --- */
  @media (prefers-reduced-motion: reduce) {
    .ticker-track {
      animation: none;
    }
  }
</style>
