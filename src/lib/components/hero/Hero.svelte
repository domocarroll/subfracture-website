<script lang="ts">
  /**
   * Hero — Full-viewport typographic hero
   *
   * No WebGL, no canvas. Pure typography with structural fracture.
   * Static section — no ScrollTrigger pin. The confidence is in the stillness.
   * Scroll naturally transitions to ProblemsSolved via generous bottom spacing.
   */

  import HeroContent from './HeroContent.svelte';
</script>

<section class="hero">
  <HeroContent />
</section>

<style>
  .hero {
    position: relative;
    background-color: var(--color-surface);
    margin-top: -5rem; /* Offset nav height so hero is flush with viewport top */
  }
</style>
