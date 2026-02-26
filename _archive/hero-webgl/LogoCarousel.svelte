<script lang="ts">
  interface Props {
    class?: string;
  }
  let { class: className = '' }: Props = $props();

  const logos = [
    { name: 'Circle', index: 0 },
    { name: 'Triangles', index: 1 },
    { name: 'Square', index: 2 },
    { name: 'Curve', index: 3 },
    { name: 'Lines', index: 4 },
    { name: 'Diamond', index: 5 },
  ];
</script>

<div class="hero-carousel {className}">
  <span class="logo-carousel__label">Working with</span>

  <div class="logo-carousel" role="marquee" aria-label="Brands we work with">
    {#each [0, 1] as copy}
      {#each logos as logo}
        <div
          class="logo-carousel__item"
          style="--item-index: {logo.index + copy * logos.length}"
          aria-hidden={copy === 1 ? 'true' : undefined}
        >
          {#if logo.index === 0}
            <!-- Circle with line -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <circle cx="20" cy="20" r="14" stroke="currentColor" stroke-width="1.5" />
              <line x1="10" y1="20" x2="30" y2="20" stroke="currentColor" stroke-width="1.5" />
            </svg>
          {:else if logo.index === 1}
            <!-- Two overlapping triangles -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <polygon points="20,6 32,28 8,28" stroke="currentColor" stroke-width="1.5" fill="none" />
              <polygon points="20,34 8,12 32,12" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          {:else if logo.index === 2}
            <!-- Square with inner square offset -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <rect x="5" y="5" width="24" height="24" stroke="currentColor" stroke-width="1.5" />
              <rect x="11" y="11" width="24" height="24" stroke="currentColor" stroke-width="1.5" />
            </svg>
          {:else if logo.index === 3}
            <!-- Stylized S curve -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <path
                d="M12 8 C28 8 28 20 20 20 C12 20 12 32 28 32"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                fill="none"
              />
            </svg>
          {:else if logo.index === 4}
            <!-- Three parallel lines -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <line x1="8" y1="12" x2="32" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <line x1="8" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <line x1="8" y1="28" x2="32" y2="28" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          {:else if logo.index === 5}
            <!-- Diamond shape -->
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
              <polygon points="20,4 36,20 20,36 4,20" stroke="currentColor" stroke-width="1.5" fill="none" />
            </svg>
          {/if}
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>
  .hero-carousel {
    width: 100%;
    opacity: 0;
  }

  .logo-carousel__label {
    display: block;
    text-align: center;
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    opacity: 0.5;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .logo-carousel {
    --item-width: 120px;
    --item-height: 40px;
    --duration: 35s;
    --items: 6;
    --gap: 3rem;

    position: relative;
    display: flex;
    overflow-x: hidden;
    height: var(--item-height);
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
  }

  .logo-carousel__item {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--item-width);
    height: var(--item-height);
    color: var(--color-text);
    opacity: 0.3;
    flex-shrink: 0;
    inset-inline-start: calc(100% + var(--gap));
    animation: marquee var(--duration) linear infinite;
    animation-delay: calc(
      var(--duration) / (var(--items) * 2) * var(--item-index) * -1
    );
  }

  .logo-carousel__item svg {
    width: var(--item-height);
    height: var(--item-height);
  }

  @keyframes marquee {
    0% {
      inset-inline-start: calc(100% + var(--gap));
    }
    100% {
      inset-inline-start: calc((var(--item-width) + var(--gap)) * -1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .logo-carousel__item {
      animation-play-state: paused;
      position: static;
      transform: none;
      inset-inline-start: unset;
    }

    .logo-carousel {
      display: flex;
      justify-content: space-evenly;
      mask-image: none;
      -webkit-mask-image: none;
      gap: var(--gap);
      overflow: visible;
    }

    /* Hide duplicate items in static layout */
    .logo-carousel__item:nth-child(n + 7) {
      display: none;
    }
  }
</style>
