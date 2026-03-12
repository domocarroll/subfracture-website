<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  let bneTime = $state('--:--');
  let laTime = $state('--:--');
  let interval: ReturnType<typeof setInterval> | null = null;

  function updateClocks() {
    const now = new Date();

    const bne = now.toLocaleTimeString('en-AU', {
      timeZone: 'Australia/Brisbane',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const la = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    bneTime = bne;
    laTime = la;
  }

  onMount(() => {
    if (!browser) return;
    updateClocks();
    interval = setInterval(updateClocks, 1000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<section class="header-block">
  <div class="logo">
    <img src="/subfracture.svg" alt="Subfracture" class="logo-img" />
  </div>

  <div class="nav-placeholder"></div>

  <div class="tagline">Built on Intelligence. Powered by Humans.</div>

  <div class="clocks">
    <span class="clock clock-bne">BRISBANE {bneTime}</span>
    <span class="clock clock-lax">LOS ANGELES {laTime}</span>
  </div>

  <div class="scroll-indicator">(Scroll)</div>
</section>

<style>
  .header-block {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: auto auto;
    gap: 2em;
    height: 25vh;
    padding: 2em;
    background-color: var(--color-surface);
  }

  .header-block > * {
    line-height: 1;
  }

  .logo {
    grid-column: 1;
    grid-row: 1;
    align-self: start;
    justify-self: start;
  }

  .logo-img {
    height: 16px;
    width: auto;
    display: block;
  }

  .nav-placeholder {
    grid-column: 2;
    grid-row: 1;
  }

  .tagline {
    grid-column: 1;
    grid-row: 2;
    align-self: end;
    justify-self: start;
    font-family: var(--font-sans);
    font-size: 0.85rem;
    color: var(--color-text);
    opacity: 0.7;
  }

  .clocks {
    grid-column: 2;
    grid-row: 2;
    align-self: end;
    justify-self: start;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--color-text);
    opacity: 0.5;
    letter-spacing: 0.05em;
  }

  .clock-bne {
    margin-right: 1em;
  }

  .scroll-indicator {
    grid-column: 2;
    grid-row: 2;
    align-self: end;
    justify-self: end;
    font-family: var(--font-sans);
    font-size: 0.75rem;
    color: var(--color-text);
    opacity: 0.4;
    letter-spacing: 0.05em;
  }

  @media (max-width: 48rem) {
    .header-block {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      height: auto;
      min-height: 20vh;
      padding: 1.5em;
      gap: 1em;
    }

    .nav-placeholder {
      display: none;
    }

    .tagline {
      grid-column: 1;
      grid-row: 2;
    }

    .clocks {
      display: none;
    }

    .scroll-indicator {
      grid-column: 1;
      grid-row: 3;
      justify-self: start;
    }
  }
</style>
