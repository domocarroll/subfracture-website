<script lang="ts">
  import VideoHero from './VideoHero.svelte';
  import HeaderBlock from './HeaderBlock.svelte';
</script>

<section class="hero">
  <VideoHero />
  <HeaderBlock />
</section>

<style>
  .hero {
    position: relative;
    background-color: var(--color-surface);
  }
</style>
