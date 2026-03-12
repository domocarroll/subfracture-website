<script lang="ts">
  /**
   * IntroBlock - Bold headline + lede paragraph between Hero and ClientsReveal
   *
   * Matches v1's intro-block: "Strategic Creative Design Technology" H1,
   * supporting lede, animated purple orb glow in background.
   */
</script>

<section class="intro-block">
  <div class="intro-block__orb" aria-hidden="true"></div>

  <div class="intro-block__content">
    <h1 class="intro-block__heading">
      Strategic Creative Design Technology
    </h1>
    <p class="intro-block__lede">
      Outshine trends and leave bland for dead. We architect brand worlds that feel inevitable — because when the culture fits, the brand grows itself.
    </p>
  </div>
</section>

<style>
  .intro-block {
    position: relative;
    z-index: 95;
    background: var(--color-surface);
    padding: clamp(6rem, 12vh, 10rem) 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .intro-block__content {
    position: relative;
    z-index: 1;
    max-width: 56.25rem;
    text-align: center;
  }

  .intro-block__heading {
    font-family: var(--font-serif);
    font-size: clamp(2rem, 6vw, 6.5rem);
    font-weight: 300;
    color: var(--color-text);
    line-height: 1.05;
    letter-spacing: -0.02em;
    margin: 0 0 2rem;
  }

  .intro-block__lede {
    font-family: var(--font-sans);
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    color: var(--color-text);
    opacity: 0.7;
    line-height: 1.6;
    max-width: 48ch;
    margin: 0 auto;
  }

  .intro-block__orb {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 400px;
    height: 400px;
    translate: -50% -50%;
    background: radial-gradient(circle, rgba(125, 84, 255, 0.08) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    animation: orb-drift 8s ease-in-out infinite alternate;
  }

  @keyframes orb-drift {
    0% {
      transform: translate(-30px, -20px);
    }
    100% {
      transform: translate(30px, 20px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .intro-block__orb {
      animation: none;
    }
  }
</style>
