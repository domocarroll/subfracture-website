<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { prefersReducedMotion } from '$lib/utils/motion';

  let sectionEl: HTMLElement | undefined = $state();
  let cursorEl: HTMLElement | undefined = $state();
  let cursorVisible = $state(false);
  let cleanup: (() => void) | null = null;
  let qtX: ((value: number) => void) | null = null;
  let qtY: ((value: number) => void) | null = null;

  function handleMouseMove(e: MouseEvent) {
    if (qtX && qtY && cursorEl) {
      qtX(e.clientX - cursorEl.offsetWidth / 2);
      qtY(e.clientY - cursorEl.offsetHeight / 2);
    }
  }

  function handleMouseEnter() {
    cursorVisible = true;
  }

  function handleMouseLeave() {
    cursorVisible = false;
  }

  onMount(async () => {
    if (!browser || !sectionEl || prefersReducedMotion()) return;

    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const watermark = sectionEl.querySelector('.hero__watermark');
    if (!watermark) return;

    gsap.fromTo(
      watermark,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      }
    );

    const st = ScrollTrigger.getAll().at(-1);

    // Smooth cursor with quickTo — buttery 0.3s lag
    if (cursorEl) {
      qtX = gsap.quickTo(cursorEl, 'x', { duration: 0.35, ease: 'power3.out' });
      qtY = gsap.quickTo(cursorEl, 'y', { duration: 0.35, ease: 'power3.out' });
    }

    cleanup = () => {
      st?.kill();
    };
  });

  onDestroy(() => {
    cleanup?.();
  });
</script>

<div class="hero-video" bind:this={sectionEl}>
  <div class="hero__sticky">
    <div
      class="hero__media"
      onmousemove={handleMouseMove}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
      role="presentation"
    >
      <video
        class="hero__video"
        autoplay
        muted
        playsinline
        loop
        preload="metadata"
      >
        <source
          src="https://subfrac.com/wp-content/uploads/2026/01/Subfracture_Sizzle_Reel_MASTER_NoTitles_250916_Corrected.mp4"
          type="video/mp4"
        />
      </video>

      <div class="hero__overlay" aria-hidden="true"></div>
    </div>

    <div class="hero__watermark" aria-hidden="true">
      <img
        src="/subfracture.svg"
        alt=""
        width="1699"
        height="231"
      />
    </div>
  </div>

  <div
    class="hero__cursor"
    class:is-visible={cursorVisible}
    aria-hidden="true"
    bind:this={cursorEl}
  >
    ▶ Sizzle Me
  </div>
</div>

<style>
  .hero-video {
    position: relative;
    height: 75vh;
    overflow: visible;
    z-index: 100;
  }

  .hero__sticky {
    position: sticky;
    top: 0;
    height: 75vh;
    overflow: hidden;
  }

  .hero__media {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 115vh;
    cursor: none;
  }

  .hero__video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero__overlay {
    position: absolute;
    inset: 0;
    backdrop-filter: blur(60px);
    background: rgba(255, 255, 255, 0.65);
    filter: grayscale(1);
    transition: all 0.4s ease;
    z-index: 1;
    pointer-events: none;
  }

  .hero__media:hover .hero__overlay {
    backdrop-filter: blur(0px);
    background: rgba(255, 255, 255, 0);
    filter: grayscale(0);
  }

  .hero__cursor {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    pointer-events: none;
    background: white;
    color: #0b0b0b;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    will-change: transform;
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  .hero__cursor.is-visible {
    opacity: 1;
  }

  .hero__watermark {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(45%);
    pointer-events: none;
    will-change: transform, opacity;
    z-index: 2;
  }

  .hero__watermark img {
    width: 100%;
    padding-inline: 1.5vw;
    display: block;
  }

  @media (prefers-reduced-motion: reduce) {
    .hero__watermark {
      will-change: auto;
      opacity: 1;
    }

    .hero__overlay {
      transition: none;
    }

    .hero__cursor {
      display: none;
    }
  }
</style>
