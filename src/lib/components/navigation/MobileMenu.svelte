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

  let menuRef: HTMLElement | undefined = $state(undefined);

  // Get transition duration based on reduced motion preference
  function getTransitionDuration(): number {
    if (!browser) return 200;
    return prefersReducedMotion() ? 0 : 200;
  }

  // Focus trap: keep Tab cycling inside the open menu
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
      return;
    }

    if (event.key === 'Tab' && isOpen && menuRef) {
      const focusable = menuRef.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // Auto-focus close button when menu opens
  $effect(() => {
    if (isOpen && menuRef) {
      const closeBtn = menuRef.querySelector<HTMLElement>('button');
      closeBtn?.focus();
    }
  });

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
    bind:this={menuRef}
  >
    <!-- Close button -->
    <div class="flex justify-end p-6">
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center text-text hover:text-text-muted"
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
    <div class="flex flex-1 flex-col items-center justify-center gap-4">
      <span class="flex min-h-11 items-center"><NavLink href="#work" onclick={handleLinkClick}>Work</NavLink></span>
      <span class="flex min-h-11 items-center"><NavLink href="#services" onclick={handleLinkClick}>Services</NavLink></span>
      <span class="flex min-h-11 items-center"><NavLink href="#about" onclick={handleLinkClick}>About</NavLink></span>
      <span class="flex min-h-11 items-center"><NavLink href="#contact" onclick={handleLinkClick}>Contact</NavLink></span>
    </div>
  </nav>
{/if}
