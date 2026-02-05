<script lang="ts">
  import { slide } from 'svelte/transition';
  import { browser } from '$app/environment';
  import { prefersReducedMotion } from '$lib/utils/motion';
  import NavLink from './NavLink.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }

  let { isOpen, onClose }: Props = $props();

  // Get transition duration based on reduced motion preference
  function getTransitionDuration(): number {
    if (!browser) return 200;
    return prefersReducedMotion() ? 0 : 200;
  }

  // Handle escape key
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }

  // Close menu and call callback
  function handleLinkClick() {
    onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
  <nav
    id="mobile-menu"
    class="fixed inset-0 z-40 flex flex-col bg-surface md:hidden"
    transition:slide={{ duration: getTransitionDuration(), axis: 'y' }}
  >
    <!-- Close button -->
    <div class="flex justify-end p-6">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-text hover:text-primary"
        onclick={onClose}
        aria-label="Close menu"
      >
        <svg
          class="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation links -->
    <div class="flex flex-1 flex-col items-center justify-center gap-8">
      <NavLink href="#work" onclick={handleLinkClick}>Work</NavLink>
      <NavLink href="#services" onclick={handleLinkClick}>Services</NavLink>
      <NavLink href="#about" onclick={handleLinkClick}>About</NavLink>
      <NavLink href="#contact" onclick={handleLinkClick}>Contact</NavLink>
    </div>
  </nav>
{/if}
