<script lang="ts">
  import type { Snippet } from 'svelte';
  import { page } from '$app/stores';

  interface Props {
    href: string;
    children: Snippet;
    onclick?: () => void;
  }

  let { href, children, onclick }: Props = $props();

  // Detect active state based on current URL hash
  let isActive = $derived(
    $page.url.hash === href ||
    (href === '/' && !$page.url.hash)
  );
</script>

<a
  {href}
  class="nav-link font-sans text-sm uppercase tracking-wide text-text transition-colors duration-200 hover:text-primary"
  class:active={isActive}
  aria-current={isActive ? 'page' : undefined}
  onclick={onclick}
>
  {@render children()}
</a>

<style>
  .nav-link {
    position: relative;
    padding-bottom: 0.125rem;
  }

  .nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 1px;
    background-color: var(--color-primary);
    transition: width 200ms ease-out;
  }

  .nav-link:hover::after,
  .nav-link.active::after {
    width: 100%;
  }

  .nav-link.active {
    color: var(--color-primary);
  }

  .nav-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: 2px;
  }
</style>
