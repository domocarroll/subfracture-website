<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { initGSAP } from '$lib/utils/gsap';
  import { prefersReducedMotion } from '$lib/utils/motion';
  import NavLink from './NavLink.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import ScrollProgress from './ScrollProgress.svelte';

  // State
  let isMenuOpen = $state(false);
  let isNavVisible = $state(false);
  let isPastHero = $state(false);
  let scrollY = $state(0);
  let hasScrolled = $state(false);
  let hasInitialized = false;

  // ScrollTrigger reference for cleanup
  let scrollTriggerInstance: { kill: () => void } | null = null;

  // Computed styles based on state
  let navTransform = $derived(isNavVisible ? 'translateY(0)' : 'translateY(-100%)');
  let transitionDuration = $derived(
    browser && prefersReducedMotion() ? '0ms' : '200ms'
  );

  // Track scroll position for shadow
  $effect(() => {
    hasScrolled = scrollY > 10;
  });

  onMount(async () => {
    if (!browser) return;

    const gsap = await initGSAP();
    if (!gsap) return;

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');

    const heroEl = document.querySelector('.hero');
    const heroHeight = heroEl ? heroEl.getBoundingClientRect().height : window.innerHeight * 0.75;

    // Create ScrollTrigger for direction detection
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        // Stay hidden until past the hero section
        if (currentScroll < heroHeight) {
          isPastHero = false;
          isNavVisible = false;
          hasInitialized = false;
          return;
        }

        isPastHero = true;

        // Don't hide until user has actually scrolled meaningfully past hero
        if (!hasInitialized) {
          isNavVisible = true;
          hasInitialized = true;
          return;
        }

        // direction: 1 = down, -1 = up
        if (self.direction === 1) {
          isNavVisible = false;
        } else if (self.direction === -1) {
          isNavVisible = true;
        }
      }
    });
  });

  onDestroy(() => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
  });

  // Handle escape key for mobile menu
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isMenuOpen) {
      isMenuOpen = false;
    }
  }

  // Close mobile menu
  function closeMenu() {
    isMenuOpen = false;
  }

  // Toggle mobile menu
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
</script>

<svelte:window bind:scrollY onkeydown={handleKeydown} />

<!-- Navigation Header -->
<header
  class="fixed left-0 right-0 top-0 z-50 transition-[transform,box-shadow]"
  style:background="rgba(255, 255, 255, 0.78)"
  style:backdrop-filter="blur(6px)"
  style:-webkit-backdrop-filter="blur(6px)"
  class:shadow-sm={hasScrolled}
  style="transform: {navTransform}; transition-duration: {transitionDuration};"
>
  <!-- Scroll Progress Indicator -->
  <ScrollProgress />
  <nav class="mx-auto flex max-w-[75rem] items-center justify-between px-6 py-4 lg:px-8">
    <!-- Logo / Wordmark -->
    <a href="/" class="nav-logo" aria-label="Subfracture — home">
      <img src="/subfracture.svg" alt="Subfracture" class="nav-logo-img" />
    </a>

    <!-- Desktop Navigation -->
    <div class="hidden items-center gap-8 md:flex">
      <NavLink href="#work">Work</NavLink>
      <NavLink href="#services">Services</NavLink>
      <NavLink href="#about">About</NavLink>
      <NavLink href="#contact">Contact</NavLink>
    </div>

    <!-- Mobile Menu Toggle -->
    <button
      type="button"
      class="flex min-h-11 min-w-11 items-center justify-center text-text hover:text-text-muted md:hidden"
      onclick={toggleMenu}
      aria-expanded={isMenuOpen}
      aria-controls="mobile-menu"
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    >
      <svg
        class="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {#if isMenuOpen}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 18L18 6M6 6l12 12"
          />
        {:else}
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 6h16M4 12h16M4 18h16"
          />
        {/if}
      </svg>
    </button>
  </nav>
</header>

<!-- Mobile Menu -->
<MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />

<style>
  .nav-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    flex-shrink: 0;
  }

  .nav-logo:focus-visible {
    outline: 2px solid var(--color-text);
    outline-offset: 4px;
    border-radius: 2px;
  }

  .nav-logo-img {
    height: 18px;
    width: auto;
    display: block;
  }
</style>
