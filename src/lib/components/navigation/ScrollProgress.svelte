<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { initGSAP } from '$lib/utils/gsap';

  let progress = $state(0);
  let scrollTriggerInstance: ScrollTrigger | null = null;

  // Type for ScrollTrigger (will be defined at runtime)
  type ScrollTrigger = {
    kill: () => void;
    progress: number;
  };

  onMount(async () => {
    if (!browser) return;

    const gsap = await initGSAP();
    if (!gsap) return;

    // Import ScrollTrigger for creating instance
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    // Create scroll progress tracker bound to full document height
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress = self.progress;
      }
    }) as ScrollTrigger;
  });

  onDestroy(() => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
  });
</script>

<div
  class="fixed left-0 top-0 z-[60] h-px bg-primary opacity-40"
  style="width: {progress * 100}%"
  role="progressbar"
  aria-valuenow={Math.round(progress * 100)}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Reading progress"
></div>
